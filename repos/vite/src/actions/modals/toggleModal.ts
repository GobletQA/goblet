import { modalDispatch } from '@store'

/**
 * Updates the current active modal visibility
 */
export const toggleModal = (visible:boolean) => {
  modalDispatch.setVisible(visible)
}
