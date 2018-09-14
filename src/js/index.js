/* eslint-disable no-unused-vars */

import App from './components/app'
import log from './lib/log'
import { h, render } from 'preact'

window.onload = () => {
  log('App starting...')
  render(<App />, document.body)
}
