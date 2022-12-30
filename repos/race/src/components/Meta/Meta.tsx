import { Desire } from './Desire'
import { Reason } from './Reason'
import { Perspective } from './Perspective'

export type TMeta = {
  
}

export const Meta = (props:TMeta) => {
  return (
    <>
      <Perspective />
      <Desire />
      <Reason />
    </>
  )
}