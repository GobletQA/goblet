import '@utils/components/globalOnCopy'
import '@gobletqa/components/styles/editor.styles.css'

import { RootScreen } from 'src/screens/Root'
import { useAppInit } from '@hooks/useAppInit'
import { ThemeProvider } from '@contexts/ThemeContext'
import { ModalProvider } from '@contexts/ModalContext'
import { ModalManager } from '@components/ModalManager'
import { useWindowResize } from '@hooks/dom/useWindowResize'


type TRootApp = {}

const App = (props:TRootApp) => {
  useWindowResize()
  const { start, apiTimeout } = useAppInit()

  return (
    <ThemeProvider>
      <ModalProvider>
        <RootScreen />
        <ModalManager />
      </ModalProvider>
    </ThemeProvider>
  )
}

export default App