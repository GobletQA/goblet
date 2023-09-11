import type {
  TRaceFeature,
  TRaceFeatures,
  TEditorFeatureActions
} from '@GBR/types'

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
    onBlur,
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
      className={cls(
        `gb-features-list-item`,
        isActive && `active`,
        !feature.feature && `gb-feature-item-title-missing`
      )}
    >

      {feature?.uuid === editingName ? (
        <>
          <FeatureItemName>
            <div
              ref={nameRef}
              onBlur={onBlur}
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
            <span className='gb-feature-name-conflict-tooltip' ></span>
          </Tooltip>
        </>
      ) : (
        <Tooltip
          loc='bottom'
          describeChild
          enterDelay={300}
          disabled={Boolean(feature.feature)}
          title={`Feature is missing a title or name`}
        >
          <FeatureItemName
            className={cls(
              `gb-feature-title`,
              !feature.feature && `gb-feature-title-missing`
            )}
          >
            {wordCaps(feature.feature)}
          </FeatureItemName>
        </Tooltip>
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