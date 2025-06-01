<script lang="ts" setup>
interface navItems {
  name: string;
  link: string;
}

const navs = ref<navItems[]>([
  { name: "FAQs", link: "/faqs" },
  { name: "About Us", link: "/about" },
  { name: "Contact Us", link: "/contact-us" },
]);

const authStore = useAuthStore();

// Single drawer state for user menu
const isDrawerOpen = ref(false);

const toggleDrawer = () => {
  isDrawerOpen.value = !isDrawerOpen.value;
};

const closeDrawer = () => {
  isDrawerOpen.value = false;
};

// Mobile menu state
const showDrawer = ref<boolean>(false);

const toggleMobileDrawer = () => {
  showDrawer.value = !showDrawer.value;
};

// Menu refs and items
const menu = ref();
const service = ref();

const items = ref([
  {
    items: [
      {
        label: "Refresh",
        icon: "pi pi-refresh",
      },
      {
        label: "Export",
        icon: "pi pi-upload",
      },
    ],
  },
]);

const ourServiceMenu = ref([
  {
    items: [
      {
        label: "Ship now",
      },
      {
        label: "Oversea shipping",
      },
      {
        label: "Get A Quote",
      },
    ],
  },
]);

const toggle = (event: any) => {
  menu.value.toggle(event);
};

const toggleServiceMenu = (event: any) => {
  service.value.toggle(event);
};

// Computed properties
const isLoggedIn = computed(() => !!authStore.user);

// User menu actions
const goToProfile = () => {
  closeDrawer();
  navigateTo("/user/profile");
};

const handleSignOut = async () => {
  closeDrawer();
  try {
    await authStore.logout();
    navigateTo("/auth/login");
  } catch (error) {
    console.error("Sign out error:", error);
  }
};

// Close drawer when clicking outside
onMounted(() => {
  const handleClickOutside = (event: Event) => {
    const target = event.target as Element;
    if (isDrawerOpen.value && !target.closest(".user-menu-container")) {
      closeDrawer();
    }
  };
  document.addEventListener("click", handleClickOutside);

  onUnmounted(() => {
    document.removeEventListener("click", handleClickOutside);
  });
});
</script>
<template>
  <header>
    <nav class="bg-white border-gray-200 md:fixed top-0 w-full z-50">
      <div
        class="lg:container flex flex-wrap items-center justify-between mx-auto p-4"
      >
        <NuxtLink to="/" class="flex items-center rtl:space-x-reverse">
          <img
            src="/logo/logo.png"
            class="w-[100px] h-auto"
            alt="Verocity Logo"
          />
        </NuxtLink>

        <div
          class="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse gap-4"
        >
          <template v-if="isLoggedIn">
            <div class="hidden md:flex justify-center items-center gap-4">
              <Button
                type="button"
                @click="toggle"
                aria-haspopup="true"
                size="small"
                severity="secondary"
                text
                aria-controls="overlay_menu"
              >
                <img src="/icons/email.svg" alt="" />
              </Button>
              <Menu ref="menu" id="overlay_menu" :model="items" :popup="true" />
            </div>

            <!-- User Menu Container -->
            <div class="relative user-menu-container">
              <div
                class="flex items-center justify-center gap-2 cursor-pointer hover:bg-gray-100 rounded-md p-2"
                @click="toggleDrawer"
              >
                <Avatar
                  v-if="authStore.user?.photoUrl"
                  :image="authStore.user?.photoUrl"
                  shape="circle"
                />
                <div
                  v-else
                  class="w-8 h-8 bg-secondary text-white font-semibold rounded-full flex items-center justify-center"
                >
                  {{ authStore.userInitial }}
                </div>
                <span>
                  {{
                    authStore.user?.firstName || authStore.user?.name || "User"
                  }}
                </span>
                <!-- Dropdown arrow -->
                <svg
                  class="w-4 h-4 transition-transform duration-200"
                  :class="{ 'rotate-180': isDrawerOpen }"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>

              <!-- User Dropdown Menu -->
              <Transition
                enter-active-class="transition ease-out duration-200"
                enter-from-class="opacity-0 scale-95"
                enter-to-class="opacity-100 scale-100"
                leave-active-class="transition ease-in duration-150"
                leave-from-class="opacity-100 scale-100"
                leave-to-class="opacity-0 scale-95"
              >
                <div
                  v-if="isDrawerOpen"
                  class="absolute right-0 top-full mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50"
                >
                  <!-- User Info Header -->
                  <div class="px-4 py-3 border-b border-gray-100">
                    <div class="flex items-center gap-3">
                      <Avatar
                        v-if="authStore.user?.photoUrl"
                        :image="authStore.user?.photoUrl"
                        shape="circle"
                        size="normal"
                      />
                      <div
                        v-else
                        class="w-10 h-10 bg-secondary text-white font-semibold rounded-full flex items-center justify-center text-sm"
                      >
                        {{ authStore.userInitial }}
                      </div>
                      <div class="flex-1 min-w-0">
                        <p class="text-sm font-medium text-gray-900 truncate">
                          {{ authStore.userFullName }}
                        </p>
                        <p class="text-sm text-gray-500 truncate">
                          {{ authStore.user?.email }}
                        </p>
                      </div>
                    </div>
                  </div>

                  <!-- Menu Items -->
                  <div class="py-1">
                    <!-- Profile Link -->
                    <button
                      @click="goToProfile"
                      class="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      <svg
                        class="w-4 h-4 mr-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                      View Profile
                    </button>

                    <!-- Divider -->
                    <div class="border-t border-gray-100 my-1"></div>

                    <!-- Sign Out -->
                    <button
                      @click="handleSignOut"
                      class="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <svg
                        class="w-4 h-4 mr-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                        />
                      </svg>
                      Sign Out
                    </button>
                  </div>
                </div>
              </Transition>
            </div>
          </template>

          <div v-else class="gap-4 hidden md:flex">
            <NuxtLink to="/auth/login">
              <Button
                label="Login"
                class="py-2 px-4 border-secondary rounded-md text-secondary focus:outline-none focus:ring-1 hover:bg-secondary-100"
                outlined
              />
            </NuxtLink>

            <NuxtLink to="/auth/register">
              <Button
                label="Sign Up"
                class="bg-primary-600 hover:bg-primary-700 focus:ring-1 text-white rounded-md focus:outline-none py-3 px-5"
              />
            </NuxtLink>
          </div>

          <button
            class="py-1 px-2 bg-transparent text-secondary flex md:hidden focus:outline-none"
            @click="toggleMobileDrawer"
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
        </div>

        <div
          class="items-center justify-between hidden w-full md:flex md:w-auto md:order-1"
          id="navbar-cta"
        >
          <ul
            class="flex flex-col font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700"
          >
            <li>
              <a
                href="#"
                @click="toggleServiceMenu"
                class="block py-3 px-2 rounded-md focus:outline-none text-gray-900 text-lg md:dark:text-gray-200 nav__link"
                aria-current="page"
                ><span>Our services</span></a
              >
              <Menu
                ref="service"
                id="overlay_menu"
                :model="ourServiceMenu"
                :popup="true"
              />
            </li>
            <li v-for="nav in navs" :key="nav.name">
              <NuxtLink
                :to="nav.link"
                class="block py-3 px-2 rounded-md focus:outline-none text-gray-900 text-lg md:dark:text-gray-200 nav__link"
                aria-current="page"
                ><span>{{ nav.name }}</span></NuxtLink
              >
            </li>
          </ul>
        </div>
      </div>
    </nav>

    <NavbarMobile
      :show-drawer="showDrawer"
      @toggle-drawer="toggleMobileDrawer"
    />
  </header>
</template>

<style>
.nav__link span {
  position: relative;
  transition: margin 0.4s;
}

.nav__link span::after {
  content: "";
  position: absolute;
  left: 0;
  bottom: -6px;
  width: 0;
  height: 2px;
  background-color: #c24121;
  transition: width 0.4s ease-out;
}

/* Animation link on hover */
/* .nav__link:hover span {
	margin-left: 2.5rem;
} */

.nav__link:hover span::after {
  width: 100%;
}

#overlay_menu {
  top: 84px !important;
  padding: 0;
}

#overlay_menu_0 {
  display: none !important;
}
</style>
