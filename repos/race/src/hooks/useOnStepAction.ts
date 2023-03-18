
import type { TRaceStep } from '@GBR/types'
import type { TAutoOpt } from '@gobletqa/components'

import { useInline } from '@gobletqa/components'
import { stepFactory } from '@GBR/factories/stepFactory'
import { useFeature } from '@GBR/contexts/FeatureContext'
import { useStepDefs }  from '@gobletqa/race/contexts/StepDefsContext'


export type THOnStepChange = {
  step:TRaceStep
  onChange:(step:TRaceStep, old?:TRaceStep) => void
}

export const useOnStepAction = (props:THOnStepChange) => {
  const {
    step,
    onChange
  } = props

  const { defs } = useStepDefs()
  const { feature } = useFeature()

  return useInline((evt:Event, opt:TAutoOpt|null) => {
    if(!feature) return

    // If no option, then it was cleared, so reset the step
    if(!opt) return onChange?.(stepFactory({ feature, step: { uuid: step.uuid} }), step)

    const found = defs[opt.id as keyof typeof defs]

    return !found
      ? console.error(`Can not find step`, opt, defs)
      : onChange?.({
          ...step,
          type: found.type,
          step: found.match,
          definition: found.uuid
        } as TRaceStep, step)
  })
}