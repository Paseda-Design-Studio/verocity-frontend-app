<!-- CustomDropdown.vue -->
<template>
  <div ref="trigger" @click="toggle" class="dropdown-trigger">
    <slot name="trigger">Select</slot>
  </div>
  <Teleport to="body">
    <ul
      v-if="open"
      class="dropdown-menu"
      :style="menuStyle"
      @click.stop
    >
      <slot />
    </ul>
  </Teleport>
</template>

<script setup lang="ts">
const open = ref(false)
const trigger = ref<HTMLElement | null>(null)
const menuStyle = ref({})

function toggle() {
  open.value = !open.value
  if (open.value && trigger.value) {
    const rect = trigger.value.getBoundingClientRect()
    menuStyle.value = {
      position: 'absolute',
      top: `${rect.bottom + window.scrollY}px`,
      left: `${rect.left + window.scrollX}px`,
      zIndex: 11000,
      minWidth: `${rect.width}px`
    }
  }
}
</script>

<style scoped>
.dropdown-menu {
  background: white;
  border: 1px solid #eee;
  border-radius: 0.5rem;
  box-shadow: 0 8px 24px rgba(0,0,0,0.08);
  z-index: 11000;
}
</style>