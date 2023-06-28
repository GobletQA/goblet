

export const PromiseTimeout = async <T=any>(promise:Promise<T>, timeout:number) => {
  let timer:NodeJS.Timeout
  const timePromise = new Promise((resolve, reject) => {
    timer = setTimeout(() => reject(`Timed out after ${timeout} ms.`), timeout)
  })

  return await Promise.race([promise, timePromise])
    .finally(() => clearTimeout(timer))
}
