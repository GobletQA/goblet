import type { TFCItem, TFConfig } from '../form.types'
import type { Dispatch, SetStateAction } from 'react'

import { useEffect } from 'react'
import { get, noOpObj } from '@keg-hub/jsutils'
import { updateConfig } from '../utils/updateConfig'

export type TTrackInput = {
  path: string
  config: TFConfig
  toTrack: Record<string, any>
  setConfig:Dispatch<SetStateAction<TFConfig>>
}

export const useTrackInput = ({
  path,
  config,
  toTrack,
  setConfig
}:TTrackInput) => {

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

}