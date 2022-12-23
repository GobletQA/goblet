import path from 'path'
import { repos } from '../../paths'
import { createRequire } from 'module'

const TasksLoadEnvs = (...args:any[]) => {
  const shareLoc = path.resolve(path.join(repos.shared, `src/utils`))
  const require = createRequire(shareLoc)
  const { loadEnvs } = require(`./utils/loadEnvs`)

  return loadEnvs(...args)
}

export {
  TasksLoadEnvs as loadEnvs
}

