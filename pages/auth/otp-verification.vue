<script setup lang="ts">
import { useAuthStore } from "~/stores/auth";

definePageMeta({
  layout: "auth",
});

const authStore = useAuthStore();
const toast = useToast();
const otp = ref("");
const loading = ref(false);
const error = ref("");
const message = ref("");
const verificationSuccess = ref(false);

// Check if we have an email for OTP verification
onMounted(() => {
  if (!authStore.otpEmail) {
    // No email found, redirect to login
    navigateTo("/auth/login");
  }
});

// Verify the OTP
async function verifyOtp() {
  if (!otp.value || otp.value.length !== 4) {
    error.value = "Please enter a valid 4-digit OTP";
    return;
  }

  loading.value = true;
  error.value = "";
  message.value = "";

  try {
    // Call the auth store's verifyOtp method
    await authStore.verifyOtp(otp.value);
    verificationSuccess.value = true;
    message.value = "OTP verified successfully!";
    
    // Redirect to dashboard after a delay
    setTimeout(() => {
      navigateTo("/user/welcome");
    }, 2000);
  } catch (err: any) {
    error.value = err.message || "Failed to verify OTP";
    toast.add({
      severity: "error",
      summary: "Error",
      detail: error.value,
      life: 3000,
    });
  } finally {
    loading.value = false;
  }
}

// Redirect to login page
function returnToLogin() {
  navigateTo("/auth/login");
}
</script>

<template>
  <div class="min-h-screen bg-gray-100 text-gray-900 flex justify-center">
    <div
      class="w-full m-0 bg-gray-100 shadow sm:rounded-lg flex gap-10 items-center justify-center flex-1 p-16"
    >
      <div
        class="max-w-lg flex-1 mt-8 flex bg-white py-12 px-10 flex-col relative rounded-lg shadow-md"
      >
        <AuthBackArrow />
        <!-- Success state -->
        <div
          v-if="verificationSuccess"
          class="flex flex-col items-center gap-4"
        >
          <div class="text-5xl text-green-500 mb-4">✓</div>
          <h3 class="text-2xl text-gray-800 font-semibold">OTP Verified!</h3>
          <p class="text-base font-normal text-center text-gray-700">
            Your OTP has been successfully verified. You will be redirected to
            the dashboard shortly.
          </p>
          <Button
            @click="navigateTo('/user/welcome')"
            class="bg-primary-600 text-white focus:outline-none py-3 px-5 rounded-md mt-4"
          >
            Go to Dashboard
          </Button>
        </div>
        <!-- OTP verification form -->
        <div v-else class="flex flex-col items-center">
          <div class="flex flex-col items-center gap-2 mb-10">
            <h3 class="text-2xl text-gray-800 font-semibold">
              Verify Your Login
            </h3>
            <p class="text-base font-normal text-center text-gray-700">
              Please enter the 4-digit OTP sent to your email
            </p>
          </div>

          <div
            v-if="message"
            class="text-green-600 text-center mb-4 p-2 bg-green-50 rounded w-full"
          >
            {{ message }}
          </div>

          <div
            v-if="error"
            class="text-red-600 text-center mb-4 p-2 bg-red-50 rounded w-full"
          >
            {{ error }}
          </div>

          <div class="w-full mb-6">
            <div class="flex flex-col items-center gap-4">
              <!-- OTP Input -->
              <InputOtp
                v-model="otp"
                :length="4"
                integerOnly
              />
              <Button
                @click="verifyOtp"
                :loading="loading"
                class="bg-primary-600 text-white focus:outline-none py-3 px-5 rounded-md w-full"
              >
                Verify OTP
              </Button>
              <div class="text-center mt-4">
                <p class="text-sm text-gray-600">
                  Didn't receive the OTP?
                  <span
                    @click="returnToLogin"
                    class="p-button-link cursor-pointer text-primary-600 p-0 underline"
                  >
                    Return to login
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Add any component-specific styles here */
</style>
