<script lang="ts" setup>
	const tabs = ref([
		{ title: 'Title 1', content: 'Content 1', value: '0' },
		{ title: 'Title 2', content: 'Content 2', value: '1' },
		{ title: 'Title 3', content: 'Content 3', value: '2' },
	]);
</script>

<template>
	<div>
		<section class="bg-primary-600 py-10 sm:py-24">
			<div class="container">
				<div class="flex items-center flex-col justify-center">
					<h2
						class="text-2xl font-semibold tracking-tight text-white sm:text-4xl"
					>
						Frequently asked questions
					</h2>
					<p class="text-sm sm:text-base text-center text-gray-200 mt-2 sm:mt-4">
						Everything you need to know about propverse developers.
					</p>
				</div>
			</div>
		</section>

		<section class="bg-white py-10 sm:py-24">
			<div class="container max-w-5xl">
				<Accordion />
			</div>
		</section>
	</div>
</template>

<style scoped></style>
