import React, { useState, useEffect } from 'react'
import { SafeAreaView, StatusBar } from 'react-native'

import { keg } from 'GBConfig'
import { getStore } from 'GBStore'
import { Provider } from 'react-redux'
import { getHistory } from 'GBNavigation'
import { Toast } from 'GBComponents/toast'
import { Router } from 'GBComponents/router'
import { checkCall } from '@keg-hub/jsutils'
import { tapColors } from 'GBTheme/tapIndex'
import { FadeOut } from 'GBComponents/fadeOut'
import { initAppAction, init } from 'GBActions'
import { DomStyles } from 'GBComponents/domStyles'
import { reStyle } from '@keg-hub/re-theme/reStyle'
import { View, Text } from '@keg-hub/keg-components'
import { ContainerRoutes } from 'GBNavigation/containerRoutes'
import { ModalManager } from 'GBComponents/modals/modalManager'
import { ReThemeProvider, getDefaultTheme } from '@keg-hub/re-theme'
import { ContainerProgress } from 'GBComponents/container/containerProgress'

const checkAppInit = async setApiTimeout => {
  let timeout
  new Promise((res, rej) => {
    timeout = setTimeout(() => rej(), 3000)
    return init().then(() => res(clearTimeout(timeout)))
  })
    .then(() => checkCall(initAppAction))
    .catch(() => setApiTimeout(`Backend API Server is not responding`))
}

const Timeout = reStyle(Text)({ txAl: 'center' })
const AppMain = reStyle(View)({
  fl: 1,
  w: '100%',
  mW: '100%',
  bgC: tapColors.appBackground,
})

const App = props => {
  const [activeTheme, switchTheme] = useState(getDefaultTheme())
  const [apiTimeout, setApiTimeout] = useState(false)

  useEffect(() => checkAppInit(setApiTimeout), [])

  return (
    <>
      <StatusBar barStyle={'default'} />
      <Router history={getHistory()}>
        <SafeAreaView>
          <Provider store={getStore()}>
            <ReThemeProvider theme={activeTheme}>
              <DomStyles />
              <ContainerProgress />
              <AppMain>
                <ContainerRoutes navigationConfigs={keg.routes} />
                <ModalManager />
              </AppMain>
              <Toast />
              <FadeOut>
                {apiTimeout && <Timeout>{apiTimeout}</Timeout>}
              </FadeOut>
            </ReThemeProvider>
          </Provider>
        </SafeAreaView>
      </Router>
    </>
  )
}

export default App

