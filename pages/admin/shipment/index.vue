<script setup lang="ts">
	definePageMeta({
		layout: 'admin',
	});

	const statusOptions = ref([{ name: 'All', key: 'all' }]);

	const dateOptions = ref([{ name: 'All', key: 'all' }]);

	interface shipmentHistoryProp {
		id: number;
		trackID: string;
		customerName: string;
		date: string;
		amount: number;
		status: string;
	}

	const columns = [
		{ label: 'Order ID', key: 'trackID' },
		{ label: 'Customer Name', key: 'customerName' },
		{ label: 'Date', key: 'date' },
		{ label: 'Amount', key: 'amount' },
		{ label: 'Status', key: 'status' },
	];

	// Sample data
	const histories: shipmentHistoryProp[] = [
		{
			id: 1,
			trackID: 'PCM-034PR0871',
			customerName: 'Jane Oliver',
			date: '24 Apr 2023',
			amount: 180,
			status: 'pending',
		},
		{
			id: 2,
			trackID: 'PCM-034PR0871',
			customerName: 'Kaiya Bator',
			date: '24 Apr 2023',
			amount: 180,
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
	<header class="flex justify-between">
		<h1 class="header-box-title !text-2xl">Shipment Management</h1>

		<NuxtLink
			to="/admin/settings/notifications/new"
			class="bg-primary-600 text-white focus:outline-none focus:ring-0 py-3 px-5 rounded-md"
			>Add shipment
		</NuxtLink>
	</header>

	<Divider class="my-2" />

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
						placeholder="Search"
					/>
				</IconField>
			</template>

			<template #empty>
				<div class="flex">Empty</div>
			</template>

			<!-- Right slot -->
			<template #right>
				<!-- Add filter dropdown or other controls here -->
				<div class="flex gap-2 items-center">
					<span class="text-sm">Filter:</span>
					<InputGroup class="border !border-[#D0D5DD] rounded-sm">
						<InputGroupAddon class="text-sm !border-0">
							Status
						</InputGroupAddon>
						<Select
							:options="statusOptions"
							optionLabel="name"
							class="w-20"
							size="sm"
						/>
					</InputGroup>

					<InputGroup class="border !border-[#D0D5DD] rounded-sm">
						<InputGroupAddon class="text-sm !border-0"> Date </InputGroupAddon>
						<Select
							:options="dateOptions"
							optionLabel="name"
							class="w-20"
							size="sm"
						/>
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
