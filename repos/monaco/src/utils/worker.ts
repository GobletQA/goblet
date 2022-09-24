import { PATHS } from '../constants'

export const worker = new Promise<Worker>(async resolve => {
  const codeString = await import('@gobletqa/monaco-public/eslint.worker.js')
  
  const localWorkerUrl = window.URL.createObjectURL(
    new Blob([codeString], {
      type: 'application/javascript',
    })
  )
  resolve(new Worker(localWorkerUrl))
})
