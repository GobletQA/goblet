import { saveRepo } from './saveRepo'
import { git, RepoWatcher } from '../git'
import { Logger } from '@keg-hub/cli-utils'
import { TGitOpts, TRepoWatchCb } from '@gobletqa/workflows/types'

/**
 *
 * Uses git to clone a repo to the local instance
 * git clone http://<token>@domain.com/username/repository.git /clone/directory
 * Then sets up a file change watcher to watch for changes
 * Any picked up change will cause a commit and push to the repos origin
 *
 */

/**
 * Event handler to commit and push changes to the repos git origin
 * Whenever a change event happens
 */
const onEvent = (opts:TGitOpts) => ((event:string, path:string) => {
  return saveRepo(opts, { message: `test(goblet): ${path} - ${event} auto-commit`}, true)
})

/**
 * Helper to create an instance of the RepoWatcher based on the passed in git options
 * Called when a new repo is mounted, or after git-repo-status api call
 */
export const createRepoWatcher = (opts:TGitOpts, callback?:TRepoWatchCb, autoStart:boolean=true) => {
  return RepoWatcher.create(opts, callback || onEvent(opts), autoStart)
}

/**
 * Workflow for cloning a git repo from a git provider
 * @function
 * @public
 * @throws
 *
 */
export const mountRepo = async (opts:TGitOpts) => {
  const [err, output] = await git.clone(opts)

  if (err) throw err
  else Logger.log(`[Git Clone Output] ${JSON.stringify(output)}`)

  if (output?.exitCode)
    throw new Error(`Could not mount repository\n${output?.error || output?.data || ''}`)

  createRepoWatcher(opts)
}
