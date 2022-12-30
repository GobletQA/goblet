import type { ComponentProps } from 'react'

import { cls, emptyArr } from '@keg-hub/jsutils'
import { TagInput, TagAutoComp } from './Tags.styled'

export type TTagsInput = Omit<ComponentProps<typeof TagAutoComp>, `renderInput`> & {
  tags?:string[]
  options:string[]
}

/**
renderTags={(value: readonly string[], getTagProps) =>
  value.map((option: string, index: number) => (
    <Chip variant="outlined" label={option} {...getTagProps({ index })} />
  ))
}
*/

export const TagsInput = (props:TTagsInput) => {

  const {
    options,
    className,
    tags=emptyArr,
    ...rest
  } = props


  return (
    <TagAutoComp
      freeSolo
      multiple
      value={tags}
      options={options}
      className={cls('gr-tags-input', className)}
      {...rest}
      renderInput={(params) => (
        <TagInput
          {...params}
          label="Tags"
          placeholder="Enter a tag name..."
        />
      )}
    />
  )
}
