import { backendConfig } from '@GBE/Configs/backend.config'
import { Logger, setupLogger } from '@gobletqa/shared/libs/logger'

setupLogger({
  tag: `Goblet BE`,
  level: backendConfig?.server?.logLevel
})

export {
  Logger
}