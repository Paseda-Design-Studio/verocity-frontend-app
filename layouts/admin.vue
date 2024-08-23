<!-- eslint-disable vue/multi-word-component-names -->
<script setup>
	import { onMounted, ref } from 'vue';

	const route = useRoute();

	const statistics = ref(null);

	const chartOptions = ref();
</script>
<template>
	<main class="flex h-screen w-full font-inter">
		<Sidebar :user="{ name: 'Demola Alaofin' }" />

		<div class="flex w-full flex-col">
			<div class="root-layout">
				<NuxtLink
					to=""
					class=""
				>
					<img
						src="../assets/img/logo_brand.png"
						alt="Horizon Logo"
						class="h-12"
					/>
				</NuxtLink>
				<div>
					<transition
						name="slide-fade"
						mode="out-in"
					>
						<button
							class="cursor-pointer text-2xl leading-none px-3 py-0 border border-solid border-transparent rounded bg-transparent block lg:hidden outline-none focus:outline-none"
							type="button"
							:class="{
								'text-dark/90': route.name != 'home',
								'text-dark/80': route.name == 'home',
							}"
						>
							<i class="fas fa-bars"></i>
						</button>
					</transition>
					<!-- <MobileNavbar :state="mobileNav" /> -->
				</div>
			</div>
			<section className="home">
				<div className="home-content">
					Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolorum cum tempora assumenda consectetur distinctio dicta ipsam molestiae similique et rem corrupti suscipit vero nostrum dignissimos earum non, eveniet quaerat alias.
				</div>
			</section>
		</div>
	</main>
</template>
