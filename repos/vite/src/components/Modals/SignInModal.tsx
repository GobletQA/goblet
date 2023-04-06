import type { TModalRef, TModalComponent } from '@types'
import { lazy, Suspense, useEffect } from 'react'

import { EModalTypes } from '@types'
import { AuthActive } from '@constants'
import { useUser, useRepo } from '@store'
import { isEmptyColl } from '@keg-hub/jsutils'
import { Git, Loading } from '@gobletqa/components'
import { connectModal } from '@actions/modals/modals'
import { toggleModal } from '@actions/modals/toggleModal'
import {
  SubText,
  LogoIcon,
  LogoText,
  Container,
  LogoContainer,
} from './SignInModal.styled'

const LazySignIn = lazy(() => import('@components/Admin/SignIn/SignIn'))

const styles = {
  message: {
    marginBottom: `0px`,
  }
}

export const SignInModal:TModalRef = (props:TModalComponent) => {

  const user = useUser()
  const repo = useRepo()

  useEffect(() => {
    if (!user || isEmptyColl(user)) return

    // Close the modal
    toggleModal(false)

    // If the repo is empty then,
    // open the load repo modal to allow connecting repo
    isEmptyColl(repo) && connectModal()
  }, [user, repo])

  return (
    <Container className='gb-sign-in-modal-container' >
      <Suspense fallback={<Loading />} >
        <LazySignIn
          messageSx={styles.message}
          MessageComponent={props.ModalMessage}
        />
      </Suspense>
      <LogoContainer>
        <LogoIcon />
        <LogoText>
          GobletQA
        </LogoText>
        <SubText>
          Deploy with confidence
        </SubText>
      </LogoContainer>
    </Container>
  )
}

SignInModal.modalType = EModalTypes.signIn
SignInModal.modalProps = {
  maxWidth: `sm`,
  title: `Sign In`,
  manualClose: !AuthActive,
  titleProps: {
    Icon: (<Git />)
  }
}