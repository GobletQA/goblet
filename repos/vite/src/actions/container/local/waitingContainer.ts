import { containerDispatch } from '@store'

export const waitingContainer = (waiting?:boolean) => containerDispatch.waitingContainer(waiting)