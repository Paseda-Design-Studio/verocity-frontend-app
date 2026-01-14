<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">

// Add error boundary for route-related issues
onErrorCaptured((error) => {
  if (error.message?.includes('meta')) {
    console.error('Route meta error in admin layout:', error)
    return false // Prevent error propagation
  }
});

const menu = ref();
const sidebarOpen = ref(false);

const toggle = (event: any) => {
  menu.value.toggle(event);
};

const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value;
};

const closeSidebar = () => {
  sidebarOpen.value = false;
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
  <main class="admin-layout" :class="{ 'admin-layout--sidebar-open': sidebarOpen }">
    <!-- Rest of your template remains the same -->
    <div
      v-if="sidebarOpen"
      class="admin-layout__backdrop"
      @click="closeSidebar"
    ></div>
    
    <Sidebar
      :user="{ name: 'Demola Alaofin' }"
      class="admin-layout__sidebar"
      :class="{ 'admin-layout__sidebar--open': sidebarOpen }"
    />
    
    <div class="admin-layout__main">
      <header class="admin-layout__top-bar">
        <div class="admin-layout__left-section">
          <button
            class="admin-layout__mobile-toggle"
            @click="toggleSidebar"
            aria-label="Toggle sidebar"
          >
            <span class="sr-only">Open main menu</span>
            <svg
              class="admin-layout__hamburger"
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
        
        <div class="admin-layout__right-section">
          <div class="admin-layout__user-section">
            <button type="button" class="admin-layout__notification-btn">
              <div class="admin-layout__notification-icon">
                <img src="/icons/bell.svg" alt="notification" />
              </div>
            </button>
            <Divider layout="vertical" class="admin-layout__divider" />
            <div class="admin-layout__profile">
              <button
                type="button"
                @click="toggle"
                aria-haspopup="true"
                aria-controls="overlay_menu"
                class="admin-layout__profile-btn"
              >
                <div class="admin-layout__profile-content">
                  <Avatar image="/testimony-icon.png" shape="circle" />
                  <span class="admin-layout__profile-name">Gustavo Geidt</span>
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
        </div>
      </header>
      
      <section class="admin-layout__content">
        <div class="admin-layout__container">
          <slot></slot>
        </div>
      </section>
    </div>
  </main>
</template>

<!-- Your existing styles remain the same -->
<style lang="scss" scoped>
/* All your existing styles */
.admin-layout {
  display: flex;
  height: 100vh;
  font-family: 'Inter', sans-serif;
  position: relative;

  &__backdrop {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 999;
    display: none;
    @media (max-width: 1023px) {
      display: block;
    }
  }

  &__sidebar {
    flex-shrink: 0;
    @media (min-width: 1024px) {
      position: fixed;
      top: 0;
      left: 0;
      height: 100vh;
      width: 250px;
      z-index: 100;
    }
    @media (max-width: 1023px) {
      position: fixed;
      top: 0;
      left: 0;
      height: 100vh;
      width: 280px;
      z-index: 1000;
      transform: translateX(-100%);
      transition: transform 0.3s ease;
      &--open {
        transform: translateX(0);
      }
    }
  }

  &__main {
    flex: 1;
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    background-color: #ffffff;
    @media (min-width: 1024px) {
      margin-left: 250px;
    }
    @media (max-width: 1023px) {
      margin-left: 0;
      width: 100%;
    }
  }

  &__top-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.75rem 1.5rem;
    background-color: #ffffff;
    border-bottom: 1px solid #f3f4f6;
    min-height: 4rem;
    z-index: 50;
    @media (max-width: 767px) {
      padding: 0.75rem 1rem;
      min-height: 3.5rem;
    }
    @media (max-width: 639px) {
      padding: 0.5rem 0.75rem;
    }
  }

  &__left-section {
    display: flex;
    align-items: center;
    @media (min-width: 1024px) {
      visibility: hidden;
    }
  }

  &__right-section {
    display: flex;
    align-items: center;
    margin-left: auto;
  }

  &__mobile-toggle {
    padding: 0.5rem;
    background-color: transparent;
    color: #6b7280;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 0.375rem;
    transition: background-color 0.2s ease;
    &:hover {
      background-color: #f3f4f6;
    }
    &:focus {
      outline: none;
      background-color: #f3f4f6;
    }
    @media (min-width: 1024px) {
      display: none;
    }
  }

  &__hamburger {
    width: 1.25rem;
    height: 1.25rem;
    @media (max-width: 639px) {
      width: 1rem;
      height: 1rem;
    }
  }

  &__user-section {
    position: relative;
    display: flex;
    align-items: center;
    gap: 1rem;
    @media (max-width: 767px) {
      gap: 0.75rem;
    }
    @media (max-width: 639px) {
      gap: 0.5rem;
    }
  }

  &__notification-btn {
    background: none;
    border: none;
    cursor: pointer;
    padding: 0.5rem;
    border-radius: 0.375rem;
    transition: background-color 0.2s ease;
    &:hover {
      background-color: #f9fafb;
    }
    @media (max-width: 639px) {
      padding: 0.375rem;
    }
  }

  &__notification-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    img {
      width: 1.25rem;
      height: 1.25rem;
      @media (max-width: 639px) {
        width: 1rem;
        height: 1rem;
      }
    }
  }

  &__divider {
    @media (max-width: 639px) {
      display: none;
    }
  }

  &__profile {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  &__profile-btn {
    background: none;
    border: none;
    cursor: pointer;
    padding: 0.5rem;
    border-radius: 0.375rem;
    transition: background-color 0.2s ease;
    &:hover {
      background-color: #f9fafb;
    }
    @media (max-width: 639px) {
      padding: 0.25rem;
    }
  }

  &__profile-content {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    @media (max-width: 639px) {
      gap: 0.25rem;
    }
  }

  &__profile-name {
    font-size: 0.875rem;
    font-weight: 500;
    color: #374151;
    white-space: nowrap;
    @media (max-width: 767px) {
      display: none;
    }
  }

  &__content {
    flex: 1;
    background-color: #f8f9fa;
    overflow-y: auto;
    overflow-x: hidden;
  }

  &__container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 1.5rem;
    width: 100%;
    @media (max-width: 1023px) {
      max-width: none;
      padding: 1.25rem;
    }
    @media (max-width: 767px) {
      padding: 1rem;
    }
    @media (max-width: 639px) {
      padding: 0.75rem;
    }
  }
}

:deep(.p-divider-vertical) {
  height: 2rem;
  margin: 0 0.5rem;
  @media (max-width: 767px) {
    height: 1.5rem;
    margin: 0 0.25rem;
  }
}

:deep(.p-avatar) {
  width: 2rem;
  height: 2rem;
  @media (max-width: 639px) {
    width: 1.75rem;
    height: 1.75rem;
  }
}
</style>
