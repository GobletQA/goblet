import type { TFCItem, TFConfig, TOptions } from '../form.types'
import type { TOnChange } from './useBuildItem'

import { useState } from 'react'
import { useGetSet } from './useGetSet'
import { useBuildItem } from './useBuildItem'
import { useTrackInput } from './useTrackInput'

import { pickKeys } from '@keg-hub/jsutils'
import { useBuildOptsWatch } from './useBuildOptsWatch'


export type TInputConfig<T=Record<any, any>> = TFCItem<T> & {
  key: string
  path: string
  buildOptions?: (config:TFConfig) => TOptions
  onChange?: TOnChange
}

const trackKeys = [
  `key`,
  `type`,
  `width`,
  `value`,
  `label`,
  `disabled`,
  `required`,
  `fullWidth`,
  `placeholder`,
]

export const useBuildInput = (
  props:TInputConfig,
  options:Record<"config", TFConfig>
) => {

  const { config:FConfig } = options
  const { path, onChange, buildOptions, ...input } = props
  const [config, setConfig] = useState<TFConfig>(FConfig)

  useBuildOptsWatch({
    path,
    config,
    setConfig,
    buildOptions
  })

  useBuildItem({
    path,
    input,
    config,
    onChange,
    setConfig,
    buildOptions,
  })

  useTrackInput({
    path,
    config,
    setConfig,
    toTrack: pickKeys(input, trackKeys),
  })

  const { getValue, setValue } = useGetSet({
    path,
    config,
    setConfig
  })

  const ref = input.key || path

  return {
    ...options,
    config,
    setValue,
    getValue,
    [ref]: { setValue, getValue },
  }
}