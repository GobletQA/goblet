import type { TFCItem, TFConfig } from '../form.types'
import type { ChangeEvent, Dispatch, SetStateAction, MutableRefObject } from 'react'

import { updateConfig } from './updateConfig'
import { get, noOpObj, exists } from '@keg-hub/jsutils'

export type TOnInputChange = {
  path: string
  config: TFConfig
  onChangeRef:MutableRefObject<any>,
  event:ChangeEvent<HTMLInputElement>
  setConfig:Dispatch<SetStateAction<TFConfig>>
}

export const onInputChange = ({
  path,
  event,
  config,
  setConfig,
  onChangeRef,
}:TOnInputChange) => {

  const val = onChangeRef.current?.(event)
  const value = exists(val) ? val : event.target.value

  const curInput = get<TFCItem>(config, path, noOpObj)
  if(curInput?.value === value) return

  updateConfig(setConfig, config, path, {...curInput, value })

}