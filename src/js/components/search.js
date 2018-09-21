/* eslint-disable no-unused-vars */

import { h, Component } from 'preact'

import db from '../lib/db'
import log from '../lib/log'
import Typeahead from './typeahead'

export default class Search extends Component {
  constructor (props) {
    super(props)
    this.setState({
      tags: []
    })
  }

  async componentDidMount () {
    const tags = await db.getTags()
    this.setState({ tags })
  }

  submit (onQuery) {
    return async (e) => {
      e.preventDefault()

      const query = e.target.elements[0].value
      log(`Search query: ${query}`)
      onQuery(query)
    }
  }

  render ({ onQuery }, { tags }) {
    const { bookmarks } = this.state
    return (
      <form onSubmit={this.submit(onQuery)}>
        <div class='columns'>
          <div class='column'>
            <div class='field'>
              <div class='control'>
                <Typeahead
                  label='Search'
                  placeholder='Search'
                  items={tags}
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
