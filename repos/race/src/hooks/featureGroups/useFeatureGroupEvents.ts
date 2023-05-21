import type {
  RefObject,
  KeyboardEventHandler
} from 'react'
import type {
  TRaceFeatures,
  TOnSaveGroupName,
  TRaceFeatureGroup,
} from '@GBR/types'

import { useCallback } from 'react'
import {exists} from '@keg-hub/jsutils'
import { preventDefault } from '@gobletqa/components'
import { EmptyFeatureGroupUUID } from '@GBR/constants'
import { cleanString } from '@GBR/utils/helpers/cleanString'

import { saveFeatureGroup } from '@GBR/actions/featureGroups/saveFeatureGroup'
import { cancelFeatureGroup } from '@GBR/actions/featureGroups/cancelFeatureGroup'
import { editFeatureGroupName } from '@GBR/actions/featureGroups/editFeatureGroupName'

type THOnFeatureGroup = {
  featureGroup:TRaceFeatureGroup
}

type THOnSharedProps = {
  nameConflict:boolean,
  featureGroups:TRaceFeatures
  onSaveGroupName:TOnSaveGroupName
  setNameConflict: (state:boolean) => void
}

type THSaveGroupName = THOnFeatureGroup & {
  nameRef:RefObject<HTMLDivElement>
}

export type THOnKeyDown = THOnSharedProps & {
  featureGroup:TRaceFeatureGroup
}

export type THOnBlur = THOnSharedProps & {
  nameRef:RefObject<HTMLDivElement>
}

const checkNameConflict = (
  name:string,
  featureGroups:TRaceFeatures
):boolean => exists<boolean>(featureGroups[name])

export const useOnKeyDown = (props:THOnKeyDown) => {
  const {
    nameConflict,
    featureGroup,
    featureGroups,
    onSaveGroupName,
    setNameConflict
  } = props
  
  return useCallback<KeyboardEventHandler<HTMLDivElement>>((event) => {
    const divElement = event?.target as HTMLDivElement
    const name = `${divElement?.textContent}${event.key}`

    /**
     * Pressing Enter key 
     */
    if(event.keyCode === 13){
      preventDefault(event)
      divElement?.blur()
      return
    }

    /**
     * Pressing Escape key 
     */
    if(event.keyCode === 27){
      preventDefault(event)
      return featureGroup.uuid === EmptyFeatureGroupUUID
        ? cancelFeatureGroup(featureGroup)
        : editFeatureGroupName({ featureGroup, editing: false })
    }


    const hasConflict = checkNameConflict(name, featureGroups)

    ;((hasConflict && !nameConflict) || (!hasConflict && nameConflict))
      && setNameConflict(hasConflict)

  },[
    nameConflict,
    featureGroup,
    featureGroups,
    onSaveGroupName,
  ])
}

export const useOnBlur = (props:THOnBlur) => {
  const {
    nameRef,
    nameConflict,
    onSaveGroupName,
    featureGroups,
    setNameConflict
  } = props
  
  return useCallback((evt:any) => {
    preventDefault(evt)
    const name = nameRef.current?.textContent as string

    if(nameConflict || checkNameConflict(name, featureGroups)){
      !nameConflict && setNameConflict(true)
      return
    }

    onSaveGroupName?.(evt, name)
  },
  [
    nameConflict,
    featureGroups,
    onSaveGroupName,
  ])
}

export const useSaveGroupName = (props:THSaveGroupName) => {
  const {
    nameRef,
    featureGroup,
  } = props

   return useCallback<TOnSaveGroupName>((event) => {
    const textName = nameRef.current?.textContent as string
    
    saveFeatureGroup({ featureGroup: { ...featureGroup, title: cleanString(textName) }})
  }, [
    featureGroup,
  ])

}