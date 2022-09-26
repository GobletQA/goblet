// @ts-ignore
import codeString from '!raw-loader!../workers/eslint.worker.js'

export const worker = new Promise<Worker>(async resolve => {
  const localWorkerUrl = window.URL.createObjectURL(
    new Blob([codeString], {
      type: 'application/javascript',
    })
  )
  resolve(new Worker(localWorkerUrl))
})
