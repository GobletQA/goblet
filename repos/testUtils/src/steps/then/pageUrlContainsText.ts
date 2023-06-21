import type { TStepCtx } from '@GTU/Types'

import { Then } from '@GTU/Parkin'
import { getPage } from '@GTU/Playwright'
import { ExpressionKinds, ExpressionTypes } from '@gobletqa/shared/constants'

/**
 * Checks that the page url is `url`
 * @param {*} url - text to compare to page url
 */
export const pageUrlContainsText = async (
  url:string,
  ctx:TStepCtx
) => {
  const page = await getPage()
  const actualUrl = page.url()
  expect(actualUrl).toEqual(expect.stringContaining(url))
}

Then(`the page url contains {string}`, pageUrlContainsText, {
  name: `Page url contains`,
  alias: [
    `Page Url`
  ],
  description: `Verifies page url contains the string.`,
  expressions: [
    {
      example: `gobletqa`,
      kind: ExpressionKinds.text,
      type: ExpressionTypes.string,
      description: `String expected to be contained within the page url.`,
    },
  ],
  race: true,
  module: `pageUrlContainsText`,
})

