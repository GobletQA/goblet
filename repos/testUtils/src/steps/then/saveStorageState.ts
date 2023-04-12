import type { TWorldConfig } from '@ltipton/parkin'

import { Then } from '@GTU/Parkin'
import {
  getContext,
  defaultStateFile,
  saveContextState,
} from '@GTU/Playwright'

/**
 * Checks that the page title is `title`
 * @param {string} title - text to compare to page title
 */
export const savePageState = async (
  title:boolean|string,
  world:TWorldConfig
) => {
  const context = await getContext()

  return await saveContextState(context, title)
}

const meta = {
  module: `savePageState`,
  examples: [
    `Then I save the page state`,
    `Then I save the page state as "my-browser-context"`,
  ],
  description: `Saves the state of the browser context to be reused at a later time.`,
  expressions: [],
}

Then('I save the page state', (world:TWorldConfig) => savePageState(false, world), meta)
Then('I save the page state as {string}', savePageState, {
  ...meta,
  expressions: [
    {
      type: 'string',
      description: `Name of the context state file that is being saved`,
      example: defaultStateFile,
    }
  ]
})