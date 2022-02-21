import * as command from "@tim-code/browser-command"

const run = command.factory(import.meta.url)

export function query(collection, options = {}) {
  if (typeof options === "number") {
    options = { limit: options }
  }
  return run("query", { collection, options })
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

export function insert(collection, data, options = {}) {
  return run("insert", { collection, data, options })
}

export function remove(collection, options) {
  return run("remove", { collection, options })
}

export function rm(collection, where, options) {
  return remove(collection, { ...options, where })
}

function toString(thing) {
  if (thing) {
    return thing.toString()
  }
  return undefined
}

export function copy(collection, dest, { transform, name, context, ...options }) {
  transform = toString(transform)
  name = toString(name)
  return run("copy", { collection, dest, transform, name, context, options })
}

export function cp(collection, where, options) {
  return copy(collection, { ...options, where })
}

export function move(collection, dest, { transform, name, context, ...options }) {
  transform = toString(transform)
  name = toString(name)
  return run("move", { collection, dest, transform, name, context, options })
}

export function mv(collection, where, options) {
  return move(collection, { ...options, where })
}

export function update(collection, { transform, context, ...options }) {
  transform = toString(transform)
  return run("update", { collection, transform, context, options })
}
