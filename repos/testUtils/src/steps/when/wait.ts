import type { TWorldConfig } from '@ltipton/parkin'

import { When } from '@GTU/Parkin'
import { getPage } from '@GTU/Playwright'

/**
 * Simply waits `num` seconds before continuing to next step
 * @param {number} num - number of seconds
 */
export const wait = async (num:number, world:TWorldConfig) => {
  const page = await getPage()
  const seconds = num * 1000
  await page.waitForTimeout(seconds)
}

const meta = {
  module: `wait`,
  description: `Wait for given amount of time, in seconds, before proceeding to the next step.\nCannot exceed 5 seconds.`,
  examples: [
    `When I wait 5 seconds`
  ],
  expressions: [
    {
      example: 5,
      type: `int`,
      description: `Amount of time to wait in seconds.`,
    },
  ],
}
When(`I wait {int} second(s)`, wait, meta)
When(`I wait for {int} second(s)`, wait, meta)

