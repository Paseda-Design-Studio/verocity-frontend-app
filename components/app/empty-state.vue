<template>
  <div class="app-empty-state">
    <div class="app-empty-state__content">
      <!-- Icon/Illustration -->
      <div class="app-empty-state__icon">
        <slot name="icon">
          <div class="app-empty-state__default-icon">
            {{ icon }}
          </div>
        </slot>
      </div>

      <!-- Title -->
      <h3 class="app-empty-state__title">
        <slot name="title">
          {{ title }}
        </slot>
      </h3>

      <!-- Description -->
      <p class="app-empty-state__description">
        <slot name="description">
          {{ description }}
        </slot>
      </p>

      <!-- Action Button -->
      <div v-if="showAction" class="app-empty-state__action">
        <slot name="action">
          <NuxtLink 
            v-if="actionLink"
            :to="actionLink"
            :class="actionButtonClass"
          >
            <app-icon v-if="actionIcon" :name="actionIcon" class="w-4 h-4" />
            {{ actionText }}
          </NuxtLink>
          <button 
            v-else-if="actionHandler"
            :class="actionButtonClass"
            @click="actionHandler"
          >
            <app-icon v-if="actionIcon" :name="actionIcon" class="w-4 h-4" />
            {{ actionText }}
          </button>
        </slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  // Content props
  title?: string;
  description?: string;
  icon?: string;
  
  // Action props
  showAction?: boolean;
  actionText?: string;
  actionIcon?: string;
  actionLink?: string;
  actionHandler?: () => void;
  
  // Styling props
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'minimal' | 'bordered';
}

const props = withDefaults(defineProps<Props>(), {
  title: 'No data available',
  description: 'There are no items to display at the moment.',
  icon: '📋',
  showAction: false,
  actionText: 'Get Started',
  size: 'md',
  variant: 'default'
});

// Computed classes for different variants and sizes
const actionButtonClass = computed(() => {
  const baseClasses = 'inline-flex items-center gap-2 font-medium rounded-lg transition-colors duration-200';
  
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  };
  
  const variantClasses = 'bg-primary-600 text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2';
  
  return `${baseClasses} ${sizeClasses[props.size]} ${variantClasses}`;
});
</script>

<style lang="scss" scoped>
.app-empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 1rem;
  text-align: center;
  min-height: 200px;

  @media (max-width: 639px) {
    padding: 2rem 1rem;
    min-height: 150px;
  }

  &__content {
    max-width: 28rem;
    width: 100%;
  }

  &__icon {
    margin-bottom: 1rem;

    @media (max-width: 639px) {
      margin-bottom: 0.75rem;
    }
  }

  &__default-icon {
    font-size: 3.5rem;
    line-height: 1;
    opacity: 0.5;

    @media (max-width: 639px) {
      font-size: 2.5rem;
    }

    @media (min-width: 768px) {
      font-size: 4rem;
    }
  }

  &__title {
    font-size: 1.125rem;
    font-weight: 600;
    color: #111827;
    margin-bottom: 0.5rem;
    line-height: 1.5;

    @media (max-width: 639px) {
      font-size: 1rem;
    }

    @media (min-width: 768px) {
      font-size: 1.25rem;
    }
  }

  &__description {
    font-size: 0.875rem;
    color: #6b7280;
    line-height: 1.6;
    margin-bottom: 1.5rem;

    @media (max-width: 639px) {
      font-size: 0.8125rem;
      margin-bottom: 1.25rem;
    }

    @media (min-width: 768px) {
      font-size: 1rem;
    }
  }

  &__action {
    display: flex;
    justify-content: center;
  }

  // Size variants
  &--sm {
    padding: 2rem 1rem;
    min-height: 150px;

    .app-empty-state__default-icon {
      font-size: 2.5rem;
    }

    .app-empty-state__title {
      font-size: 1rem;
    }

    .app-empty-state__description {
      font-size: 0.8125rem;
    }
  }

  &--lg {
    padding: 4rem 1rem;
    min-height: 300px;

    .app-empty-state__default-icon {
      font-size: 5rem;
    }

    .app-empty-state__title {
      font-size: 1.5rem;
    }

    .app-empty-state__description {
      font-size: 1.125rem;
    }
  }

  // Variant styles
  &--minimal {
    background-color: transparent;
    border: none;
  }

  &--bordered {
    background-color: #ffffff;
    border: 1px solid #e5e7eb;
    border-radius: 0.5rem;
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);

    @media (max-width: 639px) {
      border-radius: 0.375rem;
    }
  }

  &--default {
    background-color: #ffffff;
  }
}
</style>
