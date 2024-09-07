<script setup lang="ts">
definePageMeta({
  layout: "admin",
});

interface Customer {
  id: number;
  name: string;
  email: string;
  county: string;
  phone: string;
}

const columns = [
  { label: "Name", key: "name" },
  { label: "Email", key: "email" },
  { label: "County", key: "county" },
  { label: "Phone", key: "phone" },
];

// Sample data
const customers: Customer[] = [
  { id: 1, name: "John Doe", email: "johndoe@example.com", county: "Los Angeles", phone: "+1-555-1234" },
  { id: 2, name: "Jane Smith", email: "janesmith@example.com", county: "Orange", phone: "+1-555-5678" },
  { id: 3, name: "Alice Johnson", email: "alice.johnson@example.com", county: "San Diego", phone: "+1-555-8765" },
  { id: 4, name: "Bob Brown", email: "bobbrown@example.com", county: "San Bernardino", phone: "+1-555-4321" },
  { id: 5, name: "Charlie Davis", email: "charliedavis@example.com", county: "Riverside", phone: "+1-555-3456" },
];

// Pagination & search states
const currentPage = ref(1);
const itemsPerPage = ref(10);
const searchQuery = ref<string>("");

// Filtered data based on search query
const filteredData = computed(() => {
  const query = searchQuery.value.toLowerCase();
  if (!query) return customers;

  return customers.filter((item: Customer) =>
    columns.some((column) =>
      (item[column.key as keyof Customer] as string).toLowerCase().includes(query)
    )
  );
});


// Paginated data based on current page
const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  return filteredData.value.slice(start, start + itemsPerPage.value);
});

// Calculate total pages
const totalPages = computed(() => Math.ceil(filteredData.value.length / itemsPerPage.value));

// Update page handler
const handlePageChange = (newPage: number) => {
  if (newPage >= 1 && newPage <= totalPages.value) {
    currentPage.value = newPage;
  }
};
</script>

<template>
  <header class="home-header">
    <HeaderBox
      title="Customers"
    />
  </header>

  <section>
    <app-datatable-wrapper
      :columns="columns"
      :tableData="paginatedData"
      :currentPage="currentPage"
      :totalPages="totalPages"
      :updatePage="handlePageChange"
    >
      <!-- Left slot -->
      <template #left>
        <IconField>
          <IconsSearch />
          <InputText v-model="searchQuery" placeholder="Search" />
        </IconField>
      </template>

      <!-- Right slot -->
      <template #right>
        <!-- Add filter dropdown or other controls here -->
      </template>

      <!-- Table slot -->
      <template #table="{ tableData }">
        <app-datatable :columns="columns" :tableData="tableData" />
      </template>

      <!-- Footer slot for pagination -->
      <template #footer="{ currentPage, totalPages, onUpdatePage }">
        <app-pagination
          :currentPage="currentPage"
          :totalPages="totalPages"
          @onUpdatePage="handlePageChange"
        />
      </template>
    </app-datatable-wrapper>
  </section>
</template>

<style scoped></style>
