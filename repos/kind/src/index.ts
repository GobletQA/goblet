#!/usr/bin/env node
import '../resolveRoot'
import { initApi } from './server'

const start = () => {
  process.on('SIGINT', () => {
    console.log(`[KIND API] Force Killing api server...`)
    process.exit()
  })

  initApi()
}

start()
