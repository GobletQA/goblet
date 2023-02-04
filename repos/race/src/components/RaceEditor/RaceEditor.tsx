import type { TRaceEditorProps } from '@GBR/types'

import { Editor } from './Editor'
import { FeatureProvider, StepDefsProvider } from '@GBR/contexts'
import { useInitialFeature } from '../../hooks/useInitialFeature'


export const RaceEditor = (props:TRaceEditorProps) => {
  const initialFeature = useInitialFeature({
    feature: props.feature,
    features: props.features,
    firstFeatureActive: props.firstFeatureActive,
  })

  return (
    <FeatureProvider initialFeature={initialFeature} >
      <StepDefsProvider defs={props.steps} >
        <Editor {...props} initialFeature={initialFeature} />
      </StepDefsProvider>
    </FeatureProvider>
  )

}



