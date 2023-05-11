import type { TRaceFeatures, TRaceFeature, TEditorFeatureActions } from '@GBR/types'

import { styles } from './FeatureItemHelpers'
import { FeatureItemActions } from './FeatureItemActions'
import { cls, wordCaps, emptyObj } from '@keg-hub/jsutils'
import { Tooltip, stopPropagation } from '@gobletqa/components'
import { FeatureItem, FeatureItemName } from './FeaturesList.styled'
import { useFeatureItemHooks } from '@GBR/hooks/features/useFeatureItemHooks'

export type TFeatureListItem = TEditorFeatureActions & {
  active:TRaceFeature
  feature:TRaceFeature
  onAbortEditing?:() => void
  featureGroups:TRaceFeatures
}

export const FeatureListItem = (props:TFeatureListItem) => {
  const {
    active,
    feature,
    editingName,
    onEditFeature,
    onDeleteFeature,
  } = props

  const {
    nameRef,
    onClick,
    isActive,
    onKeyDown,
    nameConflict,
  } = useFeatureItemHooks(props)

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
      <>
      <FeatureItemName>
        <div
          ref={nameRef}
          contentEditable
          spellCheck={false}
          onKeyDown={onKeyDown}
          onClick={stopPropagation}
          className='gb-feature-item-edit'
          style={nameConflict ? styles.nameConflict : emptyObj}
        />
      </FeatureItemName>
      <Tooltip
        loc='bottom'
        describeChild
        enterDelay={500}
        open={nameConflict}
        disableFocusListener
        disableHoverListener
        disableTouchListener
        title={`Name conflicts with an existing feature`}
      >
        <span className='gb-name-conflict-empty-tooltip' ></span>
      </Tooltip>
      </>
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