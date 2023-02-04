import { keyMap, deepFreeze } from '@keg-hub/jsutils'

export const ExpressionTypes = deepFreeze(
  keyMap([
    `any`,
    `int`,
    `float`,
    `word`,
    `string`,
    `number`,
    `object`,
    `array`,
  ])
)

export const ExpressionKinds = deepFreeze(
  keyMap([
    `url`,
    `text`,
    `pairs`,
    `group`,
    `alias`,
    `number`,
    `element`,
    `selector`,
  ])
)
