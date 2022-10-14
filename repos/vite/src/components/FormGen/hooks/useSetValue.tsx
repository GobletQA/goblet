import type { TFCItem, TFConfig } from '../form.types'
import type { Dispatch, SetStateAction } from 'react'

import { get, noOpObj } from '@keg-hub/jsutils'
import { useCallback } from 'react'
import { updateConfig } from '../utils/updateConfig'

export type TSetValue = {
  path: string
  config: TFConfig
  setConfig:Dispatch<SetStateAction<TFConfig>>
}

export const useSetValue = ({
  path,
  config,
  setConfig
}:TSetValue) => {
  return useCallback((value:any) => {
    updateConfig(setConfig, config, path, {...get<TFCItem>(config, path, noOpObj), value})
  }, [config, path])

}