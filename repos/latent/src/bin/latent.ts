#! /usr/bin/env node --no-warnings

import { tasks } from './tasks'
import { setAppRoot, runTask } from '@keg-hub/cli-utils'

setAppRoot(process.cwd())

runTask(tasks, { env: process.env.NODE_ENV || `local` }, {
  // Allowed latent environment
  environment: {
    options: [`environment`, `env`, `e`],
    map: {
      qa: [`qa`, `q`],
      test: [`test`, `tst`, `t`],
      local: [`local`, `loc`, `l`],
      staging: [`staging`, `stag`, `s`],
      production: [`production`, `prod`, `p`],
      develop: [`development`, `develop`, `dev`, `d`],
    },
  },

  // Default args passed to all tasks
  defaultArgs: {
    token: {
      type: `string`,
      env: `GOBLET_TOKEN`,
      alias: [`tok`, `tk`],
      example: `<command> --token my-awesome-token`,
      description: ` for encrypting and decrypting secret files. Overrides the remote option`
    },
    remote: {
      alias: [`rm`, `repo`, `url`],
      env: `GB_GIT_REPO_REMOTE`,
      example: `<command> --remote https://git-provider.com/user-name/repo-name`,
      description: `The remote url of the repo used to encrypt the secrets`
    },
    repo: {
      alias: [`base`],
      env: `GOBLET_CONFIG_BASE`,
      description: `Repository root directory that contains a Goblet configuration file`
    },
    environment: {
      env: `GOBLET_ENV`,
      default: `develop`,
      example: `<command> --environment staging`,
      description: `The environment to use when decrypting secrets`,
      allowed: [`test`, `local`, `develop`, `staging`, `qa`, `production`],
    },
  },
})

