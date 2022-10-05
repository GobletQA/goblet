import type { TFCSection, TFCRow, TParentMeta } from '../form.types'
import type { TBuildOpts } from '../hooks/useBuildInputs'
import type { MutableRefObject } from 'react'

import { set } from '@keg-hub/jsutils'
import { EItemParent } from '../form.types'
import { itemsFactory } from './itemsFactory'

const updateOptsRef = (
  optionsRef:MutableRefObject<TBuildOpts>,
  options:TBuildOpts
) => {
  optionsRef.current = {...options}
  return optionsRef
}

export const sectionFactory = (
  props:TFCSection,
  optionsRef:MutableRefObject<TBuildOpts>,
  path?: string,
  parentMeta?: TParentMeta
):TFCSection => {
  if(!optionsRef?.current) return optionsRef?.current

  // If no path, assume it's the first top level item
  const parentPath = path ? path : `${EItemParent.sections}.0`
  optionsRef.current.config.sections = optionsRef.current.config.sections || []

  const { rows, items } = props
  const built = {
    path: parentPath,
    key: parentPath,
    ...props,
    type: EItemParent.section
  } as TFCSection

  const pMeta:TParentMeta = {
    parent: built,
    type: EItemParent.section,
    path: built.path as string
  }

  items
    && items.length
    && itemsFactory(
        items,
        updateOptsRef(optionsRef, {...optionsRef.current, parent: path || EItemParent.sections }),
        props.path || path,
        pMeta
      )

  rows 
    && rows.length
    && rows.map((row, idx) => rowFactory(
        row,
        updateOptsRef(optionsRef, {...optionsRef.current, parent: path || EItemParent.sections }),
        `${path}.${EItemParent.rows}.${idx}`,
        pMeta
      ))

  set(optionsRef.current, `config.${built.path}`, built)

  return built
}

export const sectionsFactory = (
  props:TFCSection[],
  optionsRef:MutableRefObject<TBuildOpts>,
) => {
  
}

export const rowFactory = (
  props:TFCRow,
  optionsRef:MutableRefObject<TBuildOpts>,
  path?: string,
  parentMeta?: TParentMeta
):TFCRow => {
  if(!optionsRef?.current) return optionsRef?.current

  const { sections, items } = props

  optionsRef.current.config.rows = optionsRef.current.config.rows || []
  
  // If no path, assume it's the first top level item
  const parentPath = path ? path : `${EItemParent.rows}.0`

  const built = {
    key: parentPath,
    path: parentPath,
    ...props,
    type: EItemParent.row,
  } as TFCRow

  const pMeta:TParentMeta = {
    parent: built,
    type: EItemParent.row,
    path: built.path as string
  }

  items
    && items.length
    && itemsFactory(
        items,
        updateOptsRef(optionsRef, {...optionsRef.current, parent: path || EItemParent.sections }),
        props.path || path,
        pMeta
      )

  sections
    && sections.length 
    && sections.map((section, idx) => sectionFactory(
        section,
        updateOptsRef(optionsRef, {...optionsRef.current, parent: path || EItemParent.rows }),
        `${path}.${EItemParent.sections}.${idx}`,
        pMeta
      ))

  set(optionsRef.current, `config.${built.path}`, built)

  return built
}


export const rowsFactory = (
  props:TFCRow[],
  optionsRef:MutableRefObject<TBuildOpts>,
) => {
  
}