import type { TWorldConfig } from '@ltipton/parkin'

import { Then } from '@GTU/Parkin'
import { getPage } from '@GTU/Playwright'

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
  module: `assertUrl`,
  examples: [
    `Then the url should be "http://www.goblet.com"`,
    `Then the page url is "http://www.goblet.com"`,
  ],
  description: `Asserts the active page url matches the passed in value`,
  expressions: [
    {
      type: 'string',
      description: `Url that the active page should match`,
      example: `http://www.goblet.com`,
    }
  ]
}

Then('the page url is {string}', assertUrl, meta)
Then('the url should be {string}', assertUrl, meta)

