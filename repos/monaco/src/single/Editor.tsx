// @ts-nocheck
/* eslint-disable */
import React, { useEffect, useRef, useState, useLayoutEffect } from 'react'
import * as monacoType from 'monaco-editor'

export interface EditorIProps {
  defaultValue?: string
  value?: string
  language?: string
  onValueChange?: (v: string) => void
  options?: monacoType.editor.IStandaloneEditorConstructionOptions
}

export const EditorComp: React.FC<EditorIProps> = ({
  defaultValue,
  value,
  language,
  onValueChange,
  options,
}) => {
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null)
  const editorNodeRef = useRef<HTMLDivElement>(null)
  const [innerValue, setInnerValue] = useState(defaultValue)
  const needChangeRef = useRef(true)

  useLayoutEffect(() => {
    editorRef.current = monaco.editor.create(editorNodeRef.current!, options)
    const model = monaco.editor.createModel(innerValue || '', language)
    editorRef.current.setModel(model)

    const sub = model.onDidChangeContent(() => {
      const v = model.getValue()
      if (onValueChange && value !== undefined && needChangeRef.current) {
        onValueChange(v)
      } else {
        setInnerValue(v)
      }
    })

    return () => {
      if (editorRef.current) {
        editorRef.current.dispose()
      }
      sub.dispose()
    }
  }, [])

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.updateOptions(options || {})
    }
  }, [options])

  const realValue = value !== undefined ? value : innerValue
  if (editorRef.current) {
    const model = editorRef.current.getModel()
    if (realValue !== model?.getValue()) {
      needChangeRef.current = false
      model!.pushEditOperations(
        [],
        [
          {
            range: model!.getFullModelRange(),
            text: realValue || '',
          },
        ],
        () => null
      )
    } else {
      needChangeRef.current = true
    }
  }

  return <div ref={editorNodeRef} style={{ width: '800px', height: '600px' }} />
}

export default EditorComp
