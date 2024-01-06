import type { TStepCtx } from '@GTU/Types'

import path from 'node:path'
import { When } from '@GTU/Parkin'
import { mkDir } from '@GTU/Utils/fileSys'
import { getLocator } from '@GTU/Playwright'
import { getPathFromBase } from '@gobletqa/goblet'
import { ExpressionKinds, ExpressionTypes } from '@gobletqa/environment/constants'

const noUploadsDir = () => {
  throw new Error([
    `Could not find artifacts upload directory.`,
    `Ensure it is configured in the GobletConfig => paths.uploadsDir`,
    ].join(` `)
  )
}

const getArtifactsLoc = async (ctx:TStepCtx) => {
  const config = ctx?.goblet?.config
  if(!config) noUploadsDir()

  const uploadDir = config?.paths?.uploadsDir || `artifacts/uploads`
  const location = getPathFromBase(uploadDir, ctx?.goblet?.config)
  if(!location) noUploadsDir()

  await mkDir(location)

  return location
}

/**
 * Sets the input text of selector to data
 */
export const uploadFile = async (
  file:string,
  selector:string,
  ctx:TStepCtx
) => {
  if(!file || !file?.trim?.()) throw new Error(`A valid file name is required`)

  if(file.includes(`..`)) throw new Error(`File must exist in the uploads directory`)

  const uploadsLoc = await getArtifactsLoc(ctx)

  const locator = getLocator(selector)
  const location = path.join(uploadsLoc, file)
  await locator.setInputFiles(location)

}

const meta = {
  name: `Upload File`,
  alias: [`fill`],
  module: `setText`,
  examples: [
    `When I upload the file "test-file.png" to the element "input#file-upload"`
  ],
  description: `Locates input element by selector and attaches a file to it. The file path is relative to the repositories goblet.config#paths.downloadsDir. Default is goblet/artifacts/uploads`,
  expressions: [
    {
      example: `test-file.png`,
      kind: ExpressionKinds.upload,
      type: ExpressionTypes.string,
      description: `Name of the file to upload. File must exist in the uploads directory.`,
    },
    {
      example: `#search`,
      type: ExpressionTypes.string,
      kind: ExpressionKinds.element,
      description: `The selector for a single input element.`,
    },
  ],
  race: true
}


When(`I upload the file {string} to the element {string}`, uploadFile, meta)

