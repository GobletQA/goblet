import { exists } from '@keg-hub/jsutils'
import { appDispatch, getStore } from '@store'

export const toggleMultiFeatsErr = (seen?:boolean) => {
  const { app } = getStore().getState()
  const { multiFeatsErr } = app

  const updated = exists(seen)
    ? seen
    : !multiFeatsErr
      ? true
      : undefined

  exists(updated)
    && appDispatch.toggleMultiFeatsErr(updated)

}