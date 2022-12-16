import type { MutableRefObject } from 'react'
import type { TCodeEditorRef } from '../../types'
import { useRef } from 'react'

export type TUseLintWorker = {
  editorRef:TCodeEditorRef
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
  // TODO Add code linter

  return [lintWorkerRef] as unknown as [MutableRefObject<TLinter>]

}