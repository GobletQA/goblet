
import type { TStepCtx } from '@GTU/Types'

import { When } from '@GTU/Parkin'
import { mediaPlay, mediaStop, mediaIsPlaying } from '@GTU/Playwright'
import { ExpressionKinds, ExpressionTypes } from '@gobletqa/environment/constants'


enum EMediaPlayerState {
  playing=`playing`,
  stopped=`stopped`,
}


/**
 * Checks that the state of the media matches the passed in state
 * @param {string} selector - Element selector on the page
 */
export const setMediaState = async (
  selector:string,
  state:EMediaPlayerState,
  ctx:TStepCtx
) => {
  
  switch(state){
    case EMediaPlayerState.stopped: {
      await mediaStop({ selector })
      
      const isPlaying = await mediaIsPlaying({ selector })
      if(isPlaying) throw new Error(`The media element ${selector} could not be stopped`)

      return expect(isPlaying).toBe(false)
    }
    case EMediaPlayerState.playing: {
      await mediaPlay({ selector })

      const isPlaying = await mediaIsPlaying({ selector })
      if(!isPlaying) throw new Error(`The media element ${selector} could not be started`)
  
      return expect(isPlaying).toBe(true)
    }
  }
}

const meta = {
  race: true,
  name: `Set Media State`,
  module: `setMediaState`,
  alias: [
    `Stop`,
    `Play`,
    `Media`,
    `Set Media State`,
    `Set Video State`,
    `Set Audio State`,
  ],
  examples: [
    `When I set the media "#video" state to "playing"`,
    `When I set the media ".stereo" state to "stopped"`,
  ],
  description: `Asserts the the state of a HTML Media Element`,
  expressions: [
    {
      kind: ExpressionKinds.media,
      type: ExpressionTypes.string,
      example: `video.my-player`,
      description: `An HTML Media Element on the page`,
    },
    {
      decor: false,
      label: `State`,
      example: `playing`,
      type: ExpressionTypes.string,
      kind: ExpressionKinds.options,
      options: Object.values(EMediaPlayerState),
      description: `State of the media element`,
    }
  ],
}

When(`I set the media {string} state to {string}`, setMediaState, meta)


