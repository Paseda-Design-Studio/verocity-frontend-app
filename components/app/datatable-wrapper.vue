<template>
  <div class="table__container" :data-show-mobile-cards="showMobileCards">
    <!-- Top section for any content (e.g., search, filters, actions) -->
    <div class="table__header">
      <div class="table__header-left">
        <slot name="left" />
      </div>
      <div class="table__header-right">
        <slot name="right" />
      </div>
    </div>
    
    <!-- Wrapper for table with horizontal scroll -->
    <div class="table__wrapper">
      <div class="table__scroll-container">
        <slot name="table" :tableData="tableData" />
      </div>
      
      <!-- Mobile card view for very small screens -->
      <div class="table__mobile-cards">
        <slot name="mobile-cards" :tableData="tableData" :columns="columns" />
      </div>
    </div>

    <!-- Footer section for pagination or any other content -->
    <div v-if="tableData && tableData.length > 0" class="table__footer">
      <slot 
        name="footer" 
        :currentPage="currentPage" 
        :totalPages="totalPages" 
        :updatePage="updatePage"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
// Define props for table data, pagination, and columns
interface Column {
  label: string;
  key: string;
  sortable?: boolean;
  width?: string;
  minWidth?: string;
  hideOnMobile?: boolean;
  hideOnTablet?: boolean;
}

const props = defineProps<{
  columns: Column[];
  tableData: any[];
  currentPage: number;
  totalPages: number;
  updatePage: (page: number) => void;
  showMobileCards?: boolean;
  mobileBreakpoint?: number;
}>();

// Emit page updates from parent
const updatePage = (page: number) => {
  props.updatePage(page);
};

// Provide columns to child components
provide('tableColumns', props.columns);
</script>

<style lang="scss" scoped>
// Using Tailwind breakpoints: sm(640px), md(768px), lg(1024px), xl(1280px), 2xl(1536px)

.table__container {
  width: 100%;
  padding: 0;
  background-color: transparent;
  display: flex;
  flex-direction: column;
  gap: 1rem;

  @media (max-width: 639px) {
    gap: 0.75rem;
  }
}

.table__header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
  flex-wrap: wrap;

  @media (max-width: 639px) {
    flex-direction: column;
    align-items: stretch;
    gap: 0.75rem;
  }

  @media (min-width: 640px) and (max-width: 1023px) {
    gap: 0.75rem;
    align-items: center;
  }

  &-left,
  &-right {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    flex-wrap: wrap;

    @media (max-width: 639px) {
      width: 100%;
      justify-content: stretch;
      
      > * {
        flex: 1;
        min-width: 0;
      }
    }

    @media (min-width: 640px) and (max-width: 1023px) {
      gap: 0.5rem;
    }
  }

  &-left {
    flex: 1;
    min-width: 0;

    @media (max-width: 639px) {
      order: 2;
    }
  }

  &-right {
    flex-shrink: 0;

    @media (max-width: 639px) {
      order: 1;
      justify-content: center;
    }

    @media (min-width: 640px) and (max-width: 1023px) {
      flex-wrap: wrap;
      justify-content: flex-end;
    }
  }
}

.table__wrapper {
  position: relative;
  width: 100%;
  background-color: #ffffff;
  border-radius: 0.5rem;
  border: 1px solid #e5e7eb;
  overflow: hidden;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);

  @media (max-width: 639px) {
    border-radius: 0.375rem;
    border: 1px solid #f3f4f6;
  }
}

.table__scroll-container {
  overflow-x: auto;
  overflow-y: visible;
  width: 100%;
  
  // Firefox scrollbar - moved before media queries
  scrollbar-width: thin;
  scrollbar-color: #d1d5db #f9fafb;
  
  // Custom scrollbar styling
  &::-webkit-scrollbar {
    height: 6px;

    @media (max-width: 767px) {
      height: 8px;
    }
  }

  &::-webkit-scrollbar-thumb {
    background-color: #d1d5db;
    border-radius: 6px;
    transition: background-color 0.2s ease;

    &:hover {
      background-color: #9ca3af;
    }

    @media (max-width: 767px) {
      background-color: #9ca3af;
    }
  }

  &::-webkit-scrollbar-track {
    background-color: #f9fafb;
    border-radius: 6px;
  }

  // Ensure table takes full width
  :deep(table) {
    min-width: 100%;
    width: max-content;

    @media (max-width: 639px) {
      min-width: 600px;
    }

   // @media (min-width: 640px) and (max-width: 1023px) {
     // min-width: 700px;
    //}
  }

  // Hide table on mobile if mobile cards are enabled
  @media (max-width: 639px) {
    .table__container[data-show-mobile-cards="true"] & {
      display: none;
    }
  }
}

.table__mobile-cards {
  display: none;

  @media (max-width: 639px) {
    .table__container[data-show-mobile-cards="true"] & {
      display: block;
      padding: 1rem;
    }
  }
}

.table__empty {
  background-color: #ffffff;
  border-radius: 0.5rem;
  border: 1px solid #e5e7eb;
  min-height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;

  @media (max-width: 639px) {
    min-height: 150px;
    border-radius: 0.375rem;
  }

  &-content {
    text-align: center;
    padding: 2rem;

    @media (max-width: 639px) {
      padding: 1.5rem;
    }
  }

  &-icon {
    font-size: 3rem;
    margin-bottom: 1rem;
    opacity: 0.5;

    @media (max-width: 639px) {
      font-size: 2.5rem;
      margin-bottom: 0.75rem;
    }
  }

  &-title {
    font-size: 1.125rem;
    font-weight: 600;
    color: #374151;
    margin-bottom: 0.5rem;

    @media (max-width: 639px) {
      font-size: 1rem;
    }
  }

  &-subtitle {
    font-size: 0.875rem;
    color: #6b7280;

    @media (max-width: 639px) {
      font-size: 0.8125rem;
    }
  }
}

.table__footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
  padding: 0.75rem 0;

  @media (max-width: 639px) {
    flex-direction: column;
    gap: 0.75rem;
    text-align: center;
  }

  @media (min-width: 640px) and (max-width: 767px) {
    justify-content: center;
    gap: 1.5rem;
  }

  :deep(.pagination) {
    @media (max-width: 639px) {
      display: flex;
      justify-content: center;
      flex-wrap: wrap;
      gap: 0.25rem;
    }
  }

  :deep(.table-info) {
    font-size: 0.875rem;
    color: #6b7280;

    @media (max-width: 639px) {
      font-size: 0.75rem;
      order: 2;
    }
  }
}

// Loading state
.table__container--loading {
  .table__scroll-container {
    opacity: 0.6;
    pointer-events: none;
  }
}

// Compact mode for smaller screens
@media (max-width: 767px) {
  .table__container--compact {
    .table__header {
      gap: 0.5rem;
    }

    .table__footer {
      padding: 0.5rem 0;
    }

    :deep(table) {
      font-size: 0.75rem;
      
      th, td {
        padding: 0.375rem 0.25rem;
      }
    }
  }
}

// High density screens
@media (min-width: 1536px) {
  .table__container {
    gap: 1.5rem;
  }

  .table__header {
    gap: 1.5rem;
  }

  .table__footer {
    gap: 1.5rem;
    padding: 1rem 0;
  }
}

// Print styles
@media print {
  .table__container {
    .table__header-right,
    .table__footer {
      display: none;
    }

    .table__scroll-container {
      overflow: visible;
    }

    :deep(table) {
      min-width: 100% !important;
      font-size: 0.75rem;
    }
  }
}
</style>

<!-- Global styles for responsive table utilities -->
<style lang="scss">
.table-cell--hide-mobile {
  @media (max-width: 639px) {
    display: none !important;
  }
}

.table-cell--hide-tablet {
  @media (min-width: 640px) and (max-width: 1023px) {
    display: none !important;
  }
}

.table-cell--responsive-text {
  @media (max-width: 639px) {
    font-size: 0.75rem;
  }

  @media (min-width: 640px) and (max-width: 767px) {
    font-size: 0.875rem;
  }
}

.table-cell--responsive-padding {
  padding: 0.75rem;

  @media (max-width: 639px) {
    padding: 0.5rem 0.25rem;
  }

  @media (min-width: 640px) and (max-width: 767px) {
    padding: 0.625rem 0.5rem;
  }
}
</style>
