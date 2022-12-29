import type { ComponentProps } from 'react'

import MuiTreeItem from '@mui/lab/TreeItem'


export type TTreeItem = ComponentProps<typeof MuiTreeItem> & {
  nodeId?:string
  name?:string
  label?:string
  parentId?:string
  parentRef?:string
}

export const TreeItem = (props:TTreeItem) => {

  const {
    nodeId,
    parentId,
    parentRef,
    name=nodeId,
    label=name,
    ...rest
  } = props

  return (
    <MuiTreeItem
      {...rest}
      label={label}
      nodeId={nodeId}
    />
  )

}