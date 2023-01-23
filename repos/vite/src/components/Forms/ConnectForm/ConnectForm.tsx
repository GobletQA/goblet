import type { TFormFooter } from '@gobletqa/components'
import type { FormEvent, ComponentType, MutableRefObject } from 'react'

import { RepoConnect } from './RepoConnect'
import { BranchConnect } from './BranchConnect'
import { useInputError } from '@hooks/form/useInputError'

import Box from '@mui/material/Box'
import { useState, useMemo } from 'react'
import Grid from '@mui/material/Unstable_Grid2'
import { signOutReload } from '@actions/admin/user/signOutReload'
import { ModalMessage } from '@components/ModalManager/ModalMessage'
import {
  Form,
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
    label: `Connect`,
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
  const [branchFrom, setBranchFrom] = useState<boolean>(false)
  
  const {
    inputError,
    onInputError,
    setInputError
  } = useInputError()

  const {
    repo,
    repos,
    branch,
    newRepo,
    newBranch,
    createRepo,
    description,
    onChangeRepo,
    onChangeBranch,
    onChangeNewRepo,
    onChangeNewBranch,
    onChangeDescription,
  } = useGetRepos({ onInputError })

  const onConnectRepo = useConnectRepo({
    loading,
    setLoading,
    setFormError,
  })

  const onSubmit = useInline(async (event:FormEvent<HTMLFormElement>) => {
    event.stopPropagation()
    event.preventDefault()

    if(!repo || !branch || (branchFrom && !newBranch) || (createRepo && !newRepo))
      return setInputError({
        repo: !repo ? `A repository is required` : undefined,
        branch: !branch ? `A branch is required` : undefined,
        newBranch: branchFrom && !newBranch ? `A branch name is require` : undefined,
        newRepo: createRepo && !newRepo ? `A repository name is required` : undefined,
      })

    const params = {
      repo,
      branch,
      newRepo,
      newBranch,
      createRepo,
      branchFrom,
      description
    }

    await onConnectRepo(params)

    onConnect?.(params)
  })

  const footerProps = useFooterProps({
    onSubmit,
    submitDisabled: Boolean(
      formError
        || loading
        || !repo
        || !branch
        || (createRepo && !newRepo)
        || (branchFrom && !newBranch)
    ),
  })

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
              container
              rowSpacing={2}
              sx={styles.grid}
              columnSpacing={1}
              disableEqualOverflow={true}
              className='gb-grid-connect-inputs'
            >

              <RepoConnect
                repo={repo}
                repos={repos}
                newRepo={newRepo}
                onChange={onChangeRepo}
                inputError={inputError}
                createRepo={createRepo}
                description={description}
                onInputError={onInputError}
                onChangeNewRepo={onChangeNewRepo}
                onChangeDescription={onChangeDescription}
              />

              <Grid
                xs={12}
                sx={{ paddingLeft: `5px` }}
                className='gb-grid-advanced'
              >
                <BranchConnect
                  repo={repo}
                  branch={branch}
                  disabled={!repo}
                  newBranch={newBranch}
                  inputError={inputError}
                  branchFrom={branchFrom}
                  onChange={onChangeBranch}
                  onInputError={onInputError}
                  onChangeBranchFrom={setBranchFrom}
                  onChangeNewBranch={onChangeNewBranch}
                />
              </Grid>

            </Grid>
          </Box>
        </Form>
      </Box>
    </>
  )
  
}