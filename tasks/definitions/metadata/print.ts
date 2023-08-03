import type { TTaskActionArgs } from '../../types'

import { fileSys, Logger } from '@keg-hub/cli-utils'
const { pathExistsSync, readFile } = fileSys

/**
 * Print the browser metadata if it exists
 */
const printMeta = async (args:TTaskActionArgs) => {
  const metadata = await import('@gobletqa/screencast/libs/playwright/helpers/metadata')

  Logger.empty()

  const metaLoc = metadata.location()
  if (!pathExistsSync(metaLoc))
    return Logger.pair(
      `Browser metadata file does not exist at:`,
      `${metaLoc}\n`
    )

  const [err, content] = await readFile(metaLoc)
  err ? Logger.error(err) : Logger.log(content)
  Logger.empty()
}

export const print = {
  name: `print`,
  alias: [`prt`, `pr`],
  action: printMeta,
  example: `keg goblet metadata print`,
  description: `Print the browser metadata if it exists`,
}