import type { CSSProperties } from 'react'
import type { TModalFooter, TModalComponent, TModalRef } from '@types'


import Box from '@mui/material/Box'
import { useContainer } from '@store'
import { lazy, Suspense, useMemo } from 'react'
import { EModalTypes, EContainerState } from '@types'
import { ConnectForm } from '@components/Forms/ConnectForm'
import { ModalFooter } from '@components/ModalManager/ModalFooter'
import { WaitOnContainer } from '@components/WaitOnContainer/WaitOnContainer'
import { gutter, H3, Text, PlugIcon, Loading } from '@gobletqa/components'

const VersionCtrl = lazy(() => import('@gobletqa/components/svgs/VersionCtrl'))

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
    paddingRight: `${gutter.padding.size + 10}px`,
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
  const container = useContainer()

  const showWaiting = useMemo(() => {
    return !container?.meta?.state || container?.meta?.state === EContainerState.Creating
  }, [container?.meta?.state])

  return showWaiting
    ? (<WaitOnContainer />)
    : (
        <Box
          sx={styles.container}
          className='connect-modal-container'
        >
          <Box
            sx={styles.left}
            className='connect-modal-left'
          >
            <Suspense fallback={<Loading />} >
              <VersionCtrl />
            </Suspense>
          </Box>
          <Box
            sx={styles.right}
            className='connect-modal-right'
          >
            <Box
              sx={styles.rightTop}
              className='connect-modal-right-top'
            >
              <H3
                sx={styles.header}
                className='connect-modal-header-text'
              >
                Repository
              </H3>
              <Text className='connect-modal-sub-text' variant="subtitle2">
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