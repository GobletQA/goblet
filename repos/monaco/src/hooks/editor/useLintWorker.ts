import type { MutableRefObject } from 'react'
import type { editor } from 'monaco-editor'
import { useEffect, useRef } from 'react'
// @ts-ignore
import ESLintWorker from '../../workers/eslint.worker?worker'

export type TUseLintWorker = {
  editorRef:MutableRefObject<editor.IStandaloneCodeEditor | null>
}

export type TLinter = {
  onerror?: any
  onmessage?: any
  terminate: (...args:any[]) => void
  postMessage: (...args:any[]) => void
  addEventListener: (type: string, args:any) => void
} | null

export const useLintWorker = (props:TUseLintWorker) => {
  const {
    editorRef
  } = props

  const lintWorkerRef = useRef(null as TLinter)

  useEffect(() => {
    lintWorkerRef.current = lintWorkerRef.current || new ESLintWorker()

    lintWorkerRef?.current?.addEventListener?.('message', ({ data }: any) => {
      const { markers, version } = data
      const model = editorRef.current?.getModel()
      if (model && model.getVersionId() === version)
        window.monaco.editor.setModelMarkers(model, 'eslint', markers)
    })

    return () => {
      lintWorkerRef?.current && lintWorkerRef?.current?.terminate?.()
    }

  }, [])

  return [lintWorkerRef] as unknown as [MutableRefObject<TLinter>]

}