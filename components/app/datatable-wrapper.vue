<template>
  <div class="table__container">
    <!-- Top section for any content (e.g., search, filters, actions) -->
    <div class="mb-4 flex justify-between items-center">
      <slot name="left" />
      <slot name="right" />
    </div>
    
    <!-- Wrapper for table with horizontal scroll -->
    <div class="table__wrapper">
      <slot name="table" :tableData="tableData" />
    </div>

    <!-- Footer section for pagination or any other content -->
    <slot name="footer" :currentPage="currentPage" :totalPages="totalPages" @updatePage="updatePage" />
  </div>
</template>

<script setup lang="ts">
// Define props for table data, pagination, and columns
interface Column {
  label: string;
  key: string;
}

const props = defineProps<{
  columns: Column[];
  tableData: any[];
  currentPage: number;
  totalPages: number;
  updatePage: (page: number) => void;
}>();

// Emit page updates from parent
const updatePage = (page: number) => {
  props.updatePage(page);
};
</script>

<style lang="scss" scoped>
.table__container {
  width: 100%;
  padding: 0rem;
  background-color: transparent;
}

.table__wrapper {
  overflow-x: auto;
  // Make sure the table wrapper has a scrollbar when needed
  &::-webkit-scrollbar {
    height: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #b0bec5;
    border-radius: 10px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background-color: #90a4ae;
  }

  &::-webkit-scrollbar-track {
    background-color: #e0e0e0;
  }
}
</style>
