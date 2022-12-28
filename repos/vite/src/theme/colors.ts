import type { TColors } from '@types'

export const gobletColors = {
  cardinal: `#B53541`,
  shamrock: `#61AB82`,
  royalPurple: `#785B9C`,
  honeyYellow: `#FFB601`,
  shinyShamrock: `#148F4B`,
  terminalBlack: `#16181D`,
  white: `#FFFFFF`,
  black: `#000000`,
}

export const purple = {
  purple00: `#f9f8fb`,
  purple01: `#f2eff5`,
  purple02: `#e4deeb`,
  purple03: `#d7cee1`,
  purple04: `#c9bdd7`,
  purple05: `#bcadce`,
  purple06: `#ae9dc4`,
  purple07: `#a18cba`,
  purple08: `#937cb0`,
  purple09: `#866ba6`,
  purple10: `#785b9c`,
  purple11: `#6c528c`,
  purple12: `#60497d`,
  purple13: `#54406d`,
  purple14: `#48375e`,
  purple15: `#3c2e4e`,
  purple16: `#30243e`,
  purple17: `#241b2f`,
  purple18: `#18121f`,
  purple19: `#0c0910`,
  purple20: `#060407`,
}

export const black = {
  black00: `#d0d1d2`,
  black01: `#b9babb`,
  black02: `#a2a3a5`,
  black03: `#8b8c8e`,
  black04: `#737477`,
  black05: `#505256`,
  black06: `#45464a`,
  black07: `#393B3F`,
  black08: `#2d313b`,
  black09: `#1f2229`,
  black10: `#191b21`,
  black11: `#16181d`,
  black12: `#14161a`,
  black13: `#111216`,
  black14: `#0E1013`,
  black15: `#0d0e11`,
  black16: `#0b0c0f`,
  black17: `#090a0c`,
  black18: `#070709`,
  black19: `#040506`,
  black20: `#030404`,
}


export const white = {
  white00: `#f9fafb`,
}

export const gray = {
  gray00: `#EFF1F3`,
  gray01: `#E8E9EC`,
  gray02: `#D0D4DA`,
  gray03: `#C1C5CD`,
  gray04: `#B1B7C1`,
  gray05: `#A1A9B5`,
  gray06: `#929AA8`,
  gray07: `#828C9C`,
  gray08: `#7A8596`,
  gray09: `#737D8F`,
  gray10: `#6B7689`,
  gray11: `#636f83`,
  gray12: `#5E697C`,
  gray13: `#596476`,
  gray14: `#545E6F`,
  gray15: `#4F5969`,
  gray16: `#4A5362`,
  gray17: `#454E5C`,
  gray18: `#3B434F`,
  gray19: `#323842`,
  gray20: `#2D323B`,
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
  info: black.black03,
  error: gobletColors.cardinal,
  warn: gobletColors.honeyYellow,
  success: gobletColors.shinyShamrock,
}

export const colors:TColors = {
  ...white,
  ...gray,
  ...fade,
  ...black,
  ...purple,
  ...alerts,
  ...fadeDark,
  ...gobletColors,
}
