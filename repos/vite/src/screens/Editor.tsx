import { useState, useCallback } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import { Layout } from '@components/Layout'
import { colors } from '@theme'
import { Builder } from '@components/Builder'
import { CodeEditor } from '@components/CodeEditor'
import { Definitions } from '@components/Definitions'


/**
  <Definitions
    sx={{
      minHeight: `40px`,
      position: `absolute`,
      bottom: dims.footer.height,
    }}
  />
 */

enum EEditorTypes {
  code='code',
  builder='builder'
}

const EditorComps = {
  [EEditorTypes.builder]: Builder,
  [EEditorTypes.code]: CodeEditor
}


type TToggle = {
  editorType: EEditorTypes
  onToggle: (...args:any[])=> void
}

const RenderToggle = ({ onToggle, editorType }:TToggle) => {
  return (
    <Box sx={{ position: `relative`, zIndex: 1 }} >
      <Button
        sx={{
          top: 0,
          right: 0,
          position: `absolute`,
          backgroundColor: colors.white00
        }}
        onClick={onToggle}
      >
        {editorType === EEditorTypes.code ? `Builder` : `Code`}
      </Button>
    </Box>
  )
}

export type TEditorProps = {
  
}

export default function Editor(props:TEditorProps){
  const [editorType, setEditorType] = useState<EEditorTypes>(EEditorTypes.code)

  const toggleType = useCallback(() => {
    const updatedType = editorType === EEditorTypes.code
      ? EEditorTypes.builder
      : EEditorTypes.code
    
    setEditorType(updatedType)
  }, [editorType])

  const EditorComp = EditorComps[editorType]
  
  return (
    <Layout>
      {/* <RenderToggle
        onToggle={toggleType}
        editorType={editorType}
      /> */}
      <EditorComp />
    </Layout>
  )
}

Editor.element = `Editor`
Editor.path = `/editor`
