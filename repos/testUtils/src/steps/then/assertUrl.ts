import type { TWorldConfig } from '@ltipton/parkin'

import { Then } from '@GTU/Parkin'
import { getPage } from '@GTU/Playwright'
import { ExpressionKinds, ExpressionTypes } from '@gobletqa/shared/constants'

/**
 * Checks that the page url matches the passed in url
 * @param {string} url - text to compare to page url
 */
export const assertUrl = async (url:string, world:TWorldConfig) => {
  const page = await getPage()
  const currentUrl = page.url()

  expect(currentUrl).toBe(url)
}

const meta = {
  name: `Assert Url`,
  module: `assertUrl`,
  alias: [
    `Assert Url`,
    `Validate Url`,
  ],
  examples: [
    `Then the url should be "http://www.goblet.com"`,
    `Then the page url is "http://www.goblet.com"`,
  ],
  description: `Asserts the active page url matches the passed in value`,
  expressions: [
    {
      kind: ExpressionKinds.url,
      type: ExpressionTypes.string,
      example: `http://www.gobletqa.com`,
      description: `Url that the active page should match`,
    }
  ],
  race: true
}

Then('the page url is {string}', assertUrl, {
  ...meta,
  race: false
})
Then('the url should be {string}', assertUrl, meta)

