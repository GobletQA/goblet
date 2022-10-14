import type { TFConfig } from '../form.types'
import type { Dispatch, SetStateAction } from 'react'

import { useCallback } from 'react'
import { get } from '@keg-hub/jsutils'
import { useSetValue } from './useSetValue'


export type TGetSet = {
  path:string
  config: TFConfig
  setConfig:Dispatch<SetStateAction<TFConfig>>
}

export const useGetSet = ({
  path,
  config,
  setConfig
}:TGetSet) => {
  const getValue = useCallback(() => get(config, path)?.value, [config, path])
  const setValue = useSetValue({
    path,
    config,
    setConfig
  })

  return { getValue, setValue }
}