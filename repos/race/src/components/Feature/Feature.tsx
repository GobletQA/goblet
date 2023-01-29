import type { MouseEvent } from 'react'
import type { TFeaturesRefs } from '@GBR/types'
import type { TToggleEditCB } from '@gobletqa/components'

import { useEffect, useCallback } from 'react'

import { Tags } from '../Tags'
import { Rules } from '../Rules'
import Box from '@mui/material/Box'
import { isStr } from '@keg-hub/jsutils'
import { Scenarios } from '../Scenarios'
import { ESectionType } from '@GBR/types'
import { Background } from '../Background'
import { useEditor } from '../../contexts'
import { FeatureStory } from './FeatureStory'
import { Section, SectionHeader } from '../Section'
import { EmptyFeatureUUID } from '@GBR/constants/values'
import { updateFeature } from '@GBR/actions/feature/updateFeature'
import { createFeature } from '@gobletqa/race/actions/feature/createFeature'

import { gutter, BoltIcon, H3, EmptyEditor } from '@gobletqa/components'

export type TFeature = TFeaturesRefs & {}

const padding = `${gutter.padding.size + (gutter.padding.size / 2)}px`
const styles = {
  section: {
    paddingTop: padding,
    paddingRight: gutter.padding.px,
  },
  content: {
    paddingLeft: gutter.padding.hpx
  }
}

const FeatureTitle = () => {
  return (
    <Box>
      <H3>Feature</H3>
    </Box>
  )
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
      && updateFeature({ ...feature, feature: featureTitle})
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
        <Section
          stack={2}
          gutter={true}
          sx={styles.section}
          type={ESectionType.feature}
          className='gr-feature-editor-section'
        >

          <FeatureTitle />

          <Box sx={styles.content}>
            <SectionHeader
              label='Title'
              required={true}
              title={feature?.feature}
              onToggleEdit={onToggleEdit}
              type={ESectionType.feature}
              initialEditing={!Boolean(feature?.feature)}
              placeholder={`Feature title or name...`}
            />

            
            { feature.uuid // !== EmptyFeatureUUID // @TODO - uncomment when race-editor is complete
                ? (
                    <>
                      <Tags
                        parent={feature}
                        featuresRef={featuresRef}
                        type={ESectionType.feature}
                      />
                      <FeatureStory
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
                        scenarios={feature.scenarios}
                      />
                    </>
                  )
                : null
            }
          </Box>
        </Section>
      )
}