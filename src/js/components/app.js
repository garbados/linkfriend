/* eslint-disable no-unused-vars */

import createHashHistory from 'history/createHashHistory'
import Router from 'preact-router'
import { h, Component } from 'preact'

import db from '../lib/db'
import Home from './home'
import Nav from './nav'
import Search from './search'

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
              <Nav />
            </div>
            <div class='column'>
              <Router history={createHashHistory()}>
                <Home default path='' />
                <Search path='search' />
              </Router>
            </div>
          </div>
        </div>
      </section>
    )
  }
}
