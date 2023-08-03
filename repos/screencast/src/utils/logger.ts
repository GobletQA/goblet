import { Logger, setupLogger } from '@gobletqa/shared/libs/logger'

const { GB_LOG_LEVEL=`info`, GB_SC_LOG_LEVEL=GB_LOG_LEVEL } = process.env

setupLogger({
  tag: `Goblet SC`,
  level: GB_SC_LOG_LEVEL
})

export {
  Logger
}
