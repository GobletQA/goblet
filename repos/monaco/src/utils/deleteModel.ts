
export const deleteModel = (path: string) => {
  const model = window.monaco.editor.getModels().find(model => model.uri.path === path)
  model ? model.dispose() : console.warn(`Could not find model from path ${path}`)
}
