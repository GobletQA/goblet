import type { TEditingProps, TTagsParentAst, TFeaturesRef } from '@GBR/types'
import type { TMeta } from './Meta'

import { EMetaType } from '@GBR/types'
import { MetaInput } from './MetaInput'
import { MetaContainer } from './Meta.styled'
import { useFeatureTags } from '@GBR/hooks/useFeatureTags'

export type TTags = TMeta & TEditingProps & {
  parent:TTagsParentAst
  featuresRef:TFeaturesRef
}

export const Tags = (props:TTags) => {
  const {
    parent,
    editing,
    setEditing,
  } = props
  const { tags } = parent
  const options = useFeatureTags(props)

  return (
    <MetaContainer className='gr-feature-tags' >

      <MetaInput
        value={tags}
        multiple={true}
        editing={editing}
        setEditing={setEditing}
        type={EMetaType.tags}
        id={`${parent.uuid}-tags`}
        className='gr-feature-tags'
        placeholder='Feature tags ...'
        options={Object.keys(options)}
      />

    </MetaContainer>
  )
}