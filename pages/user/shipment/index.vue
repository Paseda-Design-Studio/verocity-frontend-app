<script setup lang="ts">
	// Define shipment interface
	interface shipmentProp {
		id: number;
		customer: string;
		trackID: string;
		departure: string;
		destination: string;
		status: string;
		date: string;
	}

	// Pagination & search states
	const currentPage = ref(1);
	const itemsPerPage = ref(10);
	const searchQuery = ref<string>('');

	const listItems = ref<shipmentProp[]>([
		{
			id: 1,
			customer: 'Jane Oliver',
			trackID: 'PCM-034PR0871',
			departure: 'F453/4 Gbatsuna Street, Nyaniba Estate',
			destination: '2333 W Jackson Blvd Chicago, Illinois(IL), 60612',
			status: 'in transit',
			date: '16th June 2024',
		},
		{
			id: 2,
			customer: 'Jane Oliver',
			trackID: 'PCM-034PR0871',
			departure: 'F453/4 Gbatsuna Street, Nyaniba Estate',
			destination: '2333 W Jackson Blvd Chicago, Illinois(IL), 60612',
			status: 'delivered',
			date: '16th June 2024',
		},
		{
			id: 3,
			customer: 'Jane Oliver',
			trackID: 'PCM-034PR0871',
			departure: 'F453/4 Gbatsuna Street, Nyaniba Estate',
			destination: '2333 W Jackson Blvd Chicago, Illinois(IL), 60612',
			status: 'in transit',
			date: '16th June 2024',
		},
	]);

	// Enhanced status options with actual shipment statuses
	const statusOptions = ref([
		{ name: 'All Status', key: 'all' },
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

	// Filter state object
	const filterValues = ref({
		status: 'all',
		dateRange: 'all'
	});

	// Helper function for date filtering
	const filterByDateRange = (data: shipmentProp[], range: string) => {
		const today = new Date();

		switch (range) {
			case 'today':
				return data.filter(item => {
					// You can implement proper date filtering logic here
					return item.date.includes('16th June 2024'); // Placeholder
				});
			case 'this-week':
				return data; // Implement week filtering
			case 'this-month':
				return data; // Implement month filtering
			case 'last-30-days':
				return data; // Implement 30-day filtering
			case 'last-3-months':
				return data; // Implement 3-month filtering
			default:
				return data;
		}
	};

	// Enhanced filtered data with status and date filtering
	const filteredData = computed(() => {
		let filtered = listItems.value;

		// Apply search filter
		const query = searchQuery.value.toLowerCase();
		if (query) {
			filtered = filtered.filter((item: shipmentProp) =>
				item.trackID.toLowerCase().includes(query) ||
				item.customer.toLowerCase().includes(query) ||
				item.departure.toLowerCase().includes(query) ||
				item.destination.toLowerCase().includes(query) ||
				item.status.toLowerCase().includes(query)
			);
		}

		// Apply status filter
		if (filterValues.value.status !== 'all') {
			filtered = filtered.filter(item => {
				// Normalize status comparison
				const itemStatus = item.status.toLowerCase().replace(/\s+/g, '-');
				return itemStatus === filterValues.value.status;
			});
		}

		// Apply date filter
		if (filterValues.value.dateRange !== 'all') {
			filtered = filterByDateRange(filtered, filterValues.value.dateRange);
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

	// Filter configuration for AppFilterGroup (if you want to keep using it)
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
	const handleStatusChange = (value: string) => {
		filterValues.value.status = value;
		currentPage.value = 1; // Reset to first page when filter changes
		console.log('Status filter changed to:', value);
	};

	const handleDateChange = (value: string) => {
		filterValues.value.dateRange = value;
		currentPage.value = 1; // Reset to first page when filter changes
		console.log('Date filter changed to:', value);
	};

	const handleFilterChange = (key: string, value: string) => {
		console.log(`Filter ${key} changed to:`, value);
		if (key === 'status') {
			handleStatusChange(value);
		} else if (key === 'dateRange') {
			handleDateChange(value);
		}
	};

	const handleClearFilters = () => {
		filterValues.value.status = 'all';
		filterValues.value.dateRange = 'all';
		searchQuery.value = '';
		currentPage.value = 1;
		console.log('All filters cleared');
	};

	// Pagination handler
	const handlePageChange = (newPage: number) => {
		if (newPage >= 1 && newPage <= totalPages.value) {
			currentPage.value = newPage;
		}
	};
</script>

<template>
	<section class="relative overflow-hidden bg-gray-50 py-10 sm:py-24 mt-20">
		<div class="container">
			<div class="max-w-5xl mx-auto">
				<h2 class="text-gray-900 text-3xl font-bold mb-6">Shipment</h2>

				<!-- Enhanced Filter Section -->
				<div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
					<!-- Filter Controls -->
					<div class="flex flex-wrap items-center gap-3">
						<span class="text-sm font-medium text-gray-700 hidden sm:inline">Filter:</span>

						<!-- Status Filter -->
						<AppFilterSelect v-model="filterValues.status" label="Status" :options="statusOptions"
							min-width="md" @change="handleStatusChange" />

						<!-- Date Filter -->
						<AppFilterSelect v-model="filterValues.dateRange" label="Date" :options="dateOptions"
							min-width="lg" @change="handleDateChange" />

						<!-- Clear Filters Button -->
						<button v-if="filterValues.status !== 'all' || filterValues.dateRange !== 'all' || searchQuery"
							@click="handleClearFilters"
							class="text-sm text-gray-500 hover:text-primary-600 underline transition-colors duration-200 px-2 py-1 rounded hover:bg-gray-100">
							Clear all
						</button>

						<!-- Active Filters Count -->
						<span v-if="filterValues.status !== 'all' || filterValues.dateRange !== 'all'"
							class="text-xs bg-primary-100 text-primary-800 px-2 py-1 rounded-full font-medium">
							{{ (filterValues.status !== 'all' ? 1 : 0) + (filterValues.dateRange !== 'all' ? 1 : 0) }}
							active
						</span>
					</div>

					<!-- Search Input -->
					<div class="relative w-full sm:w-auto min-w-0 max-w-sm">
						<app-icon name="search"
							class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 z-10" />
						<InputText
							class="!bg-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 !pl-10 w-full border-gray-300 rounded-lg text-sm md:text-base py-2.5 px-3"
							v-model="searchQuery" placeholder="Search by tracking ID, customer..." />
					</div>
				</div>

				<!-- Results Summary -->
				<div v-if="searchQuery || filterValues.status !== 'all' || filterValues.dateRange !== 'all'"
					class="mb-4 text-sm text-gray-600">
					Showing {{ filteredData.length }} of {{ listItems.length }} shipments
					<span v-if="searchQuery" class="font-medium">
						for "{{ searchQuery }}"
					</span>
				</div>

				<!-- Shipment Cards Container -->
				<div class="content flex flex-col border border-gray-300 bg-white rounded-lg overflow-hidden">
					<!-- Empty State -->
					<div v-if="filteredData.length === 0" class="p-12 text-center">
						<div class="w-16 h-16 mx-auto mb-4 text-gray-300">
							<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1"
									d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
							</svg>
						</div>
						<h3 class="text-lg font-medium text-gray-900 mb-2">No shipments found</h3>
						<p class="text-gray-500 mb-4">
							<span
								v-if="searchQuery || filterValues.status !== 'all' || filterValues.dateRange !== 'all'">
								Try adjusting your search or filters to find what you're looking for.
							</span>
							<span v-else>
								You don't have any shipments yet.
							</span>
						</p>
						<button v-if="searchQuery || filterValues.status !== 'all' || filterValues.dateRange !== 'all'"
							@click="handleClearFilters"
							class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-primary-700 bg-primary-100 hover:bg-primary-200 transition-colors duration-200">
							Clear filters
						</button>
					</div>

					<!-- Shipment Cards -->
					<div v-else class="divide-y divide-gray-200">
						<ShipmentCard v-for="(item, index) in paginatedData" :key="`${item.id}-${index}`"
							:track-i-d="item.trackID" :departure="item.departure" :destination="item.destination"
							:status="item.status" :date="item.date" :customer="item.customer"
							class="p-6 hover:bg-gray-50 transition-colors duration-200" />
					</div>
				</div>

				<!-- Pagination -->
				<div v-if="totalPages > 1" class="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
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

					<!-- Pagination Controls -->
					<div class="flex items-center gap-2 order-1 sm:order-2">
						<button @click="handlePageChange(currentPage - 1)" :disabled="currentPage <= 1"
							class="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200">
							<app-icon name="chevron-left" class="w-4 h-4 mr-1" />
							Previous
						</button>

						<!-- Page numbers -->
						<div class="hidden sm:flex items-center gap-1">
							<button v-for="page in Math.min(totalPages, 5)" :key="page" @click="handlePageChange(page)"
								:class="[
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
			</div>
		</div>
	</section>
</template>

<style scoped>

	/* Smooth transitions for all interactive elements */
	* {
		transition: all 0.2s ease-in-out;
	}

	/* Enhanced hover effects for cards */
	.content>div:hover {
		transform: translateY(-1px);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
	}

	/* Custom scrollbar if needed */
	.content::-webkit-scrollbar {
		width: 6px;
	}

	.content::-webkit-scrollbar-track {
		background: #f9fafb;
	}

	.content::-webkit-scrollbar-thumb {
		background: #d1d5db;
		border-radius: 3px;
	}

	.content::-webkit-scrollbar-thumb:hover {
		background: #9ca3af;
	}
</style>
