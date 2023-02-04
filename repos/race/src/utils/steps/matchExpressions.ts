import type {
  TExpPart,
  TStepDef,
  TPartsMatch,
} from '@GBR/types'

import { emptyArr } from '@keg-hub/jsutils'

export const matchExpressions = (
  def:TStepDef,
  parts:TPartsMatch[],
) => {
  const expressions = def?.meta?.expressions
  if(!def || !expressions?.length) return emptyArr

  return parts.map((part, idx) => {
    const exp = expressions[idx]
    return part?.type === `parameter` && part?.paramType === exp?.type
      ? {...exp, ...part}
      : part
  }) as TExpPart[]
}