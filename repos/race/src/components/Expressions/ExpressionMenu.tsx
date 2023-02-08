import type { TMenuItem } from '@gobletqa/components'
import type { TMenuContextRef } from '@GBR/types'

import {
  Menu,
  IconButton,
  GobletIcon,
} from '@gobletqa/components'
import { useMenuItems } from '@GBR/hooks/menuContext/useMenuItems'

export type TExpressionMenu = TMenuContextRef & {
  id:string
  parentId:string
  items: TMenuItem[]
  onChange:(...args:any[]) => any
}

export const ExpressionMenu = (props:TExpressionMenu) => {

  const {
    id="gr-expressions-menu",
    parentId="gc-expressions-menu-button"
  } = props

  const {
    open,
    items,
    onOpen,
    onClose,
    anchorRef,
  } = useMenuItems(props)

  return (
    <>
      <IconButton
        id={parentId}
        onClick={onOpen}
        Icon={GobletIcon}
        aria-haspopup="true"
        aria-controls={open ? id : undefined}
        aria-expanded={open ? 'true' : undefined}
      />
      <Menu
        id={id}
        open={open}
        items={items}
        onOpen={onOpen}
        onClose={onClose}
        anchorRef={anchorRef}
        aria-labelledby={parentId}
      />
    </>
  )
  
}