import { TPipelineArgs, TStateManager } from '@GEX/types'

import moduleAlias from 'module-alias'
import { exists } from '@keg-hub/jsutils'
import { Logger } from '@GEX/utils/logger'

export const aliasStep = async (args:TPipelineArgs, manager?:TStateManager) => {
  Logger.debug(`------- aliasStep -------`)
  const { config } = args
  exists(config.aliases)
    && moduleAlias.addAliases(config.aliases)

}

