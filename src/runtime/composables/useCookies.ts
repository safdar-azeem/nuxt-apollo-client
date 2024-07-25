import JSCookies from 'js-cookie'
import { NuxtApollo } from '#apollo'

interface CookieAttributes {
  expires?: number | Date | undefined
  path?: string | undefined
  domain?: string | undefined
  secure?: boolean | undefined
  sameSite?: 'strict' | 'Strict' | 'lax' | 'Lax' | 'none' | 'None' | undefined
  [property: string]: any
}

type TokenParams = {
  key?: string
  token: string
  options?: CookieAttributes
}

const getKey = (key: string) => {
  return key || NuxtApollo?.tokenKey || 'token'
}

export const setToken = (...args: [TokenParams] | [string, string?, CookieAttributes?]): void => {
  const {
    key = '',
    token,
    options = {},
  } = typeof args[0] === 'object'
    ? args[0]
    : { token: args[0], key: args[1] || '', options: args[2] || {} }

  const finalOptions: CookieAttributes = { expires: 1, ...options }

  JSCookies.set(getKey(key), token, finalOptions)
}

export const getToken = (key = '') => {
  return JSCookies.get(getKey(key))
}

export const removeToken = (key = '', options?: CookieAttributes) => {
  JSCookies.remove(getKey(key), options)
}
