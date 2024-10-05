<script setup lang="ts">
	definePageMeta({
		layout: 'admin',
	});

	import { ref } from 'vue';

	const visible = ref(false);

	interface Admin {
		id: number;
		name: string;
		email: string;
		level: string;
	}

	const columns = [
		{ label: 'Name', key: 'name' },
		{ label: 'Email Address', key: 'email' },
		{ label: 'Level', key: 'level' },
	];

	// Sample data
	const customers: Admin[] = [
		{
			id: 1,
			name: 'John Doe',
			email: 'johndoe@example.com',
			level: 'Admin',
		},
		{
			id: 2,
			name: 'Jane Smith',
			email: 'janesmith@example.com',
			level: 'Admin',
		},
		{
			id: 3,
			name: 'Alice Johnson',
			email: 'alice.johnson@example.com',
			level: 'Admin',
		},
		{
			id: 4,
			name: 'Bob Brown',
			email: 'bobbrown@example.com',
			level: 'Admin',
		},
		{
			id: 5,
			name: 'Charlie Davis',
			email: 'charliedavis@example.com',
			level: 'Admin',
		},
	];

	// Pagination & search states
	const currentPage = ref(1);
	const itemsPerPage = ref(10);
	const searchQuery = ref<string>('');

	// Filtered data based on search query
	const filteredData = computed(() => {
		const query = searchQuery.value.toLowerCase();
		if (!query) return customers;

		return customers.filter((item: Admin) =>
			columns.some((column) =>
				(item[column.key as keyof Admin] as string)
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
			<h1 class="header-box-title !text-2xl">Admin</h1>
			<p class="text-sm text[#475467]">
				Admins can add and remove users and manage organization-level settings.
			</p>
		</div>
		<Button
			class="bg-primary-600 text-white focus:outline-none focus:ring-0 py-3 px-5 rounded-md"
			@click="visible = true"
			>invite member
		</Button>
	</div>

	<Dialog
		v-model:visible="visible"
		modal
		header="Invite Member"
	>
		<div class="flex flex-col gap-1 mb-4">
			<label
				class="text-sm"
				for="name"
				>Name</label
			>
			<InputText
				id="name"
				placeholder="Name"
				aria-describedby="Name"
			/>
		</div>
		<div class="flex flex-col gap-1 mb-8">
			<label
				class="text-sm"
				for="email"
				>Email</label
			>
			<InputText
				id="email"
				placeholder="Email address"
				aria-describedby="email"
			/>
		</div>
		<div class="flex justify-end gap-2">
			<Button
				@click="visible = false"
				class="bg-white text-gray-900 border focus:outline-none focus:ring-0 py-3 px-5 rounded-md"
				>Cancel
			</Button>
			<Button
				class="bg-primary-600 text-white focus:outline-none focus:ring-0 py-3 px-5 rounded-md"
				>Save
			</Button>
		</div>
	</Dialog>

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
