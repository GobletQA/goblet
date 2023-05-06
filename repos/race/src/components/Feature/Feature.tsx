import type { TFeaturesRefs } from '@GBR/types'
import type { CSSProperties, MouseEvent } from 'react'


import { Meta } from '../Meta'
import { Rules } from '../Rules'
import { Section } from '../Section'
import { cls } from '@keg-hub/jsutils'
import { Scenarios } from '../Scenarios'
import { useEditor } from '@GBR/contexts'
import { Background } from '../Background'
import { EmptyFeature } from './EmptyFeature'
import { EditTitle } from '../Title/EditTitle'
import { FeatureHeader } from './FeatureHeader'
import { EmptyFeatureUUID } from '@GBR/constants'
import { useMemo, useCallback, useRef } from 'react'
import { EEditorMode, ESectionType } from '@GBR/types'
import { SimpleMode } from '@GBR/components/SimpleMode'
import { BoltIcon, EmptyEditor } from '@gobletqa/components'
import { FeatureStack, FeatureContent } from './Feature.styled'
import { createFeature } from '@GBR/actions/feature/createFeature'
import { useFeatureItems } from '@GBR/hooks/features/useFeatureItems'
import { useFeatureActions } from '@GBR/hooks/actions/useFeatureActions'
import { useEditFeatureTitle } from '@GBR/hooks/features/useEditFeatureTitle'

export type TFeature = TFeaturesRefs & {}
type StyleObj = Record<string, CSSProperties>

const styles:Record<string, StyleObj|CSSProperties> = {
  titleSection: {
    marginTop: `40px`
  },
  titleEdit: {
    marginTop: `10px`
  }
}

export const Feature = (props:TFeature) => {
  const { featuresRef } = props

  const { feature, rootPrefix, mode } = useEditor()
  const advMode = mode === EEditorMode.advanced
  
  const onEditFeatureTitle = useEditFeatureTitle({ parent: feature })

  const onCreateFeature = useCallback((evt:MouseEvent<HTMLButtonElement>) => {
    evt.stopPropagation()
    createFeature({}, rootPrefix)
  }, [rootPrefix])

  const isEmpty = useMemo(() => {
    return Boolean(!feature?.background && !feature?.rules?.length && !feature?.scenarios?.length)
  }, [feature])

  const onTagsChange = useCallback((...args:any) => {

  }, [])

  const contentRef = useRef<HTMLElement>()
  const containerRef = useRef<HTMLElement>()
  const featureItems = useFeatureItems({ feature })

  const {
    onAddScenario,
    onRemoveScenario,
    onChangeScenario,
    onAddScenarioStep,
    onRemoveBackground,
    onUpdateBackground,
    onAddBackgroundStep,
    onRemoveScenarioStep,
    onChangeScenarioStep,
    onRemoveBackgroundStep,
    onChangeBackgroundStep,
  } = useFeatureActions({ feature })

  return !feature || !feature?.uuid
    ? (
        <EmptyEditor
          Icon={BoltIcon}
          btnText='Create Feature'
          onClick={onCreateFeature}
          headerText='Goblet Feature Editor'
          subText='Create a new feature, or select an existing feature from the sidebar panel.'
        />
      )
    : (
        <FeatureStack
          stack={2}
          ref={containerRef}
          contentRef={contentRef}
          type={ESectionType.feature}
          className={cls(`gb-feature-editor-section`, isEmpty && `gb-feature-empty`)}
        >
          <FeatureContent className='gb-feature-sections-container'>

            { feature.uuid !== EmptyFeatureUUID
                ? (
                    <>
                      <FeatureHeader
                        feature={feature}
                        items={featureItems}
                      />
                      
                      {advMode ? (
                        <>
                          <Meta
                            parent={feature}
                            featuresRef={featuresRef}
                            onTagsChange={onTagsChange}
                          />

                          {isEmpty && (
                            <EmptyFeature
                              mode={mode}
                              parent={feature}
                              items={featureItems}
                            />
                          ) || null}

                          {feature.background && (
                            <Background
                              parent={feature}
                              onChange={onUpdateBackground}
                              onRemove={onRemoveBackground}
                              onAddStep={onAddBackgroundStep}
                              background={feature.background}
                              onChangeStep={onChangeBackgroundStep}
                              onRemoveStep={onRemoveBackgroundStep}
                            />
                          ) || null}

                          {feature.rules?.length && (
                            <Rules
                              parent={feature}
                              rules={feature.rules}
                            />
                          ) || null}

                          <Scenarios
                            parent={feature}
                            onAdd={onAddScenario}
                            onChange={onChangeScenario}
                            onRemove={onRemoveScenario}
                            onAddStep={onAddScenarioStep}
                            scenarios={feature.scenarios}
                            onChangeStep={onChangeScenarioStep}
                            onRemoveStep={onRemoveScenarioStep}
                          />

                        </>
                      ) : (
                        <SimpleMode
                          parent={feature}
                          onAdd={onAddScenario}
                          onChange={onChangeScenario}
                          onRemove={onRemoveScenario}
                          onAddStep={onAddScenarioStep}
                          onChangeStep={onChangeScenarioStep}
                          onRemoveStep={onRemoveScenarioStep}
                        />
                      )}
                    </>
                  )
                : (
                    <Section
                      show={true}
                      label={``}
                      noHeader={false}
                      parent={feature}
                      id={EmptyFeatureUUID}
                      showDragHandle={false}
                      sx={styles.titleSection}
                      type={ESectionType.feature}
                      uuid={'empty-feature-title'}
                    >
                      <EditTitle
                        uuid={feature.uuid}
                        sx={styles.titleEdit}
                        value={feature.feature}
                        type={ESectionType.feature}
                        onBlur={onEditFeatureTitle}
                      />
                    </Section>
                  )
            }
          </FeatureContent>
        </FeatureStack>
      )
}
