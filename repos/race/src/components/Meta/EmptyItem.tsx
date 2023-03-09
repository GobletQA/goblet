import type { CSSProperties, ComponentProps, ForwardedRef } from 'react'

import { forwardRef } from 'react'
import { AddItem } from '../AddItem'
import { ESectionType } from '@GBR/types'
import { gutter } from '@gobletqa/components'

import { EmptyBox, EmptyContainer } from './Meta.styled'


const styles:Record<string, CSSProperties> = {
  add: {
    width: `100%`,
    minWidth: `205px`,
    paddingBottom: gutter.padding.hpx,
    borderBottom: `1px solid var(--goblet-list-focusBackground)`,
  }
}

export type TEmptyItem = ComponentProps<typeof AddItem> & {
  sx?:CSSProperties
  addSx?:CSSProperties
  type:ESectionType
  parentType:ESectionType
  containerSx?:CSSProperties
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
      className={`${parentType}-empty-steps`}
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