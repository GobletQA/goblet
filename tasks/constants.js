const beContextAlias = [`api`, `backend`, `be`]
const feContextAlias = [`ui`, `frontend`, `fe`]
const proxyContextAlias = [`proxy`, `auth`, `px`]
const dbContextAlias = [`db`, `database`, `neo`, `neo4j`]
const appContextAlias = [
  `app`,
  ...proxyContextAlias,
  ...beContextAlias,
  ...feContextAlias,
]
const allContextAlias = [`all`, ...dbContextAlias, ...appContextAlias]

const rootTasks = [`format`]
const repoTasks = [...rootTasks, `validate`, `test`]
const mergeTasks = [...repoTasks, `build`]
const publishTasks = [`task`, `publish`]
const publishTagTasks = [...publishTasks, '--tag']

const forceExitEvents = ['SIGINT', `SIGHUP`, 'SIGTERM']

const shortContextMap = {
  app: `app`,
  proxy: `px`,
  backend: 'be',
  database: `db`,
  frontend: `fe`,
}

module.exports = {
  rootTasks,
  repoTasks,
  mergeTasks,
  publishTasks,
  publishTagTasks,
  shortContextMap,
  forceExitEvents,
  allContextAlias,
  appContextAlias,
  dbContextAlias,
  beContextAlias,
  feContextAlias,
  proxyContextAlias,
}
