import type { TFCItem, TFConfig, TOptions } from '../form.types'
import type { Dispatch, SetStateAction, MutableRefObject } from 'react'

import { updateConfig } from './updateConfig'
import { get, noOpObj } from '@keg-hub/jsutils'

type TBuildOptsFunc = ((config: TFConfig) => TOptions)

export type TBuildOptsWatch = {
  path: string
  config: TFConfig
  buildOptions?: TBuildOptsFunc
  setConfig:Dispatch<SetStateAction<TFConfig>>
  buildOptionsRef: MutableRefObject<TBuildOptsFunc|undefined>
}

export const buildOptsUpdate = ({
  path,
  config,
  setConfig,
  buildOptions,
  buildOptionsRef,
}: TBuildOptsWatch) => {

  const input = get<TFCItem>(config, path, noOpObj)

  if(buildOptionsRef.current === buildOptions && input?.options) return

  buildOptionsRef.current !== buildOptions && (buildOptionsRef.current = buildOptions)

  const options = buildOptionsRef.current?.(config)
  if(!options || !options.length) return

  updateConfig(setConfig, config, path, {...get<TFCItem>(config, path, noOpObj), options })

}