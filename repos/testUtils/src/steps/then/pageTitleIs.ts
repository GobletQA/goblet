import type { TWorldConfig } from '@ltipton/parkin'

import { Then } from '@GTU/Parkin'
import { getPage } from '@GTU/Playwright'
import { ExpressionKinds, ExpressionTypes } from '@gobletqa/shared/constants'

/**
 * Checks that the page title is `title`
 * @param {*} title - text to compare to page title
 */
export const pageTitleIs = async (title:string, world:TWorldConfig) => {
  const page = await getPage()
  const actualTitle = await page.title()
  expect(actualTitle).toBe(title)
}

Then(`the page title is {string}`, pageTitleIs, {
  description: `Verifies page title matches the expected string.`,
  expressions: [
    {
      example: `Goblet Blog`,
      kind: ExpressionKinds.text,
      type: ExpressionTypes.string,
      description: `String expected to match the page title.`,
    },
  ],
  module: `pageTitleIs`,
  race: true,
})


