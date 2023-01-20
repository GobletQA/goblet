import { BranchToggleContainer } from './Connect.styled'
import { Toggle } from '@components/Form/Inputs/Toggle'

export type TBranchToggle = {
  branchFrom:boolean
  setBranchFrom:(change:boolean) => void
}

export const BranchToggle = (props:TBranchToggle) => {
  const {
    branchFrom,
    setBranchFrom
  } = props

  return (
    <BranchToggleContainer>
      <h4>Branch</h4>
      <Toggle />
    </BranchToggleContainer>
  )
  
}