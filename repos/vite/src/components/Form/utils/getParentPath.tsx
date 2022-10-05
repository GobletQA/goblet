import type { TBuildOpts } from '../hooks/useBuildInputs'
import type { MutableRefObject } from 'react'


import { isArr } from '@keg-hub/jsutils'
import { EItemParent } from '../form.types'
import { parentKeyMap, pathItems } from '../constants'

const getParentPathFromFull = (
  optionsRef:MutableRefObject<TBuildOpts>,
  parentPath?:string
) => {

  return parentPath
}

const getParentPathFromKey = (
  optionsRef:MutableRefObject<TBuildOpts>,
  parentPath?:string
) => {
  const {
    config,
    parent
  } = optionsRef.current

  const parentKey = (
    parentKeyMap[(parentPath || parent)as keyof typeof parentKeyMap] || EItemParent.rows
  ) as "rows" | "sections"

  if(!isArr(config[parentKey])) config[parentKey] = [] as string[]

  return `${parentKey}.${config[parentKey]?.length}`
}

export const getParentPath = (
  optionsRef:MutableRefObject<TBuildOpts>,
  parentPath?:string
) => {
  return parentPath && pathItems.includes(parentPath.split(`.`).pop() as string)
    ? getParentPathFromFull(optionsRef, parentPath)
    : getParentPathFromKey(optionsRef, parentPath)
}
