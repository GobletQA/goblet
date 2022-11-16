
import { useCallback, useMemo } from 'react'
import { getWorldVal } from '@utils/repo/getWorldVal'
import { actionBrowser } from '@actions/screencast/api/actionBrowser'

/**
 * Helper method to auto open the ap url in the screencast browser when it loads
 * @param {Object} repo - Repo metadata object from the store
 */
export const useLoadRepoUrl = (repo?:any) => {

  const repoUrl = useMemo(() => {
    return `http://www.gobletqa.com`
    
    // return getWorldVal({
    //   location: `url`,
    //   fallback: `app.url`,
    //   repo
    // })
  }, [repo])

  const loadRepoUrl = useCallback(() => {
    return repoUrl
      && actionBrowser({
        ref: 'page',
        actions: [{
          action: 'goto',
          props: [repoUrl],
        }],
      }, false)
    
  }, [repoUrl])
  
  return [loadRepoUrl, repoUrl] as [(...args:any[]) => any, string]
  
}