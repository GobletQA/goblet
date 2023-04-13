import { keyMap, deepFreeze } from '@keg-hub/jsutils'

export const ExpressionTypes = deepFreeze<Record<string, string>>(
  keyMap([
    `any`,
    `int`,
    `float`,
    `word`,
    `string`,
    `number`,
    `object`,
    `array`,
    `boolean`
  ])
)

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
    `attribute`, // - Any element attribute
    `checkbox`, // - checked || unchecked/ 
  ])
)
