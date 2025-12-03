<template>
    <div>
        
        <!-- Existing Shipping Items -->
        <ShipmentsShippingItemList v-if="shippingItems.length > 0" :items="shippingItems" @remove="handleRemoveItem"
            @toggle-expanded="handleToggleExpanded" @edit-item="handleEditItem" />

        <!-- Item Details Form -->
        <ShipmentsShippingItemForm v-if="shouldShowForm" :form-data="itemFormData" :category-options="categoryOptions"
            :upload-loading="uploadLoading" @files-selected="handleFilesSelected" @files-removed="handleFilesRemoved"
            @update-form-data="handleFormDataUpdate" ref="itemFormRef" />

        <!-- Dynamic Add Item Button - Only show if there are existing items -->
        <ShipmentsAddItemButton v-if="shippingItems.length > 0" :show-form="showAddItemForm" :is-form-valid="isFormValid"
            :has-existing-items="shippingItems.length > 0" @toggle="handleToggleAddItem"
            @cancel="handleCancelAddItem" />

        <!-- Upload Error Display -->
        <div v-if="uploadError" class="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p class="text-red-800 text-sm">
                <strong>Upload Error:</strong> {{ uploadError }}
                <button @click="clearUploadError" class="ml-2 text-red-600 underline hover:text-red-800">
                    Dismiss
                </button>
            </p>
        </div>
    </div>
</template>

<script setup lang="ts">
    import type { ShipmentItem, CreateShipmentItemPayload } from '~/api/shipment/types'
    import { useShipment } from '~/composables/useShipment'

    // Props & Emits
    // Edit item logic
    const handleEditItem = ({ item, index }: { item: ShipmentItem, index: number }) => {
        // Remove the item from the list
        emit('remove-item', index)
        // Prepopulate the form with the selected item's data
        handleFormDataUpdate(item)
        // Always show the form for editing
        showAddItemForm.value = true
    }
    const props = defineProps<{
        shippingItems: ShipmentItem[],
        draftItem?: CreateShipmentItemPayload | null
    }>()

    const emit = defineEmits<{
        'add-item': [item: ShipmentItem],
        'remove-item': [index: number],
        'validation-changed': [isValid: boolean],
        'update-draft-item': [item: CreateShipmentItemPayload | null]
    }>()

    // Composables
    const { uploadShipmentImage, uploadLoading, uploadError, clearUploadError } = useShipment()

    // Refs
    const showAddItemForm = ref(false)
    const itemFormRef = ref()

    // Form Data
    const defaultItem = {
        name: '',
        category: '',
        weight: 0,
        length: 0,
        width: 0,
        height: 0,
        quantity: 1,
        value: 0,
        sku: '',
        fragile: false,
        insurance_required: false,
        handling_instructions: '',
        image_url: '',
        image_ref: '',
    }
    const itemFormData = reactive<CreateShipmentItemPayload>({ ...defaultItem })

    // On mount, if draftItem is present and no items exist, restore draft to form
    onMounted(() => {
        if (props.draftItem && props.shippingItems.length === 0) {
            Object.assign(itemFormData, props.draftItem)
        }
    })

    // Computed Properties
    const shouldShowForm = computed(() =>
        props.shippingItems.length === 0 || showAddItemForm.value
    )

    const isFormValid = computed(() =>
        itemFormData.name.trim() !== '' &&
        itemFormData.category !== '' &&
        itemFormData.weight > 0 &&
        itemFormData.length > 0 &&
        itemFormData.width > 0 &&
        itemFormData.height > 0 &&
        itemFormData.value > 0 &&
        !uploadLoading.value
    )

    // Updated validation logic: valid if there are existing items OR if the current form is valid
    const isStepValid = computed(() => {
        return props.shippingItems.length > 0 || isFormValid.value
    })

    const categoryOptions = computed(() =>
        SHIPPING_CATEGORIES.map(category => ({
            name: category,
            value: category
        }))
    )

    // Handle form data updates
    const handleFormDataUpdate = (updates: Partial<CreateShipmentItemPayload>) => {
        Object.assign(itemFormData, updates)
        // Emit draft item update if no items yet
        if (props.shippingItems.length === 0) {
            emit('update-draft-item', { ...itemFormData })
        }
    }

    const handleToggleAddItem = () => {
        if (!showAddItemForm.value) {
            // Show the form
            showAddItemForm.value = true
        } else if (isFormValid.value) {
            // Add the item
            const newItem: ShipmentItem = {
                ...itemFormData,
            }

            emit('add-item', newItem)
            emit('update-draft-item', null)
            resetForm()
            showAddItemForm.value = false
        } else {
            console.error('Please fill in required fields')
        }
    }

    const handleCancelAddItem = () => {
        resetForm()
        showAddItemForm.value = false
    }

    const resetForm = () => {
        Object.assign(itemFormData, defaultItem)
        itemFormRef.value?.clearFiles()
        // Clear draft when resetting
        emit('update-draft-item', null)
    }

    // Item Management
    const handleRemoveItem = (index: number) => {
        emit('remove-item', index)
    }

    const handleToggleExpanded = (index: number, expanded: boolean) => {
        console.log(`Item at index ${index} is now ${expanded ? 'expanded' : 'collapsed'}`)
    }

    // File Handlers
    const handleFilesSelected = async (files: File[]) => {
        if (files.length > 0) {
            const firstFile = files[0]

            try {
                const uploadResponse = await uploadShipmentImage(firstFile)
                console.log('Image upload response:', uploadResponse)
                if (uploadResponse && uploadResponse?.publicId && uploadResponse?.uploadUrl) {
                    handleFormDataUpdate({
                        image_url: uploadResponse.uploadUrl,
                        image_ref: uploadResponse.publicId
                    })
                } else {
                    console.error('Image upload failed')
                }
            } catch (error) {
                console.error('Image upload failed:', error || 'Unknown error')
            }
        }
    }

    const handleFilesRemoved = (files: File[]) => {
        console.log('Remaining files:', files)

        if (files.length === 0) {
            handleFormDataUpdate({
                image_url: '',
                image_ref: ''
            })
        }
    }

    // Watch for validation changes
    watch(isStepValid, (valid) => {
        emit('validation-changed', valid)
    }, { immediate: true })

    // Watch for items changes
    watch(() => props.shippingItems.length, () => {
        emit('validation-changed', isStepValid.value)
    })

    // Expose the current form data and update method so parent can access it
    const getCurrentFormData = () => {
        return isFormValid.value ? { ...itemFormData } : null
    }
    defineExpose({
        getCurrentFormData,
        handleFormDataUpdate
    })

    // Constants
    const SHIPPING_CATEGORIES = [
        "Electronics", "Clothing", "Documents", "Food", "Furniture",
        "Automobile Parts", "Books", "Toys", "Medical Supplies", "Jewelry",
        "Cosmetics", "Sports Equipment", "Machinery", "Musical Instruments",
        "Art & Antiques", "Shoes", "Bags & Luggage", "Pet Supplies",
        "Home Appliances", "Gardening Tools", "Other"
    ]
</script>
