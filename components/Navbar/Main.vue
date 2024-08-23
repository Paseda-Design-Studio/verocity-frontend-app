<script lang="ts" setup>
	import Menu from 'primevue/menu';

	interface navItems {
		name: string;
		link: string;
	}

	const navs = ref<navItems[]>([
		{ name: 'FAQs', link: '/faqs' },
		{ name: 'About Us', link: '/about' },
		{ name: 'Contact Us', link: '/contact-us' },
	]);

	const showDrawer = ref<boolean>(false);

	const isLoggedIn = ref<boolean>(true);

	const toggleDrawer = () => {
		showDrawer.value = !showDrawer.value;
	};

	const menu = ref();
	const service = ref();

	const items = ref([
		{
			items: [
				{
					label: 'Refresh',
					icon: 'pi pi-refresh',
				},
				{
					label: 'Export',
					icon: 'pi pi-upload',
				},
			],
		},
	]);

	const ourServiceMenu = ref([
		{
			items: [
				{
					label: 'Ship now',
				},
				{
					label: 'Oversea shipping',
				},
				{
					label: 'Get A Quote',
				},
			],
		},
	]);

	const toggle = (event: any) => {
		menu.value.toggle(event);
	};

	const toggleServiceMenu = (event: any) => {
		service.value.toggle(event);
	};
</script>

<template>
	<header>
		<nav
			class="bg-white border-gray-200 dark:bg-gray-900 md:``````````fixed top-0 w-full z-50"
		>
			<div
				class="lg:container flex flex-wrap items-center justify-between mx-auto p-4"
			>
				<NuxtLink
					to="/"
					class="flex items-center rtl:space-x-reverse"
				>
					<img
						src="/logo/logo.png"
						class="w-[100px] h-auto"
						alt="Verocity Logo"
					/>
				</NuxtLink>

				<div
					class="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse gap-4"
				>
					<template v-if="isLoggedIn">
						<div class="hidden md:flex justify-center items-center gap-4">
							<Button
								type="button"
								@click="toggle"
								aria-haspopup="true"
								size="small"
								severity="secondary"
								text
								aria-controls="overlay_menu"
							>
								<img
									src="/icons/email-outline.svg"
									alt=""
								/>
							</Button>
							<Menu
								ref="menu"
								id="overlay_menu"
								:model="items"
								:popup="true"
							/>
						</div>
						<div class="flex items-center justify-center gap-2">
							<Avatar
								image="/testimony-icon.png"
								shape="circle"
							/>
							<span>Kate Sawyer</span>
						</div>
					</template>

					<div
						v-else
						class="gap-4 hidden md:flex"
					>
						<NuxtLink to="/auth/login">
							<Button
								label="Login"
								class="py-2 px-4 border-secondary rounded-md text-secondary focus:outline-none focus:ring-1 hover:bg-secondary-100"
								outlined
							/>
						</NuxtLink>

						<NuxtLink to="/auth/register">
							<Button
								label="Sign Up"
								class="bg-primary-600 hover:bg-primary-700 focus:ring-1 text-white rounded-md focus:outline-none py-3 px-5"
							/>
						</NuxtLink>
					</div>

					<button
						class="py-1 px-2 bg-transparent text-secondary flex md:hidden focus:outline-none"
						@click="toggleDrawer"
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
					</button>
				</div>

				<div
					class="items-center justify-between hidden w-full md:flex md:w-auto md:order-1"
					id="navbar-cta"
				>
					<ul
						class="flex flex-col font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700"
					>
						<li>
							<a
								href="#"
								@click="toggleServiceMenu"
								class="block py-3 px-2 rounded-md focus:outline-none text-gray-900 text-lg md:dark:text-gray-200 nav__link"
								aria-current="page"
								><span>Our services</span></a
							>
							<Menu
								ref="service"
								id="overlay_menu"
								:model="ourServiceMenu"
								:popup="true"
							/>
						</li>
						<li
							v-for="nav in navs"
							:key="nav.name"
						>
							<NuxtLink
								:to="nav.link"
								class="block py-3 px-2 rounded-md focus:outline-none text-gray-900 text-lg md:dark:text-gray-200 nav__link"
								aria-current="page"
								><span>{{ nav.name }}</span></NuxtLink
							>
						</li>
					</ul>
				</div>
			</div>
		</nav>

		<NavbarMobile
			:show-drawer="showDrawer"
			@toggle-drawer="toggleDrawer"
		/>
	</header>
</template>

<style>
	.nav__link span {
		position: relative;
		transition: margin 0.4s;
	}

	.nav__link span::after {
		content: '';
		position: absolute;
		left: 0;
		bottom: -6px;
		width: 0;
		height: 2px;
		background-color: #c24121;
		transition: width 0.4s ease-out;
	}

	/* Animation link on hover */
	/* .nav__link:hover span {
	margin-left: 2.5rem;
} */

	.nav__link:hover span::after {
		width: 100%;
	}

	#overlay_menu {
		top: 84px !important;
		padding: 0;
	}

	#overlay_menu_0 {
		display: none !important;
	}
</style>
