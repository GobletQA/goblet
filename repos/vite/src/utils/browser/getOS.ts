import { EOSType } from '@types'

let __OS:EOSType

export const isMac = () => EOSType.mac === getOS()

export const getOS = () => {
  if(__OS) return __OS

  const iosPlatforms = /(iphone|ipad|ipod)/i
  const windowsPlatforms = /(win32|win64|windows|wince)/i
  const macosPlatforms = /(macintosh|macintel|macppc|mac68k|macos)/i

  const userAgent = window.navigator.userAgent.toLowerCase()

  if (macosPlatforms.test(userAgent))
    return EOSType.mac

  else if (iosPlatforms.test(userAgent))
    return EOSType.ios

  else if (windowsPlatforms.test(userAgent))
    return EOSType.win

  else if (/android/.test(userAgent))
    return EOSType.and

  else if (/linux/.test(userAgent))
    return EOSType.lin

  return EOSType.unknown
}

setTimeout(() => __OS = getOS())