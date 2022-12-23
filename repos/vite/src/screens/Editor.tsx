import { dims } from '@theme'
import { useApp } from '@store'
import { EEditorType } from '@types'
import { Layout } from '@components/Layout'
import { CodeEditor } from '@components/CodeEditor'
import { VisualEditor } from '@components/VisualEditor'
import { DefinitionsSlider } from '@components/Definitions/DefinitionsSlider'

const style = {
  maxHeight: `calc( 100% - ${dims.defs.header.hpx} )`
}

const EditorComps = {
  [EEditorType.visual]: {
    Component: VisualEditor,
  },
  [EEditorType.code]: {
    Component: CodeEditor,
  }
}

export type TEditorProps = {}

export default function Editor(props:TEditorProps){
  const { editor } = useApp()
  const { Component, ...rest } = EditorComps[editor]

  return (
    <Layout>
      <Component style={style} {...rest} />
      <DefinitionsSlider />
    </Layout>
  )
}

Editor.element = `Editor`
Editor.path = `/editor`
