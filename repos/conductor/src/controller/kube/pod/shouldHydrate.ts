import { Logger } from '@gobletqa/shared/libs/logger'

export const shouldHydrate = (
  state:string,
  eventType:string,
  deletionTimestamp:string|Date,
) => {

  if(eventType === `MODIFIED` && deletionTimestamp){
    Logger.info(`Skipping pod hydrate, pod scheduled for termination`)
    return false
  }

  if(state === `Pending`){
    Logger.info(`Can not hydrate pending pod, waiting for ready state...`)
    return false
  }

  return true
}