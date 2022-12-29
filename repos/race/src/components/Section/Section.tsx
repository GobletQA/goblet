import type { TSectionBody } from './SectionBody'
import type { TSectionHeader } from './SectionHeader'

import { Container } from './Section.styled'
import { SectionBody } from './SectionBody'
import { SectionHeader } from './SectionHeader'

export type TSection = TSectionBody & TSectionHeader & {

}

export const Section = (props:TSection) => {

  const {
    type,
    Icon,
    title,
    actions,
    children,
  } = props

  return (
    <Container className='gr-section' >
      <SectionHeader
        type={type}
        Icon={Icon}
        title={title}
        actions={actions}
      />
      <SectionBody
        type={type}
        children={children}
      />
    </Container>
  )
}