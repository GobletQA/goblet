import { git, RepoWatcher } from '../git'

import { TGitOpts } from '@gobletqa/workflows/types'


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
const onEvent = (args:TGitOpts) => ((event:string, path:string) => {
  // TODO: add commit and push methods here

  console.log(`------- Repo Git Options -------`)
  console.log(args)
  
  console.log(`------- Repo change event -------`)
  console.log(event)

  console.log(`------- path changed -------`)
  console.log(path)

})

/**
 * Workflow for cloning a git repo from a git provider
 * @function
 * @public
 * @throws
 *
 */
export const mountRepo = async (args:TGitOpts) => {
  const [err, output] = await git.clone(args)

  if (err) throw err

  if (output?.exitCode)
    throw new Error(`Could not mount repository\n${output?.error || output?.data || ''}`)

  RepoWatcher.create(args, onEvent(args), true)
}
