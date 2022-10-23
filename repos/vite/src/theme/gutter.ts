const marginSize = 20
const paddingSize = 20

export const gutter = {
  padding: {
    none: `0px`,
    size: paddingSize,
    px: `${paddingSize}px`,
    half: paddingSize / 2,
    hpx: `${paddingSize / 2}px`,
    tQ: (paddingSize / 4) * 3,
    tQpx: `${(paddingSize / 4) * 3}px`,
    dpx: `${paddingSize * 2}px`,
    double: paddingSize * 2,
  },
  margin: {
    none: `0px`,
    size: marginSize,
    px: `${marginSize}px`,
    half: marginSize / 2,
    hpx: `${marginSize / 2}px`,
    tQ: (marginSize / 4) * 3,
    tQpx: `${(marginSize / 4) * 3}px`,
    dpx: `${marginSize * 2}px`,
    double: marginSize * 2,
  }
}
