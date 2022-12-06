const { When } = require('@GTU/Parkin')
const keyboardMap = require('./keyboardMap')
const { getPage } = require('@GTU/Playwright')

/**
 * Simulates a key press
 * @param {string} key - key name
 * @see possible `key` values here: https://playwright.dev/docs/api/class-page?_highlight=press#pagepressselector-key-options
 */
const pressKey = async (key) => {
  const page = await getPage()
  const pressedKey = keyboardMap.capitalize[key] || key
  await page.keyboard.press(pressedKey)
}

const meta = {
  module: `typeText`,
  examples: [
    `When I press "PageDown"`,
    `When I press the key "Control+a"`
  ],
  description: `Triggers a keyboard event simulating pressing a key on the keyboard.\nSee https://playwright.dev/docs/api/class-page?_highlight=press#pagepressselector-key-options for more info.`,
  expressions: [
    {
      type: 'string',
      description: `The keyboard key.`,
      example: 'Control+a',
    },
  ],
}

When('I press {string}', pressKey, meta)
When('I press the key {string}', pressKey, meta)

module.exports = { pressKey }
