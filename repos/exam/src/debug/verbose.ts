import { Logger } from '@GEX/utils/logger'

export const printExamTestMode = (testMode?:string) => {
  Logger.verbose(`${Logger.colors.cyan(`[Exam]`)} Test-Mode: ${testMode}`)
}
