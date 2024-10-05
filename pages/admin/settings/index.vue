<script setup lang="ts">
	definePageMeta({
		layout: 'admin',
	});
</script>

<template>
	<header className="home-header">
		<AppSettingLinks />
	</header>

	<h1 class="header-box-title !text-2xl">Profile</h1>

	<section class="rounded-lg bg-white p-3">
		<div class="flex items-center gap-2">
			<img
				src="/placeholder.png"
				shape="circle"
				class="w-20 h-20"
			/>
			<div class="flex gap-0.5 flex-col">
				<span class="text-lg font-medium">Justin Septimus</span>
				<span class="text-sm">Haylierosser@gmail.com</span>
			</div>
		</div>

		<Divider />

		<div class="grid grid-cols-3">
			<div class="flex">
				<ul class="text-sm text-gray-900 bg-white rounded-lg">
					<li class="w-full px-4 py-1.5">Email Address</li>
					<li class="w-full px-4 py-1.5">Role</li>
				</ul>
			</div>

			<div class="grid col-span-2">
				<ul class="text-sm font-semibold text-gray-900 bg-white rounded-lg">
					<li class="w-full px-4 py-1.5">Haylierosser@gmail.com</li>
					<li class="w-full px-4 py-1.5">Super Admin</li>
				</ul>
			</div>
		</div>
	</section>
</template>

<style scoped></style>
