import type { TFConfig, TOptions } from '../form.types'
import type { Dispatch, SetStateAction } from 'react'

import { useEffect, useRef } from 'react'
import { buildOptsUpdate } from '../utils/buildOptsUpdate'

export type TBuildOptsWatch = {
  path: string
  config: TFConfig
  setConfig:Dispatch<SetStateAction<TFConfig>>
  buildOptions?: ((config: TFConfig) => TOptions)
}

export const useBuildOptsWatch = ({
  path,
  config,
  setConfig,
  buildOptions
}: TBuildOptsWatch) => {
  const buildOptionsRef = useRef(buildOptions)
  useEffect(() => {
    buildOptsUpdate({
      path,
      config,
      setConfig,
      buildOptions,
      buildOptionsRef
    })
  }, [buildOptions])
  
  return buildOptionsRef
}