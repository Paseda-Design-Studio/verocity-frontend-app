<script setup lang="ts">
	definePageMeta({
		layout: 'admin',
	});

	interface LogProp {
		id: number;
		detail: string;
		initiator: string;
		date: string;
	}

	const columns = [
		{ label: 'Detail', key: 'detail' },
		{ label: 'Initiator', key: 'initiator' },
		{ label: 'Date & Time', key: 'date' },
	];

	// Sample data
	const logs: LogProp[] = [
		{
			id: 1,
			detail:
				'Dolor enim eu tortor urna sed duis nulla. Aliquam vestibulum, nulla odio nisl vitae..',
			initiator: 'Kaiya Bator',
			date: 'June 18, 2024 11:00 AM',
		},
	];

	// Pagination & search states
	const currentPage = ref(1);
	const itemsPerPage = ref(10);
	const searchQuery = ref<string>('');

	// Filtered data based on search query
	const filteredData = computed(() => {
		const query = searchQuery.value.toLowerCase();
		if (!query) return logs;

		return logs.filter((item: LogProp) =>
			columns.some((column) =>
				(item[column.key as keyof LogProp] as string)
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
	<header className="home-header">
		<AppSettingLinks />
	</header>

	<div class="flex justify-between items-center">
		<div>
			<h1 class="header-box-title !text-2xl">Activity Logs</h1>
		</div>
	</div>

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

			<!-- Right slot -->
			<template #right>
				<!-- Add filter dropdown or other controls here -->
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
