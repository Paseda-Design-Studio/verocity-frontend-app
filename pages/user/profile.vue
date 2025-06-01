<script setup lang="ts">
import { useVuelidate } from "@vuelidate/core";
import {
  required,
  email,
  minLength,
  sameAs,
  helpers,
} from "@vuelidate/validators";
import type { ValidationArgs } from "@vuelidate/core";
import type { UpdatePasswordRequest } from "~/api/auth/types";

definePageMeta({
  layout: "default",
  middleware: ["auth"],
});

// Get user data from composable
const {
  user,
  fullName,
  email: userEmail,
  address,
  city,
  state,
  country,
  zipCode,
  userInitial, // Get userInitial from the composable
} = useUser();

// Get the toast instance from PrimeVue
const toast = useToast();

// Get auth store for profile picture upload
const authStore = useAuthStore();

// Define the type for your form data
interface ProfileFormData {
  firstname: string;
  lastname: string;
  email?: string;
  phone: string;
}

interface AddressFormData {
  address: string;
  city: string;
  state: string;
  country: string;
  zipcode: string;
}

interface PasswordFormData {
  current_password: string;
  new_password: string;
  confirm_password: string;
}

// Form data with reactive - prepopulated with user data
const profileFormData = reactive<ProfileFormData>({
  firstname: "",
  lastname: "",
  email: "",
  phone: "",
});

const addressFormData = reactive<AddressFormData>({
  address: "",
  city: "",
  state: "",
  country: "",
  zipcode: "",
});

const passwordFormData = reactive<PasswordFormData>({
  current_password: "",
  new_password: "",
  confirm_password: "",
});

// Profile picture upload state
const profilePictureFile = ref<File | null>(null);
const profilePicturePreview = ref<string | null>(null);
const fileInputRef = ref<HTMLInputElement | null>(null);

// Watch for user data changes and populate forms
watchEffect(() => {
  if (user.value) {
    console.log("User data updated:", JSON.stringify(user.value, null, 2));

    // Handle individual vs business user types
    if (user.value.customerType === "individual") {
      profileFormData.firstname = user.value.firstName || "";
      profileFormData.lastname = user.value.lastName || "";
    } else {
      // For business users, you might want to split business name or handle differently
      profileFormData.firstname = user.value.businessName || "";
      profileFormData.lastname = "";
    }

    profileFormData.email = user.value.email || "";
    profileFormData.phone = user.value.phone || "";

    // Populate address form separately
    addressFormData.address = user.value.address || "";
    addressFormData.city = user.value.city || "";
    addressFormData.state = user.value.state || "";
    addressFormData.country = user.value.country || "";
    addressFormData.zipcode = user.value.zipCode || "";
  }
});

// Validation rules for profile form
const profileRules = computed(() => ({
  firstname: {
    required: helpers.withMessage("First name is required", required),
  },
  lastname: {
    required: helpers.withMessage("Last name is required", required),
  },
  phone: {
    required: helpers.withMessage("Phone number is required", required),
  },
}));

// Validation rules for address form
const addressRules = computed(() => ({
  address: {
    required: helpers.withMessage("Address is required", required),
  },
  city: {
    required: helpers.withMessage("City is required", required),
  },
  state: {
    required: helpers.withMessage("State is required", required),
  },
  country: {
    required: helpers.withMessage("Country is required", required),
  },
  zipcode: {
    required: helpers.withMessage("Zip code is required", required),
  },
}));

// Validation rules for password form
const passwordRules = computed(() => ({
  current_password: {
    required: helpers.withMessage("Current password is required", required),
  },
  new_password: {
    required: helpers.withMessage("New password is required", required),
    minLength: helpers.withMessage(
      "Password must be at least 8 characters long",
      minLength(8)
    ),
  },
  confirm_password: {
    required: helpers.withMessage("Please confirm your password", required),
    sameAsPassword: helpers.withMessage(
      "Passwords do not match",
      sameAs(passwordFormData.new_password)
    ),
  },
}));

// Create vuelidate instances
const profileV$ = useVuelidate(profileRules, profileFormData) as ValidationArgs<
  typeof profileRules,
  typeof profileFormData
>;

const addressV$ = useVuelidate(addressRules, addressFormData) as ValidationArgs<
  typeof addressRules,
  typeof addressFormData
>;

const passwordV$ = useVuelidate(
  passwordRules,
  passwordFormData
) as ValidationArgs<typeof passwordRules, typeof passwordFormData>;

// Loading states
const profileLoading = ref(false);
const addressLoading = ref(false);
const passwordLoading = ref(false);

// Profile picture methods
const triggerFileInput = () => {
  fileInputRef.value?.click();
};

const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];

  if (file) {
    // Validate file type
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
    ];
    if (!allowedTypes.includes(file.type)) {
      toast.add({
        severity: "error",
        summary: "Invalid File Type",
        detail: "Please upload a valid image file (JPEG, PNG, GIF, or WebP)",
        life: 3000,
      });
      return;
    }

    // Validate file size (2MB instead of 5MB to match backend)
    const maxSize = 2 * 1024 * 1024; // 2MB in bytes
    if (file.size > maxSize) {
      toast.add({
        severity: "error",
        summary: "File Too Large",
        detail: "Profile picture must be less than 2MB",
        life: 3000,
      });
      return;
    }

    profilePictureFile.value = file;

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      profilePicturePreview.value = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }
};

const removeProfilePicture = () => {
  profilePictureFile.value = null;
  profilePicturePreview.value = null;
  if (fileInputRef.value) {
    fileInputRef.value.value = "";
  }
};

const uploadProfilePicture = async () => {
  if (!profilePictureFile.value) {
    toast.add({
      severity: "error",
      summary: "No File Selected",
      detail: "Please select a profile picture to upload",
      life: 3000,
    });
    return;
  }

  try {
    await authStore.uploadProfilePicture(profilePictureFile.value);

    toast.add({
      severity: "success",
      summary: "Success",
      detail: "Profile picture updated successfully!",
      life: 3000,
    });

    // Clear the file input after successful upload
    removeProfilePicture();
  } catch (error: any) {
    console.error("Profile picture upload error:", error);
    toast.add({
      severity: "error",
      summary: "Upload Failed",
      detail: error.message || "Failed to upload profile picture",
      life: 3000,
    });
  }
};

// Get current profile picture URL
const currentProfilePicture = computed(() => {
  return user.value?.photoUrl || null;
});

// Handle profile form submission
const handleProfileSubmit = async () => {
  try {
    profileLoading.value = true;

    // Validate the form
    const isFormValid = await profileV$.value.$validate();
    if (!isFormValid) {
      toast.add({
        severity: "error",
        summary: "Validation Error",
        detail: "Please fix the validation errors",
        life: 3000,
      });
      return;
    }

    await authStore.updateUserProfile({
      firstName: profileFormData.firstname,
      lastName: profileFormData.lastname,
      email: profileFormData.email,
      phone: profileFormData.phone,
    });

    toast.add({
      severity: "success",
      summary: "Success",
      detail: "Profile updated successfully!",
      life: 3000,
    });
  } catch (error: any) {
    console.error("Profile update error:", error);
    toast.add({
      severity: "error",
      summary: "Error",
      detail: error.message || "Failed to update profile",
      life: 3000,
    });
  } finally {
    profileLoading.value = false;
  }
};

// Handle address form submission
const handleAddressSubmit = async () => {
  try {
    addressLoading.value = true;

    // Validate the form
    const isFormValid = await addressV$.value.$validate();
    if (!isFormValid) {
      toast.add({
        severity: "error",
        summary: "Validation Error",
        detail: "Please fix the validation errors",
        life: 3000,
      });
      return;
    }

    await authStore.updateUserProfile({
      address: addressFormData.address,
      city: addressFormData.city,
      state: addressFormData.state,
      country: addressFormData.country,
      zipCode: addressFormData.zipcode,
    });

    toast.add({
      severity: "success",
      summary: "Success",
      detail: "Address updated successfully!",
      life: 3000,
    });
  } catch (error: any) {
    console.error("Address update error:", error);
    toast.add({
      severity: "error",
      summary: "Error",
      detail: error.message || "Failed to update address",
      life: 3000,
    });
  } finally {
    addressLoading.value = false;
  }
};

// Handle password form submission
const handlePasswordSubmit = async () => {
  try {
    passwordLoading.value = true;

    // Validate the form
    const isFormValid = await passwordV$.value.$validate();
    if (!isFormValid) {
      toast.add({
        severity: "error",
        summary: "Validation Error",
        detail: "Please fix the validation errors",
        life: 3000,
      });
      return;
    }

    let passwordFormDataCopy = {
      current_password: passwordFormData.current_password,
      new_password: passwordFormData.new_password,
    } as UpdatePasswordRequest;

    // Use auth store to update password
    await authStore.updatePassword(passwordFormDataCopy);

    toast.add({
      severity: "success",
      summary: "Success",
      detail: "Password updated successfully!",
      life: 3000,
    });

    // Reset password form
    passwordV$.value.$reset();
    Object.keys(passwordFormData).forEach((key) => {
      passwordFormData[key as keyof typeof passwordFormData] = "";
    });
  } catch (error: any) {
    console.error("Password update error:", error);
    toast.add({
      severity: "error",
      summary: "Error",
      detail: error.message || "Failed to update password",
      life: 3000,
    });
  } finally {
    passwordLoading.value = false;
  }
};
</script>
<template>
  <section class="relative overflow-hidden py-10 sm:py-12 bg-gray-50 mt-20">
    <Toast />
    <div class="container">
      <div class="max-w-6xl mx-auto">
        <h2 class="text-gray-900 text-3xl font-bold">Profile</h2>
        <Divider />

        <div class="flex flex-col gap-4 rounded mt-12">
          <!-- Profile Picture Section -->
          <div
            class="grid grid-cols-1 gap-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-2 mb-6 py-8 px-6 md:px-10 bg-white"
          >
            <h3 class="text-secondary-600 font-bold text-base">
              Profile Picture
            </h3>

            <div class="flex flex-col items-center gap-6">
              <!-- Current Profile Picture Display -->
              <div class="relative">
                <div
                  class="w-32 h-32 rounded-full overflow-hidden bg-gray-200 border-4 border-white shadow-sm"
                >
                  <img
                    v-if="profilePicturePreview || currentProfilePicture"
                    :src="
                      profilePicturePreview ||
                      currentProfilePicture ||
                      undefined
                    "
                    :alt="fullName"
                    class="w-full h-full object-cover"
                  />
                  <div
                    v-else
                    class="w-full h-full flex items-center justify-center bg-primary-100 text-primary-600 text-2xl font-bold"
                  >
                    {{ userInitial }}
                  </div>
                </div>

                <!-- Camera Icon Overlay -->
                <button
                  @click="triggerFileInput"
                  class="absolute bottom-0 right-0 w-10 h-10 bg-primary-600 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-primary-700 transition-colors"
                  :disabled="authStore.profilePictureUploadLoading"
                >
                  <svg
                    class="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                    ></path>
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                    ></path>
                  </svg>
                </button>
              </div>

              <!-- File Input (Hidden) -->
              <input
                ref="fileInputRef"
                type="file"
                accept="image/*"
                @change="handleFileSelect"
                class="hidden"
              />

              <!-- Upload Controls -->
              <div
                v-if="profilePictureFile"
                class="flex flex-col items-center gap-4 w-full"
              >
                <!-- File Info -->
                <div class="text-center">
                  <p class="text-sm text-gray-600">
                    Selected: {{ profilePictureFile.name }}
                  </p>
                  <p class="text-xs text-gray-500">
                    {{ (profilePictureFile.size / 1024 / 1024).toFixed(2) }} MB
                  </p>
                </div>

                <!-- Action Buttons -->
                <div class="flex gap-3">
                  <Button
                    @click="uploadProfilePicture"
                    :loading="authStore.profilePictureUploadLoading"
                    :disabled="authStore.profilePictureUploadLoading"
                    class="bg-primary-600 text-white focus:outline-none py-2 px-4 rounded-md text-sm"
                  >
                    <span v-if="!authStore.profilePictureUploadLoading"
                      >Upload</span
                    >
                    <span v-else class="flex items-center gap-2">
                      <app-icon name="spinner" filled class="w-4 h-4" />
                      Uploading...
                    </span>
                  </Button>

                  <Button
                    @click="removeProfilePicture"
                    :disabled="authStore.profilePictureUploadLoading"
                    class="bg-gray-500 text-white focus:outline-none py-2 px-4 rounded-md text-sm hover:bg-gray-600"
                  >
                    Cancel
                  </Button>
                </div>
              </div>

              <!-- Upload Instructions -->
              <div v-else class="text-center">
                <p class="text-sm text-gray-600 mb-2">
                  Click the camera icon to upload a new profile picture
                </p>
                <p class="text-xs text-gray-500">
                  Supported formats: JPEG, PNG, GIF, WebP (Max 2MB)
                </p>
              </div>
            </div>
          </div>

          <!-- Personal Information Section -->
          <div
            class="grid grid-cols-1 gap-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-2 mb-6 py-8 px-6 md:px-10 bg-white"
          >
            <h3 class="text-secondary-600 font-bold text-base">
              Personal information
            </h3>

            <!-- personal information FORM -->
            <div class="flex flex-col gap-10">
              <form @submit.prevent="handleProfileSubmit">
                <div class="flex flex-col md:flex-row gap-4 mb-6">
                  <div class="flex flex-col gap-1 flex-grow">
                    <label class="text-sm" for="firstname">First Name</label>
                    <InputText
                      id="firstname"
                      v-model="profileFormData.firstname"
                      placeholder="First Name"
                      aria-describedby="firstname"
                      :class="{ 'p-invalid': profileV$.firstname.$error }"
                      :disabled="profileLoading"
                    />
                    <small
                      v-if="profileV$.firstname && profileV$.firstname.$error"
                      class="text-red-500 text-xs"
                    >
                      {{ profileV$.firstname.$errors[0].$message }}
                    </small>
                  </div>

                  <div class="flex flex-col gap-1 flex-grow">
                    <label class="text-sm" for="lastname">Last Name</label>
                    <InputText
                      id="lastname"
                      v-model="profileFormData.lastname"
                      placeholder="Last Name"
                      aria-describedby="lastname"
                      :class="{ 'p-invalid': profileV$.lastname.$error }"
                      :disabled="profileLoading"
                    />
                    <small
                      v-if="profileV$.lastname && profileV$.lastname.$error"
                      class="text-red-500 text-xs"
                    >
                      {{ profileV$.lastname.$errors[0].$message }}
                    </small>
                  </div>
                </div>

                <div class="flex flex-col gap-1 mb-6">
                  <label class="text-sm" for="email">Email Address</label>
                  <InputText
                    id="email"
                    v-model="profileFormData.email"
                    placeholder="Email Address"
                    aria-describedby="email"
                    :disabled="profileLoading"
                  />
                </div>

                <div class="flex flex-col gap-1 mb-6">
                  <label class="text-sm" for="phone">Phone Number</label>
                  <InputText
                    id="phone"
                    v-model="profileFormData.phone"
                    placeholder="Phone Number"
                    aria-describedby="phone"
                    :class="{ 'p-invalid': profileV$.phone.$error }"
                    :disabled="profileLoading"
                  />
                  <small
                    v-if="profileV$.phone && profileV$.phone.$error"
                    class="text-red-500 text-xs"
                  >
                    {{ profileV$.phone.$errors[0].$message }}
                  </small>
                </div>

                <div class="flex">
                  <Button
                    type="submit"
                    :loading="profileLoading"
                    :disabled="profileLoading"
                    class="bg-primary-600 text-white focus:outline-none py-3 px-5 rounded-md"
                  >
                    <span v-if="!profileLoading">Save Changes</span>
                    <span v-else class="flex items-center gap-2">
                      <app-icon name="spinner" filled class="w-4 h-4" />
                      Saving...
                    </span>
                  </Button>
                </div>
              </form>
            </div>
          </div>

          <!-- Address Section -->
          <div
            class="grid grid-cols-1 gap-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-2 mb-6 py-8 px-6 md:px-10 bg-white"
          >
            <h3 class="text-secondary-600 font-bold text-base">Address</h3>

            <!-- address FORM -->
            <div class="flex flex-col">
              <form @submit.prevent="handleAddressSubmit">
                <div class="flex flex-col gap-1 mb-6">
                  <label class="text-sm" for="address">Address</label>
                  <InputText
                    id="address"
                    v-model="addressFormData.address"
                    placeholder="Address"
                    aria-describedby="address"
                    :class="{ 'p-invalid': addressV$.address.$error }"
                    :disabled="addressLoading"
                  />
                  <small
                    v-if="addressV$.address && addressV$.address.$error"
                    class="text-red-500 text-xs"
                  >
                    {{ addressV$.address.$errors[0].$message }}
                  </small>
                </div>

                <div class="flex flex-col md:flex-row gap-4 mb-6">
                  <div class="flex flex-col gap-1 flex-grow">
                    <label class="text-sm" for="city">City</label>
                    <InputText
                      id="city"
                      v-model="addressFormData.city"
                      placeholder="City"
                      aria-describedby="city"
                      :class="{ 'p-invalid': addressV$.city.$error }"
                      :disabled="addressLoading"
                    />
                    <small
                      v-if="addressV$.city && addressV$.city.$error"
                      class="text-red-500 text-xs"
                    >
                      {{ addressV$.city.$errors[0].$message }}
                    </small>
                  </div>

                  <div class="flex flex-col gap-1 flex-grow">
                    <label class="text-sm" for="state">State</label>
                    <InputText
                      id="state"
                      v-model="addressFormData.state"
                      placeholder="State"
                      aria-describedby="state"
                      :class="{ 'p-invalid': addressV$.state.$error }"
                      :disabled="addressLoading"
                    />
                    <small
                      v-if="addressV$.state && addressV$.state.$error"
                      class="text-red-500 text-xs"
                    >
                      {{ addressV$.state.$errors[0].$message }}
                    </small>
                  </div>
                </div>

                <div class="flex flex-col md:flex-row gap-4 mb-6">
                  <div class="flex flex-col gap-1 flex-grow">
                    <label class="text-sm" for="country">Country</label>
                    <InputText
                      id="country"
                      v-model="addressFormData.country"
                      placeholder="Country"
                      aria-describedby="country"
                      :class="{ 'p-invalid': addressV$.country.$error }"
                      :disabled="addressLoading"
                    />
                    <small
                      v-if="addressV$.country && addressV$.country.$error"
                      class="text-red-500 text-xs"
                    >
                      {{ addressV$.country.$errors[0].$message }}
                    </small>
                  </div>

                  <div class="flex flex-col gap-1 flex-grow">
                    <label class="text-sm" for="zip_code">Zip Code</label>
                    <InputText
                      id="zip_code"
                      v-model="addressFormData.zipcode"
                      placeholder="Zip Code"
                      aria-describedby="zip_code"
                      :class="{ 'p-invalid': addressV$.zipcode.$error }"
                      :disabled="addressLoading"
                    />
                    <small
                      v-if="addressV$.zipcode && addressV$.zipcode.$error"
                      class="text-red-500 text-xs"
                    >
                      {{ addressV$.zipcode.$errors[0].$message }}
                    </small>
                  </div>
                </div>

                <div class="flex">
                  <Button
                    type="submit"
                    :loading="addressLoading"
                    :disabled="addressLoading"
                    class="bg-primary-600 text-white focus:outline-none py-3 px-5 rounded-md"
                  >
                    <span v-if="!addressLoading">Save Address</span>
                    <span v-else class="flex items-center gap-2">
                      <app-icon name="spinner" filled class="w-4 h-4" />
                      Saving...
                    </span>
                  </Button>
                </div>
              </form>
            </div>
          </div>

          <!-- Password Section -->
          <div
            class="grid grid-cols-1 gap-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-2 mb-6 py-8 px-6 md:px-10 bg-white"
          >
            <h3 class="text-secondary-600 font-bold text-base">Password</h3>

            <!-- password FORM -->
            <div class="flex flex-col gap-10">
              <form @submit.prevent="handlePasswordSubmit">
                <div class="flex flex-col gap-1 mb-6">
                  <label for="password" class="text-sm">Old Password</label>
                  <Password
                    id="password"
                    v-model="passwordFormData.current_password"
                    placeholder="Enter current password"
                    toggleMask
                    :class="{ 'p-invalid': passwordV$.current_password.$error }"
                    :disabled="passwordLoading"
                  />
                  <small
                    v-if="
                      passwordV$.current_password &&
                      passwordV$.current_password.$error
                    "
                    class="text-red-500 text-xs"
                  >
                    {{ passwordV$.current_password.$errors[0].$message }}
                  </small>
                </div>

                <div class="flex flex-col gap-1 mb-6">
                  <label for="new_password" class="text-sm">New Password</label>
                  <Password
                    id="new_password"
                    v-model="passwordFormData.new_password"
                    placeholder="Enter new password"
                    toggleMask
                    :class="{ 'p-invalid': passwordV$.new_password.$error }"
                    :disabled="passwordLoading"
                  />
                  <small
                    v-if="
                      passwordV$.new_password && passwordV$.new_password.$error
                    "
                    class="text-red-500 text-xs"
                  >
                    {{ passwordV$.new_password.$errors[0].$message }}
                  </small>
                </div>

                <div class="flex flex-col gap-1 mb-6">
                  <label for="confirm_password" class="text-sm"
                    >Confirm New Password</label
                  >
                  <Password
                    id="confirm_password"
                    v-model="passwordFormData.confirm_password"
                    placeholder="Confirm new password"
                    toggleMask
                    :class="{ 'p-invalid': passwordV$.confirm_password.$error }"
                    :disabled="passwordLoading"
                  />
                  <small
                    v-if="
                      passwordV$.confirm_password &&
                      passwordV$.confirm_password.$error
                    "
                    class="text-red-500 text-xs"
                  >
                    {{ passwordV$.confirm_password.$errors[0].$message }}
                  </small>
                </div>

                <div class="flex">
                  <Button
                    type="submit"
                    :loading="passwordLoading"
                    :disabled="passwordLoading"
                    class="bg-primary-600 text-white focus:outline-none py-3 px-5 rounded-md"
                  >
                    <span v-if="!passwordLoading">Update Password</span>
                    <span v-else class="flex items-center gap-2">
                      <app-icon name="spinner" filled class="w-4 h-4" />
                      Updating...
                    </span>
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
