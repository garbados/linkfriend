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

      const query = e.target.elements[0].value
      log(`Search query: ${query}`)
      try {
        const bookmarks = await db.searchTags(query)
        log(`Search results: ${JSON.stringify(bookmarks)}`)
        this.setState({ bookmarks })
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
