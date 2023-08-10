import type { TStepCtx } from '@GTU/Types'

import { Then } from '@GTU/Parkin'
import {isStr} from '@keg-hub/jsutils/isStr'
import { getContext } from '@GTU/Playwright'
import { DefaultCookieFile, saveContextCookie } from '@gobletqa/browser'

/**
 * Checks that the page title is `title`
 * @param {string} name - text to compare to page title
 */
export const savePageCookie = async (name:boolean|string, ctx:TStepCtx) => {
  const context = await getContext()
  const loc = isStr(name) ? name : undefined

  return await saveContextCookie(context, loc)
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

Then(`I save the page cookie`, (ctx:TStepCtx) => savePageCookie(false, ctx), meta)
Then(`I save the page cookie as {string}`, savePageCookie, {
  ...meta,
  expressions: [
    {
      type: `string`,
      description: `Name of the context cookie file that is being saved`,
      example: DefaultCookieFile,
    }
  ]
})

