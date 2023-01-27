import type { CSSProperties, ComponentType, MutableRefObject } from 'react'

import Box from '@mui/material/Box'
import { RepoConnect } from './RepoConnect'
import { BranchConnect } from './BranchConnect'
import Grid from '@mui/material/Unstable_Grid2'
import { Form, gutter } from '@gobletqa/components'
import { useSubmit } from '@hooks/connect/useSubmit'
import { useConnect } from '@hooks/connect/useConnect'
import { useInputError } from '@hooks/form/useInputError'
import { ModalMessage } from '@components/ModalManager/ModalMessage'
import { useConnectActions } from '@hooks/connect/useConnectActions'


export type TConnectForm = {
  Footer?:ComponentType<any>
  Header?:ComponentType<any>
  FormMessage?: ComponentType<any>
  onConnect?: (...args:any[]) => void
  formRef?: MutableRefObject<HTMLFormElement>
}

const styles = {
  container: {
    flexGrow: 2,
    display: `flex`,
    flexDirection: `column`,
    paddingTop: gutter.padding.hpx,
  } as CSSProperties,
  form: {
    sx: {
      // paddingBottom: gutter.padding.px
    },
    containerSx: {
      height: `100%`,
      display: `grid`,
      flexDirection: `column`,
    },
    footerSx: {
      alignSelf: `end`
    }
  } as Record<string, CSSProperties>,
  grid: {
    alignItems: `center`
  } as CSSProperties,
  branch: {
    paddingTop: `0px`,
    paddingLeft: gutter.padding.qpx,
  } as CSSProperties,
}


export const ConnectForm = (props:TConnectForm) => {
  const {
    Footer,
    Header,
    formRef,
    onConnect,
    FormMessage=ModalMessage,
  } = props

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
    loading,
    newBranch,
    createRepo,
    branchFrom,
    setLoading,
    description,
    onChangeRepo,
    setBranchFrom,
    onChangeBranch,
    onChangeNewRepo,
    onChangeNewBranch,
    onChangeDescription,
  } = useConnect({ onInputError })

  const {
    onSubmit,
    formError,
  } = useSubmit({
    repo,
    branch,
    newRepo,
    loading,
    onConnect,
    newBranch,
    setLoading,
    branchFrom,
    createRepo,
    description,
    setInputError
  })


  const footerProps = useConnectActions({
    onSubmit,
    submitDisabled: Boolean(
      loading
        || !repo
        || !branch
        || (createRepo && !newRepo)
        || (branchFrom && !newBranch)
    ),
  })

  return (
    <>
      <Box
        sx={styles.container}
        className='connect-form-container'
      >
        <FormMessage
          error={formError}
          loading={loading && 'Connecting Repo'}
        />
        <Form
          {...styles.form}
          ref={formRef}
          Header={Header}
          Footer={Footer}
          onSubmit={onSubmit}
          footerProps={footerProps}
          className='gb-grid-connect-form'
        >
          <Box className='gb-grid-connect-inputs-container'>
            <Grid
              container
              rowSpacing={2}
              sx={styles.grid}
              columnSpacing={1}
              disableEqualOverflow={true}
              className='gb-grid-repo-connect'
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
                sx={styles.branch}
                className='gb-grid-branch-connect'
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