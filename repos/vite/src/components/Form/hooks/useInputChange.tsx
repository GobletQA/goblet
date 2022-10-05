import type { TFConfig } from '../form.types'
import type { ChangeEvent, Dispatch, SetStateAction, MutableRefObject } from 'react'

import { useCallback } from 'react'
import { onInputChange } from '../utils/onInputChange'

export type TInputChange = {
  path: string
  config: TFConfig
  onChangeRef:MutableRefObject<any>,
  setConfig:Dispatch<SetStateAction<TFConfig>>
}

export const useInputChange = ({
  path,
  config,
  setConfig,
  onChangeRef,
}:TInputChange) => {
  
  // Add on change listener to update the value
  // Then set the update to the config and update the state
  return useCallback((event:ChangeEvent<HTMLInputElement>) => {
    onInputChange({
      event,
      path,
      config,
      setConfig,
      onChangeRef,
    })
  }, [config, path])

}