import { Firestore } from "@google-cloud/firestore"
import { autotest } from "@tim-code/autotest"
import * as util from "@tim-code/firestore-util"
import { copy, insert, move, query, remove, update } from "./db.js"

const db = new Firestore()

const SANDBOX = "sandbox-test"
const CLEAN = "clean-test"

const data = [
  { name: "a", count: 1 },
  { name: "b", count: 2 },
]

beforeEach(async () => {
  await util.remove(db, SANDBOX, { where: [] })
  await util.insert(
    db,
    SANDBOX,
    data.map((object) => [object.name, object])
  )
  await util.remove(db, CLEAN, { where: [] })
})

autotest(query)(SANDBOX, { silent: true })(data)

const queryAfter = { timeout: 10000, after: () => util.query(db, SANDBOX).then(util.unbox) }

const inserted = { name: "c", count: 3 }
autotest(insert, queryAfter)(SANDBOX, [[inserted.name, inserted]], { silent: true })(
  data.concat([inserted])
)

autotest(remove, queryAfter)(SANDBOX, { where: [], silent: true })([])

autotest(update, queryAfter)(SANDBOX, {
  where: [],
  transform: ({ count }) => ({ count: count + 1 }),
  silent: true,
})(data.map(({ count, ...props }) => ({ ...props, count: count + 1 })))

const queryBothAfter = {
  timeout: 10000,
  after: async () => [
    await util.query(db, SANDBOX).then(util.unbox),
    await util.query(db, CLEAN).then(util.unbox),
  ],
}

autotest(copy, queryBothAfter)(SANDBOX, CLEAN, { where: [], silent: true })([data, data])

autotest(move, queryBothAfter)(SANDBOX, CLEAN, { where: [], silent: true })([[], data])

async function cacheSetup() {
  await query(SANDBOX, { silent: true, cache: true })
  await util.insert(db, SANDBOX, [[inserted.name, inserted]])
  const elements = await util.query(db, SANDBOX).then(util.unbox)
  expect(elements.length).toBe(3)
}
autotest(query, { setup: cacheSetup, only: true })(SANDBOX, { silent: true, cache: true })(
  data
)
