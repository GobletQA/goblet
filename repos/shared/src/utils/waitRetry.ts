import { wait } from '@keg-hub/jsutils'

/**
 * Attempts calling the passed in callback relative to the passed in number of attempts
 * Between each failed call will wait the `waitTime` amount mili seconds
 * Only retries if the callback throws an error
 */
export const waitRetry = async (
  cb:(...args:any[])=> any,
  attempts:number=3,
  waitTime:number=3000
) => {
  try {
    return await cb(attempts)
  }
  catch(err){
    if(!attempts) throw err

    await wait(waitTime)

    return waitRetry(cb, attempts-=1, waitTime)
  }
}