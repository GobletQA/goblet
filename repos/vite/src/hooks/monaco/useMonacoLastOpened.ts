import { useMemo } from 'react'
import { rmRootFromLoc } from '@utils/repo/rmRootFromLoc'
import { useLastOpened } from '@hooks/files/useLastOpened'

export const useMonacoLastOpened = (rootPrefix:string, files:Record<string, any>) => {
  const lastOpened = useLastOpened(files)

  return useMemo(
    // Order of files is reversed because monaco opens them in reverse order
    // So to ensure the correct file is active, the arr has to be reverse here
    () => lastOpened.map(loc => rmRootFromLoc(loc, rootPrefix)).reverse(),
    [rootPrefix, lastOpened]
  )

}
