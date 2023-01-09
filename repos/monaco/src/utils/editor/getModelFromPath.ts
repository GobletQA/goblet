
/**
 * Gets the model based on the passed in path
 * Should match the relative path of the file when the model was created
 *
 */
export const getModelFromPath = (
  path:string,
) => {
  // Use window?.monaco?.editor to get to editor constructor, NOT an instance of the editor
  return window?.monaco?.editor
    .getModels()
    .find(model => model.uri.path === path)
}