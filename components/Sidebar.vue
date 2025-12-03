<script setup lang="ts">
	import { sidebarLinks } from '~/utils/helper';

	defineProps({
		user: {
			type: Object,
		},
	});

	const route = useRoute();

	const isActiveRoute = (url: string) => {
		return route.path === url;
	};

	// Handle logout functionality
	const handleLogout = () => {
		// Add your logout logic here
		console.log('Logout clicked');
		// Example: await $fetch('/api/auth/logout')
		// Example: await navigateTo('/login')
	};
</script>

<template>
	<section class="sidebar">
		<div class="sidebar__content">
			<!-- Logo Section -->
			<div class="sidebar__logo-section">
				<nuxt-link to="/admin/dashboard" class="sidebar__logo-link">
					<img src="/logo/footer-logo.png" alt="Company Logo" class="sidebar__logo" />
				</nuxt-link>
			</div>

			<!-- Navigation Links -->
			<nav class="sidebar__nav">
				<div v-for="item in sidebarLinks" :key="item.label" class="sidebar__route"
					:class="{ 'sidebar__route--active': isActiveRoute(item.route) }">
					<nuxt-link :to="item.route" class="sidebar__link"
						:class="{ 'sidebar__link--active': isActiveRoute(item.route) }">
						<app-icon v-if="item.icon" :name="item.icon" class="sidebar__icon" />
						<span class="sidebar__label">{{ item.label }}</span>
					</nuxt-link>
				</div>
			</nav>
		</div>

		<!-- Logout Section - Pushed to bottom -->
		<div class="sidebar__logout">
			<div class="sidebar__route">
				<div class="sidebar__link sidebar__link--logout" @click="handleLogout">
					<app-icon name="log-out" class="sidebar__icon" />
					<span class="sidebar__label">Logout</span>
				</div>
			</div>
		</div>
	</section>
</template>

<style lang="scss" scoped>
	.sidebar {
		position: fixed;
		top: 0;
		left: 0;
		height: 100vh;
		width: 288px;
		background-color: #111828;
		border-right: 1px solid #e5e7eb;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		z-index: 1000;
		overflow-y: auto;

		&__content {
			display: flex;
			flex-direction: column;
			flex: 1;
		}

		&__logo-section {
			padding: 1.5rem 1rem;
			border-bottom: 1px solid rgba(125, 139, 154, 0.26);
		}

		&__logo-link {
			display: flex;
			align-items: center;
			justify-content: center;
			cursor: pointer;
			text-decoration: none;
		}

		&__logo {
			height: 2.5rem;
			width: auto;
			max-width: 100%;
			object-fit: contain;
		}

		&__nav {
			display: flex;
			flex-direction: column;
			gap: 0.5rem;
			padding: 0.7rem 0.1rem;
			flex: 1;
		}

		&__route {
			width: 100%;

			&--active {
				.sidebar__link {
					background-color: #272e3c;
					color: #f2f2f2;

					&:hover {
						background-color: #272e3c;
						color: #f2f2f2;
					}
				}
			}
		}

		&__link {
			display: flex;
			align-items: center;
			gap: 0.5rem;
			padding: 0.65rem 0.4rem;
			border-radius: 0.5rem;
			transition: all 0.2s ease-in-out;
			color: #7d8b9a;
			text-decoration: none;
			width: 100%;
			cursor: pointer;

			&:hover {
				background-color: #272f3c;
				color: #f2f2f2;
			}

			&--active {
				background-color: #272e3c;
				color: #f2f2f2;

				&:hover {
					background-color: #272e3c;
					color: #f2f2f2;
				}
			}

			&--logout {
				color: #7d8b9a;

				&:hover {
					background-color: #272f3c;
					color: #f2f2f2;
				}
			}
		}

		&__icon {
			width: 1.25rem;
			height: 1.25rem;
			flex-shrink: 0;
		}

		&__label {
			font-size: 0.875rem;
			font-weight: 500;
			white-space: nowrap;
		}

		&__logout {
			padding: 1rem;
			border-bottom: 1px solid rgba(125, 139, 154, 0.26);
		}

		// Ensure icons inherit color properly
		&__link {
			:deep(svg) {
				color: inherit;
				fill: currentColor;
			}

			:deep(svg path) {
				fill: currentColor;
				stroke: currentColor;
			}
		}

		// Responsive design
		@media (max-width: 768px) {
			width: 280px;
			transform: translateX(-100%);
			transition: transform 0.3s ease;

			&--open {
				transform: translateX(0);
			}
		}
	}
</style>
