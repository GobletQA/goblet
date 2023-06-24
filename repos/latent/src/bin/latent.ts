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
    environment: {
      env: `GOBLET_ENV`,
      default: `develop`,
      alias: [ `env` ],
      description: `Environment to run the task in`,
      example: `<command> --environment staging`,
    },
    token: {
      env: `GOBLET_LATENT`,
      alias: [`tok`],
      description: `Token for encrypting and decrypting secret files`,
      example: `<command> --token my-awesome-token`,
    }
  },
})

