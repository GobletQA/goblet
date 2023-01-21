import type { TBranchMeta, TGitOpts } from '../types'

import { GitApi } from './gitApi'
import { Logger } from '@keg-hub/cli-utils'

const getActiveBranch = (opts:TGitOpts) => {
  return opts.branchFrom && opts.newBranch ? opts.newBranch : opts.branch
}

/**
 * Create the branch from the passed in newBranch name
 * Uses branch as the base branch, to branch from
 * - Or calls gitApi.defaultBranch if branch does not exist
 */
const createBranchFrom = async (gitApi:GitApi, opts:TGitOpts) => {
  const { newBranch, branch, repoName } = opts
  
  let baseBranchMeta = branch && await gitApi.getBranch(branch)
  if(!baseBranchMeta){
    
    const defBranchName = await gitApi.defaultBranch(repoName)
    Logger.log(`Got repo ${repoName} default branch ${defBranchName}`)
    baseBranchMeta = await gitApi.getBranch(defBranchName)
  }

  !baseBranchMeta
    && GitApi.error(`Base branch ${branch} sha does not exist`, repoName, branch, newBranch)

  const hash = (baseBranchMeta as TBranchMeta)?.commit.sha
  !hash
    && GitApi.error(`Base branch ${branch} sha does not exist`, baseBranchMeta)

  const createdBranch = await gitApi.createBranch(newBranch, { hash })

  return createdBranch
}

/**
 * Ensures the existing branch exists
 * If exists - returns it's name
 * If does not exists - creates it from default branch by calling createBranchFrom
 */
const gitExistingBranch = async (gitApi:GitApi, opts:TGitOpts) => {

  const { branch } = opts
  Logger.log(`Using existing or default branch ${branch}...`)

  const branchMeta = await gitApi.getBranch(branch)

  return branchMeta
    ? branchMeta.name
    : createBranchFrom(gitApi, {
        ...opts,
        branch: undefined,
        newBranch: branch,
      })
}

/**
 * Checks if a branch exists by calling gitApi.getBranch
 * - If it does exist, then returns the branches name
 * - If it does NOT exit, then calls createBranchFrom 
 */
export const ensureBranchExists = async (gitApi:GitApi, opts:TGitOpts) => {
  const {
    newBranch,
    branchFrom,
  } = opts

  const branch = getActiveBranch(opts)
  const existingBranch = await gitApi.getBranch(branch)

  if(existingBranch) return branch

  return branchFrom && newBranch
    ? await createBranchFrom(gitApi, opts)
    : await gitExistingBranch(gitApi, opts)
}