import { useCallback } from 'react'
import { Values } from 'GBConstants'
import { exists } from '@keg-hub/jsutils'
import { setModalVisibility } from 'GBActions/modals'

const { SCREENS } = Values

/**
 * Creates a memoized callback for closing the currently active modal
 * Also checks if the passed in tabId is equal to the empty screen
 * If it is closing the modal is disabled
 *
 * @param {string} tabId - Id of a screen
 *
 * @returns {void}
 */
export const useCloseModal = tabId =>
  useCallback(() => {
    const closeModal = exists(tabId) ? tabId !== SCREENS.EMPTY : true
    closeModal && setModalVisibility(false)
  }, [tabId])
