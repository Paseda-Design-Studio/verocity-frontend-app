<template>
	<div
		id="accordion-open"
		data-accordion="open"
	>
		<h2
			v-for="(item, index) in items"
			:key="index"
			:id="'accordion-open-heading-' + (index + 1)"
		>
			<button
				type="button"
				class="flex items-center justify-between w-full p-5 font-medium rtl:text-right text-gray-900 border-b border-gray-200 focus:ring-1 focus:ring-gray-00 dark:focus:ring-gray-800 dark:border-gray-700 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 gap-3 text-left"
				:data-accordion-target="'#accordion-open-body-' + (index + 1)"
				@click="toggleAccordion(index)"
				:aria-expanded="activeIndex === index"
				:aria-controls="'accordion-open-body-' + (index + 1)"
			>
				<span class="flex items-center">
					{{ item.title }}
				</span>
				<svg
					data-accordion-icon
					class="w-3 h-3 rotate-180 shrink-0"
					:class="{ '!rotate-0': activeIndex === index }"
					aria-hidden="true"
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 10 6"
				>
					<path
						stroke="currentColor"
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M9 5 5 1 1 5"
					/>
				</svg>
			</button>
			<div
				:id="'accordion-open-body-' + (index + 1)"
				:class="{ hidden: activeIndex !== index }"
				:aria-labelledby="'accordion-open-heading-' + (index + 1)"
			>
				<div class="p-5 border-gray-200 dark:border-gray-700 dark:bg-gray-900">
					<p
						v-html="item.content"
						class="mb-2 text-gray-600 dark:text-gray-400"
					></p>
				</div>
			</div>
		</h2>
	</div>
</template>

<script setup lang="ts">
	const items = [
		{
			title: 'What services does your logistics company provide?',
			content:
				'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt.Lorem ipsum dolor sit amet, consetetur sadipscing elitr.',
		},

		{
			title: 'How can I track my shipment or order?',
			content:
				'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt.Lorem ipsum dolor sit amet, consetetur sadipscing elitr.',
		},

		{
			title: 'What is the estimated delivery time for my shipment?',
			content:
				'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt.Lorem ipsum dolor sit amet, consetetur sadipscing elitr.',
		},

		{
			title: 'Do you offer international shipping services?',
			content:
				'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt.Lorem ipsum dolor sit amet, consetetur sadipscing elitr.',
		},

		{
			title: 'Can I get a quote for shipping my products?',
			content:
				'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt.Lorem ipsum dolor sit amet, consetetur sadipscing elitr.',
		},

		{
			title: 'What are your shipping rates and fees?',
			content:
				'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt.Lorem ipsum dolor sit amet, consetetur sadipscing elitr.',
		},

		{
			title: 'What services does your logistics company provide?',
			content:
				'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt.Lorem ipsum dolor sit amet, consetetur sadipscing elitr.',
		},
	];

	const activeIndex = ref(null);

	const toggleAccordion = (index: any) => {
		activeIndex.value = activeIndex.value === index ? null : index;
	};
</script>

<style scoped>
	.hidden {
		display: none;
	}
</style>
