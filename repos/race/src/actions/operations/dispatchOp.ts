import type { TOperationsUpdate, TOnUpdateOperationEvt } from '@GBR/types'

import { EE } from '@gobletqa/shared/libs/eventEmitter'
import { OnUpdateOperationEvent } from '@GBR/constants/events'

export const dispatchOp = (
  op:TOperationsUpdate
) => {
  !op.type
    ? console.warn(`An operation type is required to update the operations context`, op)
    : EE.emit<TOnUpdateOperationEvt>(OnUpdateOperationEvent, op)
}
