import type { MutableRefObject } from 'react'
import type { TParentMeta } from '../form.types'

import { EItemParent } from '../form.types'
import { get } from '@keg-hub/jsutils'
import { getParentPath } from './getParentPath'
import { factoryMap } from '../factories/factories'
import { TBuildOpts } from '../hooks/useBuildInputs'


const getClosestParentType = (path:string) => {
  return path.split(`.`).reverse().find(part => part === EItemParent.sections || part === EItemParent.rows)
}

export const ensureParent = (
  optionsRef:MutableRefObject<TBuildOpts>,
  parentPath?:string
) => {
  const path = getParentPath(optionsRef, parentPath) as string
  const type  = getClosestParentType(path)

  const found = get(optionsRef.current.config, path)
  const parent = found || factoryMap[type as keyof typeof factoryMap]({} as any, optionsRef, path)

  return {
    type,
    path,
    parent
  } as TParentMeta
}