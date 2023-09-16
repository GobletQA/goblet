import { ApiLogger, setupLogger } from '@gobletqa/logger'
setupLogger({ tag: `Goblet Git` })

export {
  ApiLogger as Logger
}
