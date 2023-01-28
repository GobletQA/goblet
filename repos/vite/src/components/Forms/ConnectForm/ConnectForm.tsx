import type { CSSProperties, ComponentType, MutableRefObject } from 'react'

import Box from '@mui/material/Box'
import { Advanced } from './Advanced'
import { RepoConnect } from './RepoConnect'
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

/**
 * TODO - When creating a repo
 * - Should not allow setting parent / child branches
 *   - Use default goblet-<username> branch
 *   - Is auto-created on the backend when repo is created
 * - Add ability to select user or organization
 * - Loop existing repos, and get list of orgs that can be used
 * - Move organization select and description input to Advanced section
 *   - Should only display when creating repo
 * - Branch connect should only display when using an existing repo
 */

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
    owner,
    branch,
    newRepo,
    parents,
    loading,
    newBranch,
    createRepo,
    branchFrom,
    setLoading,
    description,
    onChangeRepo,
    setBranchFrom,
    onChangeOwner,
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
    owner,
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
                onInputError={onInputError}
                onChangeNewRepo={onChangeNewRepo}
              />

              <Grid
                xs={12}
                sx={styles.branch}
                className='gb-grid-branch-connect'
              >
                <Advanced
                  repo={repo}
                  repos={repos}
                  owner={owner}
                  branch={branch}
                  disabled={!repo}
                  parents={parents}
                  newBranch={newBranch}
                  inputError={inputError}
                  branchFrom={branchFrom}
                  createRepo={createRepo}
                  onChange={onChangeBranch}
                  description={description}
                  onInputError={onInputError}
                  onChangeOwner={onChangeOwner}
                  onChangeBranchFrom={setBranchFrom}
                  onChangeNewBranch={onChangeNewBranch}
                  onChangeDescription={onChangeDescription}
                />
              </Grid>

            </Grid>
          </Box>
        </Form>
      </Box>
    </>
  )
  
}