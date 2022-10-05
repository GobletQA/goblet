import type { TFCItem, TFConfig } from '../form.types'
import type { Dispatch, SetStateAction } from 'react'

import { set } from '@keg-hub/jsutils'


export const updateConfig = (
  setConfig:Dispatch<SetStateAction<TFConfig>>,
  config:TFConfig,
  path:string,
  update:TFCItem,
) => {
  const updated = {...config}
  set(updated, path, update)
  setConfig(updated)
}