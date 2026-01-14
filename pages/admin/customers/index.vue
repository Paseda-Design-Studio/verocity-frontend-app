<script setup lang="ts">
  definePageMeta({
    layout: "admin",
  });

  // Filter states
  const selectedStatus = ref('all');
  const selectedDateRange = ref('all');

  // Status options for customers
  const statusOptions = ref([
    { name: 'All', key: 'all' },
    { name: 'Active', key: 'active' },
    { name: 'Inactive', key: 'inactive' },
    { name: 'Pending', key: 'pending' },
    { name: 'Suspended', key: 'suspended' }
  ]);

  // Date options
  const dateOptions = ref([
    { name: 'All Time', key: 'all' },
    { name: 'Today', key: 'today' },
    { name: 'This Week', key: 'this-week' },
    { name: 'This Month', key: 'this-month' },
    { name: 'Last 30 Days', key: 'last-30-days' },
    { name: 'Last 3 Months', key: 'last-3-months' }
  ]);

  interface Customer {
    id: number;
    name: string;
    email: string;
    county: string;
    phone: string;
    status: string;
    joinDate: string;
    totalShipments: number;
    totalSpent: number;
  }

  const columns = [
    { label: "Name", key: "name", hideOnMobile: false },
    { label: "Email", key: "email", hideOnMobile: false },
    { label: "County", key: "county", hideOnMobile: true },
    { label: "Phone", key: "phone", hideOnTablet: true },
    { label: "Total Spent", key: "totalSpent", hideOnTablet: true, type: "currency" },
    { label: "Status", key: "status", hideOnMobile: false },
  ];

  // Enhanced sample data
  const customers: Customer[] = [
    {
      id: 1,
      name: "John Doe",
      email: "johndoe@example.com",
      county: "Los Angeles",
      phone: "+1-555-1234",
      status: "active",
      joinDate: "2024-01-15",
      totalShipments: 12,
      totalSpent: 2450.00
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "janesmith@example.com",
      county: "Orange",
      phone: "+1-555-5678",
      status: "active",
      joinDate: "2024-01-10",
      totalShipments: 8,
      totalSpent: 1890.50
    },
    {
      id: 3,
      name: "Alice Johnson",
      email: "alice.johnson@example.com",
      county: "San Diego",
      phone: "+1-555-8765",
      status: "inactive",
      joinDate: "2023-12-20",
      totalShipments: 3,
      totalSpent: 675.25
    },
    {
      id: 4,
      name: "Bob Brown",
      email: "bobbrown@example.com",
      county: "San Bernardino",
      phone: "+1-555-4321",
      status: "pending",
      joinDate: "2024-01-18",
      totalShipments: 0,
      totalSpent: 0.00
    },
    {
      id: 5,
      name: "Charlie Davis",
      email: "charliedavis@example.com",
      county: "Riverside",
      phone: "+1-555-3456",
      status: "active",
      joinDate: "2024-01-05",
      totalShipments: 15,
      totalSpent: 3250.75
    },
    {
      id: 6,
      name: "Diana Wilson",
      email: "diana.wilson@example.com",
      county: "Ventura",
      phone: "+1-555-7890",
      status: "suspended",
      joinDate: "2023-11-30",
      totalShipments: 5,
      totalSpent: 980.00
    },
    {
      id: 7,
      name: "Edward Martinez",
      email: "edward.martinez@example.com",
      county: "Santa Barbara",
      phone: "+1-555-2468",
      status: "active",
      joinDate: "2024-01-12",
      totalShipments: 7,
      totalSpent: 1560.30
    },
    {
      id: 8,
      name: "Fiona Garcia",
      email: "fiona.garcia@example.com",
      county: "Kern",
      phone: "+1-555-1357",
      status: "inactive",
      joinDate: "2023-12-15",
      totalShipments: 2,
      totalSpent: 420.00
    }
  ];

  // Pagination & search states
  const currentPage = ref(1);
  const itemsPerPage = ref(10);
  const searchQuery = ref<string>("");

  // Helper function for date filtering
  const filterByDateRange = (data: Customer[], range: string) => {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];

    switch (range) {
      case 'today':
        return data.filter(item => item.joinDate === todayStr);
      case 'this-week':
        const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
        return data.filter(item => {
          const itemDate = new Date(item.joinDate);
          return itemDate >= weekAgo && itemDate <= today;
        });
      case 'this-month':
        const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
        return data.filter(item => {
          const itemDate = new Date(item.joinDate);
          return itemDate >= monthStart && itemDate <= today;
        });
      case 'last-30-days':
        const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
        return data.filter(item => {
          const itemDate = new Date(item.joinDate);
          return itemDate >= thirtyDaysAgo && itemDate <= today;
        });
      case 'last-3-months':
        const threeMonthsAgo = new Date(today.getTime() - 90 * 24 * 60 * 60 * 1000);
        return data.filter(item => {
          const itemDate = new Date(item.joinDate);
          return itemDate >= threeMonthsAgo && itemDate <= today;
        });
      default:
        return data;
    }
  };

  // Filtered data based on search query and filters
  const filteredData = computed(() => {
    let filtered = customers;

    // Apply search filter
    const query = searchQuery.value.toLowerCase();
    if (query) {
      filtered = filtered.filter((item: Customer) =>
        columns.some((column) => {
          const value = item[column.key as keyof Customer];
          return value && value.toString().toLowerCase().includes(query);
        })
      );
    }

    // Apply status filter
    if (selectedStatus.value !== 'all') {
      filtered = filtered.filter(item => item.status === selectedStatus.value);
    }

    // Apply date filter
    if (selectedDateRange.value !== 'all') {
      filtered = filterByDateRange(filtered, selectedDateRange.value);
    }

    return filtered;
  });

  // Paginated data based on current page
  const paginatedData = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage.value;
    return filteredData.value.slice(start, start + itemsPerPage.value);
  });

  // Calculate total pages
  const totalPages = computed(() =>
    Math.ceil(filteredData.value.length / itemsPerPage.value)
  );

  // Update page handler
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages.value) {
      currentPage.value = newPage;
    }
  };

  // Filter handlers
  const handleStatusChange = (event: Event) => {
    const target = event.target as HTMLSelectElement;
    selectedStatus.value = target.value;
    currentPage.value = 1;
  };

  const handleDateChange = (event: Event) => {
    const target = event.target as HTMLSelectElement;
    selectedDateRange.value = target.value;
    currentPage.value = 1;
  };

  // Clear all filters
  const clearFilters = () => {
    selectedStatus.value = 'all';
    selectedDateRange.value = 'all';
    searchQuery.value = '';
    currentPage.value = 1;
  };

  // Action handlers
  const viewCustomer = (customer: Customer) => {
    navigateTo(`/admin/customers/${customer.id}`);
  };

  const editCustomer = (customer: Customer) => {
    navigateTo(`/admin/customers/${customer.id}/edit`);
  };

  const deleteCustomer = async (customer: Customer) => {
    if (confirm(`Are you sure you want to delete customer ${customer.name}?`)) {
      try {
        console.log('Deleting customer:', customer.name);
        // API call to delete customer and refetch data
        // Remove from local array for demo
        const index = customers.findIndex(c => c.id === customer.id);
        if (index > -1) {
          customers.splice(index, 1);
        }
      } catch (error) {
        console.error('Error deleting customer:', error);
      }
    }
  };

  // Customer related logic
  const handleNewCustomer = () => {
    console.log('New Customer button clicked');
  };
</script>

<template>
  <div class="w-full space-y-6 md:space-y-8">
    <!-- Header Section -->
    <section class="mt-6 md:mt-8 lg:mt-10">
      <AdminTitleHeader title="Customers" :show-divider="true">
        <template #action>
          <NuxtLink to="/admin/customers/new"
            class="inline-flex items-center gap-2 bg-primary-600 text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 py-2.5 px-4 md:py-3 md:px-5 rounded-lg hover:bg-primary-700 transition-colors duration-200 text-sm md:text-base font-medium"
            @click="handleNewCustomer">
            <app-icon name="user-plus" class="w-4 h-4 flex-shrink-0" />
            <span class="hidden sm:inline">Add Customer</span>
            <span class="sm:hidden">Add</span>
          </NuxtLink>
        </template>
      </AdminTitleHeader>
    </section>

    <!-- Data Table Section -->
    <section class="mt-6 md:mt-8 lg:mt-10">
      <app-datatable-wrapper :columns="columns" :tableData="paginatedData" :currentPage="currentPage"
        :totalPages="totalPages" :updatePage="handlePageChange" :showMobileCards="true">
        <!-- Empty State -->
        <template #empty>
          <AppEmptyState title="No customers found"
            description="Try adjusting your search or filters, or add your first customer" icon="👥" :showAction="true"
            actionText="Add First Customer" actionIcon="user-plus" actionLink="/admin/customers/new" variant="bordered"
            size="md" />
        </template>

        <!-- Left slot - Search -->
        <template #left>
          <div class="relative w-full min-w-0 max-w-sm md:max-w-md lg:max-w-lg">
            <app-icon name="search"
              class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 z-10" />
            <InputText
              class="!bg-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 !pl-10 w-full border-gray-300 rounded-lg text-sm md:text-base py-2.5 px-3"
              v-model="searchQuery" placeholder="Search by name, email, county..." />
          </div>
        </template>

        <!-- Right slot - Filters -->
        <template #right>
          <div class="flex flex-wrap items-center gap-2 md:gap-3">
            <span class="text-xs md:text-sm font-medium text-gray-700 hidden sm:inline">Filter:</span>

            <!-- Status Filter -->
            <div
              class="flex items-center border border-gray-300 rounded-lg shadow-sm hover:border-gray-400 transition-colors duration-200 overflow-hidden">
              <label
                class="text-xs md:text-sm font-medium bg-gray-50 text-gray-700 px-2 md:px-3 py-2 md:py-2.5 border-r border-gray-300 whitespace-nowrap">
                Status:
              </label>
              <select v-model="selectedStatus" @change="handleStatusChange"
                class="bg-white border-0 text-gray-900 text-xs md:text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 block min-w-[100px] md:min-w-[120px] focus:outline-none py-2 md:py-2.5 px-2 md:px-3 transition-all">
                <option v-for="option in statusOptions" :key="option.key" :value="option.key">
                  {{ option.name }}
                </option>
              </select>
            </div>

            <!-- Date Filter -->
            <div
              class="flex items-center border border-gray-300 rounded-lg shadow-sm hover:border-gray-400 transition-colors duration-200 overflow-hidden">
              <label
                class="text-xs md:text-sm font-medium bg-gray-50 text-gray-700 px-2 md:px-3 py-2 md:py-2.5 border-r border-gray-300 whitespace-nowrap">
                Join Date:
              </label>
              <select v-model="selectedDateRange" @change="handleDateChange"
                class="bg-white border-0 text-gray-900 text-xs md:text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 block min-w-[120px] md:min-w-[140px] focus:outline-none py-2 md:py-2.5 px-2 md:px-3 transition-all">
                <option v-for="option in dateOptions" :key="option.key" :value="option.key">
                  {{ option.name }}
                </option>
              </select>
            </div>

            <!-- Clear Filters Button -->
            <button v-if="selectedStatus !== 'all' || selectedDateRange !== 'all' || searchQuery" @click="clearFilters"
              class="text-xs md:text-sm text-gray-500 hover:text-gray-700 underline transition-colors duration-200 px-2 py-1">
              Clear all
            </button>

            <!-- Active Filters Count -->
            <span v-if="selectedStatus !== 'all' || selectedDateRange !== 'all'"
              class="text-xs bg-primary-100 text-primary-800 px-2 py-1 rounded-full font-medium">
              {{ (selectedStatus !== 'all' ? 1 : 0) + (selectedDateRange !== 'all' ? 1 : 0) }} active
            </span>
          </div>
        </template>

        <!-- Table slot -->
        <template #table="{ tableData }">
          <app-datatable :columns="columns" :tableData="tableData">
            <template #tableCta="{ item }">
              <AppTableMenu v-if="item" placement="bottom-end" width="md" :deletable="true"
                @view="viewCustomer(item as Customer)" @edit="editCustomer(item as Customer)"
                @delete="deleteCustomer(item as Customer)" />
            </template>
          </app-datatable>
        </template>

        <!-- Mobile Cards -->
        <template #mobile-cards="{ tableData }">
          <AppMobileTable :tableData="tableData" primaryField="name" secondaryField="email" badgeField="status"
            :contentFields="[
              { key: 'county', label: 'County', type: 'text' },
              { key: 'phone', label: 'Phone', type: 'text' },
              { key: 'totalSpent', label: 'Total Spent', type: 'currency' },
              { key: 'joinDate', label: 'Join Date', type: 'date' }
            ]" :badgeClassMap="{
              'active': 'mobile-table__badge--success',
              'inactive': 'mobile-table__badge--default',
              'pending': 'mobile-table__badge--warning',
              'suspended': 'mobile-table__badge--danger'
            }" keyField="id" spacing="md">
            <template #kebab-menu="{ item }">
              <AppTableMenu v-if="item" placement="bottom-end" width="md" :deletable="true"
                @view="viewCustomer(item as Customer)" @edit="editCustomer(item as Customer)"
                @delete="deleteCustomer(item as Customer)" />
            </template>
          </AppMobileTable>
        </template>

        <!-- Footer slot for pagination -->
        <template #footer="{ currentPage, totalPages }">
          <div class="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
            <!-- Results info -->
            <div class="text-sm text-gray-700 order-2 sm:order-1">
              Showing
              <span class="font-medium">{{ (currentPage - 1) * itemsPerPage + 1 }}</span>
              to
              <span class="font-medium">{{ Math.min(currentPage * itemsPerPage, filteredData.length) }}</span>
              of
              <span class="font-medium">{{ filteredData.length }}</span>
              results
            </div>

            <!-- Pagination -->
            <div class="flex items-center gap-2 order-1 sm:order-2">
              <button @click="handlePageChange(currentPage - 1)" :disabled="currentPage <= 1"
                class="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200">
                <app-icon name="chevron-left" class="w-4 h-4 mr-1" />
                Previous
              </button>

              <!-- Page numbers -->
              <div class="hidden sm:flex items-center gap-1">
                <button v-for="page in Math.min(totalPages, 5)" :key="page" @click="handlePageChange(page)" :class="[
                  'inline-flex items-center justify-center w-10 h-10 text-sm font-medium rounded-lg transition-colors duration-200',
                  page === currentPage
                    ? 'bg-primary-600 text-white'
                    : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50 hover:text-gray-700'
                ]">
                  {{ page }}
                </button>
              </div>

              <button @click="handlePageChange(currentPage + 1)" :disabled="currentPage >= totalPages"
                class="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200">
                Next
                <app-icon name="chevron-right" class="w-4 h-4 ml-1" />
              </button>
            </div>
          </div>
        </template>
      </app-datatable-wrapper>
    </section>
  </div>
</template>

<style scoped></style>
