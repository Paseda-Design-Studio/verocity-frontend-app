<script setup lang="ts">
  interface Props {
    status: string;
    variant?: 'filled' | 'outlined' | 'soft';
    size?: 'sm' | 'md' | 'lg';
  }

  const props = withDefaults(defineProps<Props>(), {
    variant: 'soft',
    size: 'md'
  });

  // Status configurations with your exact colors
  const statusConfig = {
    'pending': {
      color: '#A9A9A9',
      label: 'Pending'
    },
    'out of delivery': {
      color: '#007BFF',
      label: 'Out of Delivery'
    },
    'in transit': {
      color: '#FFA500',
      label: 'In Transit'
    },
    'delivered': {
      color: '#28A745',
      label: 'Delivered'
    },
    'delayed': {
      color: '#EC8282',
      label: 'Delayed'
    },
    'cancelled': {
      color: '#FF0000',
      label: 'Cancelled'
    }

    // Statuses for user management
    , 'active': {
      color: '#28A745',
      label: 'Active'
    },
    'inactive': {
      color: '#A9A9A9',
      label: 'Inactive'
    },
    'suspended': {
      color: '#FF0000',
      label: 'Suspended'
    },

    // statuses for payment management
    'paid': {
      color: '#28A745',
      label: 'Paid'
    },
  };

  const normalizedStatus = computed(() => props.status.toLowerCase());
  const config = computed(() => statusConfig[normalizedStatus.value as keyof typeof statusConfig] || {
    color: '#6B7280',
    label: props.status
  });

  const chipClasses = computed(() => {
    const base = 'inline-flex items-center justify-center font-medium rounded-full whitespace-nowrap';

    const sizes = {
      sm: 'px-2 py-0.5 text-xs',
      md: 'px-3 py-1 text-sm',
      lg: 'px-4 py-1.5 text-base'
    };

    return `${base} ${sizes[props.size]}`;
  });

  const chipStyles = computed(() => {
    const color = config.value.color;

    if (props.variant === 'filled') {
      return {
        backgroundColor: color,
        color: '#ffffff',
        border: `1px solid ${color}`
      };
    } else if (props.variant === 'outlined') {
      return {
        backgroundColor: 'transparent',
        color: color,
        border: `1px solid ${color}`
      };
    } else { // soft
      return {
        backgroundColor: `${color}20`, // 20% opacity
        color: color,
        border: `1px solid ${color}40` // 40% opacity for border
      };
    }
  });
</script>

<template>
  <span :class="chipClasses" :style="chipStyles">
    {{ config.label }}
  </span>
</template>
