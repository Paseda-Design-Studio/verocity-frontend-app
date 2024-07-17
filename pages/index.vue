<script setup lang="ts"></script>

<template>
	<div>
		<section
			class="bg-center bg-no-repeat hero-bg bg-gradient-to-t from-black/10 to-black via-black bg-blend-multiply"
		>
			<div class="px-4 mx-auto max-w-screen-lg text-center py-24 lg:py-56">
				<h1
					class="mb-4 text-4xl tracking-tight leading-none text-white md:text-5xl lg:text-7xl"
				>
					Delivering seamless logistics solutions for you
				</h1>
				<p
					class="mb-8 text-sm font-light text-white lg:text-base sm:px-16 lg:px-48"
				>
					Let us handle your logistics, so you can focus on what matters most.
				</p>

				<div
					class="flex flex-col gap-2 space-y-4 sm:flex-row sm:justify-center sm:space-y-0"
				>
					<InputText
						type="text"
						size="large"
						placeholder="Input tracking ID"
						class=""
					/>

					<Button
						label="Track"
						class="py-2.5 px-5"
					/>
				</div>
			</div>
		</section>

		<section class="relative overflow-hidden py-10 sm:py-24">
			<div class="container">
				<div class="text-center max-w-3xl mx-auto">
					<h2
						class="text-2xl font-semibold tracking-tight text-gray-900 sm:text-4xl"
					>
						Flexible and efficient delivery solutions.
					</h2>
					<p class="mt-2 mb-0 text-sm md:max-w-lg mx-auto text-gray-700">
						Our logistics services are designed to adapt to your business needs,
						whether you're an individual, startup or a large corporation.
					</p>
				</div>

				<div
					class="mt-10 grid grid-cols-1 gap-8 sm:mt-16 sm:grid-cols-2 lg:grid-cols-3"
				>
					<div class="flex flex-col bg-[#FBFAF7] gap-4 py-10 px-8">
						<div class="flex justify-center items-center">
							<img
								src="/flexible-icon.png"
								alt=""
								class="w-14 h-14"
							/>
						</div>
						<div class="flex flex-col text-center gap-2">
							<h3 class="text-lg leading-7 text-gray-900">Offices worldwide</h3>
							<p class="text-sm text-gray-700">
								Airfreight is fast-moving, challenging and constantly changing –
								it’s the nature of the business.
							</p>
						</div>
					</div>

					<div class="flex flex-col bg-[#FBFAF7] gap-4 py-10 px-8">
						<div class="flex justify-center items-center">
							<img
								src="/flexible-icon.png"
								alt=""
								class="w-14 h-14"
							/>
						</div>
						<div class="flex flex-col text-center gap-2">
							<h3 class="text-lg leading-7 text-gray-900">Oversea shipping</h3>
							<p class="text-sm text-gray-700">
								Our non-asset based Land network provides you with flexibility,
								improved service and accelerated delivery.
							</p>
						</div>
					</div>

					<div class="flex flex-col bg-[#FBFAF7] gap-4 py-10 px-8">
						<div class="flex justify-center items-center">
							<img
								src="/flexible-icon.png"
								alt=""
								class="w-14 h-14"
							/>
						</div>
						<div class="flex flex-col text-center gap-2">
							<h3 class="text-lg leading-7 text-gray-900">Get A Quote</h3>
							<p class="text-sm text-gray-700">
								Customized solutions for your specific ocean freight requirement
								are at the heart of our services.
							</p>
						</div>
					</div>
				</div>
			</div>
		</section>

		<section class="relative overflow-hidden py-10 sm:py-24">
			<div class="container">
				<div class="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-2">
					<div class="flex flex-col gap-10">
						<h2
							class="text-2xl font-semibold tracking-tight text-gray-900 sm:text-4xl"
						>
							We ship with speed domestically within Ghana and to and from the
							US
						</h2>

						<div class="flex flex-col text-center">
							<img
								src="/about-us-1.png"
								class="object-contain"
								alt="About us image"
							/>
						</div>
					</div>

					<div class="flex flex-col gap-10">
						<div class="flex flex-col text-center">
							<img
								src="/about-us-2.png"
								class="object-contain"
								alt="About us image"
							/>
						</div>
						<p class="text-base text-gray-700">
							Our global logistics expertise, advanced supply chain technology &
							customized logistics solutions will help you analyze, develop and
							implement successful supply chain management strategies from
							end-to-end.
						</p>

						<NuxtLink to="/">
							<Button
								label="About Us"
								class="uppercase text-white font-normal"
							/>
						</NuxtLink>
					</div>
				</div>
			</div>
		</section>

		<section class="relative overflow-hidden bg-[#EBEDF1] py-10 sm:py-24">
			<div class="container">
				<div class="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-2">
					<div class="flex flex-col gap-16">
						<div class="flex flex-col gap-3">
							<h2
								class="text-2xl font-semibold tracking-tight text-gray-900 sm:text-4xl"
							>
								How We Help Businesses Across The World.
							</h2>
							<p class="text-base text-gray-600">
								Providing an independent advice and identifying the right fit
								for you. Services are sourced and procured based on solution
								specifications provided by our Supply Chain Solution.
							</p>
						</div>

						<div class="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-2">
							<div
								class="flex flex-col bg-primary-600 rounded text-white gap-2 py-8 px-6"
							>
								<div class="flex items-center">
									<IconsSmile />
								</div>
								<div class="flex flex-col gap-2">
									<h3 class="text-2xl text-white">98%</h3>
									<p class="text-sm text-white">Positive Feedback</p>
								</div>
							</div>

							<div
								class="flex flex-col bg-secondary-600 rounded text-white gap-2 py-8 px-6"
							>
								<div class="flex items-center">
									<IconsSmile />
								</div>
								<div class="flex flex-col gap-2">
									<h3 class="text-2xl text-white">20+</h3>
									<p class="text-sm text-white">Years of Experience</p>
								</div>
							</div>
						</div>
					</div>

					<div class="flex flex-col gap-10">
						
					</div>
				</div>
			</div>
		</section>

		<CallToAction />
	</div>
</template>

<style scoped>
	.hero-bg {
		background-image: url('/hero-1.png');
	}
</style>
