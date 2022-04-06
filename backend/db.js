import { Firestore } from "@google-cloud/firestore"
import * as util from "@tim-code/firestore-util"
import etag from "etag"
import { Script } from "vm"

const db = new Firestore()

function send(response, result) {
  response.json({ result })
}

export async function query(request, response) {
  const args = { ...request.body, ...request.query }
  const hash = etag(JSON.stringify(args))
  if (request.get("If-None-Match") === hash) {
    response.sendStatus(304)
  } else {
    const { collection, options: { ids, ...options } = {} } = args
    const snapshot = await util.query(db, collection, options)
    response.setHeader("ETag", hash)
    response.setHeader("Vary", "ETag")
    send(
      response,
      snapshot.map((doc) => (ids ? doc.id : doc.data()))
    )
  }
}

function toFunction(string, context) {
  if (string) {
    return new Script(string).runInNewContext(context)
  }
  return undefined
}

export async function copy(request, response) {
  let { collection, dest, name, transform, context, options } = {
    ...request.body,
    ...request.query,
  }
  name = toFunction(name, context)
  transform = toFunction(transform, context)
  send(response, await util.copy(db, collection, dest, { ...options, name, transform }))
}

export async function move(request, response) {
  let { collection, dest, name, transform, context, options } = {
    ...request.body,
    ...request.query,
  }
  name = toFunction(name, context)
  transform = toFunction(transform, context)
  send(response, await util.move(db, collection, dest, { ...options, name, transform }))
}

export async function remove(request, response) {
  const { collection, options } = {
    ...request.body,
    ...request.query,
  }
  send(response, await util.remove(db, collection, options))
}

export async function insert(request, response) {
  const { collection, data, options } = {
    ...request.body,
    ...request.query,
  }
  send(response, await util.insert(db, collection, data, options))
}

export async function update(request, response) {
  let { collection, transform, context, options } = {
    ...request.body,
    ...request.query,
  }
  transform = toFunction(transform, context)
  send(response, await util.update(db, collection, { ...options, transform }))
}
