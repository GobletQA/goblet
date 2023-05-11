import type { TRaceFeature, TEditorFeatureActions } from '@GBR/types'

import { cls, wordCaps } from '@keg-hub/jsutils'
import { stopPropagation } from '@gobletqa/components'
import { FeatureItemActions } from './FeatureItemActions'
import { FeatureItem, FeatureItemName } from './FeaturesList.styled'
import { useFeatureItemHooks } from '@GBR/hooks/features/useFeatureItemHooks'

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

  const {
    nameRef,
    onClick,
    isActive,
  } = useFeatureItemHooks(props)


  // TODO: Fix name editing of a feature
  // Need to update feature title
  // Need to add event handlers for key-down && click
  // Need to add validations on name

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