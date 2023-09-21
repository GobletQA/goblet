import { appDispatch } from '@store/dispatchers'

export const toggleTestRunsView = (state?:boolean) => {
  appDispatch.toggleTestRunsView(state)
}