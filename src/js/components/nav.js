/* eslint-disable no-unused-vars */

import createHashHistory from 'history/createHashHistory'
import Router from 'preact-router'
import { h, Component } from 'preact'
import { name, homepage } from '../../../package.json'

// TODO observe active link state

export default class Nav extends Component {
  render () {
    return (
      <aside class='menu'>
        <p class='menu-label'>
          { name }
        </p>
        <ul class='menu-list'>
          <li><a href='#/'><i class='fas fa-bookmark' /> Bookmarks</a></li>
          <li><a href='#/search'><i class='fas fa-search' /> Search</a></li>
          <hr />
          <li><a href={homepage}><i class='fas fa-code' /> Source</a></li>
        </ul>
      </aside>
    )
  }
}
