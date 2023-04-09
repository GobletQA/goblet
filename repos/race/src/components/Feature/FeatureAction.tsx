import type { TRaceFeature } from '@GBR/types'
import type { TMenuItem } from '@gobletqa/components'
import type { ReactNode, ComponentType, MouseEvent } from 'react'

import { capitalize } from '@keg-hub/jsutils'
import { Tooltip } from '@gobletqa/components'
import { FeatureActionBtn } from './Feature.styled'
import { ESectionExt, ESectionType } from '@GBR/types'

export type TFeatureAction = Omit<TMenuItem, `onCloseMenu`|`closeMenu`|`onClick`|`Icon`> & {
  feature:TRaceFeature
  description?:ReactNode
  Icon:ComponentType<any>
  type: ESectionType|ESectionExt,
  variant?:"text" | "outlined" | "contained" | undefined
  onClick: (evt:MouseEvent<HTMLElement>, featureId:string, featureType:string) => void
}

export const FeatureAction = (props:TFeatureAction) => {
  
  const {
    type,
    Icon,
    variant,
    onClick,
    feature,
  } = props

  const typeCap = capitalize(type)

  const title = type === ESectionExt.general
    ? (<>Show the <b>{typeCap}</b> section of the Feature</>)
    : (<>Add a <b>{typeCap}</b> section to the Feature</>)

  const onActionClick = (evt:MouseEvent<HTMLElement>) => onClick?.(
    evt,
    feature?.uuid,
    feature?.type
  )

  return (
    <Tooltip
      loc='bottom'
      title={title}
      describeChild
      enterDelay={300}
    >
      <FeatureActionBtn
        startIcon={<Icon />}
        onClick={onActionClick}
        variant={variant || 'text'}
        className={`gb-feature-sub-action-${type}`}
      >
        {typeCap}
      </FeatureActionBtn>
    </Tooltip>
  )
  
}
