import { appDispatch } from '@store'

export const toggleInspector = (update:boolean|undefined) => {
  appDispatch.toggleInspector(update)
}

