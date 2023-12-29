import { ENVS } from '@gobletqa/environment'
import { ApiLogger, setupLogger } from '@gobletqa/logger'

setupLogger({
  tag: `Goblet Git`,
  level: ENVS.GB_SC_LOG_LEVEL || ENVS.GB_LOG_LEVEL ||`info`
})

export {
  ApiLogger as Logger
}
