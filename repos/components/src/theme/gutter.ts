const marginSize = 20
const paddingSize = 20

export const gutter = {
  padding: {
    none: `0px`,
    size: paddingSize,
    q: paddingSize / 4,
    qpx: `${paddingSize / 4}px`,
    px: `${paddingSize}px`,
    half: paddingSize / 2,
    hpx: `${paddingSize / 2}px`,
    tQ: (paddingSize / 4) * 3,
    tQpx: `${(paddingSize / 4) * 3}px`,
    dpx: `${paddingSize * 2}px`,
    double: paddingSize * 2,
    hor: `0px ${paddingSize}px`,
    vert: `${paddingSize}px 0px `,
  },
  margin: {
    none: `0px`,
    size: marginSize,
    q: marginSize / 4,
    qpx: `${marginSize / 4}px`,
    px: `${marginSize}px`,
    half: marginSize / 2,
    hpx: `${marginSize / 2}px`,
    tQ: (marginSize / 4) * 3,
    tQpx: `${(marginSize / 4) * 3}px`,
    dpx: `${marginSize * 2}px`,
    double: marginSize * 2,
    hor: `0px ${marginSize}px`,
    vert: `${marginSize}px 0px `,
  },
  sx: {
    marginTop: {marginTop: `${marginSize}px`},
    marginLeft: {marginLeft: `${marginSize}px`},
    marginBottom: {marginBottom: `${marginSize}px`},
    marginRight: {marginRight: `${marginSize}px`},
    paddingTop: {paddingTop: `${paddingSize}px`},
    paddingLeft: {paddingLeft: `${paddingSize}px`},
    paddingBottom: {paddingBottom: `${paddingSize}px`},
    paddingRight: {paddingRight: `${paddingSize}px`},
    paddingV: {paddingLeft: `${paddingSize}px`, paddingRight: `${paddingSize}px`},
    paddingH: { paddingTop: `${paddingSize}px`, paddingBottom: `${paddingSize}px` },
  }
}
