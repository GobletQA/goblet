import type { TTestRunEventState, TTestRunEventStages } from '@types'

import { useMemo } from 'react'

export const useEventState = (props:TTestRunEventStages, canceled?:boolean) => {
  const { start, end } = props

  return useMemo(() => {
    const stats = end?.stats || start?.stats || {}
    const evtStatus = start && !end
      ? `running`
      : end?.status || (start?.status !== `unknown` ? start?.status : `loading`)

    const status = canceled && evtStatus !== `passed` && evtStatus !== `failed`
      ? `canceled`
      : evtStatus

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