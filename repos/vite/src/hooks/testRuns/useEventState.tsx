import type { TTestRunEventState, TTestRunEventStages } from '@types'

import { useMemo } from 'react'
import {getEventStatus} from '@utils/testRuns/getEventStatus'

export const useEventState = (props:TTestRunEventStages={}, canceled?:boolean) => {
  const { start, end } = props

  return useMemo(() => {
    if(!start)
      return {
        stats: {},
        status: `unknown` as const,
        className: `gb-test-runs-line unknown`
      } as TTestRunEventState
    
    const stats = end?.stats || start?.stats || {}
    const status = getEventStatus({ start, end }, canceled)
    
    return {
      stats,
      status,
      className: `gb-test-runs-line ${status}`,
    } as TTestRunEventState
  }, [
    end,
    start,
    canceled
  ])

}
