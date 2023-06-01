import { keyMap, deepFreeze } from '@keg-hub/jsutils'

export const ExpressionNoQuoteTypes = deepFreeze<Record<string, string>>(
  keyMap([
  `int`,
  `num`,
  `float`,
  `number`,
  `integer`,
  ])
)

export const ExpressionTypes = deepFreeze<Record<string, string>>({
  ...ExpressionNoQuoteTypes,
  ...keyMap([
    `any`,
    `word`,
    `array`,
    `object`,
    `string`,
    `boolean`
  ])
})

export const ExpressionKinds = deepFreeze<Record<string, string>>(
  keyMap([
    `url`,
    `text`,
    `pairs`,
    `group`,
    `alias`,
    `number`,
    `boolean`,
    `selector`,
    `element`,
    `select`,
    `style`, // - element style rule
    `attribute`, // - Any element attribute
    `checkbox`, // - checked || unchecked/ 
  ])
)
