import type { TStepDef } from '@ltipton/parkin'
import type { TExpPart, TPartsMatch } from '@GBR/types'

import { emptyArr } from '@keg-hub/jsutils'

export const matchExpressions = (
  def:TStepDef,
  parts:TPartsMatch[],
):TExpPart[] => {
  const expressions = def?.meta?.expressions
  if(!def || !expressions?.length) return emptyArr

  return parts.map((part, idx) => {
    const exp = expressions[idx]
    /**
     * - TODO: Might be better to ignore the step if the definition is missing meta data
     *
     * This method maps a registered parkin parameter with the expression type
     * If the definition is missing metadata with expressions there's nothing to match to
     * So only the part is returned
     *
     */
    return part?.type === `parameter` && part?.paramType === exp?.type
      ? {...exp, ...part}
      : part
  }) as TExpPart[]
}