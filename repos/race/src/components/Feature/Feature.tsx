import type { MouseEvent } from 'react'
import type { TFeaturesRefs } from '@GBR/types'
import type { TToggleEditCB } from '@gobletqa/components'

import { useEffect, useCallback } from 'react'

import { Meta } from '../Meta'
import { Rules } from '../Rules'
import { Story } from '../Story'
import { Stack } from '../Shared'
import Box from '@mui/material/Box'
import { isStr } from '@keg-hub/jsutils'
import { Scenarios } from '../Scenarios'
import { ESectionType } from '@GBR/types'
import { Background } from '../Background'
import { useEditor } from '../../contexts'

import { addScenario } from '@GBR/actions/scenario/addScenario'
import { updateFeature } from '@GBR/actions/feature/updateFeature'
import { removeScenario } from '@GBR/actions/scenario/removeScenario'
import { addScenarioStep } from '@GBR/actions/scenario/addScenarioStep'
import { createFeature } from '@gobletqa/race/actions/feature/createFeature'

import { gutter, BoltIcon, H3, EmptyEditor } from '@gobletqa/components'

export type TFeature = TFeaturesRefs & {}

const styles = {
  section: {
    padding: gutter.padding.px,
  },
  content: {}
}

export const Feature = (props:TFeature) => {
  const {
    stepsRef,
    featuresRef,
  } = props

  const { feature, rootPrefix } = useEditor()

  // TODO: remove this once form components are done
  useEffect(() => {
    ;(!feature || !feature?.uuid) && createFeature({}, rootPrefix)
  }, [])

  const onToggleEdit = useCallback(((__, featureTitle, editing) => {
    !editing
      && isStr(featureTitle)
      && updateFeature({ ...feature, feature: featureTitle}, false)
  }) as TToggleEditCB, [feature])

  const onClick = useCallback((e:MouseEvent<HTMLButtonElement>) => {
    createFeature({}, rootPrefix)
  }, [rootPrefix])

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
        <Stack
          stack={2}
          sx={styles.section}
          type={ESectionType.feature}
          className='gr-feature-editor-section'
        >
          <Box sx={styles.content}>
            <Meta
              parent={feature}
              featuresRef={featuresRef}
            />

            { feature.uuid // !== EmptyFeatureUUID // @TODO - uncomment when race-editor is complete
                ? (
                    <>
                      <Story
                        parent={feature}
                        featuresRef={featuresRef}
                      />
                      <Background
                        parent={feature}
                        background={feature.background}
                      />
                      <Rules
                        parent={feature}
                        rules={feature.rules}
                      />
                      <Scenarios
                        parent={feature}
                        onAdd={addScenario}
                        onRemove={removeScenario}
                        onAddStep={addScenarioStep}
                        scenarios={feature.scenarios}
                      />
                    </>
                  )
                : null
            }
          </Box>
        </Stack>
      )
}
