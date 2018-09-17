/* eslint-disable no-unused-vars */

import Markdown from 'preact-markdown'
import { h, Component } from 'preact'

import { getHumanDate } from '../lib/util'

export default class SearchBookmark extends Component {
  render ({ bookmark }) {
    const createdAt = bookmark.createdAt ? getHumanDate(bookmark.createdAt) : ''
    const updatedAt = bookmark.updatedAt ? getHumanDate(bookmark.updatedAt) : ''
    const tags = bookmark.tags ? bookmark.tags.join(', ') : ''
    return (
      <div class='box'>
        <h1 class='title'><a href={bookmark.url} target='_blank'>{ bookmark.title }</a></h1>
        <div class='content'>
          <Markdown markdown={bookmark.description} />
        </div>
        { bookmark.tags ? (<p><small><em>Tags: { tags }</em></small></p>) : (<p />) }
        <p><small><em>Created: { createdAt }</em></small></p>
        { updatedAt ? (<p><small><em>Updated: { updatedAt }</em></small></p>) : (<p />) }
      </div>
    )
  }
}
