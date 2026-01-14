<script setup lang="ts">
interface Sender {
    name: string
    phone: string
    address: string
    email?: string
}

interface Recipient {
    name: string
    phone: string
    address: string
    email?: string
}

interface Props {
    sender: Sender
    recipient: Recipient
    showButton?: boolean
}

const props = withDefaults(defineProps<Props>(), {
    showButton: true
})
</script>

<template>
    <div>
        <!-- Header Row -->
        <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-semibold">Address Information</h3>
            <NuxtLink to="/admin/shipment/edit-address" class="flex items-center gap-2 text-gray-700 border border-gray-200 rounded p-1 hover:text-primary-700 hover:bg-gray-50 transition-colors" v-if="showButton">
                <AppIcon name="pencil-alt" class="w-4 h-4" />
                <span class="text-sm font-medium">Edit</span>
            </NuxtLink>
        </div>

        <!-- Address Cards Row -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Sender Card -->
            <ShipmentsEntityAddressInfoCard 
                title="Pickup Information"
                :contact-name="sender.name"
                :address="sender.address"
                :email="sender.email"
                :phone="sender.phone"
            />

            <!-- Recipient Card -->
            <ShipmentsEntityAddressInfoCard 
                title="Delivery Information"
                :contact-name="recipient.name"
                :address="recipient.address"
                :email="recipient.email"
                :phone="recipient.phone"
            />
        </div>
    </div>
</template>

<style scoped></style>
