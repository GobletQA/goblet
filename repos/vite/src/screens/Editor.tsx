import { useApp } from '@store'
import { EEditorType } from '@types'
import { SubNavId } from '@constants'
import { Layout } from '@components/Layout'
import { dims } from '@gobletqa/components/theme'
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
      <Component
        // TODO: toggle this on off to lock the sidebar into the dom
        // Not the best solution, but may work for now?
        portal={SubNavId}
        style={style}
        {...rest}
      />
      <DefinitionsSlider />
    </Layout>
  )
}

Editor.element = `Editor`
Editor.path = `/editor`
