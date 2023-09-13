
import type { TAutoOpt } from '@gobletqa/components'
import type { TExpPart, TRaceStep, TRaceStepParent } from '@GBR/types'

import { useInline } from '@gobletqa/components'
import { stepFactory } from '@GBR/factories/stepFactory'
import { useFeature } from '@GBR/contexts/FeatureContext'
import { NoStepActionSelected } from '@GBR/constants/values'
import { useStepDefs }  from '@gobletqa/race/contexts/StepDefsContext'
import {exists} from '@keg-hub/jsutils'
import {TStepDef} from '@ltipton/parkin'


export type THOnStepChange = {
  step:TRaceStep
  parent:TRaceStepParent
  expressions?:TExpPart[]
  onChange:(step:TRaceStep, old?:TRaceStep) => void
}

type TCopyOverExps = {
  def:TStepDef
  expressions?:TExpPart[]
}

/**
 * TODO: update to build the match string
 */
const copyOverExps = (props:TCopyOverExps) => {
  const {
    def,
    expressions
  } = props

  let match = def.match
  const exps = def?.meta?.expressions
  if(expressions?.length && exps?.length){
    const copyOver:any[] = []
    // Map existing expressions to exps based on type and kind of existing
    expressions.forEach(existing => {
      let matched = false
      exists(existing.value)
        && existing.kind
        && existing.type
        && exps.forEach((exp, idx) => {
            if(matched || existing.paramType !== exp.type || existing.kind !== exp.kind) return

            copyOver[idx] = { value: existing.value, ...exp }
            matched = true
          })
    })

    // TODO: Need to replace the `def.match` expressions with the values from the existing
    // copyOver contains the value of the existing expression value at the Array index of the new expression
    // This allows know which exps have values to copy over, and which exps don't aline with existing
    copyOver.length
      && copyOver.forEach(item => {
        if(!item) return
        
        // TODO: this needs some work
        // It will always match the first instance found
        // It will not match the correct index
        // If an index is missing, the wrong expression will be replaced
        const regexp = new RegExp(`{\s*${item.type}\s*}`, `i`)
        item && (match = match.toString().replace(regexp, `'${item.value}'`))
      })
  }

  return match
}

export const useOnStepAction = (props:THOnStepChange) => {
  const {
    step,
    parent,
    onChange,
    expressions,
  } = props

  const { defs } = useStepDefs()
  const { feature } = useFeature()

  return useInline((evt:Event, opt:TAutoOpt|null) => {
    if(!feature) return

    // If no option, then it was cleared, so reset the step
    if(!opt || opt.id === NoStepActionSelected)
      return onChange?.(stepFactory({ feature, parent, step: {uuid: step.uuid} }), step)

    const found = defs[opt.id as keyof typeof defs]
    if(!found) return console.warn(`Can not find step definition`, opt, defs)

    // const matchStr = copyOverExps({ def: found, expressions })

    return onChange?.({
      ...step,
      type: found.type,
      definition: found.uuid,
      step: found.match,
      // step: matchStr || found.match,
    } as TRaceStep, step)
  })
}