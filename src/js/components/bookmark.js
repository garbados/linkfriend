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
      <div>
        { editing ? (
          <div>
            <NewBookmark
              bookmark={bookmark}
              onCancel={toggleEdit}
              onSave={save}
            />
          </div>
        ) : (
          <div class='columns'>
            <div class='column is-9'>
              <ShowBookmark bookmark={bookmark} />
            </div>
            <div class='column is-3'>
              <form>
                <div class='field'>
                  <p class='control'>
                    <a class='button is-fullwidth is-info' onClick={toggleEdit}>Edit</a>
                  </p>
                </div>
                <div class='field'>
                  <p class='control'>
                    <a class='button is-fullwidth is-warning' onClick={remove}>Remove</a>
                  </p>
                </div>
              </form>
            </div>
          </div>
        )
        }
      </div>
    )
  }
}
