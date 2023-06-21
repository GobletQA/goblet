import type { TStepCtx } from '@GTU/Types'

import { When } from '@GTU/Parkin'
import { getPage } from '@GTU/Playwright'
import keyboardMap from './keyboardMap.json'
import { ExpressionKinds, ExpressionTypes } from '@gobletqa/shared/constants'

/**
 * Simulates a key press
 * @param {string} key - key name
 * @see possible `key` values here: https://playwright.dev/docs/api/class-page?_highlight=press#pagepressselector-key-options
 */
export const pressKey = async (
  key:string,
  ctx:TStepCtx
) => {
  const page = await getPage()
  const pressedKey = keyboardMap.capitalize[key] || key
  await page.keyboard.press(pressedKey)
}

const meta = {
  name: `Press key`,
  alias: [`keyboard`],
  module: `typeText`,
  examples: [
    `When I press "PageDown"`,
    `When I press the key "Control+a"`
  ],
  description: `Triggers a keyboard event simulating pressing a key on the keyboard.\nSee https://playwright.dev/docs/api/class-page?_highlight=press#pagepressselector-key-options for more info.`,
  expressions: [
    {
      kind: ExpressionKinds.text,
      type: ExpressionTypes.string,
      description: `The keyboard key.`,
      example: `a`,
    },
  ],
  race: true,
  fromSavedLocator: true,
}

When(`I press {string}`, pressKey, meta)
When(`I press the key {string}`, pressKey, {...meta, race: false})

// TODO - Add step for pressing multiple keys at once