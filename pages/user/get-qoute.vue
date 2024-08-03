<script setup>
	const cities = ref([
		{ name: 'New York', code: 'NY' },
		{ name: 'Rome', code: 'RM' },
		{ name: 'London', code: 'LDN' },
		{ name: 'Istanbul', code: 'IST' },
		{ name: 'Paris', code: 'PRS' },
	]);
</script>

<template>
	<section class="bg-primary-600 ch-20 relative py-10 sm:py-24">
		<div class="container relative z-20">
			<div class="flex flex-col h-full justify-between">
				<div class="flex mb-6">
					<p
						class="text-xl leading-8 font-normal text-white uppercase"
						style="letter-spacing: 6px"
					>
						quotes
					</p>
				</div>
				<div class="flex justify-between items-center">
					<h2
						class="text-2xl font-semibold tracking-tight text-white sm:text-4xl"
					>
						Get Quick Quote
					</h2>
					<div class="flex">
						<p class="text-x leading-8 font-medium text-white">
							This is just an estimated cost for your shipment. Actual price may
							vary after creating a shipment
						</p>
					</div>
				</div>
			</div>
		</div>
		<div
			class="absolute inset-0 bg bg-center z-10 bg-[url('/faq-map.png')]"
		></div>
	</section>

	<section class="relative overflow-hidden py-10 sm:py-24">
		<div class="container">
			<div class="max-w-4xl mx-auto">
				<form
					action=""
					method="post"
				>
					<div class="flex flex-col gap-1 mb-6">
						<label
							class="text-sm"
							for="name"
							>Name</label
						>
						<InputText
							id="name"
							placeholder="Name"
							aria-describedby="name"
						/>
					</div>

					<div class="flex gap-4 mb-6">
						<div class="flex flex-col gap-1 flex-grow">
							<label
								class="text-sm"
								for="email"
								>Email Address</label
							>
							<InputText
								id="email"
								placeholder="Email Address"
								aria-describedby="email"
							/>
						</div>

						<div class="flex flex-col gap-1 flex-grow">
							<label
								class="text-sm"
								for="phone"
								>Phone Number</label
							>
							<InputText
								id="phone"
								placeholder="Phone Number"
								aria-describedby="phone"
							/>
						</div>
					</div>

					<div class="flex gap-4 mb-6">
						<div class="flex flex-col gap-1 flex-grow">
							<label
								class="text-sm"
								for="departure"
								>Departure</label
							>
							<InputText
								id="departure"
								placeholder="Select Departure Country"
							/>
						</div>

						<div class="flex flex-col gap-1 flex-grow">
							<label
								class="text-sm"
								for="destination"
								>Destination</label
							>
							<InputText
								id="destination"
								placeholder="Select Destination Country"
							/>
						</div>
					</div>

					<div class="flex flex-col gap-1 mb-6">
						<label
							class="text-sm"
							for="category"
							>Item Category</label
						>
						<InputText
							id="category"
							placeholder="Select an option"
							aria-describedby="category"
						/>
					</div>

					<div class="flex gap-4 mb-6">
						<div class="flex flex-col gap-1 flex-grow">
							<label
								class="text-sm"
								for="weight"
								>Weight(kg)</label
							>
							<InputText
								id="weight"
								placeholder="Enter Items Weight"
							/>
						</div>

						<div class="flex flex-col gap-1 flex-grow">
							<label
								class="text-sm"
								for="value"
								>Value Of Items($)</label
							>
							<InputText
								id="value"
								placeholder="Enter Items Value"
							/>
						</div>
					</div>

					<div class="flex flex-col gap-1 mb-6">
						<label
							class="text-sm"
							for="description"
							>Description</label
						>
						<Textarea
							variant="filled"
							rows="5"
							cols="30"
							placeholder="Add More Information Here"
						/>
					</div>

					<div class="flex mb-6">
						<div
							class="flex w-full items-center flex-col gap-2 h-[121px] justify-center py-3 px-4 border border-gray-400 rounded-lg"
						>
							<span class="price flex text-4xl text-gray font-bold">$0.00</span>
							<span class="block text-sm text-[#B4B4B3]"
								>Estimated shipping fee</span
							>
						</div>
					</div>

					<div class="flex justify-center">
						<Button
							class="bg-primary-600 text-white focus:outline-none py-3 px-5 rounded-md"
							>Get Quote
						</Button>
					</div>
				</form>
			</div>
		</div>
	</section>
</template>

<style scoped></style>
