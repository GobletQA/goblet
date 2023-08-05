import type { TTaskActionArgs } from '../../types'
import { Logger } from '@keg-hub/cli-utils'

/**
 * Print the browser metadata path on the HDD
 */
const metaLocation = async (args:TTaskActionArgs) => {
  const { metadata } = require('@gobletqa/browser')
  metadata.config = args.config
  metadata.logger = Logger

  const metaLoc = metadata.location()
  Logger.log(metaLoc)

  return metaLoc
}

export const path = {
  name: `path`,
  alias: [`location`, `loc`],
  action: metaLocation,
  example: `keg goblet metadata path`,
  description: `Print the path to the browser metadata`,
}
