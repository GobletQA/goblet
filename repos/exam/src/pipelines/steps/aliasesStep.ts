import { TPipelineArgs } from '@GEX/types'

import moduleAlias from 'module-alias'
import { exists } from '@keg-hub/jsutils'

export const aliasStep = async (args:TPipelineArgs) => {
  const { config } = args
  exists(config.aliases)
    && moduleAlias.addAliases(config.aliases)

}

