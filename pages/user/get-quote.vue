<script setup lang="ts">
import { useShipment } from "~/composables/useShipment";
import { useCountryStore } from "~/stores/country";
import type { ShipmentQuoteEstimatePayload } from "~/api/shipment/types";
import type { Country, Location } from "~/utils/helper";
import { useVuelidate } from "@vuelidate/core";
import {
  required,
  minLength,
  numeric,
  helpers,
  email,
} from "@vuelidate/validators";
import type { ValidationArgs } from "@vuelidate/core";

const categories = [
  "Electronics",
  "Clothing",
  "Documents",
  "Food",
  "Furniture",
  "Automobile Parts",
  "Books",
  "Toys",
  "Medical Supplies",
  "Jewelry",
  "Cosmetics",
  "Sports Equipment",
  "Machinery",
  "Musical Instruments",
  "Art & Antiques",
  "Shoes",
  "Bags & Luggage",
  "Pet Supplies",
  "Home Appliances",
  "Gardening Tools",
  "Other",
];

definePageMeta({
  layout: "default",
});

const heroData = {
  title: "Get Quote",
  description: ` This is just an estimated cost for your shipment. Actual price
            may vary after creating a shipment.`,
  backgroundImage: "/bg-pattern.png",
};

const countryStore = useCountryStore();
const toast = useToast();

onMounted(() => {
  if (!countryStore.operationalCountries) {
    countryStore.fetchOperationalCountries();
  }
});

// Define the type for your form data
interface FormData {
  departure_country: string | null;
  departure_city: string | null;
  destination_country: string | null;
  destination_city: string | null;
  name: string;
  email: string;
  phone: string;
  category: string;
  weight: string;
  value: string;
  description: string;
  currency: string;
}

// Form data with reactive
const formData = reactive<FormData>({
  departure_country: null,
  departure_city: null,
  destination_country: null,
  destination_city: null,
  name: "",
  email: "",
  phone: "",
  category: "",
  weight: "",
  value: "",
  description: "",
  currency: "USD",
});

// Define validation rules
const rules = computed(() => ({
  name: {
    required: helpers.withMessage("Name is required", required),
  },
  email: {
    required: helpers.withMessage("Email is required", required),
    email: helpers.withMessage("Please enter a valid email", email),
  },
  phone: {
    required: helpers.withMessage("Phone is required", required),
  },
  departure_country: {
    required: helpers.withMessage("Departure country is required", required),
  },
  departure_city: {
    required: helpers.withMessage("Departure city is required", required),
  },
  destination_country: {
    required: helpers.withMessage("Destination country is required", required),
  },
  destination_city: {
    required: helpers.withMessage("Destination city is required", required),
  },
  category: {
    required: helpers.withMessage("Category is required", required),
  },
  weight: {
    required: helpers.withMessage("Weight is required", required),
    numeric: helpers.withMessage("Weight must be a number", numeric),
  },
  value: {
    required: helpers.withMessage("Value is required", required),
    numeric: helpers.withMessage("Value must be a number", numeric),
  },
  description: {
    required: helpers.withMessage("Description is required", required),
    minLength: helpers.withMessage(
      "Description must be at least 10 characters",
      minLength(10)
    ),
  },
}));

// Create vuelidate instance with proper typing
const v$ = useVuelidate(rules, formData) as ValidationArgs<
  typeof rules,
  typeof formData
>;

// Watch for country changes and reset cities
watch(
  () => formData.departure_country,
  (newVal: any, oldVal:any) => {
    if (newVal !== oldVal) {
      formData.departure_city = null;
    }
  }
);

watch(
  () => formData.destination_country,
  (newVal:any, oldVal:any) => {
    if (newVal !== oldVal) {
      formData.destination_city = null;
    }
  }
);

// Computed for filtered states/cities
const departureStates = computed<Location[]>(() => {
  const c = countryStore.operationalCountries?.find(
    (c: Country) => c.name === formData.departure_country
  );
  return c?.locations || [];
});

const destinationStates = computed<Location[]>(() => {
  const c = countryStore.operationalCountries?.find(
    (c: Country) => c.name === formData.destination_country
  );
  return c?.locations || [];
});

// Use composable
const { loading, error, quoteEstimate, getShipmentQuoteEstimate } =
  useShipment();

// Computed for estimated price
const estimatedPrice = computed(() => {
  return quoteEstimate.value?.quote?.total_cost
    ? `$${quoteEstimate.value.quote.total_cost}`
    : "$0.00";
});

// Error handling
const errorMessage = ref("");

// Handle form submit
const handleSubmit = async () => {
  try {
    // Validate the form with vuelidate
    const isFormValid = await v$.value.$validate();
    if (!isFormValid) {
      // Get the first validation error message
      const firstError = Object.values(v$.value)
        .filter((field:any) => typeof field.$errors !== "undefined")
        .flatMap((field:any) => field.$errors)
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

    const payload: ShipmentQuoteEstimatePayload = {
      personal_info: {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
      },
      item_details: {
        category: formData.category,
        weight: formData.weight,
        value: Number(formData.value),
        description: formData.description,
      },
      location_info: {
        from_country: formData.departure_country ?? "",
        from_city: formData.departure_city ?? "",
        to_country: formData.destination_country ?? "",
        to_city: formData.destination_city ?? "",
      },
      shipping_preferences: {
        destination_country: formData.destination_country ?? "",
        currency: formData.currency,
      },
    };

    console.log("Submitting payload:", payload);
    await getShipmentQuoteEstimate(payload);

    toast.add({
      severity: "success",
      summary: "Success",
      detail: "Quote estimate retrieved successfully!",
      life: 3000,
    });
  } catch (error: any) {
    console.error("Quote estimation error:", error);
    const errorMsg =
      error.message || "Failed to get quote estimate. Please try again.";
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
  <div>
    <Toast />
    <app-hero
      :title="heroData.title"
      :description="heroData.description"
      :backgroundImage="heroData.backgroundImage"
    />

    <section class="relative overflow-hidden py-10 sm:py-24 mt-20">
      <div class="container">
        <div class="max-w-3xl mx-auto">
          <form @submit.prevent="handleSubmit">
            <!-- Personal Info -->
            <div class="flex flex-col gap-1 mb-6">
              <label class="text-sm" for="name">Name</label>
              <InputText
                id="name"
                v-model="formData.name"
                placeholder="Name"
                :class="{ 'p-invalid': v$.name.$error }"
                :disabled="loading"
              />
              <small
                v-if="v$.name && v$.name.$error"
                class="text-red-500 text-xs"
              >
                {{ v$.name.$errors[0].$message }}
              </small>
            </div>

            <div class="flex gap-4 mb-6">
              <div class="flex flex-col gap-1 w-1/2">
                <label class="text-sm" for="email">Email Address</label>
                <InputText
                  id="email"
                  v-model="formData.email"
                  placeholder="Email Address"
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
              <div class="flex flex-col gap-1 w-1/2">
                <label class="text-sm" for="phone">Phone Number</label>
                <InputText
                  id="phone"
                  v-model="formData.phone"
                  placeholder="Phone Number"
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
            </div>

            <!-- Departure Info -->
            <div class="flex gap-4 mb-6">
              <div class="flex flex-col gap-1 w-1/2">
                <label class="text-sm" for="departure_country"
                  >Departure Country</label
                >
                <Dropdown
                  id="departure_country"
                  v-model="formData.departure_country"
                  :options="countryStore.operationalCountries ?? []"
                  optionLabel="name"
                  optionValue="name"
                  placeholder="Select Departure Country"
                  :loading="countryStore.loading"
                  :disabled="countryStore.loading || loading"
                  class="w-full"
                  :class="{ 'p-invalid': v$.departure_country.$error }"
                />
                <small
                  v-if="v$.departure_country && v$.departure_country.$error"
                  class="text-red-500 text-xs"
                >
                  {{ v$.departure_country.$errors[0].$message }}
                </small>
              </div>
              <div class="flex flex-col gap-1 w-1/2">
                <label class="text-sm" for="departure_city"
                  >Departure State/City</label
                >
                <Dropdown
                  id="departure_city"
                  v-model="formData.departure_city"
                  :options="departureStates"
                  optionLabel="name"
                  optionValue="name"
                  placeholder="Select Departure State/City"
                  :disabled="!formData.departure_country || loading"
                  class="w-full"
                  :class="{ 'p-invalid': v$.departure_city.$error }"
                />
                <small
                  v-if="v$.departure_city && v$.departure_city.$error"
                  class="text-red-500 text-xs"
                >
                  {{ v$.departure_city.$errors[0].$message }}
                </small>
              </div>
            </div>

            <!-- Destination Info -->
            <div class="flex gap-4 mb-6">
              <div class="flex flex-col gap-1 w-1/2">
                <label class="text-sm" for="destination_country"
                  >Destination Country</label
                >
                <Dropdown
                  id="destination_country"
                  v-model="formData.destination_country"
                  :options="countryStore.operationalCountries ?? []"
                  optionLabel="name"
                  optionValue="name"
                  placeholder="Select Destination Country"
                  :loading="countryStore.loading"
                  :disabled="countryStore.loading || loading"
                  class="w-full"
                  :class="{ 'p-invalid': v$.destination_country.$error }"
                />
                <small
                  v-if="v$.destination_country && v$.destination_country.$error"
                  class="text-red-500 text-xs"
                >
                  {{ v$.destination_country.$errors[0].$message }}
                </small>
              </div>
              <div class="flex flex-col gap-1 w-1/2">
                <label class="text-sm" for="destination_city"
                  >Destination State/City</label
                >
                <Dropdown
                  id="destination_city"
                  v-model="formData.destination_city"
                  :options="destinationStates"
                  optionLabel="name"
                  optionValue="name"
                  placeholder="Select Destination State/City"
                  :disabled="!formData.destination_country || loading"
                  class="w-full"
                  :class="{ 'p-invalid': v$.destination_city.$error }"
                />
                <small
                  v-if="v$.destination_city && v$.destination_city.$error"
                  class="text-red-500 text-xs"
                >
                  {{ v$.destination_city.$errors[0].$message }}
                </small>
              </div>
            </div>

            <!-- Item Details -->
            <div class="flex flex-col gap-1 mb-6">
              <label class="text-sm" for="category">Item Category</label>
              <Dropdown
                id="category"
                v-model="formData.category"
                :options="categories"
                placeholder="Select Category"
                class="w-full"
                :class="{ 'p-invalid': v$.category.$error }"
                :disabled="loading"
              />
              <small
                v-if="v$.category && v$.category.$error"
                class="text-red-500 text-xs"
              >
                {{ v$.category.$errors[0].$message }}
              </small>
            </div>

            <div class="flex gap-4 mb-6">
              <div class="flex flex-col gap-1 w-1/2">
                <label class="text-sm" for="weight">Weight(kg)</label>
                <InputText
                  id="weight"
                  v-model="formData.weight"
                  placeholder="Enter Items Weight"
                  class="w-full"
                  :class="{ 'p-invalid': v$.weight.$error }"
                  :disabled="loading"
                />
                <small
                  v-if="v$.weight && v$.weight.$error"
                  class="text-red-500 text-xs"
                >
                  {{ v$.weight.$errors[0].$message }}
                </small>
              </div>
              <div class="flex flex-col gap-1 w-1/2">
                <label class="text-sm" for="value">Value Of Items($)</label>
                <InputText
                  id="value"
                  v-model="formData.value"
                  placeholder="Enter Items Value"
                  class="w-full"
                  :class="{ 'p-invalid': v$.value.$error }"
                  :disabled="loading"
                />
                <small
                  v-if="v$.value && v$.value.$error"
                  class="text-red-500 text-xs"
                >
                  {{ v$.value.$errors[0].$message }}
                </small>
              </div>
            </div>

            <div class="flex flex-col gap-1 mb-6">
              <label class="text-sm" for="description">Description</label>
              <Textarea
                id="description"
                v-model="formData.description"
                variant="filled"
                rows="5"
                cols="30"
                placeholder="Add More Information Here"
                :class="{ 'p-invalid': v$.description.$error }"
                :disabled="loading"
              />
              <small
                v-if="v$.description && v$.description.$error"
                class="text-red-500 text-xs"
              >
                {{ v$.description.$errors[0].$message }}
              </small>
            </div>

            <!-- Estimated Price -->
            <div class="flex mb-6">
              <div
                class="flex w-full items-center flex-col gap-2 h-[121px] justify-center py-3 px-4 border border-gray-400 rounded-lg"
              >
                <span class="price flex text-4xl text-gray font-bold">
                  <span v-if="loading">...</span>
                  <span v-else>{{ estimatedPrice }}</span>
                </span>
                <span class="block text-sm text-[#B4B4B3]">
                  Estimated shipping fee
                </span>
                <span v-if="error" class="text-red-500 text-xs">{{
                  error
                }}</span>
              </div>
            </div>

            <div class="flex justify-center">
              <Button
                class="bg-primary-600 text-white focus:outline-none py-3 px-5 rounded-md"
                type="submit"
                :loading="loading"
                :disabled="loading"
              >
                <span v-if="!loading">Get Quote</span>
                <span v-else class="flex items-center gap-2">
                  Processing...
                </span>
              </Button>
            </div>
          </form>
        </div>
      </div>
    </section>
  </div>
</template>
<style scoped></style>
