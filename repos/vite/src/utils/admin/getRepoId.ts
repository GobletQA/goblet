
export const getRepoId = (repoUrl:string) => {
  const url = new URL(repoUrl)
  const repoId = url.pathname.replace('.git', '').replace(`/`, ``)

  return repoId.startsWith(`/`) ? repoId.replace(`/`, ``) : repoId
}