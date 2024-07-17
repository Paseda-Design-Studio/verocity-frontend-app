<script setup lang="ts">
	import InputText from 'primevue/inputtext';

	definePageMeta({
		layout: 'auth',
	});
</script>

<template>
	<div class="min-h-screen bg-gray-100 text-gray-900 flex justify-center">
		<div
			class="w-full m-0 bg-white shadow sm:rounded-2xl flex gap-10 items-center justify-center flex-1 p-10"
		>
			<AuthSide />

			<div class="flex-1 relative">
				<AuthBackArrow />
				<div class="max-w-md mt-8 flex flex-col">
					<div class="flex flex-col gap-2 mb-10">
						<h3 class="text-2xl text-gray-800 font-semibold">Log in</h3>
						<p class="text-base font-normal text-gray-700">
							Enter your details to login
						</p>
					</div>
					<form
						action=""
						method="post"
					>
						<div class="flex flex-col gap-1 mb-6">
							<label
								for="name"
								class="text-sm"
								>Email address</label
							>
							<InputText
								id="email"
								placeholder="Email address"
								aria-describedby="email"
							/>
						</div>

						<div class="flex flex-col gap-1 mb-6">
							<div class="flex justify-between">
								<label
									for="password"
									class="text-sm"
									>Password</label
								>
								<RouterLink
									to="#"
									class="text-sm font-medium text-secondary"
									>Forgot password?</RouterLink
								>
							</div>

							<Password
								id="password"
								placeholder="Enter password"
								toggleMask
							/>
						</div>

						<div class="flex">
							<Button
								class="bg-primary-600 text-white focus:outline-none py-3 px-5 rounded-md"
								>Sign in
							</Button>
						</div>
					</form>

					<div class="flex mt-5">
						<p class="text-sm font-normal text-gray-700">
							Don’t have an account?
							<NuxtLink
								to="/auth/register"
								class="font-semibold hover:underline text-gray-800"
								>Sign up</NuxtLink
							>
						</p>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped></style>
