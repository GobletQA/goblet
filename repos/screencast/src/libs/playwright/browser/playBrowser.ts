import type { TStartPlaying } from '@GSC/types'

import { startBrowser } from './browser'
import { Player }  from '../player/player'

export const playBrowser = async (data:TStartPlaying) => {
  const {
    id,
    repo,
    action,
    onEvent,
    onCleanup,
    browserConf,
    pwComponents,
  } = data

  const { props, action:method } = action
  const [playerOpts, url] = props
  const browserItems = pwComponents || await startBrowser({ browserConf })

  const player = new Player({
    onEvent,
    onCleanup,
    ...browserItems,
  }, id)

  player.start({ url, options: playerOpts, repo })

  return player
}
