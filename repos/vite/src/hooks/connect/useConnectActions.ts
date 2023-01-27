import type { FormEvent } from 'react'
import type { TFormFooter } from '@gobletqa/components'

import { useMemo } from 'react'
import { CloudDownIcon } from '@gobletqa/components'

const ConnectFormActions = {
  connectRepo: {
    StartIcon: CloudDownIcon,
    color: `primary`  as const,
    variant: `contained`  as const,
    label: `Connect`,
  }
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
