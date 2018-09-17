/* eslint-disable no-unused-vars */

import { h, Component } from 'preact'

export default class Welcome extends Component {
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
