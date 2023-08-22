import {isNum} from "@keg-hub/jsutils/isNum"
import {isStr} from "@keg-hub/jsutils/isStr"
import {isFunc} from "@keg-hub/jsutils/isFunc"

type THandler = (...args:any[]) => any

type TRetryMethod = {
  retry?:number
  sync?:boolean
  handler:THandler
  description:string
  method:(desc:string, handler:THandler) => any
}

const runTestAsync = (
  handler:THandler,
  retries:number=0,
) => {
  return async (...args:any[]) => {
    let lastError:Error
    for (let tries = 0; tries < retries; tries++) {
      try {
        await new Promise((resolve, reject) => {
          const result = handler((err:Error) => err ? reject(err): resolve(undefined))
          
          result && result.then
            ? result.catch(reject).then(resolve)
            : resolve(undefined)
        })

        return
      }
      catch(error) {
        lastError = error
      }
    }

    throw lastError
  }

}

const runTestSync = (
  handler:THandler,
  retries:number=0,
) => {
  return (...args:any[]) => {
    let lastError:Error
    for (let tries = 0; tries < retries; tries++) {
      try {
        handler(...args)
        return
      }
      catch(error) {
        lastError = error
      }
    }

    throw lastError
  }
}

export const retryMethod = async (opts:TRetryMethod) => {
  const {
    sync,
    retry,
    method,
    handler,
    description,
  } = opts

  if (!isStr(description))
    throw new Error(`Invalid argument, description must be a string`)

  if(!isFunc(handler))
    throw new Error(`Invalid argument, test handler function is required`)

  if(!method)
    throw new Error(`Invalid retry method; method to retry does not exist`)

  const retries = !isNum(retry) ? 0 : retry

  const wrapper = sync
    ? runTestSync(handler, retries)
    : runTestAsync(handler, retries)

  return method(description, wrapper)
}


export const describeRetry = (
  description:string,
  handler:(...args:any[]) => any,
  retry:number=0,
) => retryMethod({
    retry,
    handler,
    sync: true,
    description,
    method: global.describe,
  })

export const testRetry = (
  description:string,
  handler:(...args:any[]) => any,
  retry:number=0,
) => retryMethod({
    retry,
    handler,
    description,
    method: global.test
  })
