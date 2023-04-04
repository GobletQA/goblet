import type { CSSProperties, ComponentProps, ForwardedRef } from 'react'

import { forwardRef } from 'react'
import { AddItem } from '../AddItem'

import { gutter } from '@gobletqa/components'
import { ESectionType, ESectionExt } from '@GBR/types'
import { EmptyBox, EmptyContainer } from './EmptyItem.styled'

const styles:Record<string, CSSProperties> = {
  add: {
    width: `100%`,
    minWidth: `initial`,
  },
  containerSx: {
    marginTop: `0px`,
    justifyContent: `flex-start`,
    paddingTop: gutter.padding.px,
    paddingBottom: gutter.padding.px,
  },
  sx: {
    width: `initial`,
    paddingBottom: `0px`,
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
    buttonSx,
    parentType,
    containerSx,
    ...rest
  } = props

  return (
    <EmptyContainer
      sx={containerSx || styles.containerSx}
      className={`gb-empty-item-container gb-empty-item-container-${parentType}`}
    >
      <EmptyBox
        sx={sx || styles.sx}
        className={`gb-empty-item gb-empty-item-${type}`}
      >
        <AddItem
          {...rest}
          ref={ref}
          type={type}
          buttonSx={buttonSx}
          variant={variant || `text`}
          sx={[styles.add, addSx] as CSSProperties[]}
        />
      </EmptyBox>
    </EmptyContainer>
  )
})