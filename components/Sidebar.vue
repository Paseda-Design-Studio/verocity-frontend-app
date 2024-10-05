<script setup>
	import { RouterLink, useRoute } from 'vue-router';

	import { sidebarLinks } from '../utils/helper';

	const props = defineProps({
		user: {
			type: Object,
		},
	});

	const route = useRoute();

	onMounted(() => {
		console.log(route.path);
	});

	const logout = () => {
		window.sessionStorage.clear();
		router.push('/login');
	};
</script>

<template>
	<section class="sidebar">
		<nav class="flex flex-col gap-4">
			<RouterLink
				to=""
				class="mb-12 flex items-center cursor-pointer gap-2"
			>
				<img
					src="/logo/footer-logo.png"
					alt="Horizon Logo"
					class="sidebar-logo"
				/>
			</RouterLink>

			<RouterLink
				:to="item.route"
				class="sidebar-link"
				v-for="item in sidebarLinks"
				:key="item.label"
				:class="{ active: route.path === item.route }"
			>
				<div class="relative">
					<img
						:src="item.imgURL"
						:alt="item.label"
						class="sidebar-logo"
					/>
				</div>
				<p class="sidebar-label">{{ item.label }}</p>
			</RouterLink>

			<!-- <Chip class="py-0 pl-0 pr-4">
        <span class="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center">
          {{ props.user?.name.charAt(0) }}
        </span>
        <span class="ml-2 text-sm font-medium">
          {{ props.user?.membership > 100 ? 'Featured' : 'Standard' }}
        </span>
      </Chip> -->
		</nav>
		<div class="">
			<RouterLink
				to="/"
				class="sidebar-link"
			>
				<div class="relative">
					<img
						src="/icons/logout.svg"
						alt="Logout"
						class="sidebar-logo"
					/>
				</div>
				<p class="sidebar-label">Logout</p>
			</RouterLink>
		</div>
	</section>
</template>

<style>
	.router-link-exact-active {
		color: red !important; /* Example styling for active class */
	}
</style>
