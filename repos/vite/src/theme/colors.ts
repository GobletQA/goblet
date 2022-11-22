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

/**
 * TODO: Autogenerate these values
 */
export const fade = {
  fadeLight00: `rgba(255,255,255, 0)`,
  fadeLight05: `rgba(255,255,255, 0.05)`,
  fadeLight10: `rgba(255,255,255, 0.10)`,
  fadeLight15: `rgba(255,255,255, 0.15)`,
  fadeLight20: `rgba(255,255,255, 0.20)`,
  fadeLight25: `rgba(255,255,255, 0.25)`,
  fadeLight30: `rgba(255,255,255, 0.30)`,
  fadeLight35: `rgba(255,255,255, 0.35)`,
  fadeLight40: `rgba(255,255,255, 0.40)`,
  fadeLight45: `rgba(255,255,255, 0.45)`,
  fadeLight50: `rgba(255,255,255, 0.50)`,
  fadeLight55: `rgba(255,255,255, 0.55)`,
  fadeLight60: `rgba(255,255,255, 0.60)`,
  fadeLight65: `rgba(255,255,255, 0.65)`,
  fadeLight70: `rgba(255,255,255, 0.70)`,
  fadeLight75: `rgba(255,255,255, 0.75)`,
  fadeLight80: `rgba(255,255,255, 0.80)`,
  fadeLight85: `rgba(255,255,255, 0.85)`,
  fadeLight90: `rgba(255,255,255, 0.90)`,
  fadeLight95: `rgba(255,255,255, 0.95)`,
}

/**
 * TODO: Autogenerate these values
 */
export const fadeDark = {
  fadeDark00: `rgba(1,1,1, 0)`,
  fadeDark05: `rgba(1,1,1, 0.05)`,
  fadeDark10: `rgba(1,1,1, 0.10)`,
  fadeDark15: `rgba(1,1,1, 0.15)`,
  fadeDark20: `rgba(1,1,1, 0.20)`,
  fadeDark25: `rgba(1,1,1, 0.25)`,
  fadeDark30: `rgba(1,1,1, 0.30)`,
  fadeDark35: `rgba(1,1,1, 0.35)`,
  fadeDark40: `rgba(1,1,1, 0.40)`,
  fadeDark45: `rgba(1,1,1, 0.45)`,
  fadeDark50: `rgba(1,1,1, 0.50)`,
  fadeDark55: `rgba(1,1,1, 0.55)`,
  fadeDark60: `rgba(1,1,1, 0.60)`,
  fadeDark65: `rgba(1,1,1, 0.65)`,
  fadeDark70: `rgba(1,1,1, 0.70)`,
  fadeDark75: `rgba(1,1,1, 0.75)`,
  fadeDark80: `rgba(1,1,1, 0.80)`,
  fadeDark85: `rgba(1,1,1, 0.85)`,
  fadeDark90: `rgba(1,1,1, 0.90)`,
  fadeDark95: `rgba(1,1,1, 0.95)`,
}


export const colors:TColors = {
  ...gobletColors,
  ...white,
  ...gray,
  ...black,
  ...fade,
  ...fadeDark,
}
