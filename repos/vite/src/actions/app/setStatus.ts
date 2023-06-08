import { EAppStatus } from "@types"
import { appDispatch, getStore } from '@store'


export const setStatus = (state:EAppStatus) => {
  const { app } = getStore().getState()
  const { status } = app

  state !== status
    && appDispatch.setStatus(state)
}