import * as command from "@tim-code/browser-command"

const run = command.factory(import.meta.url)

const runRequest = command.factory(import.meta.url, { method: "request" })

export function query(collection, { silent = false, cache = false, ...options } = {}) {
  if (typeof options === "number") {
    options = { limit: options }
  }
  cache = cache === true && "default"
  cache = cache || "no-store" // "reload" stores for future use
  return runRequest("query", { body: { collection, options }, cache }, { silent })
}

export function q(collection, where, options) {
  if (typeof where === "number") {
    return query(collection, where)
  }
  if (typeof options === "number") {
    options = { limit: options }
  }
  return query(collection, { ...options, where })
}

export function insert(collection, data, { silent = false, ...options } = {}) {
  return run("insert", { collection, data, options }, { silent })
}

export function remove(collection, { silent = false, ...options } = {}) {
  return run("remove", { collection, options }, { silent })
}

export function rm(collection, where, { silent = false, ...options } = {}) {
  return remove(collection, { ...options, where }, { silent })
}

function toString(thing) {
  if (thing) {
    return thing.toString()
  }
  return undefined
}

export function copy(
  collection,
  dest,
  { transform, name, context, silent = false, ...options }
) {
  transform = toString(transform)
  name = toString(name)
  return run("copy", { collection, dest, transform, name, context, options }, { silent })
}

export function cp(collection, where, options) {
  return copy(collection, { ...options, where })
}

export function move(
  collection,
  dest,
  { transform, name, context, silent = false, ...options }
) {
  transform = toString(transform)
  name = toString(name)
  return run("move", { collection, dest, transform, name, context, options }, { silent })
}

export function mv(collection, where, options) {
  return move(collection, { ...options, where })
}

export function update(collection, { transform, context, silent = false, ...options }) {
  transform = toString(transform)
  return run("update", { collection, transform, context, options }, { silent })
}
