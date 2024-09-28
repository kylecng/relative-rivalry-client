import { useCallback, useEffect, useState, useRef } from 'react'
// eslint-disable-next-line react/no-deprecated
import { createPortal, unmountComponentAtNode } from 'react-dom'

// Creates function getLatestState,
// for when most up-to-date state is required for requests
// (API calls, background messages, etc.)
export const useExtendedState = (initialState) => {
  const [state, setState] = useState(initialState)
  const getLatestState = () =>
    new Promise((resolve) => {
      setState((s) => {
        resolve(s)
        return s
      })
    })
  return [state, setState, getLatestState]
}

// Render components outside of parent DOM
export const usePortal = (el) => {
  const [portal, setPortal] = useState({
    render: () => null,
    remove: () => null,
  })

  const getPortal = useCallback((el) => {
    const Portal = ({ children }) => createPortal(children, el)
    const remove = () => unmountComponentAtNode(el)
    return { render: Portal, remove }
  }, [])

  useEffect(() => {
    if (el) portal.remove()
    const newPortal = getPortal(el)
    setPortal(newPortal)
    return () => newPortal.remove(el)
  }, [el])

  return portal.render
}

export const useDidMount = () => {
  const isMountRef = useRef(true)
  useEffect(() => {
    isMountRef.current = false
  }, [])
  return isMountRef.current
}

export const useClickOutside = (ref, onClickOutside) => {
  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        onClickOutside()
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [ref, onClickOutside])
}

export const useLog = (value, name = '') => {
  useEffect(() => console['log'](name, value), [value])
}
