
import type { TStepCtx } from '@GTU/Types'

import { Then } from '@GTU/Parkin'
import { mediaIsPlaying, mediaIsFinished } from '@GTU/Playwright'
import { ExpressionKinds, ExpressionTypes } from '@gobletqa/environment/constants'


enum EMediaPlayerState {
  playing=`playing`,
  stopped=`stopped`,
  finished=`finished`
}

/**
 * Checks that the state of the media matches the passed in state
 * @param {string} selector - Element selector on the page
 */
export const assertMediaState = async (
  selector:string,
  state:EMediaPlayerState,
  ctx:TStepCtx
) => {
  
  switch(state){
    case EMediaPlayerState.finished: {
      const isFinished = await mediaIsFinished({ selector })
      if(!isFinished) throw new Error(`The media element ${selector} is not finished playing`)

      return expect(isFinished).toBe(true)
    }
    case EMediaPlayerState.stopped: {
      const isPlaying = await mediaIsPlaying({ selector })
      if(isPlaying) throw new Error(`The media element ${selector} is currently playing`)

      return expect(isPlaying).toBe(false)
    }
    case EMediaPlayerState.playing: {
      const isPlaying = await mediaIsPlaying({ selector })
      if(!isPlaying) throw new Error(`The media element ${selector} is currently stopped`)
  
      return expect(isPlaying).toBe(true)
    }
  }
}

const meta = {
  name: `Assert Media State`,
  module: `assertMediaState`,
  alias: [
    `Stop`,
    `Play`,
    `Media`,
    `Assert Media State`,
    `Assert Video State`,
    `Assert Audio State`,
    `Validate Media`,
  ],
  examples: [
    `Then the "#video" should be "playing"`,
    `Then the ".stereo" should be "stopped"`,
    `Then the ".musik-box" should be "finished"`,
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
      description: `State of the media element`,
      options: Object.values(EMediaPlayerState)
    }
  ],
  race: true
}

Then(`the media {string} should be {string}`, assertMediaState, meta)


