<script setup lang="ts">
	definePageMeta({
		layout: 'admin',
	});

	interface NotificationProp {
		id: number;
		status: string;
		type: string;
		recipient: string;
	}

	const columns = [
		{ label: 'Status', key: 'status' },
		{ label: 'Type', key: 'type' },
		{ label: 'Recipient', key: 'recipient' },
	];

	// Sample data
	const notifications: NotificationProp[] = [
		{
			id: 1,
			status: 'New Shipment',
			type: 'in app/email',
			recipient: 'Customers',
		},
		{
			id: 2,
			status: 'Cancelled Shipment',
			type: 'in app/email',
			recipient: 'Customers',
		},
		{
			id: 3,
			status: 'Delivery',
			type: 'in app/email',
			recipient: 'Customers',
		},
		{
			id: 4,
			status: 'Pending',
			type: 'in app/email',
			recipient: 'Customers',
		},
	];

	// Pagination & search states
	const currentPage = ref(1);
	const itemsPerPage = ref(10);
	const searchQuery = ref<string>('');

	// Filtered data based on search query
	const filteredData = computed(() => {
		const query = searchQuery.value.toLowerCase();
		if (!query) return notifications;

		return notifications.filter((item: NotificationProp) =>
			columns.some((column) =>
				(item[column.key as keyof NotificationProp] as string)
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
			<h1 class="header-box-title !text-2xl">Notifications settings</h1>
		</div>
		<NuxtLink
			to="/admin/settings/notifications/new"
			class="bg-primary-600 text-white focus:outline-none focus:ring-0 py-3 px-5 rounded-md"
			>New Notification
		</NuxtLink>
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
				<!-- <IconField>
					<IconsSearch />
					<InputText
						v-model="searchQuery"
						placeholder="Search"
					/>
				</IconField> -->
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
