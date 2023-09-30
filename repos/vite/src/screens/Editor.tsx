import { useApp } from '@store'
import { EEditorType } from '@types'
import { SubNavId } from '@constants'
import { Layout } from '@components/Layout'
import { JokerAI } from '@components/JokerAI'
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

const SubComponents = {
  TestRuns:TestRuns,
  JokerAI:JokerAI,
  Definitions:DefinitionsSlider
}


export type TEditorProps = {}

export default function Editor(props:TEditorProps){
  const {
    editor,
    jokerAIView,
    testRunsView,
    sidebarLocked
  } = useApp()
  const {
    Component,
    ...rest
  } = EditorComps[editor]
  
  const SubComponent = testRunsView
    ? SubComponents.TestRuns
    : jokerAIView
      ? SubComponents.JokerAI
      : SubComponents.Definitions

  return (
    <Layout>
      <Component
        portal={!sidebarLocked ? SubNavId : ``}
        style={style}
        {...rest}
      />
      <SubComponent />
    </Layout>
  )
}

Editor.element = `Editor`
Editor.path = `/editor`
