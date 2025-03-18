<script>
import { defineComponent } from 'vue';
import { useRouter } from 'vue-router';
import Toolbar from 'primevue/toolbar';
import Menu from 'primevue/menu';

export default defineComponent({
  name: 'NavBar',
  components: {
    Toolbar,
    Menu
  },
  setup() {
    const router = useRouter();

    const handleSignIn = () => {
      router.push('/signin');
    };

    const handleSignUp = () => {
      router.push('/signup');
    };

    const navigateTo = (route) => {
      router.push(route);
    };

    return {
      handleSignIn,
      handleSignUp,
      navigateTo
    };
  }
});
</script>

<template>
  <div class="border-b border-gray-200 bg-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6">
      <div class="flex justify-between items-center py-4">
        <!-- Main Navigation Items -->
        <nav class="hidden md:flex space-x-8">
          <a @click="navigateTo('/')" class="text-gray-700 hover:text-green-600 text-sm font-medium cursor-pointer flex items-center">
            <i class="pi pi-home mr-1 text-sm"></i>
            <span>Home</span>
          </a>
          <a @click="navigateTo('/livestock')" class="text-gray-700 hover:text-green-600 text-sm font-medium cursor-pointer flex items-center">
            <i class="pi pi-box mr-1 text-sm"></i>
            <span>Livestock</span>
          </a>
          <a @click="navigateTo('/forums')" class="text-gray-700 hover:text-green-600 text-sm font-medium cursor-pointer flex items-center">
            <i class="pi pi-users mr-1 text-sm"></i>
            <span>forums</span>
          </a>
          <a @click="navigateTo('/about')" class="text-gray-700 hover:text-green-600 text-sm font-medium cursor-pointer flex items-center">
            <i class="pi pi-info-circle mr-1 text-sm"></i>
            <span>About Us</span>
          </a>
          <a @click="navigateTo('/mission')" class="text-gray-700 hover:text-green-600 text-sm font-medium cursor-pointer flex items-center">
            <i class="pi pi-compass mr-1 text-sm"></i>
            <span>Mission & Vision</span>
          </a>
        </nav>
        
        <!-- Auth Links -->
        <div class="flex items-center space-x-6">
          <a @click="handleSignIn" class="text-gray-700 hover:text-green-600 text-sm font-medium cursor-pointer">
            Sign In
          </a>
          <a @click="handleSignUp" class="bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium cursor-pointer hover:bg-green-700">
            Sign Up
          </a>
        </div>
      </div>
    </div>
  </div>
  
  <!-- Mobile Menu Button (only visible on small screens) -->
  <div class="md:hidden fixed bottom-4 right-4 z-50">
    <Menu :model="[
      { label: 'Home', icon: 'pi pi-home', command: () => navigateTo('/') },
      { label: 'Livestock', icon: 'pi pi-box', command: () => navigateTo('/livestock') },
      { label: 'Farmers', icon: 'pi pi-users', command: () => navigateTo('/forums') },
      { label: 'About Us', icon: 'pi pi-info-circle', command: () => navigateTo('/about') },
      { label: 'Mission & Vision', icon: 'pi pi-compass', command: () => navigateTo('/mission') }
    ]" :popup="true">
      <template #target>
        <button class="p-3 bg-green-600 rounded-full shadow-lg text-white hover:bg-green-700">
          <i class="pi pi-bars"></i>
        </button>
      </template>
    </Menu>
  </div>
</template>