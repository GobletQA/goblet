import type { TRaceEditorProps } from '@GBR/types'

import { Editor } from './Editor'
import { ParkinProvider, FeatureProvider, StepDefsProvider } from '@GBR/contexts'
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
        <ParkinProvider defs={props.steps} world={props.world} >
          <Editor {...props} initialFeature={initialFeature} />
        </ParkinProvider>
      </StepDefsProvider>
    </FeatureProvider>
  )

}



