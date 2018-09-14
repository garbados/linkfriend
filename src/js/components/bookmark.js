/* eslint-disable no-unused-vars */

import Markdown from 'preact-markdown'
import { h, Component } from 'preact'

import db from '../lib/db'
import log from '../lib/log'
import uuidv4 from 'uuid/v4'
import { getHumanDate } from '../lib/util'

class NewBookmark extends Component {
  submit (bookmark = {}, save) {
    return (e) => {
      e.preventDefault()
      if (!bookmark._id) { bookmark._id = `bookmark:${uuidv4()}` }
      bookmark.title = e.target.elements[0].value
      bookmark.url = e.target.elements[1].value
      bookmark.description = e.target.elements[2].value
      bookmark.tags = e.target.elements[3].value.split(',').map(s => s.trim())
      bookmark.createdAt = (bookmark.createdAt ? bookmark.createdAt : Date.now())
      bookmark.updatedAt = (bookmark.updatedAt ? Date.now() : undefined)
      if (bookmark.deleted) { bookmark.deleted = false } // restore entries on change
      log(`Saving ${JSON.stringify(bookmark)}`)
      save(bookmark)
    }
  }

  render ({ bookmark, onSave, onCancel, persistent }) {
    const save = async (bookmark) => {
      await db.put(bookmark)
      this.formRef.reset()
      await onSave()
    }

    return (
      <div>
        <form ref={(el) => { this.formRef = el }} onSubmit={this.submit(bookmark, save)}>
          <div class='field'>
            <div class='control'>
              <input
                class='input'
                type='text'
                placeholder='Title'
                value={bookmark.title}
              />
            </div>
          </div>
          <div class='field'>
            <div class='control'>
              <input
                class='input'
                type='text'
                placeholder='URL'
                value={bookmark.url}
              />
            </div>
          </div>
          <div class='field'>
            <div class='control'>
              <input
                class='input'
                type='text'
                placeholder='Description'
                value={bookmark.description}
              />
            </div>
            <p class='help'> Use <a href='https://en.wikipedia.org/wiki/Markdown#Example' target='_blank'>Markdown</a> to mark up your bookmark descriptions.</p>
          </div>
          <div class='field'>
            <div class='control'>
              <input
                class='input'
                type='text'
                placeholder='Tags'
                value={bookmark.tags ? bookmark.tags.join(', ') : ''}
              />
            </div>
            <p class='help'>Separate tags with commas.</p>
          </div>
          <div class='field'>
            <p class='control'>
              <input type='submit' class='button is-fullwidth is-success' value='Save' />
            </p>
          </div>
          { persistent ? (
            <div class='field'>
              <p class='control'>
                <button class='button is-fullwidth is-info' onClick={onCancel}>Cancel</button>
              </p>
            </div>
          ) : (
            <div />
          ) }
        </form>
      </div>
    )
  }
}

export default class Bookmark extends Component {
  constructor (props) {
    super(props)
    if (props.editing) this.toggleEdit()
  }

  toggleEdit () {
    this.setState({ editing: !this.state.editing })
  }

  render ({ bookmark, onSave, onDelete, persistent }, { editing }) {
    const toggleEdit = this.toggleEdit.bind(this)
    const createdAt = bookmark.createdAt ? getHumanDate(bookmark.createdAt) : ''
    const updatedAt = bookmark.updatedAt ? getHumanDate(bookmark.updatedAt) : ''
    const tags = bookmark.tags ? bookmark.tags.join(', ') : ''

    const remove = async () => {
      await db.remove(bookmark)
      await onDelete()
    }

    const restore = async () => {
      if (bookmark.deleted) {
        bookmark.deleted = false
        await db.put(bookmark)
      }
      await onDelete()
    }

    return (
      <div>
        { editing ? (
          <div>
            <NewBookmark
              bookmark={bookmark}
              onCancel={toggleEdit}
              onSave={onSave}
              persistent={persistent}
            />
          </div>
        ) : (
          <div class='columns'>
            <div class='column is-9'>
              <div class='box'>
                <h1 class='title'><a href={bookmark.url} target='_blank'>{ bookmark.title }</a></h1>
                <div class='content'>
                  <Markdown markdown={bookmark.description} />
                </div>
                { tags ? (<p><small><em>Tags: { tags }</em></small></p>) : (<p />) }
                <p><small><em>Created: { createdAt }</em></small></p>
                { updatedAt ? (<p><small><em>Updated: { updatedAt }</em></small></p>) : (<p />) }
              </div>
            </div>
            <div class='column is-3'>
              { bookmark.deleted ? (
                <form>
                  <div class='field'>
                    <p class='control'>
                      <button class='button is-fullwidth is-info' onClick={toggleEdit}>Edit</button>
                    </p>
                  </div>
                  <div class='field'>
                    <p class='control'>
                      <button class='button is-fullwidth is-danger' onClick={remove}>Delete</button>
                    </p>
                  </div>
                  <div class='field'>
                    <p class='control'>
                      <button class='button is-fullwidth is-success' onClick={restore}>Restore</button>
                    </p>
                  </div>
                </form>
              ) : (
                <form>
                  <div class='field'>
                    <p class='control'>
                      <button class='button is-fullwidth is-info' onClick={toggleEdit}>Edit</button>
                    </p>
                  </div>
                  <div class='field'>
                    <p class='control'>
                      <button class='button is-fullwidth is-warning' onClick={remove}>Remove</button>
                    </p>
                  </div>
                </form>
              )}
            </div>
          </div>
        )
        }
      </div>
    )
  }
}
