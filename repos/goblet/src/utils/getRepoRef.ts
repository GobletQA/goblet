import { execSync } from 'child_process'
import { ENVS } from '@gobletqa/environment'

type TTokenProps = {
  ref?:string
  root:string
  remote?:string
}

/**
 * Gets the git repo remote url
 */
const gitCmd = (repoRoot:string, ref:string) => execSync(
  `git config --get remote.${ENVS.GB_GIT_REMOTE_REF}.url`,
  { cwd: repoRoot }
)?.toString()?.trim()


/**
 * By default uses the repos `/org/repo-name` to set the $ref
 * This makes it more transferable then using the full remote
 * But really the ref could be anything, as long as it exists and is consistent
 */
export const buildRefFromRemote = (remote:string) => {
  const url = new URL(remote)
  return url.pathname.replace(/\.git$/, ``)
}

export const ensureURLIsRef = (remote:string) => {
  const trimmed = remote?.trim?.()
  return trimmed?.endsWith?.(`.git`) ? buildRefFromRemote(trimmed) : trimmed
}

/**
 * Checks the ENV for a repo remote
 * If none exists, then tried to use git to load the remote url
 */
const getGitRemoteRef = (repoRoot:string) => {
  let url = (process.env.GB_GIT_REPO_REMOTE || ``).trim()
  if(url) return url

  try {
    try {url = gitCmd(repoRoot, ENVS.GB_GIT_REMOTE_REF)}
    catch(err){ url = gitCmd(repoRoot, `origin`)}
  }
  catch(err){
    console.log(`[ENV LOADER] Failed to get goblet repo remote url`)
    console.log(err.message)
    return ``
  }

  return buildRefFromRemote(url)
}

export const getRepoRef = ({ref, remote, root}:TTokenProps) => {

  const existingRef = ref || ENVS.GB_REPO_CONFIG_REF
  if(existingRef) return ensureURLIsRef(existingRef)

  const existingRemote = remote || ENVS.GB_GIT_REPO_REMOTE
  if(existingRemote) return ensureURLIsRef(existingRemote)

  return getGitRemoteRef(root)
}

