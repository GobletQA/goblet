import type { TDefinitionAst } from '@types'
import { addToast } from '@actions/toasts'
import { copyToDefinitionClipboard } from '@utils/definitions'

export type TAddStepFromDefinition = {
  clipboard: boolean
  definition: TDefinitionAst
}

/**
 * Adds a step from the definition to currently active feature
 * Uses the context to find the active scenario
 * Based on editor cursor location or active scenario
 */
export const addStepFromDefinition = ({ definition, clipboard }:TAddStepFromDefinition) => {

  if (!clipboard)
    return addToast({
      type: 'warn',
      message: `Clipboard does not exist!`,
    })

  addToast({
    type: 'info',
    message: `Copied step definition to clipboard!`,
  })

  return copyToDefinitionClipboard(definition)

  // TODO: Add other options for auto setting the step definition into the feature
}
