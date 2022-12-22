import { EModalTypes } from '@types'
import { modalDispatch } from '@store'
import { noOpObj } from '@keg-hub/jsutils'

export type TModalProps = Record<any, any>

/**
 * Sets a modals visitable state based on passed in arguments
 * If the modal has localModal state true, then will not be set active
 */
export const setActiveModal = async (
  type:EModalTypes,
  visible:boolean=true,
  modalProps:TModalProps=noOpObj
) => {

  if(!EModalTypes[type])
    return console.warn(`Modal of type ${type} does not exist`)

  modalDispatch.setModal({
    type,
    visible,
    modalProps,
  })
}
