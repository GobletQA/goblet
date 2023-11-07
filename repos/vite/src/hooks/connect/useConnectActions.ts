import type { FormEvent } from 'react'
import type { TFormFooter } from '@gobletqa/components'

import { useMemo } from 'react'
import { LogoutIcon, CloudDownIcon, gutter, colors } from '@gobletqa/components'
import { signOutManually } from '@actions/admin/user/signOutManually'


const ConnectFormActions = {
  logout: {
    sx: {
      minWidth: `auto`,
      borderRadius: `50%`,
      position: `absolute`,
      justifyContent: `end`,
      top: gutter.padding.tQpx,
      padding: `${gutter.padding.qpx}`,
      right: `${gutter.padding.tQ * 2 - gutter.padding.q}px`,
      [`> span`]: {
        margin: `0px`,
        [`> svg`]: {
          fontSize: `18px`,
        }
      }
    },
    variant: `text`,
    color: `light`,
    key: `logout-action`,
    tooltip: `Logout`,
    StartIcon: LogoutIcon,
    onClick: () => signOutManually()
  },
  connectRepo: {
    label: `Connect`,
    StartIcon: CloudDownIcon,
    color: `primary`  as const,
    variant: `contained`  as const,
  },
}

const actionProps = {
  sx: {
    paddingTop: `10px`,
    paddingBottom: `20px`,
    justifyContent: `flex-end`
  }
}

type THConnectActions = {
  onSubmit?: (event:FormEvent<HTMLFormElement>) => void
  submitDisabled?:boolean
}

export const useConnectActions = ({
  onSubmit,
  submitDisabled
}:THConnectActions) => {
  return useMemo(() => {
    return {
      actionProps,
      actions: {
        ...ConnectFormActions,
        connectRepo: {
          ...ConnectFormActions.connectRepo,
          onClick: onSubmit,
          disabled: submitDisabled
        }
      }
    } as TFormFooter
  }, [
    onSubmit,
    submitDisabled
  ])
}
