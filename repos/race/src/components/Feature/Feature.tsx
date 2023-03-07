import type { CSSProperties, MouseEvent } from 'react'
import type { TFeaturesRefs } from '@GBR/types'


import { useMemo, useCallback } from 'react'

import { General } from '../General'
import { Rules } from '../Rules'
import { Stack } from '../Section'
import Box from '@mui/material/Box'
import { Title } from '../General/Title'
import { Scenarios } from '../Scenarios'
import { ESectionType } from '@GBR/types'
import { Background } from '../Background'
import { useEditor } from '../../contexts'
import { FeatureActions } from './FeatureActions'
import { EmptyFeatureUUID } from '@GBR/constants'

import { EmptyFeature } from './EmptyFeature'
import { addScenario } from '@GBR/actions/scenario/addScenario'
import { createFeature } from '@GBR/actions/feature/createFeature'
import { gutter, BoltIcon, EmptyEditor } from '@gobletqa/components'
import { removeScenario } from '@GBR/actions/scenario/removeScenario'
import { addScenarioStep } from '@GBR/actions/scenario/addScenarioStep'
import { useEditFeatureTitle } from '@GBR/hooks/features/useEditFeatureTitle'
import { changeScenarioStep } from '@GBR/actions/scenario/changeScenarioStep'
import { removeScenarioStep } from '@GBR/actions/scenario/removeScenarioStep'

import { addBackground } from '@GBR/actions/background/addBackground'
import { removeBackground } from '@GBR/actions/background/removeBackground'
import { updateBackground } from '@GBR/actions/background/updateBackground'
import { addBackgroundStep } from '@GBR/actions/background/addBackgroundStep'
import { removeBackgroundStep } from '@GBR/actions/background/removeBackgroundStep'
import { changeBackgroundStep } from '@GBR/actions/background/changeBackgroundStep'

export type TFeature = TFeaturesRefs & {}
type StyleObj = Record<string, CSSProperties>

const styles:Record<string, StyleObj|CSSProperties> = {
  section: {
    overflowY: `auto`,
    padding: gutter.padding.px,
    paddingTop: `0px`,

    scrollbarWidth: `none`,
    [`::-webkit-scrollbar-track`]: {
      backgroundColor: `transparent`,
    },

    [`::-webkit-scrollbar`]: {
      width: `3px !important`,
      backgroundColor: `transparent`,
    },

    [`::-webkit-scrollbar-thumb`]: {
      backgroundColor: `transparent`,
    },

  },
  content: {
    width: `100%`,
    height: `100%`,
    display: `flex`,
    flexDirection: `column`,
  },
  notEmpty: {
    marginTop: `auto`
  },
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
          <Box
            sx={styles.content}
            className='gr-feature-sections-container'
          >

            { feature.uuid !== EmptyFeatureUUID
                ? (
                    <>
                      <FeatureActions />
                      <General
                        parent={feature}
                        featuresRef={featuresRef}
                      />
                      {feature.background && (
                        <Background
                          parent={feature}
                          onChange={updateBackground}
                          onRemove={removeBackground}
                          onAddStep={addBackgroundStep}
                          background={feature.background}
                          onChangeStep={changeBackgroundStep}
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
                          onRemove={removeScenario}
                          onAddStep={addScenarioStep}
                          scenarios={feature.scenarios}
                          onChangeStep={changeScenarioStep}
                          onRemoveStep={removeScenarioStep}
                        />
                      ) || null}
                      <EmptyFeature
                        parent={feature}
                        sx={!isEmpty ? styles.notEmpty : undefined}
                      />
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
          </Box>
        </Stack>
      )
}
