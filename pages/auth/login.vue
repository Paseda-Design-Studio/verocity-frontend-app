<script setup lang="ts">
import InputText from 'primevue/inputtext';
import { useAuthStore } from '~/stores/auth';
import { useVuelidate } from '@vuelidate/core';
import { required, email, minLength } from '@vuelidate/validators';

definePageMeta({
	layout: 'auth',
});

// Get the auth store
const authStore = useAuthStore();
const toast = useToast();
const router = useRouter();
const route = useRoute();

// Form data
const formData = reactive({
	email: '',
	password: '',
});

// Loading state
const loading = ref(false);
const errorMessage = ref('');

// Validation rules
const rules = {
	email: { 
		required, 
		email 
	},
	password: { 
		required, 
		minLength: minLength(8) 
	}
};

const v$ = useVuelidate(rules, formData);

// Check if user was redirected from account activation
onMounted(() => {
	if (route.query.activated === 'true') {
		toast.add({
			severity: 'success',
			summary: 'Account Activated',
			detail: 'Your account has been successfully activated. You can now log in.',
			life: 5000
		});
	}
});

// Handle login form submission
const handleLogin = async () => {
	try {
		// Validate form
		const isFormValid = await v$.value.$validate();
		if (!isFormValid) {
			// Get the first validation error message
			const firstError = Object.values(v$.value)
				.filter((field) => typeof field.$errors !== 'undefined')
				.flatMap((field) => field.$errors)
				.filter((error) => error.$message)
				.map((error) => error.$message)[0];

			errorMessage.value = firstError ? String(firstError.$message) : 'Please fix the validation errors';
			toast.add({
				severity: 'error',
				summary: 'Validation Error',
				detail: errorMessage.value,
				life: 3000,
			});
			return;
		}

		// Reset error message
		errorMessage.value = '';
		loading.value = true;

		// Call login method from auth store
		const response = await authStore.login({
			email: formData.email,
			password: formData.password
		});
		
		if (import.meta.env.MODE === 'development') {
			console.log('Login response:', response);
		}

		// If we get here, OTP has been sent
		toast.add({
			severity: 'success',
			summary: 'OTP Sent',
			detail: 'A verification code has been sent to your email',
			life: 3000
		});

		// Redirect to OTP verification page
		navigateTo('/auth/otp-verification');
	} catch (error: any) {
		console.error('Login error:', error);
		errorMessage.value = error.message || 'Login failed. Please check your credentials and try again.';
		toast.add({
			severity: 'error',
			summary: 'Login Failed',
			detail: errorMessage.value,
			life: 3000
		});
	} finally {
		loading.value = false;
	}
};
</script>

<template>
	<div class="min-h-screen bg-gray-100 text-gray-900 flex justify-center">
		<Toast />
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

					<form @submit.prevent="handleLogin">
						<div class="flex flex-col gap-1 mb-6">
							<label
								for="email"
								class="text-sm"
								>Email address</label
							>
							<InputText
								id="email"
								v-model="formData.email"
								placeholder="Email address"
								aria-describedby="email"
								:class="{ 'p-invalid': v$.email.$error }"
							/>
							<small v-if="v$.email.$error" class="text-red-500 text-xs">
								{{ v$.email.$errors[0].$message }}
							</small>
						</div>

						<div class="flex flex-col gap-1 mb-6">
							<div class="flex justify-between">
								<label
									for="password"
									class="text-sm"
									>Password</label
								>
								<RouterLink
									to="/auth/forgot-password"
									class="text-sm font-medium text-secondary"
									>Forgot password?</RouterLink
								>
							</div>

							<Password
								id="password"
								v-model="formData.password"
								placeholder="Enter password"
								toggleMask
								:class="{ 'p-invalid': v$.password.$error }"
							/>
							<small v-if="v$.password.$error" class="text-red-500 text-xs">
								{{ v$.password.$errors[0].$message }}
							</small>
						</div>

						<div class="flex">
							<Button
								type="submit"
								:loading="loading"
								class="bg-primary-600 text-white focus:outline-none py-3 px-5 rounded-md"
							>
								<span v-if="!loading">Sign in</span>
								<span v-else class="flex items-center gap-2">
									<app-icon name="spinner" filled class="w-4 h-4" />
									Processing...
								</span>
							</Button>
						</div>
					</form>

					<div class="flex mt-5">
						<p class="text-sm font-normal text-gray-700">
							Don't have an account?
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
