<template>
    <div>
        <h3 class="text-lg font-semibold mb-4">Package Details</h3>
        <div class="space-y-3">
            <section
                class="package-details-card"
                v-for="(item, index) in items"
                :key="index"
            >
                <div class="package-details-card__content">
                    <img :src="item.image_url || '/package.png'" alt="item image" class="package-details-card__image" />
                    <div class="package-details-card__info">
                        <div class="package-details-card__details">
                            <h6 class="package-details-card__title">{{ item.name }}</h6>
                            <div class="package-details-card__meta">
                                <p class="package-details-card__meta-item">
                                    Item category: {{ item.category }}
                                </p>
                                <p class="package-details-card__meta-item">
                                    Qty: {{ item.quantity }}
                                </p>
                                <p class="package-details-card__meta-item">
                                    Weight: {{ item.weight }}
                                </p>
                                <p class="package-details-card__meta-item" v-if="showValueCost">
                                    Value: {{ item.value }}
                                </p>
                            </div>
                        </div>
                        <div class="package-details-card__actions" v-if="showActions">
                            <NuxtLink to="/shipments/shipping-item-details"
                                class="package-details-card__action-btn package-details-card__action-btn--edit">
                                <AppIcon name="pencil-alt" class="package-details-card__action-icon" />
                            </NuxtLink>
                            <button class="package-details-card__action-btn package-details-card__action-btn--delete"
                                @click="handleRemove(index)">
                                <AppIcon name="red-trash" class="package-details-card__action-icon" />
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    </div>
</template>

<script setup lang="ts">
interface Props {
    items: any[]
    showActions?: boolean
    showValueCost?: boolean
}

interface Emits {
    (e: 'remove', index: number): void
    (e: 'edit', index: number): void
}

const props = withDefaults(defineProps<Props>(), {
    showActions: true,
    showValueCost: true,
})

const emit = defineEmits<Emits>()

const handleRemove = (index: number): void => {
    emit('remove', index)
}
</script>

<style scoped>
/* Block: package-details-card */
.package-details-card {
    @apply p-4;
}

.package-details-card__content {
    @apply flex items-start gap-4;
}

.package-details-card__image {
    @apply w-16 h-16 object-cover rounded-md flex-shrink-0;
}

.package-details-card__info {
    @apply flex-1 flex justify-between items-start;
}

.package-details-card__details {
    @apply flex-1;
}

.package-details-card__title {
    @apply text-lg font-semibold text-gray-900 mb-2;
}

.package-details-card__meta {
    @apply flex flex-wrap gap-4;
}

.package-details-card__meta-item {
    @apply text-sm text-gray-600 pr-3 border-r last:border-r-0 border-gray-300 last:pr-0;
}

.package-details-card__actions {
    @apply flex items-center gap-2;
}

.package-details-card__action-btn {
    @apply p-2 rounded-md hover:bg-gray-100 transition-colors flex items-center justify-center;
}

.package-details-card__action-btn--edit {
    @apply text-gray-600 hover:text-gray-700;
}

.package-details-card__action-btn--delete {
    @apply text-primary hover:text-primary-700;
}

.package-details-card__action-icon {
    @apply w-5 h-5;
}
</style>
