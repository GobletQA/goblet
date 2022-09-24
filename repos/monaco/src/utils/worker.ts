import { PATHS } from '@constants'

export const worker = new Promise<Worker>(async resolve => {
  const codeString = await fetch(`${PATHS.assets}eslint.worker.js`).then(res => res.text())
  const localWorkerUrl = window.URL.createObjectURL(
    new Blob([codeString], {
      type: 'application/javascript',
    })
  )
  resolve(new Worker(localWorkerUrl))
})
