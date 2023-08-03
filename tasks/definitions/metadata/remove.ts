import type { TTaskActionArgs } from '../../types'

import { limbo } from '@keg-hub/jsutils'
import { Logger } from '@keg-hub/cli-utils'
import { promises as fs, existsSync } from 'fs'

/**
 * Print the browser metadata if it exists
 */
const removeMeta = async (args:TTaskActionArgs) => {
  const metadata = require('@gobletqa/screencast/libs/playwright/helpers/metadata')
  
  Logger.empty()
  const metaLoc = metadata.location()

  if (!existsSync(metaLoc))
    return Logger.pair(
      `Browser metadata file does not exist at:`,
      `${metaLoc}\n`
    )

  const [err] = await limbo(fs.rm(metaLoc))

  err ? Logger.error(err) : Logger.success(`Metadata file remove`)
  Logger.empty()
}

export const remove = {
  name: `remove`,
  action: removeMeta,
  alias: [`rm`, `delete`],
  example: `keg goblet metadata remove`,
  description: `Removes the browser metadata file if it exists`,
}