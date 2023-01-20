import type { TOnToggle } from '@components/Form/Inputs/Toggle'

import { useInline } from '@gobletqa/components'
import { Toggle } from '@components/Form/Inputs/Toggle'

export type TBranchToggle = {
  branchFrom?:boolean
  setBranchFrom?:(change:boolean) => void
}

const toggleOpts = [
  { value: `existing`, text: `Existing` },
  { value: `create`, text: `Create` },
]


export const BranchToggle = (props:TBranchToggle) => {
  const {
    branchFrom,
    setBranchFrom
  } = props

  const onChange = useInline<TOnToggle>((evt, value) => {
    !branchFrom
      ? value === `create` && setBranchFrom?.(true)
      : value === `existing` && setBranchFrom?.(false)
  })

  const value = branchFrom ? toggleOpts[1] : toggleOpts[0]

  return (
    <Toggle
      value={value}
      label='Branch Type'
      onChange={onChange}
      options={toggleOpts}
    />
  )
  
}