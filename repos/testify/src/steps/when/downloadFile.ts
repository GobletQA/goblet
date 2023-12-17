import type { TStepCtx } from '@GTU/Types'
import type { Download } from 'playwright'

import path from 'node:path'
import { When } from '@GTU/Parkin'
import { pathExists, mkDir } from '@GTU/Utils/fileSys'
import { getPathFromBase } from '@gobletqa/goblet'
import { getLocator, getPage } from '@GTU/Playwright'
import { ExpressionKinds, ExpressionTypes } from '@gobletqa/environment/constants'
import { getLocatorTimeout } from '@GTU/Support/helpers'

export type TPromiseTimeout<T=any> = {
  name?:string
  error?:string
  timeout:number
  promise:Promise<T>
  shouldAbort?:() => boolean
}
/**
 * TODO: move this to is own file as a utility
 */
const PromiseTimeout = async <T=any>({
  name,
  error,
  promise,
  timeout=5000,
}:TPromiseTimeout<T>):Promise<T> => {
  const method = name ? `${name} method` : `method`

  let timer:NodeJS.Timeout
  const timePromise = new Promise((res, rej) => {
    timer = setTimeout(() => rej(
      new Error(error || `The ${method} timed out after ${timeout} ms.`)
    ), timeout)
  })

  return await Promise.race([promise, timePromise] as [Promise<T>, Promise<any>])
    .finally(() => clearTimeout(timer))
}


const success = {
  message: `File downloaded successfully`
}

const noDownloadsDir = () => {
  throw new Error([
    `Could not find artifacts upload directory.`,
    `Ensure it is configured in the GobletConfig => paths.downloadsDir`,
    ].join(` `)
  )
}

const getArtifactsLoc = async (ctx:TStepCtx) => {
  const config = ctx?.goblet?.config
  if(!config) noDownloadsDir()

  const downloadDir = config?.paths?.downloadsDir || `artifacts/downloads`
  const location = getPathFromBase(downloadDir, ctx?.goblet?.config)
  if(!location) noDownloadsDir()
  await mkDir(location)

  return location
}


export const downloadFile = async (selector: string, ctx:TStepCtx) => {

  let download:Download
  try {

    const downloadsLoc = await getArtifactsLoc(ctx)
    const locator = getLocator(selector)

    const page = await getPage()
    const downloadPromise = page.waitForEvent('download')

    await locator.click()

    download = await PromiseTimeout<Download>({
      name: `Download File`,
      promise: downloadPromise,
      timeout: getLocatorTimeout(ctx),
      error: `: File download failed. It either never started or timed out.`
    })

    const saveLoc = path.join(downloadsLoc, download.suggestedFilename())
    await download.saveAs(saveLoc)

    const [err=success] = await pathExists(saveLoc)
    expect(err.message).toBe(success.message)

  }
  catch(err){
    const reason = await download?.failure?.()
    if(reason) throw new Error(reason)

    throw err
  }
}

const meta = {
  race: true,
  module: `downloadFile`,
  alias: [`Download file`],
  name: `Download file`,
  description: `Download file by clicking on an element`,
  examples: [
    `When I click '#download' to download a file`
  ],
  expressions: [
    {
      example: `#download`,
      type: ExpressionTypes.string,
      kind: ExpressionKinds.element,
      description: `The element selector that triggers the download interaction when clicked.`,
    },
  ],
}

When(`I click {string} to download a file`, downloadFile, meta)

