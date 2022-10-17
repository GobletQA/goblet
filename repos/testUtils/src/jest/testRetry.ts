/**
 * TODO: This implements test retryies for Jest
 * Will also need to add a way to update the active reporter
 * So that if a tests passes on a retry the reporter captures that
 */

type THandler = (...args:any[]) => any

const runTest = (handler:THandler) => {
  return new Promise((resolve, reject) => {
    const result = handler((err) => err ? reject(err) : resolve(true))

    result && result.then
      ? result.catch(reject).then(resolve)
      : resolve(true)
  })
}


const validateArgs = (
  description:string,
  handler: THandler,
  retries:number=1,
) => {

  if (!description || typeof description !== 'string' || description.length < 1)
    throw new Error('Invalid argument, description must be a string')

  if (!retries || typeof retries !== 'number' || retries < 1)
    throw new Error('Invalid argument, retries must be a greater than 0')

}

export const retry = async (
  description:string,
  handler: THandler,
  retries:number=1,
) => {

  validateArgs(description, handler, retries)

  // This uses the global test
  // Would be better to either pass it in, or use the pattern in Parkin
  // Also may need to switch it to describe
  test(description, async () => {
    let latestError:Error
    for (let tries = 0; tries < retries; tries++) {
      try {
        await runTest(handler)
        return
      }
      catch(error:any) {
        latestError = error
      }
    }

    throw latestError
  })
}
