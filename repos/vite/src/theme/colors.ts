import type { TColors } from '@types'

export const gobletColors = {
  cardinal: `#B53541`,
  monacoGray: `#ABB2BF`,
  royalPurple: `#785B9C`,
  honeyYellow: `#FFB601`,
  shinyShamrock: `#61AB82`,
}

export const white = {
  white00: `#FFFFFF`,
}

export const black = {
  black00: `#000000`,
  black01: `#0A0908`,
  black02: `#17181D`,
  black03: `#262A32`,
  black04: `#272A32`,
  black05: `#282c34`,
  black06: `#323842`,
}

export const fade = {
  fade00: `rgba(255,255,255, 0)`,
  fade05: `rgba(255,255,255, 0.05)`,
  fade10: `rgba(255,255,255, 0.10)`,
  fade15: `rgba(255,255,255, 0.15)`,
  fade20: `rgba(255,255,255, 0.20)`,
  fade25: `rgba(255,255,255, 0.25)`,
  fade30: `rgba(255,255,255, 0.30)`,
  fade35: `rgba(255,255,255, 0.35)`,
  fade40: `rgba(255,255,255, 0.40)`,
  fade45: `rgba(255,255,255, 0.45)`,
  fade50: `rgba(255,255,255, 0.50)`,
  fade55: `rgba(255,255,255, 0.55)`,
  fade60: `rgba(255,255,255, 0.60)`,
  fade65: `rgba(255,255,255, 0.65)`,
  fade70: `rgba(255,255,255, 0.70)`,
  fade75: `rgba(255,255,255, 0.75)`,
}


export const colors:TColors = {
  ...gobletColors,
  ...white,
  ...black,
  ...fade,
}
