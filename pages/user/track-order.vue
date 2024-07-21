<script setup>
	import { ref } from 'vue';

	const lists = ref([
		{
			title: 'Ship now',
			description:
				'Airfreight is fast-moving, challenging and constantly changing – it’s the nature of the business.',
		},
		{
			title: 'Oversea shipping',
			description:
				'Our non-asset based Land network provides you with flexibility, improved service and accelerated delivery.',
		},
		{
			title: 'Get A Quote',
			description:
				'Customized solutions for your specific ocean freight requirement are at the heart of our services.',
		},
	]);
</script>

<template>
	<section class="bg-primary-600 py-10 sm:py-24 relative">
		<div class="container relative z-20">
			<div class="flex items-center flex-col justify-center">
				<h2
					class="text-2xl font-semibold tracking-tight text-white sm:text-4xl"
				>
					Welcome Ugebge
				</h2>

				<div class="flex gap-2 w-full justify-center items-end mt-8">
					<div class="flex w-full flex-col gap-2">
						<label
							class="text-sm text-white"
							for="track"
							>Track your shipment</label
						>
						<InputText
							type="text"
							size="large"
							name="track"
							placeholder="Input tracking ID"
							class="w-full flex-1"
						/>
					</div>

					<Button
						label="Track"
						class="bg-secondary-600 text-white focus:outline-none py-4 px-8 rounded-md"
					/>
				</div>
				<div class="flex mt-2">
					<p class="text-sm font-normal text-white">
						Need help changing your delivery?
						<NuxtLink
							to="/contact-us"
							class="font-semibold hover:underline"
							>Get Help</NuxtLink
						>
					</p>
				</div>
			</div>
		</div>
		<div
			class="absolute inset-0 bg bg-center z-10 bg-[url('/faq-map.png')]"
		></div>
	</section>

	<section class="relative overflow-hidden py-10 sm:py-24">
		<div class="container">
			<div class="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
				<div
					class="flex flex-col bg-[#FBFAF7] gap-4 py-10 px-8 transform transition duration-200 hover:scale-110 hover:shadow-2xl"
					v-for="item in lists"
					:key="item.title"
				>
					<div
						class="flex justify-center items-center bg-gray-500 w-14 h-14 mx-auto rounded-lg"
					></div>
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
</template>

<style scoped></style>
