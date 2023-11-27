
import { useCallback, useMemo, useRef } from 'react'

import { pageService } from '@services/pageService'
import { getWorldVal } from '@utils/repo/getWorldVal'
import { useOnEvent, useInline } from '@gobletqa/components'
import { GobletQAUrl, BrowserResetUrlEvt } from '@constants'

/**
 * Helper method to auto open the ap url in the screencast browser when it loads
 * @param {Object} repo - Repo metadata object from the store
 */
export const useLoadRepoUrl = (repo?:any) => {

  const urlSetRef = useRef<boolean>(false)
  useOnEvent(BrowserResetUrlEvt, () => urlSetRef.current = false)

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
    // If initial URL has been set, don't set it again
    if(urlSetRef.current) return
    urlSetRef.current = true

    return repoUrl
      && await pageService.goto(repoUrl)
  }, [repoUrl])

  return [loadRepoUrl, repoUrl] as [() => void, string]

}
