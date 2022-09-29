import type { ReactNode } from 'react'
import { dims } from '@theme'
import Container from '@mui/material/Container'
import { Terminal } from '@components/Terminal'
import { Screencast } from '@components/Screencast'
import {
  Proportional,
  VerticalPageSplit,
  HorizontalPageSplit,
} from 'react-page-split'
import 'react-page-split/style.css'


const fullHeight = {
  height: `calc( 100vh - ${dims.header.height + dims.footer.height}px)`,
}
const noOverflow = {
  ...fullHeight,
  overflow: `hidden`
}

export type TLayout = {
  children: ReactNode
}

export const Layout = (props:TLayout) => {
  return (
    <HorizontalPageSplit
      resize={Proportional}
    >
      <Container disableGutters sx={noOverflow}>
        {props.children}
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


