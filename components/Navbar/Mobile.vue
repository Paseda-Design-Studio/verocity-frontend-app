<script setup lang="ts">
import { onMounted, ref } from 'vue';

const props = defineProps({
	showDrawer: {
		default: false,
		required: true,
	},
});

const emits = defineEmits(['toggleDrawer']);

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
</script>

<template>
	<transition name="slide-fade" mode="out-in">
		<div v-if="props.showDrawer" id="drawer-body-scrolling"
			class="fixed top-0 left-0 z-40 w-full max-h-[600px] h-screen flex flex-col justify-center p-4 overflow-y-auto transition-transform border-r bg-white sm:hidden "
			tabindex="-1" aria-labelledby="drawer-body-scrolling-label">
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
			<div class="py-4 pt-2 overflow-y-auto ">
				<ul class="list-none p-0 m-0 overflow-hidden">
					<li v-for="(item, i) in navs" :key="i" class="nav-item">
						<NuxtLink v-ripple
							class="flex items-center cursor-pointer text-sm p-4 rounded text-gray-700 hover:bg-gray-100 dark:text-gray-0 dark:hover:bg-gray-800 duration-150 transition-all p-ripple hover:translate-x-1"
							:to="item.link">
							<IconsArrowRight class="mr-2 text-secondary" />
							<span class="font-medium text-2xl">
								{{ item.name }}
							</span>
						</NuxtLink>
					</li>
				</ul>
			</div>

			<div class="gap-4 px-4 block w-full items-center md:hidden">
				<NuxtLink to="/auth/login">
					<Button label="Login"
						class="auth__btn btn-1 py-2 px-4 mb-4 w-full border-secondary rounded-md text-secondary focus:outline-none focus:ring-1 hover:bg-secondary-100"
						outlined />
				</NuxtLink>

				<NuxtLink to="/auth/register">
					<Button label="Sign Up"
						class="auth__btn btn-2 bg-primary-600 w-full hover:bg-primary-700 focus:ring-1 text-white rounded-md focus:outline-none py-3 px-5" />
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

.auth__btn {
	opacity: 0;
	transform: translateY(20px);
	animation: slideIn 0.3s ease forwards;
}

.auth__btn.btn-1 {
	animation-delay: 0.5s;
}

.auth__btn.btn-2 {
	animation-delay: 0.6s;
}

@keyframes slideIn {
	to {
		opacity: 1;
		transform: translateY(0);
	}
}
</style>
