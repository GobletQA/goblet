import type { TStepCtx } from '@GTU/Types'

import { Then } from '@GTU/Parkin'
import { isStr } from '@keg-hub/jsutils/isStr'
import { DefaultStateFile } from '@gobletqa/browser'
import { getContext, saveContextState } from '@GTU/Playwright'
/**
 * Checks that the page title is `title`
 * @param {string} title - text to compare to page title
 */
export const savePageState = async (
  title:boolean|string,
  ctx:TStepCtx
) => {
  const context = await getContext()
  return await saveContextState(context, isStr(title) ? title : undefined)
}

const meta = {
  name: `Save page state`,
  module: `savePageState`,
  examples: [
    `Then I save the page state`,
    `Then I save the page state as "my-browser-context"`,
  ],
  description: `Saves the state of the browser context to be reused at a later time.`,
  expressions: [],
}

Then(`I save the page state`, (ctx:TStepCtx) => savePageState(false, ctx), meta)
Then(`I save the page state as {string}`, savePageState, {
  ...meta,
  expressions: [
    {
      type: `string`,
      description: `Name of the context state file that is being saved`,
      example: DefaultStateFile,
    }
  ]
})
