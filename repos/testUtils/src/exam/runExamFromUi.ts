/**
DISPLAY=0.0 PARKIN_LOG_JEST_SPEC=1 GOBLET_TEST_TYPE=bdd GOBLET_BROWSER=chromium GOBLET_CONFIG_BASE=/goblet/repos/lancetipton node -r esbuild-register ./repos/exam/src/bin/exam.ts --no-cache --root /goblet/repos/lancetipton --config /goblet/app/repos/testUtils/src/exam/exam.feature.config.ts --colors false

DISPLAY=0.0 PARKIN_LOG_JEST_SPEC=1 GOBLET_TEST_TYPE=bdd GOBLET_BROWSER=chromium GOBLET_CONFIG_BASE=/goblet/repos/lancetipton node -r esbuild-register ./repos/exam/src/bin/exam.ts --colors false --no-cache --config /goblet/app/repos/testUtils/src/exam/exam.feature.config.ts --root /goblet/repos/lancetipton

 */

import type { TCmdExecOpts, } from '@GTU/Types'
import type { TInitExamOpts } from '@gobletqa/exam'
import type { TBuildBddEnvs } from '@GTU/Utils/buildBddEnvs'
import type { TBuildTestArgs } from '@GTU/Utils/buildTestArgs'
import type { SpawnOptionsWithoutStdio } from 'child_process'

import { spawn } from 'child_process'
import { Logger } from "@gobletqa/exam"
import { aliases } from '@GConfigs/aliases.config'
import { emptyObj } from '@keg-hub/jsutils/emptyObj'
import { pickKeys } from '@keg-hub/jsutils/pickKeys'
import { ETestType, EBrowserType } from '@GTU/Types'
import { deepMerge } from '@keg-hub/jsutils/deepMerge'
import { buildBddEnvs } from '@GTU/Utils/buildBddEnvs'
import { buildTestArgs } from '@GTU/Utils/buildTestArgs'

export type TExamUIRun = TBuildTestArgs
  & TInitExamOpts
  & TBuildBddEnvs

export type TExamUNIRunCfg = TCmdExecOpts & {
  onStdOut?:(chunk?:any) => any
  onStdErr?:(chunk?:any) => any
  onError?:(err?:Error) => any
  onExit?:(code?:number, signal?:NodeJS.Signals) => any
}

/**
 * Default options when executing a command
 * @object
 */
const defOpts:TCmdExecOpts = {
  env: {},
  stdio: `pipe`,
  detached: false,
  shell: `/bin/bash`,
  gid: process.getgid(),
  uid: process.getuid(),
}

const buildCmdParams = (
  opts:TExamUIRun=emptyObj,
  cfg:TExamUNIRunCfg=emptyObj,
) => {

  const cmdParams = pickKeys(cfg, [`env, stdio`, `detached`, `shell`, `gid`, `uid`])

  const params = buildBddEnvs({
    ...opts,
    cwd: aliases?.GobletRoot,
    browser: EBrowserType.chromium
  }, EBrowserType.chromium, ETestType.feature, true)
  
  return deepMerge<SpawnOptionsWithoutStdio>(
    defOpts,
    cmdParams,
    params
  )
}

const runExam = (
  cfg:TExamUNIRunCfg=emptyObj,
  cmd:string,
  args:string[],
  params:SpawnOptionsWithoutStdio
) => {

  Logger.log(`[Exam-CMD]`, `${cmd} ${args.join(` `)}`, params)

  const childProc = spawn(cmd, args, params)

  childProc.stdout && childProc.stdout.setEncoding(`utf-8`)
  childProc.stderr && childProc.stderr.setEncoding(`utf-8`)

  cfg?.onError && childProc.on(`error`, cfg.onError)
  cfg?.onExit && childProc.on(`exit`, cfg.onExit)
  cfg?.onStdOut && childProc?.stdout?.on?.(`data`, cfg.onStdOut)
  cfg?.onStdErr && childProc?.stderr?.on?.(`data`, cfg.onStdErr)

  return childProc
}

export const runExamFromUi = async (
  opts:TExamUIRun=emptyObj,
  cfg:TExamUNIRunCfg=emptyObj,
) => {
  const testCmd = buildTestArgs(opts)
  const [cmd, ...args] = testCmd

  return runExam(cfg, cmd, args, buildCmdParams(opts, cfg))
}