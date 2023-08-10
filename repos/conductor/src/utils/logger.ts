import { ApiLogger, setupLogger } from '@gobletqa/logger'

setupLogger({ tag: `Goblet Conductor` })

export {
  ApiLogger as Logger
}