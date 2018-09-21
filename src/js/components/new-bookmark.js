/* eslint-disable no-unused-vars */

import Markdown from 'preact-markdown'
import { h, Component } from 'preact'

import db from '../lib/db'
import log from '../lib/log'
import Typeahead from './typeahead'
import uuidv4 from 'uuid/v4'
import { getHumanDate } from '../lib/util'

export default class NewBookmark extends Component {
  constructor (props) {
    super(props)
    this.setState({
      tags: []
    })
  }

  async componentDidMount () {
    const tags = await db.getTags()
    this.setState({ tags })
  }

  submit (bookmark = {}, save) {
    return (e) => {
      e.preventDefault()
      if (!bookmark._id) { bookmark._id = `bookmark:${uuidv4()}` }
      // parse form fields
      bookmark.title = e.target.elements[0].value
      bookmark.url = e.target.elements[1].value
      bookmark.description = e.target.elements[2].value
      bookmark.tags = e.target.elements[3].value
        .split(',')
        .map(s => s.trim())
        .filter(s => !!s)
      // TODO detect and report errors before saving
      // update timestamps
      bookmark.createdAt = bookmark.createdAt ? bookmark.createdAt : Date.now()
      bookmark.updatedAt = bookmark.updatedAt ? Date.now() : undefined
      // save!
      log(`Saving ${JSON.stringify(bookmark, undefined, 2)}`)
      save(bookmark)
    }
  }

  render ({ bookmark, onSave, onCancel }, { tags }) {
    const save = async (bookmark) => {
      await db.put(bookmark)
      await onSave()
    }

    return (
      <div>
        <form onSubmit={this.submit(bookmark, save)}>
          <div class='columns'>
            <div class='column is-9'>
              <div class='box'>
                <div class='field'>
                  <div class='control'>
                    <div class='label'>Title</div>
                    <input
                      class='input'
                      type='text'
                      placeholder='Title'
                      value={bookmark ? bookmark.title : ''}
                    />
                  </div>
                </div>
                <div class='field'>
                  <div class='control'>
                    <div class='label'>URL</div>
                    <input
                      class='input'
                      type='text'
                      placeholder='URL'
                      value={bookmark ? bookmark.url : ''}
                    />
                  </div>
                </div>
                <div class='field'>
                  <div class='control'>
                    <label class='label'>Description</label>
                    <textarea
                      class='textarea'
                      placeholder='Description'
                      value={bookmark ? bookmark.description : ''}
                    />
                  </div>
                  <p class='help'> Use <a href='https://en.wikipedia.org/wiki/Markdown#Example' target='_blank'>Markdown</a> to mark up your bookmark descriptions.</p>
                </div>
                <div class='field'>
                  <div class='control'>
                    <Typeahead
                      defaultInputValue={bookmark ? bookmark.tags.join(', ') : ''}
                      label='Tags'
                      placeholder='Tags'
                      items={tags}
                    />
                  </div>
                  <p class='help'>Separate tags with commas. Tags are indexed for searching.</p>
                </div>
              </div>
            </div>
            <div class='column is-3'>
              <div class='field'>
                <p class='control'>
                  <input type='submit' class='button is-fullwidth is-success' value='Save' />
                </p>
              </div>
              <div class='field'>
                <p class='control'>
                  <a class='button is-fullwidth is-info' onClick={onCancel}>Cancel</a>
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    )
  }
}
