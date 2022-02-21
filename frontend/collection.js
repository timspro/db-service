import { storage } from "@tim-code/browser-util"
import * as db from "./db.js"

const LOOKUP = "db.collection"

export function collection(string) {
  let name
  if (string) {
    storage.set(LOOKUP, name)
    name = string
  } else {
    name = storage.get(LOOKUP)
    if (!name) {
      throw new Error("no module has been specified yet")
    }
  }
  return new Proxy(db, {
    get:
      (object, method) =>
      (...args) =>
        method === "name" ? name : object[method](name, ...args),
  })
}
