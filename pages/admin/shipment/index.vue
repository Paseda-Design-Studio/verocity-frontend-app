<script setup lang="ts">
	definePageMeta({
		layout: 'admin',
	});

	// Status and date options
	const statusOptions = ref([
		{ name: 'All', key: 'all' },
		{ name: 'Pending', key: 'pending' },
		{ name: 'In Transit', key: 'in-transit' },
		{ name: 'Delivered', key: 'delivered' },
		{ name: 'Cancelled', key: 'cancelled' },
		{ name: 'On Hold', key: 'on-hold' }
	]);
	const dateOptions = ref([
		{ name: 'All Time', key: 'all' },
		{ name: 'Today', key: 'today' },
		{ name: 'This Week', key: 'this-week' },
		{ name: 'This Month', key: 'this-month' },
		{ name: 'Last 30 Days', key: 'last-30-days' },
		{ name: 'Last 3 Months', key: 'last-3-months' }
	]);

	interface shipmentHistoryProp {
		id: number;
		trackID: string;
		customerName: string;
		date: string;
		amount: number;
		status: string;
	}

	const columns = [
		{ label: 'Order ID', key: 'trackID', hideOnMobile: false },
		{ label: 'Customer Name', key: 'customerName', hideOnMobile: false },
		{ label: 'Date', key: 'date', hideOnMobile: true },
		{ label: 'Amount', key: 'amount', hideOnTablet: true },
		{ label: 'Status', key: 'status', hideOnMobile: false },
	];

	// Sample data
	const histories: shipmentHistoryProp[] = [
		// ...existing sample data...
	];

	// Pagination & search states
	const currentPage = ref(1);
	const itemsPerPage = ref(10);
	const searchQuery = ref<string>('');

	// Filter state (always string values)
	const filterValues = ref<Record<string, string>>({
		status: 'all',
		dateRange: 'all'
	});

	// Filter config
	const filterConfig = computed(() => [
		{
			key: 'status',
			label: 'Status',
			options: statusOptions.value,
			minWidth: 'md' as const
		},
		{
			key: 'dateRange',
			label: 'Date',
			options: dateOptions.value,
			minWidth: 'lg' as const
		}
	]);

	// Filter handlers
	const handleFilterChange = (key: string, value: string) => {
		filterValues.value[key] = value || 'all';
		currentPage.value = 1;
	};

	const handleClearFilters = () => {
		filterValues.value = { status: 'all', dateRange: 'all' };
		searchQuery.value = '';
		currentPage.value = 1;
	};

	// Helper function for date filtering
	const filterByDateRange = (data: shipmentHistoryProp[], range: string) => {
		const today = new Date();
		switch (range) {
			case 'today':
				return data.filter(item => item.date.includes('24 Apr 2023')); // Placeholder
			case 'this-week':
				return data;
			case 'this-month':
				return data;
			case 'last-30-days':
				return data;
			case 'last-3-months':
				return data;
			default:
				return data;
		}
	};

	// Filtered data
	const filteredData = computed(() => {
		let filtered = histories;

		// Search filter
		const query = searchQuery.value.toLowerCase();
		if (query) {
			filtered = filtered.filter((item: shipmentHistoryProp) =>
				columns.some((column) =>
					(item[column.key as keyof shipmentHistoryProp] as string)
						.toLowerCase()
						.includes(query)
				)
			);
		}

		// Status filter
		if (filterValues.value.status !== 'all') {
			filtered = filtered.filter(item => item.status === filterValues.value.status);
		}

		// Date filter
		if (filterValues.value.dateRange !== 'all') {
			filtered = filterByDateRange(filtered, filterValues.value.dateRange);
		}

		return filtered;
	});

	// Paginated data
	const paginatedData = computed(() => {
		const start = (currentPage.value - 1) * itemsPerPage.value;
		return filteredData.value.slice(start, start + itemsPerPage.value);
	});

	// Total pages
	const totalPages = computed(() =>
		Math.ceil(filteredData.value.length / itemsPerPage.value)
	);

	// Page change handler
	const handlePageChange = (newPage: number) => {
		if (newPage >= 1 && newPage <= totalPages.value) {
			currentPage.value = newPage;
		}
	};

	// Shipment actions
	const handleNewShipment = () => {
		console.log('New Shipment button clicked');
	};

	const viewShipment = (shipment: shipmentHistoryProp) => {
		navigateTo(`/admin/shipment/${shipment.id}`);
	};

	const editShipment = (shipment: shipmentHistoryProp) => {
		navigateTo(`/admin/shipments/${shipment.id}/edit`);
	};

	const deleteShipment = async (shipment: shipmentHistoryProp) => {
		if (confirm(`Are you sure you want to delete shipment ${shipment.trackID}?`)) {
			try {
				console.log('Deleting shipment:', shipment.trackID);
				// API call to delete shipment and refetch data
			} catch (error) {
				console.error('Error deleting shipment:', error);
			}
		}
	};

	// Status badge class
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
</script>

<template>
	<div class="w-full space-y-6 md:space-y-8">
		<!-- Header Section -->
		<section class="mt-6 md:mt-8 lg:mt-10">
			<AdminTitleHeader title="Shipment Management" :show-divider="true">
				<template #action>
					<NuxtLink to="/admin/shipment/create/shipping-details"
						class="inline-flex items-center gap-2 bg-primary-600 text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 py-2.5 px-4 md:py-3 md:px-5 rounded-lg hover:bg-primary-700 transition-colors duration-200 text-sm md:text-base font-medium"
						@click="handleNewShipment">
						<app-icon name="circle-plus" class="w-4 h-4 flex-shrink-0" />
						<span class="hidden sm:inline">Add shipment</span>
						<span class="sm:hidden">Add</span>
					</NuxtLink>
				</template>
			</AdminTitleHeader>
		</section>

		<!-- Data Table Section -->
		<section class="mt-6 md:mt-8 lg:mt-10">
			<app-datatable-wrapper :columns="columns" :tableData="paginatedData" :currentPage="currentPage"
				:totalPages="totalPages" :updatePage="handlePageChange" :showMobileCards="true">

				<!-- Left slot - Search -->
				<template #left>
					<div class="relative w-full min-w-0 max-w-sm">
						<app-icon name="search"
							class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 z-10" />
						<InputText
							class="!bg-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 !pl-10 w-full border-gray-300 rounded-lg text-sm md:text-base py-2.5 px-3"
							v-model="searchQuery" placeholder="Search by tracking ID, customer..." />
					</div>
				</template>

				<!-- Right slot - Filters -->
				<template #right>
					<AppFilterGroup v-model="filterValues" :filters="filterConfig" @filter-change="handleFilterChange"
						@clear-filters="handleClearFilters" />
				</template>

				<!-- Table slot -->
				<template #table="{ tableData }">
					<app-datatable :columns="columns" :tableData="tableData">
						<template #tableCta="{ item }">
							<AppTableMenu v-if="item" placement="bottom-end" width="md"
								@view="viewShipment(item as shipmentHistoryProp)" :deletable="false"
								:editable="false" />
						</template>
						<template #empty>
							<AppEmptyState title="No shipments found"
								description="Try adjusting your search or filters, or create your first shipment"
								icon="📦" :showAction="true" actionText="Create First Shipment" actionIcon="plus"
								actionLink="/admin/shipment/new" variant="bordered" size="md" />
						</template>
					</app-datatable>
				</template>

				<!-- Mobile Cards -->
				<template #mobile-cards="{ tableData }">
					<AppMobileTable :tableData="tableData" primaryField="trackID" secondaryField="customerName"
						badgeField="status" :contentFields="[
							{ key: 'date', label: 'Date', type: 'text' },
							{ key: 'amount', label: 'Amount', type: 'currency' }
						]" :badgeClassMap="{
							'pending': 'mobile-table__badge--warning',
							'in-transit': 'mobile-table__badge--info',
							'delivered': 'mobile-table__badge--success',
							'cancelled': 'mobile-table__badge--danger',
							'on-hold': 'mobile-table__badge--default'
						}" keyField="id" spacing="md">
						<template #kebab-menu="{ item }">
							<AppTableMenu v-if="item" placement="bottom-end" width="md"
								@view="viewShipment(item as shipmentHistoryProp)" :deletable="false"
								:editable="false" />
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
							<span class="font-medium">{{ Math.min(currentPage * itemsPerPage, filteredData.length)
							}}</span>
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
								<button v-for="page in Math.min(totalPages, 5)" :key="page"
									@click="handlePageChange(page)" :class="[
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