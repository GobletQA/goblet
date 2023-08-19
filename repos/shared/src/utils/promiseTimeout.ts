

export const PromiseTimeout = async <T=any>(
  promise:Promise<T>,
  timeout:number,
  message:string=`Timed out after ${timeout} ms.`
) => {
  let timer:NodeJS.Timeout
  const timePromise = new Promise((resolve, reject) => {
    timer = setTimeout(() => reject(message), timeout)
  })

  return await Promise.race([promise, timePromise])
    .finally(() => clearTimeout(timer))
}
