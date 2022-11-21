import type { TColors } from '@types'

export const gobletColors = {
  cardinal: `#B53541`,
  monacoGray: `#ABB2BF`,
  royalPurple: `#785B9C`,
  honeyYellow: `#FFB601`,
  shamrock: `#61AB82`,
  shinyShamrock: `#148F4B`
}

export const white = {
  white00: `#FFFFFF`,
  // Need to validate
  white04: `#CDCFD1`,
}
// #6B6C6E
export const gray = {
  gray00: `#FDFDFD`,
  gray01: `#FAFAFA`,
  gray02: `#F0F0F4`,
  gray03: `#E4E6EB`,
  gray04: `#DEE1E6`,
  gray05: `#CED0D1`,
  gray08: `#5F6368`,
  // Need to validate
  gray06: `#9E9E9E`,
  gray07: `#757575`,
  gray09: `#212121`,
}

export const black = {
  black00: `#000000`,
  black01: `#0A0908`,
  black02: `#17181D`,
  black03: `#262A32`,
  black04: `#272A32`,
  black05: `#282c34`,
  black06: `#323842`,
  // Need to validate
  black07: `#505050`,
  black08: `#6B6C6E`,
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
  ...gray,
  ...black,
  ...fade,
}
