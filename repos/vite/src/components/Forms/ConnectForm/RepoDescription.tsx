import type { FocusEvent } from 'react'
import type { TRepoValueCB } from '@types'

import { useCallback, useRef, useEffect } from 'react'
import { Input } from '@gobletqa/components/components/Form/Inputs'

export type TRepoProps = Partial<typeof descriptionProps> & {
  description?:string
  onChangeDescription:TRepoValueCB
}

const descriptionProps = {
  multiline:true,
  label: `Repo Description`,
  name: `new-repo-description`,
  className: `repo-description-input`,
  placeholder: `Enter a description of the repository...`,
}

export const RepoDescription = (props:TRepoProps) => {
  const {
    description,
    onChangeDescription,
  } = props

  const onBlur = useCallback((evt:FocusEvent<HTMLInputElement>) => {
    const value = evt.target.value as string
    description !== value && onChangeDescription?.(value)
  }, [description])

  const inputRef = useRef<HTMLInputElement>()

  useEffect(() => {
    inputRef.current
      && description
      && inputRef.current?.value !== description
      && (inputRef.current.value = description)
  }, [description])

  return (
    <Input
      {...descriptionProps}
      onBlur={onBlur}
      inputRef={inputRef}
      defaultValue={description}
    />
  )

}

