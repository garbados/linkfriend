import assert from 'assert'

import db from '../../src/js/lib/db'
import { name } from '../../package.json'

describe('db', function () {
  before(async function () {
    await db.setup()
    await db.bulkDocs([{
      _id: 'bookmark:1',
      description: 'hello world',
      url: 'https://bovid.space',
      tags: ['hello', 'world']
    }, {
      _id: 'bookmark:2',
      description: 'wake up sheeple! it is time for breakfast',
      url: 'https://bovid.space',
      tags: ['sheeple']
    }, {
      _id: 'bookmark:3',
      description: 'ups and downs',
      url: 'https://bovid.space',
      tags: ['-', '+']
    }, {
      _id: 'list:1',
      title: 'sheep posts',
      description: 'posts about sheep including sheeple'
    }])
  })

  after(async function () {
    await db.destroy()
  })

  it('smoke test', function () {
    assert.strict.equal(db.name, name)
  })

  it('should setup twice ok', async function () {
    await db.setup()
    await db.setup()
  })

  it('should retrieve bookmarks only', async function () {
    const bookmarks = await db.getBookmarks()
    assert.strict.equal(bookmarks.length, 3)
  })

  it('should retrieve lists only', async function () {
    const lists = await db.getLists()
    assert.strict.equal(lists.length, 1)
  })

  it('should get a list of all tags', async function () {
    const expected = ['hello', 'world', 'sheeple']
    const tags = await db.getTags()
    expected.forEach((tag) => {
      assert(tags.includes(tag))
    })
  })

  describe('tag-search queries', function () {
    it('should handle a solo term', async function () {
      const bookmarks = await db.searchTags('hello')
      assert.strict.equal(bookmarks.length, 1)
    })
    it('should handle a compound term', async function () {
      const bookmarks = await db.searchTags('hello, sheeple')
      assert.strict.equal(bookmarks.length, 2)
    })
    it('should handle a complex term', async function () {
      const bookmarks = await db.searchTags('+hello, -world')
      assert.strict.equal(bookmarks.length, 0)
    })
    it('should parse tags which are operands as tags', async function () {
      const bookmarks = await db.searchTags('+')
      assert.strict.equal(bookmarks.length, 1)
    })
  })
})
