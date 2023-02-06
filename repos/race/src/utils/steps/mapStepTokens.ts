import type {
  TExpPart,
  TMatchTokens,
} from '@GBR/types'

import { removeQuotes } from '@GBR/utils/helpers/removeQuotes'


export const mapStepTokens = (
  expressions:TExpPart[],
  tokens:TMatchTokens[]
) => {
  return expressions.map(exp => {
    const token = tokens.find(tok => tok.defIndex === exp.index)
    if(!token) return exp

    const value = token ? removeQuotes(token.match) : exp.text
    return value !== exp.text
      ? {...exp, value}
      : {...exp, value: ''}
  })
}