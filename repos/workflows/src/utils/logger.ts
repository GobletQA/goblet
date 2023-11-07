import { Logger, ApiLogger, setupLogger } from '@gobletqa/logger'

setupLogger({
  tag: `Goblet Workflow`,
  level: `verbose`
})

export {
  Logger,
  ApiLogger
}