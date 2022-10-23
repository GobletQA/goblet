import type { TModalRef, TModalComponent } from '@types'
import { lazy, Suspense, useEffect } from 'react'

import { ModalTypes } from '@constants'
import { useUser, useRepo } from '@store'
import { Git } from '@components/Icons/Git'
import { Loading } from '@components/Loading'
import { isEmptyColl } from '@keg-hub/jsutils'
import { toggleModal } from '@actions/modals/toggleModal'
import { setActiveModal } from '@actions/modals/setActiveModal'

const LazySignIn = lazy(() => import('@components/Admin/SignIn/SignIn'))

export const SignInModal:TModalRef = (props:TModalComponent) => {

  const user = useUser()
  const repo = useRepo()

  useEffect(() => {
    if (!user || isEmptyColl(user)) return

    // Close the modal
    toggleModal(false)

    // If the repo is empty then,
    // open the load repo modal to allow connecting repo
    isEmptyColl(repo) && setActiveModal(ModalTypes.CONNECT)
  }, [user, repo])

  return (
    <Suspense fallback={<Loading />} >
      <LazySignIn MessageComponent={props.ModalMessage} />
    </Suspense>
  )
}

SignInModal.modalType = ModalTypes.signIn
SignInModal.modalProps = {
  maxWidth: `sm`,
  title: `Sign In`,
  manualClose: false,
  titleProps: {
    Icon: (<Git />)
  }
}