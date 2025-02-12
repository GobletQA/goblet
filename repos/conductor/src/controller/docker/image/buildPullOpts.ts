import type { TImgConfig, TPullOpts } from '@gobletqa/shared/types'

export const buildPullOpts = (image:TImgConfig, pullOpts?:TPullOpts) => {
  if(!image || !image.provider) return pullOpts
  
  return {
    ...pullOpts,
    authconfig: {
      ...pullOpts?.authconfig,
      serveraddress: pullOpts?.authconfig?.serveraddress || image.provider
    }
  }
}