#!/usr/bin/env node
import '../resolveRoot'
import { initApi } from './server'
import { Logger } from '@GBE/utils/logger'

const start = () => {
  process.on('SIGINT', () => {
    Logger.info(`[Backend API] Force Killing api server...`)
    process.exit()
  })

  initApi()
}

start()
