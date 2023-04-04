import type { CSSProperties, ComponentProps, ForwardedRef } from 'react'

import { forwardRef } from 'react'
import { AddItem } from '../AddItem'
import { ESectionType, ESectionExt } from '@GBR/types'
import { EmptyBox, EmptyContainer } from './EmptyItem.styled'

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
    buttonSx,
    parentType,
    containerSx,
    ...rest
  } = props

  return (
    <EmptyContainer
      sx={containerSx}
      className={`gb-empty-item-container gb-empty-item-container-${parentType}`}
    >
      <EmptyBox
        sx={sx}
        className={`gb-empty-item gb-empty-item-${type}`}
      >
        <AddItem
          {...rest}
          ref={ref}
          sx={addSx}
          type={type}
          buttonSx={buttonSx}
          variant={variant || `text`}
        />
      </EmptyBox>
    </EmptyContainer>
  )
})