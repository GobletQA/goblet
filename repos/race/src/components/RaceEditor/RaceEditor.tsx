import type { TRaceEditorProps } from '@GBR/types'

import { Editor } from './Editor'
import { useInitialFeature } from '../../hooks/useInitialFeature'
import {
  ParkinProvider,
  FeatureProvider,
  StepDefsProvider,
  SettingsProvider,
} from '@GBR/contexts'

export const RaceEditor = (props:TRaceEditorProps) => {
  const initialFeature = useInitialFeature({
    feature: props.feature,
    features: props.features,
    firstFeatureActive: props.firstFeatureActive,
  })

  return (
    <SettingsProvider
      displayGeneral={props.displayGeneral}
    >
      <FeatureProvider initialFeature={initialFeature} >
        <StepDefsProvider defs={props.steps} >
          <ParkinProvider defs={props.steps} world={props.world} >
            <Editor {...props} initialFeature={initialFeature} />
          </ParkinProvider>
        </StepDefsProvider>
      </FeatureProvider>
    </SettingsProvider>
  )

}



