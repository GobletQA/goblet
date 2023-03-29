import type { CSSProperties, ComponentProps, ForwardedRef } from 'react'

import { forwardRef } from 'react'
import { AddItem } from '../AddItem'
import { ESectionType, ESectionExt } from '@GBR/types'

import { EmptyBox, EmptyContainer } from './EmptyItem.styled'


const styles:Record<string, CSSProperties> = {
  add: {
    width: `100%`,
    minWidth: `205px`,
  }
}

export type TEmptyItem = ComponentProps<typeof AddItem> & {
  sx?:CSSProperties
  addSx?:CSSProperties
  parentType:ESectionType
  containerSx?:CSSProperties
  type:ESectionType|ESectionExt
}

export const EmptyItem = forwardRef((props:TEmptyItem, ref:ForwardedRef<HTMLButtonElement>) => {
  const {
    sx,
    type,
    addSx,
    parentType,
    containerSx,
    ...rest
  } = props

  return (
    <EmptyContainer
      className={`${parentType}-empty-item`}
      sx={containerSx as CSSProperties}
    >
      <EmptyBox
        sx={sx}
        className={`empty-item empty-item-${type}`}
      >
        <AddItem
          variant='text'
          {...rest}
          ref={ref}
          type={parentType}
          sx={[styles.add, addSx] as CSSProperties[]}
        />
      </EmptyBox>
    </EmptyContainer>
  )
})