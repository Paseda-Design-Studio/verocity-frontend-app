<template>
  <div class="mobile-table">
    <div class="mobile-table__container" :class="cardSpacingClass">
      <div 
        v-for="(item, index) in tableData" 
        :key="getItemKey(item, index)"
        class="mobile-table__card"
        :class="cardClass"
      >
        <!-- Default Card Layout -->
        <template v-if="!$slots.card">
          <!-- Card Header -->
          <div class="mobile-table__header">
            <div class="mobile-table__header-content">
              <slot name="header" :item="item" :index="index">
                <div>
                  <h3 class="mobile-table__title">
                    {{ getFieldValue(item, primaryField) }}
                  </h3>
                  <p v-if="secondaryField" class="mobile-table__subtitle">
                    {{ getFieldValue(item, secondaryField) }}
                  </p>
                </div>
              </slot>
            </div>
            
            <div class="mobile-table__header-actions">
              <slot name="header-actions" :item="item" :index="index">
                <slot name="badge" :item="item" :index="index">
                  <span 
                    v-if="badgeField"
                    class="mobile-table__badge"
                    :class="getBadgeClass(item)"
                  >
                    {{ formatBadgeValue(getFieldValue(item, badgeField)) }}
                  </span>
                </slot>
              </slot>
            </div>
          </div>

          <!-- Card Content -->
          <div v-if="showContent" class="mobile-table__content">
            <slot name="content" :item="item" :index="index">
              <div class="mobile-table__fields">
                <div 
                  v-for="field in contentFields" 
                  :key="field.key"
                  class="mobile-table__field"
                  :class="field.class"
                >
                  <span class="mobile-table__field-label">
                    {{ field.label }}:
                  </span>
                  <span class="mobile-table__field-value">
                    {{ formatFieldValue(getFieldValue(item, field.key), field) }}
                  </span>
                </div>
              </div>
            </slot>
          </div>

          <!-- Card Actions -->
          <div v-if="showActions" class="mobile-table__actions">
            <slot name="actions" :item="item" :index="index">
              <!-- Default action buttons -->
              <div v-if="!$slots.actions && !$slots['kebab-menu']" class="mobile-table__action-buttons">
                <button
                  v-for="action in defaultActions"
                  :key="action.key"
                  @click="handleAction(action.key, item)"
                  :class="getActionButtonClass(action)"
                  :title="action.label"
                >
                  <app-icon v-if="action.icon" :name="action.icon" class="w-3 h-3" />
                  <span v-if="action.showLabel">{{ action.label }}</span>
                </button>
              </div>
              
              <!-- Kebab menu -->
              <div v-else-if="$slots['kebab-menu']" class="mobile-table__kebab-menu">
                <slot name="kebab-menu" :item="item" :index="index" />
              </div>
            </slot>
          </div>
        </template>

        <!-- Custom Card Layout -->
        <template v-else>
          <slot name="card" :item="item" :index="index" />
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Field {
  key: string;
  label: string;
  type?: 'text' | 'currency' | 'date' | 'badge' | 'custom';
  format?: string;
  class?: string;
  formatter?: (value: any) => string;
}

interface Action {
  key: string;
  label: string;
  icon?: string;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
  showLabel?: boolean;
}

interface Props {
  // Data
  tableData: any[];
  
  // Field configuration
  primaryField: string;
  secondaryField?: string;
  badgeField?: string;
  contentFields?: Field[];
  
  // Layout options
  showContent?: boolean;
  showActions?: boolean;
  cardClass?: string;
  spacing?: 'sm' | 'md' | 'lg';
  
  // Actions
  defaultActions?: Action[];
  
  // Badge configuration
  badgeFormatter?: (value: any) => string;
  badgeClassMap?: Record<string, string>;
  
  // Key field for v-for
  keyField?: string;
}

const props = withDefaults(defineProps<Props>(), {
  showContent: true,
  showActions: true,
  spacing: 'md',
  contentFields: () => [],
  defaultActions: () => [],
  keyField: 'id'
});

// Emits
const emit = defineEmits<{
  action: [actionKey: string, item: any];
}>();

// Helper functions
const getItemKey = (item: any, index: number) => {
  return item[props.keyField] || `item-${index}`;
};

const getFieldValue = (item: any, field: string) => {
  return field.split('.').reduce((obj, key) => obj?.[key], item) || '';
};

const formatFieldValue = (value: any, field: Field) => {
  if (field.formatter) {
    return field.formatter(value);
  }
  
  switch (field.type) {
    case 'currency':
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
      }).format(value);
    case 'date':
      return new Date(value).toLocaleDateString();
    default:
      return value?.toString() || '';
  }
};

const formatBadgeValue = (value: any) => {
  if (props.badgeFormatter) {
    return props.badgeFormatter(value);
  }
  
  return value?.toString()
    .replace('-', ' ')
    .replace(/\b\w/g, (l: string) => l.toUpperCase()) || '';
};

const getBadgeClass = (item: any) => {
  if (props.badgeClassMap && props.badgeField) {
    const value = getFieldValue(item, props.badgeField);
    return props.badgeClassMap[value] || 'mobile-table__badge--default';
  }
  return 'mobile-table__badge--default';
};

const getActionButtonClass = (action: Action) => {
  const baseClass = 'mobile-table__action-button';
  const variantClass = `mobile-table__action-button--${action.variant || 'secondary'}`;
  return `${baseClass} ${variantClass}`;
};

const handleAction = (actionKey: string, item: any) => {
  emit('action', actionKey, item);
};

// Computed classes
const cardSpacingClass = computed(() => {
  const spacingClasses = {
    sm: 'mobile-table__container--sm',
    md: 'mobile-table__container--md',
    lg: 'mobile-table__container--lg'
  };
  return spacingClasses[props.spacing];
});
</script>

<style lang="scss" scoped>
.mobile-table {
  width: 100%;

  &__container {
    display: flex;
    flex-direction: column;
    gap: 1rem;

    &--sm {
      gap: 0.75rem;
    }

    &--lg {
      gap: 1.25rem;
    }
  }

  &__card {
    background-color: #ffffff;
    border: 1px solid #e5e7eb;
    border-radius: 0.5rem;
    padding: 1rem;
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
    transition: box-shadow 0.2s ease, border-color 0.2s ease;

    &:hover {
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
      border-color: #d1d5db;
    }

    @media (max-width: 639px) {
      padding: 0.875rem;
      border-radius: 0.375rem;
    }
  }

  &__header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    margin-bottom: 0.75rem;
    gap: 0.75rem;
  }

  &__header-content {
    flex: 1;
    min-width: 0;
  }

  &__header-actions {
    flex-shrink: 0;
  }

  &__title {
    font-size: 0.875rem;
    font-weight: 500;
    color: #111827;
    line-height: 1.25;
    margin: 0;
    word-break: break-word;

    @media (max-width: 639px) {
      font-size: 0.8125rem;
    }
  }

  &__subtitle {
    font-size: 0.875rem;
    color: #6b7280;
    margin: 0.25rem 0 0 0;
    line-height: 1.25;
    word-break: break-word;

    @media (max-width: 639px) {
      font-size: 0.75rem;
    }
  }

  &__badge {
    display: inline-flex;
    align-items: center;
    padding: 0.25rem 0.5rem;
    border-radius: 9999px;
    font-size: 0.75rem;
    font-weight: 500;
    border: 1px solid;
    line-height: 1;

    &--default {
      background-color: #f3f4f6;
      color: #374151;
      border-color: #d1d5db;
    }

    &--success {
      background-color: #dcfce7;
      color: #166534;
      border-color: #bbf7d0;
    }

    &--warning {
      background-color: #fef3c7;
      color: #92400e;
      border-color: #fde68a;
    }

    &--danger {
      background-color: #fee2e2;
      color: #991b1b;
      border-color: #fecaca;
    }

    &--info {
      background-color: #dbeafe;
      color: #1e40af;
      border-color: #bfdbfe;
    }
  }

  &__content {
    margin-bottom: 1rem;
  }

  &__fields {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;

    @media (max-width: 479px) {
      grid-template-columns: 1fr;
      gap: 0.75rem;
    }
  }

  &__field {
    display: flex;
    flex-direction: column;
    gap: 0.125rem;

    &--full-width {
      grid-column: 1 / -1;
    }
  }

  &__field-label {
    font-size: 0.75rem;
    color: #6b7280;
    font-weight: 500;
    line-height: 1.25;
  }

  &__field-value {
    font-size: 0.875rem;
    color: #111827;
    font-weight: 400;
    line-height: 1.25;
    word-break: break-word;

    &--currency {
      font-weight: 500;
    }

    &--muted {
      color: #6b7280;
    }
  }

  &__actions {
    padding-top: 0.75rem;
    border-top: 1px solid #f3f4f6;
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }

  &__action-buttons {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  &__action-button {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    padding: 0.375rem 0.75rem;
    font-size: 0.75rem;
    font-weight: 500;
    border-radius: 0.375rem;
    border: 1px solid;
    cursor: pointer;
    transition: all 0.2s ease;
    text-decoration: none;

    &:hover {
      transform: translateY(-1px);
    }

    &:active {
      transform: translateY(0);
    }

    &--primary {
      background-color: #3b82f6;
      color: #ffffff;
      border-color: #3b82f6;

      &:hover {
        background-color: #2563eb;
        border-color: #2563eb;
      }
    }

    &--secondary {
      background-color: #ffffff;
      color: #6b7280;
      border-color: #d1d5db;

      &:hover {
        background-color: #f9fafb;
        color: #374151;
        border-color: #9ca3af;
      }
    }

    &--success {
      background-color: #10b981;
      color: #ffffff;
      border-color: #10b981;

      &:hover {
        background-color: #059669;
        border-color: #059669;
      }
    }

    &--warning {
      background-color: #f59e0b;
      color: #ffffff;
      border-color: #f59e0b;

      &:hover {
        background-color: #d97706;
        border-color: #d97706;
      }
    }

    &--danger {
      background-color: #ef4444;
      color: #ffffff;
      border-color: #ef4444;

      &:hover {
        background-color: #dc2626;
        border-color: #dc2626;
      }
    }
  }

  &__kebab-menu {
    display: flex;
    justify-content: flex-end;
  }
}
</style>
