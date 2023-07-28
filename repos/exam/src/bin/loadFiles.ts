import type { TExamConfig } from '@GEX/types'

import { Errors } from '@GEX/constants'
import { globMatchFiles } from '@GEX/utils/globMatch'
import {emptyArr, ensureArr, isStr} from '@keg-hub/jsutils'

export const loadFiles = async (exam:TExamConfig & { file?:string }) => {
  const {
    file,
    rootDir,
    testDir,
    testMatch,
    passWithNoTests,
    testIgnore=emptyArr,
    loaderIgnore=emptyArr,
  } = exam

  const match = isStr(file)
    ? ensureArr(file)
    : testMatch ? ensureArr(testMatch) : []

  const cfg = { cwd: rootDir }
  testDir && ((cfg as any).root = testDir)

  const locations = await globMatchFiles(match, {
    ...cfg,
    ignore: [...testIgnore, ...loaderIgnore]
  })

  return locations?.length || passWithNoTests
    ? locations
    : Errors.NoTests(testMatch)
}