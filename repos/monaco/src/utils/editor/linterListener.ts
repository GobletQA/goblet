import type { editor } from 'monaco-editor'
import type { MutableRefObject } from 'react'
import type { TLinter } from '@GBM/hooks/editor/useLintWorker'


export const updateLinter = (
  loc:string,
  model:editor.ITextModel,
  lintWorkerRef?:MutableRefObject<TLinter>,
) => {
  lintWorkerRef?.current?.postMessage({
    path: loc,
    code: model.getValue(),
    version: model.getVersionId(),
  })

}

export const resetTimer = (
  timer:any,
  loc:string,
  model:editor.ITextModel,
  lintWorkerRef?:MutableRefObject<TLinter>
) => {
  if (timer) clearTimeout(timer)
  timer = setTimeout(() => {
    timer = null
    updateLinter(loc, model, lintWorkerRef)
  }, 500)
}
