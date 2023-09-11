import type { TRaceStep } from '@GBR/types'
import type { TStepDef } from '@ltipton/parkin'
import type { TAutoOpt } from '@gobletqa/components'

import { useMemo, useRef } from 'react'
import { NoStepActionSelected } from '@GBR/constants/values'
import { useStepDefs }  from '@gobletqa/race/contexts/StepDefsContext'


export type THStepOptions = {
  step:TRaceStep
  def?: TStepDef
}

const emptyAction = {
  alias: [],
  type: `N/A`,
  label: `None`,
  id: NoStepActionSelected,
  info: `Select an action for this step...`
}

export const useStepOptions = (props?:THStepOptions) => {
  const { options:opts } = useStepDefs()
  const step = props?.step
  const definition = props?.def
  const activeRef = useRef<TAutoOpt>(emptyAction)

  const options = useMemo(() => {
    const found = opts.find(opt => definition?.uuid === opt?.uuid)
    if(found) activeRef.current = found

    return opts
  }, [
    opts,
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