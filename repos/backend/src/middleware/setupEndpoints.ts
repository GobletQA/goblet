import { Logger } from '@GBE/utils/logger'

export const setupEndpoints = async () => {
  try {
    await import('../endpoints')
  }
  catch(err){
    Logger.error(`[Goblet BE] Error Loading endpoints`)
    Logger.error(err)

    process.exit(1)
  }
}