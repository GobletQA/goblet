import { ChangeEvent, useMemo, useState } from 'react'
import type { TStepDef } from '@ltipton/parkin'
import type { TAutoOpt } from '@gobletqa/components'
import type { TExpPart, TRaceStepParent, TRaceStep } from '@GBR/types'

import { useInline } from '@gobletqa/components'
import { ExpCtxMenuId } from '@GBR/constants/values'
import { removeQuotes } from '@GBR/utils/helpers/removeQuotes'
import { ExpAliasTag, ExpressionNoQuoteTypes } from '@GBR/constants'
import { isArr, exists, isNum, isStr } from '@keg-hub/jsutils'

export type TExpression = {
  def:TStepDef
  step: TRaceStep
  expression:TExpPart
  parent:TRaceStepParent
  onChange:(step:TRaceStep, old?:TRaceStep) => void
}

const numberTypes = Object.values(ExpressionNoQuoteTypes)

const formatVal = (val:string) => {
  const hasDouble = val.includes(`"`)
  const hasSingle = val.includes(`'`)

  // If the value has both single and double quotes
  if(hasSingle && hasDouble){
    /**
     * We wrap in single quotes, so if it has both single and double
     * Just escape the single, and leave the double
     * Looks something like
     *   - 'I dom\'t know what\'s "happening" in this code'
     * Playwright follows normal escaping rules
     * See here https://playwright.dev/docs/next/other-locators#legacy-text-locator
     */
    const quoted = val.replace(/[\\']/g, '\\$&')
    return `'${quoted}'`
  }

  const [type, replace] = hasSingle ? [`"`, `'`] : [`'`, `"`]

  return `${type}${val}${type}`
}

const getFixes = (
  step:string,
  expression:TExpPart,
  noQuotes:boolean
) => {
  const { index } = expression
  /**
   * If a value already exists for the expression
   * The use it to calculate the end of the string
   * If no value exists, then use the match text from the expression
   * In cases where we wrap the expression in quotes, we add 2 to the length
   * Only wrap for non-numbers
   */
  const postLength = expression?.value
    ? noQuotes
      ? `${expression.value}`.length
      : `${expression.value}`.length + 2
    : expression.text.length

  return {
    prefix:step.substring(0, index),
    postfix: step.substring(index + postLength)
  }
}

export const useExpressionChange = (props:TExpression) => {
  const {
    step,
    onChange,
    expression,
  } = props

  const onExpressionChange = useInline((evt:ChangeEvent<HTMLInputElement>, prop?:unknown) => {

    // Ensure only changes to the input || select update the expression
    const fromSelect = !exists(prop) || prop && !isStr(prop)
    const fromCtxMenu = evt.target?.parentElement?.id === ExpCtxMenuId
    
    if(fromCtxMenu || (!fromSelect && evt.target.tagName !== `INPUT`)){
      evt?.stopPropagation?.()
      evt?.preventDefault?.()
      return
    }

    const value = removeQuotes(evt.target.value || ``)

    if(value === expression.value) return

    const { text } = expression
    // Check if quotes should be added
    const noQuotes = Boolean(numberTypes.find(type => type === expression.type))

    const { postfix, prefix } = getFixes(step.step, expression, noQuotes)

    const replace = value && !isNum(value)
      ? noQuotes
        ? value
        : formatVal(value)
      : text

    const result = `${prefix}${replace}${postfix}`

    onChange?.({...step, step: result}, step)

  })
  
  return {
    onExpressionChange
  }
}
