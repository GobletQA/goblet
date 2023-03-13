import type { ReactNode, ComponentType } from 'react'
import type { TMenuItem } from '@gobletqa/components'

import { ESectionType } from '@GBR/types'
import { capitalize } from '@keg-hub/jsutils'
import { Tooltip } from '@gobletqa/components'
import { FeatureActionBtn } from './Feature.styled'

export type TFeatureAction = Omit<TMenuItem, `onCloseMenu`|`closeMenu`|`onClick`|`Icon`> & {
  type: ESectionType,
  description?:ReactNode
  Icon:ComponentType<any>
  onClick?: (...args:any[]) => void
  variant?:"text" | "outlined" | "contained" | undefined
}


export const FeatureAction = (props:TFeatureAction) => {
  
  const {
    type,
    Icon,
    variant,
    onClick,
  } = props

  const typeCap = capitalize(type)

  const title = type === ESectionType.general
    ? (<>Show the <b>{typeCap}</b> section of the Feature</>)
    : (<>Add a <b>{typeCap}</b> section to the Feature</>)

  return (
    <Tooltip
      loc='bottom'
      title={title}
      describeChild
      enterDelay={500}
    >
      <FeatureActionBtn
        onClick={onClick}
        startIcon={<Icon />}
        variant={variant || 'text'}
        className={`gb-feature-sub-action-${type}`}
      >
        {typeCap}
      </FeatureActionBtn>
    </Tooltip>
  )
  
}
