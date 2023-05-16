import type { CSSProperties } from 'react'
import type { TFeatureItem } from './FeatureItems'
import type { TRaceFeature, TOnAddClick } from '@GBR/types'

import { useMemo } from 'react'
import { AddItem } from '../AddItem'
import { gutter } from '@gobletqa/components'
import { EEditorMode, ESectionType } from '@GBR/types'
import {
  EmptyFeatureText,
  EmptyFeatureContent,
  EmptyFeatureHeaderText,
  EmptyFeatureTextContainer,
} from './Feature.styled'

export type TEmptyFeature = {
  mode?:EEditorMode
  sx?:CSSProperties
  parent:TRaceFeature
  items:TFeatureItem[]
  onAdd?: () => void
}

const styles:Record<string, CSSProperties> = {
  add: {
    width: `100%`,
    display: `flex`,
    marginBottom: `0px`,
    alignItems: `center`,
    justifyContent: `center`,
    marginTop: gutter.margin.px,
  }
}

const AddScenario = (props:TEmptyFeature) => {
  const {
    items,
    parent,
  } = props

  const item = useMemo(() => items.find(item => item.type === ESectionType.scenario), [items])

  return (
    <AddItem
      {...item}
      sx={styles.add}
      variant='contained'
      parentId={parent.uuid}
      type={ESectionType.scenario}
      onClick={item?.onClick as TOnAddClick}
    />
  )
}

const AddStep = (props:TEmptyFeature) => {
  const {
    onAdd,
    items,
    parent,
  } = props
  
  const item = useMemo(() => items.find(item => item.type === ESectionType.step), [items])

  return (
    <AddItem
      {...item}
      sx={styles.add}
      variant='contained'
      parentId={parent.uuid}
      type={ESectionType.step}
      onClick={onAdd as TOnAddClick}
    />
  )
}

export const EmptyFeature = (props:TEmptyFeature) => {

  const { mode } = props

  return (
    <EmptyFeatureContent className='gb-empty-feature-content' >
      <EmptyFeatureTextContainer>
        <EmptyFeatureHeaderText className='gb-empty-feature-header-text' >
          Feature Empty
        </EmptyFeatureHeaderText>
        {mode === EEditorMode.advanced ? (
            <>
              <EmptyFeatureText className='gb-empty-feature-text' >
                Add a new Scenario to get started ...
              </EmptyFeatureText>
              <AddScenario {...props} /> 
            </>
        ) : (
          <>
            <EmptyFeatureText className='gb-empty-feature-text' >
              Add a new Step to get started ...
            </EmptyFeatureText>
            <AddStep {...props} />
          </>
        )}
      </EmptyFeatureTextContainer>
    </EmptyFeatureContent>
  )
}