import type { ToastServiceMethods } from 'primevue/toastservice'

declare module '#app' {
  interface NuxtApp {
    $toast: ToastServiceMethods
  }

  interface ComponentCustomProperties {
    $toast: ToastServiceMethods
  }
}
