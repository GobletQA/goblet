
import type { TRaceStep } from '@GBR/types'
import type { TAutoOpt } from '@gobletqa/components'

import { useInline } from '@gobletqa/components'
import { stepFactory } from '@GBR/factories/stepFactory'
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

  return useInline((evt:Event, opt:TAutoOpt|null) => {
    // If no option, then it was cleared, so reset the step
    if(!opt) return onChange?.(stepFactory({ step: { uuid: step.uuid} }), step)

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