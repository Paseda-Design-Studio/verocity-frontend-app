<script setup lang="ts">
	interface ourValueProps {
		title: string;
		description: string;
		icon?: string;
	}

	const ourValues = ref<ourValueProps[]>([
		{
			title: 'Quality',
			description:
				'Pretium odio in dolor lectus laoreet tellus in morbi. Pulvinar pharetra elit dui adipiscing.',
			icon: '/flexible-icon.png',
		},

		{
			title: 'Commitment',
			description:
				'Pretium odio in dolor lectus laoreet tellus in morbi. Pulvinar pharetra elit dui adipiscing.',
			icon: '/commitment.png',
		},

		{
			title: 'Communication',
			description:
				'Pretium odio in dolor lectus laoreet tellus in morbi. Pulvinar pharetra elit dui adipiscing.',
			icon: '/communication.png',
		},

		{
			title: 'Innovation',
			description:
				'Pretium odio in dolor lectus laoreet tellus in morbi. Pulvinar pharetra elit dui adipiscing.',
			icon: '/innovation.png',
		},

		{
			title: 'Leadership',
			description:
				'Pretium odio in dolor lectus laoreet tellus in morbi. Pulvinar pharetra elit dui adipiscing.',
			icon: '/leadership.png',
		},

		{
			title: 'Openness',
			description:
				'Pretium odio in dolor lectus laoreet tellus in morbi. Pulvinar pharetra elit dui adipiscing.',
			icon: '/openess.png',
		},
	]);

	const products = ref();
</script>

<template>
	<div>
		<section class="relative overflow-hidden py-10 sm:py-24">
			<div class="container">
				<div class="max-w-3xl">
					<h2
						class="text-3xl font-semibold max-w-3xl text-gray-900 sm:text-5xl sm:pl-16"
					>
						Delivering seamless logistics solutions for businesses
					</h2>
				</div>

				<div class="mt-10 sm:mt-16 flex">
					<img
						src="/about-3.png"
						alt=""
						class="object-contain rounded-e"
					/>
				</div>
			</div>
		</section>

		<section class="relative overflow-hidden py-10 sm:py-24">
			<div class="container">
				<div class="grid grid-cols-1 sm:grid-cols-2 gap-8 items-center">
					<div class="gap-10">
						<h2 class="text-3xl mb-4 font-semibold text-gray-900 sm:text-3xl">
							Our story
						</h2>

						<p class="text-lg text-gray-700 dark:text-gray-200">
							Providing an independent advice and identifying the right fit for
							you. Services are sourced and procured based on solution
							specifications provided by our Supply Chain Solution. We take
							responsibility for the performance of all our suppliers and for
							ensuring the availability of resources and equipment needed to
							control the flow of goods under our charge.
						</p>

						<Button class="inline-block mt-10 px-5">
							<NuxtLink
								class="flex gap-2 text-white"
								to="/"
							>
								<span> Get a quote </span>
								<IconsArrowRight />
							</NuxtLink>
						</Button>
					</div>
					<div class="flex">
						<img
							src="/about-4.png"
							alt=""
							class="object-contain rounded-e"
						/>
					</div>
				</div>
			</div>
		</section>

		<section class="relative overflow-hidden bg-[#EBEDF1] py-10 sm:py-24">
			<div class="container">
				<div class="flex flex-col items-center max-w-3xl mx-auto gap-4">
					<h2
						class="text-2xl font-semibold tracking-tight text-gray-900 sm:text-4xl"
					>
						The values that drives everything we do
					</h2>
					<p class="text-base text-center text-gray-600">
						Lorem ipsum dolor sit amet consectetur. Facilisis nibh nisi purus
						odio. In a mattis tincidunt pellentesque.
					</p>
				</div>

				<div
					class="grid grid-cols-1 gap-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3 mt-12"
				>
					<div
						class="flex flex-col gap-4 bg-white py-10 px-8 rounded"
						v-for="item in ourValues"
						:key="item.title"
					>
						<div class="flex justify-center items-center">
							<img
								:src="item.icon"
								:alt="item.title"
								class="w-14 h-14"
							/>
						</div>
						<div class="flex flex-col text-center gap-2">
							<h3 class="text-lg leading-7 text-gray-900">{{ item.title }}</h3>
							<p class="text-sm text-gray-700">
								{{ item.description }}
							</p>
						</div>
					</div>
				</div>
			</div>
		</section>

		<Testimonial />

		<CallToAction />
	</div>
</template>

<style scoped></style>
