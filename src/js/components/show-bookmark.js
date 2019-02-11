/* eslint-disable no-unused-vars */

import Markdown from 'preact-markdown'
import { h, Component } from 'preact'

import { getHumanDate } from '../lib/util'

export default class ShowBookmark extends Component {
  renderTags (tags) {
    return (
      <div class='tags'>
        { tags.map((tag) => (
          <span class='tag is-dark'>#{ tag }</span>
        )) }
      </div>
    )
  }

  render ({ bookmark }) {
    const createdAt = bookmark.createdAt ? getHumanDate(bookmark.createdAt) : ''
    const updatedAt = bookmark.updatedAt ? getHumanDate(bookmark.updatedAt) : ''
    const tags = bookmark.tags ? bookmark.tags.join(', ') : ''
    return (
      <div>
        <h3 class='title'><a href={bookmark.url} target='_blank'>{ bookmark.title }</a></h3>
        <div class='content'>
          <Markdown markdown={bookmark.description} />
        </div>
        { bookmark.tags ? this.renderTags(bookmark.tags) : (<p />) }
      </div>
    )
  }
}
