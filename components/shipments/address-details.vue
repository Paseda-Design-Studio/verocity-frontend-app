<script setup lang="ts">
  import { useShipment } from "~/composables/useShipment";
  import { useCountry } from "~/composables/useCountry";
  import { useCountryStore } from "~/stores/country";
  import { useShipmentFormStore } from "~/stores/shipmentForm";
  import type { Country, Location } from "~/utils/helper";
  import type { Person, ShipmentCostPayload, ShipmentItem } from "~/api/shipment/types";
  import { useVuelidate } from '@vuelidate/core';
  import { required, email, minLength } from '@vuelidate/validators';

  const countryStore = useCountryStore();
  const { loading, error, costCalculation, calculateShipmentCost } = useShipment();
  const { fetchCities } = useCountry();
  
  // simple debounce helper
  const debounce = (fn: (...args: any[]) => void, delay = 400) => {
    let t: any;
    return (...args: any[]) => {
      clearTimeout(t);
      t = setTimeout(() => fn(...args), delay);
    };
  };

  // Props and Emits
  const props = defineProps<{
    shippingItems: ShipmentItem[]
  }>();

  const emit = defineEmits<{
    'sender-updated': [sender: Person]
    'recipient-updated': [recipient: Person]
    'cost-calculated': [cost: any]
    'validation-changed': [isValid: boolean]
  }>();

  // Initialize country store
  onMounted(() => {
    if (!countryStore.operationalCountries) {
      countryStore.fetchOperationalCountries();
    }
  });

  // Form data
  const shipmentForm = useShipmentFormStore();
  const senderData = reactive({
    firstName: shipmentForm.formData.sender?.first_name || "",
    lastName: shipmentForm.formData.sender?.last_name || "",
    email: shipmentForm.formData.sender?.email || "",
    phone: shipmentForm.formData.sender?.phone || "",
    address: shipmentForm.formData.sender?.street || "",
    country: shipmentForm.formData.sender?.country || null,
    state: shipmentForm.formData.sender?.state || null,
    city: shipmentForm.formData.sender?.city || "",
    zipcode: shipmentForm.formData.sender?.zipcode || ""
  });

  const recipientData = reactive({
    fullName: [shipmentForm.formData.recipient?.first_name, shipmentForm.formData.recipient?.last_name].filter(Boolean).join(" "),
    email: shipmentForm.formData.recipient?.email || "",
    phone: shipmentForm.formData.recipient?.phone || "",
    address: shipmentForm.formData.recipient?.street || "",
    country: shipmentForm.formData.recipient?.country || null,
    state: shipmentForm.formData.recipient?.state || null,
    city: shipmentForm.formData.recipient?.city || "",
    zipcode: shipmentForm.formData.recipient?.zipcode || ""
  });

  // Cities state
  const senderCities = ref<string[]>([]);
  const recipientCities = ref<string[]>([]);
  const loadingSenderCities = ref(false);
  const loadingRecipientCities = ref(false);

  // Validation rules
  const senderRules = {
    firstName: { required: required, minLength: minLength(2) },
    lastName: { required: required, minLength: minLength(2) },
    email: { required: required, email: email },
    phone: { required: required, minLength: minLength(10) },
    address: { required: required, minLength: minLength(5) },
    country: { required: required },
    state: { required: required },
    city: { required: required },
    zipcode: { required: required, minLength: minLength(3) }
  };

  const recipientRules = {
    fullName: { required: required, minLength: minLength(2) },
    email: { required: required, email: email },
    phone: { required: required, minLength: minLength(10) },
    address: { required: required, minLength: minLength(5) },
    country: { required: required },
    state: { required: required },
    city: { required: required },
    zipcode: { required: required, minLength: minLength(3) }
  };

  // Vuelidate instances
  const senderV$ = useVuelidate(senderRules, senderData);
  const recipientV$ = useVuelidate(recipientRules, recipientData);

  // Watch for country changes and reset states
  watch(
    () => senderData.country,
    (newVal, oldVal) => {
      if (newVal !== oldVal) {
        senderData.state = null;
        senderData.city = "";
        senderCities.value = [];
      }
    }
  );

  watch(
    () => recipientData.country,
    (newVal, oldVal) => {
      if (newVal !== oldVal) {
        recipientData.state = null;
        recipientData.city = "";
        recipientCities.value = [];
      }
    }
  );

  // Watch for state changes and fetch cities
  watch(
    () => senderData.state,
    async (newState, oldState) => {
      if (newState !== oldState) {
        senderData.city = "";
        senderCities.value = [];
        
        if (newState && senderData.country) {
          const selectedCountry = countryStore.operationalCountries?.find(
            (c: Country) => c.name === senderData.country
          );
          const selectedLocation = selectedCountry?.locations?.find(
            (l: Location) => l.name === newState
          );
          
          if (selectedCountry?.code && selectedLocation?.code) {
            loadingSenderCities.value = true;
            try {
              senderCities.value = await fetchCities(selectedCountry.code, selectedLocation.code);
            } catch (error) {
              console.error('Error fetching sender cities:', error);
            } finally {
              loadingSenderCities.value = false;
            }
          }
        }
      }
    }
  );

  watch(
    () => recipientData.state,
    async (newState, oldState) => {
      if (newState !== oldState) {
        recipientData.city = "";
        recipientCities.value = [];
        
        if (newState && recipientData.country) {
          const selectedCountry = countryStore.operationalCountries?.find(
            (c: Country) => c.name === recipientData.country
          );
          const selectedLocation = selectedCountry?.locations?.find(
            (l: Location) => l.name === newState
          );
          
          if (selectedCountry?.code && selectedLocation?.code) {
            loadingRecipientCities.value = true;
            try {
              recipientCities.value = await fetchCities(selectedCountry.code, selectedLocation.code);
            } catch (error) {
              console.error('Error fetching recipient cities:', error);
            } finally {
              loadingRecipientCities.value = false;
            }
          }
        }
      }
    }
  );

  // Computed for filtered states/cities
  const senderStates = computed<Location[]>(() => {
    const c = countryStore.operationalCountries?.find(
      (c: Country) => c.name === senderData.country
    );
    return c?.locations || [];
  });

  const recipientStates = computed<Location[]>(() => {
    const c = countryStore.operationalCountries?.find(
      (c: Country) => c.name === recipientData.country
    );
    return c?.locations || [];
  });

  // Computed placeholders based on country
  const senderZipcodePlaceholder = computed(() => {
    if (senderData.country === 'United States') return 'e.g., 10001 or 90210';
    if (senderData.country === 'Ghana') return 'e.g., GA-123-4567';
    return 'Zip Code';
  });

  const senderCityPlaceholder = computed(() => {
    if (senderData.country === 'United States') return 'e.g., New York';
    if (senderData.country === 'Ghana') return 'e.g., Accra';
    return 'City';
  });

  const recipientZipcodePlaceholder = computed(() => {
    if (recipientData.country === 'United States') return 'e.g., 10001 or 90210';
    if (recipientData.country === 'Ghana') return 'e.g., GA-123-4567';
    return 'Zip Code';
  });

  const recipientCityPlaceholder = computed(() => {
    if (recipientData.country === 'United States') return 'e.g., Brooklyn';
    if (recipientData.country === 'Ghana') return 'e.g., Kumasi';
    return 'City';
  });

  // Form validation
  const isFormValid = computed(() => {
    return !senderV$.value.$invalid && !recipientV$.value.$invalid;
  });

  // Convert form data to API format
  const senderPerson = computed((): Person => ({
    first_name: senderData.firstName,
    last_name: senderData.lastName,
    email: senderData.email,
    phone: senderData.phone,
    street: senderData.address,
    country: senderData.country || '',
    state: senderData.state || '',
    city: senderData.city,
    zipcode: senderData.zipcode
  }));

  const recipientPerson = computed((): Person => ({
    first_name: recipientData.fullName.split(' ')[0] || '',
    last_name: recipientData.fullName.split(' ').slice(1).join(' ') || '',
    email: recipientData.email,
    phone: recipientData.phone,
    street: recipientData.address,
    country: recipientData.country || '',
    state: recipientData.state || '',
    city: recipientData.city,
    zipcode: recipientData.zipcode
  }));

  // Cost calculation trigger
  const triggerCostCalculation = async () => {
    console.log('triggerCostCalculation called');
    console.log('loading.value:', loading.value);
    console.log('isFormValid.value:', isFormValid.value);
    console.log('props.shippingItems.length:', props.shippingItems.length);
    
    // avoid overlapping requests which can keep loading stuck
    if (loading.value) {
      console.log('Skipping cost calculation - already loading');
      return;
    }
    
    // Check if we have required data
    if (!isFormValid.value) {
      console.log('Form is not valid, cannot calculate cost');
      return;
    }
    
    if (props.shippingItems.length === 0) {
      console.log('No shipping items, cannot calculate cost');
      return;
    }

    try {
      const costPayload: ShipmentCostPayload = {
        sender: senderPerson.value,
        recipient: recipientPerson.value,
        items: props.shippingItems,
        payment: {
          method: "paystack",
          currency: "USD",
          insurance_requested: true
        }
      };

      console.log('Calling calculateShipmentCost with payload:', costPayload);
      await calculateShipmentCost(costPayload);

      if (costCalculation.value) {
        console.log('Cost calculation successful:', costCalculation.value);
        emit('cost-calculated', costCalculation.value);
      } else {
        console.log('Cost calculation returned null/undefined');
      }
    } catch (err: any) {
      console.error('Error calculating cost:', err);
      // Error is already set in the composable
      // Just re-throw so caller knows it failed
      throw err;
    }
  };
  const triggerCostCalculationDebounced = debounce(() => {
    triggerCostCalculation();
  }, 500);

  // Watch for form changes and emit updates
  watch(senderPerson, (newSender) => {
    emit('sender-updated', newSender);
    // Debounced calculation when sender changes
    triggerCostCalculationDebounced();
  }, { deep: true });

  watch(recipientPerson, (newRecipient) => {
    emit('recipient-updated', newRecipient);
    // Debounced calculation when recipient changes
    triggerCostCalculationDebounced();
  }, { deep: true });

  watch(isFormValid, (valid) => {
    emit('validation-changed', valid);
  }, { immediate: true });

  // Watch for shipping items changes to recalculate cost
  watch(() => props.shippingItems, () => {
    if (isFormValid.value) {
      triggerCostCalculationDebounced();
    }
  }, { deep: true });

  // Watch for cost calculation updates
  watch(() => costCalculation.value, (newCost) => {
    if (newCost) {
      emit('cost-calculated', newCost);
    }
  });

  // Compute validation errors for display
  const validationErrors = computed(() => {
    const errors: string[] = [];
    
    // Sender validation errors
    if (senderV$.value.$error) {
      if (senderV$.value.firstName.$error) errors.push('Sender first name is required (min 2 characters)');
      if (senderV$.value.lastName.$error) errors.push('Sender last name is required (min 2 characters)');
      if (senderV$.value.email.$error) errors.push('Sender email is required and must be valid');
      if (senderV$.value.phone.$error) errors.push('Sender phone number is required (min 10 characters)');
      if (senderV$.value.address.$error) errors.push('Sender address is required (min 5 characters)');
      if (senderV$.value.country.$error) errors.push('Sender country is required');
      if (senderV$.value.state.$error) errors.push('Sender state is required');
      if (senderV$.value.city.$error) errors.push('Sender city is required');
      if (senderV$.value.zipcode.$error) errors.push('Sender zip code is required (min 3 characters)');
    }
    
    // Recipient validation errors
    if (recipientV$.value.$error) {
      if (recipientV$.value.fullName.$error) errors.push('Recipient full name is required (min 2 characters)');
      if (recipientV$.value.email.$error) errors.push('Recipient email is required and must be valid');
      if (recipientV$.value.phone.$error) errors.push('Recipient phone number is required (min 10 characters)');
      if (recipientV$.value.address.$error) errors.push('Recipient address is required (min 5 characters)');
      if (recipientV$.value.country.$error) errors.push('Recipient country is required');
      if (recipientV$.value.state.$error) errors.push('Recipient state is required');
      if (recipientV$.value.city.$error) errors.push('Recipient city is required');
      if (recipientV$.value.zipcode.$error) errors.push('Recipient zip code is required (min 3 characters)');
    }
    
    return errors;
  });

  const showValidationSummary = ref(false);

  // Trigger validation check to show errors
  const validateForm = () => {
    senderV$.value.$touch();
    recipientV$.value.$touch();
    showValidationSummary.value = !isFormValid.value;
  };

  // Handle blur events for individual fields
  const handleSenderFieldBlur = (fieldName: keyof typeof senderData) => {
    if (senderV$.value[fieldName]) {
      senderV$.value[fieldName].$touch();
    }
    // Show summary if any field has error after blur
    if (!isFormValid.value && (senderV$.value.$anyDirty || recipientV$.value.$anyDirty)) {
      showValidationSummary.value = true;
    }
  };

  const handleRecipientFieldBlur = (fieldName: keyof typeof recipientData) => {
    if (recipientV$.value[fieldName]) {
      recipientV$.value[fieldName].$touch();
    }
    // Show summary if any field has error after blur
    if (!isFormValid.value && (senderV$.value.$anyDirty || recipientV$.value.$anyDirty)) {
      showValidationSummary.value = true;
    }
  };

  // Import sender function (placeholder)
  const importSender = () => {
    // TODO: Implement import sender functionality
    console.log("Import sender clicked");
  };

  // Expose method for parent component
  defineExpose({
    triggerCostCalculation,
    validateForm
  });
</script>

<template>
  <div>
    <!-- Validation Error Summary -->
    <div v-if="!isFormValid && showValidationSummary" class="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
      <div class="flex items-start gap-3">
        <svg class="w-5 h-5 text-red-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
        </svg>
        <div class="flex-1">
          <h3 class="text-sm font-semibold text-red-800 mb-2">Please fix the following errors:</h3>
          <ul class="list-disc list-inside space-y-1">
            <li v-for="(error, index) in validationErrors" :key="index" class="text-sm text-red-700">
              {{ error }}
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Cost Calculation Loading/Error Display -->
    <div v-if="loading && !costCalculation" class="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
      <div class="flex items-center gap-3">
        <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
        <p class="text-blue-800 text-sm">Calculating shipping cost...</p>
      </div>
    </div>

    <div v-if="error" class="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
      <div class="flex items-start gap-3">
        <svg class="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
        </svg>
        <div class="flex-1">
          <h3 class="text-sm font-semibold text-red-800 mb-1">Cost Calculation Error</h3>
          <p class="text-sm text-red-700">{{ error }}</p>
        </div>
      </div>
    </div>

    <!-- Sender's Information -->
    <div class="justify-between flex items-center mb-4">
      <p class="text-lg font-medium">Sender's Information</p>
      <button @click="importSender"
        class="text-primary-600 font-semibold underline hover:text-primary-700 text-sm font-medium" type="button">
        Import Customer
      </button>
    </div>

    <!-- Sender Name Fields -->
    <div class="flex gap-4 mb-6">
      <div class="flex flex-col gap-1 w-1/2">
        <label class="text-sm" for="sender-firstname">First name <span class="text-red-500">*</span></label>
        <InputText id="sender-firstname" v-model="senderData.firstName" placeholder="First Name" class="w-full"
          :class="{ 'p-invalid': senderV$.firstName.$error }" 
          @blur="handleSenderFieldBlur('firstName')" />
        <small v-if="senderV$.firstName.$error" class="p-error">
          {{ senderV$.firstName.$errors[0].$message }}
        </small>
      </div>
      <div class="flex flex-col gap-1 w-1/2">
        <label class="text-sm" for="sender-lastname">Last name <span class="text-red-500">*</span></label>
        <InputText id="sender-lastname" v-model="senderData.lastName" placeholder="Last Name" class="w-full"
          :class="{ 'p-invalid': senderV$.lastName.$error }" 
          @blur="handleSenderFieldBlur('lastName')" />
        <small v-if="senderV$.lastName.$error" class="p-error">
          {{ senderV$.lastName.$errors[0].$message }}
        </small>
      </div>
    </div>

    <!-- Sender Email and Phone -->
    <div class="flex gap-4 mb-6">
      <div class="flex flex-col gap-1 w-1/2">
        <label class="text-sm" for="sender-email">Email Address <span class="text-red-500">*</span></label>
        <InputText id="sender-email" v-model="senderData.email" placeholder="Email Address" class="w-full"
          :class="{ 'p-invalid': senderV$.email.$error }" 
          @blur="handleSenderFieldBlur('email')" />
        <small v-if="senderV$.email.$error" class="p-error">
          {{ senderV$.email.$errors[0].$message }}
        </small>
      </div>
      <div class="flex flex-col gap-1 w-1/2">
        <label class="text-sm" for="sender-phone">Phone Number <span class="text-red-500">*</span></label>
        <InputText id="sender-phone" v-model="senderData.phone" placeholder="Phone Number" class="w-full"
          :class="{ 'p-invalid': senderV$.phone.$error }" 
          @blur="handleSenderFieldBlur('phone')" />
        <small v-if="senderV$.phone.$error" class="p-error">
          {{ senderV$.phone.$errors[0].$message }}
        </small>
      </div>
    </div>

    <!-- Sender Address -->
    <div class="flex flex-col gap-1 mb-6">
      <label class="text-sm" for="sender-address">Address <span class="text-red-500">*</span></label>
      <InputText id="sender-address" v-model="senderData.address" placeholder="Street Address" class="w-full"
        :class="{ 'p-invalid': senderV$.address.$error }" 
        @blur="handleSenderFieldBlur('address')" />
      <small v-if="senderV$.address.$error" class="p-error">
        {{ senderV$.address.$errors[0].$message }}
      </small>
    </div>

    <!-- Sender Country and State -->
    <div class="flex gap-4 mb-6">
      <div class="flex flex-col gap-1 w-1/2">
        <label class="text-sm" for="sender-country">Country <span class="text-red-500">*</span></label>
        <Dropdown id="sender-country" v-model="senderData.country" :options="countryStore.operationalCountries ?? []"
          optionLabel="name" optionValue="name" placeholder="Select Country" :loading="countryStore.loading"
          :disabled="countryStore.loading" class="w-full" :class="{ 'p-invalid': senderV$.country.$error }" 
          @blur="handleSenderFieldBlur('country')" />
        <small v-if="senderV$.country.$error" class="p-error">
          {{ senderV$.country.$errors[0].$message }}
        </small>
      </div>
      <div class="flex flex-col gap-1 w-1/2">
        <label class="text-sm" for="sender-state">State <span class="text-red-500">*</span></label>
        <Dropdown id="sender-state" v-model="senderData.state" :options="senderStates" optionLabel="name"
          optionValue="name" placeholder="Select State" :disabled="!senderData.country" class="w-full"
          :class="{ 'p-invalid': senderV$.state.$error }" 
          @blur="handleSenderFieldBlur('state')" />
        <small v-if="senderV$.state.$error" class="p-error">
          {{ senderV$.state.$errors[0].$message }}
        </small>
      </div>
    </div>

    <!-- Sender City and Zipcode -->
    <div class="flex gap-4 mb-8">
      <div class="flex flex-col gap-1 w-1/2">
        <label class="text-sm" for="sender-city">City <span class="text-red-500">*</span></label>
        <Dropdown 
          id="sender-city" 
          v-model="senderData.city" 
          :options="senderCities" 
          placeholder="Select City" 
          :disabled="!senderData.state || loadingSenderCities" 
          :loading="loadingSenderCities"
          class="w-full"
          :class="{ 'p-invalid': senderV$.city.$error }" 
          @blur="handleSenderFieldBlur('city')" />
        <small v-if="senderV$.city.$error" class="p-error">
          {{ senderV$.city.$errors[0].$message }}
        </small>
      </div>
      <div class="flex flex-col gap-1 w-1/2">
        <label class="text-sm" for="sender-zipcode">Zip Code <span class="text-red-500">*</span></label>
        <InputText id="sender-zipcode" v-model="senderData.zipcode" :placeholder="senderZipcodePlaceholder" class="w-full"
          :class="{ 'p-invalid': senderV$.zipcode.$error }" 
          @blur="handleSenderFieldBlur('zipcode')" />
        <small v-if="senderV$.zipcode.$error" class="p-error">
          {{ senderV$.zipcode.$errors[0].$message }}
        </small>
      </div>
    </div>

    <!-- Recipient's Information -->
    <div class="justify-between flex items-center mb-4">
      <p class="text-lg font-medium">Recipient's Information</p>
    </div>

    <!-- Recipient Full Name -->
    <div class="flex flex-col gap-1 mb-6">
      <label class="text-sm" for="recipient-fullname">Full Name <span class="text-red-500">*</span></label>
      <InputText id="recipient-fullname" v-model="recipientData.fullName" placeholder="Full Name" class="w-full"
        :class="{ 'p-invalid': recipientV$.fullName.$error }" 
        @blur="handleRecipientFieldBlur('fullName')" />
      <small v-if="recipientV$.fullName.$error" class="p-error">
        {{ recipientV$.fullName.$errors[0].$message }}
      </small>
    </div>

    <!-- Recipient Email and Phone -->
    <div class="flex gap-4 mb-6">
      <div class="flex flex-col gap-1 w-1/2">
        <label class="text-sm" for="recipient-email">Email Address <span class="text-red-500">*</span></label>
        <InputText id="recipient-email" v-model="recipientData.email" placeholder="Email Address" class="w-full"
          :class="{ 'p-invalid': recipientV$.email.$error }" 
          @blur="handleRecipientFieldBlur('email')" />
        <small v-if="recipientV$.email.$error" class="p-error">
          {{ recipientV$.email.$errors[0].$message }}
        </small>
      </div>
      <div class="flex flex-col gap-1 w-1/2">
        <label class="text-sm" for="recipient-phone">Phone Number <span class="text-red-500">*</span></label>
        <InputText id="recipient-phone" v-model="recipientData.phone" placeholder="Phone Number" class="w-full"
          :class="{ 'p-invalid': recipientV$.phone.$error }" 
          @blur="handleRecipientFieldBlur('phone')" />
        <small v-if="recipientV$.phone.$error" class="p-error">
          {{ recipientV$.phone.$errors[0].$message }}
        </small>
      </div>
    </div>

    <!-- Recipient Address -->
    <div class="flex flex-col gap-1 mb-6">
      <label class="text-sm" for="recipient-address">Address <span class="text-red-500">*</span></label>
      <InputText id="recipient-address" v-model="recipientData.address" placeholder="Street Address" class="w-full"
        :class="{ 'p-invalid': recipientV$.address.$error }" 
        @blur="handleRecipientFieldBlur('address')" />
      <small v-if="recipientV$.address.$error" class="p-error">
        {{ recipientV$.address.$errors[0].$message }}
      </small>
    </div>

    <!-- Recipient Country and State -->
    <div class="flex gap-4 mb-6">
      <div class="flex flex-col gap-1 w-1/2">
        <label class="text-sm" for="recipient-country">Country <span class="text-red-500">*</span></label>
        <Dropdown id="recipient-country" v-model="recipientData.country"
          :options="countryStore.operationalCountries ?? []" optionLabel="name" optionValue="name"
          placeholder="Select Country" :loading="countryStore.loading" :disabled="countryStore.loading" class="w-full"
          :class="{ 'p-invalid': recipientV$.country.$error }" 
          @blur="handleRecipientFieldBlur('country')" />
        <small v-if="recipientV$.country.$error" class="p-error">
          {{ recipientV$.country.$errors[0].$message }}
        </small>
      </div>
      <div class="flex flex-col gap-1 w-1/2">
        <label class="text-sm" for="recipient-state">State <span class="text-red-500">*</span></label>
        <Dropdown id="recipient-state" v-model="recipientData.state" :options="recipientStates" optionLabel="name"
          optionValue="name" placeholder="Select State" :disabled="!recipientData.country" class="w-full"
          :class="{ 'p-invalid': recipientV$.state.$error }" 
          @blur="handleRecipientFieldBlur('state')" />
        <small v-if="recipientV$.state.$error" class="p-error">
          {{ recipientV$.state.$errors[0].$message }}
        </small>
      </div>
    </div>

    <!-- Recipient City and Zipcode -->
    <div class="flex gap-4 mb-6">
      <div class="flex flex-col gap-1 w-1/2">
        <label class="text-sm" for="recipient-city">City <span class="text-red-500">*</span></label>
        <Dropdown 
          id="recipient-city" 
          v-model="recipientData.city" 
          :options="recipientCities" 
          placeholder="Select City" 
          :disabled="!recipientData.state || loadingRecipientCities" 
          :loading="loadingRecipientCities"
          class="w-full"
          :class="{ 'p-invalid': recipientV$.city.$error }" 
          @blur="handleRecipientFieldBlur('city')" />
        <small v-if="recipientV$.city.$error" class="p-error">
          {{ recipientV$.city.$errors[0].$message }}
        </small>
      </div>
      <div class="flex flex-col gap-1 w-1/2">
        <label class="text-sm" for="recipient-zipcode">Zip Code <span class="text-red-500">*</span></label>
        <InputText id="recipient-zipcode" v-model="recipientData.zipcode" :placeholder="recipientZipcodePlaceholder" class="w-full"
          :class="{ 'p-invalid': recipientV$.zipcode.$error }" 
          @blur="handleRecipientFieldBlur('zipcode')" />
        <small v-if="recipientV$.zipcode.$error" class="p-error">
          {{ recipientV$.zipcode.$errors[0].$message }}
        </small>
      </div>
    </div>

    <!-- Cost Calculation Result -->
    <div v-if="costCalculation" class="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
      <h3 class="text-lg font-medium text-green-800 mb-2">Shipping Cost Calculated</h3>
      <div class="grid grid-cols-2 gap-4 text-sm">
        <div>
          <span class="text-green-600">Total Cost:</span>
          <span class="font-semibold ml-2">{{ costCalculation.data.cost_breakdown.currency }} {{
            costCalculation.data.cost_breakdown.total }}</span>
        </div>
        <div>
          <span class="text-green-600">Base Cost:</span>
          <span class="font-semibold ml-2">{{ costCalculation.data.cost_breakdown.currency }} {{
            costCalculation.data.cost_breakdown.base_shipping_cost }}</span>
        </div>
        <div>
          <span class="text-green-600">Route:</span>
          <span class="font-semibold ml-2">{{ costCalculation.data.cost_breakdown.route.origin }} → {{
            costCalculation.data.cost_breakdown.route.destination }}</span>
        </div>
        <div>
          <span class="text-green-600">Weight:</span>
          <span class="font-semibold ml-2">{{ costCalculation.data.cost_breakdown.total_weight }}kg</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .p-invalid {
    border-color: #ef4444 !important;
  }

  .p-error {
    color: #ef4444;
    font-size: 0.75rem;
    margin-top: 0.25rem;
  }
</style>
