import type {
  RefObject,
  MouseEventHandler,
  KeyboardEventHandler
} from 'react'
import type {
  TRaceFeatures,
  TOnSaveGroupName,
  TRaceFeatureGroup
} from '@GBR/types'

import { useCallback } from 'react'
import {exists} from '@keg-hub/jsutils'
import { createFeature, createFolder } from '@GBR/actions'
import { preventDefault, stopPropagation } from '@gobletqa/components'

type THOnFeatureGroup = {
  featureGroup:TRaceFeatureGroup
}

type THOnSharedProps = {
  nameConflict:boolean,
  featureGroups:TRaceFeatures
  editingName:string|undefined
  onSaveGroupName:TOnSaveGroupName
  setNameConflict: (state:boolean) => void
}

type THEditGroupName = {
  editingName:string|undefined
}

export type THOnKeyDown = THOnSharedProps & {
  onBlur:(event:any) => void
}

export type THOnBlur = THOnSharedProps & {
  nameRef:RefObject<HTMLDivElement>
}

export type THOnAddSubFolder = THOnFeatureGroup & {}

export type THOnCreateFeature = THOnFeatureGroup & {}

export type THOnDeleteGroup = THOnFeatureGroup & {}

const checkNameConflict = (
  name:string,
  featureGroups:TRaceFeatures
):boolean => exists<boolean>(featureGroups[name])

export const useOnKeyDown = (props:THOnKeyDown) => {
  const {
    onBlur,
    editingName,
    nameConflict,
    featureGroups,
    onSaveGroupName,
    setNameConflict
  } = props
  
  return useCallback<KeyboardEventHandler<HTMLDivElement>>((event) => {
    if(!editingName) return
    
    const name = `${(event?.target as HTMLDivElement)?.textContent}${event.key}`

    /**
     * Pressing Enter key 
     */
    if(event.keyCode === 13){
      preventDefault(event)
      onBlur(event)
      return
    }

    /**
     * Pressing Escape key 
     */
    if(event.keyCode === 27){
      preventDefault(event)
      onSaveGroupName?.(event, ``, true)
      return
    }


    const hasConflict = checkNameConflict(name, featureGroups)

    ;((hasConflict && !nameConflict) || (!hasConflict && nameConflict))
      && setNameConflict(hasConflict)

  },[
    onBlur,
    editingName,
    nameConflict,
    featureGroups,
    onSaveGroupName,
  ])
}

export const useOnBlur = (props:THOnBlur) => {
  const {
    nameRef,
    editingName,
    nameConflict,
    onSaveGroupName,
    featureGroups,
    setNameConflict
  } = props
  
  return useCallback<MouseEventHandler>(
    (event) => {
      if(!editingName) return

      const name = nameRef.current?.textContent as string

      if(nameConflict || checkNameConflict(name, featureGroups)){
        !nameConflict && setNameConflict(true)
        return
      }

      onSaveGroupName?.(event, name)
    },
    [
      editingName,
      nameConflict,
      featureGroups,
      onSaveGroupName,
    ]
  )
}

export const useOnAddSubFolder = (props:THOnAddSubFolder) => {
  const {
    featureGroup
  } = props
  
  return useCallback<MouseEventHandler>((evt) => {
    stopPropagation(evt)

    console.log(`------- on add sub folder -------`)
    // createFolder()
  }, [
    featureGroup
  ])

}

export const useOnCreateFeature = (props:THOnCreateFeature) => {
  const {
    featureGroup
  } = props

  return useCallback<MouseEventHandler>((evt) => {
    stopPropagation(evt)

    console.log(`------- on create feature -------`)
    // createFeature()
  }, [featureGroup])
}

export const useOnDeleteGroup = (props:THOnDeleteGroup) => {
  const {
    featureGroup
  } = props

  return useCallback<MouseEventHandler>((evt) => {
    stopPropagation(evt)

    console.log(`------- on delete group -------`)
    // createFeature()
  }, [featureGroup])
}

export const useSaveGroupName = (props:THEditGroupName) => {
  const {
    editingName
  } = props
  
   return useCallback<TOnSaveGroupName>((event, name, cancel) => {
    // TODO: make call to save change to group name here
    console.log(`------- name -------`)
    console.log(name)

  }, [editingName])

}