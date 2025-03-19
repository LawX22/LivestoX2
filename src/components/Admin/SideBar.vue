<script lang="ts">
import { defineComponent, ref, watch, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';

export default defineComponent({
  name: 'AdminSidebar',
  props: {
    collapsed: {
      type: Boolean,
      default: false
    }
  },
  setup(props, { emit }) {
    const router = useRouter();
    const route = useRoute();
    const isCollapsed = ref(props.collapsed);

    // Load collapsed state from localStorage on component mount
    onMounted(() => {
      const savedState = localStorage.getItem('sidebarCollapsed');
      if (savedState !== null) {
        isCollapsed.value = savedState === 'true';
        // Emit the initial state to parent component
        emit('collapse-change', isCollapsed.value);
      }
    });

    const toggleSidebar = () => {
      isCollapsed.value = !isCollapsed.value;
      // Save state to localStorage whenever it changes
      localStorage.setItem('sidebarCollapsed', isCollapsed.value.toString());
      emit('collapse-change', isCollapsed.value);
    };

    const navigateTo = (route: string) => {
      router.push(route);
    };

    // Menu items with icons and routes
    const menuItems = ref([
      { 
        label: 'Dashboard', 
        icon: 'pi pi-home', 
        route: '/admin/adminDashboard',
        active: false
      },
      { 
        label: 'User Management', 
        icon: 'pi pi-cog', 
        route: '/admin/userManagement',
        active: false
      }
    ]);

    // Function to update active state of menu items
    const updateActiveMenu = () => {
      menuItems.value.forEach(item => {
        item.active = item.route === route.path;
      });
    };

    // Watch for route changes and update active menu
    watch(() => route.path, updateActiveMenu, { immediate: true });

    return {
      isCollapsed,
      toggleSidebar,
      navigateTo,
      menuItems,
      logoPath: "/src/assets/vue.svg" // Same logo path from your sign-in page
    };
  }
});
</script>

<template>
  <div
    class="admin-sidebar h-screen bg-white shadow-lg flex flex-col transition-all duration-300"
    :class="isCollapsed ? 'w-20' : 'w-64'"
  >
    <!-- Logo and Brand -->
    <div class="flex items-center p-4" :class="isCollapsed ? 'justify-center' : 'justify-between'">
      <div class="flex items-center gap-3" v-if="!isCollapsed">
        <div class="bg-green-500 bg-opacity-20 p-2 rounded-full">
          <img :src="logoPath" alt="LivestoX" class="w-8 h-8 object-contain" />
        </div>
        <span class="font-bold text-xl text-green-700">LivestoX</span>
      </div>
      <div class="bg-green-500 bg-opacity-20 p-2 rounded-full" v-else>
        <img :src="logoPath" alt="LivestoX" class="w-8 h-8 object-contain" />
      </div>
      
      <button 
        @click="toggleSidebar" 
        class="text-gray-500 hover:text-green-700 transition-colors"
        :class="isCollapsed ? 'hidden' : ''"
      >
        <i class="pi pi-chevron-left"></i>
      </button>
    </div>

    <!-- Toggle button when collapsed -->
    <button 
      v-if="isCollapsed" 
      @click="toggleSidebar" 
      class="text-gray-500 hover:text-green-700 transition-colors text-center my-2"
    >
      <i class="pi pi-chevron-right"></i>
    </button>

    <!-- Divider -->
    <div class="border-b border-gray-200 my-2"></div>

    <!-- Navigation Menu -->
    <div class="flex-1 overflow-y-auto py-4">
      <ul class="space-y-2 px-4">
        <li v-for="(item, index) in menuItems" :key="index">
          <a 
            href="#" 
            class="flex items-center p-3 rounded-lg transition-all duration-200"
            :class="item.active 
              ? 'bg-green-100 text-green-700' 
              : 'text-gray-600 hover:bg-green-50 hover:text-green-700'"
            @click.prevent="navigateTo(item.route)"
          >
            <i :class="item.icon" class="text-lg" :style="{ minWidth: '24px' }"></i>
            <span class="ml-3 font-medium truncate" v-if="!isCollapsed">{{ item.label }}</span>
          </a>
        </li>
      </ul>
    </div>

    <!-- User Profile Section -->
    <div class="border-t border-gray-200 p-4">
      <div class="flex items-center" :class="isCollapsed ? 'justify-center' : ''">
        <div class="flex-shrink-0">
          <div class="w-10 h-10 rounded-full bg-green-500 bg-opacity-20 flex items-center justify-center text-green-700">
            <i class="pi pi-user"></i>
          </div>
        </div>
        <div class="ml-3" v-if="!isCollapsed">
          <p class="text-sm font-medium text-gray-700">Admin User</p>
          <p class="text-xs text-gray-500">admin@livestox.com</p>
        </div>
      </div>
      <div class="mt-4 flex justify-center" v-if="!isCollapsed">
        <button 
          class="w-full flex items-center justify-center gap-2 text-red-600 hover:text-red-800 text-sm font-medium transition-colors"
        >
          <i class="pi pi-sign-out"></i>
          <span>Sign Out</span>
        </button>
      </div>
      <div class="mt-4 flex justify-center" v-else>
        <button class="text-red-600 hover:text-red-800 transition-colors">
          <i class="pi pi-sign-out"></i>
        </button>
      </div>
    </div>
  </div>
</template>