<script setup lang="ts">

const props = defineProps({
	showDrawer: {
		default: false,
		required: true,
	},
});

const emits = defineEmits(['toggleDrawer']);

const authStore = useAuthStore();

const buttonClick = () => {
	emits('toggleDrawer');
};

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

// Computed properties
const isLoggedIn = computed(() => !!authStore.user);

// User actions
const goToProfile = () => {
	buttonClick(); // Close mobile drawer
	navigateTo('/user/profile');
};

const handleSignOut = async () => {
	buttonClick(); // Close mobile drawer
	try {
		await authStore.logout();
		navigateTo('/auth/login');
	} catch (error) {
		console.error('Sign out error:', error);
	}
};
</script>

<template>
	<transition name="slide-fade" mode="out-in">
		<div v-if="props.showDrawer" id="drawer-body-scrolling"
			class="fixed top-0 left-0 z-40 w-full max-h-[600px] h-screen flex flex-col justify-center p-4 overflow-y-auto transition-transform border-r bg-white sm:hidden "
			tabindex="-1" aria-labelledby="drawer-body-scrolling-label">
			
			<!-- Header with logo and close button -->
			<div class="flex items-center justify-between py-4 px-6 shrink-0 top-0 left-0 absolute w-full">
				<NuxtLink :to="'/'" class="!py-0">
					<img src="/logo/logo.png" alt="Company Logo" class="flex w-32 h-auto" @click="buttonClick" />
				</NuxtLink>

				<span>
					<button class="w-12 h-12 text-2xl" @click="buttonClick">
						<IconsClose />
					</button>
				</span>
			</div>

			<!-- User info section (if logged in) -->
			<div v-if="isLoggedIn" class="px-4 py-3 border-b border-gray-100 mt-16">
				<div class="flex items-center gap-3">
					<Avatar
						v-if="authStore.user?.photoUrl"
						:image="authStore.user?.photoUrl"
						shape="circle"
						size="normal"
					/>
					<div
						v-else
						class="w-12 h-12 bg-secondary text-white font-semibold rounded-full flex items-center justify-center text-sm"
					>
						{{ authStore.userInitial }}
					</div>
					<div class="flex-1 min-w-0">
						<p class="text-base font-medium text-gray-900 truncate">
							{{ authStore.userFullName }}
						</p>
						<p class="text-sm text-gray-500 truncate">
							{{ authStore.user?.email }}
						</p>
					</div>
				</div>
			</div>

			<!-- Navigation items -->
			<div class="py-4 pt-2 overflow-y-auto">
				<ul class="list-none p-0 m-0 overflow-hidden">
					<li v-for="(item, i) in navs" :key="i" class="nav-item">
						<NuxtLink v-ripple
							class="flex items-center cursor-pointer text-sm p-4 rounded text-gray-700 hover:bg-gray-100 dark:text-gray-0 dark:hover:bg-gray-800 duration-150 transition-all p-ripple hover:translate-x-1"
							:to="item.link"
							@click="buttonClick">
							<IconsArrowRight class="mr-2 text-secondary" />
							<span class="font-medium text-2xl">
								{{ item.name }}
							</span>
						</NuxtLink>
					</li>

					<!-- User menu items (if logged in) -->
					<template v-if="isLoggedIn">
						<li class="nav-item">
							<button
								@click="goToProfile"
								class="flex items-center cursor-pointer text-sm p-4 rounded text-gray-700 hover:bg-gray-100 dark:text-gray-0 dark:hover:bg-gray-800 duration-150 transition-all p-ripple hover:translate-x-1 w-full text-left"
							>
								<svg class="w-5 h-5 mr-2 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
								</svg>
								<span class="font-medium text-2xl">
									Profile
								</span>
							</button>
						</li>

						<li class="nav-item">
							<button
								@click="handleSignOut"
								class="flex items-center cursor-pointer text-sm p-4 rounded text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 duration-150 transition-all p-ripple hover:translate-x-1 w-full text-left"
							>
								<svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
								</svg>
								<span class="font-medium text-2xl">
									Sign Out
								</span>
							</button>
						</li>
					</template>
				</ul>
			</div>

			<!-- Auth buttons (if not logged in) -->
			<div v-if="!isLoggedIn" class="gap-4 px-4 block w-full items-center md:hidden">
				<NuxtLink to="/auth/login">
					<Button label="Login"
						class="auth__btn btn-1 py-2 px-4 mb-4 w-full border-secondary rounded-md text-secondary focus:outline-none focus:ring-1 hover:bg-secondary-100"
						outlined 
						@click="buttonClick" />
				</NuxtLink>

				<NuxtLink to="/auth/register">
					<Button label="Sign Up"
						class="auth__btn btn-2 bg-primary-600 w-full hover:bg-primary-700 focus:ring-1 text-white rounded-md focus:outline-none py-3 px-5"
						@click="buttonClick" />
				</NuxtLink>
			</div>
		</div>
	</transition>
</template>

<style scoped>
/* Slide-in and slide-out transition */
.slide-fade-enter-active,
.slide-fade-leave-active {
	transition: transform 0.3s ease, opacity 0.3s ease;
}

.slide-fade-enter,
.slide-fade-leave-to {
	transform: translateX(-100%);
	opacity: 0;
}

/* Delayed item slide-in */
.nav-item {
	opacity: 0;
	transform: translateY(20px);
	animation: slideIn 0.3s ease forwards;
}

.nav-item:nth-child(1) {
	animation-delay: 0.1s;
}

.nav-item:nth-child(2) {
	animation-delay: 0.2s;
}

.nav-item:nth-child(3) {
	animation-delay: 0.3s;
}

.nav-item:nth-child(4) {
	animation-delay: 0.4s;
}

.nav-item:nth-child(5) {
	animation-delay: 0.5s;
}

.nav-item:nth-child(6) {
	animation-delay: 0.6s;
}

.auth__btn {
	opacity: 0;
	transform: translateY(20px);
	animation: slideIn 0.3s ease forwards;
}

.auth__btn.btn-1 {
	animation-delay: 0.7s;
}

.auth__btn.btn-2 {
	animation-delay: 0.8s;
}

@keyframes slideIn {
	to {
		opacity: 1;
		transform: translateY(0);
	}
}
</style>
