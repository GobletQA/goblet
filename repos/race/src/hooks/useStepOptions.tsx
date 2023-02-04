import type { TAutoOptVal } from '@gobletqa/components'
import { useStepDefs }  from '@gobletqa/race/contexts/StepDefsContext'
import { useMemo } from 'react'

export const useStepOptions = () => {
  const {defs} = useStepDefs()

  return useMemo(() => {
    return Object.entries(defs).reduce((acc, [key, def]) => {
      const { race, name } = def.meta
      race
        && name
        && acc.push({ id: key, label: name })

      return acc
    }, [] as TAutoOptVal[])
  }, [defs])

}