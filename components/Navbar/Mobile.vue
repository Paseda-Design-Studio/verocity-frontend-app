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
	<!-- <Drawer v-model="load">
		<template #container="{ closeCallback }">
			<div class="flex flex-col h-full">
				<div class="flex items-center justify-between px-4 py-4 shrink-0">
					<NuxtLink
						:to="'/'"
						class="!py-0"
					>
						<img
							:src="newLogo"
							alt="Company Logo"
							class="flex w-5 h-auto"
							
						/>
					</NuxtLink>

					<span>
						<button
							type="button"
							@click="closeCallback"
							icon="fas fa-times"
							rounded
							outlined
						></button>
					</span>
				</div>
				<div class="overflow-y-auto">
					<ul class="list-none p-0 m-0 overflow-hidden">
						<li
							v-for="(item, i) in navItems"
							:key="i"
						>
							<NuxtLink
								v-ripple
								class="flex items-center cursor-pointer text-sm p-4 rounded text-gray-700 hover:bg-gray-100 dark:text-gray-0 dark:hover:bg-gray-800 duration-150 transition-colors p-ripple"
								:to="item.to"
							>
								<i class="fas fa-chevron-right mr-2 text-secondary"></i>
								<span class="font-medium"></span>
								{{ item.name }}
							</NuxtLink>
						</li>
						<template v-if="authStore.isLoggedIn">
							<li
								v-for="(item, i) in authNavItems"
								:key="i"
							>
								<NuxtLink
									v-ripple
									class="flex items-center cursor-pointer text-sm p-4 rounded text-gray-700 hover:bg-gray-100 dark:text-gray-0 dark:hover:bg-gray-800 duration-150 transition-colors p-ripple"
									:to="item.to"
								>
									<i class="fas fa-chevron-right mr-2 text-secondary"></i>
									<span class="font-medium"></span>
									{{ item.name }}
								</NuxtLink>
							</li>
						</template>
					</ul>
				</div>
			</div>
		</template>
	</Drawer> -->

	<transition
		name="slide-fade-left"
		mode="out-in"
	>
		<div
			v-if="props.showDrawer"
			id="drawer-body-scrolling"
			class="fixed top-0 left-0 z-40 h-screen p-4 overflow-y-auto transition-transform w-80 bg-white border-r dark:bg-gray-800 sm:hidden"
			tabindex="-1"
			aria-labelledby="drawer-body-scrolling-label"
		>
			<div class="flex items-center justify-between py-4 shrink-0">
				<NuxtLink
					:to="'/'"
					class="!py-0"
					
				>
					<img
						src="/logo/logo.png"
						alt="Company Logo"
						class="flex w-32 h-auto"
						@click="buttonClick"
					/>
				</NuxtLink>

				<span>
					<Button
						type="button"
						rounded
						outlined
						class="w-12 h-12 text-2xl"
						@click="buttonClick"
					>
						<IconsClose />
					</Button>
				</span>
			</div>
			<div class="py-4 pt-2 overflow-y-auto">
				<ul class="list-none p-0 m-0 overflow-hidden">
					<li
						v-for="(item, i) in navs"
						:key="i"
						@click="buttonClick"
					>
						<NuxtLink
							v-ripple
							class="flex items-center cursor-pointer text-sm p-4 rounded text-gray-700 hover:bg-gray-100 dark:text-gray-0 dark:hover:bg-gray-800 duration-150 transition-colors p-ripple"
							:to="item.link"
						>
							<IconsArrowRight class="mr-2 text-secondary" />
							<span class="font-medium">
								{{ item.name }}
							</span>
						</NuxtLink>
					</li>
				</ul>
			</div>
		</div>
	</transition>
</template>
