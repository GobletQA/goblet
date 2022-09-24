import React, { useEffect, useRef } from 'react'
import ReactDOM from 'react-dom'
import { createRoot } from 'react-dom/client'
import Close from '../icons/close'
import Button from '../button'
import './index.css'

interface Props {
  target?: HTMLElement | null
  visible?: boolean
  onClose?: (...args: any[]) => void
  destroyOnClose?: boolean
  children: any
}
interface ModalInterface extends React.FC<Props> {
  create: (...args: any[]) => any
  confirm: (...args: any[]) => any
}

const Modal: ModalInterface = (props: any) => {
  const elRef = useRef<HTMLDivElement>(document.createElement('div'))

  useEffect(() => {
    const rootEl = props.target || document.body
    if (props.visible) {
      rootEl && rootEl.appendChild(elRef.current)
    }
    else {
      rootEl && rootEl.contains(elRef.current) && rootEl.removeChild(elRef.current)
    }
  }, [props.visible])

  return ReactDOM.createPortal(
    <div className='goblet-monaco-editor-modal'>
      <div
        className='goblet-monaco-editor-modal-mask'
        onClick={() => props.onClose && props.onClose()}
      />
      <div className='goblet-monaco-editor-modal-content'>
        {props.destroyOnClose && !props.visible ? null : props.children}
      </div>
    </div>,
    elRef.current
  )
}

Modal.create = (props: any) => {
  const el = document.createElement('div')

  function close() {
    rootEl && rootEl.contains(el) && rootEl.removeChild(el)
  }

  const root = createRoot(el)
  root.render(
    <div className={`goblet-monaco-editor-modal ${props.className || ''}`}>
      <div className='goblet-monaco-editor-modal-mask' onClick={close} />
      <div className='goblet-monaco-editor-modal-content'>{props.content(close)}</div>
    </div>
  )

  const rootEl = props.target || document.body
  rootEl && rootEl.appendChild(el)

  return {
    close: () => {
      rootEl && rootEl.contains(el) && rootEl.removeChild(el)
    },
  }
}

Modal.confirm = (props: any) => {
  const el = document.createElement('div')

  function close() {
    rootEl && rootEl.contains(el) && rootEl.removeChild(el)
  }

  const root = createRoot(el)
  root.render(
    <div className={`goblet-monaco-editor-modal ${props.className || ''}`}>
      <div className='goblet-monaco-editor-modal-mask' onClick={close} />
      <div className='goblet-monaco-editor-modal-content goblet-monaco-editor-modal-content-confirm'>
        {props.title && (
          <div className='goblet-monaco-editor-modal-content-title'>{props.title}</div>
        )}
        <div className='goblet-monaco-editor-modal-content-content'>
          {props.content(close)}
        </div>
        <div className='goblet-monaco-editor-modal-content-footer'>
          <Button
            onClick={() => {
              if (props.onCancel) {
                props.onCancel(close)
              }
              else {
                close()
              }
            }}
          >
            {props.cancelText || 'Cancel'}
          </Button>
          <Button
            onClick={() => {
              props.onOk && props.onOk(close)
            }}
            type='primary'
            style={{ marginLeft: '4px' }}
          >
            {props.okText || 'OK'}
          </Button>
        </div>
        <div className='goblet-monaco-editor-modal-content-close' onClick={close}>
          <Close
            style={{
              width: '12px',
              height: '12px',
            }}
          />
        </div>
      </div>
    </div>
  )

  const rootEl = props.target || document.body
  rootEl && rootEl.appendChild(el)

  return {
    close: () => {
      rootEl && rootEl.contains(el) && rootEl.removeChild(el)
    },
  }
}

export default Modal
