import type { Express } from 'express'
import type { TSocketEvtCBProps } from '@GSC/types'

// import { tailBrowserLogs } from './tailBrowserLogs'
import { browserEvents } from '@GSC/libs/playwright/browser/browserEvents'

export const connection = (app:Express) => {
  return (props:TSocketEvtCBProps) => {
    const { socket, Manager, user} = props

    // Todo Update to be the group / room name for the connected user
    const cache = Manager.cache[socket.id]
    cache.groupId = 'goblet'
    cache.userId = user.userId
    cache.username = user.username
    cache.subdomain = user.subdomain

    // TODO: Add logs setting, and tie it to this
    // Only tail logs is setting it set to verbose
    // tailBrowserLogs(app, props)

    setTimeout(() => browserEvents(app, props), 1000)

  }
}

