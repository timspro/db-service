import { Firestore } from "@google-cloud/firestore"
import * as util from "@tim-code/firestore-util"
import { Script } from "vm"

const db = new Firestore()

export async function query({ collection, options: { ids, ...options } = {} }) {
  const snapshot = await util.query(db, collection, options)
  return snapshot.map((doc) => (ids ? doc.id : doc.data()))
}

export const cached = query

function toFunction(string, context) {
  if (string) {
    return new Script(string).runInNewContext(context)
  }
  return undefined
}

export function copy({ collection, dest, name, transform, context, options }) {
  name = toFunction(name, context)
  transform = toFunction(transform, context)
  return util.copy(db, collection, dest, { ...options, name, transform })
}

export function move({ collection, dest, name, transform, context, options }) {
  name = toFunction(name, context)
  transform = toFunction(transform, context)
  return util.move(db, collection, dest, { ...options, name, transform })
}

export function remove({ collection, options }) {
  return util.remove(db, collection, options)
}

export function insert({ collection, data, options }) {
  return util.insert(db, collection, data, options)
}

export function update({ collection, transform, context, options }) {
  transform = toFunction(transform, context)
  return util.update(db, collection, { ...options, transform })
}
