
import { useCallback, useMemo } from 'react'

import { GobletQAUrl } from '@constants'
import { pageService } from '@services/pageService'
import { getWorldVal } from '@utils/repo/getWorldVal'

/**
 * Helper method to auto open the ap url in the screencast browser when it loads
 * @param {Object} repo - Repo metadata object from the store
 */
export const useLoadRepoUrl = (repo?:any) => {

  const repoUrl = useMemo(() => {
    const url = getWorldVal({
      repo,
      location: `url`,
      fallback: `app.url`,
      def: GobletQAUrl
    })

    return url && pageService.normalize(url)
  }, [repo])

  const loadRepoUrl = useCallback(async () => {
    return repoUrl
      && await pageService.goto(repoUrl)
  }, [repoUrl])
  
  return [loadRepoUrl, repoUrl] as [() => any, string]
  
}