import type { TRaceEditorProps } from '@GBR/types'

import { useEffect, useRef } from 'react'
import { Editor } from './Editor'
import { RaceContainer } from './RaceEditor.styled'
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
    firstFeatureActive: props.firstFeatureActive,
  })
  
  // This is a dumb hack for Chrome
  // If the 100% is set directly, the element position is mis-calculated
  // Works fine in all other browsers
  const raceRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    raceRef.current
      && (raceRef.current.style.height = `100%`)
  }, [])

  return (
    <RaceContainer
      ref={raceRef}
      className='gb-race-editor race-editor'
    >
      <SettingsProvider
        displayMeta={props.displayMeta}
      >
        <ParkinProvider
          defs={props.steps}
          world={props.world}
        >
          <FeatureProvider initialFeature={initialFeature} >
            <StepDefsProvider defs={props.steps} >
              <Editor {...props} initialFeature={initialFeature} />
            </StepDefsProvider>
          </FeatureProvider>
        </ParkinProvider>
      </SettingsProvider>
    </RaceContainer>
  )

}



