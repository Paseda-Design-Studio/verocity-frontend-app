<template>
	<Listbox v-model="selectedOption">
		<div class="relative mt-1">
			<ListboxButton
				class="relative z-50 w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left border border-gray-300 focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm"
			>
				<span class="block truncate">{{
					selectedOption?.name || 'Select an option'
				}}</span>
				<span
					class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2"
				>
					<ChevronDownIcon
						class="h-5 w-5 text-gray-400"
						aria-hidden="true"
					/>
				</span>
			</ListboxButton>

			<transition
				leave-active-class="transition duration-100 ease-in"
				leave-from-class="opacity-100"
				leave-to-class="opacity-0"
			>
				<ListboxOptions
					class="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm"
				>
					<ListboxOption
						v-slot="{ active, selected }"
						v-for="option in options"
						:key="option.name"
						:value="option"
						as="template"
					>
						<li
							:class="[
								active ? 'bg-amber-100 text-amber-900' : 'text-gray-900',
								'relative cursor-default select-none py-2 px-3',
							]"
						>
							<span
								:class="[
									selected ? 'font-medium' : 'font-normal',
									'block truncate',
								]"
								>{{ option.name }}</span
							>
						</li>
					</ListboxOption>
				</ListboxOptions>
			</transition>
		</div>
	</Listbox>
</template>

<script setup lang="ts">
	import {
		Listbox,
		ListboxButton,
		ListboxOptions,
		ListboxOption,
	} from '@headlessui/vue';
	
  import { CheckIcon, ChevronDownIcon } from '@heroicons/vue/20/solid';

	// Define types for option items and props
	interface Option {
		name: string;
	}

	const props = defineProps<{
		options: Option[];
		modelValue: Option;
	}>();

	const emit = defineEmits<{
		(event: 'update:modelValue', value: Option): void;
	}>();

	const selectedOption = ref<Option | null>(props.modelValue);

	// Watch for changes to selectedOption and emit updates to the parent
	watch(selectedOption, (newVal) => {
		if (newVal) emit('update:modelValue', newVal);
	});
</script>

<style scoped>
	/* Add any additional styling here if needed */
</style>
