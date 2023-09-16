import { ApiLogger, setupLogger } from '@gobletqa/logger'
setupLogger({ tag: `Goblet Repo` })

export {
  ApiLogger as Logger
}
