import type { TRaceTagsParent, TFeaturesRef } from '@GBR/types'

import { TagsContainer } from './Tags.styled'
import { AutoInput } from '@gobletqa/components'
import { capitalize, cls } from '@keg-hub/jsutils'
import { ESectionType, EMetaType } from '@GBR/types'
import { useFeatureTags } from '@GBR/hooks/features/useFeatureTags'

export type TTags = {
  type:ESectionType
  parent:TRaceTagsParent
  featuresRef:TFeaturesRef
  onChange?:(...args:any[]) => void
}

export const Tags = (props:TTags) => {
  
  const { parent, type, onChange } = props
  const { tags } = parent
  const options = useFeatureTags(props)

  return (
    <TagsContainer className={cls(`gb-tags`, `gb-${type}-tags`)} >
      <AutoInput
        multiple={true}
        labelSide={true}
        variant='standard'
        onChange={onChange}
        id={`${parent.uuid}-tags`}
        currentValue={tags || [``]}
        name='feature-tags-auto-input'
        label={capitalize(EMetaType.tags)}
        className={`gb-${type}-tags-input`}
        options={[...Object.keys(options)]}
        placeholder={`${capitalize(type)} tags ...`}
      />
    </TagsContainer>
  )
}