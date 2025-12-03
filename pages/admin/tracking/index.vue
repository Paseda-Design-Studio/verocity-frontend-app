<script setup lang="ts">
  definePageMeta({
    layout: "admin",
  });

  // Filter states
  const selectedStatus = ref('all');
  const selectedDateRange = ref('all');

  // Enhanced status options with actual tracking statuses
  const statusOptions = ref([
    { name: 'All', key: 'all' },
    { name: 'Pending', key: 'pending' },
    { name: 'In Transit', key: 'in-transit' },
    { name: 'Delivered', key: 'delivered' },
    { name: 'Cancelled', key: 'cancelled' },
    { name: 'On Hold', key: 'on-hold' }
  ]);

  // Enhanced date options
  const dateOptions = ref([
    { name: 'All Time', key: 'all' },
    { name: 'Today', key: 'today' },
    { name: 'This Week', key: 'this-week' },
    { name: 'This Month', key: 'this-month' },
    { name: 'Last 30 Days', key: 'last-30-days' },
    { name: 'Last 3 Months', key: 'last-3-months' }
  ]);

  interface trackingHistoryProp {
    id: number;
    trackID: string;
    shippingDate: string;
    deliveryDate: string;
    departure: string;
    destination: string;
    status: string;
    customerName?: string; // Added for consistency with table display
    amount?: number; // Added for consistency with table display
  }

  const columns = [
    { label: 'Order ID', key: 'trackID', hideOnMobile: false },
    { label: 'Customer Name', key: 'customerName', hideOnMobile: false },
    { label: 'Shipping Date', key: 'shippingDate', hideOnMobile: true },
    { label: 'Departure', key: 'departure', hideOnTablet: true },
    { label: 'Destination', key: 'destination', hideOnTablet: true },
    { label: 'Status', key: 'status', hideOnMobile: false },
  ];

  // Test data using trackingHistoryProp interface
  const histories: trackingHistoryProp[] = [
    {
      id: 1,
      trackID: 'TRK-034PR0871',
      customerName: 'Jane Oliver',
      shippingDate: '2024-01-15',
      deliveryDate: '2024-01-25',
      departure: 'New York, USA',
      destination: 'Accra, Ghana',
      status: 'pending',
      amount: 1250
    },
    {
      id: 2,
      trackID: 'TRK-034PR0872',
      customerName: 'Kaiya Bator',
      shippingDate: '2024-01-14',
      deliveryDate: '2024-01-22',
      departure: 'Los Angeles, USA',
      destination: 'Lagos, Nigeria',
      status: 'delivered',
      amount: 980
    },
    {
      id: 3,
      trackID: 'TRK-034PR0873',
      customerName: 'John Smith',
      shippingDate: '2024-01-13',
      deliveryDate: '2024-01-28',
      departure: 'Miami, USA',
      destination: 'Nairobi, Kenya',
      status: 'in-transit',
      amount: 1450
    },
    {
      id: 4,
      trackID: 'TRK-034PR0874',
      customerName: 'Sarah Johnson',
      shippingDate: '2024-01-12',
      deliveryDate: '2024-01-30',
      departure: 'Houston, USA',
      destination: 'Cape Town, South Africa',
      status: 'cancelled',
      amount: 1680
    },
    {
      id: 5,
      trackID: 'TRK-034PR0875',
      customerName: 'Michael Brown',
      shippingDate: '2024-01-11',
      deliveryDate: '2024-01-26',
      departure: 'Chicago, USA',
      destination: 'Cairo, Egypt',
      status: 'on-hold',
      amount: 1120
    },
    {
      id: 6,
      trackID: 'TRK-034PR0876',
      customerName: 'Emily Davis',
      shippingDate: '2024-01-10',
      deliveryDate: '2024-01-24',
      departure: 'Seattle, USA',
      destination: 'Casablanca, Morocco',
      status: 'delivered',
      amount: 1350
    },
    {
      id: 7,
      trackID: 'TRK-034PR0877',
      customerName: 'David Wilson',
      shippingDate: '2024-01-09',
      deliveryDate: '2024-01-27',
      departure: 'Boston, USA',
      destination: 'Addis Ababa, Ethiopia',
      status: 'in-transit',
      amount: 1580
    },
    {
      id: 8,
      trackID: 'TRK-034PR0878',
      customerName: 'Lisa Anderson',
      shippingDate: '2024-01-08',
      deliveryDate: '2024-01-29',
      departure: 'Atlanta, USA',
      destination: 'Kampala, Uganda',
      status: 'pending',
      amount: 1200
    }
  ];

  // Pagination & search states
  const currentPage = ref(1);
  const itemsPerPage = ref(10);
  const searchQuery = ref<string>("");

  // Helper function for date filtering
  const filterByDateRange = (data: trackingHistoryProp[], range: string) => {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];

    switch (range) {
      case 'today':
        return data.filter(item => item.shippingDate === todayStr);
      case 'this-week':
        const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
        return data.filter(item => {
          const itemDate = new Date(item.shippingDate);
          return itemDate >= weekAgo && itemDate <= today;
        });
      case 'this-month':
        const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
        return data.filter(item => {
          const itemDate = new Date(item.shippingDate);
          return itemDate >= monthStart && itemDate <= today;
        });
      case 'last-30-days':
        const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
        return data.filter(item => {
          const itemDate = new Date(item.shippingDate);
          return itemDate >= thirtyDaysAgo && itemDate <= today;
        });
      case 'last-3-months':
        const threeMonthsAgo = new Date(today.getTime() - 90 * 24 * 60 * 60 * 1000);
        return data.filter(item => {
          const itemDate = new Date(item.shippingDate);
          return itemDate >= threeMonthsAgo && itemDate <= today;
        });
      default:
        return data;
    }
  };

  // Enhanced filtered data with status and date filtering
  const filteredData = computed(() => {
    let filtered = histories;

    // Apply search filter
    const query = searchQuery.value.toLowerCase();
    if (query) {
      filtered = filtered.filter((item: trackingHistoryProp) =>
        columns.some((column) => {
          const value = item[column.key as keyof trackingHistoryProp];
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

  // Action handlers - Updated to work with trackingHistoryProp
  const viewShipment = (tracking: trackingHistoryProp) => {
    navigateTo(`/admin/tracking/${tracking.id}`);
  };

  const editShipment = (tracking: trackingHistoryProp) => {
    navigateTo(`/admin/tracking/${tracking.id}/edit`);
  };

  const deleteShipment = async (tracking: trackingHistoryProp) => {
    if (confirm(`Are you sure you want to delete tracking ${tracking.trackID}?`)) {
      try {
        console.log('Deleting tracking:', tracking.trackID);
        // API call to delete tracking and refetch data
        // Remove from local array for demo
        const index = histories.findIndex(h => h.id === tracking.id);
        if (index > -1) {
          histories.splice(index, 1);
        }
      } catch (error) {
        console.error('Error deleting tracking:', error);
      }
    }
  };

  // Get status badge class
  const getStatusClass = (status: string) => {
    const statusClasses = {
      'pending': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'in-transit': 'bg-blue-100 text-blue-800 border-blue-200',
      'delivered': 'bg-green-100 text-green-800 border-green-200',
      'cancelled': 'bg-red-100 text-red-800 border-red-200',
      'on-hold': 'bg-gray-100 text-gray-800 border-gray-200',
    };
    return statusClasses[status as keyof typeof statusClasses] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  // Format amount
  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Get route display (departure → destination)
  const getRouteDisplay = (tracking: trackingHistoryProp) => {
    return `${tracking.departure} → ${tracking.destination}`;
  };
</script>

<template>
  <div class="w-full space-y-6 md:space-y-8">
    <!-- Header Section -->
    <section class="mt-6 md:mt-8 lg:mt-10">
      <AdminTitleHeader title="Tracking" :show-divider="true" />
    </section>

    <!-- Data Table Section -->
    <section class="mt-6 md:mt-8 lg:mt-10">
      <app-datatable-wrapper :columns="columns" :tableData="paginatedData" :currentPage="currentPage"
        :totalPages="totalPages" :updatePage="handlePageChange" :showMobileCards="true">
        <!-- Empty State -->
        <template #empty>
          <AppEmptyState title="No trackings found"
            description="Try adjusting your search or filters, or create your first tracking" icon="📦"
            :showAction="false" variant="bordered" size="md" />
        </template>

        <!-- Left slot - Search -->
        <template #left>
          <div class="relative w-full min-w-0 max-w-sm md:max-w-md lg:max-w-lg">
            <app-icon name="search"
              class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 z-10" />
            <InputText
              class="!bg-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 !pl-10 w-full border-gray-300 rounded-lg text-sm md:text-base py-2.5 px-3"
              v-model="searchQuery" placeholder="Search by tracking ID, customer, location..." />
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
                Date:
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
              <AppTableMenu v-if="item" :deletable="false" placement="bottom-end" width="md"
                @view="viewShipment(item as trackingHistoryProp)" @edit="editShipment(item as trackingHistoryProp)" />
            </template>
          </app-datatable>
        </template>


        <!-- Mobile Cards -->
        <template #mobile-cards="{ tableData }">
          <AppMobileTable :tableData="tableData" primaryField="trackID" secondaryField="customerName"
            badgeField="status" :contentFields="[
              { key: 'shippingDate', label: 'Shipping Date', type: 'date' },
              { key: 'departure', label: 'From', type: 'text' },
              { key: 'destination', label: 'To', type: 'text' },
              { key: 'amount', label: 'Amount', type: 'currency' }
            ]" :badgeClassMap="{
              'pending': 'mobile-table__badge--warning',
              'in-transit': 'mobile-table__badge--info',
              'delivered': 'mobile-table__badge--success',
              'cancelled': 'mobile-table__badge--danger',
              'on-hold': 'mobile-table__badge--default'
            }" keyField="id" spacing="md">
            <template #kebab-menu="{ item }">
              <AppTableMenu v-if="item" :deletable="false" placement="bottom-end" width="md"
                @view="viewShipment(item as trackingHistoryProp)" @edit="editShipment(item as trackingHistoryProp)" />
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
