import type { Kube } from './kube'
import type {
  TKubeEvent,
  TKubeEventCB,
  TControllerEvts,
} from '@gobletqa/conductor/types'

import { checkCall, noOpObj } from '@keg-hub/jsutils'
import { Logger } from '@gobletqa/shared/libs/logger'


const eventTypes = [
  `die`,
  `start`,
  `stop`,
  `create`,
  `destroy`,
  `connect`,
  `message`,
  `disconnect`,
]

class KubeEvtWatcher {
  start = () => {}
  on = (type:string, callback:TKubeEventCB) => {}
}


/**
 * Adds event listeners to docker api events, and calls corresponding callbacks
 */
export const kubeEvents = (kube:Kube, events:TControllerEvts=noOpObj):KubeEvtWatcher => {
  const emitter = new KubeEvtWatcher

  eventTypes.map(type => {
    emitter.on(type, (message?:TKubeEvent) => {
      Logger.log(`Kube-Api Event: "${type}"`)
      checkCall(events[type], message)
    })
  })

  emitter.start()

  return emitter
}
