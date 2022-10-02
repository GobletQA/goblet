import { ModalTypes } from '@constants'
import { modalDispatch } from '@store'
import { noOpObj } from '@keg-hub/jsutils'

/**
 * Sets a modals visitable state based on passed in arguments
 * If the modal has localModal state true, then will not be set active
 */
export const setActiveModal = async (
  type:ModalTypes,
  visible:boolean=true,
  modalProps=noOpObj as Record<any, any>
) => {

  if(!ModalTypes[type])
    return console.warn(`Modal of type ${type} does not exist`)

  modalDispatch.setModal({
    type,
    visible,
    modalProps,
  })
}
