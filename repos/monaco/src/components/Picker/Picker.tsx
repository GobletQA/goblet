import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Menu } from './Menu'
import Arrow from '../Icons/Arrow'
import { Position } from './Position'
import './index.css'

const instance = document.createElement('div')
instance.className = 'goblet-monaco-editor-picker-items'

export type TPicker = {
  defaultValue?: any
  onChange?: (value: any) => void
  getContainer?: () => HTMLElement
  children?: React.ReactNode
  Menu: typeof Menu
}

export const Picker = ({
  children,
  getContainer,
  defaultValue,
  onChange = () => ({}),
}: TPicker) => {
  const [visible, setVisible] = useState(false)
  const [data, setData] = useState({ value: defaultValue, label: '' })
  const targetRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!children) return
    const childs = React.Children.toArray(children)
    for (let i = 0; i < childs.length; i++) {
      const child = childs[i]
      if (React.isValidElement(child)) {
        if (child.props.value === defaultValue) {
          setData(child.props)
          break
        }
      }
    }
  }, [defaultValue])

  useEffect(() => {
    return () => {
      document.body.contains(instance)
        && document.body.removeChild(instance)
    }
  }, [])

  useEffect(() => {
    const hide = () => setVisible(false)
    visible ? document.body.addEventListener('click', hide) : document.body.removeEventListener('click', hide)

    return () => document.body.removeEventListener('click', hide)
  }, [visible])

  const handleSelect = useCallback(
    (data:any) => {
      setData(data)
      onChange && onChange(data)
      setVisible(false)
    },
    [onChange]
  )

  return (
    <React.Fragment>
      <div ref={targetRef} className='goblet-monaco-editor-picker'>
        <div
          className='goblet-monaco-editor-picker-content'
          onClick={e => {
            e.stopPropagation()
            setVisible(pre => !pre)
          }}
        >
          {data.label}
          <div className='goblet-monaco-editor-picker-content-arrow'>
            <Arrow collapse={!visible} />
          </div>
        </div>
      </div>
      {visible && (
        <Position instance={instance} targetRef={targetRef} getContainer={getContainer}>
          {React.Children.toArray(children).map(child =>
            React.isValidElement(child)
              ? React.cloneElement(child, {
                // @ts-ignore
                defaultValue: data.value,
                handleSelect,
              })
              : child
          )}
        </Position>
      )}
    </React.Fragment>
  )
}

Picker.Menu = Menu

