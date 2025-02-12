import type { TMenuContextRef } from '@GBR/types'
import type { THMenuItems } from '@GBR/hooks/menuContext/useMenuItems'

import {
  Menu,
  IconButton,
  GobletIcon,
} from '@gobletqa/components'
import { ExpCtxMenuId } from '@GBR/constants/values'
import { useMenuItems } from '@GBR/hooks/menuContext/useMenuItems'

export type TExpressionMenu = TMenuContextRef & {
  id:string
  parentId:string
  submenuId?:string
  items: THMenuItems[`items`]
  onChange:(...args:any[]) => any
}

const iconProps = {
  svgStyle: {
    width: `18px`,
    height: `18px`,
  }
}

export const ExpressionMenu = (props:TExpressionMenu) => {

  const {
    submenuId=`gb-expressions-submenu`,
    parentId=`gb-expressions-menu-button`,
  } = props

  const {
    open,
    items,
    onOpen,
    onClose,
    anchorRef,
    submenuProps,
  } = useMenuItems(props)

  return (
    <>
      <IconButton
        id={parentId}
        onClick={onOpen}
        Icon={GobletIcon}
        iconProps={iconProps}
        aria-haspopup="true"
        aria-controls={open ? ExpCtxMenuId : undefined}
        aria-expanded={open ? 'true' : undefined}
      />
      <Menu
        id={ExpCtxMenuId}
        open={open}
        items={items}
        onOpen={onOpen}
        onClose={onClose}
        anchorRef={anchorRef}
        aria-labelledby={parentId}
        SubMenu={submenuProps?.open && (
          <Menu
            id={submenuId}
            aria-labelledby={ExpCtxMenuId}
            {...submenuProps}
          />
        ) || null}
      />
    </>
  )
  
}
