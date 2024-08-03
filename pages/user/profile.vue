<script setup lang="ts"></script>

<template>
	<section class="relative overflow-hidden py-10 sm:py-12 bg-gray-50">
		<div class="container">
			<div class="max-w-6xl mx-auto">
				<h2 class="text-gray-900 text-3xl font-bold">Profile</h2>
				<Divider />

				<div class="flex flex-col gap-4 rounded mt-12">
					<div
						class="grid grid-cols-1 gap-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-2 mb-6 py-8 px-6 md:px-10 bg-white"
					>
						<h3 class="text-secondary-600 font-bold text-base">
							Personal information
						</h3>

						<!-- personal information FORM -->
						<div class="flex flex-col gap-10">
							<form
								action=""
								method="post"
							>
								<div class="flex flex-col md:flex-row gap-4 mb-6">
									<div class="flex flex-col gap-1 flex-grow">
										<label
											class="text-sm"
											for="firstName"
											>First Name</label
										>
										<InputText
											id="firstName"
											placeholder="First Name"
											aria-describedby="firstName"
										/>
									</div>

									<div class="flex flex-col gap-1 flex-grow">
										<label
											class="text-sm"
											for="lastName"
											>Last Name</label
										>
										<InputText
											id="lastName"
											placeholder="Last Name"
											aria-describedby="lastName"
										/>
									</div>
								</div>

								<div class="flex flex-col gap-1 mb-6">
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

								<div class="flex flex-col gap-1 mb-6">
									<label
										class="text-sm"
										for="phoneNumber"
										>Phone Number</label
									>
									<InputText
										id="phoneNumber"
										placeholder="Phone Number"
										aria-describedby="phoneNumber"
									/>
								</div>
							</form>
						</div>
					</div>

					<div
						class="grid grid-cols-1 gap-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-2 mb-6 py-8 px-6 md:px-10 bg-white"
					>
						<h3 class="text-secondary-600 font-bold text-base">Address</h3>

						<!-- personal information FORM -->
						<div class="flex flex-col">
							<div class="flex flex-col gap-1 mb-6">
								<label
									class="text-sm"
									for="address"
									>Address</label
								>
								<InputText
									id="address"
									placeholder="Address"
									aria-describedby="address"
								/>
							</div>
							<div class="flex flex-col md:flex-row gap-4 mb-6">
								<div class="flex flex-col gap-1 flex-grow">
									<label
										class="text-sm"
										for="city"
										>City</label
									>
									<InputText
										id="city"
										placeholder="City"
										aria-describedby="city"
									/>
								</div>

								<div class="flex flex-col gap-1 flex-grow">
									<label
										class="text-sm"
										for="state"
										>State</label
									>
									<InputText
										id="state"
										placeholder="State"
										aria-describedby="state"
									/>
								</div>
							</div>

							<div class="flex flex-col md:flex-row gap-4 mb-6">
								<div class="flex flex-col gap-1 flex-grow">
									<label
										class="text-sm"
										for="country"
										>Country</label
									>
									<InputText
										id="country"
										placeholder="Country"
										aria-describedby="country"
									/>
								</div>

								<div class="flex flex-col gap-1 flex-grow">
									<label
										class="text-sm"
										for="zip_code"
										>Zip Code</label
									>
									<InputText
										id="zip_code"
										placeholder="Zip Code"
										aria-describedby="zip_code"
									/>
								</div>
							</div>

							<div class="flex">
								<Button
									class="bg-primary-600 text-white focus:outline-none py-3 px-5 rounded-md"
									>Save Changes
								</Button>
							</div>
						</div>
					</div>

					<div
						class="grid grid-cols-1 gap-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-2 mb-6 py-8 px-6 md:px-10 bg-white"
					>
						<h3 class="text-secondary-600 font-bold text-base">Password</h3>

						<!-- password FORM -->
						<div class="flex flex-col gap-10">
							<form
								action=""
								method="post"
							>
								<div class="flex flex-col gap-1 mb-6">
									<label
										for="password"
										class="text-sm"
										>Old Password</label
									>

									<Password
										id="password"
										placeholder="Enter password"
										toggleMask
									/>
								</div>

								<div class="flex flex-col gap-1 mb-6">
									<label
										for="newPassword"
										class="text-sm"
										>New Password</label
									>

									<Password
										id="newPassword"
										placeholder="Enter password"
										toggleMask
									/>
								</div>

								<div class="flex flex-col gap-1 mb-6">
									<label
										for="confirmPassword"
										class="text-sm"
										>New Password</label
									>

									<Password
										id="confirmPassword"
										placeholder="Enter password"
										toggleMask
									/>
								</div>

								<div class="flex">
									<Button
										class="bg-primary-600 text-white focus:outline-none py-3 px-5 rounded-md"
										>Save Changes
									</Button>
								</div>
							</form>
						</div>
					</div>
				</div>
			</div>
		</div>
	</section>
</template>

<style scoped></style>
