import * as command from "@tim-code/browser-command"

const run = command.factory(import.meta.url)

const memory = new Map()

export async function query(collection, { silent = false, cache = false, ...options } = {}) {
  if (cache === true) {
    cache = 3600
  }
  if (typeof options === "number") {
    options = { limit: options }
  }
  const clauses = { collection, options }
  const hash = JSON.stringify(clauses)
  if (typeof cache === "number") {
    const found = memory.get(hash)
    if (found) {
      const age = (Date.now() - found.timestamp) / 1000
      if (age < cache) {
        if (!silent) {
          // eslint-disable-next-line no-console
          console.log(found.result)
        }
        return found.result
      }
    }
  }
  const result = await run("query", clauses, { silent })
  if (typeof cache === "number") {
    memory.set(hash, { timestamp: Date.now(), result })
  }
  return result
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
