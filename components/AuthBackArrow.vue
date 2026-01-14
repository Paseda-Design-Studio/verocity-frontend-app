<script lang="ts" setup>
	interface Props {
		to?: string;
		className?: string;
		label?: boolean;
	}

	const props = withDefaults(defineProps<Props>(), {
		to: '/',
		className: 'text-2xl flex w-full',
		label: false,
	});
</script>

<template>
	<NuxtLink :to="to" :class="className">
		<div class="border border-gray-300 rounded p-1 flex items-center justify-center">
			<app-icon name="a-left" filled class="w-6 h-6" />
		</div>
		<span v-if="label" class="ml-2 font-medium text-[16px]">Back</span>
	</NuxtLink>
</template>

<style scoped></style>
