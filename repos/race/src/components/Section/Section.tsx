import type { TSectionBody } from './SectionBody'
import type { TSectionHeader } from './SectionHeader'

import { Container } from './Section.styled'
import { SectionBody } from './SectionBody'
import { SectionHeader } from './SectionHeader'

export type TSection = TSectionBody & TSectionHeader & {
  
}

export const Section = (props:TSection) => {

  return (
    <Container>
      <SectionHeader
      />
      <SectionBody
      />
    </Container>
  )
}