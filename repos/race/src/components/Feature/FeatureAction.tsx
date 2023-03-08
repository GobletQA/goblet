import type { ReactNode, ComponentType } from 'react'
import type { ESectionType } from '@GBR/types'
import type { TMenuItem } from '@gobletqa/components'
import { capitalize } from '@keg-hub/jsutils'
import { FeatureActionBtn } from './Feature.styled'
import { Tooltip } from '@gobletqa/components'

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

  // Clean up buttons to look better without text
  // Remove drop-down menu

  return (
    <Tooltip
      loc='bottom'
      title={text}
      describeChild
      enterDelay={500}
    >
      <FeatureActionBtn
        onClick={onClick}
        startIcon={<Icon />}
        variant={variant || 'text'}
        className={`gr-feature-sub-action-${type}`}
      />
    </Tooltip>
  )
  
}
      // {capitalize(type)}
      // {children || text || `Add ${capitalize(type)}`}