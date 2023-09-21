import { useApp } from '@store'
import { EEditorType } from '@types'
import { SubNavId } from '@constants'
import { Layout } from '@components/Layout'
import { TestRuns }  from '@components/TestRuns'
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
  const { testRunsView, editor, sidebarLocked } = useApp()
  const { Component, ...rest } = testRunsView ? { Component: TestRuns } : EditorComps[editor]

  return (
    <Layout>
      <Component
        portal={!sidebarLocked ? SubNavId : ``}
        style={style}
        {...rest}
      />
      <DefinitionsSlider />
    </Layout>
  )
}

Editor.element = `Editor`
Editor.path = `/editor`
