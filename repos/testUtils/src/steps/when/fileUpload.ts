import type { TWorldConfig } from '@ltipton/parkin'

import { When } from '@GTU/Parkin'
import { getPage } from '@GTU/Playwright'

/**
 * Uploads file to file input selector
 * @param {string} selector - valid playwright selector
 * @param {string} filePath - within the assetsFolder this is the full path to the file
 * @param {Object} world
 */
export const fileUpload = async (
  selector:string,
  filePath:string,
  world:TWorldConfig
) => {
  const page = await getPage()
  const handle = await page.$(selector)
  // TODO: Fix this step... needs a lot of work
  //restricting file path to /tests/bdd/support folder
  const assetsFolder = '/goblet/app/tests/bdd/support'
  const fullFilePath = filePath.startsWith('/')
    ? assetsFolder + filePath
    : assetsFolder + '/' + filePath
  //todo : create array of accepted file types - ideally list would be set in world obj
  await handle.setInputFiles(fullFilePath)
}

When(`the file input {string} uploads the file {string}`, fileUpload, {
  module: `fileUpload`,
  description: `Uploads a file to an input[type=file] field.`,
  examples: [
    `When the file input "input[type=file]" uploads the file "/assets/app_builds/apk/my_android_test_app.apk"`,
  ],
  expressions: [
    {
      type: `string`,
      description: `File input selector.\nIf there is only one file input in the DOM, simply pass "input[type=file]".\nIf there are multiple file inputs, add a more targeted selector.`,
      example: `input[type=file]`,
    },
    {
      type: `string`,
      description: `Path to the file inside the docker container\'s mounted /support/ folder.  Include a leading forward-slash in the path.`,
      example: `/assets/app_builds/apk/my_android_test_app.apk`,
    },
  ],
})
