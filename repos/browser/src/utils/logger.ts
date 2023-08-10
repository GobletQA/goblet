import { ApiLogger, setupLogger } from '@gobletqa/logger'
setupLogger({ tag: `Goblet Browser` })

export {
  ApiLogger as Logger
}
