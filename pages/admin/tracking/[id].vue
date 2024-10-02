<script setup lang="ts">
	definePageMeta({
		layout: 'admin',
	});

	import { ref } from 'vue';

	const events = ref([
		{
			id: 1,
			name: 'Order has left Verocity Shipping distribution center Chicago , USA to 2333 W Jackson Blvd Chicago, Illinois(IL), 60612',
			status: 'Ordered',
			date: 'Sat, Jun 22, 2024, 03:19pm',
			author: 'Confirmed by Tommy Thelma',
		},
		{
			id: 2,
			name: 'Order has arrived Verocity Shipping distribution center Chicago , USA',
			status: 'Processing',
			date: 'Sat, Jun 22, 2024, 03:19pm',
			author: 'Confirmed by Tommy Thelma',
		},
		{
			id: 3,
			name: 'Order has left Verocity Shipping distribution center Accra , Ghana to Verocity Shipping distribution center Chicago , USA',
			status: 'Shipped',
			date: 'Sat, Jun 22, 2024, 03:19pm',
			author: 'Confirmed by Tommy Thelma',
		},
		{
			id: 4,
			name: 'Shipment received at Verocity Shipping Accra, Ghana',
			status: 'Delivered',
			date: 'Sat, Jun 22, 2024, 03:19pm',
			author: 'Confirmed by Tommy Thelma',
		},
	]);

	const visible = ref(false);

	const selectedCity = ref();

	const cities = ref([
		{ name: 'New York', code: 'NY' },
		{ name: 'Rome', code: 'RM' },
		{ name: 'London', code: 'LDN' },
		{ name: 'Istanbul', code: 'IST' },
		{ name: 'Paris', code: 'PRS' },
	]);
</script>

<template>
	<header class="home-header !gap-0">
		<NuxtLink
			to="/admin/settings/tracking"
			class="flex gap-2 items-center"
		>
			<span
				class="flex justify-center items-center border border-[#D0D5DD] p-0.5"
			>
				<img src="/icons/arrow-left.svg" />
			</span>
			Back
		</NuxtLink>
	</header>

	<Divider />

	<div class="flex justify-between items-center">
		<div>
			<h1 class="header-box-title !text-2xl">Tracking details</h1>
		</div>
		<Button
			@click="visible = true"
			class="bg-primary-600 text-white focus:outline-none focus:ring-0 py-3 px-5 rounded-md"
			>Update Status
		</Button>
	</div>

	<div class="flex flex-col bg-white rounded">
		<div
			class="card-header flex flex-col md:flex-row justify-between py-6 px-6 gap-4 md:gap-0"
		>
			<div class="details flex flex-col gap-2">
				<span class="text-sm text-gray-500"> Shipping ID </span>
				<span class="flex text-gray-900 text-2xl tracking-tight font-bold">
					PCM-034PR0871
				</span>
			</div>

			<div class="details flex flex-wrap md:gap-14 gap-6">
				<div class="flex flex-col gap-2">
					<span class="text-sm text-gray-500">Payment Status </span>
					<span class="flex text-gray-900 text-2xl tracking-tight font-bold">
						<Tag
							severity="warn"
							class="flex py-2 px-3 !rounded-lg capitalize bg-[#269D44] text-white"
							value="Paid"
							rounded
						/>
					</span>
				</div>

				<div class="flex flex-col gap-2">
					<span class="text-sm text-gray-500">Delivery Status </span>
					<span class="flex text-gray-900 text-2xl tracking-tight font-bold">
						<Tag
							severity="warn"
							class="flex py-2 px-3 rounded-lg border-[#FEDF89] bg-[#FFFAEB] text-[#DF8703]"
							value="In transit"
						/>
					</span>
				</div>

				<div class="flex flex-col gap-2">
					<span class="text-sm text-gray-500">Date Created </span>
					<span class="flex text-gray-900 text-base tracking-tight font-bold">
						June 16, 2024, 9:30am
					</span>
				</div>
				<div class="flex flex-col gap-2">
					<span class="text-sm text-gray-500">Tracking ID </span>
					<span class="flex text-gray-900 text-base tracking-tight font-bold">
						63728DGHH94636
					</span>
				</div>
			</div>
		</div>
		<Divider />
		<div class="px-6 py-6">
			<ol
				class="relative border-s-2 border-s-green-500 border-gray-200 dark:border-gray-700"
			>
				<li
					class="mb-10 ms-6"
					v-for="item in events"
					:key="item.status"
				>
					<span
						class="absolute flex items-center justify-center w-6 h-6 bg-green-500 rounded-full -start-3 ring-white dark:ring-gray-900 dark:bg-blue-900"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="w-4 h-4 text-white dark:text-blue-300"
							viewBox="0 0 24 24"
						>
							<path
								fill="currentColor"
								d="M9 16.17L4.83 12l-1.42 1.41L9 19L21 7l-1.41-1.41z"
							/>
						</svg>
					</span>

					<div class="flex flex-col gap-2">
						<div class="flex justify-between">
							<h3
								class="flex items-center max-w-3xl text-sm font-semibold text-gray-900 dark:text-white"
							>
								{{ item.name }}
							</h3>

							<time
								class="block text-xs font-normal leading-none text-gray-500 dark:text-gray-500"
								>{{ item.date }}</time
							>
						</div>

						<span
							class="block text-xs font-normal leading-none text-gray-500 dark:text-gray-500"
							>{{ item.author }}</span
						>
					</div>
				</li>
			</ol>
		</div>
	</div>

	<div class="card flex justify-center">
		<Dialog
			v-model:visible="visible"
			modal
			header="Update Status"
		>
			<div class="flex flex-col gap-1 mb-4">
				<label
					for="status"
					class="font-semibold w-24"
					>Status</label
				>
				<select
					id="countries"
					class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
				>
					<option selected>Choose an option</option>
					<option value="pending">Pending</option>
					<option value="out_for_delivery">Out For Delivery</option>
					<option value="in_transit">In Transit</option>
					<option value="delivered">Delivered</option>
					<option value="delayed">Delayed</option>
					<option value="Cancelled">Cancelled</option>
				</select>
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
	</div>
</template>

<style scoped></style>
