const { git } = require('./git')
const { Logger } = require('@keg-hub/cli-utils')
const { getGitStagedFiles } = require('./getGitStagedFiles')

/**
 * commit changes
 *
 * Warning, this runs several git commands if you
 * override the warning block. The function will:
 * - run git fetch
 * - change your branch
 * - override your git config for user.name & user.email
 * - stage changes
 * - commit changes
 *
 * @param {string} msg - commit message
 * @param {string} branch - branch name
 * @param {Array} paths - file paths to be staged before creating commit
 * @returns {boolean}
 */
const commitGitChanges = async (msg, branch, paths) => {
  if (msg.length <= 0 || branch.length <= 0 || paths.length <= 0) return false

  if (!process.env['CI'] && !process.env['GITHUB_ACTION']) {
    Logger.warn(`Commit is disallowed unless the task is run within a CI context.`)
    return false
  }

  await git(['fetch'])

  await git(['checkout', branch])
  Logger.info(`checked out branch: `, await git(['branch', '--show-current']))

  let userEmail = await git([`log`, `--format='%ae'`, `HEAD^!`])
  let userName = await git([`log`, `--format='%an'`, `HEAD^!`])

  await git([`config`, `--local`, `user.email`, userEmail.trim()])
  await git([`config`, `--local`, `user.name`, userName.trim()])

  Logger.info('git user.name set: ', await git([`config`, `user.name`]))
  Logger.info('git user.email set: ', await git([`config`, `user.email`]))

  // unstage all files to prevent committing unintended files
  await git([`restore`, `--staged`, `.`])

  for (let i = 0; i < paths.length; i++) {
    Logger.info('attempting to add: ', paths[i])
    await git([`add`, paths[i], '--force'])
  }

  const staged = await getGitStagedFiles()
  Logger.info(`staged ${staged} files`)
  if (staged.length <= 0) {
    Logger.info(`No staged files found. Exiting.`)
    return false
  }

  const commit = await git([
    `commit`,
    `-m`,
    `'${msg}'`,
    `-m`,
    `'* this commit was added through an automated script'`,
    `--no-verify`,
  ])
  Logger.info('committed:', commit)
}

module.exports = {
  commitGitChanges,
}
