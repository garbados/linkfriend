# P2P Social Bookmarking

*Working title. Cutesy moniker TBD.*

A browser application for archiving, searching, and sharing bookmarks. At least, that's the goal. This project is a work in progress and will update accordingly as it develops. Many of the links in the document are still TODO so don't be surprised when they don't work.

## Goals

It's so creepy that every bookmarking service wants your data. Look, I just want something better than a text file, OK? A place I can drop links so I can close tabs. I want to annotate bookmarks, archive them to prevent dead links, and maybe (MAYBE) share them with people. Generally speaking, I don't want this information to leave my device, and I *really* don't some stalker-as-a-service selling it.

This application tries to provide those features while respecting your privacy through its architecture:

- Information is stored on your device. Unless you choose to share it with another user, it never leaves your device.
- No central servers to administrate, just a static application.
- Save, annotate, and archive bookmarks.
- Index bookmarks so you can search for them.
- Share bookmarks or subsets thereof with your friends.
- Search among all the bookmarks that have been shared with you.
- Moderate bookmarks shared with you, such as by hiding certain tags.

The vision I want this application to facilitate is this: a community search engine and archival tool where individuals can freely associate to develop, preserve, and explore their own corner of the web. It is not meant to replace web-wide search engines and concerns itself with a different use case, that is searching for things already known to you and yours. "Where was that thing I read?", "What was that article my friend sent me?", "What did that page look like before it disappeared?" etc.

## Roadmap

This application will be reach its goals in stages. It will only become "social" perse in V1.

### V0

- [x] Save links.
- [x] Annotate links with 
	- [x] Title
	- [x] Description
	- [x] Tags
- [ ] Search links by tags.
- [ ] Implement typeaheads for
	- [ ] Tags
	- [ ] Search terms

### V1

- [ ] Annotat bookmarks with
	- [ ] Lists
- [ ] Create lists with their own
	- [ ] Titles
	- [ ] Descriptions
	- [ ] Tags
- [ ] Implement typeaheads for
	- [ ] Bookmark lists
	- [ ] List tags
- [ ] Store link lists as [Dat](https://datproject.org/) archives.
- [ ] Share or add link lists using their discovery key or [Dat DNS URL](https://www.datprotocol.com/deps/0005-dns/).

### V2

- [ ] Moderation controls such as keyword and tag filters.

## Usage

As the application lives on the browser, there is no need to install anything. Just visit the [demo site](#TODO) in the [Beaker browser](#TODO).

TODO: screenshots describing features, usage patterns, etc.

## Development

To work on the source code, download it with [git](https://git-scm.com/) and build it with [Node.js](https://nodejs.org/en/):

```bash
$ git clone https://github.com/garbados/p2p-social-bookmarking
$ cd p2p-social-bookmarking
$ npm install
```

To run a test server, use the `npm start` command to build and serve the application:

```bash
$ npm start

...

   ┌───────────────────────────────────────────────┐
   │                                               │
   │   Serving!                                    │
   │                                               │
   │   - Local:            http://localhost:5000   │
   │   - On Your Network:  http://127.0.1.1:5000   │
   │                                               │
   │   Copied local address to clipboard!          │
   │                                               │
   └───────────────────────────────────────────────┘
```

To serve the application and automatically rebuild its assets whenever source files change, use `npm run dev`:

```bash
$ npm run dev
```

To run the test suite, use the `npm test` command:

```bash
$ npm test
```

## Contributions / Governance

All contributions are welcome but will be moderated at the discretion of the project's maintainers. This section will update as governance policies emerge and evolve.

To report a bug or request a feature, please [file and issue](#TODO).

To share a patch, please [submit a pull request](#TODO).

## License

[Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0). 
