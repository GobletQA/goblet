import { TCodeEditorRef } from '../../types'
import type { MutableRefObject } from 'react'

// @ts-ignore
import TypesWorker from '../../workers/typings.worker?worker'
import { useEffect, useRef } from 'react'

export type TUseTypesWorker = {
  editorRef:TCodeEditorRef
}

export type TTypes = {
  onerror?: any
  onmessage?: any
  terminate: (...args:any[]) => void
  postMessage: (...args:any[]) => void
  addEventListener: (type: string, args:any) => void
} | null

// TODO: Add types checking
export const useTypesWorker = (props:TUseTypesWorker) => {
  const {
    editorRef
  } = props

  const typesWorkerRef = useRef(null as TTypes)

  useEffect(() => {
    typesWorkerRef.current = typesWorkerRef.current || new TypesWorker()

    typesWorkerRef?.current?.addEventListener?.('message', ({ data }: any) => {
      console.log(`------- types worker message -------`)
    })

    return () => {
      typesWorkerRef?.current && typesWorkerRef?.current?.terminate?.()
    }

  }, [])

  return [typesWorkerRef] as unknown as [MutableRefObject<TTypes>]

}