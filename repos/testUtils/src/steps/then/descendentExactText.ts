import type { TWorldConfig } from '@ltipton/parkin'

import { Then } from '@GTU/Parkin'
import { exactText } from './exactText'
import { checkForAncestor } from '@GTU/Support/validate'

/**
 * For the element matching `selector`, descendent of the registered ancestor, expects its text content to equal `data`
 * @param {string} selector - valid playwright selector
 * @param {string} data - text to compare to selector value/textContent
 * @param {Object} world
 */
export const descendentExactText = async (
  selector:string,
  data:string,
  world:TWorldConfig
) => {
  checkForAncestor(world)
  return exactText(`${world.meta.ancestorSelector} ${selector}`, data, world)
}

Then('the descendent element {string} text is {string}', descendentExactText, {
  module: `descendentExactText`,
  description: `Locates an element by selector and verifies element text matches exactly.\nThere must be a preceding step that establishes an ancestor.`,
  expressions: [
    {
      type: 'string',
      description: `The selector for the element.  Selector must be specific enough to locate a single element.`,
      example: '.ef-session-location',
    },
    {
      type: 'string',
      description: `The text of the element to verify.`,
      example: 'Main Hall',
    },
  ],
})
