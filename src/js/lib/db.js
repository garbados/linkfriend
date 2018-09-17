/* global emit */

import PouchDB from 'pouchdb'
import PouchDBFind from 'pouchdb-find'
import { name } from '../../../package.json'
import isEqual from 'lodash.isequal'

import log from './log'

PouchDB.plugin(PouchDBFind)

const designTags = {
  _id: '_design/tags',
  views: {
    listTags: {
      map: function (doc) {
        if (doc.tags && doc.tags.length) {
          doc.tags.forEach(emit)
        }
      }.toString(),
      reduce: '_count'
    }
  }
}

PouchDB.plugin({
  setup: async function () {
    // add mango indexes
    await this.createIndex({
      index: {
        // TODO partial filter selector, once implemented: https://github.com/pouchdb/pouchdb/issues/7467
        fields: ['_id', 'tags']
      },
      ddoc: 'tag-search'
    })
    // add design documents
    try {
      await this.put(designTags)
    } catch (error) {
      // update ddoc if it differs from the one found.
      if (error.name === 'conflict') {
        const ddoc = await this.get(designTags._id)
        const rev = ddoc._rev
        delete ddoc._rev
        if (!isEqual(ddoc, designTags)) {
          log(`Design document ${designTags._id} out of date. Updating...`)
          designTags._rev = rev
          await this.put(designTags)
        }
      } else {
        console.error(error)
      }
    }
  },
  getType: async function (type, options) {
    const { docs } = await this.find({
      selector: {
        _id: {
          $gt: `${type}:`,
          $lt: `${type}\uffff`
        }
      },
      ...options
    })
    return docs
  },
  getBookmarks: async function (options = {}) {
    const bookmarks = await this.getType('bookmark', options)
    return bookmarks
  },
  getLists: async function (options = {}) {
    const lists = await this.getType('list', options)
    return lists
  },
  getTags: async function (options = {}) {
    const { rows } = await this.query('tags/listTags', {
      group: true,
      ...options
    })
    const tags = rows.map(({ key }) => { return key })
    return tags
  },
  _parseQuery: function (query) {
    const tagSelector = query.split(',').map((term) => {
      term = term.trim()
      if (term[0] === '+') {
        return ['$all', term.slice(1)]
      } else if (term[0] === '-') {
        return ['$nin', term.slice(1)]
      } else {
        return ['$in', term]
      }
    }).reduce((selector, [operand, term]) => {
      if (operand === '$all') {
        if (!selector.$all) selector.$all = []
        selector.$all.push(term)
      } else {
        if (operand === '$nin') {
          if (!selector.$allMatch) selector.$allMatch = { $nin: [] }
          selector.$allMatch.$nin.push(term)
        } else if (operand === '$in') {
          if (!selector.$elemMatch) selector.$elemMatch = { $in: [] }
          selector.$elemMatch.$in.push(term)
        }
      }
      return selector
    }, {})
    return {
      _id: {
        $gt: 'bookmark:',
        $lt: 'bookmark\uffff'
      },
      tags: tagSelector
    }
  },
  searchTags: async function (query) {
    const selector = this._parseQuery(query)
    const { docs } = await this.find({
      selector,
      use_index: 'tag-search'
    })
    return docs
  }
})

export default new PouchDB(name)
