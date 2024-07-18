import JSCookies from 'js-cookie'
import { NuxtApollo } from '#apollo'

const getKey = (key: string) => {
  return key || NuxtApollo?.tokenKey || 'token'
}

export const setToken = ({ key = '', token, expires = 1 }) => {
  JSCookies.set(getKey(key), token, { expires: expires })
}

export const getToken = (key = '') => {
  return JSCookies.get(getKey(key))
}

export const removeToken = (key = '') => {
  JSCookies.remove(getKey(key))
}
