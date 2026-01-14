<template>
    <section class="shipping-item-card">
        <!-- Collapsed State -->
        <div v-if="!isExpanded" class="shipping-item-card__collapsed">
            <div class="shipping-item-card__content">
                <img :src="item.image_url" alt="item image" class="shipping-item-card__image" />
                <div class="shipping-item-card__info">
                    <div class="shipping-item-card__details">
                        <h6 class="shipping-item-card__title">{{ item.name }}</h6>
                        <div class="shipping-item-card__meta">
                            <p class="shipping-item-card__meta-item">
                                Item category: {{ item.category }}
                            </p>
                            <p class="shipping-item-card__meta-item">
                                Qty: {{ item.quantity }}
                            </p>
                            <p class="shipping-item-card__meta-item">
                                Weight: {{ item.weight }}
                            </p>
                            <p class="shipping-item-card__meta-item">
                                Value: {{ item.value }}
                            </p>
                        </div>
                        <button class="shipping-item-card__expand-btn" @click="toggleExpanded">
                            Expand
                            <AppIcon name="chevron-down" class="shipping-item-card__expand-icon" />
                        </button>
                    </div>
                    <div class="shipping-item-card__actions">
                        <button class="shipping-item-card__action-btn shipping-item-card__action-btn--edit"
                            @click="handleEdit">
                            <AppIcon name="pencil-alt" class="shipping-item-card__action-icon" />
                        </button>
                        <button class="shipping-item-card__action-btn shipping-item-card__action-btn--delete"
                            @click="handleRemove">
                            <AppIcon name="red-trash" class="shipping-item-card__action-icon" />
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Expanded State -->
        <div v-else class="shipping-item-card__expanded">
            <div class="shipping-item-card__expanded-content">
                <div class="shipping-item-card__header">
                    <h6 class="shipping-item-card__title">{{ item.name || '' }}</h6>
                    <div class="shipping-item-card__header-actions">
                        <button class="shipping-item-card__header-action" @click="handleEdit">
                            <AppIcon name="pencil-alt" class="shipping-item-card__header-action-icon" />
                            <span class="shipping-item-card__header-action-text">Edit</span>
                        </button>
                        <button class="shipping-item-card__header-action shipping-item-card__header-action--delete"
                            @click="handleRemove">
                            <AppIcon name="red-trash" class="shipping-item-card__header-action-icon" />
                            <span class="shipping-item-card__header-action-text">Delete</span>
                        </button>
                    </div>
                </div>

                <div class="shipping-item-card__images">
                    <!-- <img v-for="(image, index) in item.images || ['/package.png', '/package.png', '/package.png']"
                        :key="index" :src="image" alt="item image" class="shipping-item-card__gallery-image" /> -->
                    <img :src="item.image_url || '/package.png'" alt="item image"
                        class="shipping-item-card__gallery-image" />
                </div>

                <Divider class="shipping-item-card__divider" />

                <div class="shipping-item-card__specifications">
                    <div class="shipping-item-card__spec-item">
                        <p class="shipping-item-card__spec-label">Item category:</p>
                        <p class="shipping-item-card__spec-value">{{ item.category }}</p>
                    </div>

                    <div class="shipping-item-card__spec-item">
                        <p class="shipping-item-card__spec-label">Qty:</p>
                        <p class="shipping-item-card__spec-value">{{ item.quantity }}</p>
                    </div>

                    <div class="shipping-item-card__spec-item">
                        <p class="shipping-item-card__spec-label">Dimension:</p>
                        <p class="shipping-item-card__spec-value">{{ item.dimensions }}</p>
                    </div>

                    <div class="shipping-item-card__spec-item">
                        <p class="shipping-item-card__spec-label">Weight:</p>
                        <p class="shipping-item-card__spec-value">{{ item.weight }}</p>
                    </div>

                    <div class="shipping-item-card__spec-item">
                        <p class="shipping-item-card__spec-label">Value of Item:</p>
                        <p class="shipping-item-card__spec-value">{{ item.value }}</p>
                    </div>

                    <div class="shipping-item-card__spec-item">
                        <p class="shipping-item-card__spec-label">Item State:</p>
                        <p class="shipping-item-card__spec-value">{{ item.fragile ? 'Fragile' : 'Standard' }}</p>
                    </div>

                    <div class="shipping-item-card__spec-item">
                        <p class="shipping-item-card__spec-label">Insurance:</p>
                        <p class="shipping-item-card__spec-value">{{ item.insurance_required }}</p>
                    </div>
                </div>

                <div class="shipping-item-card__instructions">
                    <h6 class="shipping-item-card__instructions-title">Handling Instructions</h6>
                    <p class="shipping-item-card__instructions-text">
                        {{ item.handlingInstructions || 'Handle with care. Keep away from moisture.' }}
                    </p>
                </div>

                <button class="shipping-item-card__collapse-btn" @click="toggleExpanded">
                    Collapse
                    <AppIcon name="chevron-up" class="shipping-item-card__collapse-icon" />
                </button>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
    interface Props {
        item: any
        expanded?: boolean
        index: number
    }

    interface Emits {
        (e: 'remove'): void
        (e: 'toggle-expanded', expanded: boolean): void
        (e: 'edit-item', payload: { item: any, index: number }): void
    }

    const props = withDefaults(defineProps<Props>(), {
        expanded: false
    })

    const emit = defineEmits<Emits>()
    // Accept index as a prop for edit event
    const handleEdit = (): void => {
        emit('edit-item', { item: props.item, index: props.index })
    }

    const isExpanded = ref(props.expanded)

    const toggleExpanded = (): void => {
        isExpanded.value = !isExpanded.value
        emit('toggle-expanded', isExpanded.value)
    }

    const handleRemove = (): void => {
        emit('remove')
    }

    // Watch for prop changes
    watch(() => props.expanded, (newValue) => {
        isExpanded.value = newValue
    })
</script>

<style scoped>

    /* Block: shipping-item-card */
    .shipping-item-card {
        @apply bg-gray-50 border border-gray-200 rounded-lg shadow-sm;
    }

    /* Collapsed State */
    .shipping-item-card__collapsed {
        @apply p-4;
    }

    .shipping-item-card__content {
        @apply flex items-start gap-4;
    }

    .shipping-item-card__image {
        @apply w-16 h-16 object-cover rounded-md flex-shrink-0;
    }

    .shipping-item-card__info {
        @apply flex-1 flex justify-between items-start;
    }

    .shipping-item-card__details {
        @apply flex-1;
    }

    .shipping-item-card__title {
        @apply text-lg font-semibold text-gray-900 mb-2;
    }

    .shipping-item-card__meta {
        @apply flex flex-wrap gap-4 mb-3;
    }

    .shipping-item-card__meta-item {
        @apply text-sm text-gray-600 pr-3 border-r last:border-r-0 border-gray-300 last:pr-0;
    }

    .shipping-item-card__expand-btn {
        @apply flex items-center gap-2 text-sm text-primary hover:text-primary font-semibold transition-colors;
    }

    .shipping-item-card__expand-icon {
        @apply w-4 h-4 transform transition-transform duration-200;
        transform: rotate(0deg);
    }

    .shipping-item-card__actions {
        @apply flex items-center gap-2;
    }

    .shipping-item-card__action-btn {
        @apply p-2 rounded-md hover:bg-gray-100 transition-colors flex items-center justify-center;
    }

    .shipping-item-card__action-btn--edit {
        @apply text-gray-600 hover:text-gray-700;
    }

    .shipping-item-card__action-btn--delete {
        @apply text-primary hover:text-primary-700;
    }

    .shipping-item-card__action-icon {
        @apply w-5 h-5;
    }

    /* Expanded State */
    .shipping-item-card__expanded {
        @apply p-6;
    }

    .shipping-item-card__expanded-content {
        @apply space-y-4;
    }

    .shipping-item-card__header {
        @apply flex justify-between items-start;
    }

    .shipping-item-card__header-actions {
        @apply flex items-center gap-4;
    }

    .shipping-item-card__header-action {
        @apply flex items-center gap-2 text-sm font-medium transition-colors duration-200 border border-gray-200 rounded-md px-3 py-1 hover:bg-gray-100;
    }

    .shipping-item-card__header-action:not(.shipping-item-card__header-action--delete) {
        @apply text-gray-600 hover:text-gray-700;
    }

    .shipping-item-card__header-action--delete {
        @apply text-primary hover:text-red-800 border-red-200 hover:border-red-300 hover:bg-red-50;
    }

    .shipping-item-card__header-action-icon {
        @apply w-4 h-4;
    }

    .shipping-item-card__header-action-text {
        @apply text-sm;
    }

    .shipping-item-card__images {
        @apply flex gap-3;
    }

    .shipping-item-card__gallery-image {
        @apply w-16 h-16 object-cover rounded-md;
    }

    .shipping-item-card__divider {
        @apply my-4;
    }

    .shipping-item-card__specifications {
        @apply grid grid-cols-1 gap-3;
    }

    .shipping-item-card__spec-item {
        @apply flex justify-between items-center;
    }

    .shipping-item-card__spec-label {
        @apply text-sm font-medium text-gray-600;
    }

    .shipping-item-card__spec-value {
        @apply text-sm text-gray-900 font-semibold;
    }

    .shipping-item-card__instructions {
        @apply space-y-2;
    }

    .shipping-item-card__instructions-title {
        @apply text-base font-semibold text-gray-900;
    }

    .shipping-item-card__instructions-text {
        @apply text-sm text-gray-600 leading-relaxed;
    }

    .shipping-item-card__collapse-btn {
        @apply flex items-center gap-2 text-sm text-primary hover:text-primary-700 font-semibold transition-colors;
    }

    .shipping-item-card__collapse-icon {
        @apply w-4 h-4;
    }
</style>
