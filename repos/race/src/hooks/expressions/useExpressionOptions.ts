import type {
  TStepDef,
  TWorldConfig,
} from '@ltipton/parkin'
import type { TAutoOpt } from '@gobletqa/components'
import type { TExpOpts, TExpPart, TRaceStepParent, TRaceStep } from '@GBR/types'

import { useMemo } from 'react'
import { useWorld, useEditor } from '@GBR/contexts'
import { ExpAliasTag } from '@GBR/constants'
import {
  isStr,
  emptyArr,
  flatUnion
} from '@keg-hub/jsutils'

export type THExpressionOpts = {
  def:TStepDef
  step:TRaceStep
  expression:TExpPart
  parent:TRaceStepParent
  expressionOptions?:TAutoOpt[]
}


const useWorldAlias = (props:THExpressionOpts, world:TWorldConfig) => {
  const {
    expression
  } = props
  
  return useMemo(() => {
    let aliasVal:string|undefined=undefined

    const aliasOpts = Object.entries(world?.$alias)
      .map(([key]) => {
        const ref = `$$${key}`
        return {
          id: ref,
          key: ref,
          value: ref,
          label: `${ExpAliasTag}${key}`
        }
      })
      
    if(isStr(expression.value) && expression.value.startsWith(`$$`)){
      const found = aliasOpts.find(opt => opt.id === expression.value)
      if(found) aliasVal = found.label
    }

    return {
      aliasVal,
      aliasOpts
    }
  }, [
    world?.$alias,
    expression.value
  ])
}

const useExpOpts = (props:THExpressionOpts, expressionOptions?:TExpOpts) => {
  // TODO: Add logic for passed in expression options
  return {
    expVal: undefined,
    expOpts: expressionOptions
  }
}


export const useExpressionOptions = (props:THExpressionOpts) => {
  const { expression } = props

  const { world } = useWorld()
  const { expressionOptions } = useEditor()

  const { aliasVal, aliasOpts } = useWorldAlias(props, world)
  const { expVal, expOpts } = useExpOpts(props, expressionOptions)

  return useMemo(() => {
    const value = aliasVal || expVal || expression.value

    let expArr:TAutoOpt[] = emptyArr

    if(!aliasVal && !expVal && value)
      expArr = [{
        id: value,
        key: value,
        value: value,
        label: `${value}`,
      }]

    return {
      value,
      options: flatUnion<TAutoOpt>(
        expArr,
        aliasOpts,
        expOpts,
        (item:TAutoOpt) => item.id
      )
    }
  }, [
    expVal,
    expOpts,
    aliasVal,
    aliasOpts,
    expression.value,
  ])




}