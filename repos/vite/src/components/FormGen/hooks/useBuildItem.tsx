import type { TFCItem, TFConfig, TOptions } from '../form.types'
import type { ChangeEvent, Dispatch, SetStateAction } from 'react'

import { useMemo } from 'react'
import { useWatchRef } from './useWatchRef'
import { buildItem } from '../utils/buildItem'
import { useInputChange } from './useInputChange'

export type TOnChange = (event:ChangeEvent<HTMLInputElement>) => any

export type TBuildItem = {
  path: string,
  config: TFConfig
  onChange?:TOnChange,
  input: Partial<TFCItem>
  setConfig:Dispatch<SetStateAction<TFConfig>>
  buildOptions?: (config:TFConfig) => TOptions
}

export const useBuildItem = ({
  path,
  input,
  config,
  onChange,
  setConfig,
  buildOptions
}:TBuildItem) => {

  const onChangeRef = useWatchRef<TOnChange|undefined>(onChange)
  // Add on change listener to update the value
  // Then set the update to the config and update the state
  const onInputChange = useInputChange({
    path,
    config,
    setConfig,
    onChangeRef,
  })

  // Set the initial input to the config. Only runs on mount
  useMemo(() => {
    buildItem({
      path,
      config,
      buildOptions,
      input: {...input, onChange: onInputChange }
    })
  }, [])

}