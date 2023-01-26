import type { CSSProperties } from 'react'
import type { TModalFooter, TModalComponent, TModalRef } from '@types'

import { useMemo } from 'react'
import { useContainer } from '@store'
import Box from '@mui/material/Box'
import { EModalTypes, EContainerState } from '@types'
import { ConnectForm } from '@components/Forms/ConnectForm'
import { ModalFooter } from '@components/ModalManager/ModalFooter'
import { WaitOnContainer } from '@components/WaitOnContainer/WaitOnContainer'
import { gutter, H3, Text, PlugIcon, GitTreeSvg } from '@gobletqa/components'

const styles:Record<string, CSSProperties> = {
  container: {
    width: `100%`,
    display: `flex`,
    flexDirection: `row`,
  },
  right: {
    display: `flex`,
    flexDirection: `column`,
  },
  rightTop: {
    padding: gutter.padding.hpx,
    paddingBottom: `0px`,
  },
  header: {
    marginBottom: gutter.margin.qpx
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
          <Box className='connect-modal-left'>
            <GitTreeSvg />
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
                Connect an existing repository or create a new one in your git cloud provider. This repository will track changes made to files in your project through GobletQA.
              </Text>
            </Box>
            <ConnectForm
              FormMessage={ModalMessage}
              Footer={(footerProps:TModalFooter) => (
                <>
                  <ModalFooter
                    {...footerProps}
                    sx={{
                      justifyContent: `end`,
                      padding: `${gutter.padding.px} 0px 0px`,
                    }}
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