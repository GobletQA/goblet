type TRes<T> = (result:T) => void
type TRej = (reason?:any)=>void

export type TPromiseAbortCB<T=any> = (res:TRes<T>, rej:TRej) => void

export type TProm<T> = Promise<T> & {
  cancel: () => void
}

export type TPromiseAbort = <T>(callback:TPromiseAbortCB<T>) => TProm<T>


export type TPAborted = {
  canceled: boolean
}

const PromiseWrap = <T=any>(
  callback:TPromiseAbortCB<T>,
) => {

  const abort:TPAborted = { canceled: false }

  const cbProm = new Promise<T>(callback)
  const promise = new Promise<T>(async (res, rej) => {
    cbProm.then(
      val => abort.canceled ? rej({canceled: true}) : res(val),
      error => abort.canceled ? rej({canceled: true}) : rej(error)
    )
    .catch(err => {
      if(!abort.canceled) throw err
    })
  })
  .catch(err => {
    if(!abort.canceled) throw err
  })

  // @ts-ignore
  promise.cancel = () => (abort.canceled = true)

  return promise
} 

export const PromiseAbort = PromiseWrap as TPromiseAbort
