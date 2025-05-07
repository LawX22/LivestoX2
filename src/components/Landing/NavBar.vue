<script lang="ts">
import { defineComponent, ref, onMounted, onUnmounted } from 'vue';
import { useRouter, useRoute, RouteLocationRaw } from 'vue-router';
import Menu from 'primevue/menu';
import Avatar from 'primevue/avatar';
import Button from 'primevue/button';
import Tooltip from 'primevue/tooltip';
import Badge from 'primevue/badge';

export default defineComponent({
  name: 'NavBar',
  components: {
    Menu,
    Avatar,
    Button,
    Badge
  },
  directives: {
    tooltip: Tooltip, // Register Tooltip directive
  },
  setup() {
    const router = useRouter();
    const route = useRoute();
    
    const handleSignIn = (): void => {
      router.push('/signin');
    };

    const handleSignUp = (): void => {
      router.push('/signup');
    };

    const navigateTo = (path: RouteLocationRaw): void => {
      router.push(path);
    };
    
    return {
      handleSignIn,
      handleSignUp,
      navigateTo,
      route
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

          <nav class="flex space-x-5">
            <router-link to="/"
              class="nav-link text-gray-700 hover:text-green-600 px-3 py-2 rounded-md transition-all duration-300 flex items-center relative">
              <i class="pi pi-home mr-2"></i> Home
              <span class="nav-indicator"></span>
            </router-link>
            <router-link to="/main/LivestockMarket"
              class="nav-link text-gray-700 hover:text-green-600 px-3 py-2 rounded-md transition-all duration-300 flex items-center relative">
              <i class="pi pi-shopping-cart mr-2"></i> Market
              <span class="nav-indicator"></span>
            </router-link>
            <router-link to="/main/LivestockForum"
              class="nav-link text-gray-700 hover:text-green-600 px-3 py-2 rounded-md transition-all duration-300 flex items-center relative">
              <i class="pi pi-users mr-2"></i> Forum
              <span class="nav-indicator"></span>
            </router-link>
            <router-link to="/about"
              class="nav-link text-gray-700 hover:text-green-600 px-3 py-2 rounded-md transition-all duration-300 flex items-center relative">
              <i class="pi pi-info-circle mr-2"></i> About Us
              <span class="nav-indicator"></span>
            </router-link>
            <router-link to="/mission"
              class="nav-link text-gray-700 hover:text-green-600 px-3 py-2 rounded-md transition-all duration-300 flex items-center relative">
              <i class="pi pi-compass mr-2"></i> Mission & Vision
              <span class="nav-indicator"></span>
            </router-link>
          </nav>
        </div>

        <!-- Right Side - Auth Links -->
        <div class="flex items-center space-x-4">
          <button @click="handleSignIn"
            class="text-gray-700 hover:text-green-600 px-3 py-2 rounded-md transition-all duration-300 text-sm font-medium cursor-pointer">
            Sign In
          </button>
          <button @click="handleSignUp"
            class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium cursor-pointer transition-all duration-300">
            Sign Up
          </button>
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

.router-link-active {
  color: #16a34a !important;
  font-weight: 500;
}

.router-link-active .nav-indicator {
  width: 80%;
  box-shadow: 0 0 8px #16a34a, 0 0 15px rgba(22, 163, 74, 0.5);
}
</style>