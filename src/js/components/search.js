/* eslint-disable no-unused-vars */

import { h, Component } from 'preact'

import log from '../lib/log'

export default class Search extends Component {
  submit (onQuery) {
    return async (e) => {
      e.preventDefault()

      const query = e.target.elements[0].value
      log(`Search query: ${query}`)
      onQuery(query)
    }
  }

  render ({ onQuery }) {
    const { bookmarks } = this.state
    return (
      <form onSubmit={this.submit(onQuery)}>
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
    )
  }
}
