import { TRaceOpData, EOperations } from "@GBR/types"
import { dispatchOp }  from './dispatchOp'

export type TCutOp = {
  data:TRaceOpData
}


export const cutOperation = (props:TCutOp) => {
  return dispatchOp({
    data: {
      ...props?.data,
      from: EOperations.cut,
    },
    // Dispatch the cut event into the paste slot on the operations context
    type: EOperations.paste
  })
}
