import type { TRaceStep } from '@GBR/types'
import type { TStepDef } from '@ltipton/parkin'
import type { TAutoOptVal } from '@gobletqa/components'

import { useMemo, useRef } from 'react'
import { NoStepActionSelected } from '@GBR/constants/values'
import { useStepDefs }  from '@gobletqa/race/contexts/StepDefsContext'


export type THStepOptions = {
  step:TRaceStep
  definition?: TStepDef
}

const emptyAction = {
  alias: [],
  type: `N/A`,
  label: `None`,
  id: NoStepActionSelected,
  info: `Select an action for this step...`
}

export const useStepOptions = (props?:THStepOptions) => {
  const {defs} = useStepDefs()
  const step = props?.step
  const definition = props?.definition
  const activeRef = useRef<TAutoOptVal>(emptyAction)

  const options = useMemo(() => {
    const opts = Object.entries(defs).reduce((acc, [key, def], idx) => {
      const {
        info,
        race,
        name,
        alias,
        description,
      } = def.meta

      if(!race || !name) return acc

      const option = {
        alias,
        id: key,
        label: name,
        type: def.type,
        info: info || description,
      }

      if(definition?.uuid === def?.uuid) activeRef.current = option

      acc.push(option)

      return acc
    }, [emptyAction] as TAutoOptVal[])

    return opts
  }, [
    defs,
    step?.step,
    emptyAction,
    step?.definition,
    definition?.uuid,
  ])

  return {
    options,
    active: activeRef.current
  }

}