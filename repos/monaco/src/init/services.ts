// @ts-ignore
import JSONWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker'
// @ts-ignore
import TSWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker'
// @ts-ignore
import EditorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker'

window.MonacoEnvironment = {
  getWorker(moduleId, label) {
    let MonacoWorker;

    switch (label) {
      case 'json':
        MonacoWorker = JSONWorker
        break;
      case 'typescript':
      case 'javascript':
        MonacoWorker = TSWorker
        break;
      default:
        MonacoWorker = EditorWorker
    }

    return new MonacoWorker()
  },
}


export {}