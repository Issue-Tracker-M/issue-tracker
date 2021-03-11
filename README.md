# Rockit🚀

Rockit is a productivity app inspired by Trello.
[Check it out](https://issue-tracker-webapp.netlify.app/)

## Features 🚀

- Full-featured registration workflow.
- Organize your work into workspaces, lists, and tasks.
- Assign due dates and comment on tasks.
- Dark Mode 😍.

## Development

Rockit uses a monorepo structure and is split into the following packages.

- [webapp](https://github.com/Issue-Tracker-M/issue-tracker/tree/main/packages/webapp) to manage installation of dependencies and
  running various scripts. We also have yarn workspaces enabled by default.
- [api](https://github.com/Issue-Tracker-M/issue-tracker/tree/main/packages/api) for rapid UI component development and
  testing
- [types](https://github.com/Issue-Tracker-M/issue-tracker/tree/main/packages/types) for testing components and
  hooks
- [components](https://github.com/Issue-Tracker-M/issue-tracker/tree/main/packages/components) for a blazing fast documentation website.
  versioning and changelogs


### Tooling

- [Lerna](https://lerna.js.org/) to manage installation of dependencies and
  running various scripts. We also have yarn workspaces enabled by default.
- [scripty](https://github.com/testdouble/scripty) to not write all of the scripts inside package.json 🤣.
- [Storybook](https://storybook.js.org/) for rapid UI component development and
  testing
- [Testing Library](https://testing-library.com/) for testing components and
  hooks

### Commands

**`yarn`**: bootstraps the entire project, symlinks all dependencies for
cross-package development.

**`yarn build`**: run build for all packages.

**`yarn test`**: run test for all packages.

**`yarn dev`**: starts the api and webapp packages in development mode, also watches for changes in other packages and rebuilds them as needed.

**`yarn lint`**: typechecks and lints all packages.

**`yarn clean`**: deletes built artifacts.

### Commit Convention

Before you create a Pull Request, please check whether your commits comply with
the commit conventions used in this repository.

When you create a commit we kindly ask you to follow the convention
`category(scope or module): message` in your commit message while using one of
the following categories:

- `feat / feature`: all changes that introduce completely new code or new
  features
- `fix`: changes that fix a bug (ideally you will additionally reference an
  issue if present)
- `refactor`: any code related change that is not a fix nor a feature
- `docs`: changing existing or creating new documentation (i.e. README, docs for
  usage of a lib or cli usage)
- `build`: all changes regarding the build of the software, changes to
  dependencies or the addition of new dependencies
- `test`: all changes regarding tests (adding new tests or changing existing
  ones)
- `ci`: all changes regarding the configuration of continuous integration (i.e.
  github actions, ci system)
- `chore`: all changes to the repository that do not fit into any of the above
  categories

## License

MIT © [Sergei Kabuldzhanov](https://github.com/sergeikabuldzhanov)
