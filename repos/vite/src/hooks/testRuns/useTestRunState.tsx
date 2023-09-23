import type { TTestRunFileData } from '@types'

import { useMemo } from 'react'
import { TestRunFileRootEvtRef } from '@constants'

export const useTestRunState = (file:TTestRunFileData) => {
  const rootEvt = file?.events[TestRunFileRootEvtRef]
  return useMemo(() => {
    if(!rootEvt?.start)
      return {}
    
    return !rootEvt?.end
      ? {
          status: `running`,
          stats: rootEvt?.start?.stats,
          className: `gb-test-runs-line running`
        }
      : {
          stats: rootEvt?.end?.stats,
          status: rootEvt?.end?.status,
          className: `gb-test-runs-line ${rootEvt?.end?.status}`
        }
    
  }, [
    rootEvt?.end,
    rootEvt?.start,
  ])
  
}