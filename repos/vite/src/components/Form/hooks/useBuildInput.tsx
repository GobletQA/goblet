import type { TFCItem, TFConfig, TOptions } from '../form.types'
import type { ChangeEvent, Dispatch, SetStateAction } from 'react'

import { set, get, noOpObj, exists, pickKeys } from '@keg-hub/jsutils'
import { useCallback, useState, useEffect, useMemo, useRef } from 'react'

export type TInputConfig<T=Record<any, any>> = TFCItem<T> & {
  key: string
  path: string
  buildOptions?: (config:TFConfig) => TOptions
  onChange?: (event:ChangeEvent<HTMLInputElement>) => any
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

const updateConfig = (
  setConfig:Dispatch<SetStateAction<TFConfig>>,
  config:TFConfig,
  path:string,
  update:TFCItem,
) => {
  const updated = {...config}
  set(updated, path, update)
  setConfig(updated)
}

export const useBuildInput = (
  props:TInputConfig,
  options:Record<"config", TFConfig>
) => {
  const { config:FConfig } = options
  const { path, onChange, buildOptions, ...input } = props
  const [config, setConfig] = useState<TFConfig>(FConfig)

  const onChangeRef = useRef(onChange)
  useEffect(() => {
    onChangeRef.current !== onChange && (onChangeRef.current = onChange)
  }, [onChange])

  const buildOptionsRef = useRef(buildOptions)
  useEffect(() => {
    const input = get<TFCItem>(config, path, noOpObj)

    if(buildOptionsRef.current === buildOptions && input?.options) return

    buildOptionsRef.current !== buildOptions && (buildOptionsRef.current = buildOptions)

    const options = buildOptionsRef.current?.(config)
    if(!options || !options.length) return

    updateConfig(setConfig, config, path, {...get<TFCItem>(config, path, noOpObj), options })
  }, [buildOptions])


  // Add on change listener to update the value
  // Then set the update to the config and update the state
  const onInputChange = useCallback((event:ChangeEvent<HTMLInputElement>) => {
    const val = onChangeRef.current?.(event)
    const value = exists(val) ? val : event.target.value

    const curInput = get<TFCItem>(config, path, noOpObj)
    if(curInput?.value === value) return

    updateConfig(setConfig, config, path, {...curInput, value })
  }, [config, path])

  // Set the initial input to the config. Only runs on mount
  useMemo(() => {
    const built:TFCItem = {...input, onChange: onInputChange }
    const options = buildOptions?.(config)
    options && options.length && (built.options = options)

    ;set(config, path, built)
  }, [])

  const setValue = useCallback((value:any) => {
    updateConfig(setConfig, config, path, {...get<TFCItem>(config, path, noOpObj), value})
  }, [config, path])

  const toTrack = pickKeys(input, trackKeys)
  useEffect(() => {
    let hasUpdate = false
    const input = {...get<TFCItem>(config, path, noOpObj)}
    Object.entries(toTrack).forEach(([key, value]) => {
      if(input[key] === value) return
      input[key] = value
      hasUpdate = true
    })
    
    hasUpdate && updateConfig(setConfig, config, path, input)
  }, Object.values(toTrack))

  const getValue = () => get(config, path)?.value
  const ref = input.key || path

  return {
    ...options,
    config,
    setValue,
    getValue,
    [ref]: { setValue, getValue },
  }
}