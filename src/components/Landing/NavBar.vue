<script>
import { defineComponent, ref, onMounted, onUnmounted, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import Menu from 'primevue/menu';
import Button from 'primevue/button';

export default defineComponent({
  name: 'NavBar',
  components: {
    Menu,
    Button
  },
  setup() {
    const router = useRouter();
    const route = useRoute();
    const showMobileMenu = ref(false);
    
    const handleSignIn = () => {
      router.push('/signin');
    };

    const handleSignUp = () => {
      router.push('/signup');
    };

    const navigateTo = (route) => {
      showMobileMenu.value = false;
      router.push(route);
    };
    
    // Function to check if a route is active
    const isActive = (path) => {
      if (path === '/' && route.path === '/') return true;
      if (path !== '/' && route.path.startsWith(path)) return true;
      return false;
    };
    
    // Close mobile menu when route changes
    onMounted(() => {
      router.afterEach(() => {
        showMobileMenu.value = false;
      });
    });
    
    return {
      showMobileMenu,
      handleSignIn,
      handleSignUp,
      navigateTo,
      isActive,
      currentRoute: computed(() => route.path)
    };
  }
});
</script>

<template>
  <div class="shadow-lg bg-white border-b border-gray-200">
    <div class="container mx-auto px-4">
      <div class="flex justify-between items-center h-16">
        <!-- Logo and Main Navigation -->
        <div class="flex items-center space-x-8">
          <div class="flex items-center space-x-2">
            <img src="/src/assets/vue.svg" alt="Logo" class="h-8 w-8" />
            <div class="font-bold text-xl text-green-600">LivestoX</div>
          </div>

          <nav class="hidden md:flex space-x-5">
            <a @click="navigateTo('/')" 
              :class="['nav-link text-gray-700 hover:text-green-600 px-3 py-2 rounded-md transition-all duration-300 flex items-center relative cursor-pointer', isActive('/') ? 'active-link' : '']">
              <i class="pi pi-home mr-2"></i> Home
              <span class="nav-indicator" :class="{ 'active': isActive('/') }"></span>
            </a>
            <a @click="navigateTo('/main/LivestockMarket')" 
              :class="['nav-link text-gray-700 hover:text-green-600 px-3 py-2 rounded-md transition-all duration-300 flex items-center relative cursor-pointer', isActive('/main/LivestockMarket') ? 'active-link' : '']">
              <i class="pi pi-list mr-2"></i> Livestocks Market
              <span class="nav-indicator" :class="{ 'active': isActive('/main/LivestockMarket') }"></span>
            </a>
            <a @click="navigateTo('/main/LivestockForum')" 
              :class="['nav-link text-gray-700 hover:text-green-600 px-3 py-2 rounded-md transition-all duration-300 flex items-center relative cursor-pointer', isActive('/forums') ? 'active-link' : '']">
              <i class="pi pi-users mr-2"></i> Forums
              <span class="nav-indicator" :class="{ 'active': isActive('/forums') }"></span>
            </a>
            <a @click="navigateTo('/about')" 
              :class="['nav-link text-gray-700 hover:text-green-600 px-3 py-2 rounded-md transition-all duration-300 flex items-center relative cursor-pointer', isActive('/about') ? 'active-link' : '']">
              <i class="pi pi-info-circle mr-2"></i> About Us
              <span class="nav-indicator" :class="{ 'active': isActive('/about') }"></span>
            </a>
            <a @click="navigateTo('/mission')" 
              :class="['nav-link text-gray-700 hover:text-green-600 px-3 py-2 rounded-md transition-all duration-300 flex items-center relative cursor-pointer', isActive('/mission') ? 'active-link' : '']">
              <i class="pi pi-compass mr-2"></i> Mission & Vision
              <span class="nav-indicator" :class="{ 'active': isActive('/mission') }"></span>
            </a>
          </nav>
        </div>

        <!-- Auth Links -->
        <div class="flex items-center space-x-4">
          <a @click="handleSignIn" 
            class="hidden md:flex text-gray-700 hover:text-green-600 px-3 py-2 rounded-md transition-all duration-300 text-sm font-medium cursor-pointer">
            Sign In
          </a>
          <a @click="handleSignUp" 
            class="hidden md:flex bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium cursor-pointer transition-all duration-300">
            Sign Up
          </a>
          
          <!-- Mobile Menu Button -->
          <Button icon="pi pi-bars"
            class="p-button-rounded p-button-text p-button-plain md:hidden hover:bg-blue-50 transition-colors duration-200"
            @click="showMobileMenu = !showMobileMenu" />
        </div>
      </div>

      <!-- Mobile Menu -->
      <div v-if="showMobileMenu"
        class="md:hidden py-4 border-t border-gray-200 bg-gray-50 rounded-b-lg shadow-inner">
        <div class="flex flex-col space-y-1 mt-2">
          <a @click="navigateTo('/')"
            :class="['text-gray-700 hover:text-blue-600 hover:bg-blue-50 px-4 py-3 flex items-center transition-colors duration-200 border-l-4 cursor-pointer', isActive('/') ? 'border-blue-500 text-blue-600 bg-blue-50' : 'border-transparent']">
            <i class="pi pi-home mr-3" :class="isActive('/') ? 'text-blue-500' : 'text-gray-500'"></i> Home
          </a>
          <a @click="navigateTo('/main/LivestockMarket')"
            :class="['text-gray-700 hover:text-blue-600 hover:bg-blue-50 px-4 py-3 flex items-center transition-colors duration-200 border-l-4 cursor-pointer', isActive('/main/LivestockMarket') ? 'border-blue-500 text-blue-600 bg-blue-50' : 'border-transparent']">
            <i class="pi pi-list mr-3" :class="isActive('/main/LivestockMarket') ? 'text-blue-500' : 'text-gray-500'"></i> Livestocks
          </a>
          <a @click="navigateTo('/forums')"
            :class="['text-gray-700 hover:text-blue-600 hover:bg-blue-50 px-4 py-3 flex items-center transition-colors duration-200 border-l-4 cursor-pointer', isActive('/forums') ? 'border-blue-500 text-blue-600 bg-blue-50' : 'border-transparent']">
            <i class="pi pi-users mr-3" :class="isActive('/forums') ? 'text-blue-500' : 'text-gray-500'"></i> Forums
          </a>
          <a @click="navigateTo('/about')"
            :class="['text-gray-700 hover:text-blue-600 hover:bg-blue-50 px-4 py-3 flex items-center transition-colors duration-200 border-l-4 cursor-pointer', isActive('/about') ? 'border-blue-500 text-blue-600 bg-blue-50' : 'border-transparent']">
            <i class="pi pi-info-circle mr-3" :class="isActive('/about') ? 'text-blue-500' : 'text-gray-500'"></i> About Us
          </a>
          <a @click="navigateTo('/mission')"
            :class="['text-gray-700 hover:text-blue-600 hover:bg-blue-50 px-4 py-3 flex items-center transition-colors duration-200 border-l-4 cursor-pointer', isActive('/mission') ? 'border-blue-500 text-blue-600 bg-blue-50' : 'border-transparent']">
            <i class="pi pi-compass mr-3" :class="isActive('/mission') ? 'text-blue-500' : 'text-gray-500'"></i> Mission & Vision
          </a>
          <div class="border-t border-gray-200 my-2"></div>
          <a @click="handleSignIn"
            class="text-gray-700 hover:text-blue-600 hover:bg-blue-50 px-4 py-3 flex items-center transition-colors duration-200 border-l-4 border-transparent hover:border-blue-500 cursor-pointer">
            <i class="pi pi-sign-in mr-3 text-gray-500"></i> Sign In
          </a>
          <a @click="handleSignUp"
            class="text-gray-700 hover:text-blue-600 hover:bg-blue-50 px-4 py-3 flex items-center transition-colors duration-200 border-l-4 border-transparent hover:border-blue-500 cursor-pointer">
            <i class="pi pi-user-plus mr-3 text-gray-500"></i> Sign Up
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Enhanced Navigation Links */
.nav-link {
  position: relative;
  overflow: hidden;
}

.nav-indicator {
  position: absolute;
  bottom: 0;
  left: 50%;
  height: 2px;
  width: 0;
  background: linear-gradient(to right, #16a34a, #4ade80);
  transform: translateX(-50%);
  transition: width 0.3s ease, box-shadow 0.3s ease;
}

.nav-link:hover .nav-indicator {
  width: 80%;
  box-shadow: 0 0 8px #16a34a, 0 0 15px rgba(22, 163, 74, 0.5);
}

/* Active state for normal links */
.active-link {
  color: #16a34a !important;
  font-weight: 500;
}

.nav-indicator.active {
  width: 80%;
  box-shadow: 0 0 8px #16a34a, 0 0 15px rgba(22, 163, 74, 0.5);
}

/* Legacy router-link active styles (keeping for compatibility) */
.router-link-active {
  color: #16a34a !important;
  font-weight: 500;
}

.router-link-active .nav-indicator {
  width: 80%;
  box-shadow: 0 0 8px #16a34a, 0 0 15px rgba(22, 163, 74, 0.5)
}

/* Transition for icons and buttons */
.pi {
  transition: transform 0.2s ease;
}

button:hover .pi {
  transform: scale(1.1);
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .p-menu {
    width: 100vw !important;
    max-width: 100vw;
  }
}
</style>