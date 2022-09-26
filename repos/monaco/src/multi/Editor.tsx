import type { TEditorConfig, TEditorTheme } from '../types'
import React, {
  useRef,
  useMemo,
  useState,
  useEffect,
  useCallback,
  useImperativeHandle,
} from 'react'

import { THEMES } from '../constants'
import Modal from '../components/modal'
import * as monacoType from 'monaco-editor'
import { setTheme } from '../init/setTheme'
import FileList from '../components/filelist'
import OpenedTab from '../components/openedtab'
import { createOrUpdateModel, deleteModel } from '../utils'

export interface filelist {
  [key: string]: string | null
}
export interface MultiEditorIProps {
  defaultPath?: string
  defaultFiles?: filelist
  config?: TEditorConfig
  onPathChange?: (key: string) => void
  onValueChange?: (v: string) => void
  onFileChange?: (key: string, value: string) => void
  options: monacoType.editor.IStandaloneEditorConstructionOptions
}

export interface MultiRefType {
  getAllValue: () => filelist
  getValue: (path: string) => string | null
  getSupportThemes: () => Array<string>
  setTheme: (name: string, theme?:TEditorTheme) => void
}

export const MultiEditorComp = React.forwardRef<MultiRefType, MultiEditorIProps>(
  (
    {
      defaultPath,
      onPathChange,
      onValueChange,
      defaultFiles = {},
      onFileChange,
      config={},
      options,
    },
    ref
  ) => {

    const onPathChangeRef = useRef(onPathChange)
    const onValueChangeRef = useRef(onValueChange)
    const onFileChangeRef = useRef(onFileChange)
    const optionsRef = useRef(options)
    onPathChangeRef.current = onPathChange
    onValueChangeRef.current = onValueChange
    onFileChangeRef.current = onFileChange
    optionsRef.current = options

    const editorNodeRef = useRef<HTMLDivElement>(null)
    const editorRef = useRef<monacoType.editor.IStandaloneCodeEditor | null>(null)
    const prePath = useRef<string | null>(defaultPath || '')
    const filesRef = useRef(defaultFiles)
    const valueLisenerRef = useRef<monacoType.IDisposable>()
    const editorStatesRef = useRef(new Map())

    const [openedFiles, setOpenedFiles] = useState<
      Array<{
        status?: string
        path: string
      }>
    >(
      defaultPath
        ? [
            {
              path: defaultPath,
            },
          ]
        : []
    )

    const [curPath, setCurPath] = useState(defaultPath || '')
    const curPathRef = useRef(defaultPath || '')
    const curValueRef = useRef('')

    const handleFromat = useCallback(() => {
      return editorRef.current?.getAction('editor.action.formatDocument').run()
    }, [])

    const restoreModel = useCallback((path: string) => {
      const editorStates = editorStatesRef.current
      const model = window.monaco.editor
        .getModels()
        .find(model => model.uri.path === path)
      if (path !== prePath.current && prePath.current) {
        editorStates.set(prePath.current, editorRef.current?.saveViewState())
      }
      if (valueLisenerRef.current && valueLisenerRef.current.dispose) {
        valueLisenerRef.current.dispose()
      }
      if (model && editorRef.current) {
        editorRef.current.setModel(model)
        if (path !== prePath.current) {
          const editorState = editorStates.get(path)
          if (editorState) {
            editorRef.current?.restoreViewState(editorState)
          }

          editorRef.current?.focus()
          let timer: any = null
          valueLisenerRef.current = model.onDidChangeContent(() => {
            const v = model.getValue()
            setOpenedFiles(pre =>
              pre.map(v => {
                if (v.path === path) {
                  v.status = 'editing'
                }
                return v
              })
            )
            // filesRef.current[path] = v;
            if (onFileChangeRef.current) {
              onFileChangeRef.current(path, v)
            }
            curValueRef.current = v
            if (onValueChangeRef.current) {
              onValueChangeRef.current(v)
            }

            // if (timer) clearTimeout(timer)
            // timer = setTimeout(() => {
            //   timer = null
            //   worker.then(res =>
            //     res.postMessage({
            //       code: model.getValue(),
            //       version: model.getVersionId(),
            //       path,
            //     })
            //   )
            // }, 500)
          })
        }
        // worker.then(res =>
        //   res.postMessage({
        //     code: model.getValue(),
        //     version: model.getVersionId(),
        //     path,
        //   })
        // )
        prePath.current = path
        return model
      }
      return false
    }, [])

    const openOrFocusPath = useCallback((path: string) => {
      setOpenedFiles(pre => {
        let exist = false
        pre.forEach(v => {
          if (v.path === path) {
            exist = true
          }
        })
        if (exist) {
          return pre
        }
        return [...pre, { path: path }]
      })
      setCurPath(path)
    }, [])

    const handlePathChange = useCallback(
      (path: string) => {
        const model = restoreModel(path)
        if (model) {
          openOrFocusPath(path)
        }
      },
      [restoreModel, openOrFocusPath]
    )

    useEffect(() => {
      editorRef.current = window.monaco.editor.create(editorNodeRef.current!, {
        ...optionsRef.current,
        model: null,
      })

      const editorService = (editorRef.current as any)._codeEditorService
      const openEditorBase = editorService.openCodeEditor.bind(editorService)
      editorService.openCodeEditor = async (input: any, source: any, sideBySide: any) => {
        const result = await openEditorBase(input, source)
        if (result === null) {
          const fullPath = input.resource.path
          source.setModel(window.monaco.editor.getModel(input.resource))
          openOrFocusPath(fullPath)
          source.setSelection(input.options.selection)
          source.revealLine(input.options.selection.startLineNumber)
        }
        // always return the base result
        return result
      }

      return () => {
        if (editorRef.current) {
          editorRef.current.dispose()
        }
      }
    }, [openOrFocusPath])

    const saveFile = useCallback(() => {
      filesRef.current[curPathRef.current] = curValueRef.current
    }, [handleFromat])

    const onCloseFile = useCallback(
      (path: string) => {
        setOpenedFiles(pre => {
          let targetPath = ''
          if (pre.length) {
            const res = pre.filter((v, index) => {
              if (v.path === path) {
                if (index === 0) {
                  if (pre[index + 1]) {
                    targetPath = pre[index + 1].path
                  }
                }
                else {
                  targetPath = pre[index - 1].path
                }
              }
              return v.path !== path
            })

            if (targetPath && curPathRef.current === path) {
              restoreModel(targetPath)
              setCurPath(targetPath)
            }
            if (res.length === 0) {
              restoreModel('')
              setCurPath('')
              prePath.current = ''
            }
            return res
          }
          return pre
        })
      },
      [restoreModel]
    )

    const closeOtherFiles = useCallback(
      (path: string) => {
        const unSavedFiles = openedFiles.filter(v => v.status === 'editing')
        if (unSavedFiles.length) {
          Modal.confirm({
            title: 'Confirm',
            target: rootRef.current,
            okText: 'OK',
            cancelText: 'Cancel',
            onCancel: (close: () => void) => {
              close()
              setOpenedFiles(pre => pre.filter(p => p.path === path))
              restoreModel(path)
              setCurPath(path)
              unSavedFiles.forEach(v => {
                const value = filesRef.current[v.path] || ''
                createOrUpdateModel(v.path, value)
              })
              prePath.current = path
            },
            onOk: (close: () => void) => {
              close()
              unSavedFiles.forEach(v => {
                const model = window.monaco.editor
                  .getModels()
                  .find(model => model.uri.path === v.path)

                filesRef.current[v.path] = model?.getValue() || ''
              })
              setOpenedFiles(pre => pre.filter(p => p.path === path))
              restoreModel(path)
              setCurPath(path)
              prePath.current = path
            },
            content: () => (
              <div>
                <div>There are unsaved changes, are you sure?</div>
                <div>Files:</div>
                {unSavedFiles.map(v => (
                  <div key={v.path}>{v.path}</div>
                ))}
              </div>
            ),
          })
        }
        else {
          setOpenedFiles(pre => pre.filter(p => p.path === path))
          restoreModel(path)
          setCurPath(path)
          prePath.current = path
        }
      },
      [restoreModel, openedFiles]
    )

    const abortFileChange = useCallback(
      (path: string) => {
        const value = filesRef.current[path] || ''
        createOrUpdateModel(path, value)
        onCloseFile(path)
      },
      [onCloseFile]
    )

    const dealKey = useCallback(
      (e: React.KeyboardEvent<HTMLElement>) => {
        const ctrlKey = e.ctrlKey || e.metaKey
        const keyCode = e.keyCode

        if (ctrlKey && keyCode === 83) {
          e.preventDefault()
          saveFile()
        }
      },
      [saveFile]
    )

    useEffect(() => {
      Object.keys(filesRef.current).forEach(key => {
        const value = filesRef.current[key]
        if (typeof value === 'string') {
          createOrUpdateModel(key, value)
        }
      })
    }, [])

    useEffect(() => {
      if (editorRef.current) {
        if(config.theme) setTheme(config.theme.name, config.theme.theme)
        editorRef.current.updateOptions(options)
      }
    }, [options, config])

    useEffect(() => {
      if (onPathChangeRef.current && curPath) {
        onPathChangeRef.current(curPath)
      }
      curPathRef.current = curPath
    }, [curPath])

    useImperativeHandle(ref, () => ({
      setTheme,
      getSupportThemes: () => THEMES,
      getAllValue: () => filesRef.current,
      getValue: (path: string) => filesRef.current[path],
    }))

    const addFile = useCallback(
      (path: string, value?: string) => {
        createOrUpdateModel(path, value || '')
        filesRef.current[path] = value || ''
        setTimeout(() => {
          handlePathChange(path)
        }, 50)
      },
      [handlePathChange]
    )

    const deleteFile = useCallback(
      (path: string) => {
        deleteModel(path)
        delete filesRef.current[path]
        onCloseFile(path)
      },
      [onCloseFile]
    )

    const editFileName = useCallback(
      (path: string, name: string) => {
        const value = filesRef.current[path] || ''
        setTimeout(() => {
          deleteFile(path)
          const newPath = path.split('/').slice(0, -1).concat(name).join('/')
          addFile(newPath, value)
        }, 50)
      },
      [deleteFile, addFile]
    )

    const addFolder = useCallback((path: string) => {
      let hasChild = false
      Object.keys(filesRef.current).forEach(p => {
        if (p.startsWith(path + '/')) {
          hasChild = true
        }
      })
      if (!hasChild) {
        filesRef.current[path] = null
      }
    }, [])

    const deleteFolder = useCallback(
      (path: string) => {
        delete filesRef.current[path]
        Object.keys(filesRef.current).forEach(p => {
          if (p.startsWith(path + '/')) {
            const value = filesRef.current[p]
            if (typeof value === 'string') {
              deleteFile(p)
            }
          }
        })
      },
      [deleteFile]
    )

    const editFolderName = useCallback(
      (path: string, name: string) => {
        const paths = (path || '/').slice(1).split('/')
        const newPath = '/' + paths.slice(0, -1).concat(name).join('/')
        delete filesRef.current[path]
        addFolder(newPath)
        Object.keys(filesRef.current).forEach(p => {
          if (p.startsWith(path + '/')) {
            const value = filesRef.current[p]
            if (typeof value === 'string') {
              setTimeout(() => {
                deleteModel(p)
                const finalPath = p.replace(path + '/', newPath + '/')
                createOrUpdateModel(finalPath, value || '')
                filesRef.current[finalPath] = value || ''
              }, 50)
            }
            delete filesRef.current[p]
          }
        })
        setOpenedFiles(pre =>
          pre.map(v => {
            if (v.path.startsWith(path + '/')) {
              v.path = v.path.replace(path + '/', newPath + '/')
            }
            return v
          })
        )

        if (curPathRef.current.startsWith(path + '/')) {
          setTimeout(() => {
            handlePathChange(curPathRef.current.replace(path + '/', newPath + '/'))
          }, 50)
        }
      },
      [handlePathChange, addFolder]
    )

    const [filelistWidth, setFilelistWidth] = useState(180)

    const dragStartRef = useRef<{
      pageX: number
      width: number
      start: boolean
    }>({
      pageX: 0,
      width: 0,
      start: false,
    })

    const handleMoveStart = useCallback(
      (e:any) => {
        dragStartRef.current = {
          pageX: e.pageX,
          width: filelistWidth,
          start: true,
        }
      },
      [filelistWidth]
    )

    const handleMove = useCallback((e:any) => {
      if (dragStartRef.current.start) {
        setFilelistWidth(
          dragStartRef.current.width + (e.pageX - dragStartRef.current.pageX)
        )
      }
    }, [])

    const handleMoveEnd = useCallback((e:any) => {
      dragStartRef.current = {
        pageX: e.pageX,
        width: 0,
        start: false,
      }
    }, [])

    const rootRef = useRef(null)

    const styles = useMemo(
      () => ({
        width: `${filelistWidth}px`,
      }),
      [filelistWidth]
    )

    return (
      <div
        ref={rootRef}
        id='goblet-monaco-editor-root'
        tabIndex={1}
        onKeyDown={dealKey}
        onMouseMove={handleMove}
        onMouseUp={handleMoveEnd}
        className='goblet-monaco-editor'
      >
        <FileList
          rootEl={rootRef.current}
          onEditFileName={editFileName}
          onDeleteFile={deleteFile}
          onAddFile={addFile}
          onAddFolder={addFolder}
          onDeleteFolder={deleteFolder}
          onEditFolderName={editFolderName}
          style={styles}
          title='Goblet Editor'
          currentPath={curPath}
          defaultFiles={defaultFiles}
          onPathChange={handlePathChange}
        />
        <div onMouseDown={handleMoveStart} className='goblet-monaco-editor-drag' />
        <div className='goblet-monaco-editor-area'>
          <OpenedTab
            onCloseOtherFiles={closeOtherFiles}
            onSaveFile={saveFile}
            onAbortSave={abortFileChange}
            rootEl={rootRef.current}
            currentPath={curPath}
            openedFiles={openedFiles}
            onCloseFile={onCloseFile}
            onPathChange={handlePathChange}
          />
          <div ref={editorNodeRef} style={{ flex: 1, width: '100%' }} />
          {openedFiles.length === 0 && (
            <div className='goblet-monaco-editor-area-empty'>
              <div>Goblet Editor</div>
            </div>
          )}
        </div>
      </div>
    )
  }
)

export default MultiEditorComp

MultiEditorComp.displayName = 'MultiEditorComp'
