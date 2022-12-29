import type { TTreeItem } from './TreeItem'
import type { ComponentProps } from 'react'

import { TreeItem } from './TreeItem'
import MuiTreeGroup from '@mui/lab/TreeItem'

export type TTreeGroup = ComponentProps<typeof MuiTreeGroup> & {
  nodeId?:string
  name?:string
  label?:string
  parentId?:string
  parentRef?:string
  items?: Record<string, TTreeItem|TTreeGroup>
}

export const TreeGroup = (props:TTreeGroup) => {
  const {
    items,
    nodeId,
    parentId,
    parentRef,
    name=nodeId,
    label=name,
    ...rest
  } = props

  return (
    <MuiTreeGroup
      label={label}
      nodeId={nodeId}
      {...rest}
    >
      {items && Object.entries(items).map(([key, item]) => {

        return (item as TTreeGroup)?.items
          ? (
              <TreeGroup
                {...item}
                parentRef={name}
                parentId={nodeId}
                key={item.nodeId || key}
                nodeId={item.nodeId || key}
              />
            )
          : (
              <TreeItem
                {...item}
                parentRef={name}
                parentId={nodeId}
                key={item.nodeId || key}
                nodeId={item.nodeId || key}
              />
            )

      })}
    </MuiTreeGroup>
  )
  
}