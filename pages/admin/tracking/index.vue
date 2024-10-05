<script setup lang="ts">
	definePageMeta({
		layout: 'admin',
	});

	const statusOptions = ref([{ name: 'All', key: 'all' }]);

	const dateOptions = ref([{ name: 'All', key: 'all' }]);

	interface shipmentHistoryProp {
		id: number;
		trackID: string;
		shippingDate: string;
		deliveryDate: string;
		departure: string;
		destination: string;
		status: string;
	}

	const columns = [
		{ label: 'Tracking ID', key: 'trackID' },
		{ label: 'Shipment Date', key: 'shippingDate' },
		{ label: 'Delivery Date', key: 'deliveryDate' },
		{ label: 'From', key: 'departure' },
		{ label: 'Destination', key: 'destination' },
		{ label: 'Status', key: 'status' },
	];

	// Sample data
	const histories: shipmentHistoryProp[] = [
		{
			id: 1,
			trackID: 'PCM-034PR0871',
			shippingDate: '24 Apr 2023',
			deliveryDate: '24 Apr 2023',
			departure: 'United States',
			destination: 'Ghana',
			status: 'pending',
		},
		{
			id: 2,
			trackID: 'PCM-034PR0871',
			shippingDate: '24 Apr 2023',
			deliveryDate: '24 Apr 2023',
			departure: 'United States',
			destination: 'Ghana',
			status: 'pending',
		},
		{
			id: 3,
			trackID: 'PCM-034PR0871',
			shippingDate: '24 Apr 2023',
			deliveryDate: '24 Apr 2023',
			departure: 'United States',
			destination: 'Ghana',
			status: 'pending',
		},

		{
			id: 4,
			trackID: 'PCM-034PR0871',
			shippingDate: '24 Apr 2023',
			deliveryDate: '24 Apr 2023',
			departure: 'United States',
			destination: 'Ghana',
			status: 'pending',
		},
	];

	// Pagination & search states
	const currentPage = ref(1);
	const itemsPerPage = ref(10);
	const searchQuery = ref<string>('');

	// Filtered data based on search query
	const filteredData = computed(() => {
		const query = searchQuery.value.toLowerCase();
		if (!query) return histories;

		return histories.filter((item: shipmentHistoryProp) =>
			columns.some((column) =>
				(item[column.key as keyof shipmentHistoryProp] as string)
					.toLowerCase()
					.includes(query)
			)
		);
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
</script>

<template>
	<header class="home-header !gap-0">
		<h1 class="header-box-title !text-2xl">Tracking</h1>
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
					<InputText
						v-model="searchQuery"
						placeholder="Enter tracking ID"
					/>
				</IconField>
			</template>

			<template #tableCta="{ item }"> Hello </template>

			<!-- Right slot -->
			<template #right>
				<!-- Add filter dropdown or other controls here -->
				<div class="flex gap-2 items-center">
					<span class="text-sm">Filter:</span>
					<InputGroup class="border !border-[#D0D5DD] rounded-sm">
						<InputGroupAddon class="text-sm !border-0">
							Status
						</InputGroupAddon>
						<select
							class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
						>
							<option
								selected
								value="all"
							>
								All
							</option>
						</select>
					</InputGroup>

					<InputGroup class="border !border-[#D0D5DD] rounded-sm">
						<InputGroupAddon class="text-sm !border-0"> Date </InputGroupAddon>
						<select
							class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
						>
							<option
								selected
								value="all"
							>
								All
							</option>
						</select>
					</InputGroup>
				</div>
			</template>

			<!-- Table slot -->
			<template #table="{ tableData }">
				<app-datatable
					:columns="columns"
					:tableData="tableData"
				/>
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
