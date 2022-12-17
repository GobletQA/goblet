import path from 'path'
import { existsSync } from 'fs'
import { execSync } from 'child_process'
import { camelCase } from '@keg-hub/jsutils'

/**
 * Finds all sub-repo paths from the <root>/repos directory
 */
export const getRepoPaths = (reposDir:string) => {
  // list of the repo names located at `<root>/repos`
  return execSync('ls', { cwd: reposDir })
    .toString()
    .split('\n')
    .filter(Boolean)
    .reduce((values, name) => {
      const repo = path.join(reposDir, name)
      existsSync(path.join(repo, `./package.json`)) && (values[camelCase(name)] = repo)

      return values
    }, {})
}

