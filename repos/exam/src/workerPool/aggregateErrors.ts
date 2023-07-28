import type { TMaybeErr, TIndentStrOpts } from '@GEX/types'

import { cleanStack } from './cleanStack'
import {isArr, isObj, isStr} from '@keg-hub/jsutils'

const indentString = (
  str:string,
  count:number=1,
  options:TIndentStrOpts = {}
) => {
  const {
    indent=' ',
    includeEmptyLines=false
  } = options

  if (count === 0) return str

  const regex = includeEmptyLines ? /^/gm : /^(?!\s*$)/gm
  return str.replace(regex, indent.repeat(count))
}


const cleanInternalStack = (stack:string) => stack.replace(/\s+at .*aggregate-error\/index.js:\d+:\d+\)?/g, '')

const loopErrors = (errors:TMaybeErr[]) => {
  return errors.map((error:TMaybeErr) => {
    return error instanceof Error
      ? error
      : isObj(error)
        ? Object.assign(new Error(error.message), error)
        : new Error(error)
  })
}

const buildMsg = (errors:Error[]) => {
  const message = errors.map((error:Error) => {
    return isStr(error.stack)
      && error.stack.length > 0
        ? cleanInternalStack(cleanStack(error.stack))
        : String(error)
  }).join('\n')
  
  return '\n' + indentString(message, 2)
}

export default class AggregateError extends Error {
  #errors:Error[]

  name = 'AggregateError'

  constructor(errs:TMaybeErr[]) {
    if (!isArr(errs))
      throw new TypeError(`Expected input to be an Array, got ${typeof errs}`)

    const errors = loopErrors(errs)

    super(buildMsg(errors))

    this.#errors = errors
  }

  get errors() {
    return this.#errors.slice()
  }
}