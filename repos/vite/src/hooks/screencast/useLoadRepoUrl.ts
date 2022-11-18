
import { useCallback, useMemo } from 'react'
import { pageService } from '@services/pageService'
import { getWorldVal } from '@utils/repo/getWorldVal'

/**
 * Helper method to auto open the ap url in the screencast browser when it loads
 * @param {Object} repo - Repo metadata object from the store
 */
export const useLoadRepoUrl = (repo?:any) => {

  const repoUrl = useMemo(() => {
    return `http://www.gobletqa.com`
    // return `http://www.google.com`
    
    // return getWorldVal({
    //   location: `url`,
    //   fallback: `app.url`,
    //   repo
    // })
  }, [repo])

  const loadRepoUrl = useCallback(async () => {
    return repoUrl
      && await pageService.goto(repoUrl)
  }, [repoUrl])
  
  return [loadRepoUrl, repoUrl] as [(...args:any[]) => any, string]
  
}