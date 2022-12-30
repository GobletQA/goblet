import type { SyntheticEvent, ComponentProps } from 'react'


import { useCallback } from 'react'
import { useInline } from '@gobletqa/components/hooks'

import { ESectionType } from '@GBR/types'
import { Container, AddBtn } from './AddItem.styled'

type TOnClick = (evt:SyntheticEvent, parentId:string, type:ESectionType) => void

export type TAddItem = Omit<ComponentProps<typeof AddBtn>, `onClick`|`type`> & {
  parentId:string
  type:ESectionType
  onClick?: TOnClick
}

export const AddItem = (props:TAddItem) => {
  
  const {
    type,
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
    <Container>
      <AddBtn
        {...rest}
        onClick={onClick}
        className={`gr-add-btn-${type}`}
      >
        Add {type}
      </AddBtn>
    </Container>
  )
}