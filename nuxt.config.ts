import { resolve } from "path";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	app: {
		layoutTransition: { name: 'slide-fade-left', mode: 'out-in' },
		pageTransition: { name: 'slide-fade-left', mode: 'out-in' },
	},
	devtools: { enabled: true },
	modules: ['@nuxtjs/tailwindcss', 'nuxt-primevue', '@pinia/nuxt', [
        '@nuxtjs/google-fonts',
        {
            families: {
                Inter: [400, 700],
                'Noto+Sans': true,
                'Open+Sans': true,
                'Metro+Sans': true,
            },
        },
    ], "@nuxt/icon"],
	css: ['~/assets/css/base.css'],
	imports: {
		dirs: ['stores'],
	},
	alias: {
		api: resolve(__dirname, "./api"),
		types: resolve(__dirname, "./types"),
	  },

	primevue: {
		options: {
			unstyled: true,
			ripple: true,
		},
		importPT: { as: 'Krobot', from: '~/presets/krobot' },
		components: {
			exclude: ['Editor', 'DataTable'],
		},
	},

	tailwindcss: {
		config: {
			content: ['presets/**/*.{js,vue,ts}'],

			theme: {
				container: {
					// you can configure the container to be centered
					center: true,

					// or have default horizontal padding
					padding: '1rem',
				},
				extend: {
					fontFamily: {
						noto: ['Noto Sans', 'sans-serif'],
						openSans: ['Open Sans', 'sans-serif'],
						metroSans: ['Metro Sans', 'sans-serif'],
					},
					colors: {
						primary: 'var(--primary)',
						'primary-inverse': 'var(--primary-inverse)',
						'primary-hover': 'var(--primary-hover)',
						'primary-active-color': 'var(--primary-active-color)',

						'primary-highlight':
							'var(--primary)/var(--primary-highlight-opacity)',
						'primary-highlight-inverse': 'var(--primary-highlight-inverse)',
						'primary-highlight-hover':
							'var(--primary)/var(--primary-highlight-hover-opacity)',

						'primary-50': 'var(--primary-50)',
						'primary-100': 'var(--primary-100)',
						'primary-200': 'var(--primary-200)',
						'primary-300': 'var(--primary-300)',
						'primary-400': 'var(--primary-400)',
						'primary-500': 'var(--primary-500)',
						'primary-600': 'var(--primary-600)',
						'primary-700': 'var(--primary-700)',
						'primary-800': 'var(--primary-800)',
						'primary-900': 'var(--primary-900)',
						'primary-950': 'var(--primary-950))',
						'text-color': '#49494B',

						gray: 'var(--gray)',
						'gray-50': 'var(--gray-50)',
						'gray-100': 'var(--gray-100)',
						'gray-200': 'var(--gray-200)',
						'gray-300': 'var(--gray-300)',
						'gray-400': 'var(--gray-400)',
						'gray-500': 'var(--gray-500)',
						'gray-600': 'var(--gray-600)',
						'gray-700': 'var(--gray-700)',
						'gray-800': 'var(--gray-800)',
						'gray-900': 'var(--gray-900)',

						secondary: 'var(--secondary)',
						'secondary-50': 'var(--secondary-50)',
						'secondary-100': 'var(--secondary-100)',
						'secondary-200': 'var(--secondary-200)',
						'secondary-300': 'var(--secondary-300)',
						'secondary-400': 'var(--secondary-400)',
						'secondary-500': 'var(--secondary-500)',
						'secondary-600': 'var(--secondary-600)',
						'secondary-700': 'var(--secondary-700)',
						'secondary-800': 'var(--secondary-800)',
						'secondary-900': 'var(--secondary-900)',
						'secondary-950': 'var(--secondary-950))',

						'surface-0': 'rgb(var(--surface-0))',
						'surface-50': 'rgb(var(--surface-50))',
						'surface-100': 'rgb(var(--surface-100))',
						'surface-200': 'rgb(var(--surface-200))',
						'surface-300': 'rgb(var(--surface-300))',
						'surface-400': 'rgb(var(--surface-400))',
						'surface-500': 'rgb(var(--surface-500))',
						'surface-600': 'rgb(var(--surface-600))',
						'surface-700': 'rgb(var(--surface-700))',
						'surface-800': 'rgb(var(--surface-800))',
						'surface-900': 'rgb(var(--surface-900))',
						'surface-950': 'rgb(var(--surface-950))',
					},
				},
			},
		},
	},
});