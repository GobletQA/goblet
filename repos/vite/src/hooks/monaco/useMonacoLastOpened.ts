import { useMemo } from 'react'
import { rmRootFromLoc } from '@utils/repo/rmRootFromLoc'
import { useLastOpened } from '@hooks/files/useLastOpened'

export const useMonacoLastOpened = (rootPrefix:string, files:Record<string, any>) => {
  const lastOpened = useLastOpened(files)

  return useMemo(
    () => lastOpened.map(loc => rmRootFromLoc(loc, rootPrefix)),
    [rootPrefix, lastOpened]
  )

}
