import { TRaceAst, EOperations } from "@GBR/types"
import { dispatchOp }  from './dispatchOp'

export type TCopyOp = {
  data:TRaceAst
}

export const copyOperation = (props:TCopyOp) => {
  return dispatchOp({
    ...props,
    // Dispatch the copy event into the paste slot on the operations context
    type: EOperations.paste
  })
}
