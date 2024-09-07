<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { onMounted, ref } from "vue";

const route = useRoute();

const statistics = ref(null);

const chartOptions = ref();

const menu = ref();

const toggle = (event: any) => {
  menu.value.toggle(event);
};

const profileMenu = ref([
  {
    items: [
      {
        label: "Profile",
      },
      {
        label: "Change Password",
      },
      {
        label: "Logout",
      },
    ],
  },
]);
</script>
<template>
  <main class="flex h-full w-full font-inter">
    <Sidebar :user="{ name: 'Demola Alaofin' }" />

    <div class="flex w-full flex-col">
      <div class="root-layout">
        <NuxtLink to="" class="">
          <img
            src="/logo/logo.png"
            class="w-[100px] h-auto"
            alt="Verocity Logo"
          />
        </NuxtLink>
        <div>
          <button
            class="py-1 px-2 bg-transparent text-secondary flex md:hidden focus:outline-none"
          >
            <span class="sr-only">Open main menu</span>
            <svg
              class="w-6 h-6"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 17 14"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M1 1h15M1 7h15M1 13h15"
              />
            </svg>
          </button>
          <!-- <MobileNavbar :state="mobileNav" /> -->
        </div>
      </div>

      <header class="flex justify-between py-3 px-4">
        <div></div>
        <div class="right-bar relative flex items-center">
          <button type="button">
            <div class="flex items-center justify-center">
              <img src="/icons/bell.svg" alt="notification" />
            </div>
          </button>
          <Divider layout="vertical" />
          <div class="flex justify-center items-center gap-4">
            <button
              type="button"
              @click="toggle"
              aria-haspopup="true"
              aria-controls="overlay_menu"
            >
              <div class="flex items-center justify-center gap-2">
                <Avatar image="/testimony-icon.png" shape="circle" />
                <span>Gustavo Geidt</span>
              </div>
            </button>
            <Menu
              ref="menu"
              id="overlay_menu"
              :model="profileMenu"
              :popup="true"
            />
          </div>
        </div>
      </header>

      <section class="home bg-green-50 h-full">
        <div class="home-content container mx-auto">
          <slot></slot>
        </div>
      </section>
    </div>
  </main>
</template>
