<script lang="ts" setup>
	interface navItems {
		name: string;
		link: string;
	}

	const navs = ref<navItems[]>([
		{ name: 'Our Services', link: '/' },
		{ name: 'FAQs', link: '/faqs' },
		{ name: 'About Us', link: '/about' },
		{ name: 'Contact Us', link: '/contact-us' },
	]);
</script>

<template>
	<header>
		<nav class="bg-white border-gray-200 dark:bg-gray-900">
			<div
				class="container flex flex-wrap items-center justify-between mx-auto p-4"
			>
				<NuxtLink
					to="/"
					class="flex items-center rtl:space-x-reverse"
				>
					<img
						src="/logo/logo.png"
						class="h-12"
						alt="Verocity Logo"
					/>
				</NuxtLink>

				<div class="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
					<div class="gap-4 hidden md:flex">
						<NuxtLink to="/auth/login">
							<Button
								label="Login"
								class="py-2.5 px-5 border-secondary text-secondary focus:outline-none"
								outlined
							/>
						</NuxtLink>

						<NuxtLink to="/auth/register">
							<Button
								label="Sign Up"
								class="py-2.5 px-5 text-white focus:outline-none"
							/>
						</NuxtLink>
					</div>

					<Button
						class="py-1 px-2 bg-transparent text-secondary flex md:hidden focus:outline-none"
					>
						<span class="sr-only">Open main menu</span>
						<svg
							class="w-6 h-6"
							aria-hidden="true"
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 17 14"
						>
							<path
								stroke="currentColor"
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M1 1h15M1 7h15M1 13h15"
							/>
						</svg>
					</Button>
				</div>

				<div
					class="items-center justify-between hidden w-full md:flex md:w-auto md:order-1"
					id="navbar-cta"
				>
					<ul
						class="flex flex-col font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700"
					>
						<li
							v-for="nav in navs"
							:key="nav.name"
						>
							<NuxtLink
								:to="nav.link"
								class="block py-2 px-2 text-gray-900 text-lg md:dark:text-gray-200"
								aria-current="page"
								>{{ nav.name }}</NuxtLink
							>
						</li>
					</ul>
				</div>
			</div>
		</nav>

		<NavbarMobile />
	</header>
</template>

<style scoped></style>
