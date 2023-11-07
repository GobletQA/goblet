import { testRunsDispatch } from '@store/dispatchers'


export const toggleTestRunScrollLock = (state?:boolean|undefined) => {
  testRunsDispatch.toggleTestsRunScrollLock(state)
}