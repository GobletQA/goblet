
import { useCallback, useMemo } from 'react'
import { pageService } from '@services/pageService'
import { getWorldVal } from '@utils/repo/getWorldVal'

/**
 * Helper method to auto open the ap url in the screencast browser when it loads
 * @param {Object} repo - Repo metadata object from the store
 */
export const useLoadRepoUrl = (repo?:any) => {

  const repoUrl = useMemo(() => {
    const url = `https://www.gobletqa.com`
    // const url = `https://www.google.com`
    
    // const url = getWorldVal({
    //   location: `url`,
    //   fallback: `app.url`,
    //   repo
    // })
    return pageService.normalize(url)
  }, [repo])

  const loadRepoUrl = useCallback(async () => {
    return repoUrl
      && await pageService.goto(repoUrl)
  }, [repoUrl])
  
  return [loadRepoUrl, repoUrl] as [() => any, string]
  
}