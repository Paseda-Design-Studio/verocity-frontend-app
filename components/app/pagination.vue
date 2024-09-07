<template>
    <div class="flex justify-between items-center py-4">
      <!-- Page info on the left -->
      <div class="text-sm text-gray-700">
        Page {{ currentPage }} of {{ totalPages }}
      </div>
  
      <!-- Pagination buttons on the right -->
      <div class="flex space-x-4">
        <button
          :disabled="currentPage === 1"
          @click="prevPage"
          class="px-4 py-2 bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        <button
          :disabled="currentPage === totalPages"
          @click="nextPage"
          class="px-4 py-2 bg-white hover:bg-gray-300 disabled:bg-gray-100 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { defineProps, defineEmits } from "vue";
  
  // Define props
  const props = defineProps({
    currentPage: {
      type: Number,
      required: true,
    },
    totalPages: {
      type: Number,
      required: true,
    },
  });
  
  // Emit events
  const emit = defineEmits(["updatePage"]);
  
  // Methods to handle page navigation
  const prevPage = () => {
    if (props.currentPage > 1) {
      emit("updatePage", props.currentPage - 1);
    }
  };
  
  const nextPage = () => {
    if (props.currentPage < props.totalPages) {
      emit("updatePage", props.currentPage + 1);
    }
  };
  </script>
  
  <style scoped>
  button {
    border-radius: 4px;
    transition: background-color 0.2s;
  }
  </style>
  