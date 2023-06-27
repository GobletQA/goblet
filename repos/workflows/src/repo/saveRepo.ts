import { git } from '../git'
import { Logger } from '@keg-hub/cli-utils'
import { TGitOpts, TSaveMetaData } from '@gobletqa/workflows/types'

// TODO: add code to commit changes from javascript instead of shelling out to the git executable
// const saveFromCode = async (opts:TGitOpts, metaData:TSaveMetaData) => {
//   console.log(`[Workflow] Commit from code not implemented`)
//   return false
// }

/**
 * Helper to call git.commit and git.push to save repo changes to a git remote
 */
const saveFromShell = async (opts:TGitOpts, metaData:TSaveMetaData, retry:number=0) => {
  Logger.info(`Saving changes to git remote....`)

  // Fist add and commit all the changes
  const [commitErr, commitResp] = await git.commit(opts, undefined, metaData)

  if(commitResp.exitCode && commitResp.data.includes(`nothing to commit`))
    return Logger.info(`Repo up to date\n`)

  // Next push all changes to the origin
  const [err, resp, saved] = await git.push(opts)
  if(saved) return Logger.success(`Saved repo changes successfully\n`)

  if(retry < 1 && (err?.message?.includes(`cannot lock ref`) || resp?.error?.includes(`cannot lock ref`))){
    Logger.info(`Running git gc prune ...`)
    await git.gc(opts.local)

    return await saveFromShell(opts, metaData, retry + 1)
  }

  return Logger.error(`Failed to save repo changes\n`)
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
  return await saveFromShell(opts, metaData)
  // return shell
  //   ? await saveFromShell(opts, metaData)
  //   : await saveFromCode(opts, metaData)
}
