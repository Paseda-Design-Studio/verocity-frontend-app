<script setup lang="ts">
import AppIcon from './icon.vue'

const props = defineProps<{
  steps: string[]
  current: number // 0-based index
}>()
</script>

<template>
  <ol class="relative flex items-start justify-between w-full">
    <li
      v-for="(step, idx) in steps"
      :key="step"
      class="flex-1 flex flex-col items-center text-center relative px-1"
    >
      <!-- Connector line -->
      <div
        v-if="idx !== steps.length - 1"
        class="absolute top-3 left-1/2 w-full h-0.5 z-0 transition-colors duration-500 ease-in-out"
        :class="idx < props.current ? 'bg-primary' : 'bg-gray-200'"
      ></div>

      <!-- Step icon with animation -->
      <div class="z-10">
        <span
          class="w-6 h-6 flex items-center justify-center rounded-full transform transition-all duration-300 ease-in-out"
          :class="{
            'bg-white text-primary scale-100': idx <= props.current,
            'bg-gray-50 text-gray-400 scale-90': idx > props.current,
          }"
        >
          <template v-if="idx < props.current">
            <AppIcon name="checked-circle" filled class="w-6 h-6 transition-opacity duration-300 opacity-100" />
          </template>
          <template v-else>
            <AppIcon name="circle-dot" :filled="true" class="w-6 h-6 transition-opacity duration-300 opacity-80" />
          </template>
        </span>
      </div>

      <!-- Step label -->
      <div
        class="mt-2 text-xs sm:text-sm max-w-[6rem] break-words font-semibold transition-colors duration-300"
        :class="{
          'text-primary': idx <= props.current,
          'text-gray-900': idx > props.current,
        }"
      >
        {{ step }}
      </div>
    </li>
  </ol>
</template>
