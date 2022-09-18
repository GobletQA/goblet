import type { TThemeTypes } from '@theme/theme.types' 

import { useState, useMemo } from 'react'
import { createTheme } from '@theme/Theme'
import { RootContainer } from '@containers/Root'
import CssBaseline from '@mui/material/CssBaseline'
import { ThemeProvider } from '@mui/material/styles'


const App = () => {
  const [themeType, setThemeType] = useState<TThemeTypes>(`light`)
  const theme = useMemo(() => createTheme(themeType), [themeType])

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <RootContainer />
    </ThemeProvider>
  )
}

export default App