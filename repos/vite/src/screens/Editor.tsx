
import { dims } from '@theme'
import Box from '@mui/material/Box'
import { Section } from '@components/Section'
import Container from '@mui/material/Container'
import { Terminal } from '@components/Terminal'
import { CodeEditor } from '@components/CodeEditor'
import { Screencast } from '@components/Screencast'
import { Definitions } from '@components/Definitions'
import {
  Proportional,
  VerticalPageSplit,
  HorizontalPageSplit,
} from 'react-page-split'
import 'react-page-split/style.css'


// import ResizeObserver from "react-resize-observer"
      // <ResizeObserver
      //   onResize={onResizeCb}
      //   onPosition={onPositionCb}
      // />

export type TEditorProps = {
  
}



const fullHeight = {
  height: `calc( 100vh - ${dims.header.height + dims.footer.height}px)`,
}
const noOverflow = {
  ...fullHeight,
  overflow: `hidden`
}


/**
  <Definitions
    sx={{
      minHeight: `40px`,
      position: `absolute`,
      bottom: dims.footer.height,
    }}
  />

 */


export default function Editor(props:TEditorProps){
  return (
    <HorizontalPageSplit
      resize={Proportional}
    >
      <Container disableGutters sx={noOverflow}>
        <CodeEditor/>
      </Container>
      <Container disableGutters sx={fullHeight}>
        <VerticalPageSplit>
          <Screencast />
          <Terminal />
        </VerticalPageSplit>
      </Container>
    </HorizontalPageSplit>
  )
}

Editor.element = `Editor`
Editor.path = `/editor`