export function createOrUpdateModel(path: string, value: string) {
  let model = window.monaco.editor.getModels().find(model => model.uri.path === path)

  if (model) {
    if (model.getValue() !== value) {
      model.pushEditOperations(
        [],
        [
          {
            range: model?.getFullModelRange(),
            text: value,
          },
        ],
        () => []
      )
    }
  }
  else if (path) {
    let type = ''
    if (path.indexOf('.') !== -1) {
      type = path.split('.').slice(-1)[0]
    }
    else {
      type = 'javascript'
    }
    const config: {
      [key: string]: string
    } = {
      js: 'javascript',
      ts: 'typescript',
      less: 'less',
      jsx: 'javascript',
      tsx: 'typescript',
    }
    model = window.monaco.editor.createModel(
      value,
      config[type] || type,
      new window.monaco.Uri().with({ path, scheme: 'goblet' })
    )
    model.updateOptions({
      tabSize: 4,
    })
  }
}
