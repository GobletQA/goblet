import type { CSSProperties } from 'react'
import type { TFeatureItem } from './FeatureItems'
import type { TRaceFeature, TOnAddClick } from '@GBR/types'

import { useMemo } from 'react'
import { AddItem } from '../AddItem'
import { ESectionType } from '@GBR/types'
import { gutter } from '@gobletqa/components'
import {
  EmptyFeatureText,
  EmptyFeatureContent,
  EmptyFeatureHeaderText,
  EmptyFeatureTextContainer,
} from './Feature.styled'

export type TEmptyFeature = {
  sx?:CSSProperties
  parent:TRaceFeature
  items:TFeatureItem[]
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
    parent
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

export const EmptyFeature = (props:TEmptyFeature) => {

  return (
    <EmptyFeatureContent className='gb-empty-feature-content' >
      <EmptyFeatureTextContainer>
        <EmptyFeatureHeaderText className='gb-empty-feature-header-text' >
          No Content
        </EmptyFeatureHeaderText>
        <EmptyFeatureText className='gb-empty-feature-text' >
          Get started by adding a new scenario ...
        </EmptyFeatureText>
        <AddScenario {...props} /> 
      </EmptyFeatureTextContainer>
    </EmptyFeatureContent>
  )
}