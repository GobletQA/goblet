import type { TTestRunEventState, TTestRunEventStages } from '@types'

import { useMemo } from 'react'

export const useEventState = (props:TTestRunEventStages) => {
  const { start, end } = props

  return useMemo(() => {
    const stats = end?.stats || start?.stats || {}
    const status = start && !end
      ? `running`
      : end?.status || (start?.status !== `unknown` ? start?.status : `loading`)

    return {
      stats,
      status,
      className: `gb-test-runs-line ${status}`
    } as TTestRunEventState
  }, [
    end,
    start,
  ])

}