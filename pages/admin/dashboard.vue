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
			<div class="flex gap-2"></div>
		</div>

		<div class="flex flex-col gap-4 bg-white py-10 p-6 rounded">
			<div class="flex justify-between items-center">
				<span class="text-sm text-gray-900 font-bold capitalize"
					>Status overview</span
				>
			</div>
			<div class="flex gap-2"></div>
		</div>
	</section>
</template>

<style scoped></style>
