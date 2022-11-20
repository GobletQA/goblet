import type { TColors } from '@types'

export const gobletColors = {
  cardinal: `#b53541`,
  royalPurple: `#785b9c`,
  honeyYellow: `#ffb601`,
  shinyShamrock: `#61ab82`,
}

export const white = {
  white00: `#FFFFFF`,
}

export const black = {
  black00: `#000000`,
  black05: `#010101`,
  black10: `#101010`,
  black15: `#111111`,
  black20: `#222222`,
  black25: `#232323`,
  black30: `#333333`,
  black35: `#343434`,
  black40: `#444444`,
  black45: `#454545`,
  black50: `#555555`,
  black55: `#565656`,
  black60: `#666666`,
  black65: `#676767`,
  black70: `#777777`,
  black75: `#787878`,
}

export const gray = {
  gray00: `#dfe3ea`,
  gray05: `#00000042`,
  gray10: `#f7f9fa`,
  gray15: `#a2b3b8`,
  gray20: `#f3f4f7`,
  gray25: `#ebeef2`,
  gray30: `#d7dde5`,
  gray35: `#c4cbd7`,
  gray40: `#a2adbe`,
  gray45: `#8490a3`,
  gray50: `#687587`,
  gray55: `#596373`,
  gray60: `#434b57`,
  gray65: `#333943`,
  gray70: `#1e2228`,
  gray75: `#090a0d`,
};

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

export const lightColors = {
  // ---- Light Theme Colors
  lightPaper: `#ffffff`,
  lightBackground: `#f0f0f0`,
  lightPrimary: gobletColors.royalPurple,

  // ---- Monaco Theme Colors
  lightDragHandle: `#efefef`,
  lightDragHandleHover: `#528bff`,
}

export const darkColors = {
  // ---- Dark Theme Colors
  darkPaper: `#242526`,
  darkBackground: `#303030`,
  darkPrimary: gobletColors.royalPurple,

  // ---- Monaco Theme Colors
  darkDragHandle: `#282c34`,
  darkDragHandleHover: `#528bff`,
}


export const colors:TColors = {
  ...white,
  ...black,
  ...gray,
  ...fade,
  ...lightColors,
  ...darkColors,

  // ---- Common Theme Colors
  error: `rgb(232, 51, 51)`,
  success: `rgb(76,175,80)`,

  // ---- Default Theme Colors
  navyBlue: `#252c37`,

  // ---- Provider Specific Colors
  // githubBackground: `#161b22`,
  githubBackground: `#333333`,
  
  monacoFocus: `#323842`,
  monacoBorder: `#272A32`,
  monacoBackground: `#282c34`,
  monacoForeground: `#323842`,
  monacoSidebarGray: `#ABB2BF`,

  headerDark: `#262931`,
  borderDark: `#262A32`,
  backgroundDark: `#17181d`,
}
