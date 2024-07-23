<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from 'vue';

interface FooterLinkProps {
	name: string;
	link: string;
}

const companyLinks = readonly<FooterLinkProps[]>([
	{ name: 'About Us', link: '/about' },
	{ name: 'Career', link: '/' },
	{ name: 'Contact', link: '/contact-us' },
]);

const resourceLinks = readonly<FooterLinkProps[]>([
	{ name: 'Blog', link: '/' },
	{ name: 'Support', link: '/' },
]);

const legalLinks = readonly<FooterLinkProps[]>([
	{ name: 'Terms', link: '/terms-and-conditions' },
	{ name: 'Privacy', link: '/' },
	{ name: 'Licenses', link: '/' },
]);

const isScrollUpVisible = ref(false);

const handleScroll = () => {
	isScrollUpVisible.value = window.scrollY > 200;
};

onMounted(() => {
	window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
	window.removeEventListener('scroll', handleScroll);
});
</script>

<template>
	<footer class="bg-[#0D173D] dark:bg-gray-900">
		<div class="mx-auto container p-4 py-6 lg:py-16">
			<div class="grid grid-cols-2 gap-6 sm:gap-12 sm:grid-cols-4">
				<div class="mb-6 md:mb-0">
					<NuxtLink to="/" class="flex items-center">
						<img src="/logo/footer-logo.png" class="h-8" alt="verocityshipping Logo" />
					</NuxtLink>
					<p class="text-base text-white dark:text-gray-200 mb-0 mt-6">
						Lorem ipsum dolor sit amet, consectetur adipiscing elit.
					</p>
				</div>

				<div>
					<h2 class="mb-6 text-sm font-semibold text-gray-200 uppercase dark:text-white">
						Company
					</h2>
					<ul class="text-gray-400 dark:text-gray-400 font-medium">
						<li class="mb-2" v-for="link in companyLinks" :key="link.name">
							<NuxtLink :to="link.link" class="hover:underline">{{ link.name }}</NuxtLink>
						</li>
					</ul>
				</div>

				<div>
					<h2 class="mb-6 text-sm font-semibold text-gray-100 uppercase dark:text-white">
						Resources
					</h2>
					<ul class="text-gray-400 dark:text-gray-400 font-medium">
						<li class="mb-2" v-for="link in resourceLinks" :key="link.name">
							<NuxtLink :to="link.link" class="hover:underline">{{ link.name }}</NuxtLink>
						</li>
					</ul>
				</div>

				<div>
					<h2 class="mb-6 text-sm font-semibold text-gray-100 uppercase dark:text-white">
						Legal
					</h2>
					<ul class="text-gray-400 dark:text-gray-400 font-medium">
						<li class="mb-2" v-for="link in legalLinks" :key="link.name">
							<NuxtLink :to="link.link" class="hover:underline">{{ link.name }}</NuxtLink>
						</li>
					</ul>
				</div>
			</div>
			<hr class="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
			<div class="sm:flex sm:items-center sm:justify-between">
				<span class="text-sm text-gray-300 sm:text-center dark:text-gray-400">
					© {{ new Date().getFullYear() }}
					<a href="https://verocityshipping.com/" class="hover:underline">Verocity</a>. All Rights Reserved.
				</span>
				<div class="flex mt-4 gap-4 sm:justify-center sm:mt-0">
					<a href="#" class="text-gray-200 text-2xl hover:text-gray-300 dark:hover:text-white">
						<IconsTwitter />
						<span class="sr-only">Twitter page</span>
					</a>

					<a href="#" class="text-gray-200 text-2xl hover:text-gray-200 dark:hover:text-white">
						<IconsFacebook />
						<span class="sr-only">Facebook page</span>
					</a>

					<a href="#" class="text-gray-200 text-2xl hover:text-gray-200 dark:hover:text-white">
						<IconsInstagram />
						<span class="sr-only">Instagram page</span>
					</a>
				</div>
			</div>
		</div>
		<!--========== SCROLL UP ==========-->
		<a href="#" class="scrollup" id="scroll-up" :class="{ 'show-scroll': isScrollUpVisible }">
			<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" class="w-5 h-5">
				<path fill="none" stroke="#f2f2f2" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
					d="m18 15l-6-6l-6 6" />
			</svg>
		</a>
	</footer>
</template>

<style scoped>
.scrollup {
	position: fixed;
	right: 1rem;
	bottom: -50%;
	font-size: 1.25rem;
	background-color: #ba1c46;
	padding: 8px;
	display: inline-flex;
	z-index: 999;
	transition: bottom 0.4s ease-in-out, transform 0.4s ease-in-out, background-color 0.4s ease-in-out;
}

.scrollup:hover {
	transform: translateY(-0.5rem);
}

/* Show Scroll Up */
.show-scroll {
	bottom: 10rem;
}
</style>
