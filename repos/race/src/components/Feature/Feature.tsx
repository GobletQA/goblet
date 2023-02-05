import type { MouseEvent } from 'react'
import type { TFeaturesRefs, TEmptyFeature } from '@GBR/types'
import type { TToggleEditCB } from '@gobletqa/components'

import { useEffect, useCallback } from 'react'

// TODO - Remove this when done with step
import { Step } from '../Steps/Step'
import { EStepKey } from '@GBR/types'
import { featureFactory } from '@GBR/factories/featureFactory'
import { useEffectOnce } from '@gobletqa/components'

import { General } from '../General'
import { Rules } from '../Rules'
import { Stack } from '../Section'
import Box from '@mui/material/Box'
import { Title } from '../General/Title'
import { isStr } from '@keg-hub/jsutils'
import { Scenarios } from '../Scenarios'
import { ESectionType } from '@GBR/types'
import { Background } from '../Background'
import { useEditor } from '../../contexts'
import { FeatureActions } from './FeatureActions'
import { EmptyFeatureUUID } from '@GBR/constants'

import { addScenario } from '@GBR/actions/scenario/addScenario'
import { updateFeature } from '@GBR/actions/feature/updateFeature'
import { createFeature } from '@GBR/actions/feature/createFeature'
import { gutter, BoltIcon, EmptyEditor } from '@gobletqa/components'
import { removeScenario } from '@GBR/actions/scenario/removeScenario'
import { addScenarioStep } from '@GBR/actions/scenario/addScenarioStep'
import { changeScenarioStep } from '@GBR/actions/scenario/changeScenarioStep'
import { removeScenarioStep } from '@GBR/actions/scenario/removeScenarioStep'


export type TFeature = TFeaturesRefs & {}

const styles = {
  section: {
    padding: gutter.padding.px,
  },
  content: {}
}

// TODO - Remove this when done with step
const testFeature:TEmptyFeature = {
  scenarios: [
    {
      tags: [],
      index: 0,
      steps: [
          {
            step: "",
            index: 0,
            uuid: "56fe596a-9de4-4f01-b6fe-73ce2d8134fd",
            type: EStepKey.given
          }
      ],
      uuid: "cd4ae2bc-2f30-4990-aa85-d504aebe36fb",
      scenario: " "
    }
  ]
}

export const Feature = (props:TFeature) => {
  const { featuresRef } = props

  const { feature, rootPrefix } = useEditor()

  // TODO: remove this once form components are done
  useEffectOnce(() => {
    ;(!feature || !feature?.uuid)
      setTimeout(() => {
        const feat = featureFactory({
          path: rootPrefix,
          uuid: EmptyFeatureUUID
        })

        updateFeature({ ...feat, ...testFeature }, false)
      }, 50)
  })


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

            { feature.uuid // !== EmptyFeatureUUID // TODO - Remove this when finished
                ? (
                    <>
                      <FeatureActions />
                      <General
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
                        onChangeStep={changeScenarioStep}
                        onRemoveStep={removeScenarioStep}
                      />
                    </>
                  )
                : (
                    <Title
                      parent={feature}
                      featuresRef={featuresRef}
                    />
                  )
            }
          </Box>
        </Stack>
      )
}
