import { appDispatch } from '@store/dispatchers'

export const toggleExamView = (state?:boolean) => {
  appDispatch.toggleExamView(state)
}