<template>
    <section class="space-y-4 mb-6">
        <ShipmentsShippingItemCollapsibleCard v-for="(item, index) in items" :key="index" :item="item" :index="index" :expanded="false"
            @remove="() => $emit('remove', index)"
            @toggle-expanded="(expanded) => $emit('toggle-expanded', index, expanded)"
            @edit-item="payload => $emit('edit-item', payload)" />
    </section>
</template>

<script setup lang="ts">
    import type { ShipmentItem } from '~/api/shipment/types'


    defineProps<{
        items: ShipmentItem[]
    }>()

    defineEmits<{
        remove: [index: number],
        'toggle-expanded': [index: number, expanded: boolean],
        'edit-item': [payload: { item: ShipmentItem, index: number }]
    }>()
</script>
