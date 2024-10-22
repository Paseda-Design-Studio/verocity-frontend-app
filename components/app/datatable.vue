<template>
  <table
    class="w-full text-sm text-left text-gray-500 border border-[#f7f7f7] rounded shadow-xs"
  >
    <thead class="text-gray-700 text-nowrap capitalize">
      <tr>
        <th
          v-for="column in columns"
          :key="column.key"
          scope="col"
          class="px-6 py-2"
        >
          {{ column.label }}
        </th>
        <!-- Column for actions -->
        <th scope="col" class="px-6 py-2 flex justify-center">Actions</th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="item in tableData"
        :key="item.id"
        class="bg-white border-t border-[#f7f7f7] hover:bg-gray-50 text-nowrap font-medium"
      >
        <td
          v-for="column in columns"
          :key="column.key"
          scope="row"
          class="px-6 py-6 text-gray-900 whitespace-nowrap space-x-2"
        >
          <!-- Render Chip if the column key is "status" -->
          <app-status-chip
            v-if="column.key === 'status'"
            :status="capitalizeFirstLetter(item[column.key])"
          >
            {{ capitalizeFirstLetter(item[column.key]) }}
          </app-status-chip>
          <!-- Render default text for other columns -->
          <span v-else>{{ item[column.key] }}</span>
        </td>
        <!-- Slot for custom CTA or actions with a smaller width and centered content -->
        <td
          class="px-2 py-2 mt-2 text-gray-900 whitespace-nowrap flex items-center justify-center"
        >
          <slot name="tableCta" :item="item" />
        </td>
      </tr>
      <!-- Empty state -->
      <tr v-if="tableData && tableData.length === 0">
        <td
          :colspan="columns.length + 1"
          class="text-center py-6 text-lg text-primary-500 font-semibold"
        >
          <slot name="empty" />
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script setup lang="ts">
// Define Column interface
interface Column {
  label: string;
  key: string;
}

// Props for table component
const props = defineProps({
  columns: {
    type: Array as PropType<Column[]>,
    required: true,
  },
  tableData: {
    type: Array as PropType<Record<string, any>[]>,
    required: true,
  },
});
</script>

<style lang="scss" scoped>
table {
  min-width: 100%;
  background-color: #fff;

  th {
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 1px;
    background-color: #f7f7f7;
  }

  td {
    font-size: 12px;

    span {
      font-size: 12px;
    }
  }
}
</style>
