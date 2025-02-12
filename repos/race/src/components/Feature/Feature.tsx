import type { CSSProperties } from 'react'


import { Meta } from '../Meta'
import { Rules } from '../Rules'
import { Section } from '../Section'
import { cls } from '@keg-hub/jsutils'
import { useMemo, useRef } from 'react'
import { Scenarios } from '../Scenarios'
import { Background } from '../Background'
import { EmptyFeature } from './EmptyFeature'
import { EditTitle } from '../Title/EditTitle'
import { FeatureHeader } from './FeatureHeader'
import { EmptyFeatureUUID } from '@GBR/constants'
import { EEditorMode, ESectionType } from '@GBR/types'
import { SimpleMode } from '@GBR/components/SimpleMode'
import { BoltIcon, EmptyEditor } from '@gobletqa/components'
import { FeatureStack, FeatureContent } from './Feature.styled'
import { useFeature, useEditor, useSettings } from '@GBR/contexts'
import { useFeatureItems } from '@GBR/hooks/features/useFeatureItems'
import { useSimpleActions } from '@GBR/hooks/features/useSimpleActions'
import { useFeatureActions } from '@GBR/hooks/actions/useFeatureActions'
import { useEnsureScenario } from '@GBR/hooks/features/useEnsureScenario'
import { useFeatureIsEmpty } from '@GBR/hooks/features/useFeatureIsEmpty'
import { useEditFeatureTitle } from '@GBR/hooks/features/useEditFeatureTitle'

export type TFeature = {}
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

  const {
    featureUIActive,
    FeatureComponent,
  } = useFeature()

  const editor = useEditor()
  const { settings } = useSettings()
  const { feature, rootPrefix } = editor

  const noChildren = useMemo(() => {
    return Boolean(
      !feature?.background
        && !feature?.rules?.length
        && !feature?.scenarios?.length
    )
  }, [feature])

  const {
    onTagsChange,
    onAddScenario,
    onCreateFeature,
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
  } = useFeatureActions({ feature, rootPrefix })
  const contentRef = useRef<HTMLElement>()
  const containerRef = useRef<HTMLElement>()
  const featureIsEmpty = useFeatureIsEmpty({ feature })
  const scenario = useEnsureScenario({ parent: feature })
  const {
    onSimpleAdd,
    onSimplePaste
  } = useSimpleActions({ scenario, parent: feature })
  const featureItems = useFeatureItems({ scenario, onSimpleAdd, onSimplePaste })
  const onEditFeatureTitle = useEditFeatureTitle({ parent: feature })

  return !feature || !feature?.uuid
    ? (
        <EmptyEditor
          Icon={BoltIcon}
          btnText='Create Feature'
          onClick={onCreateFeature}
          headerText='No-Code Editor'
          subText='Create a new feature, or select an existing feature from the sidebar panel.'
        />
      )
    : (
        <FeatureStack
          stack={2}
          ref={containerRef}
          contentRef={contentRef}
          type={ESectionType.feature}
          className={cls(`gb-feature-editor-section`, noChildren && `gb-feature-empty`)}
        >
          <FeatureContent className='gb-feature-sections-container'>

            { !featureIsEmpty && feature.uuid !== EmptyFeatureUUID
                ? (
                    <>
                      {
                        featureUIActive && FeatureComponent
                          ? (
                              <FeatureComponent
                                editor={editor}
                                feature={feature}
                                items={featureItems}
                                mode={settings.mode}
                                onSimpleAdd={onSimpleAdd}
                                onTagsChange={onTagsChange}
                                onAddScenario={onAddScenario}
                                onChangeScenario={onChangeScenario}
                                onRemoveScenario={onRemoveScenario}
                                onAddScenarioStep={onAddScenarioStep}
                                onUpdateBackground={onUpdateBackground}
                                onRemoveBackground={onRemoveBackground}
                                onAddBackgroundStep={onAddBackgroundStep}
                                onChangeScenarioStep={onChangeScenarioStep}
                                onRemoveScenarioStep={onRemoveScenarioStep}
                                onChangeBackgroundStep={onChangeBackgroundStep}
                                onRemoveBackgroundStep={onRemoveBackgroundStep}
                              />
                            )
                          : (
                              <>
                                <FeatureHeader
                                  feature={feature}
                                  items={featureItems}
                                />
                                
                                {settings.mode === EEditorMode.advanced ? (
                                  <>
                                    <Meta
                                      parent={feature}
                                      onTagsChange={onTagsChange}
                                    />

                                    {noChildren && (
                                      <EmptyFeature
                                        parent={feature}
                                        items={featureItems}
                                        mode={settings.mode}
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
                                ) : scenario && (
                                  <SimpleMode
                                    parent={feature}
                                    scenario={scenario}
                                    onAdd={onAddScenario}
                                    onSimpleAdd={onSimpleAdd}
                                    onChange={onChangeScenario}
                                    onRemove={onRemoveScenario}
                                    onAddStep={onAddScenarioStep}
                                    onChangeStep={onChangeScenarioStep}
                                    onRemoveStep={onRemoveScenarioStep}
                                  />
                                ) || null}
                              </>
                            )
                      }
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
