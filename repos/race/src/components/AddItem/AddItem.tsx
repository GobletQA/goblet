import type { CSSProperties, SyntheticEvent, ComponentProps, ForwardedRef } from 'react'
import type { TOnAddClick } from '@GBR/types'

import { forwardRef, useCallback } from 'react'
import { capitalize } from '@keg-hub/jsutils'
import { useInline } from '@gobletqa/components/hooks'

import { ESectionType } from '@GBR/types'
import { Container, AddBtn } from './AddItem.styled'

export type TAddItem = Omit<ComponentProps<typeof AddBtn>, `onClick`|`type`> & {
  text?:string
  parentId:string
  type:ESectionType
  featureKey?:string
  onClick?: TOnAddClick
  buttonSx?:CSSProperties
  sx?:CSSProperties|CSSProperties[]
}

export const AddItem = forwardRef((props:TAddItem, ref:ForwardedRef<HTMLButtonElement>) => {
  
  const {
    sx,
    type,
    text,
    variant,
    children,
    buttonSx,
    parentId,
    featureKey,
    onClick:onClickCB,
    ...rest
  } = props

  const callback = useInline<TOnAddClick>(onClickCB)
  const onClick = useCallback(
    (evt:SyntheticEvent) => callback?.(evt, parentId, type),
    [type, parentId]
  )

  return (
    <Container sx={sx}>
      <AddBtn
        {...rest}
        ref={ref}
        sx={buttonSx}
        onClick={onClick}
        variant={variant || "outlined"}
        className={`gr-add-btn-${type}`}
      >
        {children || text || `Add ${capitalize(type)}`}
      </AddBtn>
    </Container>
  )
})