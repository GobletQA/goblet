import type { RefObject, MouseEventHandler, KeyboardEventHandler } from 'react'
import type {
  TRaceFeature,
  TRaceFeatures,
  TEditorFeatureActions
} from '@GBR/types'

import { useCallback } from 'react'
import { preventDefault } from '@gobletqa/components'
import { updateFeature } from '@GBR/actions/feature/updateFeature'
import { renameFeature } from '@GBR/actions/feature/renameFeature'

export type TOnKeyDown = {
  nameConflict:boolean
  featureGroups:TRaceFeatures
  editingName:string|undefined
  setNameConflict: (state:boolean) => void
  onEditFeature:TEditorFeatureActions[`onEditFeature`]
}

export type TOnBlur = {
  feature:TRaceFeature,
  nameConflict:boolean,
  featureGroups:TRaceFeatures
  editingName:string|undefined,
  nameRef:RefObject<HTMLDivElement>
  setNameConflict: (state:boolean) => void
  onEditFeature:TEditorFeatureActions[`onEditFeature`],
}

const checkNameConflict = (
  name:string,
  featureGroups:TRaceFeatures
):boolean => {
  return Boolean(
    Object.values(featureGroups).find(feat => {
      return `items` in feat
        ? checkNameConflict(name, feat.items)
        : feat?.feature?.toLowerCase() === name.toLowerCase()
    })
  )
}

export const useOnKeyDown = (props:TOnKeyDown) => {
  const {
    editingName,
    nameConflict,
    featureGroups,
    onEditFeature,
    setNameConflict
  } = props
  
  return useCallback<KeyboardEventHandler<HTMLDivElement>>((event) => {
    if(!editingName) return

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
      onEditFeature?.(event, ``)
      return
    }

    const hasConflict = checkNameConflict(name, featureGroups)

    ;((hasConflict && !nameConflict) || (!hasConflict && nameConflict))
      && setNameConflict(hasConflict)

  },[
    editingName,
    nameConflict,
    featureGroups,
    onEditFeature,
  ])
}

export const useOnBlur = (props:TOnBlur) => {
  const {
    nameRef,
    feature,
    editingName,
    nameConflict,
    onEditFeature,
    featureGroups,
    setNameConflict
  } = props
  
  return useCallback(() => {
    if(!editingName) return

    const name = nameRef.current?.textContent as string

    if(nameConflict || checkNameConflict(name, featureGroups)){
      !nameConflict && setNameConflict(true)
      return
    }

    // onEditFeature?.(event, ``)
    // updateFeature({ ...feature, feature: name })

    renameFeature({
      newName: name,
      // Sidebar file rename in race editor, updates file name, and feature name
      feature: {...feature, feature: name },
      oldName: feature.path.split(`/`).pop() as string,
    })

  }, [
    feature,
    editingName,
    nameConflict,
    onEditFeature,
    featureGroups
  ])
}
