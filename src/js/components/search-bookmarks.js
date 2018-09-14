/* eslint-disable no-unused-vars */

import { h, Component } from 'preact'

import SearchBookmark from './search-bookmark'

export default class SearchBookmarks extends Component {
  renderBookmark (bookmark) {
    return (
      <div>
        <SearchBookmark bookmark={bookmark} />
      </div>
    )
  }

  render ({ bookmarks }) {
    const rendered = bookmarks.map(this.renderBookmark.bind(this))
    return (<div> { rendered } </div>)
  }
}
