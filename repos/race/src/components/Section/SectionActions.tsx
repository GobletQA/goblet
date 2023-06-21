import type { TSectionActionMeta }  from '@GBR/types'
import type { TMenuItem } from '@gobletqa/components'
import type { ReactNode, CSSProperties } from 'react'

import { cls } from '@keg-hub/jsutils'
import { ESectionType, ESectionExt }  from '@GBR/types'
import { SectionActionsMenu } from './SectionActionsMenu'
import {
  SectionActs,
  SectionMenuContainer
} from './SectionActions.styled'

export type TSectionAction = ReactNode | TSectionActionMeta

export type TSectionActions = {
  id:string
  sx?:CSSProperties
  className?:string
  actions?:TSectionAction[]
  type:ESectionType|ESectionExt
}

export const SectionActions = (props:TSectionActions) => {
  const {
    id,
    sx,
    type,
    actions,
    className,
  } = props

  return (
    <SectionActs
      sx={sx}
      className={cls(`gb-section-actions`, className)}
    >
      <SectionMenuContainer>
        <SectionActionsMenu
          id={id}
          type={type}
          items={actions as TMenuItem[]}
        />
      </SectionMenuContainer>
    </SectionActs>
  )
  
}
