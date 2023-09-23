import type { FocusEvent } from 'react'
import type { TTestRunUICfg } from '@types'

import { exists, flatUnion, noOp, toBool, toNum } from '@keg-hub/jsutils'

export const TestCfgUpdaters = {
  tags: {
    onBlur: (evt:FocusEvent, testRunCfg:TTestRunUICfg) => {
      const value = (evt.target as HTMLInputElement).value || ``
      if(!value) return undefined

      const formatted = value.split(` `)
        .reduce((tags, item) => {
          const cleaned = item.trim()
          if(!cleaned) return tags

          const tag = cleaned.startsWith(`@`) ? cleaned : `@${cleaned}`
          !tags.includes(tag) && tags.push(tag)
          
          return tags
        }, [] as string[])

      const tags = flatUnion(testRunCfg.tags, formatted)

      return { tags }
    },
    onChange: (
      evt:any,
      value:string|string[],
      reason:string,
      opt:any,
      testRunCfg:TTestRunUICfg
    ) => {
      return reason === `removeOption`
        ? { tags: value }
        : undefined
    }
  },
  testBail: {
    onChange: noOp,
    onBlur: (evt:FocusEvent) => {
      const value = (evt.target as HTMLInputElement).value
      if(!value) return undefined

      const testBail = toNum(value)
      return testBail > -1 ? { testBail } : undefined
    },
  },
  testRetry: {
    onChange: noOp,
    onBlur: (evt:FocusEvent) => {
      const value = (evt.target as HTMLInputElement).value
      if(!value) return undefined

      const testRetry = toNum(value)
      return testRetry > -1 ? { testRetry } : undefined
    },
  },
  suiteRetry: {
    onChange: noOp,
    onBlur: (evt:FocusEvent) => {
      const value = (evt.target as HTMLInputElement).value
      if(!value) return undefined

      const suiteRetry = toNum(value)
      return suiteRetry > -1 ? { suiteRetry } : undefined
    },
  },
  exitOnFailed: {
    onChange: (_:any, value:string, __:any, ___:any) => {
      if(!exists(value)) return undefined

      return { exitOnFailed: toBool(value) }
    },
    onBlur: noOp,
  },
  slowMo: {
    onChange: noOp,
    onBlur: (evt:FocusEvent) => {
      const value = (evt.target as HTMLInputElement).value
      if(!value) return undefined

      const slowMo = toNum(value)
      return slowMo > -1 ? { slowMo } : undefined
    },
  },
  
}