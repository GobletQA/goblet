import type { TOnToggle } from '@gobletqa/components'

import { useInline } from '@gobletqa/components'
import { Toggle } from '@gobletqa/components/components/Form/Inputs'

export type TRepoToggle = {
  createRepo:boolean
  onCreateRepo:(evt:any, val:boolean) => void
}

const toggleOpts = [
  { value: `existing`, text: `Existing` },
  { value: `create`, text: `Create` },
]


export const RepoToggle = (props:TRepoToggle) => {
  const {
  createRepo,
  onCreateRepo
  } = props

  const onChange = useInline<TOnToggle>((evt, value) => {
    !createRepo
      ? value === `create` && onCreateRepo?.(evt, true)
      : value === `existing` && onCreateRepo?.(evt, false)
  })

  const value = createRepo ? toggleOpts[1] : toggleOpts[0]

  return (
    <Toggle
      value={value}
      label='Repo Type'
      onChange={onChange}
      options={toggleOpts}
    />
  )
  
}