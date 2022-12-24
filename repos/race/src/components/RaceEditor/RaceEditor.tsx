import type { TRaceEditorProps } from '@GBR/types'

import { Sidebar } from '../Sidebar'
import { Builder } from '../Builder'
import { Container, Divider } from './RaceEditor.styled'
import { useRaceEditor } from '../../hooks/useRaceEditor'
import { ModelProvider } from '../../contexts/ModelContext'

export const RaceEditor = (props:TRaceEditorProps) => {
  const {
    stepsRef,
    modelsRef,
    onModelChangeRef,
    onModelUpdateRef,
    onModelBeforeChangeRef
  } = useRaceEditor(props)

  return (
    <ModelProvider
      model={props.model}
      onModelChangeRef={onModelChangeRef}
      onModelUpdateRef={onModelUpdateRef}
      onModelBeforeChangeRef={onModelBeforeChangeRef}
    >
      <Container className='goblet-race-editor'>
        <Sidebar
          stepsRef={stepsRef}
          modelsRef={modelsRef}
        />
        <Divider className='goblet-race-divider' />
        <Builder
          stepsRef={stepsRef}
          modelsRef={modelsRef}
        />
      </Container>
    </ModelProvider>
  )
}

