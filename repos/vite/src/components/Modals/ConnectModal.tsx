import type { CSSProperties } from 'react'
import type { TModalFooter, TModalComponent, TModalRef } from '@gobletqa/components'


import Box from '@mui/material/Box'
import { EModalTypes } from '@types'
import { lazy, Suspense } from 'react'
import { ModalFooter } from '@gobletqa/components'
import { ConnectForm } from '@components/Forms/ConnectForm'
import { useContainerCreating } from '@hooks/api/useContainerCreating'
import { gutter, H3, Text, PlugIcon, Loading } from '@gobletqa/components'
import { WaitOnContainer } from '@components/WaitOnContainer/WaitOnContainer'

const VersionCtrl = lazy(() => import('@gobletqa/components/components/Svgs/VersionCtrl'))

const styles:Record<string, CSSProperties> = {
  container: {
    width: `100%`,
    display: `flex`,
    flexDirection: `row`,
  },
  left: {
    paddingRight: gutter.padding.hpx
  },
  version: {
    width: `300px`,
    height: `300px`
  },
  right: {
    display: `flex`,
    flexDirection: `column`,
    paddingLeft: gutter.padding.hpx,
    paddingBottom: gutter.padding.px,
    paddingRight: gutter.padding.hpx,
  },
  rightTop: {
    paddingBottom: `0px`,
  },
  header: {
    marginBottom: gutter.margin.qpx
  },
  footer: {
    justifyContent: `end`,
    padding: `${gutter.padding.px} 0px 0px`,
  }
}

export const ConnectModal:TModalRef = (props:TModalComponent) => {
  const { ModalMessage } = props

  const showWaiting = useContainerCreating()

  return showWaiting
    ? (<WaitOnContainer />)
    : (
        <Box
          sx={styles.container}
          className='gb-connect-modal-container'
        >
          <Box
            sx={styles.left}
            className='gb-connect-modal-left'
          >
            <Suspense fallback={<Loading />} >
              <VersionCtrl />
            </Suspense>
          </Box>
          <Box
            sx={styles.right}
            className='gb-connect-modal-right'
          >
            <Box
              sx={styles.rightTop}
              className='gb-connect-modal-right-top'
            >
              <H3
                sx={styles.header}
                className='gb-connect-modal-header-text'
              >
                Repository
              </H3>
              <Text className='gb-connect-modal-sub-text' variant="subtitle2">
                Connect or create a repository using your git cloud provider. Once connected, all project files are automatically synced between the repository and GobletQA.
              </Text>
            </Box>
            <ConnectForm
              FormMessage={ModalMessage}
              Footer={(footerProps:TModalFooter) => (
                <>
                  <ModalFooter
                    {...footerProps}
                    sx={styles.footer}
                  />
                </>
              )}
            />
          </Box>
        </Box>
      )
}

ConnectModal.modalType = EModalTypes.connect
ConnectModal.modalProps = {
  Footer: false,
  manualClose: false,
  title: `Git Connect`,
  titleProps: {
    Icon: (<PlugIcon />)
  }
}