export default {
    root: ({ props, state, parent }) => ({
        class: [
            // Display and Position
            'inline-flex',
            'relative',

            // Shape
            { 'rounded-md': parent.instance.$name !== 'InputGroup' },
            { 'first:rounded-l-md rounded-none last:rounded-r-md': parent.instance.$name == 'InputGroup' },
            { 'border-0 border-y border-l last:border-r': parent.instance.$name == 'InputGroup' },
            { 'first:ml-0 ml-[-1px]': parent.instance.$name == 'InputGroup' && !props.showButtons },

            // Color and Background (match InputText)
            'bg-[#f8f9fd]',

            // Border (make lighter)
            'border',
            'border-[#f3f4f5]', // <-- lighter border color (Tailwind gray-200)
            { 'dark:border-surface-700': parent.instance.$name != 'InputGroup' },
            { 'dark:border-surface-600': parent.instance.$name == 'InputGroup' },
            { 'border-[#f3f4f5] dark:border-surface-600': !props.invalid },

            // Invalid State
            { 'border-red-500 dark:border-red-400': props.invalid },

            // Transitions
            'transition-all',
            'duration-200',

            // Misc
            'cursor-pointer',
            'select-none',
            { 'opacity-60': props.disabled, 'pointer-events-none': props.disabled, 'cursor-default': props.disabled }
        ]
    }),
    input: ({ props, parent }) => ({
        class: [
            'leading-[normal]',
            'block',
            'flex-auto',
            'bg-transparent',
            'border-0',
            { 'text-surface-800 dark:text-white/80': props.modelValue != undefined, 'text-surface-400 dark:text-surface-500': props.modelValue == undefined },
            'placeholder:text-surface-400 dark:placeholder:text-surface-500',
            'w-[1%]',
            'p-3',
            { 'pr-7': props.showClear },
            'rounded-none',
            'transition',
            'duration-200',
            'focus:outline-none focus:shadow-none',
            { filled: parent.instance?.$name == 'FloatLabel' && props.modelValue !== null },
            'relative',
            'cursor-pointer',
            'overflow-hidden overflow-ellipsis',
            'whitespace-nowrap',
            'appearance-none'
        ]
    }),
    trigger: {
        class: [
            'flex items-center justify-center',
            'shrink-0',
            'bg-transparent',
            'text-surface-500',
            'w-12',
            'rounded-tr-md',
            'rounded-br-md'
        ]
    },
    panel: {
        class: [
            'absolute top-0 left-0',
            'z-[11000]', // <-- Add this line for high z-index
            'border-0 dark:border',
            'rounded-md',
            'shadow-md',
            'bg-[#f8f9fd]',
            'text-surface-800 dark:text-white/80',
            'dark:border-surface-700'
        ]
    },
    wrapper: {
        class: [
            'max-h-[200px]',
            'overflow-auto'
        ]
    },
    list: {
        class: 'py-3 list-none m-0'
    },
    item: ({ context }) => ({
        class: [
            'font-normal',
            'leading-none',
            'relative',
            'border-0',
            'rounded-none',
            'm-0',
            'py-3 px-5',
            {
                'text-surface-700 dark:text-white/80': !context.focused && !context.selected,
                'bg-surface-200 dark:bg-surface-600/60': context.focused && !context.selected,
                'text-surface-700 dark:text-white/80': context.focused && !context.selected,
                'text-primary-highlight-inverse': context.selected,
                'bg-primary-highlight': context.selected
            },
            { 'hover:bg-surface-100 dark:hover:bg-surface-600/80': !context.focused && !context.selected },
            { 'hover:bg-primary-highlight-hover': context.selected },
            'focus-visible:outline-none focus-visible:outline-offset-0 focus-visible:ring-0',
            'transition-shadow',
            'duration-200',
            { 'pointer-events-none cursor-default': context.disabled },
            { 'cursor-pointer': !context.disabled },
            'overflow-hidden',
            'whitespace-nowrap'
        ]
    }),
    itemgroup: {
        class: [
            'font-bold',
            'm-0',
            'py-3 px-5',
            'text-surface-800 dark:text-white/80',
            'bg-[#f8f9fd] dark:bg-surface-600/80',
            'cursor-auto'
        ]
    },
    emptymessage: {
        class: [
            'leading-none',
            'py-3 px-5',
            'text-surface-800 dark:text-white/80',
        ]
    },
    header: {
        class: [
            'py-3 px-5',
            'm-0',
            'border-b',
            'rounded-tl-md',
            'rounded-tr-md',
            'text-surface-700 dark:text-white/80',
            'bg-[#f8f9fd] dark:bg-surface-800',
            'border-surface-300 dark:border-surface-700'
        ]
    },
    filtercontainer: {
        class: 'relative'
    },
    filterinput: {
        class: [
            'leading-[normal]',
            'pr-7 py-3 px-3',
            '-mr-7',
            'w-full',
            'text-surface-700 dark:text-white/80',
            'bg-[#f8f9fd] dark:bg-surface-900',
            'border-surface-100 dark:border-surface-700',
            'border',
            'rounded-lg',
            'appearance-none',
            'transition',
            'duration-200',
            'hover:border-surface-400',
            'focus:border-surface-400',
            'focus:outline-none focus:outline-offset-0',
            'appearance-none'
        ]
    },
    filtericon: {
        class: ['absolute', 'top-1/2 right-3', '-mt-2']
    },
    clearicon: {
        class: [
            'text-surface-500',
            'absolute',
            'top-1/2',
            'right-12',
            '-mt-2'
        ]
    },
    loadingicon: {
        class: 'text-surface-400 dark:text-surface-500 animate-spin'
    },
    transition: {
        enterFromClass: 'opacity-0 scale-y-[0.8]',
        enterActiveClass: 'transition-[transform,opacity] duration-[120ms] ease-[cubic-bezier(0,0,0.2,1)]',
        leaveActiveClass: 'transition-opacity duration-100 ease-linear',
        leaveToClass: 'opacity-0'
    }
};