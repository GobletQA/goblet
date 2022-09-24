export function deleteModel(path: string) {
  const model = window.monaco.editor.getModels().find(model => model.uri.path === path)

  if (model) {
    model.dispose()
  }
  else {
    console.warn(`Could not find model from path ${path}`)
  }
}
