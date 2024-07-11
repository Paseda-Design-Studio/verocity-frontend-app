<script setup lang="ts">
	import InputText from 'primevue/inputtext';

	definePageMeta({
		layout: 'auth',
	});
</script>

<template>
	<div class="min-h-screen bg-gray-100 text-gray-900 flex justify-center">
		<div
			class="w-full m-0 bg-gray-100 shadow sm:rounded-lg flex gap-10 items-center justify-center flex-1 p-10"
		>
			<div
				class="max-w-lg flex-1 mt-8 flex bg-white py-8 px-6 flex-col rounded-lg"
			>
				<div class="flex flex-col items-center gap-2 mb-10">
					<h3 class="text-2xl text-gray-800 font-semibold">
						Confirm email address
					</h3>
					<p class="text-base font-normal text-center text-gray-700">
						A verification code has been sent to supacell@gmail.com enter code
						to verify email
					</p>
				</div>
				<form
					action=""
					method="post"
          class="mb-10"
				>
					<div class="flex justify-center mb-6">
						<InputOtp integerOnly />
					</div>

					<div class="flex justify-center">
						<Button class="bg-primary text-white focus:outline-none"
							>Verify email
						</Button>
					</div>
				</form>

				<div class="flex mt-5 justify-center">
					<p class="text-base font-normal text-gray-700">
						Don’t receive code?
						<NuxtLink
							to="/auth/register"
							class="font-semibold hover:underline text-gray-800"
							>Resend</NuxtLink
						>
					</p>
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped></style>
