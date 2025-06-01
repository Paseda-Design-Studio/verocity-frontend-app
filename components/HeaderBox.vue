<script setup lang="ts">
	const props = defineProps<{
		type?: string;
		title: string;
		subtext?: string;
		user?: string;
		action?: boolean;
	}>();
</script>

<template>
	<section class="flex justify-between items-center">
		<div
			class="header-box"
			v-if="type === 'greeting'"
		>
			<h1 class="header-box-title">
				{{ title }}<span class="text-bankGradient">,&nbsp;{{ user }}!</span>
			</h1>
			<p class="header-subtext">{{ subtext }}</p>
		</div>
		<div
			class="header-box"
			v-else
		>
			<h1 class="header-box-title">
				{{ title }}
			</h1>
		</div>
		<!-- button -->
		<Button
			v-if="action"
			class="bg-primary-600 text-white focus:outline-none focus:ring-0 py-3 px-5 rounded-md"
			>Add shipment
		</Button>
	</section>
</template>
