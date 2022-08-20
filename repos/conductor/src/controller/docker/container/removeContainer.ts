import type { Container } from 'dockerode'
import { Logger } from '@gobletqa/shared/libs/logger'

/**
 * Removes a docker container
 * Called inside an iif to it doesn't holdup the response 
 * Basically fire and forget
 */
export const removeContainer = (cont:Container) => {
  ;(async () => {
    try { await cont.stop() }
    catch(err){ Logger.error(err.message) }

    try { await cont.remove() }
    catch(err){ Logger.error(err.message) }
  })()
}