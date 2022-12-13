import winston from 'winston'
import { buildLogger } from '@gobletqa/shared/utils/buildLogger'
import { Logger as CliLogger } from '@keg-hub/cli-utils'

export type TLogger = winston.Logger & {
  colors: typeof CliLogger.colors
}

export const Logger = buildLogger({
  label: `Goblet BE`
}) as TLogger

Logger.colors = CliLogger.colors