<script setup lang="ts">
import { useAuthStore } from "~/stores/auth";
//import vuelidate
import { useVuelidate } from "@vuelidate/core";
import {
  required,
  email,
  minLength,
  sameAs,
  helpers,
} from "@vuelidate/validators";
import type { ValidationArgs } from "@vuelidate/core";
import type {
  RegisterRequest,
  IndividualRegisterRequest,
  BusinessRegisterRequest,
} from "~/api/auth/types";

definePageMeta({
  layout: "auth",
});

// Get the auth store
const authStore = useAuthStore();

// Get the toast instance from PrimeVue
const toast = useToast();

// Initialize accountType with a ref
const accountType = ref("individual");
// Define the type for your form data
interface FormData {
  firstname: string;
  lastname: string;
  business_name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

// Form data with reactive
const formData = reactive<FormData>({
  firstname: "",
  lastname: "",
  business_name: "",
  email: "",
  phone: "",
  password: "",
  confirmPassword: "",
});

// Define validation rules based on account type
const rules = computed(() => {
  // Common rules for both account types
  const commonRules = {
    email: {
      required: helpers.withMessage("Email is required", required),
      email: helpers.withMessage("Please enter a valid email address", email),
    },
    phone: {
      required: helpers.withMessage("Phone number is required", required),
    },
    password: {
      required: helpers.withMessage("Password is required", required),
      minLength: helpers.withMessage(
        "Password must be at least 8 characters long",
        minLength(8)
      ),
    },
    confirmPassword: {
      required: helpers.withMessage("Please confirm your password", required),
      sameAsPassword: helpers.withMessage(
        "Passwords do not match",
        sameAs(formData.password)
      ),
    },
  };

  // Account type specific rules
  if (accountType.value === "individual") {
    return {
      ...commonRules,
      firstname: {
        required: helpers.withMessage("First name is required", required),
      },
      lastname: {
        required: helpers.withMessage("Last name is required", required),
      },
    };
  } else {
    return {
      ...commonRules,
      business_name: {
        required: helpers.withMessage("Business name is required", required),
      },
    };
  }
});

// Create vuelidate instance with proper typing
const v$ = useVuelidate(rules, formData) as ValidationArgs<
  typeof rules,
  typeof formData
>;

// Error handling
const errorMessage = ref("");
const loading = computed(() => authStore.loading);

// Handle account type change
const handleAccountTypeChange = (val: string) => {
  accountType.value = val;
  // Reset validation state when changing account type
  v$.value.$reset();
};

// Form submission handler
const handleSubmit = async () => {
  try {
    // Validate the form with vuelidate
    const isFormValid = await v$.value.$validate();
    if (!isFormValid) {
      // Get the first validation error message
      const firstError = Object.values(v$.value)
        .filter((field) => typeof field.$errors !== "undefined")
        .flatMap((field) => field.$errors)
        .filter((error) => error.$message)
        .map((error) => error.$message)[0];

      errorMessage.value = "Please fix the validation errors";
      toast.add({
        severity: "error",
        summary: "Validation Error",
        detail: errorMessage.value,
        life: 3000,
      });
      return;
    }

    let registerData: RegisterRequest;

    if (accountType.value === "individual") {
      // Prepare individual registration data
      registerData = {
        firstname: formData.firstname,
        lastname: formData.lastname,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        customer_type: accountType.value,
      } as IndividualRegisterRequest;
    } else {
      // Prepare business registration data
      registerData = {
        business_name: formData.business_name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        customer_type: "business",
      } as BusinessRegisterRequest;
    }

    // Use the unified register method
    const response = await authStore.register(registerData);

    if (import.meta.env.MODE === "development") {
      console.log("Registration response:", response);
    }

    toast.add({
      severity: "success",
      summary: "Success",
      detail:
        "Registration successful! Please check your email for verification",
      life: 3000,
    });

    // Reset form after successful registration
    v$.value.$reset();
    Object.keys(formData).forEach((key) => {
      formData[key as keyof typeof formData] = "";
    });

    // Redirect to login page after successful registration
    navigateTo("/auth/login");
  } catch (error: any) {
    console.error("Registration error:", error);
    const errorMsg = error.message || "Registration failed. Please try again.";
    errorMessage.value = errorMsg;
    toast.add({
      severity: "error",
      summary: "Error",
      detail: errorMsg,
      life: 3000,
    });
  }
};
</script>

<template>
  <div class="min-h-screen bg-gray-100 text-gray-900 flex justify-center">
    <Toast />
    <div
      class="w-full m-0 bg-white shadow sm:rounded-lg flex gap-10 items-center justify-center flex-1 p-10"
    >
      <AuthSide color="secondary" />

      <div class="flex-1 relative">
        <AuthBackArrow />
        <div class="max-w-md mt-8 flex flex-col">
          <div class="flex flex-col gap-2 mb-10">
            <h3 class="text-2xl text-gray-800 font-semibold">Sign up</h3>
            <p class="text-base font-normal text-gray-700">
              Enter your details to create an account
            </p>
          </div>

          <form @submit.prevent="handleSubmit">
            <!-- Account type selection - Using standard HTML radio buttons -->
            <div class="flex flex-wrap gap-4 mb-4">
              <div class="flex items-center flex-grow">
                <AppRadioInput
                  id="individual"
                  name="account_type"
                  :value="'individual'"
                  :modelValue="accountType"
                  @update:modelValue="handleAccountTypeChange"
                  label="Individual"
                />
              </div>
              <div class="flex items-center flex-grow">
                <div class="flex items-center">
                  <AppRadioInput
                    id="business"
                    name="account_type"
                    :value="'business'"
                    :modelValue="accountType"
                    @update:modelValue="handleAccountTypeChange"
                    label="Business"
                  />
                </div>
              </div>
            </div>

            <!-- Individual form fields -->
            <div v-if="accountType === 'individual'" class="flex mb-4 gap-4">
              <div class="flex flex-col gap-1 flex-1">
                <label class="text-sm" for="first_name">First Name</label>
                <InputText
                  id="first_name"
                  v-model="formData.firstname"
                  placeholder="First Name"
                  aria-describedby="first_name"
                  class="w-full"
                  :class="{ 'p-invalid': v$.firstname.$error }"
                  :disabled="loading"
                />
                <small
                  v-if="v$.firstname && v$.firstname.$error"
                  class="text-red-500 text-xs"
                >
                  {{ v$.firstname.$errors[0].$message }}
                </small>
              </div>

              <div class="flex flex-col gap-1 flex-1">
                <label class="text-sm" for="last_name">Last Name</label>
                <InputText
                  id="last_name"
                  v-model="formData.lastname"
                  placeholder="Last Name"
                  aria-describedby="last_name"
                  class="w-full"
                  :class="{ 'p-invalid': v$.lastname.$error }"
                  :disabled="loading"
                />
                <small
                  v-if="v$.lastname && v$.lastname.$error"
                  class="text-red-500 text-xs"
                >
                  {{ v$.lastname.$errors[0].$message }}
                </small>
              </div>
            </div>

            <!-- Business form fields -->
            <div
              v-if="accountType === 'business'"
              class="flex flex-col gap-1 mb-4"
            >
              <label class="text-sm" for="business_name"
                >Name of Business</label
              >
              <InputText
                id="business_name"
                v-model="formData.business_name"
                placeholder="Business Name"
                aria-describedby="business_name"
                class="w-full"
                :class="{ 'p-invalid': v$.business_name?.$error }"
                :disabled="loading"
              />
              <small
                v-if="v$.business_name && v$.business_name.$error"
                class="text-red-500 text-xs"
              >
                {{ v$.business_name.$errors[0].$message }}
              </small>
            </div>

            <!-- Common fields for both account types -->
            <div class="flex flex-col gap-1 mb-4">
              <label class="text-sm" for="email">Email address</label>
              <InputText
                id="email"
                v-model="formData.email"
                placeholder="Email address"
                aria-describedby="email"
                class="w-full"
                :class="{ 'p-invalid': v$.email.$error }"
                :disabled="loading"
              />
              <small
                v-if="v$.email && v$.email.$error"
                class="text-red-500 text-xs"
              >
                {{ v$.email.$errors[0].$message }}
              </small>
            </div>

            <div class="flex flex-col gap-1 mb-4">
              <label class="text-sm" for="phone">Phone Number</label>
              <InputText
                id="phone"
                type="tel"
                v-model="formData.phone"
                placeholder="Phone Number"
                aria-describedby="phone"
                class="w-full"
                :class="{ 'p-invalid': v$.phone.$error }"
                :disabled="loading"
              />
              <small
                v-if="v$.phone && v$.phone.$error"
                class="text-red-500 text-xs"
              >
                {{ v$.phone.$errors[0].$message }}
              </small>
            </div>

            <div class="flex flex-col gap-1 mb-4">
              <label class="text-sm" for="password">Password</label>
              <Password
                id="password"
                v-model="formData.password"
                placeholder="Enter password"
                toggleMask
                class="w-full"
                :class="{ 'p-invalid': v$.password.$error }"
                :disabled="loading"
              />
              <small
                v-if="v$.password && v$.password.$error"
                class="text-red-500 text-xs"
              >
                {{ v$.password.$errors[0].$message }}
              </small>
            </div>

            <div class="flex flex-col gap-1 mb-4">
              <label class="text-sm" for="confirm_password"
                >Confirm Password</label
              >
              <Password
                id="confirm_password"
                v-model="formData.confirmPassword"
                placeholder="Confirm password"
                toggleMask
                class="w-full"
                :class="{ 'p-invalid': v$.confirmPassword.$error }"
                :disabled="loading"
              />
              <small
                v-if="v$.confirmPassword && v$.confirmPassword.$error"
                class="text-red-500 text-xs"
              >
                {{ v$.confirmPassword.$errors[0].$message }}
              </small>
            </div>

            <div class="flex">
              <Button
                type="submit"
                :loading="loading"
                :disabled="loading"
                class="bg-primary-600 text-white focus:outline-none py-3 px-5 rounded-md"
              >
                <span v-if="!loading">Sign Up</span>
                <span v-else class="flex items-center gap-2">
                  <app-icon name="spinner" filled class="w-4 h-4" />
                  Processing...
                </span>
              </Button>
            </div>
          </form>

          <div class="flex mt-5">
            <p class="text-sm font-normal text-gray-700">
              Already have an account?
              <NuxtLink
                to="/auth/login"
                class="font-semibold hover:underline text-gray-800"
              >
                Login
              </NuxtLink>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
