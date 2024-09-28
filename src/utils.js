import { isError, isNumber, isObject, isString, toString } from 'lodash'

export const IS_DEV_MODE = import.meta.env.DEV

export const trySilent = (func) => {
  try {
    func()
    return true
  } catch {
    /* empty */
  }
}

export const tryReturn = (func) => {
  try {
    return func()
  } catch {
    /* empty */
  }
}

export const tryReturnDev = (func) => {
  try {
    return func()
  } catch (err) {
    devErr(err)
  }
}

// Print only during dev
export const devLog = (...args) => {
  if (IS_DEV_MODE) {
    const callerInfo = new Error().stack.split('\n')[2].trim()
    console['log'](`%c${callerInfo}\n`, 'color: blue; font-weight: bold;', ...args)
  }
}

// Print only during dev
export const devErr = (...args) => {
  if (IS_DEV_MODE) {
    const callerInfo = new Error().stack.split('\n')[2].trim()
    console['error'](`%c${callerInfo}\n`, 'color: red; font-weight: bold;', ...args)
  }
}

// Print only during dev
export const devInfo = (...args) => {
  if (IS_DEV_MODE) {
    const callerInfo = new Error().stack.split('\n')[2].trim()
    console['info'](`%c${callerInfo}\n`, 'color: green; font-weight: bold;', ...args)
  }
}

// Parse any error into string
export const getErrStr = (error) => {
  if (error) trySilent(() => devErr(error))
  let doBreak = false
  let numLoops = 0
  while (!doBreak && numLoops < 20) {
    numLoops += 1
    if (isError(error)) {
      error = error.toString()
    } else if (isString(error)) {
      error = error.trim()
      if (error.startsWith('Error:')) {
        error = error.replace(/^\s*Error:\s*/, '')
      }
      try {
        error = JSON.parse(error)
      } catch {
        break
      }
    } else if (isObject(error)) {
      error =
        error?.error ||
        error?.detail ||
        error?.message ||
        (() => {
          doBreak = true
          return error
        })
    } else break
  }

  if (isString(error)) return error
  try {
    return JSON.stringify(error)
  } catch {
    return error.toString() || ''
  }
}

// Apply functions to input in order
export const pipe = (...fns) => {
  return fns.reduce((f, g) => (x) => g(f(x)))
}

export const stripTags = (s) => {
  return toString(s)
    .replace(/(<([^>]+)>)/gi, '')
    .trim()
}

export const isValidNumber = (value) =>
  isNumber(value) && !Number.isNaN(value) && Number.isFinite(value)

export const isNumeric = (value) => {
  if (isValidNumber(value)) return true
  const numberValue = Number(value)
  return !isNaN(numberValue) && isFinite(numberValue)
}

export const toCamelCase = (text) => {
  return text
    .replace(/[^a-zA-Z0-9\s_-]+/g, '')
    .split(/[\s_-]+/)
    .map((word, index) => {
      if (index === 0) {
        return word.toLowerCase()
      }

      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    })
    .join('')
}
