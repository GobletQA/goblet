/**
GB_LOGGER_FORCE_DISABLE_SAFE=1 GOBLET_RUN_FROM_UI=1 DISPLAY=0.0 GOBLET_TEST_TYPE=bdd GOBLET_BROWSER=chromium GOBLET_CONFIG_BASE=/goblet/repos/lancetipton node -r esbuild-register ./repos/exam/src/bin/exam.ts --no-cache --root /goblet/repos/lancetipton --config /goblet/app/repos/testUtils/src/exam/exam.feature.config.ts --colors false

GB_LOGGER_FORCE_DISABLE_SAFE=1 GOBLET_RUN_FROM_UI=1 DISPLAY=0.0 GOBLET_TEST_TYPE=bdd GOBLET_BROWSER=chromium GOBLET_CONFIG_BASE=/goblet/repos/lancetipton node -r esbuild-register ./repos/exam/src/bin/exam.ts --colors false --no-cache --config /goblet/app/repos/testUtils/src/exam/exam.feature.config.ts --root /goblet/repos/lancetipton --tags @whitelist

 */


import type { SpawnOptionsWithoutStdio } from 'child_process'
import type { TExamUIRun, TExamUIChildProcOpts } from '@GTU/Types'

import { spawn } from 'child_process'
import { Logger } from "@gobletqa/exam"
import { ENVS } from "@gobletqa/environment"
import { aliases } from '@GConfigs/aliases.config'
import { emptyObj } from '@keg-hub/jsutils/emptyObj'
import { pickKeys } from '@keg-hub/jsutils/pickKeys'
import { ETestType, EBrowserType } from '@GTU/Types'
import { deepMerge } from '@keg-hub/jsutils/deepMerge'
import { buildBddEnvs } from '@GTU/Utils/buildBddEnvs'
import { buildTestArgs } from '@GTU/Utils/buildTestArgs'


/**
 * Default options when executing a command
 * @object
 */
const getDefOpts = ():TExamUIChildProcOpts => ({
  stdio: `pipe`,
  detached: false,
  shell: `/bin/bash`,
  gid: process.getgid(),
  uid: process.getuid(),
  env: {
    /**
     * We have to force disable the safe replacer to ensure we get valid json output
     * This way the passed in callback events can parse the JSON from stdout
     */
    GB_LOGGER_FORCE_DISABLE_SAFE: `1`,
    /**
     * Ensure exam logs any thrown errors as JSON
     */
    EXAM_LOG_ERR_EVENT: `1`,
    /**
     * Ensure the log split key is set to the current environments value
     */
    EXAM_EVENT_LOG_SPLIT_KEY: ENVS.EXAM_EVENT_LOG_SPLIT_KEY,
  },
})

const buildCmdParams = (
  opts:TExamUIRun,
  cfg:TExamUIChildProcOpts,
) => {

  const cmdParams = pickKeys(cfg, [`env, stdio`, `detached`, `shell`, `gid`, `uid`])

  const params = buildBddEnvs({
    ...opts,
    cwd: aliases?.GobletRoot,
    browser: EBrowserType.chromium
  }, EBrowserType.chromium, ETestType.feature, true)
  
  return deepMerge<SpawnOptionsWithoutStdio>(
    getDefOpts(),
    cmdParams,
    params
  )
}

const runExam = (
  cfg:TExamUIChildProcOpts,
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

export const runExamFromUi = (
  opts:TExamUIRun=emptyObj as TExamUIRun,
  cfg:TExamUIChildProcOpts=emptyObj,
) => {
  const testCmd = buildTestArgs(opts)
  const [cmd, ...args] = testCmd

  return runExam(cfg, cmd, args, buildCmdParams(opts, cfg))
}