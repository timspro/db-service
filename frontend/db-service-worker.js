/* eslint-disable no-console */
const CACHE_VERSION = 1
const CACHE_NAME = `db-service-worker-${CACHE_VERSION}`

// self.addEventListener("activate", function (event) {
//   event.waitUntil(
//     caches.keys().then(function (cacheNames) {
//       return Promise.all(
//         cacheNames.map(function (cacheName) {
//           if (cacheName !== CACHE_NAME) {
//             console.log("Deleting out of date cache:", cacheName)
//             return caches.delete(cacheName)
//           }
//         })
//       )
//     })
//   )
// })

// could try deleting old entries
const LOG = true

async function handleFetch(request) {
  if (LOG) {
    console.log(`fetching: ${request.url}`)
  }
  console.log(`fetching: ${new URL(request.url).pathname}`)
  const cached = new URL(request.url).pathname === "/db/cached"
  // const { uuid } = JSON.parse(request.body)
  let cache
  if (cached) {
    cache = await caches.open(CACHE_NAME)
    const response = await cache.match(request)
    if (response) {
      if (LOG) {
        console.log("found response in cache")
      }
      return response
    }
  }
  const fresh = await fetch(request.clone())
  if (cached) {
    if (fresh.status < 400) {
      if (LOG) {
        console.log("placing response in cache")
      }
      cache.put(request, fresh.clone())
    }
  }
  return fresh
}

self.addEventListener("fetch", (event) => {
  event.respondWith(handleFetch(event.request))
})

self.addEventListener("install", () => {
  console.log("SW: service worker installed")
})

self.addEventListener("activate", () => {
  console.log("SW: service worker activated")
})
