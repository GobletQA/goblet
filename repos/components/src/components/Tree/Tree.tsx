import type { CSSProperties } from 'react'
import type { TTreeGroup } from './TreeGroup'
import type { TTreeToggle, TTreeSelect } from '@GBC/types'

import { useInline } from '@GBC/hooks'
import { TreeGroup } from './TreeGroup'
import TreeView from '@mui/lab/TreeView'
import { useState, useCallback } from 'react'
import { emptyArr, ensureArr } from '@keg-hub/jsutils'
import { ExpandMoreIcon, ChevronRightIcon } from '@GBC/components/Icons'


export type TTree = {
  title?:string
  name?:string
  label?:string
  sx?:CSSProperties
  expanded?:string[]
  selected?:string[]
  multiSelect?:boolean
  onNodeToggle?:TTreeToggle
  onNodeSelect?:TTreeSelect
  groups:Record<string, TTreeGroup>
}

const styles = {
  tree: {
    flexGrow: 1,
    height: 240,
    maxWidth: 400,
    overflowY: 'auto'
  }
}


export type TTreeGroups = {
  groups:Record<string, TTreeGroup>
}

export const TreeGroups = (props:TTreeGroups) => {
  const {
    groups
  } = props
  return (
    <>
      {Object.entries(groups).map(([key, group]) => {
        return (
          <TreeGroup
            {...group}
            nodeId={group.nodeId || key}
            key={group.nodeId || key}
          />
        )
      })}
    </>
  )
}

export const Tree = (props:TTree) => {
  const {
    sx,
    title,
    groups,
    name=title,
    multiSelect,
    expanded=emptyArr,
    selected=emptyArr,
    label=name || `Goblet Components Tree`,
  } = props
  
  const onNodeToggleIn = useInline(props.onNodeToggle)
  const onNodeSelectIn = useInline(props.onNodeSelect)
  
  const [selItems, setSelItems] = useState<string[]>(selected)
  const [expdItems, setExpdItems] = useState<string[]>(expanded)
  
  const onNodeToggle = useCallback<TTreeToggle>((evt, nodeIds) => {
    onNodeToggleIn?.(evt, nodeIds)
    // setExpdItems(nodeIds)
  }, [expdItems])
  
  const onNodeSelect = useCallback<TTreeSelect>((evt, nodeIds) => {
    onNodeSelectIn?.(evt, nodeIds)
    // setSelItems(ensureArr(nodeIds))
  }, [selItems])
  
  return (
    <TreeView
      aria-label={label}
      multiSelect={multiSelect}
      onNodeToggle={onNodeToggle}
      onNodeSelect={onNodeSelect}
      defaultCollapseIcon={<ExpandMoreIcon />}
      defaultExpandIcon={<ChevronRightIcon />}
      sx={[styles.tree, sx as CSSProperties]}
    >
      <TreeGroups groups={groups} />
    </TreeView>
  )
}