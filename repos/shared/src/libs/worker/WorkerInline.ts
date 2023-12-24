import { Worker } from 'worker_threads'
import { noOp } from '@keg-hub/jsutils/noOp'

export type TWorkerInlineCB = (...params:any[]) => any


const runWorker = (
  cb:TWorkerInlineCB=noOp,
  args:Record<any, any>
) => {
  return new Worker(`
      const { workerData, parentPort } = require('worker_threads')
      Promise.res((${cb.toString()})(...workerData))
      .then((value) => {
        parentPort.postMessage({ error: null, data: value })
      }).catch((error) => {
        parentPort.postMessage({ error: new Error("Error in worker execution: " + error.message), data: null })
      })
  `, {eval: true, workerData: args})
}

export const WorkerInline = (
  cb:TWorkerInlineCB=noOp,
  args:Record<any, any>
) => {
  return new Promise((res, rej) => {
    try {

      const worker = runWorker(cb, args)

      worker.once(`message`, (value: any) => {
        const { error, data } = value
        error ? rej(error) : res(data)
        worker.terminate()
      })

      worker.once(`error`, (error: any) => {
        error.message = `Error in worker execution: ` + error.message
        rej(error)
        worker.terminate()
      })

      worker.once(`exit`, (exitCode: any) => exitCode != 0 && rej(`Worker process exit code: ${exitCode}`))

    }
    catch (error) {
      rej(error)
    }
  })
}


