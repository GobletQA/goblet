import type { CSSProperties, ComponentProps, ForwardedRef } from 'react'

import { forwardRef } from 'react'
import { AddItem } from '../AddItem'
import { ESectionType, ESectionExt } from '@GBR/types'

import { EmptyBox, EmptyContainer } from './EmptyItem.styled'


const styles:Record<string, CSSProperties> = {
  add: {
    width: `100%`,
    // TODO: fix this hard coded value. Where does it come from?
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
    variant,
    parentType,
    containerSx,
    ...rest
  } = props


  return (
    <EmptyContainer
      className={`gb-empty-item-container gb-empty-item-container-${parentType}`}
      sx={containerSx as CSSProperties}
    >
      <EmptyBox
        sx={sx}
        className={`gb-empty-item gb-empty-item-${type}`}
      >
        <AddItem
          {...rest}
          ref={ref}
          type={type}
          variant={variant || `text`}
          sx={[styles.add, addSx] as CSSProperties[]}
        />
      </EmptyBox>
    </EmptyContainer>
  )
})