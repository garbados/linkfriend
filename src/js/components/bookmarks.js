/* eslint-disable no-unused-vars */

import { h, Component } from 'preact'

import db from '../lib/db'
import log from '../lib/log'
import Bookmark from './bookmark'
import NewBookmark from './new-bookmark'
import Search from './search'
import Welcome from './welcome'

export default class Bookmarks extends Component {
  constructor (props) {
    super(props)
    this.state = { bookmarks: [], newBookmark: false }
  }

  async reload (query = null) {
    let docs
    if (query) {
      docs = await db.searchTags(query)
    } else {
      docs = await db.getBookmarks()
    }
    this.setState({ bookmarks: docs, newBookmark: false })
  }

  async componentDidMount () {
    await this.reload()
  }

  toggleNewBookmark () {
    const { newBookmark } = this.state
    this.setState({ newBookmark: !newBookmark })
  }

  renderBookmark (bookmark) {
    const reload = this.reload.bind(this)
    return (
      <div>
        <Bookmark
          bookmark={bookmark}
          onSave={reload}
          onDelete={reload}
        />
      </div>
    )
  }

  render () {
    // render bookmarks if any exist
    const { bookmarks, newBookmark } = this.state
    const toggleNewBookmark = this.toggleNewBookmark.bind(this)
    const reload = this.reload.bind(this)
    const rendered = bookmarks.map((bookmark) => {
      return this.renderBookmark(bookmark)
    })
    return (
      <div>
        { bookmarks.length === 0 ? (
          <div>
            <Welcome />
            <hr />
          </div>
        ) : (<div />) }
        <h1 class='title'>Bookmarks</h1>
        { newBookmark ? (
          <div>
            <h2 class='subtitle'>Add new bookmark</h2>
            <NewBookmark onSave={reload} onCancel={toggleNewBookmark} />
          </div>
        ) : (
          <div>
            <button class='button is-fullwidth is-info' onClick={toggleNewBookmark}>Add new bookmark</button>
          </div>
        )}
        { rendered.length ? (
          <div>
            <hr />
            <h2 class='subtitle'>Search bookmarks by tag</h2>
            <Search onQuery={reload} />
            <hr />
            { rendered }
          </div>
        ) : (
          <div>
            <hr />
            <p>No bookmarks.</p>
          </div>
        ) }
      </div>
    )
  }
}