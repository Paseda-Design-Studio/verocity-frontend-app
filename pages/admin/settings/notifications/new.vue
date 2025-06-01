<script setup lang="ts">
	definePageMeta({
		layout: 'admin',
	});

  const checked = ref(false);

</script>

<template>
	<header class="home-header !gap-0">
		<NuxtLink
			to="/admin/settings/notifications"
			class="flex gap-2 items-center"
		>
			<span
				class="flex justify-center items-center border border-[#D0D5DD] p-0.5"
			>
				<img src="/icons/arrow-left.svg" />
			</span>
			Back
		</NuxtLink>
	</header>

	<Divider />

	<section class="rounded-lg bg-white p-3">
		<h1 class="header-box-title !text-2xl">New Notifications</h1>

		<Divider />

		<form
			action=""
			method="post"
			class="max-w-2xl"
		>
			<!-- subject -->
			<div class="flex gap-4 mb-6">
				<label
					for="processing"
					class="font-semibold w-36"
					>Subject</label
				>
				<InputText
					id="processing"
					class="flex-auto"
					autocomplete="off"
					placeholder="Shipment Processing"
				/>
			</div>

			<!-- recipient -->
			<div class="flex gap-4 mb-6">
				<label
					for="recipient"
					class="font-semibold w-36"
					>Recipient</label
				>
				<InputText
					id="recipient"
					class="flex-auto"
					autocomplete="off"
					placeholder="Recipient Name"
				/>
			</div>

			<!-- email heading -->
			<div class="flex gap-4 mb-6">
				<label
					for="email"
					class="font-semibold w-36"
					>Email Heading</label
				>
				<InputText
					id="email"
					class="flex-auto"
					type="email"
					autocomplete="off"
					placeholder="Your Shipment (Shipment ID) is been processed"
				/>
			</div>

			<!-- content -->
			<div class="flex gap-4 mb-6">
				<label
					for="content"
					class="font-semibold w-36"
					>Additional Content</label
				>
				<Textarea
					id="content"
					class="flex-auto"
					type="content"
					autocomplete="off"
					rows="5"
				/>
			</div>

			<!-- email notification -->
			<div class="flex gap-4 mb-6">
				<p class="font-semibold w-36">Email Notification</p>
				<div class="flex items-center">
					<Checkbox
						inputId="email_notification"
						name="email_notification"
            v-model="checked"
					/>
					<label
						for="email_notification"
						class="ml-2"
					>
						Enable for email notification
					</label>
				</div>
			</div>

      <div class="flex gap-4 mb-6">
				<p class="font-semibold w-36">In App Notification</p>
				<div class="flex items-center">
					<Checkbox
						inputId="app_notification"
						name="app_notification"
            v-model="checked"
					/>
					<label
						for="app_notification"
						class="ml-2"
					>
						Enable for  in app notification
					</label>
				</div>
			</div>
		</form>

    <Divider/>

    <div class="flex justify-between items-center gap-2">
			<Button
				class="bg-white text-gray-900 border border-[#D0D5DD] focus:outline-none py-3 px-5 rounded-md"
				>Cancel
			</Button>
			<Button
				class="bg-primary-600 text-white focus:outline-none py-3 px-5 rounded-md"
				>Save
			</Button>
		</div>
	</section>

</template>

<style scoped></style>
