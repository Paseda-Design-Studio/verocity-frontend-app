<script setup lang="ts">
	import { carouselResponsiveOptions } from '~/utils/helper';

	const props = defineProps({
		color: {
			default: 'primary',
		},
	});

	const testimonies = ref<testimonyProp[]>([
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
	<section
		class="flex-col justify-between h-full p-4 sm:p-6 rounded-2xl hidden relative lg:flex"
		:class="props.color === 'primary' ? 'bg-primary-600' : 'bg-secondary-600'"
	>
		<div class="logo flex relative z-30">
			<RouterLink to="/">
				<img
					:src="
						props.color === 'primary'
							? '/logo/logo.png'
							: '/logo/footer-logo.png'
					"
					class="h-12"
					alt="Company Logo"
				/>
			</RouterLink>
		</div>

		<!-- content -->
		<div class="auth-content flex flex-col gap-2 max-w-sm relative z-30">
			<h3 class="text-2xl text-white font-semibold">
				Start your journey with us
			</h3>
			<p class="text-sm font-normal text-white">
				Services are sourced and procured based on solution specifications
				provided by our Supply Chain Solution.
			</p>
		</div>

		<!-- testimonial -->
		<div class="auth-content flex relative z-30 flex-col gap-2 max-w-sm">
			<Carousel
				:value="testimonies"
				:numVisible="1"
				:numScroll="1"
				:responsiveOptions="carouselResponsiveOptions"
				:showNavigators="false"
				:showIndicators="true"
				containerClass="flex w-full gap-10"
				class="flex gap-5"
			>
				<template #item="slotProps">
					<div
						class="flex flex-col gap-4 py-5 px-6 rounded-lg"
						:class="props.color === 'primary' ? 'bg-[#D35B40]' : 'bg-[#262F4D]'"
					>
						<p class="text-sm leading-[26px] text-gray-100">
							{{ slotProps.data.content }}
						</p>
						<div class="flex items-center gap-2">
							<img
								:src="slotProps.data.icon"
								:alt="slotProps.data.name"
								class="w-9 h-9"
							/>
							<div class="flex flex-col gap-0">
								<span class="text-sm font-semibold text-gray-200">
									{{ slotProps.data.name }}
								</span>
								<span class="text-xs text-gray-300">
									{{ slotProps.data.designation }}
								</span>
							</div>
						</div>
					</div>
				</template>
			</Carousel>
		</div>

		<div class="absolute inset-0 bg-cover bg-[url('/auth-map.png')]"></div>
	</section>
</template>

<style></style>
