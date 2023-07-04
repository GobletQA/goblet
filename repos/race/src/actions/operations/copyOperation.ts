import { TRaceOpData, EOperations } from "@GBR/types"
import { dispatchOp }  from './dispatchOp'

export type TCopyOp = {
  data:TRaceOpData
}

export const copyOperation = (props:TCopyOp) => {
  return dispatchOp({
    data: {
      ...props?.data,
      from: EOperations.copy,
    },
    // Dispatch the copy event into the paste slot on the operations context
    type: EOperations.paste
  })
}
