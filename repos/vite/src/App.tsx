import '@utils/components/globalOnCopy'
import '@gobletqa/components/styles/editor.styles.css'

import { globalStyles } from '@theme'
import { RootScreen } from '@screens/Root'
import { useAppInit } from '@hooks/useAppInit'
import { Modal } from '@components/Modals/Modal'
import { ThemeProvider } from '@gobletqa/components'
import { ModalProvider } from '@contexts/ModalContext'
import { KeyboardProvider } from '@contexts/KeyboardContext'

import { useWindowResize } from '@hooks/dom/useWindowResize'

type TRootApp = {}

const App = (props:TRootApp) => {
  useWindowResize()
  const { start, apiTimeout } = useAppInit()

  return (
    <ThemeProvider globalStyles={globalStyles} >
      <ModalProvider>
        <KeyboardProvider>
          <RootScreen />
        </KeyboardProvider>
        <Modal />
      </ModalProvider>
    </ThemeProvider>
  )
}

export default App