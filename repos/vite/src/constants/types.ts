import { deepFreeze } from '@keg-hub/jsutils'

export type TModalTypes = {
  SIGN_IN: string
  NO_LOCAL_MOUNT: string
  CONNECT_REPO: string
  TEST_SELECTOR: string
}

/**
 * Constants for referencing modal types
 * Allows two way referencing by mapping all keys as values interchangeably
 * @type {Object}
*/
export const MODAL_TYPES = deepFreeze(
  Object.entries({
    SIGN_IN: 'signIn',
    NO_LOCAL_MOUNT: 'noLocalMount',
    CONNECT_REPO: 'connectRepoModal',
    TEST_SELECTOR: 'testSelectorModal',
    CONFIRM_REMOVE_FILE: `confirmRemoveFile`,
  }).reduce((acc, [key, value]) => {
    acc[key] = value
    acc[value] = key

    return acc
  }, {} as Record<string, string>)
) as TModalTypes
