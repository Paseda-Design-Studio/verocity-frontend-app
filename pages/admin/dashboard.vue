<script setup lang="ts">
	definePageMeta({
		layout: 'admin',
	});
</script>

<template>
	<header className="home-header">
		<HeaderBox
			type="greeting"
			title="Welcome"
			user="Toyosi"
			subtext="Overview"
		/>

		<Divider />

		<div class="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
			<StatisticsBox
				title="Total Shipment"
				:count="2420"
				subtext="40% vs last month"
			/>

			<StatisticsBox
				title="Ongoing Shipment"
				:count="2420"
				subtext="40% vs last month"
			/>

			<StatisticsBox
				title="Completed Shipment"
				:count="2420"
				subtext="40% vs last month"
			/>
		</div>
	</header>

	<section class="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
		<div class="flex flex-col gap-4 bg-white py-10 p-6 rounded">
			<div class="flex justify-between items-center">
				<span class="text-sm text-gray-900 font-bold capitalize"
					>New Shipment</span
				>
			</div>
			<div class="flex">
				<ChartBarChart />
			</div>
		</div>

		<div class="flex flex-col gap-4 bg-white py-10 p-6 rounded">
			<div class="flex justify-between items-center">
				<span class="text-sm text-gray-900 font-bold capitalize"
					>Status overview</span
				>
			</div>
			<div class="flex">
				<!-- <ChartHighChart/> -->
			</div>
		</div>
	</section>

	<section class="flex flex-col gap-2">
		<div class="flex justify-between items-center">
			<span class="text-sm text-gray-900 font-bold capitalize"
				>Recent Activity</span
			>
			<Button
				label="view all"
				severity="secondary"
				outlined
				size="small"
			/>
		</div>

		<div class="relative overflow-x-auto">
			<table
				class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400"
			>
				<thead
					class="text-xs text-gray-700 capitalize bg-gray-100 dark:bg-gray-700 dark:text-gray-400"
				>
					<tr>
						<th class="px-6 py-3">Customer name</th>
						<th class="px-6 py-3">Shipment ID</th>
						<th class="px-6 py-3">Shipment Date</th>
						<th class="px-6 py-3">From</th>
						<th class="px-6 py-3">Destination</th>
						<th class="px-6 py-3">Status</th>
						<th class="px-6 py-3">Action</th>
					</tr>
				</thead>
				<tbody>
					<tr
						class="bg-white"
					>
						<th class="px-6 py-3 whitespace-nowrap">Jane Oliver</th>
						<td class="px-6 py-3">PCM-034PR0871</td>
						<td class="px-6 py-3">24 Apr 2023</td>
						<td class="px-6 py-3">United States</td>
						<td class="px-6 py-3">Ghana</td>
						<td class="px-6 py-3">pending</td>
						<td class="px-6 py-3">
							<Button
								label="view"
								severity="secondary"
								outlined
								size="small"
							/>
						</td>
					</tr>
				</tbody>
			</table>
		</div>
	</section>
</template>

<style scoped></style>
