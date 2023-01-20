import type { TFormFooter } from '@types'
import type { TRepoProps } from './RepoSelect'
import type { FormEvent, ComponentType, MutableRefObject } from 'react'

import { Advanced } from './Advanced'
import { SyncRepos } from './SyncRepos'
import { RepoSelect } from './RepoSelect'

import Box from '@mui/material/Box'
import { Form } from '@components/Form'
import Grid from '@mui/material/Unstable_Grid2'
import { useState, useMemo, useCallback } from 'react'
import { signOutReload } from '@actions/admin/user/signOutReload'
import { ModalMessage } from '@components/ModalManager/ModalMessage'
import {
  gutter,
  useInline,
  LogoutIcon,
  CloudDownIcon,
} from '@gobletqa/components'

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

const styles = {
  form: {
    paddingBottom: gutter.padding.px
  },
  grid: {
    alignItems: `center`
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

export const ConnectForm = (props:TConnectForm) => {
  const {
    Footer,
    Header,
    formRef,
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

  const {
    repo,
    repos,
    branch,
    onChangeRepo,
    onChangeBranch
  } = useGetRepos()

  return (
    <>
      <Box className='connect-form-container' padding={`${gutter.padding.px} ${gutter.padding.px}`}>
        <FormMessage
          error={formError}
          loading={loading && 'Connecting Repo'}
        />
        <Form
          ref={formRef}
          Header={Header}
          Footer={Footer}
          sx={styles.form}
          onSubmit={onSubmit}
          footerProps={footerProps}
          className='gb-grid-connect-form'
        >
          <Box
            className='gb-grid-connect-inputs-container'
          >
            <Grid
              rowSpacing={2}
              sx={styles.grid}
              container={true}
              columnSpacing={1}
              disableEqualOverflow={true}
              className='gb-grid-connect-inputs'
            >
              <Grid className='gb-grid-repo-select' xs={9} md={11} >
                <RepoSelect
                  repo={repo}
                  repos={repos}
                  onChange={onChangeRepo}
                />
              </Grid>
              <Grid className='gb-grid-sync-repos' xs={3} md={1} >
                <SyncRepos />
              </Grid>
              <Grid
                xs={12}
                sx={{ paddingLeft: `5px` }}
                className='gb-grid-advanced'
              >
                <Advanced
                  repo={repo}
                  branch={branch}
                  onChange={onChangeBranch}
                />
              </Grid>
            </Grid>

            

            
          </Box>
        </Form>
      </Box>
    </>
  )
  
}