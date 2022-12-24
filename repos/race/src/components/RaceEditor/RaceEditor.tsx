import type { TRaceEditorProps } from '@GBR/types'

import { Sidebar } from '../Sidebar'
import { Container } from './RaceEditor.styled'

export const RaceEditor = (props:TRaceEditorProps) => {
  const {
    steps,
    models
  } = props


  return (
    <Container>
      <Sidebar
        models={models}
      />
    </Container>
  )
}

