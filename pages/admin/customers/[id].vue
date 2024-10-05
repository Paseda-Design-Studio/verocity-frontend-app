<script setup lang="ts">
	definePageMeta({
		layout: 'admin',
	});


  const columns = [
		{ label: 'Shipment ID', key: 'trackID' },
		{ label: 'Shipment Date', key: 'date' },
		{ label: 'From', key: 'departure' },
		{ label: 'Destination', key: 'destination' },
		{ label: 'Status', key: 'status' },
	];

	// Sample data
	const activities: shipmentProp[] = [
		{
			id: 1,
			trackID: 'PCM-034PR0871',
			date: '24 Apr 2023',
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
		if (!query) return activities;

		return activities.filter((item: shipmentProp) =>
			columns.some((column) =>
				(item[column.key as keyof shipmentProp] as string)
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
		<NuxtLink
			to="/admin/dashboard"
			class="flex gap-2 items-center"
		>
			<span
				class="flex justify-center items-center border border-[#D0D5DD] p-0.5"
			>
				<img src="/icons/arrow-left.svg" />
			</span>
			Back
		</NuxtLink>

		<Divider />

		<h1 class="header-box-title !text-2xl">Customer Details</h1>
	</header>

	<section class="rounded-lg bg-white p-3">
		<div class="flex items-center gap-2">
			<img
				src="/placeholder.png"
				shape="circle"
				class="w-20 h-20"
			/>
			<div class="flex gap-0.5 flex-col">
				<span class="text-lg font-medium">Justin Septimus</span>
				<span class="text-sm">Haylierosser@gmail.com</span>
			</div>
		</div>

		<Divider />

		<div class="grid grid-cols-3">
			<div class="flex">
				<ul class="text-sm text-gray-900 bg-white rounded-lg">
					<li class="w-full px-4 py-1.5">Phone Number</li>
					<li class="w-full px-4 py-1.5">City/town/district</li>
					<li class="w-full px-4 py-1.5">Country</li>
					<li class="w-full px-4 py-1.5">Address</li>
				</ul>
			</div>

			<div class="grid col-span-2">
				<ul class="text-sm font-semibold text-gray-900 bg-white rounded-lg">
					<li class="w-full px-4 py-1.5">+1 (555) 000-0000</li>
					<li class="w-full px-4 py-1.5">Illinois</li>
					<li class="w-full px-4 py-1.5">United states of America</li>
					<li class="w-full px-4 py-1.5">
						2045 W Jackson Blvd Chicago, Illinois(IL), 60612
					</li>
				</ul>
			</div>
		</div>
	</section>

  <section class="flex flex-col gap-2">
		<div class="flex justify-between items-center">
			<span class="text-sm text-gray-900 font-bold capitalize"
				>Ongoing Delivery</span
			>
			<Button
				label="view history"
				severity="secondary"
				outlined
				size="small"
			/>
		</div>

		<div class="relative overflow-x-auto">
			<app-datatable-wrapper
      :columns="columns"
      :tableData="activities"
    >

      <!-- Table slot -->
      <template #table="{ tableData }">
        <app-datatable :columns="columns" :tableData="activities" />
      </template>

    </app-datatable-wrapper>
			
		</div>
	</section>
</template>

<style scoped></style>
