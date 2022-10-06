import type { TTaskParams } from '../../types'

import { error } from '@keg-hub/cli-utils'
import { getLabelContext } from '../helpers/contexts'

/**
 * Gets the label used to select the a specific container relative to an application
 */
export const getLabelSelector = (params:TTaskParams) => {
  const { context, env } = params
  const selector = getLabelContext(context, env)

  !selector && error.throwError(`Could not find selector for context "${context}"`)

  return {
    selector,
    args: [`--label-selector`, selector],
  }
}
