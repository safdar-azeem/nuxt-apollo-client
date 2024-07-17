import JSCookies from 'js-cookie'
import { useNuxtApp } from '#app'

export const setToken = ({ key = '', token, expires = 1 / 720 }) => {
  const tokenKey = key || (useNuxtApp()['tokenKey'] as string)

  JSCookies.set(tokenKey, token, { expires: expires })
}

export const getToken = (key = '') => {
  const tokenKey = key || (useNuxtApp()['tokenKey'] as string)
  return JSCookies.get(tokenKey)
}

export const removeToken = (key = '') => {
  const tokenKey = key || (useNuxtApp()['tokenKey'] as string)
  JSCookies.remove(tokenKey)
}
