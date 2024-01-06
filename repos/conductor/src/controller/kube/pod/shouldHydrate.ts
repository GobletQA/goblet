import { EContainerState } from '@gobletqa/shared/enums'

export const shouldHydrate = (
  state:string,
  eventType:string,
  deletionTimestamp:string|Date,
) => {

  if(state === `Failed`)
    return {
      hydrate: false,
      reason: EContainerState.Error,
      message: `Can not hydrate failed pod!`
    }

  if(deletionTimestamp)
    return {
      hydrate: false,
      reason: EContainerState.Terminated,
      message: `Skipping pod hydrate, pod scheduled for termination`
    }

  if(state === `Pending`)
    return {
      hydrate: false,
      reason: EContainerState.Creating,
      message: `Can not hydrate pending pod, waiting for ready state...`
    }

  return {
    hydrate: true,
    reason: EContainerState.Running,
  }
}