import PouchDB from 'pouchdb'
import PouchDBFind from 'pouchdb-find'
import { name } from '../../../package.json'

PouchDB.plugin(PouchDBFind)

const db = new PouchDB(name)

db.setup = async () => {
  await db.createIndex({
    index: {
      partial_filter_selector: {
        _id: {
          $regex: '^bookmark:.+$'
        }
      },
      fields: ['tags']
    },
    ddoc: 'bookmark-tag-search'
  })
}

export default db
