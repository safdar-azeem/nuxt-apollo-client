import JSCookies from 'js-cookie'
import { NuxtApollo } from '#apollo'
import { useNuxtApp } from '#app'
import { onMounted, onUnmounted } from 'vue'

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
  const nuxtApp = useNuxtApp()
  return key || NuxtApollo?.tokenKey || (nuxtApp?.tokenKey as any) || 'token'
}

export const setToken = (...args: [TokenParams] | [string, string?, CookieAttributes?]): void => {
  const {
    key = '',
    token,
    options = {},
  } = typeof args[0] === 'object'
    ? args[0]
    : { token: args[0], key: args[1] || '', options: args[2] || {} }

  const EXPIRATION_MINUTES =
    options?.expires ||
    NuxtApollo?.tokenExpiration ||
    new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)

  const finalOptions: CookieAttributes = { ...options, expires: EXPIRATION_MINUTES }

  JSCookies.set(getKey(key), token, finalOptions)
}

export const getToken = (key = '') => {
  return JSCookies.get(getKey(key))
}

export const removeToken = (key = '', options?: CookieAttributes) => {
  JSCookies.remove(getKey(key), options)
}

const ACTIVITY_EVENTS = ['click', 'mousemove', 'keydown', 'scroll']

export const useKeepCookieAlive = (debounceInterval = 10000) => {
  const DEBOUNCE_INTERVAL_MS = debounceInterval

  let lastRun = 0
  let timeout = null

  const refreshToken = () => {
    const now = Date.now()
    const elapsed = now - lastRun

    if (elapsed >= DEBOUNCE_INTERVAL_MS) {
      const token = getToken()
      if (token) {
        setToken({ token })
        lastRun = now
      }
    } else if (!timeout) {
      timeout = setTimeout(() => {
        const token = getToken()
        if (token) {
          setToken({ token })
          lastRun = Date.now()
        }
        timeout = null
      }, DEBOUNCE_INTERVAL_MS - elapsed)
    }
  }

  const registerListeners = () => {
    ACTIVITY_EVENTS.forEach((event) =>
      window.addEventListener(event, refreshToken, { passive: true })
    )
  }

  const removeListeners = () => {
    ACTIVITY_EVENTS.forEach((event) => window.removeEventListener(event, refreshToken))
    if (timeout) {
      clearTimeout(timeout)
      timeout = null
    }
  }

  onMounted(registerListeners)
  onUnmounted(removeListeners)
}
