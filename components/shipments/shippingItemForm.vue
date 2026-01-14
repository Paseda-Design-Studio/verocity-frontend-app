<template>
    <div class="mb-8">
        <div class="space-y-6">
            <!-- File Upload -->
            <div>
                <AppFileInput ref="fileInputRef" label="Add photo" accept="image/*,.pdf" :multiple="true"
                    @files-selected="handleFilesSelected" @files-removed="handleFilesRemoved" />

                <!-- Upload Progress Indicator -->
                <div v-if="isUploading" class="mt-2 flex items-center gap-2 text-sm text-blue-600">
                    <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                    <span>Uploading image...</span>
                </div>

                <!-- Upload Error -->
                <div v-if="uploadError" class="mt-2 text-sm text-red-600">
                    {{ uploadError }}
                </div>
            </div>

            <!-- Rest of your form fields remain the same -->
            <!-- Name and Category Row -->
            <div class="flex flex-col md:flex-row gap-4">
                <div class="flex flex-col gap-1 flex-grow">
                    <label class="text-sm" for="itemName">Item Name *</label>
                    <InputText id="itemName" v-model="formData.name" placeholder="Enter item name"
                        @update:modelValue="$emit('update-form-data', { name: $event })" />
                </div>
                <div class="flex flex-col gap-1 flex-grow">
                    <label class="text-sm" for="category">Category *</label>
                    <Dropdown id="category" v-model="formData.category" :options="categoryOptions" optionLabel="name"
                        optionValue="value" placeholder="Select category" class="w-full"
                        @update:modelValue="$emit('update-form-data', { category: $event })" />
                </div>
            </div>

            <!-- All your other form fields remain exactly the same -->
            <!-- Weight and Dimensions Row -->
            <div class="flex flex-col md:flex-row gap-4">
                <div class="flex flex-col gap-1 flex-grow">
                    <label class="text-sm" for="weight">Weight (kg)</label>
                    <InputNumber id="weight" v-model="formData.weight" placeholder="0.00" :minFractionDigits="2"
                        :maxFractionDigits="2" suffix=" kg"
                        @update:modelValue="$emit('update-form-data', { weight: $event })" />
                </div>
                <div class="flex flex-col gap-1 flex-grow">
                    <label class="text-sm" for="length">Length (cm)</label>
                    <InputNumber id="length" v-model="formData.length" placeholder="0.00" :minFractionDigits="2"
                        :maxFractionDigits="2" suffix=" cm"
                        @update:modelValue="$emit('update-form-data', { length: $event })" />
                </div>
            </div>

            <!-- Width and Height Row -->
            <div class="flex flex-col md:flex-row gap-4">
                <div class="flex flex-col gap-1 flex-grow">
                    <label class="text-sm" for="width">Width (cm)</label>
                    <InputNumber id="width" v-model="formData.width" placeholder="0.00" :minFractionDigits="2"
                        :maxFractionDigits="2" suffix=" cm"
                        @update:modelValue="$emit('update-form-data', { width: $event })" />
                </div>
                <div class="flex flex-col gap-1 flex-grow">
                    <label class="text-sm" for="height">Height (cm)</label>
                    <InputNumber id="height" v-model="formData.height" placeholder="0.00" :minFractionDigits="2"
                        :maxFractionDigits="2" suffix=" cm"
                        @update:modelValue="$emit('update-form-data', { height: $event })" />
                </div>
            </div>

            <!-- Quantity and Value Row -->
            <div class="flex flex-col md:flex-row gap-4">
                <div class="flex flex-col gap-1 flex-grow">
                    <label class="text-sm" for="quantity">Quantity</label>
                    <InputNumber id="quantity" v-model="formData.quantity" placeholder="1" :min="1" showButtons
                        buttonLayout="stacked" class="w-full" :pt="{
                            input: { class: 'w-full focus:ring-0 focus:ring-offset-0' },
                            buttonGroup: { class: 'flex flex-col text-white' }
                        }" @update:modelValue="$emit('update-form-data', { quantity: $event })" />
                </div>
                <div class="flex flex-col gap-1 flex-grow">
                    <label class="text-sm" for="value">Value of Item ($)</label>
                    <InputNumber id="value" v-model="formData.value" placeholder="0.00" :minFractionDigits="2"
                        :maxFractionDigits="2" prefix="$"
                        @update:modelValue="$emit('update-form-data', { value: $event })" />
                </div>
            </div>

            <!-- Item State - Fragile Radio Buttons -->
            <div class="flex flex-col gap-3">
                <label class="text-sm font-medium">Item State - Is the item fragile?</label>
                <div class="flex gap-6">
                    <div class="flex items-center">
                        <AppRadioInput id="fragile-yes" name="fragile" :value="true" :modelValue="formData.fragile"
                            @update:modelValue="$emit('update-form-data', { fragile: $event })"
                            label="Yes, it's fragile" />
                    </div>
                    <div class="flex items-center">
                        <AppRadioInput id="fragile-no" name="fragile" :value="false" :modelValue="formData.fragile"
                            @update:modelValue="$emit('update-form-data', { fragile: $event })"
                            label="No, it's not fragile" />
                    </div>
                </div>
            </div>

            <!-- Requires Insurance Radio Buttons -->
            <div class="flex flex-col gap-3">
                <label class="text-sm font-medium">Requires Insurance</label>
                <div class="flex gap-6">
                    <div class="flex items-center">
                        <AppRadioInput id="insurance-yes" name="insurance" :value="true"
                            :modelValue="formData.insurance_required"
                            @update:modelValue="$emit('update-form-data', { insurance_required: $event })"
                            label="Yes, requires insurance" />
                    </div>
                    <div class="flex items-center">
                        <AppRadioInput id="insurance-no" name="insurance" :value="false"
                            :modelValue="formData.insurance_required"
                            @update:modelValue="$emit('update-form-data', { insurance_required: $event })"
                            label="No insurance needed" />
                    </div>
                </div>
            </div>

            <!-- Handling Instructions -->
            <div class="flex flex-col gap-1">
                <label class="text-sm" for="handlingInstructions">Handling Instructions</label>
                <Textarea id="handlingInstructions" v-model="formData.handling_instructions"
                    placeholder="Enter any special handling instructions..." rows="4" class="w-full"
                    @update:modelValue="$emit('update-form-data', { handling_instructions: $event })" />
            </div>

            <!-- Stock Unit -->
            <div class="flex flex-col gap-1">
                <label class="text-sm" for="stockUnit">Stock Unit</label>
                <InputText id="stockUnit" v-model="formData.sku"
                    placeholder="Enter stock unit (e.g., pieces, boxes, etc.)"
                    @update:modelValue="$emit('update-form-data', { sku: $event })" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import type { CreateShipmentItemPayload } from '~/api/shipment/types'
    import { useShipment } from '~/composables/useShipment'
    import useVuelidate from '@vuelidate/core'
    import { required, minValue } from '@vuelidate/validators'
    import { toRefs } from 'vue'

    const props = defineProps<{
        formData: CreateShipmentItemPayload
        categoryOptions: Array<{ name: string; value: string }>
    }>()

    const emit = defineEmits<{
        'files-selected': [files: File[]]
        'files-removed': [files: File[]]
        'update-form-data': [data: Partial<CreateShipmentItemPayload>]
    }>()

    const { uploadShipmentImage, uploadLoading, uploadError, clearUploadError } = useShipment()

    const fileInputRef = ref()
    const selectedFiles = ref<File[]>([])
    const isUploading = computed(() => uploadLoading.value)

    // Handle file selection and upload
    const handleFilesSelected = async (files: File[]) => {
        selectedFiles.value = files
        clearUploadError() // Clear any previous errors

        if (files.length > 0) {
            const firstFile = files[0]

            try {
                // Upload the file and wait for the result
                const uploadResult = await uploadShipmentImage(firstFile)

                // Only update form data with real Cloudinary URLs
                if (uploadResult && uploadResult.uploadUrl && uploadResult.publicId) {
                    emit('update-form-data', {
                        image_url: uploadResult.uploadUrl,
                        image_ref: uploadResult.publicId
                    })
                }
            } catch (error) {
                console.error('Upload failed:', error)
                // Clear the file selection on error
                fileInputRef.value?.clearFiles()
                selectedFiles.value = []
            }
        }

        emit('files-selected', files)
    }

    const handleFilesRemoved = (files: File[]) => {
        selectedFiles.value = files
        clearUploadError()

        // Clear image data if no files
        if (files.length === 0) {
            emit('update-form-data', {
                image_url: '',
                image_ref: ''
            })
        }

        emit('files-removed', files)
    }

    // Expose methods for parent component
    const clearFiles = () => {
        fileInputRef.value?.clearFiles()
        selectedFiles.value = []
        clearUploadError()
        emit('update-form-data', {
            image_url: '',
            image_ref: ''
        })
    }

    const getCurrentFiles = () => {
        return selectedFiles.value
    }

    defineExpose({
        clearFiles,
        getCurrentFiles
    })

    // Vuelidate rules
    const rules = computed(() => ({
        name: { required },
        category: { required },
        weight: { minValue: minValue(0.01) },
        length: { minValue: minValue(0.01) },
        width: { minValue: minValue(0.01) },
        height: { minValue: minValue(0.01) },
        quantity: { required, minValue: minValue(1) },
        value: { minValue: minValue(0) },
        fragile: {},
        insurance_required: {},
        handling_instructions: {},
        sku: {},
        image_url: {},
        image_ref: {},
    }))

    const formRefs = toRefs({
        ...props.formData,
        handling_instructions: props.formData.handling_instructions ?? ''
    })
    const v$ = useVuelidate(rules, formRefs, { $autoDirty: true })
</script>
