import { useState } from 'react'
import { CodeEditor } from '@components/CodeEditor'
import { Builder } from '@components/Builder'
import { Definitions } from '@components/Definitions'
import { Layout } from '@components/Layout'

// Builder


// import ResizeObserver from "react-resize-observer"
      // <ResizeObserver
      //   onResize={onResizeCb}
      //   onPosition={onPositionCb}
      // />


/**
  <Definitions
    sx={{
      minHeight: `40px`,
      position: `absolute`,
      bottom: dims.footer.height,
    }}
  />
 */


export type TEditorProps = {
  
}

export default function Editor(props:TEditorProps){
  const [editorType, setEditorType] = useState<string>(`code`)

  return (
    <Layout>
      {
        editorType === `code`
          ? (<CodeEditor />)
          : (<Builder />)
      }
    </Layout>
  )
}

Editor.element = `Editor`
Editor.path = `/editor`
