import type { TThemeTypes } from '@theme/theme.types'
import { useState, useMemo, useEffect } from 'react'

import { initApp } from '@actions/init'
import { createTheme } from '@theme/Theme'
import { Fadeout } from '@components/Fadeout'
import { RootScreen } from 'src/screens/Root'
import CssBaseline from '@mui/material/CssBaseline'
import { ThemeProvider } from '@mui/material/styles'

const onAppInit = async (setApiTimeout:(...args:any[])=>any) => {
  let timeout:NodeJS.Timeout

  new Promise((res, rej) => {
    timeout = setTimeout(() => rej(), 3000)
    return initApp().then(() => res(clearTimeout(timeout)))
  })
  .catch(() => setApiTimeout(`Backend API Server is not responding`))
}


const App = () => {
  const [themeType, setThemeType] = useState<TThemeTypes>(`light`)
  const theme = useMemo(() => createTheme(themeType), [themeType])

  const [apiTimeout, setApiTimeout] = useState(false)
  const [start, setStart] = useState(false)
  useEffect(() => {
    onAppInit(setApiTimeout)
    setStart(true)
  }, [])

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <RootScreen themeSwitch={setThemeType} />
      <Fadeout start={start} content={apiTimeout} />
    </ThemeProvider>
  )
}

export default App