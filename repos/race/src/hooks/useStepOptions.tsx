import type { TAutoOptVal } from '@gobletqa/components'
import { useStepDefs }  from '@gobletqa/race/contexts/StepDefsContext'
import { useMemo } from 'react'

export const useStepOptions = () => {
  const {defs} = useStepDefs()

  return useMemo(() => {
    return Object.entries(defs).reduce((acc, [key, def]) => {

      const {
        info,
        race,
        name,
        alias,
        description,
      } = def.meta

      race
        && name
        && acc.push({
            alias,
            id: key,
            label: name,
            type: def.type,
            info: info || description,
          })

      return acc
    }, [] as TAutoOptVal[])
  }, [defs])

}