import { URL } from 'node:url'

/**
 * Gets the name of the repo from the remote url
 * Uses the last part of the pathname to extract repo name
 * Also removes .git if it exists
 */
export const getRepoName = (remote:string) => {
  const url = new URL(remote)
  return url.pathname.split('/').pop().replace('.git', '')
}
