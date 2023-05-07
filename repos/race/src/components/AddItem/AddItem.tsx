import type { CSSProperties, SyntheticEvent, ComponentProps, ForwardedRef } from 'react'
import type { TOnAddClick } from '@GBR/types'

import { EAstObject } from '@ltipton/parkin'
import { capitalize } from '@keg-hub/jsutils'
import { forwardRef, useCallback } from 'react'
import { useInline } from '@gobletqa/components'
import { ESectionExt, ESectionType } from '@GBR/types'
import { AddContainer, AddBtn, AddBtnText } from './AddItem.styled'

export type TAddItem = Omit<ComponentProps<typeof AddBtn>, `onClick`|`type`> & {
  text?:string
  parentId:string
  featureKey?:string
  onClick?: TOnAddClick
  buttonSx?:CSSProperties
  type:ESectionType|ESectionExt
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
    (evt:SyntheticEvent) => callback?.(evt, parentId, type as EAstObject),
    [type, parentId]
  )

  return (
    <AddContainer
      sx={sx}
      className={`gb-add-btn-container gb-add-btn-container-${type}`}
    >
      <AddBtn
        {...rest}
        ref={ref}
        sx={buttonSx}
        onClick={onClick}
        variant={variant || "outlined"}
        className={`gb-add-btn gb-add-btn-${type}`}
      >
      {
        children
          ? children
          : (
              <AddBtnText>
                {text || `Add ${capitalize(type)}`}
              </AddBtnText>
            )
      }
      </AddBtn>
    </AddContainer>
  )
})