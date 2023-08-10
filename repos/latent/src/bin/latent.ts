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
      description: ` for encrypting and decrypting secret files. Overrides the ref option`
    },
    ref: {
      alias: [`reference`, `repo`, `url`, `remote`],
      env: `GB_GIT_REPO_REMOTE`,
      example: `<command> --ref https://git-provider.com/user-name/repo-name`,
      description: `The ref url or ref of the repo used to encrypt the secrets`
    },
    repo: {
      alias: [`base`],
      env: `GOBLET_CONFIG_BASE`,
      description: `Repository root directory that contains a Goblet configuration file`
    },
    location: {
      alias: [`file`, `secrets`],
      description: `Path location of the secrets file. Overrides the repo option`
    },
    root: {
      alias: [`rootDir`, `rootdir`, `rd`, `workDir`, `workdir`, `wd`],
      description: `Root directory the other paths should be resolved from`
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

