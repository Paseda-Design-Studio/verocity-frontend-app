<script setup>
import { RouterLink } from 'vue-router'

import { sidebarLinks } from '../utils/helper';


const props = defineProps({
  user: {
    type: Object
  }
})

const logout = () => {
  window.sessionStorage.clear()
  router.push('/login')
}
</script>

<template>
  <section class="sidebar">
    <nav class="flex flex-col gap-4">
      <RouterLink to="" class="mb-12 flex items-center cursor-pointer gap-2">
        <img src="/logo/logo.png" alt="Horizon Logo" class="h-16" />
      </RouterLink>

      <RouterLink
        :to="item.route"
        class="sidebar-link"
        v-for="item in sidebarLinks"
        :key="item.label"
      >
        <div class="relative">
          <img src="/icons/home.svg" :alt="item.label" class="w-8" />
        </div>
        <p class="sidebar-label">{{ item.label }}</p>
      </RouterLink>

      <Chip class="py-0 pl-0 pr-4">
        <span class="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center">
          {{ props.user?.name.charAt(0) }}
        </span>
        <span class="ml-2 text-sm font-medium">
          {{ props.user?.membership > 100 ? 'Featured' : 'Standard' }}
        </span>
      </Chip>
    </nav>
    <div class="border-t border-primary p-4">
      <Button
        @click="logout"
        label="Logout"
        class="mb-0 text-white flex gap-2"
        outlined
        severity="danger"
      >
        <img src="/icons/logout.svg" alt="" />
        <span>Logout</span>
      </Button>
    </div>
  </section>
</template>

<style scoped></style>
