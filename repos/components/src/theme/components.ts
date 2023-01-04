import type { TPaletteOpts } from '../types'
import type { Theme } from '@mui/material/styles'

import { EThemeType } from '../types'


export const components = (
  muiTheme:Theme,
  palette:TPaletteOpts
):Theme[`components`] => {
  const isLightTheme = palette.mode === EThemeType.light
  
  return {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'unset'
        }
      }
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          "&.Mui-disabled": {
            cursor: `not-allowed`,
          }
        }
      }
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: (palette?.primary as Record<string, string>)?.main,
        }
      }
    },
    MuiDialog: {
      styleOverrides: {
        root: {
          
        },
        paper: {
          backgroundImage: `initial`,
          backgroundColor: palette.mode === EThemeType.light
            ? palette.colors.white
            : palette.colors.black12
        }
      }
    },
    MuiAccordion: {
      styleOverrides: {
        root: {
          marginTop: `0px`,
          backgroundColor: isLightTheme
            ? palette.colors.white
            : palette.colors.black12,
          [`&::before`]: {
            height: 0,
            transition: `none`,
            backgroundColor: `initial`,
          }
        },
      }
    },
    MuiAccordionSummary: {
      styleOverrides: {
        root: {
          padding: `0px`,
        },
      }
    },
    MuiAccordionDetails: {
      styleOverrides: {
        root: {
          padding: `0px`,
        },
      }
    },
    MuiAutocomplete: {
      styleOverrides: {
        input: {
          [`&::placeholder`]: {
            fontStyle: `italic`,
            fontFamily: `Manrope, sans-serif`,
          },
        },
        tag: {
          fontWeight: `bold`,
          textAlign: `center`,
          fontFamily: `Manrope, sans-serif`,
          color: isLightTheme ? palette.colors.black19 : palette.colors.gray02,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: ({ ownerState, theme }) => ({
          [`& .MuiInputBase-input`]: {
            [`::placeholder`]: {
              fontStyle: `italic`,
              fontFamily: `Manrope, sans-serif`,
            },
          },
        }),
      }
    }
  }
}