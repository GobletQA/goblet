import { signOutAuthUser } from '../provider/signOutAuthUser'


export const signOutReload = async () => {
  await signOutAuthUser()
  // Reload the page to force reset the app state
  // Would be better to reset the components
  // But this is the quick and dirty fix
  // window.location.reload()
}