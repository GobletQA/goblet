import type { TFeaturesRef } from '@GBR/types'

import { TagsInput } from './TagsInput'
import { useFeature } from '../../contexts'
import { TagsContainer } from './Tags.styled'
import { useFeatureTags } from '@GBR/hooks/useFeatureTags'

export type TTags = {
  featuresRef: TFeaturesRef
}

export const Tags = (props:TTags) => {
  const { feature } = useFeature()
  const options = useFeatureTags(props)

  const { tags } = feature

  return (
    <TagsContainer>
      <TagsInput
        tags={tags}
        size='small'
        options={Object.keys(options)}
      />
    </TagsContainer>
  )
}