import type { TWorldConfig } from '@ltipton/parkin'

import { Given } from '@GTU/Parkin'
import { set } from '@keg-hub/jsutils'
import { getLocators } from '@GTU/Playwright'
import { cleanWorldPath } from '@GTU/Support/helpers'


/**
 * Expects the number of dom elements matching `selector` to equal `count`
 * @param {string} selector - valid playwright selector
 * @param {string} worldPath - Path on the world object
 */
export const saveElementCount = async (
  selector:string,
  worldPath:string,
  world:TWorldConfig
) => {

  const cleaned = cleanWorldPath(worldPath)
  if(!cleaned) throw new Error(`World Path to save the element count "${worldPath}", is invalid.`)

  const elements = await getLocators(selector)
  const count = await elements.count()
  
  set(world, cleaned, { selector, count })
}

Given('I save the count of {string} as {string}', saveElementCount, {
  module : `saveElementCount`,
  description: `Locates elements by selector and stores the amount that exist`,
  expressions: [
    {
      type: 'string',
      description: `The selector for the elements.`,
      example: 'li.list-item',
    },
    {
      type: 'string',
      description: `Path on the world where the count should be saved`,
      example: 'page.items.count',
    },
  ],
})
