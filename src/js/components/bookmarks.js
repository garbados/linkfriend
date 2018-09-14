/* eslint-disable no-unused-vars */

import { h, Component } from 'preact'

import db from '../lib/db'
import log from '../lib/log'
import Bookmark from './bookmark'

export default class Bookmarks extends Component {
  constructor (props) {
    super(props)
    this.state = { bookmarks: [] }
  }

  async reload () {
    const { docs } = await db.find({
      selector: {
        tags: {
          $exists: true
        }
      },
      ddoc: 'bookmark-tag-search'
    })
    this.setState({ bookmarks: docs })
  }

  async componentDidMount () {
    await this.reload()
  }

  renderBookmark (bookmark, editing = false, persistent = true) {
    const reload = this.reload.bind(this)
    return (
      <div>
        <Bookmark
          editing={editing}
          persistent={persistent}
          bookmark={bookmark}
          onSave={reload}
          onDelete={reload}
        />
      </div>
    )
  }

  render () {
    // render bookmarks if any exist
    const { bookmarks } = this.state
    const rendered = bookmarks.map((bookmark) => {
      return this.renderBookmark(bookmark)
    })
    return (
      <div>
        <h1 class='title'>Bookmarks</h1>
        <h2 class='subtitle'>Add a new bookmark</h2>
        { this.renderBookmark({}, true, false) }
        <hr />
        <h2 class='subtitle'>Bookmarks</h2>
        { rendered.length ? rendered : (
          <div>
            <p>No bookmarks.</p>
          </div>
        ) }
      </div>
    )
  }
}
