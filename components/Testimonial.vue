<script lang="ts" setup>
	const testimonies = ref<testimonyProp[]>([
		{
			name: 'Ronald Richards',
			content:
				'Cagoworks is our trusted partner in streamlining our distribution network. Their expertise has saved us time and money.',
			designation: 'Artist / Curator',
			icon: '/testimony-icon.png',
		},

		{
			name: 'Charlotte Smith',
			content:
				'Reliable, professional, and cost-effective—Cagoworks has become an integral part of our supply chain. We highly recommend their services.',
			designation: 'CEO, GreenGrocer Foods',
			icon: '/testimony-icon.png',
		},
		{
			name: 'Ronald Richards',
			content:
				'Cagoworks is our trusted partner in streamlining our distribution network. Their expertise has saved us time and money.',
			designation: 'Artist / Curator',
			icon: '/testimony-icon.png',
		},
	]);

</script>

<template>
	<section class="relative overflow-hidden py-10 sm:py-24">
		<div class="container">
			<div class="flex gap-2 items-center justify-between">
				<div class="flex flex-col gap-2">
					<h2
						class="text-2xl font-semibold tracking-tight text-gray-900 sm:text-4xl"
					>
						Hear from our customers
					</h2>
					<p class="text-base text-gray-600">
						Lorem ipsum dolor sit amet consectetur. Facilisis nibh nisi purus
						odio.
					</p>
				</div>

				<div class="flex gap-4">
					<Button
						rounded
						outlined
						aria-label="Filter"
						severity="contrast"
						size="small"
					>
						<IconsArrowLeft />
					</Button>

					<Button
						rounded
						outlined
						aria-label="Filter"
						severity="contrast"
						size="small"
					>
						<IconsArrowRight
					/></Button>
				</div>
			</div>

			<div class="flex mt-10">
				<Carousel
					:value="testimonies"
					:numVisible="3"
					:numScroll="3"
					:responsiveOptions="carouselResponsiveOptions"
          :showNavigators="false"
          :showIndicators="false"
					containerClass="flex w-full gap-10"
					class="flex gap-5"
				>
					<template #item="slotProps">
						<div
							class="flex flex-col m-4 gap-4 bg-[#F9FAFB] py-10 px-8 rounded"
						>
							<p class="text-lg leading-[30px] text-gray-700">
								{{slotProps.data.content}}
							</p>
							<div class="flex items-center gap-2">
								<img
									:src="slotProps.data.icon"
									:alt="slotProps.data.name"
									class="w-9 h-9"
								/>
								<div class="flex flex-col gap-0">
									<span class="text-sm font-semibold text-gray-800">
										{{ slotProps.data.name }}
									</span>
									<span class="text-xs text-gray-600">
										{{ slotProps.data.designation }}
									</span>
								</div>
							</div>
						</div>
					</template>
				</Carousel>
			</div>
		</div>
	</section>
</template>

<style scoped></style>
