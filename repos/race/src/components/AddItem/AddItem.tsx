import type { CSSProperties, SyntheticEvent, ComponentProps } from 'react'


import { useCallback } from 'react'
import { capitalize } from '@keg-hub/jsutils'
import { useInline } from '@gobletqa/components/hooks'

import { ESectionType } from '@GBR/types'
import { Container, AddBtn } from './AddItem.styled'

type TOnClick = (evt:SyntheticEvent, parentId:string, type:ESectionType) => void

export type TAddItem = Omit<ComponentProps<typeof AddBtn>, `onClick`|`type`> & {
  text?:string
  parentId:string
  sx?:CSSProperties
  type:ESectionType
  onClick?: TOnClick
  featureKey?:string
  buttonSx?:CSSProperties
}

export const AddItem = (props:TAddItem) => {
  
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

  const callback = useInline<TOnClick>(onClickCB)
  const onClick = useCallback(
    (evt:SyntheticEvent) => callback?.(evt, parentId, type),
    [type, parentId]
  )

  return (
    <Container sx={sx}>
      <AddBtn
        {...rest}
        sx={buttonSx}
        onClick={onClick}
        variant={variant || "outlined"}
        className={`gr-add-btn-${type}`}
      >
        {children || text || `Add ${capitalize(type)}`}
      </AddBtn>
    </Container>
  )
}