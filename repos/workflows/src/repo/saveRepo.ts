import { git } from '../git'
import { Logger } from '@keg-hub/cli-utils'
import { TGitOpts, TSaveMetaData } from '@gobletqa/workflows/types'

// TODO: add code to commit changes from javascript instead of shelling out to the git executable
const saveFromCode = async (opts:TGitOpts, metaData:TSaveMetaData) => {
  console.log(`[Workflow] Commit from code not implemented`)
  return false
}

/**
 * Helper to call git.commit and git.push to save repo changes to a git remote
 */
const saveFromShell = async (opts:TGitOpts, metaData:TSaveMetaData) => {
  Logger.info(`Saving changes to git remote....`)

  // Fist add and commit all the changes
  const [commitErr, commitResp] = await git.commit(opts, undefined, metaData)

  if(commitResp.exitCode && commitResp.data.includes(`nothing to commit`))
    return Logger.info(`Repo up to date\n`)

  // Next push all changes to the origin
  const [err, resp, saved] = await git.push(opts)
  saved
    ? Logger.success(`Saved repo changes successfully\n`)
    : Logger.error(`Failed to save repo changes\n`)
}

/**
 * Workflow for committing changes into a git repo
 * @function
 * @public
 * @throws
 */
export const saveRepo = async (
  opts:TGitOpts,
  metaData:TSaveMetaData,
  shell:boolean=true
) => {
  return shell
    ? await saveFromShell(opts, metaData)
    : await saveFromCode(opts, metaData)
}
