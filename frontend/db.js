import * as command from "@tim-code/browser-command"

const run = command.factory(import.meta.url, { type: "request", defaults: { method: "GET" } })

const cachePromises = {}
;(async () => {
  try {
    const registration = await navigator.serviceWorker.register("db-service-worker.js", {
      scope: "/db/",
    })
    if (registration.installing) {
      console.log("service worker installing")
    } else if (registration.waiting) {
      console.log("service worker installed")
    } else if (registration.active) {
      console.log("service worker active")
    }
  } catch (error) {
    console.error(`registration failed with ${error}`)
  }
  // navigator.serviceWorker.addEventListener("message", ({ data }) => {
  //   debugger
  //   const { uuid, response } = data
  //   // eslint-disable-next-line no-console
  //   console.log(`received: ${response}`)
  //   cachePromises[uuid](response)
  // })
})()

export async function query(collection, { silent = false, cache = false, ...options } = {}) {
  if (cache === true) {
    cache = 3600
  }
  if (typeof options === "number") {
    options = { limit: options }
  }
  // if (cache) {
  //   console.log("using cache")
  //   const uuid = uuidv4()
  //   const { active } = await navigator.serviceWorker.ready
  //   debugger
  //   active.postMessage(JSON.stringify({ uuid, collection, options }))
  //   return new Promise((resolve) => {
  //     cachePromises[uuid] = resolve
  //   })
  // }
  const result = await run(
    cache ? "cached" : "query",
    { body: { collection, options } },
    { silent }
  )
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
