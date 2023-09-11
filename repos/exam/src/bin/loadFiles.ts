import type { TExamConfig } from '@GEX/types'

import { Errors } from '@GEX/constants'
import {isStr} from '@keg-hub/jsutils/isStr'
import {emptyArr} from '@keg-hub/jsutils/emptyArr'
import {ensureArr} from '@keg-hub/jsutils/ensureArr'
import { globMatchFiles } from '@GEX/utils/globMatch'


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

  const locations = await globMatchFiles(exam, match, {
    ...cfg,
    ignore: [
      ...testIgnore,
      ...loaderIgnore,
    ]
  })

  return locations?.length || passWithNoTests
    ? locations
    : Errors.NoTests(testMatch)
}