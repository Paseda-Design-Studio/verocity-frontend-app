<script setup lang="ts">
    import type { ShipmentItem, ShipmentData } from '~/api/shipment/types'

    definePageMeta({
        layout: 'admin',
    });

    const route = useRoute()
    const shipmentId = route.params.id as string
    const showUpdateStatusModal = ref(false)

    // Mock/placeholder data for development
    const createMockShipmentData = (id: string): ShipmentData => ({
        ref_id: `PCM-${id.toUpperCase()}`,
        delivery_status: 'in transit',
        sender: {
            first_name: 'John',
            last_name: 'Doe',
            email: 'john.doe@example.com',
            phone: '+1 (555) 123-4567',
            street: '123 Main Street',
            city: 'New York',
            state: 'NY',
            country: 'United States',
            zipcode: '10001'
        },
        recipient: {
            first_name: 'Jane',
            last_name: 'Smith',
            email: 'jane.smith@example.com',
            phone: '+1 (555) 987-6543',
            street: '456 Oak Avenue',
            city: 'Los Angeles',
            state: 'CA',
            country: 'United States',
            zipcode: '90210'
        },
        items: [
            {
                name: 'MacBook Pro 16"',
                weight: 2.1,
                length: 35.79,
                width: 24.59,
                height: 1.68,
                quantity: 1,
                category: 'Electronics',
                value: 2499.00,
                fragile: true,
                insurance_required: true,
                handling_instructions: 'Handle with care - fragile electronics',
                sku: 'MBP16-2023-001',
                image_url: '/package.png',
                image_ref: 'macbook-pro-16-2023'
            },
            {
                name: 'Wireless Mouse',
                weight: 0.1,
                length: 12,
                width: 6,
                height: 3,
                quantity: 2,
                category: 'Electronics',
                value: 79.99,
                fragile: false,
                insurance_required: false,
                handling_instructions: '',
                sku: 'WM-001',
                image_url: '/package.png',
                image_ref: 'wireless-mouse'
            }
        ],
        payment: {
            ref_id: `PAY-${id.toUpperCase()}-001`,
            method: 'credit_card',
            amount: 2807.50,
            currency: 'USD',
            status: 'paid',
            insurance: 120.00,
            tax: 187.50,
            discount: 0,
            details: {
                card_last_four: '4242',
                card_brand: 'visa'
            }
        }
    })

    // Simulate loading state for realism
    const pending = ref(true)
    const error = ref<unknown | null>(null)
    const shipmentData = ref<ShipmentData | null>(null)

    // Simulate API call with loading delay
    onMounted(async () => {
        try {
            // Simulate network delay
            await new Promise(resolve => setTimeout(resolve, 1000))

            // Create mock data based on the ID
            shipmentData.value = createMockShipmentData(shipmentId)
            pending.value = false
        } catch (err) {
            console.error('Failed to load shipment data:', err)
            error.value = err
            pending.value = false
        }
    })

    const copyTrackingId = async () => {
        try {
            const trackingId = shipmentData.value?.ref_id || 'N/A'
            await navigator.clipboard.writeText(trackingId);
            console.log('Tracking ID copied to clipboard:', trackingId);
            // TODO: Add toast notification when you implement it
        } catch (err) {
            console.error('Failed to copy tracking ID: ', err);
        }
    };

    // FormData interface to match what the components expect
    interface FormData {
        shippingItems: ShipmentItem[]
        sender: {
            name: string
            phone: string
            address: string
        }
        recipient: {
            name: string
            phone: string
            address: string
        }
        paymentMethod: string
    }

    // Transform the mock shipment data to match FormData structure
    const formData = computed<FormData>(() => {
        if (!shipmentData.value) {
            return {
                shippingItems: [],
                sender: { name: '', phone: '', address: '' },
                recipient: { name: '', phone: '', address: '' },
                paymentMethod: ''
            }
        }

        const data = shipmentData.value
        return {
            shippingItems: data.items || [],
            sender: {
                name: `${data.sender?.first_name || ''} ${data.sender?.last_name || ''}`.trim(),
                phone: data.sender?.phone || '',
                address: [
                    data.sender?.street,
                    data.sender?.city,
                    data.sender?.state,
                    data.sender?.country,
                    data.sender?.zipcode
                ].filter(Boolean).join(', ')
            },
            recipient: {
                name: `${data.recipient?.first_name || ''} ${data.recipient?.last_name || ''}`.trim(),
                phone: data.recipient?.phone || '',
                address: [
                    data.recipient?.street,
                    data.recipient?.city,
                    data.recipient?.state,
                    data.recipient?.country,
                    data.recipient?.zipcode
                ].filter(Boolean).join(', ')
            },
            paymentMethod: data.payment?.method || ''
        }
    })

    // Format date helper
    const formatDate = (dateString?: string) => {
        // Since we don't have real dates, return a mock date
        return new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    // Mock action handlers
    const handleMarkAsPaid = async () => {
        try {
            console.log('Mock: Marking shipment as paid...')

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 500))
            // Update mock data
            if (shipmentData.value?.payment) {
                shipmentData.value.payment.status = 'paid'
            }

            console.log('Mock: Shipment marked as paid successfully')
            // TODO: Add success notification when you implement it
        } catch (error) {
            console.error('Mock: Failed to mark as paid:', error)
            // TODO: Add error notification when you implement it
        }
    }

    // Update the handleUpdateStatus function
    const handleUpdateStatus = () => {
        showUpdateStatusModal.value = true
    }
    
    
    // Handle track click
    const handleTrackClick = (trackingId: string) => {
        navigateTo(`/admin/tracking/${trackingId}`)
    }

    // Add handler for status update
    const handleStatusUpdate = async (newStatus: string) => {
        try {
            console.log('Updating status to:', newStatus)

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000))

            // Update the shipment data
            if (shipmentData.value) {
                shipmentData.value.delivery_status = newStatus
            }

            console.log('Status updated successfully')
            // TODO: Add success notification

        } catch (error) {
            console.error('Failed to update status:', error)
            // TODO: Add error notification
        }
    }

    // Handle modal close
    const handleModalClose = () => {
        showUpdateStatusModal.value = false
    }

    // Mock refresh function
    const refresh = async () => {
        pending.value = true
        error.value = null

        try {
            await new Promise(resolve => setTimeout(resolve, 1000))
            shipmentData.value = createMockShipmentData(shipmentId)
            pending.value = false
        } catch (err) {
            error.value = err
            pending.value = false
        }
    }
</script>

<template>
    <section class="relative overflow-hidden py-10 sm:py-8 bg-gray-50">
        <div class="container">
            <div class="max-w-6xl mx-auto">
                <!-- Loading state -->
                <div v-if="pending" class="flex justify-center items-center py-20">
                    <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                    <span class="ml-3 text-gray-600">Loading shipment details...</span>
                </div>

                <!-- Error state -->
                <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                    <h3 class="text-red-800 font-semibold mb-2">Error Loading Shipment</h3>
                    <p class="text-red-600 mb-4">{{ typeof error === 'object' && error && 'message' in error ? (error as
                        any).message : (error || 'Failed to load shipment details') }}</p>
                    <button @click="refresh()"
                        class="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors">
                        Try Again
                    </button>
                </div>

                <!-- Content -->
                <template v-else-if="shipmentData">
                    <!-- Back button -->
                    <AppSinglePageHeader />

                    <!-- Header Section -->
                    <section class="my-6 md:my-8 lg:my-10">
                        <AdminTitleHeader title="Shipment Details" :show-divider="false">
                            <template #action>
                                <div class="flex items-center gap-2">
                                    <button
                                        class="inline-flex items-center gap-2 bg-[#ffedeb] text-primary focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 py-2.5 px-4 md:py-3 md:px-5 rounded-lg hover:bg-primary- transition-colors duration-200 text-sm md:text-base font-semibold"
                                        @click="handleTrackClick(shipmentData.ref_id)">
                                        <span class="hidden sm:inline">Track</span>
                                    </button>
                                    <button
                                        class="inline-flex items-center gap-2 bg-primary-600 text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 py-2.5 px-4 md:py-3 md:px-5 rounded-lg hover:bg-primary-700 transition-colors duration-200 text-sm md:text-base font-medium"
                                        @click="handleUpdateStatus">
                                        <span class="hidden sm:inline">Update Status</span>
                                    </button>
                                </div>
                            </template>
                        </AdminTitleHeader>
                    </section>

                    <!-- Shipment Details Card -->
                    <div class="flex flex-col bg-white rounded-lg shadow">
                        <div class="card-header flex flex-col md:flex-row justify-between py-6 px-6 gap-4 md:gap-0">
                            <div class="details flex flex-col gap-2">
                                <span class="text-sm text-gray-500">Shipping ID</span>
                                <span class="flex text-gray-900 text-2xl tracking-tight font-bold">
                                    {{ shipmentData.ref_id }}
                                </span>
                            </div>

                            <div class="details flex flex-wrap md:gap-14 gap-6">
                                <div class="flex flex-col gap-2">
                                    <span class="text-sm text-gray-500">Payment Status</span>
                                    <span class="flex items-center">
                                        <app-status-chip :status="shipmentData.payment?.status || 'pending'"
                                            variant="filled" />
                                    </span>
                                </div>

                                <div class="flex flex-col gap-2">
                                    <span class="text-sm text-gray-500">Delivery Status</span>
                                    <span class="flex items-center">
                                        <app-status-chip :status="shipmentData.delivery_status || 'pending'" />
                                    </span>
                                </div>

                                <div class="flex flex-col gap-2">
                                    <span class="text-sm text-gray-500">Date Created</span>
                                    <span class="flex text-gray-900 text-base tracking-tight font-bold">
                                        {{ formatDate() }}
                                    </span>
                                </div>

                                <div class="flex flex-col gap-2">
                                    <span class="text-sm text-gray-500">Tracking ID</span>
                                    <span
                                        class="flex items-center gap-2 text-gray-900 text-base tracking-tight font-bold">
                                        <span>{{ shipmentData.ref_id }}</span>
                                        <button @click="copyTrackingId"
                                            class="text-gray-400 p-1 rounded hover:translate-y-1 transition-all duration-200"
                                            title="Copy tracking ID">
                                            <AppIcon name="copy" class="w-4 h-4" />
                                        </button>
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div class="flex flex-col gap-4 p-6">
                            <!-- Package details component -->
                            <ShipmentsPackageDetails :items="formData.shippingItems" :show-actions="false"
                                :showValueCost="false" />
                            <Divider class="mt-4" />

                            <!-- Address info component -->
                            <ShipmentsAddressInfo :sender="formData.sender" :recipient="formData.recipient"
                                :showButton="false" />
                            <Divider class="mt-4" />

                            <!-- Payment summary component -->
                            <ShipmentsPaymentSummary :payment-method="formData.paymentMethod"
                                :delivery-cost="shipmentData.payment?.amount || 0"
                                :insurance="shipmentData.payment?.insurance || 0" :tax="shipmentData.payment?.tax || 0"
                                :total="shipmentData.payment?.amount || 0" @mark-as-paid="handleMarkAsPaid"
                                :showButton="false" :showPaymentMethod="false" />
                        </div>
                    </div>
                </template>
            </div>
        </div>
    </section>
    <!-- Add the modal at the end of the template -->
    <ShipmentsUpdateStatusModal :visible="showUpdateStatusModal"
        :current-status="shipmentData?.delivery_status || 'pending'" @update:visible="showUpdateStatusModal = $event"
        @close="handleModalClose" @update-status="handleStatusUpdate" />
</template>

<style scoped></style>
