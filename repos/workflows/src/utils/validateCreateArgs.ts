import type { TGitOpts } from '@gobletqa/git'
import { failResp } from '@GWF/goblet/response'


/**
 * Validates the passed in request options are valid
 */
export const validateCreateArgs = (token:string|boolean, gitOpts?:TGitOpts) => {
  
  const failOpts = { setup: false, mounted: false, status: `unknown` }
  let message:string
  
  if(!gitOpts?.branch) message = `A git branch name is required`
  if(!gitOpts?.username) message = `A git user name is required`
  if(!gitOpts?.name) message = `A git repository name is required`
  if (token === false) message = `Failed repo mount. Improper git validation`

  return message && failResp(failOpts, message)
}
