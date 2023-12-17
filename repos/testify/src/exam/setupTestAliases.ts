/**
 * TODO: This relative path sucks, but don't have a better solution currently
 * Need to investigate at some point
 */
import { aliases, jestAliases, registerAliases } from '../../../../configs/aliases.config'

registerAliases()

export {
  aliases,
  jestAliases
}