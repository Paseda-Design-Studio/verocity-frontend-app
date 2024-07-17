<script setup>
	import { onMounted, ref } from 'vue';

	const navItems = ref([
		{ name: 'Home', to: '/' },
	]);

  const load = ref(true)
</script>

<template>
	<Drawer v-model="load">
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
							class="flex"
							style="width: 150px"
						/>
					</NuxtLink>
					<!-- <span class="inline-flex items-center gap-2">
            <span class="font-semibold text-2xl text-primary">EasiePoint</span>
          </span> -->
					<span>
						<Button
							type="button"
							@click="closeCallback"
							icon="fas fa-times"
							rounded
							outlined
						></Button>
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
	</Drawer>
</template>
