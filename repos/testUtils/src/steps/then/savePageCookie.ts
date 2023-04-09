import type { TWorldConfig } from '@ltipton/parkin'

import { Then } from '@GTU/Parkin'
import {
  getContext,
  defaultCookieFile,
  saveContextCookie
} from '@GTU/Playwright'

/**
 * Checks that the page title is `title`
 * @param {string} name - text to compare to page title
 */
export const savePageCookie = async (name:boolean|string, world:TWorldConfig) => {
  const context = await getContext()

  return await saveContextCookie(context, name)
}

const meta = {
  module: `savePageCookie`,
  examples: [
    `Then I save the page cookie`,
    `Then I save the page cookie as "saved-cookie-name"`,
  ],
  description: `Saves the cookie of the browser context to be reused at a later time.`,
  expressions: [],
}

Then('I save the page cookie', (world:TWorldConfig) => savePageCookie(false, world), meta)
Then('I save the page cookie as {string}', savePageCookie, {
  ...meta,
  expressions: [
    {
      type: 'string',
      description: `Name of the context cookie file that is being saved`,
      example: defaultCookieFile,
    }
  ]
})

