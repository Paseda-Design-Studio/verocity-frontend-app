<script setup lang="ts">
	const props = defineProps({
		trackID: {
			type: String,
		},
		departure: {
			type: String,
		},
		destination: {
			type: String,
		},
		status: {
			type: String,
		},
		date: {
			type: String,
		},
	});
</script>

<template>
	<div class="flex flex-col gap-2 border-b border-gray-600 py-6">
		<div class="header flex justify-between items-center w-full">
			<span class="flex text-gray-900 text-2xl tracking-tight font-bold">{{
				props.trackID
			}}</span>
			<Tag
				severity="warn"
				:value="props.status"
				class="flex py-1 px-3 rounded-2xl capitalize border border-solid"
				:class="
					props.status === 'delivered'
						? 'border-[#ABEFC6] bg-[#ECFDF3] text-[#067647]'
						: 'border-[#FEDF89] bg-[#FFFAEB] text-[#DF8703]'
				"
			></Tag>
		</div>

		<div class="body flex gap-2 flex-col">
			<div class="flex justify-between items-center w-full relative">
				<div class="flex gap-4">
					<img
						src="/departure-icon.png"
						alt="departure icon"
					/><span class="flex text-[#1B1C1E] text-sm">{{
						props.departure
					}}</span>
				</div>

				<span class="flex text-[#1B1C1E] text-sm"
					>Shipping date: <span>{{ props.date }}</span></span
				>
			</div>

			<div class="flex justify-between items-center w-full">
				<div class="flex gap-4">
					<img
						src="/destination-icon.png"
						alt="departure icon"
					/>
					<span class="flex text-[#1B1C1E] text-sm">{{
						props.destination
					}}</span>
				</div>

				<NuxtLink class="flex text-[#F0522C] text-base font-medium underline"
					>View Details</NuxtLink
				>
			</div>
		</div>
	</div>
</template>

<style></style>
