import type { Express } from 'express'
import type { TSocketEvtCBProps } from '@GSC/types'

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

    Manager.cache[socket.id] = cache

    const {data, ...rest} = props
    setTimeout(() => browserEvents({
      ...rest,
      browserConf: data?.browser
    }), 1000)

  }
}

