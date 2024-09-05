<script setup lang="ts">
	const props = defineProps<{
		title: string;
		subtext?: string;
		count: number;
	}>();
</script>

<template>
	<div
		class="flex flex-col bg-white p-6 h-[100px] md:h-[176px] rounded-lg border border-gray-200"
	>
		<p class="font-medium text-gray-700 text-16 mb-3 md:mb-4">
			{{ title }}
		</p>
		<div class="flex flex-row items-center">
			<p class="font-semibold text-3xl lg:text-4xl text-gray-900">
				<!-- <AnimatedCounter v-if="props.count" :value="props.count" :duration="500" class="counter" /> -->
				<span> {{ formatAmount(count) }}</span>
			</p>
		</div>
		<p
			v-if="subtext"
			class="flex text-gray-500 text-xs sm:text-xs sm:leading-6 mt-3 md:mt-4"
		>
			<img
				src="/icons/arrow-up.svg"
				alt=""
			/>{{ subtext }}
		</p>
	</div>
</template>
