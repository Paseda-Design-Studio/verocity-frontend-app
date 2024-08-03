<script setup lang="ts">
	import { ref } from 'vue';

	const listItems = ref<shipmentProp[]>([
		{
			trackID: 'PCM-034PR0871',
			departure: 'F453/4 Gbatsuna Street, Nyaniba Estate',
			destination: '2333 W Jackson Blvd Chicago, Illinois(IL), 60612',
			status: 'in transit',
			date: '16th June 2024',
		},
		{
			trackID: 'PCM-034PR0871',
			departure: 'F453/4 Gbatsuna Street, Nyaniba Estate',
			destination: '2333 W Jackson Blvd Chicago, Illinois(IL), 60612',
			status: 'delivered',
			date: '16th June 2024',
		},
		{
			trackID: 'PCM-034PR0871',
			departure: 'F453/4 Gbatsuna Street, Nyaniba Estate',
			destination: '2333 W Jackson Blvd Chicago, Illinois(IL), 60612',
			status: 'in transit',
			date: '16th June 2024',
		},
	]);
</script>

<template>
	<section class="relative overflow-hidden py-10 sm:py-24">
		<div class="container">
			<h2 class="text-gray-900 text-3xl font-bold mb-6">Shipment</h2>
			<!-- filter -->
			<div class="filter flex justify-between mb-6">
				<!-- first column -->
				<div class="flex gap-2 items-center">
					<span class="text-sm text-[#344054] font-medium">Filter</span>
					<InputText
						placeholder="Date: All"
						class="w-28"
					/>
					<InputText
						placeholder="Status: All"
						class="w-28"
					/>
				</div>

				<!-- second column -->
				<div class="flex">
					<IconField>
						<InputIcon>
							<IconsSearch />
						</InputIcon>
						<InputText placeholder="Enter Tracking ID" />
					</IconField>
				</div>
			</div>

			<div class="content flex flex-col border border-gray-300 rounded-lg p-6">
				<ShipmentCard
					v-for="(item, index) in listItems"
					:key="index"
					:track-i-d="item.trackID"
					:departure="item.departure"
					:destination="item.destination"
					:status="item.status"
					:date="item.date"
				/>
			</div>
		</div>
	</section>
</template>

<style scoped></style>
