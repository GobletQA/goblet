
import { dims } from '@theme'
import { Section } from '@components/Section'
import Grid2 from '@mui/material/Unstable_Grid2'
import Container from '@mui/material/Container'
import { Terminal } from '@components/Terminal'
import { CodeEditor } from '@components/CodeEditor'
import { Screencast } from '@components/Screencast'
import { Definitions } from '@components/Definitions'


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
  }
}

export default function Editor(props:TEditorProps){
  return (
    <Grid2
      container
      spacing={0}
      width={"100%"}
      alignItems="stretch"
      justifyContent="space-evenly"
    >
      <Grid2 xs={6} alignItems="stretch" >
        <Section sx={sectionStyles.full} >
          <Container
            disableGutters
            sx={{
              display: `flex`,
              overflow: `hidden`,
              position: `relative`,
              backgroundColor: `#2a2a2a`,
            }}
          >
            <CodeEditor/>
            <Definitions
              sx={{
                minHeight: `40px`,
                position: `absolute`,
                bottom: dims.footer.height,
              }}
            />
          </Container>
        </Section>
      </Grid2>
      <Grid2 xs={6} alignItems="stretch" >
        <Section sx={sectionStyles.half}>
          <Screencast
          />
        </Section>
        <Section sx={sectionStyles.half} >
          <Terminal
          />
        </Section>
      </Grid2>
    </Grid2>
  )
}

Editor.element = `Editor`
Editor.path = `/editor`