import type { TExpPart } from '@GBR/types'

import { useMemo } from 'react'
import { ExpInputTypes } from '@GBR/constants/values'
import { ExpressionNoQuoteTypes } from '@GBR/constants'
import { ExpInput } from '@GBR/components/Expressions/ExpInput'
import { ExpressionKindMap } from '@GBR/components/Expressions/ExpressionKindMap'

const numberTypes = Object.values(ExpressionNoQuoteTypes)

export const useExpressionInput = (expression:TExpPart) => {
  const { kind, paramType } = expression

  return useMemo(() => {
    const Input = ExpressionKindMap[kind || paramType] || ExpInput

    const inputType = numberTypes.includes(paramType)
      ? ExpInputTypes.number
      : ExpInputTypes[kind || ``]
          || ExpInputTypes[paramType]
          || `text`

    return {
      Input,
      inputType
    }
  }, [kind, paramType])
}
