import type { TAutoOptVal } from '@gobletqa/components'
import { useSteps }  from '@GBR/contexts/StepsContext'
import { useMemo } from 'react'

export const useStepOptions = () => {
  const {steps} = useSteps()

  return useMemo(() => {
    return Object.entries(steps).reduce((acc, [key, step]) => {
      const { race } = step.meta
      acc.push({
        id: key,
        label: race.name
      })
      return acc
    }, [] as TAutoOptVal[])
  }, [steps])

}