<template>
  <div class="relative">
    <button
      ref="menuButton"
      class="p-1.5 border shadow-sm rounded-md text-gray-400 hover:text-gray-600 focus:outline-none "
      @click="toggleMenu"
    >
      <svg
        class="h-6 w-6"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
        />
      </svg>
    </button>
    <div
      v-if="isMenuOpen"
      class="origin-top-right absolute right-0 mt-2 w-24 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10"
      role="menu"
      aria-orientation="vertical"
      aria-labelledby="menu-button"
      tabindex="-1"
    >
      <a
        href="#"
        class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
        role="menuitem"
        tabindex="-1"
        id="menu-item-0"
        @click="closeMenu"
      >
        Option 1
      </a>
      <a
        href="#"
        class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
        role="menuitem"
        tabindex="-1"
        id="menu-item-1"
        @click="closeMenu"
      >
        Option 2
      </a>
      <a
        href="#"
        class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
        role="menuitem"
        tabindex="-1"
        id="menu-item-2"
        @click="closeMenu"
      >
        Option 3
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const menuButton = ref<HTMLButtonElement | null>(null);
const isMenuOpen = ref(false);

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

const closeMenu = () => {
  isMenuOpen.value = false;
};
</script>
