import { modalDispatch } from '@reducers'

/**
 * Updates the current active modal visibility
 */
export const toggleModal = (visible:boolean) => {
  modalDispatch.setVisible(visible)
}
