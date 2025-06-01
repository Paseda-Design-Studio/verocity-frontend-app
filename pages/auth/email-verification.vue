<script setup lang="ts">
import { useAuthService } from "~/api/auth/authService";

definePageMeta({
  layout: "auth",
});

const route = useRoute();
const router = useRouter();
const email = ref("");
const loading = ref(false);
const error = ref("");
const message = ref("");
const activationSuccess = ref(false);

// Get the auth store
const authStore = useAuthStore();

// Get the toast instance from PrimeVue
const toast = useToast();

// Automatically process the token when the page loads
onMounted(async () => {
  const token = route.query.token;

  if (token) {
    // If token is present in URL, attempt to activate
    await activateAccount(token.toString());
  }
});

async function activateAccount(token: string) {
  if (!token) {
    error.value = "Activation token is missing";
    return;
  }

  loading.value = true;
  error.value = "";

  try {
    await authStore.verifyEmail(token);
    activationSuccess.value = true;
    message.value = "Your account has been successfully activated!";

    // Redirect to login page after a delay
    setTimeout(() => {
      router.push("/auth/login?activated=true");
    }, 3000);
  } catch (err: any) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
}

async function resendActivationEmail() {
  if (!email.value) {
    error.value = "Please enter your email address";
    return;
  }

  loading.value = true;
  error.value = "";
  message.value = "";

  try {
    const authSerivce = useAuthService();
    await authSerivce.resendVerificationEmail(email.value);

    message.value = "Activation email has been resent to your email address";
  } catch (err: any) {
    error.value = err.message;
    toast.add({
      severity: "error",
      summary: "Error",
      detail: err.message,
      life: 3000,
    });
  } finally {
    loading.value = false;
  }
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
        <div v-if="activationSuccess" class="flex flex-col items-center gap-4">
          <div class="text-5xl text-green-500 mb-4">✓</div>
          <h3 class="text-2xl text-gray-800 font-semibold">
            Account Activated!
          </h3>
          <p class="text-base font-normal text-center text-gray-700">
            Your account has been successfully activated. You will be redirected
            to the login page shortly.
          </p>
          <Button
            @click="router.push('/auth/login')"
            class="bg-primary-600 text-white focus:outline-none py-3 px-5 rounded-md mt-4"
          >
            Go to Login
          </Button>
        </div>

        <!-- Error or waiting state -->
        <div v-else class="flex flex-col items-center">
          <div class="flex flex-col items-center gap-2 mb-10">
            <h3 class="text-2xl text-gray-800 font-semibold">
              Activate Your Account
            </h3>
            <p
              v-if="loading"
              class="text-base font-normal text-center text-gray-700"
            >
              Activating your account...
            </p>
            <p
              v-else-if="error"
              class="text-base font-normal text-center text-red-600 animate-pulse"
            >
              {{ error }}
            </p>
            <p v-else class="text-base font-normal text-center text-gray-700">
              Please check your email for an activation link.
            </p>
          </div>

          <div
            v-if="message"
            class="text-green-600 text-center mb-4 p-2 bg-green-50 rounded"
          >
            {{ message }}
          </div>

          <!-- Only show this section if there was an error with the token -->
          <div v-if="error" class="w-full mb-6">
            <div class="flex flex-col items-center gap-4">
              <p class="text-base font-normal text-center text-gray-700 mb-4">
                If you haven't received an activation email or if your
                activation link has expired, please enter your email below to
                request a new activation link:
              </p>

              <InputText
                v-model="email"
                placeholder="Enter your email address"
                class="w-full p-3 border rounded"
              />

              <Button
                @click="resendActivationEmail"
                :loading="loading"
                class="bg-primary-600 text-white focus:outline-none py-3 px-5 rounded-md"
              >
                Resend Activation Email
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped></style>
