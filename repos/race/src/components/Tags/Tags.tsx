

import type { TTagsParentAst, TFeaturesRef } from '@GBR/types'

import { TagsContainer } from './Tags.styled'
import { capitalize, cls } from '@keg-hub/jsutils'
import { AutoInput } from '@gobletqa/components'
import { ESectionType, EMetaType } from '@GBR/types'
import { useFeatureTags } from '@GBR/hooks/useFeatureTags'

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
        value={tags?.join(` `) || ``}
        multiple={true}
        id={`${parent.uuid}-tags`}
        label={capitalize(EMetaType.tags)}
        className={`gr-${type}-tags-input`}
        options={[ ``, ...Object.keys(options)]}
        placeholder={`${capitalize(type)} tags ...`}
      />
    </TagsContainer>
  )
}