import React from 'react'
import { useStoreItems } from 'GBHooks/store/useStoreItems'
import { Values } from 'GBConstants'
import { FileTreePanel } from 'GBComponents/sidebar/content'

const { CATEGORIES, SIDEBAR_TYPES } = Values

/**
 * Manages the content displayed in the sidebar
 * @param {Object} props
 */
export const SidebarContent = props => {
  const { activeId } = useStoreItems(CATEGORIES.SIDEBAR) || {}

  switch (activeId) {
    case SIDEBAR_TYPES.FILE_TREE:
      return <FileTreePanel title={'Test Files'} {...props} />
    default:
      return null
  }
}
