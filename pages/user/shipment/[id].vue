<script setup lang="ts">
	import type { ShipmentItem, ShipmentData } from '~/api/shipment/types';
	import { TabGroup, TabList, Tab, TabPanels, TabPanel } from '@headlessui/vue';

	definePageMeta({
		layout: 'default',
	});

	const route = useRoute()
	const shipmentId = route.params.id as string

	// Format date helper
	const formatDate = (dateString?: string) => {
		// Since we don't have real dates, return a mock date
		return new Date().toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		})
	}

	// Simulate loading state for realism
	const pending = ref(true)
	const error = ref<unknown | null>(null)
	const shipmentData = ref<ShipmentData | null>(null)

	// Simulate API call with loading delay
	onMounted(async () => {
		try {
			// Simulate network delay
			await new Promise(resolve => setTimeout(resolve, 1000))

			// Create mock data based on the ID
			shipmentData.value = createMockShipmentData(shipmentId)
			pending.value = false
		} catch (err) {
			console.error('Failed to load shipment data:', err)
			error.value = err
			pending.value = false
		}
	})

	const copyTrackingId = async () => {
		try {
			const trackingId = shipmentData.value?.ref_id || 'N/A'
			await navigator.clipboard.writeText(trackingId);
			console.log('Tracking ID copied to clipboard:', trackingId);
			// TODO: Add toast notification when you implement it
		} catch (err) {
			console.error('Failed to copy tracking ID: ', err);
		}
	};

	// Mock/placeholder data for development
	const createMockShipmentData = (id: string): ShipmentData => ({
		ref_id: `PCM-${id.toUpperCase()}`,
		delivery_status: 'in transit',
		sender: {
			first_name: 'John',
			last_name: 'Doe',
			email: 'john.doe@example.com',
			phone: '+1 (555) 123-4567',
			street: '123 Main Street',
			city: 'New York',
			state: 'NY',
			country: 'United States',
			zipcode: '10001'
		},
		recipient: {
			first_name: 'Jane',
			last_name: 'Smith',
			email: 'jane.smith@example.com',
			phone: '+1 (555) 987-6543',
			street: '456 Oak Avenue',
			city: 'Los Angeles',
			state: 'CA',
			country: 'United States',
			zipcode: '90210'
		},
		items: [
			{
				name: 'MacBook Pro 16"',
				weight: 2.1,
				length: 35.79,
				width: 24.59,
				height: 1.68,
				quantity: 1,
				category: 'Electronics',
				value: 2499.00,
				fragile: true,
				insurance_required: true,
				handling_instructions: 'Handle with care - fragile electronics',
				sku: 'MBP16-2023-001',
				image_url: '/package.png',
				image_ref: 'macbook-pro-16-2023'
			},
			{
				name: 'Wireless Mouse',
				weight: 0.1,
				length: 12,
				width: 6,
				height: 3,
				quantity: 2,
				category: 'Electronics',
				value: 79.99,
				fragile: false,
				insurance_required: false,
				handling_instructions: '',
				sku: 'WM-001',
				image_url: '/package.png',
				image_ref: 'wireless-mouse'
			}
		],
		payment: {
			ref_id: `PAY-${id.toUpperCase()}-001`,
			method: 'credit_card',
			amount: 2807.50,
			currency: 'USD',
			status: 'paid',
			insurance: 120.00,
			tax: 187.50,
			discount: 0,
			details: {
				card_last_four: '4242',
				card_brand: 'visa'
			}
		}
	})

	const events = ref([
		{
			id: 1,
			name: 'Order has left Verocity Shipping distribution center Chicago , USA to 2333 W Jackson Blvd Chicago, Illinois(IL), 60612',
			status: 'Ordered',
			date: 'Sat, Jun 22, 2024, 03:19pm',
		},
		{
			id: 2,
			name: 'Order has arrived Verocity Shipping distribution center Chicago , USA',
			status: 'Processing',
			date: 'Sat, Jun 22, 2024, 03:19pm',
		},
		{
			id: 3,
			name: 'Order has left Verocity Shipping distribution center Accra , Ghana to Verocity Shipping distribution center Chicago , USA',
			status: 'Shipped',
			date: 'Sat, Jun 22, 2024, 03:19pm',
		},
		{
			id: 4,
			name: 'Shipment received at Verocity Shipping Accra, Ghana',
			status: 'Delivered',
			date: 'Sat, Jun 22, 2024, 03:19pm',
		},
	]);
</script>

<template>
	<section class="relative overflow-hidden py-10 sm:py-12 bg-gray-50 mt-20">
		<div class="container">
			<div class="max-w-6xl mx-auto">
				<!-- back button -->
				<AppSinglePageHeader />

				<!-- Header Section -->
				<section class="my-6 md:my-8 lg:my-10">
					<AdminTitleHeader title="Shipment Details" :show-divider="false" />
				</section>

				<!-- card -->
				<div class="flex flex-col bg-white rounded">
					<div class="card-header flex flex-col md:flex-row justify-between py-6 px-6 gap-4 md:gap-0">
						<div class="details flex flex-col gap-2">
							<span class="text-sm text-gray-500"> Shipping ID </span>
							<span class="flex text-gray-900 text-2xl tracking-tight font-bold">
								PCM-034PR0871
							</span>
						</div>

						<div class="details flex flex-wrap md:gap-14 gap-6">
							<div class="flex flex-col gap-2">
								<span class="text-sm text-gray-500">Payment Status </span>
								<span class="flex items-center">
									<app-status-chip :status="shipmentData?.payment?.status || 'pending'"
										variant="filled" />
								</span>
							</div>

							<div class="flex flex-col gap-2">
								<span class="text-sm text-gray-500">Delivery Status </span>
								<span class="flex items-center">
									<app-status-chip :status="shipmentData?.delivery_status || 'pending'" />
								</span>
							</div>

							<div class="flex flex-col gap-2">
								<span class="text-sm text-gray-500">Date Created </span>
								<span class="flex text-gray-900 text-base tracking-tight font-bold">
									{{ formatDate() }}
								</span>
							</div>
							<div class="flex flex-col gap-2">
								<span class="text-sm text-gray-500">Tracking ID </span>
								<span class="flex items-center gap-2 text-gray-900 text-base tracking-tight font-bold">
									<span>{{ shipmentData?.ref_id }}</span>
									<button @click="copyTrackingId"
										class="text-gray-400 p-1 rounded hover:translate-y-1 transition-all duration-200"
										title="Copy tracking ID">
										<AppIcon name="copy" class="w-4 h-4" />
									</button>
								</span>
							</div>
						</div>
					</div>
					<TabGroup>
						<TabList class="bg-[#fceeeb] flex px-4 gap-2 h-10">
							<Tab as="template" v-slot="{ selected }">
								<span class="px-4 flex items-center focus:outline-none transition-all duration-200"
									:class="selected ? 'border-b-4 border-primary text-primary-600 -mb-[2px]' : '-mb-[2px] border-b-4 border-transparent'">
									Tracking
								</span>
							</Tab>
							<Tab as="template" v-slot="{ selected }">
								<span class="px-4 flex items-center focus:outline-none transition-all duration-200"
									:class="selected ? 'border-b-4 border-primary text-primary-600 -mb-[2px]' : '-mb-[2px] border-b-4 border-transparent'">
									Order Details
								</span>
							</Tab>
						</TabList>

						<TabPanels class="px-8 py-6">
							<TabPanel>
								<ol class="relative border-s-2 border-s-green-500 border-gray-200 dark:border-gray-700">
									<li class="mb-10 ms-6" v-for="item in events" :key="item.status">
										<span
											class="absolute flex items-center justify-center w-6 h-6 bg-green-500 rounded-full -start-3 ring-white dark:ring-gray-900 dark:bg-blue-900">
											<svg xmlns="http://www.w3.org/2000/svg"
												class="w-4 h-4 text-white dark:text-blue-300" viewBox="0 0 24 24">
												<path fill="currentColor"
													d="M9 16.17L4.83 12l-1.42 1.41L9 19L21 7l-1.41-1.41z" />
											</svg>
										</span>

										<div class="flex flex-col gap-2">
											<h3
												class="flex items-center max-w-3xl text-sm font-semibold text-gray-900 dark:text-white">
												{{ item.name }}
											</h3>
											<time
												class="block text-xs font-normal leading-none text-gray-500 dark:text-gray-500">{{
													item.date }}</time>
										</div>
									</li>
								</ol>
							</TabPanel>

							<TabPanel>
								<div class="flex flex-col">
									<h3 class="text-gray-800 text-lg font-semibold mb-6">
										Package Details
									</h3>
									<div class="flex items-center w-full space-x-8 rounded-md mb-3">
										<div class="flex justify-center rounded items-center">
											<img src="/package.png" alt="Package Icon" class="rounded" />
										</div>

										<div class="flex-1 space-y-1">
											<p class="text-base font-bold leading-none mb-2 text-black">
												Mining Machine
											</p>

											<div class="flex">
												<p
													class="text-xs flex items-center gap-1 border-r border-gray-300 pr-2">
													<span class="text-gray-600">Item Category:</span>
													<span class="text-gray-400">Electronics</span>
												</p>

												<p
													class="text-xs flex items-center gap-1 border-r border-gray-300 px-2">
													<span class="text-gray-600">Qty:</span>
													<span class="text-gray-400">12</span>
												</p>

												<p class="text-xs flex items-center gap-1 px-2">
													<span class="text-gray-600">Weight:</span>
													<span class="text-gray-400">5.2kg</span>
												</p>
											</div>

											<!-- <Divider layout="vertical" /> -->
										</div>
									</div>

									<!-- divider -->
									<Divider />

									<h3 class="text-gray-800 text-lg font-semibold mb-6">
										Address Information
									</h3>

									<div class="grid grid-cols-1 gap-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-2">
										<div class="flex flex-col gap-3 bg-gray-50 p-4 rounded border border-gray-200">
											<div class="flex items-center">
												<span class="text-base text-gray-500 font-semibold">Pick From</span>
											</div>
											<div class="flex flex-col justify-center">
												<div class="flex justify-between items-center gap-2 text-sm">
													<p class="leading-7 text-gray-900">Contact Name</p>
													<p class="font-semibold text-gray-700">
														Justin Septimus
													</p>
												</div>

												<div class="flex justify-between items-center gap-2 text-sm">
													<p class="leading-7 text-gray-900">Address</p>
													<p class="font-semibold text-gray-700">
														2045 W Jackson Blvd Chicago, Illinois(IL), 60612
													</p>
												</div>

												<div class="flex justify-between items-center gap-2 text-sm">
													<p class="leading-7 text-gray-900">Email</p>
													<p class="font-semibold text-gray-700">
														Justinseptimus@gmail.com
													</p>
												</div>

												<div class="flex justify-between items-center gap-2 text-sm">
													<p class="leading-7 text-gray-900">Phone Number</p>
													<p class="font-semibold text-gray-700">
														(312) 455-9264
													</p>
												</div>
											</div>
										</div>

										<div class="flex flex-col gap-3 bg-gray-50 p-4 rounded border border-gray-200">
											<div class="flex items-center">
												<span class="text-base text-gray-500 font-semibold">Deliver to</span>
											</div>
											<div class="flex flex-col justify-center">
												<div class="flex justify-between items-center gap-2 text-sm">
													<p class="leading-7 text-gray-900">Contact Name</p>
													<p class="font-semibold text-gray-700">
														Adison Rhiel
													</p>
												</div>

												<div class="flex justify-between items-center gap-2 text-sm">
													<p class="leading-7 text-gray-900">Address</p>
													<p class="font-semibold text-gray-700">
														2045 W Jackson Blvd Chicago, Illinois(IL), 60612
													</p>
												</div>

												<div class="flex justify-between items-center gap-2 text-sm">
													<p class="leading-7 text-gray-900">Email</p>
													<p class="font-semibold text-gray-700">
														JAdisonrhiel@gmail.com
													</p>
												</div>

												<div class="flex justify-between items-center gap-2 text-sm">
													<p class="leading-7 text-gray-900">Phone Number</p>
													<p class="font-semibold text-gray-700">
														(312) 455-9264
													</p>
												</div>
											</div>
										</div>
									</div>

									<!-- divider -->
									<Divider />

									<h3 class="text-gray-800 text-lg font-semibold mb-6">
										Payment Summary
									</h3>

									<!-- payment summary -->
									<div class="flex flex-col rounded">
										<div class="flex flex-col justify-center">
											<div class="flex justify-between items-center gap-2 text-sm">
												<p class="leading-7 text-gray-900">Delivery Cost</p>
												<p class="font-semibold text-gray-700">$560</p>
											</div>

											<div class="flex justify-between items-center gap-2 text-sm">
												<p class="leading-7 text-gray-900">Insurance</p>
												<p class="font-semibold text-gray-700">$20</p>
											</div>

											<div class="flex justify-between items-center gap-2 text-sm">
												<p class="leading-7 text-gray-900">Tax</p>
												<p class="font-semibold text-gray-700">$0</p>
											</div>

											<div
												class="flex justify-between items-center gap-2 text-sm border-t border-gray-100">
												<p class="leading-7 text-gray-900">Total</p>
												<p class="font-semibold text-gray-700">$580</p>
											</div>
										</div>
									</div>
								</div>
							</TabPanel>
						</TabPanels>
					</TabGroup>
				</div>
			</div>
		</div>
	</section>
</template>

<style scoped></style>
