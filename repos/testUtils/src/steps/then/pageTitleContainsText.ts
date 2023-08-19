import type { TStepCtx } from '@GTU/Types'

import { Then } from '@GTU/Parkin'
import { getPage } from '@GTU/Playwright'
import { ExpressionKinds, ExpressionTypes } from '@GTU/Constants'

/**
 * Checks that the page title is `title`
 * @param {*} title - text to compare to page title
 */
export const pageTitleContainsText = async (
  title:string,
  ctx:TStepCtx
) => {
  const page = await getPage()
  const actualTitle = await page.title()
  expect(actualTitle).toEqual(expect.stringContaining(title))
}

Then(`the page title contains {string}`, pageTitleContainsText, {
  description: `Verifies page title contains the string.`,
  expressions: [
    {
      example: `Goblet Blog`,
      kind: ExpressionKinds.text,
      type: ExpressionTypes.string,
      description: `String expected to be contained within the page title.`,
    },
  ],
  module: `pageTitleContainsText`,
  race: true,
})

