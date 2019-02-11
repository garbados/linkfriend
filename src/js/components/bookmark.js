/* eslint-disable no-unused-vars */

import Markdown from 'preact-markdown'
import { h, Component } from 'preact'

import db from '../lib/db'

import NewBookmark from './new-bookmark'
import ShowBookmark from './show-bookmark'

export default class Bookmark extends Component {
  constructor (props) {
    super(props)
    if (props.editing) this.toggleEdit()
  }

  toggleEdit () {
    const { editing } = this.state
    this.setState({ editing: !editing })
  }

  render ({ bookmark, onSave, onDelete }, { editing }) {
    const toggleEdit = this.toggleEdit.bind(this)

    const save = (options) => {
      onSave(options)
      this.toggleEdit()
    }

    const remove = async () => {
      await db.remove(bookmark)
      await onDelete()
    }

    return (
      <div class='box'>
        { editing ? (
          <div>
            <NewBookmark
              bookmark={bookmark}
              onCancel={toggleEdit}
              onSave={save}
            />
          </div>
        ) : (
          <div>
            <ShowBookmark bookmark={bookmark} />
            <hr />
            <form>
              <div class='field is-grouped is-grouped-right'>
                <p class='control'>
                  <a class='button is-warning' onClick={toggleEdit}>Edit</a>
                </p>
                <p class='control'>
                  <a class='button is-danger' onClick={remove}>Remove</a>
                </p>
              </div>
            </form>
          </div>
        ) }
      </div>
    )
  }
}
