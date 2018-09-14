/* eslint-disable no-unused-vars */

import { h, Component } from 'preact'

import db from '../lib/db'
import log from '../lib/log'
import SearchBookmarks from './search-bookmarks'

export default class Search extends Component {
  constructor (props) {
    super(props)
    this.setState({ bookmarks: null })
  }

  submit () {
    return async (e) => {
      e.preventDefault()
      log('Search:')

      const query = e.target.elements[0].value
      log(`- Query: ${query}`)

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
          if (!selector.$elemMatch) selector.$elemMatch = {}
          if (operand === '$nin') {
            if (!selector.$elemMatch.$nin) selector.$elemMatch.$nin = []
            selector.$elemMatch.$nin.push(term)
          } else if (operand === '$in') {
            if (!selector.$elemMatch.$in) selector.$elemMatch.$in = []
            selector.$elemMatch.$in.push(term)
          }
        }
        return selector
      }, {})
      const selector = { tags: tagSelector }
      log(`- Selector: ${JSON.stringify(selector)}`)

      try {
        const { docs } = await db.find({
          selector,
          use_index: 'bookmark-tag-search'
        })
        log(`- Results: ${JSON.stringify(docs)}`)

        this.setState({ bookmarks: docs })
      } catch (error) {
        log(`Unexpected error: ${JSON.stringify(error)}`)
      }
    }
  }

  render () {
    const { bookmarks } = this.state
    return (
      <div>
        <h1 class='title'>Search</h1>
        <form onSubmit={this.submit()}>
          <div class='columns'>
            <div class='column'>
              <div class='field'>
                <div class='control'>
                  <input
                    class='input'
                    type='text'
                    placeholder='Search'
                  />
                </div>
                <p class='help'>
                  Search by tags. Separate terms with ','.
                  Precede terms with '+' to require a term,
                  '-' to exclude it.
                </p>
              </div>
            </div>
            <div class='column is-narrow'>
              <div class='field'>
                <p class='control'>
                  <input
                    type='submit'
                    class='button is-fullwidth is-success'
                    value='Search'
                  />
                </p>
              </div>
            </div>
          </div>
        </form>
        <hr />
        { bookmarks === null ? (
          <div />
        ) : (
          <SearchBookmarks bookmarks={bookmarks} />
        ) }
      </div>
    )
  }
}
