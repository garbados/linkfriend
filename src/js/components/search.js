/* eslint-disable no-unused-vars */

import { h, Component } from 'preact'

import db from '../lib/db'
import log from '../lib/log'
import Typeahead from './typeahead'

class SearchTypeahead extends Typeahead {
  getMenuItems ({ getInputProps, getItemProps, highlightedIndex, inputValue, items }) {
    const entries = inputValue.split(',').map(s => s.trim())
    const currentEntries = entries.slice(0, -1)
    let pendingEntry = entries.slice(-1)[0]
    let operand = ''
    if (pendingEntry[0] === '-' || pendingEntry[0] === '+') {
      operand = pendingEntry[0]
      pendingEntry = pendingEntry.slice(1)
    }
    return pendingEntry.length
      ? items
        .filter((item, index) => {
          return item.includes(pendingEntry) && !currentEntries.includes(item)
        })
        .map((item, index) => (
          <li
            {...getItemProps({
              key: item,
              index,
              item: [...currentEntries, `${operand}${item}`].join(', ')
            })}
          >
            <a class={highlightedIndex === index ? 'is-active' : ''}>{item}</a>
          </li>
        ))
      : null
  }
}

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
                <SearchTypeahead
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
