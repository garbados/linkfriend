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
      tags: ['hello', 'world'],
      createdAt: Date.now()
    }, {
      _id: 'bookmark:2',
      description: 'wake up sheeple! it is time for breakfast',
      url: 'https://bovid.space',
      tags: ['sheeple'],
      createdAt: Date.now() + 1
    }, {
      _id: 'bookmark:3',
      description: 'ups and downs',
      url: 'https://bovid.space',
      tags: ['-', '+'],
      createdAt: Date.now() + 2
    }, {
      _id: 'list:1',
      title: 'sheep posts',
      description: 'posts about sheep including sheeple',
      createdAt: Date.now() + 3
    }])
  })

  after(async function () {
    await db.destroy()
  })

  it('smoke test', function () {
    assert.strictEqual(db.name, name)
  })

  it('should setup twice ok', async function () {
    await db.setup()
    await db.setup()
  })

  it('should retrieve bookmarks only', async function () {
    const bookmarks = await db.getBookmarks()
    assert.strictEqual(bookmarks.length, 3)
  })

  it('should retrieve lists only', async function () {
    const lists = await db.getLists()
    assert.strictEqual(lists.length, 1)
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
      assert.strictEqual(bookmarks.length, 1)
    })
    it('should handle a compound term', async function () {
      const bookmarks = await db.searchTags('hello, sheeple')
      assert.strictEqual(bookmarks.length, 2)
    })
    it('should handle a complex term', async function () {
      const bookmarks = await db.searchTags('+hello, -world')
      assert.strictEqual(bookmarks.length, 0)
    })
    it('should parse tags which are operands as tags', async function () {
      const bookmarks = await db.searchTags('+')
      assert.strictEqual(bookmarks.length, 1)
    })
  })
})
