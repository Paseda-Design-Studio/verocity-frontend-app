<script setup lang="ts">
	import InputText from 'primevue/inputtext';

	definePageMeta({
		layout: 'auth',
	});
</script>

<template>
	<div class="min-h-screen bg-gray-100 text-gray-900 flex justify-center">
		<div
			class="w-full m-0 bg-white shadow sm:rounded-lg flex gap-10 items-center justify-center flex-1 p-10"
		>
			<AuthSide color="secondary" />

			<div class="flex-1 relative">
				<AuthBackArrow/>
				<div class="max-w-md mt-8 flex flex-col">
					<div class="flex flex-col gap-2 mb-10">
						<h3 class="text-2xl text-gray-800 font-semibold">Sign in</h3>
						<p class="text-base font-normal text-gray-700">
							Enter your details to create an account
						</p>
					</div>
					<form
						action=""
						method="post"
					>
						<div class="flex flex-wrap gap-4 mb-6">
							<div class="flex items-center flex-grow">
								<RadioButton
									inputId="individual"
									name="account_type"
									value="individual"
								/>
								<label
									class="text-sm ml-2"
									for="individual"
									>Individual</label
								>
							</div>
							<div class="flex items-center flex-grow">
								<RadioButton
									inputId="e-commerce"
									name="account_type"
									value="e-commerce"
								/>
								<label
									class="text-sm ml-2"
									for="e-commerce"
									>E-commerce</label
								>
							</div>
						</div>
						<div class="flex mb-6 gap-4">
							<div class="flex flex-col gap-1">
								<label
									class="text-sm"
									for="first_name"
									>First Name</label
								>
								<InputText
									id="first_name"
									placeholder="First Name"
									aria-describedby="first_name"
									class="w-full"
								/>
							</div>

							<div class="flex flex-col gap-1">
								<label
									class="text-sm"
									for="first_name"
									>Last Name</label
								>
								<InputText
									id="last_name"
									placeholder="Last Name"
									aria-describedby="last_name"
									class="w-full"
								/>
							</div>
						</div>

						<div class="flex flex-col gap-1 mb-6">
							<label
								class="text-sm"
								for="name"
								>Email address</label
							>
							<InputText
								id="email"
								placeholder="Email address"
								aria-describedby="email"
							/>
						</div>

						<div class="flex flex-col gap-1 mb-6">
							<label
								class="text-sm"
								for="phone"
								>Phone Number</label
							>
							<InputNumber
								placeholder="Phone Number"
								inputId="phone_number"
								fluid
							/>
						</div>

						<div class="flex flex-col gap-1 mb-6">
							<label
								class="text-sm"
								for="password"
								>Password</label
							>
							<Password
								id="password"
								placeholder="Enter password"
								toggleMask
							/>
						</div>

						<div class="flex flex-col gap-1 mb-6">
							<label
								class="text-sm"
								for="password"
								>Confirm Password</label
							>
							<Password
								id="confirm_password"
								placeholder="Enter password"
								toggleMask
							/>
						</div>

						<div class="flex">
							<Button
								class="bg-primary-600 text-white focus:outline-none py-3 px-5 rounded-md"
								>Sign Up
							</Button>
						</div>
					</form>

					<div class="flex mt-5">
						<p class="text-sm font-normal text-gray-700">
							Already have an account?
							<NuxtLink
								to="/auth/login"
								class="font-semibold hover:underline text-gray-800"
								>Login</NuxtLink
							>
						</p>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped></style>
