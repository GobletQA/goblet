import type { TRaceEditorProps } from '@GBR/types'

import { Editor } from './Editor'
import { useInitialFeature } from '@GBR/hooks/features/useInitialFeature'
import {
  WorldProvider,
  FeatureProvider,
  StepDefsProvider,
  SettingsProvider,
  OperationsProvider,
} from '@GBR/contexts'

export const RaceEditor = (props:TRaceEditorProps) => {

  const initialFeature = useInitialFeature({
    features: props.features,
    openedFeatures: props.openedFeatures,
    firstFeatureActive: props?.settings?.firstFeatureActive,
  })

  return (
    <SettingsProvider
      {...props?.settings}
      onSettingChange={props.onSettingChange}
    >
      <OperationsProvider>
        <WorldProvider
          world={props.world}
          defs={props.definitions}
          onWorldChange={props.onWorldChange}
        >
          <FeatureProvider initialFeature={initialFeature} >
            <StepDefsProvider defs={props.definitions} >
              <Editor {...props} initialFeature={initialFeature} />
            </StepDefsProvider>
          </FeatureProvider>
        </WorldProvider>
      </OperationsProvider>
    </SettingsProvider>
  )

}



