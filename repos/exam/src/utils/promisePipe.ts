import type { TUnaryFunction, TPipeline } from '@GEX/types'


export const promisePipe  = (...cbs:Array<TUnaryFunction<any, unknown>>):TPipeline<any, unknown> => {
  if (cbs.length === 0) throw new Error('Expected at least one argument')

  return async (input:any) => {
    let currentValue = input

    for (const cb of cbs)
      currentValue = await cb(currentValue)

    return currentValue
  }
}
