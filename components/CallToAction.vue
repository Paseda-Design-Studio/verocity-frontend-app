<script lang="ts" setup></script>
<template>
	<section class="container mx-auto py-10 sm:py-24">
		<div
			class="relative bg-center bg-no-repeat get-quote overflow-hidden px-6 rounded-lg sm:px-16 lg:flex lg:px-24 lg:pt-0"
		>
			<div
				class="mx-auto max-w-md text-center lg:mx-0 lg:flex-auto lg:py-24 lg:text-left"
			>
				<h2 class="text-3xl font-semibold text-white sm:text-4xl">
					Ready to jump in? <br />
					Get your quote today.
				</h2>

				<div
					class="mt-10 flex items-center justify-center gap-x-6 lg:justify-start"
				>
					<Button
						label="Get quote"
						class="text-white bg-primary-600 py-3 px-5"
					/>
				</div>
			</div>
		</div>
	</section>
</template>

<style scoped>
	.get-quote {
		background-image: url('/get-qoute.png');
	}
</style>
