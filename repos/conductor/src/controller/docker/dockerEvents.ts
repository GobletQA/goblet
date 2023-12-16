import type Dockerode from 'dockerode'
import type { TControllerEvts, TDockerEvent } from '@gobletqa/shared/types'

import DockerEvents from 'docker-events'
import { Logger } from '../../utils/logger'
import { noOpObj } from '@keg-hub/jsutils/noOpObj'
import { checkCall } from '@keg-hub/jsutils/checkCall'


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

/**
 * Adds event listeners to docker api events, and calls corresponding callbacks
 */
export const dockerEvents = (docker:Dockerode, events:TControllerEvts=noOpObj):DockerEvents => {
  const emitter = new DockerEvents({ docker })

  eventTypes.map(type => {
    emitter.on(type, (message?:TDockerEvent) => {
      Logger.log(`Docker-Api Event: "${type}"`)
      checkCall(events[type], message)
    })
  })

  emitter.start()

  return emitter
}
