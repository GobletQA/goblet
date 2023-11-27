
const failedRed = `#B53541`
const royalPurple = `#785B9C`
const shamrockBg = `#61AB82`
const shinyShamrock = `#148F4B`
const coolOrange = `#D99B01`
const blueGreen = `#2E869A`

export const scale = {
  w: `#FFFFFF`,
  w00: `#F9FAFB`,
  w01: `#F6F6F8`,
  c00: `#EFF1F3`,
  c01: `#E8E9EC`,
  c02: `#E0E2E6`,
  c03: `#D0D4DA`,
  c04: `#C1C5CD`,
  c05: `#B1B7C1`,
  c06: `#A1A9B5`,
  c07: `#929AA8`,
  c08: `#828C9C`,
  c09: `#7A8596`,
  c10: `#737D8F`,
  c11: `#6B7689`,
  c12: `#636f83`,
  c13: `#5E697C`,
  c14: `#596476`,
  c15: `#545E6F`,
  c16: `#4F5969`,
  c17: `#4A5362`,
  c18: `#454E5C`,
  c19: `#3B434F`,
  c20: `#323842`,
  c21: `#2D323B`,
}

const paddingSize = 20
const marginSize = 20

export const padding = {
  size: paddingSize,
  qpx: `${paddingSize / 4}px`,
  hpx: `${paddingSize / 2}px`,
  tpx: `${(paddingSize / 4) * 3}px`,
  px: `${paddingSize}px`,
  dpx: `${paddingSize * 2}px`,
}

export const margin = {
  size: marginSize,
  qpx: `${marginSize / 4}px`,
  hpx: `${marginSize / 2}px`,
  tpx: `${(marginSize / 4) * 3}px`,
  px: `${marginSize}px`,
  dpx: `${marginSize * 2}px`,
}

const background = {
  skipped: `
    background-color: ${coolOrange}33;
    border-bottom: 2px solid ${coolOrange}66;
  `,
  passed: `
    background-color: ${shamrockBg}33;
    border-bottom: 2px solid ${shamrockBg}66;
  `,
  failed: `
    background-color: ${failedRed}33;
    border-bottom: 2px solid ${failedRed}66;
  `
}

export const colors = {
  ...scale,
  background,
  text: scale.c21,
  primary: royalPurple,
  secondary: blueGreen,
  pass: shinyShamrock,
  fail: failedRed,
  skip: coolOrange,
  success: shinyShamrock,
  error: failedRed,
  warn: coolOrange,
}
export const font = {
  family: `Helvetica, Arial, sans-serif`
}

export const theme = {
  font,
  colors,
  margin,
  padding,
}