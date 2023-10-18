export const cmx = (clr:string, percent:string|number=50, other:string=`transparent`) => {
  return `color-mix(in srgb, ${clr} ${percent}%, ${other})`
}