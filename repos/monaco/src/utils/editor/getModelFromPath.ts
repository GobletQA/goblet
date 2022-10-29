export const getModelFromPath = (path:string) => {
  return window?.monaco?.editor
    .getModels()
    .find(model => model.uri.path === path)
}