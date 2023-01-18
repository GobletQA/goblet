import type { FormEvent, ReactNode, ComponentType, MutableRefObject } from 'react'
import type { TFormFooter } from '@types'

import Box from '@mui/material/Box'
import { Form } from '@components/Form'
import Grid from '@mui/material/Unstable_Grid2'
import { useCallback, useState, useMemo } from 'react'

import { AutoInput } from '@components/Form/Inputs/AutoInput'
import { signOutReload } from '@actions/admin/user/signOutReload'
import { ModalMessage } from '@components/ModalManager/ModalMessage'
import { useInline, CloudDownIcon, LogoutIcon, gutter } from '@gobletqa/components'

import { noPropArr, noOpObj } from '@keg-hub/jsutils'
import { useGetRepos } from '@hooks/api/useGetRepos'
import { useConnectRepo } from '@hooks/api/useConnectRepo'


export type TConnectForm = {
  Footer?:ComponentType<any>
  Header?:ComponentType<any>
  FormMessage?: ComponentType<any>
  onConnect?: (...args:any[]) => void
  formRef?: MutableRefObject<HTMLFormElement>
}

const ConnectFormActions = {
  signOut: {
    label: `Sign Out`,
    StartIcon: LogoutIcon,
    onClick: signOutReload,
    variant: `text`  as const,
    color: `secondary` as const,
  },
  connectRepo: {
    StartIcon: CloudDownIcon,
    color: `primary`  as const,
    variant: `contained`  as const,
    label: `Connect Repo`,
  }
}

type THFooterProps = {
  onSubmit?: (event:FormEvent<HTMLFormElement>) => void
  submitDisabled?:boolean
}

const useFooterProps = ({
  onSubmit,
  submitDisabled
}:THFooterProps) => {
  return useMemo(() => {
    return {
      actionProps: {
        sx: {
          paddingTop: `10px`,
          paddingBottom: `20px`,
          justifyContent: `space-around`
        }
      },
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

type TRepoProps = {
  
}

const RepoSelect = (props:TRepoProps) => {
/**
      Component: `AutoInput`,
      required: true,
      name: `repo`,
      label: `Select Repo`,
      decor: {
        name: `syncRepos`,
        color: `secondary`,
        labelPos: `bottom`,
        onClick: getRepos,
        label: `Sync Repos`,
        Icon: `$component.SyncIcon`,
        buttonProps: { size: `small` },
        iconProps:{ fontSize: `small` },
        Component: `$component.IconButton`,
      },
      textFieldProps: {
        placeholder: `Select a repo to connect to...`,
      },
      rules: {
        required: `Please select a repository`
      }
 */
  
  return (
    <span>
      Repo Select
    </span>
  )
  
}

export const ConnectForm = (props:TConnectForm) => {
  const {
    formRef,
    Footer,
    Header,
    onConnect,
    FormMessage=ModalMessage,
  } = props

  const [formError, setFormError] = useState<string>()
  const [loading, setLoading] = useState<boolean>(false)

  const onSubmit = useInline((event:FormEvent<HTMLFormElement>) => {
    event.stopPropagation()
    event.preventDefault()
    console.log(`------- On Form Submit -------`)
  })
  
  
  const footerProps = useFooterProps({
    onSubmit,
    submitDisabled: Boolean(formError || loading),
  })

  return (
    <>
      <Box padding={`${gutter.padding.px} ${gutter.padding.dpx}`}>
        <FormMessage
          error={formError}
          loading={loading && 'Connecting Repo'}
        />
        <Form
          ref={formRef}
          Header={Header}
          Footer={Footer}
          footerProps={footerProps}
          onSubmit={onSubmit}
        >
          <Box marginBottom={gutter.margin.px} >
            <Grid
              rowSpacing={2}
              container={true}
              columnSpacing={1}
              disableEqualOverflow={true}
            >
              <Grid xs={12} >
                <RepoSelect
                />
              </Grid>
            </Grid>
          </Box>
        </Form>
      </Box>
    </>
  )
  
}