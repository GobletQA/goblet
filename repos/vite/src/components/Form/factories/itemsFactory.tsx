import type { TParentMeta } from '../form.types'
import type { TBuildOpts } from '../hooks/useBuildInputs'
import type { TInputsConfig } from '../hooks/useBuildInputs'
import type { MutableRefObject } from 'react'

import { ensureArr } from '@keg-hub/jsutils'
import { ensureParent } from '../utils/ensureParent'
import { useBuildInput } from '../hooks/useBuildInput'

export const itemsFactory = (
  props:TInputsConfig | TInputsConfig[],
  optionsRef:MutableRefObject<TBuildOpts>,
  parentPath?:string,
  pMeta?: TParentMeta
) => {
  if(!optionsRef?.current) return optionsRef?.current

  const itemArr = ensureArr<TInputsConfig>(props)
  pMeta = pMeta || ensureParent(optionsRef, parentPath)

  return itemArr.reduce((opts, item, idx) => {
    const path = `${pMeta?.path}.items.${idx}`

    // TODO: migrate this to a builtInput method that does not use hooks
    // @ts-ignore
    const updates = useBuildInput({
      path,
      key: item?.key || `${pMeta?.type}-${pMeta?.path}-${path}`,
      ...item,
    }, opts)

    optionsRef.current = updates

    return optionsRef.current
  }, optionsRef.current)
}
