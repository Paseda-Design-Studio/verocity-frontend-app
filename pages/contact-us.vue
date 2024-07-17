<script setup lang="ts">
	import InputText from 'primevue/inputtext';
	import Textarea from 'primevue/textarea';
</script>

<template>
	<div>
		<section class="relative overflow-hidden bg-white py-10 sm:py-24">
			<div class="container">
				<div class="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-2">
					<div class="flex flex-col gap-16">
						<div class="flex flex-col gap-3">
							<h2
								class="text-2xl font-semibold tracking-tight text-gray-900 sm:text-4xl"
							>
								Contact us
							</h2>
							<p class="text-base text-gray-600">
								This is just an estimated cost for your shipment. Actual price
								may vary after creating a shipment
							</p>
						</div>

						<div class="flex flex-col gap-4">
							<div
								class="flex flex-col justify-end border-t rounded gap-2 py-8 px-6"
							>
								<div class="flex items-center">
									<img
										src="/call-icon.png"
										alt="Call icon"
										class=""
									/>
								</div>
								<div class="flex flex-col gap-2">
									<h3 class="text-xl font-semibold text-gray-800">Call</h3>
									<p class="text-sm text-gray-600 mb-0">
										<a
											href="tel:+39 3496 802 353"
											target="_blank"
											>+39 3496 802 353 </a
										>
									</p>
								</div>
							</div>

							<div
								class="flex flex-col justify-end border-t rounded gap-2 py-8 px-6"
							>
								<div class="flex items-center">
									<img
										src="/location-icon.png"
										alt="Call icon"
										class=""
									/>
								</div>
								<div class="flex flex-col gap-2">
									<h3 class="text-xl font-semibold text-gray-800">Address</h3>
									<p class="text-sm text-gray-600 mb-0">
										No 18, Swaniker street, Abelemkpe, Accra
									</p>
								</div>
							</div>
						</div>
					</div>

					<div class="flex flex-col gap-10">
						<form
							action=""
							method="post"
						>
							<div class="flex flex-col gap-1 mb-6">
								<label for="name">Name</label>
								<InputText
									id="name"
									placeholder="Name"
									aria-describedby="name"
								/>
							</div>

							<div class="flex gap-4 mb-6">
								<div class="flex flex-col gap-1 flex-grow">
									<label for="email">Email Address</label>
									<InputText
										id="email"
										placeholder="Email Address"
										aria-describedby="email"
									/>
								</div>

								<div class="flex flex-col gap-1 flex-grow">
									<label for="phone">Phone Number</label>
									<InputText
										id="phone"
										placeholder="Phone Number"
										aria-describedby="phone"
									/>
								</div>
							</div>

							<div class="flex flex-col gap-1 mb-6">
								<label for="company">Company</label>
								<InputText
									id="company"
									placeholder="Name of Company"
									aria-describedby="company"
								/>
							</div>

							<div class="flex flex-col gap-1 mb-6">
								<label for="message">Message</label>
								<Textarea
									variant="filled"
									rows="5"
									cols="30"
								/>
							</div>

							<div class="flex">
								<Button class="bg-primary text-white">Contact Us </Button>
							</div>
						</form>
					</div>
				</div>
			</div>
		</section>
	</div>
</template>

<style scoped></style>
