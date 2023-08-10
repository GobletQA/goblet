import { ApiLogger, setupLogger } from '@gobletqa/logger'
import { backendConfig } from '@GBE/Configs/backend.config'

setupLogger({
  tag: `Goblet BE`,
  level: backendConfig?.server?.logLevel
})

export {
  ApiLogger as Logger
}