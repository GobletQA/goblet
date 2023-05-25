import { CSSProperties } from 'react'

const inFtSz = 14
const inHeight = 40
const input = {
  height: inHeight,
  hpx: `${inHeight}px`,
  ftSz: inFtSz,
  ftpx: `${inFtSz}px`
}

const inputBaseStyles = {
  height: input.hpx,
  minHeight: input.hpx,
  color: `var(--goblet-editor-foreground)`,
  backgroundColor: `var(--goblet-editor-background)`,
  
  [`& input`]: {
    height: input.hpx,
    fontSize: input.ftpx,
    backgroundColor: `transparent`,
    color: `var(--goblet-editor-foreground)`,
  },
  [`& input::placeholder`]: {
    fontSize: input.ftpx,
    color: `var(--goblet-editor-foreground)`,
  },
  [`& fieldset`]: {
    borderColor: `var(--goblet-input-border)`,
  },
  [`&:hover fieldset`]: {
    borderColor: `var(--goblet-list-activeSelectionForeground)`,
  },
  [`&.Mui-focused fieldset`]: {
    borderColor: `var(--goblet-list-highlightForeground)`,
  },
  [`& .MuiAutocomplete-popupIndicator`]: {
    color: `var(--goblet-editor-foreground)`,
  }
}

export const sharedInputStyles = {
  minHeight: input.hpx,
  [`& .MuiTextField-root`]: {
    height: input.hpx,
    minHeight: input.hpx,
    color: `var(--goblet-editor-foreground)`,
  },
  [`& .MuiInputBase-root`]: inputBaseStyles,
} as CSSProperties

export const sharedAutoInputStyles = {
  [`&.gb-auto-input`]: {
    [`& .MuiInputBase-root`]: inputBaseStyles
  }
} as CSSProperties

export const sharedLabelProps = {
  labelSx: {
    fontSize: input.ftpx,
    color: `var(--goblet-editor-foreground)`,
  } as CSSProperties,
  labelWrapSx: {
    // marginBottom: `5px !important`
  } as CSSProperties,
}

export const sharedHelperTextProps = {
  helperSx: {
    color: `var(--goblet-editor-foreground)`,
  }
}