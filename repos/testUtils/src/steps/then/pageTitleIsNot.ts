import type { TStepCtx } from '@GTU/Types'

import expect from 'expect'
import { Then } from '@GTU/Parkin'
import { getPage } from '@GTU/Playwright'
import { ExpressionKinds, ExpressionTypes } from '@gobletqa/environment/constants'

/**
 * Checks that the page title is not `title`
 * @param {string} title - text to compare to page title
 */
export const pageTitleIsNot = async (title:string, ctx:TStepCtx) => {
  const page = await getPage()
  expect(await page.title()).not.toBe(title)
}

Then(`the page title is not {string}`, pageTitleIsNot, {
  description: `Verifies page title does not match expected string.`,
  expressions: [
    {
      example: `Goblet Blog`,
      kind: ExpressionKinds.text,
      type: ExpressionTypes.string,
      description: `String that does not match page title.`,
    },
  ],
  module: `pageTitleIsNot`,
  race: true,
})

