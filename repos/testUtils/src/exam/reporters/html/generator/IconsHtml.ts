import { colors } from './theme'

const propMap = {
  fail: {
    title: `failed`,
    color: colors.fail,
    path: `M20 6.91L17.09 4L12 9.09L6.91 4L4 6.91L9.09 12L4 17.09L6.91 20L12 14.91L17.09 20L20 17.09L14.91 12L20 6.91Z`
  },
  pass: {
    title: `passed`,
    color: colors.pass,
    path: `M9,20.42L2.79,14.21L5.62,11.38L9,14.77L18.88,4.88L21.71,7.71L9,20.42Z`
  },
  skip: {
    title: `skipped`,
    color: colors.skip,
    path:  `M12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z`
  }
}

export const SvgIcon = (type:string) => {
  const {path, title, color} = propMap[type]

  return `
    <svg
      class="step-icon"
      viewBox="0 0 24 24"
      style="fill:${color};"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>${title}</title>
      <path d="${path}" />
    </svg>
  `
}

const IconMap = {
  failed: SvgIcon(`fail`),
  passed: SvgIcon(`pass`),
  skipped: SvgIcon(`skip`)
}

export const IconsHtml = (state:`passed`|`failed`|`skipped`) => {
  return IconMap[state]
}

export const GobletIcon = `<svg version="1.0" xmlns="http://www.w3.org/2000/svg"
 width="629.000000pt" height="769.000000pt" viewBox="0 0 629.000000 769.000000"
 preserveAspectRatio="xMidYMid meet">
<g transform="translate(0.000000,769.000000) scale(0.100000,-0.100000)"
fill="#785B9C" stroke="none">
<path d="M2040 6820 c-183 -12 -291 -52 -372 -138 -54 -57 -84 -114 -167 -314
-559 -1345 -560 -2353 -3 -2993 245 -282 610 -496 1061 -622 168 -46 178 -50
190 -81 59 -152 79 -456 42 -638 -31 -149 -104 -274 -213 -365 -100 -83 -140
-98 -317 -120 -429 -52 -614 -87 -816 -153 -221 -73 -311 -133 -322 -213 -5
-36 -1 -45 33 -83 287 -320 2248 -447 3374 -220 721 145 850 356 321 524 -182
58 -444 107 -746 141 -180 20 -227 34 -319 96 -177 118 -258 266 -287 524 -14
123 -2 267 35 418 26 109 41 132 94 142 62 12 289 84 393 125 706 282 1093
756 1190 1460 17 122 17 483 1 620 -61 500 -211 1012 -467 1593 -57 129 -115
199 -200 241 -125 61 -85 59 -1290 61 -605 2 -1152 -1 -1215 -5z m109 -2570
c18 -5 64 -36 100 -69 199 -176 425 -288 671 -332 106 -19 354 -17 460 4 259
51 473 156 669 328 79 69 88 74 128 73 79 -2 138 -65 138 -148 0 -66 -23 -98
-138 -195 -209 -175 -443 -290 -697 -342 -164 -34 -453 -34 -617 -1 -299 60
-575 201 -787 402 -32 30 -64 67 -72 82 -33 63 -6 149 58 188 38 23 41 23 87
10z"/>
</g>
</svg>`