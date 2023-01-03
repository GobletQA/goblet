import type { TRaceEditorProps } from '@GBR/types'

import { EditorContainer } from './EditorContainer'
import { useRaceRefs } from '../../hooks/useRaceRefs'
import { useRaceTheme } from '../../hooks/useRaceTheme'
import { FeatureProvider, EditingProvider } from '@GBR/contexts'
import { useInitialFeature } from '../../hooks/useInitialFeature'


export const RaceEditor = (props:TRaceEditorProps) => {

  useRaceTheme(props)
  const initialFeature = useInitialFeature(props)

  const {
    stepsRef,
    editorRef,
    curPathRef,
    curValueRef,
    featuresRef,
    featureGroups,
    onFeatureClose,
    setFeatureRefs,
    onFeatureChange,
    setFeatureGroups,
    onFeatureActive,
    onFeatureInactive,
    onBeforeFeatureChange,
  } = useRaceRefs(props, { initialFeature })

  return (
    <FeatureProvider
      featuresRef={featuresRef}
      rootPrefix={props.rootPrefix}
      onFeatureClose={onFeatureClose}
      initialFeature={initialFeature}
      setFeatureRefs={setFeatureRefs}
      onFeatureChange={onFeatureChange}
      onFeatureActive={onFeatureActive}
      setFeatureGroups={setFeatureGroups}
      onFeatureInactive={onFeatureInactive}
      onBeforeFeatureChange={onBeforeFeatureChange}
    >
    <EditingProvider>
        <EditorContainer
          {...props}
          stepsRef={stepsRef}
          editorRef={editorRef}
          curPathRef={curPathRef}
          curValueRef={curValueRef}
          featuresRef={featuresRef}
          featureGroups={featureGroups}
          onFeatureClose={onFeatureClose}
          onFeatureActive={onFeatureActive}
        />
      </EditingProvider>
    </FeatureProvider>
  )
}

