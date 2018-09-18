/* eslint-disable no-unused-vars */

import createHashHistory from 'history/createHashHistory'
import Router from 'preact-router'
import { h, Component } from 'preact'

import Bookmarks from './bookmarks'
import db from '../lib/db'
import { name, homepage } from '../../../package.json'

export default class App extends Component {
  async componentDidMount () {
    // setup db
    await db.setup()
  }

  render () {
    return (
      <section class='section'>
        <div class='container'>
          <div class='columns'>
            <div class='column is-narrow'>
              <aside class='menu'>
                <p class='menu-label'>{ name }</p>
                <ul class='menu-list'>
                  <li><a href='#/'><i class='fas fa-bookmark' /> Bookmarks</a></li>
                  <hr />
                  <li><a href={homepage}><i class='fas fa-code' /> Source</a></li>
                </ul>
              </aside>
            </div>
            <div class='column'>
              <Router history={createHashHistory()}>
                <Bookmarks default path='' />
              </Router>
            </div>
          </div>
        </div>
      </section>
    )
  }
}
