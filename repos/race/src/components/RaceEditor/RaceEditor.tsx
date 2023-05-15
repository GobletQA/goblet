import type { TRaceEditorProps } from '@GBR/types'

import { Editor } from './Editor'
import { useInitialFeature } from '@GBR/hooks/features/useInitialFeature'
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
    firstFeatureActive: props?.settings?.firstFeatureActive,
  })

  return (
    <SettingsProvider {...props?.settings} >
      <ParkinProvider
        defs={props.steps}
        world={props.world}
        onWorldChange={props.onWorldChange}
      >
        <FeatureProvider initialFeature={initialFeature} >
          <StepDefsProvider defs={props.steps} >
            <Editor {...props} initialFeature={initialFeature} />
          </StepDefsProvider>
        </FeatureProvider>
      </ParkinProvider>
    </SettingsProvider>
  )

}



