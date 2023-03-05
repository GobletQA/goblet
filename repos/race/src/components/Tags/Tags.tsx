import type { TTagsParentAst, TFeaturesRef } from '@GBR/types'

import { TagsContainer } from './Tags.styled'
import { AutoInput } from '@gobletqa/components'
import { capitalize, cls } from '@keg-hub/jsutils'
import { ESectionType, EMetaType } from '@GBR/types'
import { useFeatureTags } from '@GBR/hooks/features/useFeatureTags'

export type TTags = {
  type:ESectionType
  parent:TTagsParentAst
  featuresRef:TFeaturesRef
}

export const Tags = (props:TTags) => {
  
  const { parent, type } = props
  const { tags } = parent
  const options = useFeatureTags(props)

  return (
    <TagsContainer className={cls(`gr-tags`, `gr-${type}-tags`)} >
      <AutoInput
        multiple={true}
        labelSide={true}
        variant='standard'
        id={`${parent.uuid}-tags`}
        currentValue={tags || [``]}
        name='feature-tags-auto-input'
        label={capitalize(EMetaType.tags)}
        className={`gr-${type}-tags-input`}
        options={[...Object.keys(options)]}
        placeholder={`${capitalize(type)} tags ...`}
      />
    </TagsContainer>
  )
}