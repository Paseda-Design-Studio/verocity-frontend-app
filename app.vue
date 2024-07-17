<template>
	<div class="bg-grey-300">
		<NuxtLayout>
			<NuxtLoadingIndicator />
			<NuxtPage />
		</NuxtLayout>
	</div>
</template>

<style>
	.slide-fade-left-enter-active {
		transition: all 0.2s ease-out;
	}

	.slide-fade-left-leave-active {
		transition: all 0.2s cubic-bezier(1, 0.5, 0.8, 1);
	}

	.slide-fade-left-enter-from,
	.slide-fade-left-leave-to {
		transform: translateX(-20px);
		opacity: 0;
	}
</style>
