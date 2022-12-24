import type { TRaceEditorProps } from '@GBR/types'

import { Sidebar } from '../Sidebar'
import { Builder } from '../Builder'
import { Container, Divider } from './RaceEditor.styled'
import { useRaceEditor } from '../../hooks/useRaceEditor'
import { ModelProvider } from '../../contexts/ModelContext'

export const RaceEditor = (props:TRaceEditorProps) => {
  const { model, firstModelActive } = props
  const {
    stepsRef,
    modelsRef,
    onModelChangeRef,
    onModelUpdateRef,
    onModelBeforeChangeRef
  } = useRaceEditor(props)

  return (
    <ModelProvider
      onModelChangeRef={onModelChangeRef}
      onModelUpdateRef={onModelUpdateRef}
      onModelBeforeChangeRef={onModelBeforeChangeRef}
      initialModel={model || firstModelActive ? Object.values(modelsRef?.current)?.[0] : undefined}
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

