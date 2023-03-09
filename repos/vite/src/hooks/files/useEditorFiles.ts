import type { THEditorFiles } from '@types'

import { useMemo } from 'react'
import { noOpObj } from '@keg-hub/jsutils'
import { rmRootFromLoc } from '@utils/repo/rmRootFromLoc'

export const useEditorFiles = (props:THEditorFiles) => {
  const {
    repo,
    rootPrefix,
    repoFiles,
  } = props

  const files = useMemo(() => {
    if(!Object.values(repoFiles?.files || noOpObj).length) return {}

    return Object.entries(repoFiles?.files)
      .reduce((acc, [loc, model]) => {

        const key = rmRootFromLoc(loc, rootPrefix)
        acc[key] = model?.content || null

        return acc
      }, {} as Record<string, string|null>) ?? {}

  }, [
    rootPrefix,
    repo?.paths,
    repoFiles?.files,
  ])

  return {
    files,
    connected: Boolean(repo?.paths && repo?.name)
  }
}
