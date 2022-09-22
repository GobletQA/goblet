
import { dims } from '@theme'
import Box from '@mui/material/Box'
import { Section } from '@components/Section'
import Container from '@mui/material/Container'
import { Terminal } from '@components/Terminal'
import { CodeEditor } from '@components/CodeEditor'
import { Screencast } from '@components/Screencast'
import { Definitions } from '@components/Definitions'
import {
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

const sectionStyles = {
  full: {
    display: `flex`,
    minHeight: `100%`,
    alignItems: `stretch`,
  },
  half: {
    display: `flex`,
    minHeight: `50%`,
    alignItems: `stretch`,
  },
  panel: {
    display: `flex`,
    minHeight: `100%`,
    flexDirection: `column`,
  }
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
    >
        <Section sx={sectionStyles.full} >
          <Container
            disableGutters
            sx={{
              display: `flex`,
              overflow: `hidden`,
              position: `relative`,
              backgroundColor: `#2a2a2a`,
              // height: '100vh',
              height: `calc( 100vh - ${dims.header.height + dims.footer.height}px)`,
            }}
          >
            <CodeEditor/>
          </Container>
        </Section>
      <Section sx={sectionStyles.panel} >
        <Section sx={sectionStyles.half}>
          <Screencast
          />
        </Section>
        <Section sx={sectionStyles.half} >
          <Terminal
          />
        </Section>
      </Section>
    </HorizontalPageSplit>
  )
}

Editor.element = `Editor`
Editor.path = `/editor`