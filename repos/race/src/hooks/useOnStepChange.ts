
import type { TStepParentAst, TStepAst } from '@GBR/types'
import type { TAutoOpt } from '@gobletqa/components'

import { useInline } from '@gobletqa/components'
import { useStepDefs }  from '@gobletqa/race/contexts/StepDefsContext'


export type THOnStepChange = {
  step:TStepAst
  onChange:(step:TStepAst, old?:TStepAst) => void
}

export const useOnStepChange = (props:THOnStepChange) => {
  const {
    step,
    onChange
  } = props

  const { defs } = useStepDefs()

  return useInline((evt:Event, opt:TAutoOpt) => {
    const found = defs[opt.id as keyof typeof defs]

    return !found
      ? console.error(`Can not find step`, opt, defs)
      : onChange?.({
          ...step,
          type: found.type,
          step: found.match,
          definition: found.uuid
        } as TStepAst, step)
  })
}