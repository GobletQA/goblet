import type { TPaletteOpts } from '../types'
import type { Theme } from '@mui/material/styles'
import { EThemeMode } from '../types'


export const components = (
  theme:Theme,
  palette:TPaletteOpts
):Theme[`components`] => {
  const isLightTheme = palette.mode === EThemeMode.light
  const textGray = isLightTheme ? palette.colors.gray15 : palette.colors.gray03

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
          backgroundColor: palette.mode === EThemeMode.light
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
    MuiFormLabel: {
      styleOverrides: {
        root: {
          color: textGray,
        }
      }
    },
    MuiAutocomplete: {
      styleOverrides: {
        input: {
          [`&::placeholder`]: {
            color: textGray,
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
              color: textGray,
              fontStyle: `italic`,
              fontFamily: `Manrope, sans-serif`,
            },
          },
        }),
      }
    },
    MuiStack: {
      defaultProps: {
        style: {}
      },
    },
    MuiTooltip: {
      defaultProps: {
        sx: {}
      },
    }
  }
}