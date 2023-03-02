import { CSSProperties } from 'react'


const inFtSz = 14
const inHeight = 40
const input = {
  height: inHeight,
  hpx: `${inHeight}px`,
  ftSz: inFtSz,
  ftpx: `${inFtSz}px`
}

export const sharedInputStyles = {
  minHeight: input.hpx,
  [`& .MuiTextField-root`]: {
    height: input.hpx,
    minHeight: input.hpx,
  },
  [`& .MuiInputBase-root`]: {
    height: input.hpx,
    minHeight: input.hpx,
    
    [`& input`]: {
      height: input.hpx,
      fontSize: input.ftpx,
    },
    [`& input::placeholder`]: {
      fontSize: input.ftpx
    }
  },
} as CSSProperties

export const sharedAutoInputStyles = {
  [`&.gc-auto-input`]: {
    [`& .MuiInputBase-root`]: {
      height: input.hpx,

      [`& input`]: {
        height: input.hpx,
        fontSize: input.ftpx,
      },
      [`& input::placeholder`]: {
        fontSize: input.ftpx
      }
    }
  }
} as CSSProperties

export const sharedLabelProps = {
  labelSx: {
    fontSize: input.ftpx,
  } as CSSProperties,
  labelWrapSx: {
    // marginBottom: `5px !important`
  } as CSSProperties,
}
