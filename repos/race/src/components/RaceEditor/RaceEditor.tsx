import type { TRaceEditorProps } from '@GBR/types'

import { EditorContainer } from './EditorContainer'
import { useRaceRefs } from '../../hooks/useRaceRefs'
import { FeatureProvider } from '../../contexts/FeatureContext'
import { useInitialFeature } from '../../hooks/useInitialFeature'

export const RaceEditor = (props:TRaceEditorProps) => {

  const initialFeature = useInitialFeature(props)

  const {
    stepsRef,
    editorRef,
    curPathRef,
    curValueRef,
    featuresRef,
    onFeatureCloseRef,
    onFeatureChangeRef,
    onFeatureActiveRef,
    onFeatureInactiveRef,
    onFeatureBeforeChangeRef,
  } = useRaceRefs(props, { initialFeature })

  return (
    <FeatureProvider
      initialFeature={initialFeature}
      onFeatureCloseRef={onFeatureCloseRef}
      onFeatureChangeRef={onFeatureChangeRef}
      onFeatureActiveRef={onFeatureActiveRef}
      onFeatureInactiveRef={onFeatureInactiveRef}
      onFeatureBeforeChangeRef={onFeatureBeforeChangeRef}
    >
      <EditorContainer
        {...props}
        stepsRef={stepsRef}
        editorRef={editorRef}
        curPathRef={curPathRef}
        curValueRef={curValueRef}
        featuresRef={featuresRef}
        onFeatureCloseRef={onFeatureCloseRef}
        onFeatureActiveRef={onFeatureActiveRef}
      />
    </FeatureProvider>
  )
}

