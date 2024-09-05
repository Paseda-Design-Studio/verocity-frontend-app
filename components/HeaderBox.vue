<script setup lang="ts">
	const props = defineProps<{
		type: string;
		title: string;
		subtext: string;
		user: string;
	}>();
</script>

<template>
	<section class="flex justify-between items-center">
		<div class="header-box">
			<h1 class="header-box-title">
				{{ title
				}}<span
					v-if="type === 'greeting'"
					class="text-bankGradient"
					>,&nbsp;{{ user }}!</span
				>
			</h1>
			<p class="header-subtext">{{ subtext }}</p>
		</div>
		<!-- button -->
		<Button
			class="bg-primary-600 text-white focus:outline-none py-3 px-5 rounded-md"
			>Add shipment
		</Button>
	</section>
</template>
