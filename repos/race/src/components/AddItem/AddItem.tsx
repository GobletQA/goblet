import type { CSSProperties, SyntheticEvent, ComponentProps } from 'react'


import { useCallback } from 'react'
import { useInline } from '@gobletqa/components/hooks'

import { ESectionType } from '@GBR/types'
import { Container, AddBtn } from './AddItem.styled'

type TOnClick = (evt:SyntheticEvent, parentId:string, type:ESectionType) => void

export type TAddItem = Omit<ComponentProps<typeof AddBtn>, `onClick`|`type`> & {
  parentId:string
  sx?:CSSProperties
  type:ESectionType
  onClick?: TOnClick
  buttonSx?:CSSProperties
}

export const AddItem = (props:TAddItem) => {
  
  const {
    sx,
    type,
    buttonSx,
    parentId,
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
        className={`gr-add-btn-${type}`}
      >
        Add {type}
      </AddBtn>
    </Container>
  )
}