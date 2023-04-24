import type {
  TStepDef,
  TWorldConfig,
} from '@ltipton/parkin'
import type { TAutoOpt } from '@gobletqa/components'
import type { TExpOpts, TExpPart, TRaceStepParent, TRaceStep } from '@GBR/types'

import { useMemo, useState, useEffect } from 'react'
import { useParkin, useEditor } from '@GBR/contexts'
import { iife, isArr, emptyArr, isFunc } from '@keg-hub/jsutils'

export type THExpressionOpts = {
  def:TStepDef
  step:TRaceStep
  expression:TExpPart
  parent:TRaceStepParent
  expressionOptions?:TAutoOpt[]
}


const useWorldAlias = (world:TWorldConfig) => {
  return useMemo(() => {
    return Object.entries(world?.$alias).map(([key, value]) => {
      return {
        key,
        id: key,
        value: `$$${key}`,
        label: `Alias: ${key} - ${value}`
      }
    })
  }, [world?.$alias])
}

const useExpOpts = (props:THExpressionOpts, expressionOptions?:TExpOpts) => {
  const {
    def,
    step,
    parent,
    expression
  } = props

  const options = isArr<TAutoOpt>(expressionOptions)
    ? expressionOptions
    : emptyArr

  const [expOpts, setExpOpts] = useState<TAutoOpt[]>(options as TAutoOpt[])

  useEffect(() => {
    !expOpts.length
      && isFunc(expressionOptions)
      && iife(async () => {

          const opts = await expressionOptions({
            def,
            step,
            parent,
            expression
          })

          isArr<TAutoOpt>(opts) && setExpOpts(opts)

        })
  }, [
    // expOpts,
    // expression,
    // def?.uuid,
    // step?.uuid,
    // parent?.uuid,
    // expressionOptions
  ])

  return {
    expOpts,
    setExpOpts
  }
}


export const useExpressionOptions = (props:THExpressionOpts) => {
  const { world } = useParkin()
  const { expressionOptions } = useEditor()

  const aliasOpts = useWorldAlias(world)
  const { expOpts } = useExpOpts(props, expressionOptions)
  
  const options = [
    ...aliasOpts,
    ...expOpts,
  ]

  return {
    options
  }

}