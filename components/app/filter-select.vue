<template>
    <div class="relative inline-block" :class="containerClass">
        <!-- Filter Select -->
        <div class="group relative flex items-center bg-white border border-gray-200 rounded-md transition-all duration-200"
            :class="{
                'opacity-50 cursor-not-allowed': disabled,
                'border-primary-400 shadow-sm': isActive,
                'hover:border-primary-300 hover:shadow-sm': !isOpen && !disabled,
                'border-primary-500 shadow-md ring-2 ring-primary-100': isOpen
            }">
            <!-- Label Badge -->
            <div class="flex items-center px-3 py-4 border-r border-gray-200 rounded-l-md transition-colors duration-200"
                :class="[
                    labelClass,
                    {
                        'bg-primary-50': isActive,
                        'bg-gray-50 group-hover:bg-primary-50': !isOpen && !disabled,
                        'bg-primary-100': isOpen
                    }
                ]">
                <span class="text-xs font-semibold uppercase tracking-wide whitespace-nowrap transition-colors duration-200"
                    :class="{
                        'text-primary-700': isActive,
                        'text-gray-600 group-hover:text-primary-700': !isOpen && !disabled,
                        'text-primary-800': isOpen
                    }">
                    {{ label }}
                </span>
            </div>
            
            <!-- Custom Select Container -->
            <div class="relative flex-1 bg-white rounded-r-md">
                <button
                    type="button"
                    :id="selectId"
                    @click="toggleDropdown"
                    @keydown="handleKeydown"
                    :disabled="disabled"
                    class="w-full bg-white border-0 text-sm font-medium focus:ring-0 focus:outline-none py-3 pl-4 pr-10 rounded-r-md cursor-pointer transition-colors duration-200 disabled:cursor-not-allowed disabled:text-gray-400 text-left"
                    :class="[
                        selectClass,
                        minWidthClass,
                        {
                            'text-primary-800': isActive,
                            'text-gray-800 group-hover:text-primary-800': !isOpen && !disabled,
                            'text-primary-900': isOpen
                        }
                    ]"
                    :aria-expanded="isOpen"
                    :aria-haspopup="true"
                    role="combobox">
                    {{ selectedOptionName || 'Select option' }}
                </button>
                
                <!-- Enhanced Dropdown Icon -->
                <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <div class="flex items-center justify-center w-5 h-5 rounded-full transition-colors duration-200"
                        :class="{
                            'bg-primary-200 group-hover:bg-primary-300': isOpen || isActive,
                            'bg-gray-100 group-hover:bg-primary-100': !isOpen && !isActive
                        }">
                        <svg class="w-3 h-3 transition-all duration-200" :class="{
                            'rotate-180 text-primary-700': isOpen,
                            'text-primary-600': isActive && !isOpen,
                            'text-gray-500 group-hover:text-primary-600': !isOpen && !isActive,
                            'text-gray-400': disabled
                        }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5"
                                d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>
                </div>
            </div>
            
            <!-- Active State Indicator -->
            <div v-if="isActive"
                class="absolute -top-[6px] -right-1 w-3 h-3 bg-primary-500 rounded-full border-2 border-white shadow-sm">
            </div>
        </div>
        
        <!-- Custom Dropdown Menu -->
        <Transition
            enter-active-class="transition duration-200 ease-out"
            enter-from-class="transform scale-95 opacity-0"
            enter-to-class="transform scale-100 opacity-100"
            leave-active-class="transition duration-150 ease-in"
            leave-from-class="transform scale-100 opacity-100"
            leave-to-class="transform scale-95 opacity-0">
            <div v-if="isOpen"
                class="absolute z-50 mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden"
                :class="dropdownClass"
                role="listbox"
                :aria-labelledby="selectId">
                
                <!-- Dropdown Options -->
                <div class="">
                    <div
                        v-for="(option, index) in options"
                        :key="option.key"
                        @click="selectOption(option)"
                        @mouseenter="hoveredIndex = index"
                        @mouseleave="hoveredIndex = -1"
                        :class="[
                            'relative cursor-pointer select-none py-3 pl-4 pr-4 text-sm transition-all duration-200',
                            {
                                'bg-white text-gray-700': !isSelected(option) && hoveredIndex !== index,
                                'bg-primary-50 text-primary-900 border-l-4 border-primary-500 pl-3 transform translate-x-1': hoveredIndex === index && !isSelected(option),
                                'bg-primary-600 text-white border-l-4 border-primary-800 pl-3 font-semibold shadow-sm': isSelected(option),
                                'bg-primary-700 text-white border-l-4 border-primary-900 pl-3 font-semibold shadow-md transform translate-x-1': isSelected(option) && hoveredIndex === index
                            }
                        ]"
                        role="option"
                        :aria-selected="isSelected(option)">
                        
                        <!-- Option Content -->
                        <div class="flex items-center justify-between">
                            <span class="block truncate">{{ option.name }}</span>
                            
                            <!-- Selected Indicator -->
                            <svg v-if="isSelected(option)" 
                                class="w-4 h-4 text-white" 
                                fill="currentColor" 
                                viewBox="0 0 20 20">
                                <path fill-rule="evenodd" 
                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" 
                                    clip-rule="evenodd" />
                            </svg>
                        </div>
                        
                        <!-- Hover Effect Overlay -->
                        <div v-if="hoveredIndex === index && !isSelected(option)"
                            class="absolute inset-0 bg-gradient-to-r from-primary-50 to-primary-100 opacity-50 pointer-events-none">
                        </div>
                    </div>
                </div>
                
                <!-- Empty State -->
                <div v-if="options.length === 0" 
                    class="py-4 px-4 text-sm text-gray-500 text-center">
                    No options available
                </div>
            </div>
        </Transition>
        
        <!-- Optional: Selected Value Preview (for mobile) -->
        <div v-if="showPreview && modelValue !== defaultValue" class="mt-1 text-xs text-primary-600 px-1">
            Selected: <span class="font-medium text-primary-700">{{ selectedOptionName }}</span>
        </div>
        
        <!-- Invisible overlay to close dropdown when clicking outside -->
        <div v-if="isOpen" 
            @click="closeDropdown"
            class="fixed inset-0 z-40">
        </div>
    </div>
</template>

<script setup lang="ts">
    interface FilterOption {
        name: string;
        key: string;
    }

    interface Props {
        modelValue: string;
        label: string;
        options: FilterOption[];
        disabled?: boolean;
        containerClass?: string;
        labelClass?: string;
        selectClass?: string;
        dropdownClass?: string;
        minWidth?: 'sm' | 'md' | 'lg' | 'xl' | 'auto';
        defaultValue?: string;
        showPreview?: boolean;
    }

    interface Emits {
        (e: 'update:modelValue', value: string): void;
        (e: 'change', value: string): void;
    }

    const props = withDefaults(defineProps<Props>(), {
        disabled: false,
        containerClass: '',
        labelClass: '',
        selectClass: '',
        dropdownClass: '',
        minWidth: 'md',
        defaultValue: 'all',
        showPreview: false
    });

    const emit = defineEmits<Emits>();

    // Reactive state
    const isOpen = ref(false);
    const hoveredIndex = ref(-1);
    const selectId = computed(() => `filter-select-${Math.random().toString(36).substr(2, 9)}`);

    // Computed properties
    const minWidthClass = computed(() => {
        const widthMap = {
            sm: 'min-w-[120px]',
            md: 'min-w-[140px]',
            lg: 'min-w-[160px]',
            xl: 'min-w-[180px]',
            auto: 'min-w-fit'
        };
        return widthMap[props.minWidth];
    });

    const isActive = computed(() => {
        return props.modelValue !== props.defaultValue;
    });

    const selectedOptionName = computed(() => {
        const option = props.options.find(opt => opt.key === props.modelValue);
        return option?.name || '';
    });

    // Helper methods
    const isSelected = (option: FilterOption) => {
        return option.key === props.modelValue;
    };

    const toggleDropdown = () => {
        if (!props.disabled) {
            isOpen.value = !isOpen.value;
            if (isOpen.value) {
                hoveredIndex.value = -1;
            }
        }
    };

    const closeDropdown = () => {
        isOpen.value = false;
        hoveredIndex.value = -1;
    };

    const selectOption = (option: FilterOption) => {
        if (!props.disabled) {
            emit('update:modelValue', option.key);
            emit('change', option.key);
            closeDropdown();
        }
    };

    // Keyboard navigation
    const handleKeydown = (event: KeyboardEvent) => {
        if (props.disabled) return;

        switch (event.key) {
            case 'Enter':
            case ' ':
                event.preventDefault();
                if (!isOpen.value) {
                    isOpen.value = true;
                } else if (hoveredIndex.value >= 0) {
                    selectOption(props.options[hoveredIndex.value]);
                }
                break;
            case 'Escape':
                closeDropdown();
                break;
            case 'ArrowDown':
                event.preventDefault();
                if (!isOpen.value) {
                    isOpen.value = true;
                } else {
                    hoveredIndex.value = Math.min(hoveredIndex.value + 1, props.options.length - 1);
                }
                break;
            case 'ArrowUp':
                event.preventDefault();
                if (isOpen.value) {
                    hoveredIndex.value = Math.max(hoveredIndex.value - 1, 0);
                }
                break;
        }
    };

    // Close dropdown when clicking outside
    onMounted(() => {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                closeDropdown();
            }
        });
    });
</script>

<style scoped>
   

    /* Smooth transitions for all interactive elements */
    * {
        transition: all 0.2s ease-in-out;
    }

    /* Focus styles for accessibility */
    button:focus {
        outline-offset: 2px;
    }

    /* Ensure proper z-index stacking */
    .relative {
        z-index: 1;
    }
</style>
