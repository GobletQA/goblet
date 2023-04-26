import { exists } from '@keg-hub/jsutils'
import { getStore, modalDispatch } from '@store'

/**
 * Updates the current active modal visibility
 */
export const toggleModal = (visible?:boolean) => {
  const { modal } = getStore().getState()
  modalDispatch.setModalVisible(exists<boolean>(visible) ? visible : !modal.visible)
}
