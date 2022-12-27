import type { MutableRefObject } from 'react'
import type { TRaceFeatures, TRaceEditorProps } from '../types'


export type THOpenedTabs = {
  featuresRef: MutableRefObject<TRaceFeatures>
}

export const useOpenedTabs = (props:THOpenedTabs) => {
  
  const {
    featuresRef
  } = props


  return {
    
  }
}