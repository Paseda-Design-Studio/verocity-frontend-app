<script setup lang="ts">
  interface Props {
    visible: boolean
    modal?: boolean
    closable?: boolean
    width?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl'
    position?: 'center' | 'top' | 'bottom'
    showHeader?: boolean
    showFooter?: boolean
    headerClass?: string
    contentClass?: string
    footerClass?: string
    closeOnOverlay?: boolean
    loading?: boolean
    ariaLabel?: string
    ariaLabelledby?: string
  }

  const props = withDefaults(defineProps<Props>(), {
    modal: true,
    closable: true,
    width: 'lg',
    position: 'center',
    showHeader: false,
    showFooter: false,
    headerClass: '',
    contentClass: '',
    footerClass: '',
    closeOnOverlay: true,
    loading: false
  })

  const dialogRef = ref<HTMLElement | null>(null)
  const ariaLabel = computed(() => props.ariaLabel || undefined)
  const ariaLabelledby = computed(() => props.ariaLabelledby || undefined)

  const emit = defineEmits<{
    'update:visible': [value: boolean]
    'close': []
    'open': []
  }>()

  const handleClose = () => {
    if (props.closable && !props.loading) {
      emit('update:visible', false)
      emit('close')
    }
  }

  const handleOverlayClick = (event: MouseEvent) => {
    if (props.closeOnOverlay && event.target === event.currentTarget) {
      handleClose()
    }
  }

  const handleOpen = () => {
    emit('open')
  }

  // Watch for modal opening/closing
  watch(() => props.visible, (newValue) => {
    if (newValue) {
      handleOpen()
      document.body.classList.add('modal-open')
    } else {
      document.body.classList.remove('modal-open')
    }
  })

  // Handle escape key
  const handleEscape = (event: KeyboardEvent) => {
    if (event.key === 'Escape' && props.visible && props.closable && !props.loading) {
      handleClose()
    }
  }

  onMounted(() => {
    document.addEventListener('keydown', handleEscape)
  })

  onUnmounted(() => {
    document.removeEventListener('keydown', handleEscape)
    document.body.classList.remove('modal-open')
  })
</script>

<template>
  <Teleport to="body">
    <Transition name="modal-overlay" appear>
      <div v-if="visible" :class="[
        'modal',
        `modal--${width}`,
        `modal--${position}`,
        { 'modal--loading': loading }
      ]" @click="handleOverlayClick">
        <Transition name="modal-dialog" appear>
          <div v-if="visible" class="modal__dialog" @click.stop role="dialog" aria-modal="true" :aria-label="ariaLabel"
            :aria-labelledby="ariaLabelledby" tabindex="-1" ref="dialogRef">
            <button v-if="closable && !showHeader && !$slots.header && !loading" @click="handleClose"
              class="modal__close" type="button" aria-label="Close modal">
              <AppIcon name="close" filled />
            </button>

            <div v-if="showHeader || $slots.header" :class="[
              'modal__header',
              headerClass
            ]">
              <slot name="header" />
            </div>

            <div :class="[
              'modal__body',
              contentClass,
              {
                'modal__body--no-header': !showHeader && !$slots.header,
                'modal__body--no-footer': !showFooter && !$slots.footer
              }
            ]">
              <slot />
            </div>

            <div v-if="showFooter || $slots.footer" :class="[
              'modal__footer',
              footerClass
            ]">
              <slot name="footer" />
            </div>

            <div v-if="loading" class="modal__loading">
              <div class="modal__spinner">
                <svg class="modal__spinner-icon" viewBox="0 0 24 24">
                  <circle class="modal__spinner-track" cx="12" cy="12" r="10" />
                  <circle class="modal__spinner-fill" cx="12" cy="12" r="10" />
                </svg>
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
  :global(.modal-open) {
    overflow: hidden;
  }

  .modal {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(4px);
    z-index: 9000;
    /* Reduced from 9999 to allow PrimeVue dropdowns */
    display: flex;
    padding: 1rem;
    overflow-y: auto;
  }

  .modal__dialog {
    position: relative;
    width: 100%;
    background: #ffffff;
    border-radius: 0.75rem;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.4);
    max-height: 90vh;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    margin: auto;
    z-index: 9001;
  }

  .modal__close {
    position: absolute;
    top: 1rem;
    right: 1rem;
    z-index: 9002;
    padding: 0.5rem;
    color: #9ca3af;
    background: #ffffff;
    border: none;
    border-radius: 0.5rem;
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .modal__close:hover {
    color: #4b5563;
    background-color: #f3f4f6;
    transform: scale(1.05);
  }

  .modal__close:focus {
    outline: none;
    ring: 2px solid #3b82f6;
    ring-offset: 2px;
  }

  .modal__header {
    flex-shrink: 0;
    padding: 1.5rem 1.5rem 0 1.5rem;
    position: relative;
    z-index: 1;
  }

  .modal__body {
    flex: 1;
    overflow-y: auto;
    padding: 1.5rem;
    scrollbar-width: thin;
    scrollbar-color: rgba(156, 163, 175, 0.5) transparent;
    position: relative;
    z-index: 1;
  }

  .modal__body::-webkit-scrollbar {
    width: 6px;
  }

  .modal__body::-webkit-scrollbar-track {
    background: transparent;
  }

  .modal__body::-webkit-scrollbar-thumb {
    background-color: rgba(156, 163, 175, 0.5);
    border-radius: 3px;
  }

  .modal__body::-webkit-scrollbar-thumb:hover {
    background-color: rgba(156, 163, 175, 0.7);
  }

  .modal__body--no-header {
    padding-top: 1.5rem;
  }

  .modal__body--no-footer {
    padding-bottom: 1.5rem;
  }

  .modal__footer {
    flex-shrink: 0;
    padding: 0 1.5rem 1.5rem 1.5rem;
    position: relative;
    z-index: 1;
  }

  .modal__loading {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(255, 255, 255, 0.9);
    backdrop-filter: blur(2px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9003;
  }

  .modal__spinner {
    width: 3rem;
    height: 3rem;
  }

  .modal__spinner-icon {
    width: 100%;
    height: 100%;
    animation: modal-spin 1s linear infinite;
  }

  .modal__spinner-track {
    fill: none;
    stroke: #e5e7eb;
    stroke-width: 2;
  }

  .modal__spinner-fill {
    fill: none;
    stroke: #3b82f6;
    stroke-width: 2;
    stroke-linecap: round;
    stroke-dasharray: 31.416;
    stroke-dashoffset: 31.416;
    animation: modal-spinner 1.5s ease-in-out infinite;
  }

  /* Width Sizes */
  .modal--xs .modal__dialog {
    max-width: 24rem;
  }

  .modal--sm .modal__dialog {
    max-width: 32rem;
  }

  .modal--md .modal__dialog {
    max-width: 42rem;
  }

  .modal--lg .modal__dialog {
    max-width: 56rem;
  }

  .modal--xl .modal__dialog {
    max-width: 72rem;
  }

  .modal--2xl .modal__dialog {
    max-width: 80rem;
  }

  .modal--3xl .modal__dialog {
    max-width: 96rem;
  }

  .modal--4xl .modal__dialog {
    max-width: 112rem;
  }

  /* Position */
  .modal--center {
    align-items: center;
    justify-content: center;
  }

  .modal--top {
    align-items: flex-start;
    justify-content: center;
    padding-top: 4rem;
  }

  .modal--bottom {
    align-items: flex-end;
    justify-content: center;
    padding-bottom: 4rem;
  }

  /* Loading State */
  .modal--loading .modal__close {
    pointer-events: none;
    opacity: 0.5;
  }

  /* Transitions */
  .modal-overlay-enter-active,
  .modal-overlay-leave-active {
    transition: opacity 0.3s ease;
  }

  .modal-overlay-enter-from,
  .modal-overlay-leave-to {
    opacity: 0;
  }

  .modal-dialog-enter-active {
    transition: all 0.3s ease-out;
  }

  .modal-dialog-leave-active {
    transition: all 0.2s ease-in;
  }

  .modal-dialog-enter-from {
    opacity: 0;
    transform: scale(0.95) translateY(1rem);
  }

  .modal-dialog-leave-to {
    opacity: 0;
    transform: scale(0.95) translateY(1rem);
  }

  /* Animations */
  @keyframes modal-spin {
    to {
      transform: rotate(360deg);
    }
  }

  @keyframes modal-spinner {
    0% {
      stroke-dasharray: 0 31.416;
    }

    50% {
      stroke-dasharray: 15.708 15.708;
    }

    100% {
      stroke-dasharray: 31.416 0;
    }
  }

  /* Responsive Design */
  @media (max-width: 1024px) {

    .modal--3xl .modal__dialog,
    .modal--4xl .modal__dialog {
      max-width: calc(100vw - 2rem);
    }
  }

  @media (max-width: 768px) {

    .modal--lg .modal__dialog,
    .modal--xl .modal__dialog,
    .modal--2xl .modal__dialog {
      max-width: calc(100vw - 2rem);
    }
  }

  @media (max-width: 640px) {
    .modal {
      padding: 0.5rem;
    }

    .modal--xs .modal__dialog,
    .modal--sm .modal__dialog,
    .modal--md .modal__dialog,
    .modal--lg .modal__dialog,
    .modal--xl .modal__dialog,
    .modal--2xl .modal__dialog,
    .modal--3xl .modal__dialog,
    .modal--4xl .modal__dialog {
      max-width: calc(100vw - 1rem);
    }

    .modal__dialog {
      max-height: 95vh;
    }

    .modal__header,
    .modal__body,
    .modal__footer {
      padding-left: 1rem;
      padding-right: 1rem;
    }

    .modal__body {
      padding-top: 1rem;
      padding-bottom: 1rem;
    }

    .modal__header {
      padding-bottom: 0;
    }

    .modal__footer {
      padding-top: 0;
    }
  }

  @media (max-width: 480px) {
    .modal {
      padding: 0.25rem;
    }

    .modal__close {
      top: 0.75rem;
      right: 0.75rem;
      padding: 0.375rem;
    }
  }

  /* High Contrast Mode Support */
  @media (prefers-contrast: high) {
    .modal {
      background-color: rgba(0, 0, 0, 0.8);
    }

    .modal__dialog {
      border: 2px solid #000000;
    }

    .modal__close {
      border: 1px solid #000000;
    }
  }

  /* Reduced Motion Support */
  @media (prefers-reduced-motion: reduce) {

    .modal-overlay-enter-active,
    .modal-overlay-leave-active,
    .modal-dialog-enter-active,
    .modal-dialog-leave-active {
      transition: none;
    }

    .modal__close {
      transition: none;
    }

    .modal__spinner-icon {
      animation: none;
    }

    .modal__spinner-fill {
      animation: none;
      stroke-dasharray: 15.708 15.708;
    }
  }

  /* Focus Management */
  .modal__dialog:focus {
    outline: none;
  }

  /* Print Styles */
  @media print {
    .modal {
      display: none;
    }
  }
</style>
