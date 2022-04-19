import { Firestore } from "@google-cloud/firestore"
import * as util from "@tim-code/firestore-util"
import etag from "etag"
import { Script } from "vm"

function getParameters(request) {
  return {
    ...request.query,
    ...request.body,
  }
}

function respond(response, result) {
  response.json({ result })
}

const db = new Firestore()
export async function query(request, response) {
  const parameters = getParameters(request)
  let { collection, options = {} } = parameters
  if (typeof options === "string") {
    options = JSON.parse(options)
  }
  const hash = etag(JSON.stringify(parameters))
  if (request.method === "GET" && request.get("If-None-Match") === hash) {
    response.send(304)
    return
  }
  const { ids, ...queryOptions } = options
  const snapshot = await util.query(db, collection, queryOptions)
  const result = snapshot.map((doc) => (ids ? doc.id : doc.data()))
  if (request.method === "GET") {
    response.setHeader("ETag", hash)
    response.setHeader("Cache-Control", "private, max-age=3600")
  }
  respond(response, result)
}

function toFunction(string, context) {
  if (string) {
    return new Script(string).runInNewContext(context)
  }
  return undefined
}

export async function copy(request, response) {
  let { collection, dest, name, transform, context, options } = getParameters(request)
  name = toFunction(name, context)
  transform = toFunction(transform, context)
  const result = await util.copy(db, collection, dest, { ...options, name, transform })
  respond(response, result)
}

export async function move(request, response) {
  let { collection, dest, name, transform, context, options } = getParameters(request)
  name = toFunction(name, context)
  transform = toFunction(transform, context)
  const result = await util.move(db, collection, dest, { ...options, name, transform })
  respond(response, result)
}

export async function remove(request, response) {
  const { collection, options } = getParameters(request)
  const result = await util.remove(db, collection, options)
  respond(response, result)
}

export async function insert(request, response) {
  const { collection, data, options } = getParameters(request)
  const result = await util.insert(db, collection, data, options)
  respond(response, result)
}

export async function update(request, response) {
  let { collection, transform, context, options } = getParameters(request)
  transform = toFunction(transform, context)
  const result = await util.update(db, collection, { ...options, transform })
  respond(response, result)
}
