import type {
  TRaceFeatures,
  TRaceFeatureGroup,
} from '@GBR/types'

import { emptyObj } from '@keg-hub/jsutils'
import { styles } from './FeatureItemHelpers'
import { stopPropagation } from '@gobletqa/components'
import { FeatureGroupHeaderEdit } from './FeaturesList.styled'
import { useEditingFeatureGroup } from '@GBR/hooks/features/useEditingFeatureGroup'


export type TFeatureGroupHeader = {
  featureGroups:TRaceFeatures
  featureGroup:TRaceFeatureGroup
}

export const FeatureGroupEditingHeader = (props:TFeatureGroupHeader) => {
  
  const {
    onBlur,
    nameRef,
    onKeyDown,
    nameConflict,
  } = useEditingFeatureGroup(props)

  return (
    <FeatureGroupHeaderEdit
      ref={nameRef}
      contentEditable
      onBlur={onBlur}
      spellCheck={false}
      onKeyDown={onKeyDown}
      placeholder='Enter a group name...'
      onClick={stopPropagation}
      className='gb-race-group-item-edit'
      style={nameConflict ? styles.conflictFolder : emptyObj}
    />
  )
  
}