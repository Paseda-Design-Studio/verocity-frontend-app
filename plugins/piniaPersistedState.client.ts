import { defineNuxtPlugin } from '#app'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

export default defineNuxtPlugin((nuxtApp) => {
  // nuxtApp.$pinia is typed as unknown, so cast it
  const pinia = nuxtApp.$pinia as any
  pinia.use(piniaPluginPersistedstate)
})
