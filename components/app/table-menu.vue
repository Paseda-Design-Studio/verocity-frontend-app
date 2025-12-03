<template>
  <div class="relative flex justify-center items-center text-left">
    <button ref="menuButton" :class="[
      'flex items-center justify-center border border-gray-200 bg-white w-9 h-9 text-sm rounded font-medium text-gray-700 shadow-sm transition-colors duration-200',
      'hover:bg-gray-50 hover:border-gray-400',
      'disabled:opacity-50 disabled:cursor-not-allowed',
      buttonClass
    ]" :disabled="disabled" @click="toggleMenu" :aria-expanded="isMenuOpen" :aria-haspopup="true">
      <slot name="trigger">
        <app-icon name="kebab_menu" filled class="w-4 h-4"
          style="display: flex; align-items: center; justify-content: center;" />
      </slot>
    </button>

    <Teleport to="body">
      <Transition enter-active-class="transition ease-out duration-100" enter-from-class="transform opacity-0 scale-95"
        enter-to-class="transform opacity-100 scale-100" leave-active-class="transition ease-in duration-75"
        leave-from-class="transform opacity-100 scale-100" leave-to-class="transform opacity-0 scale-95">
        <div v-if="isMenuOpen" ref="menuPanel" :class="[
          'absolute z-50 mt-2 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none',
          menuPosition,
          'w-max'
        ]" :style="menuStyles" role="menu" aria-orientation="vertical" tabindex="-1">

          <div class="py-1">
            <!-- View Option - Changed from NuxtLink to button -->
            <button
              class="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors duration-150 focus:outline-none focus:bg-gray-100"
              role="menuitem" 
              @click="handleAction('view')">
              <span class="flex-1">View</span>
            </button>

            <!-- Edit Option - Changed from NuxtLink to button -->
            <button
              v-if="editable"
              class="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors duration-150 focus:outline-none focus:bg-gray-100"
              role="menuitem" 
              @click="handleAction('edit')">
              <span class="flex-1">Edit</span>
            </button>

            <!-- Divider -->
            <hr class="my-1 border-gray-200" v-if="deletable" />

            <!-- Delete Option -->
            <button v-if="deletable"
              class="flex w-full items-center px-4 py-2 text-sm text-red-700 hover:bg-red-50 hover:text-red-900 transition-colors duration-150 focus:outline-none focus:bg-red-50"
              role="menuitem" @click="handleAction('delete')">
              <span class="flex-1">Delete</span>
            </button>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Invisible overlay to close menu when clicking outside -->
    <div v-if="isMenuOpen" class="fixed inset-0 z-40" @click="closeMenu" aria-hidden="true" />
  </div>
</template>

<script setup lang="ts">
  interface Props {
    disabled?: boolean
    placement?: 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end'
    width?: 'sm' | 'md' | 'lg' | 'xl'
    buttonClass?: string
    deletable?: boolean
    editable?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    disabled: false,
    placement: 'bottom-end',
    width: 'sm',
    buttonClass: '',
    deletable: true,
    editable: true,
  })

  const emit = defineEmits<{
    open: []
    close: []
    view: []
    edit: []
    delete: []
  }>()

  const menuButton = ref<HTMLButtonElement | null>(null)
  const menuPanel = ref<HTMLDivElement | null>(null)
  const isMenuOpen = ref(false)
  const menuStyles = ref({})

  const menuWidth = computed(() => {
    const widths = {
      sm: 'w-32',
      md: 'w-48',
      lg: 'w-56',
      xl: 'w-64'
    }
    return widths[props.width]
  })

  const menuPosition = computed(() => {
    const positions = {
      'bottom-start': 'origin-top-left left-0',
      'bottom-end': 'origin-top-right right-0',
      'top-start': 'origin-bottom-left left-0',
      'top-end': 'origin-bottom-right right-0'
    }
    return positions[props.placement]
  })

  const toggleMenu = async () => {
    if (props.disabled) return

    isMenuOpen.value = !isMenuOpen.value

    if (isMenuOpen.value) {
      emit('open')
      await nextTick()
      calculateMenuPosition()
    } else {
      emit('close')
    }
  }

  const closeMenu = () => {
    if (isMenuOpen.value) {
      isMenuOpen.value = false
      emit('close')
    }
  }

  const handleAction = (action: 'view' | 'edit' | 'delete') => {
    // Emit the action event
    if (action === 'view') {
      emit('view')
    } else if (action === 'edit') {
      emit('edit')
    } else if (action === 'delete') {
      emit('delete')
    }
    
    closeMenu()
  }

  const calculateMenuPosition = () => {
    if (!menuButton.value || !menuPanel.value) return

    const buttonRect = menuButton.value.getBoundingClientRect()
    const menuRect = menuPanel.value.getBoundingClientRect()
    const viewport = {
      width: window.innerWidth,
      height: window.innerHeight
    }

    let top = buttonRect.bottom + window.scrollY
    let left = buttonRect.right + window.scrollX - menuRect.width

    // Adjust if menu goes off screen
    if (left < 0) {
      left = buttonRect.left + window.scrollX
    }

    if (top + menuRect.height > viewport.height + window.scrollY) {
      top = buttonRect.top + window.scrollY - menuRect.height
    }

    menuStyles.value = {
      position: 'absolute',
      top: `${top}px`,
      left: `${left}px`
    }
  }

  const handleEscape = (event: KeyboardEvent) => {
    if (event.key === 'Escape' && isMenuOpen.value) {
      closeMenu()
      menuButton.value?.focus()
    }
  }

  onMounted(() => {
    document.addEventListener('keydown', handleEscape)
  })

  onUnmounted(() => {
    document.removeEventListener('keydown', handleEscape)
  })

  // Expose methods for parent components
  defineExpose({
    open: () => { isMenuOpen.value = true },
    close: closeMenu,
    toggle: toggleMenu,
    isOpen: computed(() => isMenuOpen.value)
  })
</script>

<style scoped></style>
