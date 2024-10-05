<script setup lang="ts"></script>

<template>
	<div
		class="text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:text-gray-400 dark:border-gray-700"
	>
		<ul class="flex flex-wrap -mb-px">
			<li
				class="me-2"
				v-for="link in tabSettingsLinks"
			>
				<NuxtLink
					:to="link.route"
					class="inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"
					>{{ link.label }}</NuxtLink
				>
			</li>
		</ul>
	</div>
</template>

<style lang="css"></style>
