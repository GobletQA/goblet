import { useState, useCallback } from 'react'
import { Layout } from '@components/Layout'
import { Builder } from '@components/Builder'
import { CodeEditor } from '@components/CodeEditor'
import { DefinitionsSlider } from '@components/Definitions/DefinitionsSlider'

enum EEditorTypes {
  code='code',
  builder='builder'
}

const EditorComps = {
  [EEditorTypes.builder]: {
    Component: Builder,
    style: {}
  },
  [EEditorTypes.code]: {
    Component: CodeEditor,
    style: {
      maxHeight: `calc( 100% - 40px )`
    }
  }
}

export type TEditorProps = {}

export default function Editor(props:TEditorProps){
  const [editorType, setEditorType] = useState<EEditorTypes>(EEditorTypes.code)

  const toggleType = useCallback(() => {
    const updatedType = editorType === EEditorTypes.code
      ? EEditorTypes.builder
      : EEditorTypes.code
    
    setEditorType(updatedType)
  }, [editorType])

  const { Component, style } = EditorComps[editorType]

  return (
    <Layout>
      <Component style={style} />
      <DefinitionsSlider />
    </Layout>
  )
}

Editor.element = `Editor`
Editor.path = `/editor`
