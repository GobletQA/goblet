import type { TFCItem, TFConfig, TOptions } from '../form.types'

import { set } from '@keg-hub/jsutils'

export type TBuildItem = {
  path: string,
  config: TFConfig
  input: Partial<TFCItem>
  buildOptions?: (config:TFConfig) => TOptions
}

export const buildItem = ({
  path,
  input,
  config,
  buildOptions
}:TBuildItem) => {
  const options = buildOptions?.(config)
  options && options.length && (input.options = options)
  // Add path as non-enumerable / non-writable
  // Ensures its consistent, and does not change
  Object.defineProperty(input, `path`, { value: path })
  ;set(config, path, input)

  return input
}