
import { HeaderNav } from '@constants'
import { Page } from '@components/Page'
import { LogoutIcon } from '@gobletqa/components'

import { SocketProvider } from '@contexts'

import { asCallback } from '@utils/helpers'
import { settingsModal } from '@actions/modals'
import { disconnectRepo } from '@actions/repo/api/disconnect'
import { signOutManually } from '@actions/admin/user/signOutManually'
import {useContainerCreating} from '@hooks/api/useContainerCreating'

type THomeProps = {
  [key:string]: any
}

export default function Home(props:THomeProps) {

  const creatingContainer = useContainerCreating()

  return creatingContainer
   ? (<></>)
   : (<Page settings={settings} />)
}

const navActions = {
  Logout: signOutManually,
  Settings: asCallback(settingsModal, false),
  UnmountRepo: asCallback(disconnectRepo, false),
}

Home.path = `/`
Home.element = `Home`
// @ts-ignore
Home.children = HeaderNav.map((item) => {
  const navKey = item?.label.replace(/\s/g,``) as keyof typeof navActions
  const action = navActions[navKey]
  return {
    ...item,
    ...(action ? { onClick: action } : {})
  }
})

const settings = [
  ...Home.children,
  {
    divider: true,
    label: `Sign Out`,
    Icon: LogoutIcon,
    onClick: signOutManually,
  }
]