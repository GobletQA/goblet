import type { TColors } from '@types'

export const gobletColors = {
  cardinal: `#B53541`,
  shamrock: `#61AB82`,
  monacoGray: `#ABB2BF`,
  royalPurple: `#785B9C`,
  honeyYellow: `#FFB601`,
  shinyShamrock: `#148F4B`,
  terminalBlack: `#1f1d27`,
}

export const purple = {
  purple00: `#f2eff6`,
  purple01: `#d8cfe3`,
  purple02: `#bdaed0`,
  purple03: `#a38ebd`,
  purple04: `#896eaa`,
  purple05: `#785B9C`,
  purple06: `#6f5591`,
  purple07: `#574271`,
  purple08: `#3e2f51`,
  purple09: `#251c30`,
  purple10: `#0c0910`,
}

export const white = {
  white00: `#FFFFFF`,
}

export const gray = {
  gray00: `#F5F6F7`,
  gray01: `#E4E6EB`,
  gray02: `#D3D7DE`,
  gray03: `#CBD0D8`,
  gray04: `#B6BDC8`,
  gray05: `#99a3b2`,
  gray06: `#7c889c`,
  gray07: `#636f83`,
  gray08: `#4d5666`,
  gray09: `#373e49`,
  gray10: `#21252c`
}

export const black = {
  black00: `#000000`,
  black01: `#040506`,
  black02: `#111215`,
  black03: `#16181d`,
  black04: `#1f2228`,
  black05: `#282b34`,
  black06: `#31353f`,
  black07: `#3a3f4a`,
  black08: `#434856`,
  black09: `#4c5261`,
  black10: `#555b6d`,
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
  fadeDark00: `rgba(0,0,0, 0)`,
  fadeDark05: `rgba(0,0,0, 0.05)`,
  fadeDark10: `rgba(0,0,0, 0.10)`,
  fadeDark15: `rgba(0,0,0, 0.15)`,
  fadeDark20: `rgba(0,0,0, 0.20)`,
  fadeDark25: `rgba(0,0,0, 0.25)`,
  fadeDark30: `rgba(0,0,0, 0.30)`,
  fadeDark35: `rgba(0,0,0, 0.35)`,
  fadeDark40: `rgba(0,0,0, 0.40)`,
  fadeDark45: `rgba(0,0,0, 0.45)`,
  fadeDark50: `rgba(0,0,0, 0.50)`,
  fadeDark55: `rgba(0,0,0, 0.55)`,
  fadeDark60: `rgba(0,0,0, 0.60)`,
  fadeDark65: `rgba(0,0,0, 0.65)`,
  fadeDark70: `rgba(0,0,0, 0.70)`,
  fadeDark75: `rgba(0,0,0, 0.75)`,
  fadeDark80: `rgba(0,0,0, 0.80)`,
  fadeDark85: `rgba(0,0,0, 0.85)`,
  fadeDark90: `rgba(0,0,0, 0.90)`,
  fadeDark95: `rgba(0,0,0, 0.95)`,
}

export const alerts = {
  error: gobletColors.cardinal,
  info: gobletColors.monacoGray,
  warn: gobletColors.honeyYellow,
  success: gobletColors.shinyShamrock,
}

export const colors:TColors = {
  ...gobletColors,
  ...white,
  ...gray,
  ...black,
  ...fade,
  ...fadeDark,
  ...alerts,
}
