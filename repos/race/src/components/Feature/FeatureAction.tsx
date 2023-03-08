import type { ReactNode, ComponentType } from 'react'
import type { ESectionType } from '@GBR/types'
import type { TMenuItem } from '@gobletqa/components'

import { capitalize } from '@keg-hub/jsutils'
import { SubActionBtn } from './Feature.styled'

export type TFeatureAction = Omit<TMenuItem, `onCloseMenu`|`closeMenu`|`onClick`|`Icon`> & {
  type: ESectionType,
  description?:ReactNode
  Icon:ComponentType<any>
  onClick?: (...args:any[]) => void
  variant?:"text" | "outlined" | "contained" | undefined
}


export const FeatureAction = (props:TFeatureAction) => {
  
  const {
    text,
    type,
    Icon,
    variant,
    onClick,
    children,
  } = props

  // TODO: add tool-tip
  // Clean up buttons to look better without text
  // Remove drop-down menu

  return (
    <SubActionBtn
      onClick={onClick}
      variant={variant || 'text'}
      className={`gr-feature-sub-action-${type}`}
      startIcon={<Icon />}
    />
  )
  
}
      // {capitalize(type)}
      // {children || text || `Add ${capitalize(type)}`}