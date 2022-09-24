import { keyMap } from '@keg-hub/jsutils'

export const ActionTypes = keyMap(
  [
    // App
    `APP_INIT`,

    // Items
    `UPSERT_ITEM`,
    `UPSERT_ITEMS`,
    `SET_ITEM`,
    `SET_ITEMS`,
    `REMOVE_ITEM`,

    // Taps
    `SWITCHING_TAP`,
  ],
  true
)
