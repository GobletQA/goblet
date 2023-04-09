import type { TWorldConfig } from '@ltipton/parkin'

import { Then } from '@GTU/Parkin'
import { containsText } from './containsText'
import { checkForAncestor } from '@GTU/Support/validate'

/**
 * For the element matching `selector`, descendent of the registered ancestor, expects its text content to equal `data`
 * @param {string} selector - valid playwright selector
 * @param {string} data - text to compare to descendent selector value/textContent
 * @param {Object} world
 */
export const descendentContainsText = async (
  selector:string,
  data:string,
  world:TWorldConfig
) => {
  checkForAncestor(world)
  return containsText(`${world.meta.ancestorSelector} ${selector}`, data, world)
}

Then(
  'the descendent element {string} contains the text {string}',
  descendentContainsText,
  {
    module: `descendentContainsText`,
    description: `Locates an element by selector and verifies element contains text.\nThere must be a preceding step that establishes an ancestor.`,
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
  }
)
