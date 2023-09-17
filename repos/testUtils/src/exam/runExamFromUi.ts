// cd ../app && node -r esbuild-register tasks/entry.ts bdd run --env test --base /github/workspace --context Tester.feature --browsers chrome

  // node ./repos/exam/.bin/exam.js --config ../../app/repos/testUtils/src/exam/exam.config.ts --root /goblet/repos/lancetipton -t Log-In-and-Out.feature

import type { TExamCfgArgs } from './exam.config'
import type { TInitExamOpts } from '@gobletqa/exam'
import type { TBuildTestArgs } from '@GTU/Utils/buildTestArgs'
import type { TBuildBddEnvs } from '@GTU/Utils/buildBddEnvs'

import { nanoid } from '@keg-hub/jsutils/nanoid'
import {emptyObj} from '@keg-hub/jsutils/emptyObj'
import { buildBddEnvs } from '@GTU/Utils/buildBddEnvs'
import { buildTestArgs } from '@GTU/Utils/buildTestArgs'

export type TExamUIRun = TBuildTestArgs
  & TInitExamOpts
  & TBuildBddEnvs
  & {
  gobletToken?:string
}

export const runExamFromUi = async (
  opts:TExamUIRun=emptyObj,
  cfg:TExamCfgArgs=emptyObj,
) => {
  const testCmd = buildTestArgs(opts)
  const params = buildBddEnvs(opts)
  console.log(`------- testCmd -------`)
  console.log(testCmd)
  
  
  // nanoid
  
  // return await exam(ExamConfig(cfg), opts)
}