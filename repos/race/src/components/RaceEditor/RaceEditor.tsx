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
    setFeatureGroups,
    onFeatureCloseRef,
    onFeatureChangeRef,
    onFeatureActiveRef,
    onFeatureInactiveRef,
    onFeatureBeforeChangeRef,
  } = useRaceRefs(props, { initialFeature })

  return (
    <FeatureProvider
      rootPrefix={props.rootPrefix}
      initialFeature={initialFeature}
      setFeatureGroups={setFeatureGroups}
      onFeatureCloseRef={onFeatureCloseRef}
      onFeatureChangeRef={onFeatureChangeRef}
      onFeatureActiveRef={onFeatureActiveRef}
      onFeatureInactiveRef={onFeatureInactiveRef}
      onFeatureBeforeChangeRef={onFeatureBeforeChangeRef}
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
          onFeatureCloseRef={onFeatureCloseRef}
          onFeatureActiveRef={onFeatureActiveRef}
        />
      </EditingProvider>
    </FeatureProvider>
  )
}

