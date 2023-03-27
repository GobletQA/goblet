import type { CSSProperties, MouseEvent } from 'react'
import type { TFeaturesRefs } from '@GBR/types'


import { useBounceScroll } from '@GBR/hooks/useBounceScroll'

import { Meta } from '../Meta'
import { Rules } from '../Rules'
import { Title } from '../Title'
import { Scenarios } from '../Scenarios'
import { ESectionType } from '@GBR/types'
import { Background } from '../Background'
import { useEditor } from '../../contexts'
import { EmptyFeature } from './EmptyFeature'
import { FeatureHeader } from './FeatureHeader'
import { EmptyFeatureUUID } from '@GBR/constants'
import { useMemo, useCallback, useRef } from 'react'
import { BoltIcon, EmptyEditor } from '@gobletqa/components'
import { addScenario } from '@GBR/actions/scenario/addScenario'
import { FeatureStack, FeatureContent } from './Feature.styled'
import { createFeature } from '@GBR/actions/feature/createFeature'
import { useFeatureItems } from '@GBR/hooks/features/useFeatureItems'
import { removeScenario } from '@GBR/actions/scenario/removeScenario'
import { updateScenario } from '@GBR/actions/scenario/updateScenario'
import { addScenarioStep } from '@GBR/actions/scenario/addScenarioStep'
import { removeBackground } from '@GBR/actions/background/removeBackground'
import { updateBackground } from '@GBR/actions/background/updateBackground'
import { addBackgroundStep } from '@GBR/actions/background/addBackgroundStep'
import { removeScenarioStep } from '@GBR/actions/scenario/removeScenarioStep'
import { useEditFeatureTitle } from '@GBR/hooks/features/useEditFeatureTitle'
import { removeBackgroundStep } from '@GBR/actions/background/removeBackgroundStep'
import { updateScenarioStep } from '@gobletqa/race/actions/scenario/updateScenarioStep'
import { updateBackgroundStep } from '@gobletqa/race/actions/background/updateBackgroundStep'

export type TFeature = TFeaturesRefs & {}
type StyleObj = Record<string, CSSProperties>

const styles:Record<string, StyleObj|CSSProperties> = {
  title: {
    marginTop: `20px`
  }
}

export const Feature = (props:TFeature) => {
  const { featuresRef } = props

  const { feature, rootPrefix } = useEditor()

  const onEditFeatureTitle = useEditFeatureTitle({ parent: feature })

  const onClick = useCallback((e:MouseEvent<HTMLButtonElement>) => {
    createFeature({}, rootPrefix)
  }, [rootPrefix])

  const isEmpty = useMemo(() => {
    return Boolean(!feature?.background && !feature?.rules?.length && !feature?.scenarios?.length)
  }, [feature])

  const onTagsChange = useCallback((...args:any) => {

  }, [])

  const contentRef = useRef<HTMLElement>()
  const containerRef = useRef<HTMLElement>()
  const featureItems = useFeatureItems()

  // useBounceScroll({
  //   contentRef,
  //   containerRef,
  // })

  return !feature || !feature?.uuid
    ? (
        <EmptyEditor
          Icon={BoltIcon}
          onClick={onClick}
          btnText='Create Feature'
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
          className='gb-feature-editor-section'
        >
          <FeatureContent className='gb-feature-sections-container'>

            { feature.uuid !== EmptyFeatureUUID
                ? (
                    <>
                      <FeatureHeader items={featureItems} />
                      <Meta
                        parent={feature}
                        featuresRef={featuresRef}
                        onTagsChange={onTagsChange}
                      />
                      {feature.background && (
                        <Background
                          parent={feature}
                          onChange={updateBackground}
                          onRemove={removeBackground}
                          onAddStep={addBackgroundStep}
                          background={feature.background}
                          onChangeStep={updateBackgroundStep}
                          onRemoveStep={removeBackgroundStep}
                        />
                      ) || null}
                      {feature.rules?.length && (
                        <Rules
                          parent={feature}
                          rules={feature.rules}
                        />
                      ) || null}
                      {feature.scenarios?.length && (
                        <Scenarios
                          parent={feature}
                          onAdd={addScenario}
                          onChange={updateScenario}
                          onRemove={removeScenario}
                          onAddStep={addScenarioStep}
                          scenarios={feature.scenarios}
                          onChangeStep={updateScenarioStep}
                          onRemoveStep={removeScenarioStep}
                        />
                      ) || null}
                      {
                        isEmpty
                        ? (
                            <EmptyFeature
                              parent={feature}
                              items={featureItems}
                            />
                          )
                        : null
                      }
                    </>
                  )
                : (
                    <Title
                      autoFocus={true}
                      uuid={feature.uuid}
                      value={feature.feature}
                      containerSx={styles.title}
                      type={ESectionType.feature}
                      onChange={onEditFeatureTitle}
                    />
                  )
            }
          </FeatureContent>
        </FeatureStack>
      )
}
