/* eslint-disable no-unused-vars */

import { h, Component } from 'preact'

import db from '../lib/db'
import Bookmarks from './bookmarks'

class Welcome extends Component {
  render () {
    return (
      <div>
        <h1 class='title'>Hello, world!</h1>
        <p class='subtitle'>This is a bookmarking tool.</p>
        <div class='content'>
          <p>
            It uses <a href='https://pouchdb.com/'>PouchDB</a> to store
            your data on your browser, so it never touches the network.
          </p>
        </div>
      </div>
    )
  }
}

export default class Home extends Component {
  constructor (props) {
    super(props)
    this.state = { hasBookmarks: null }
  }

  async componentDidMount () {
    // determine if any bookmarks exist
    const { docs } = await db.find({
      selector: {
        tags: {
          $exists: true
        }
      },
      ddoc: 'bookmark-tag-search'
    })
    const hasBookmarks = docs.length > 0
    this.setState({ hasBookmarks })
  }

  render () {
    // render bookmarks if any exist
    const { hasBookmarks } = this.state
    if (hasBookmarks === false) {
      return (
        <div>
          <Welcome />
          <hr />
          <Bookmarks />
        </div>
      )
    } else if (hasBookmarks) {
      return (
        <div>
          <Bookmarks />
        </div>
      )
    } else {
      return (
        <div>
          <h1 class='title'>Loading...</h1>
        </div>
      )
    }
  }
}
