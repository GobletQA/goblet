import { screencastConfig } from '@GSC/Configs/screencast.config'
import { Logger, setupLogger } from '@gobletqa/shared/libs/logger'

setupLogger({
  tag: `Goblet SC`,
  level: screencastConfig?.server?.logLevel
})

export {
  Logger
}
