import type { MouseEventHandler } from 'react'
import type { TRaceFeature, TEditorFeatureActions } from '@GBR/types'

import { useCallback, useRef, useEffect } from 'react'
import { cls, wordCaps } from '@keg-hub/jsutils'
import { stopPropagation } from '@gobletqa/components'
import { FeatureItemActions } from './FeatureItemActions'
import { FeatureItem, FeatureItemName } from './FeaturesList.styled'

export type TFeatureListItem = TEditorFeatureActions & {
  active:TRaceFeature
  feature:TRaceFeature
}


          // onBlur={fileBlur}
          // onKeyDown={fileKeyDown}
          // style={nameConflict ? styles.conflictFile : noOpObj}



export const FeatureListItem = (props:TFeatureListItem) => {
  const {
    active,
    feature,
    editingName,
    onEditFeature,
    onActiveFeature,
    onDeleteFeature,
  } = props

  const onClick = useCallback<MouseEventHandler<HTMLDivElement>>(
    (evt) => onActiveFeature?.(evt, feature),
    [feature, onActiveFeature]
  )

  // TODO: Fix name editing of a feature
  // Need to update feature title
  // Need to add event handlers for key-down && click
  // Need to add validations on name

  const isActive = feature?.uuid === active?.uuid
  const nameRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if(!nameRef.current || !editingName) return

    nameRef.current.textContent = feature.feature
    nameRef.current?.focus()
    const selection = window.getSelection()
    const range = document.createRange()

    let firstChild = nameRef?.current?.firstChild
    if(!firstChild){
      const textNode = document.createTextNode(``)
      nameRef?.current?.appendChild(textNode)
      firstChild = textNode
    }

    range.setStart(firstChild, 0)
    range.setEnd(firstChild, feature.feature.length)
    selection?.removeAllRanges()
    selection?.addRange(range)

  }, [editingName, feature])

  return (
    <FeatureItem
      onClick={onClick}
      focusRipple={true}
      selected={isActive}
      disableRipple={true}
      disableTouchRipple={true}
      className={cls(`gb-features-list-item`, isActive && `active`)}
    >

    {feature?.uuid === editingName ? (
      <FeatureItemName>
        <div
          ref={nameRef}
          contentEditable
          spellCheck={false}
          onClick={stopPropagation}
          className='gb-feature-item-edit'
        />
      </FeatureItemName>
    ) : (
      <FeatureItemName>
        {wordCaps(feature.feature)}
      </FeatureItemName>
    )}

      <FeatureItemActions
        feature={feature}
        currentPath={active?.path}
        onEditFeature={onEditFeature}
        onDeleteFeature={onDeleteFeature}
      />
    </FeatureItem>
  )
}