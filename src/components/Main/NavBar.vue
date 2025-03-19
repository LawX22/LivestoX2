<script setup>
import { ref } from 'vue';
import Menubar from 'primevue/menubar';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import Badge from 'primevue/badge';
import Avatar from 'primevue/avatar';
import Menu from 'primevue/menu';
import Toast from 'primevue/toast';
import { useToast } from 'primevue/usetoast';

const searchQuery = ref('');
const toast = useToast();
const profileMenu = ref();
const notificationMenu = ref();
const savedItems = ref(3);
const cartItems = ref(2);
const notifications = ref(5);

const showProfile = (event) => {
  profileMenu.value.toggle(event);
};

const showNotifications = (event) => {
  notificationMenu.value.toggle(event);
};

const profileItems = [
  { 
    label: 'View Profile',
    icon: 'pi pi-user',
    command: () => toast.add({ severity: 'info', summary: 'Profile', detail: 'Profile page opened', life: 3000 })
  },
  { 
    label: 'Buyer History',
    icon: 'pi pi-history',
    command: () => toast.add({ severity: 'info', summary: 'Navigate', detail: 'Buyer History page', life: 3000 })
  },
  { 
    label: 'Upgrade to Seller',
    icon: 'pi pi-arrow-up',
    command: () => toast.add({ severity: 'info', summary: 'Upgrade', detail: 'Upgrade page opened', life: 3000 })
  },
  { separator: true },
  { 
    label: 'Logout',
    icon: 'pi pi-sign-out',
    command: () => toast.add({ severity: 'info', summary: 'Logout', detail: 'Logging out...', life: 3000 })
  }
];

const notificationItems = [
  { 
    label: 'Price drop on Angus Cattle',
    icon: 'pi pi-dollar',
    command: () => toast.add({ severity: 'info', summary: 'Price Alert', detail: 'Viewing price drop', life: 3000 })
  },
  { 
    label: 'New message from seller',
    icon: 'pi pi-envelope',
    command: () => toast.add({ severity: 'info', summary: 'Message', detail: 'Opening messages', life: 3000 })
  },
  { 
    label: 'Special deal: Premium Cattle',
    icon: 'pi pi-tag',
    command: () => toast.add({ severity: 'info', summary: 'Special Deal', detail: 'Viewing special deal', life: 3000 })
  }
];

const menuItems = ref([
  {
    label: 'Home',
    icon: 'pi pi-home',
    command: () => toast.add({ severity: 'info', summary: 'Navigate', detail: 'Home page', life: 3000 })
  },
  {
    label: 'Seller Directory',
    icon: 'pi pi-users',
    command: () => toast.add({ severity: 'info', summary: 'Navigate', detail: 'Seller Directory page', life: 3000 })
  },
  {
    label: 'Forum',
    icon: 'pi pi-comments',
    command: () => toast.add({ severity: 'info', summary: 'Navigate', detail: 'Forum page', life: 3000 })
  },
  {
    label: 'Help Center',
    icon: 'pi pi-question-circle',
    command: () => toast.add({ severity: 'info', summary: 'Navigate', detail: 'Help center page', life: 3000 })
  }
]);
</script>

<template>
  <div class="navbar-container">
    <Toast />
    
    <Menubar :model="menuItems" class="livestox-navbar">
      <!-- Logo and Brand -->
      <template #start>
        <div class="flex align-items-center">
          <div class="brand-logo-container">
            <i class="pi pi-box livestox-logo"></i>
          </div>
          <h1 class="brand-name">LivestoX</h1>
        </div>
      </template>
      
      <!-- Right side navigation elements -->
      <template #end>
        <div class="flex align-items-center gap-3">
          <!-- Search -->
          <span class="p-input-icon-left search-container">
            <i class="pi pi-search" />
            <InputText v-model="searchQuery" placeholder="Search livestock..." class="livestox-search" />
          </span>
          
          <!-- Messages -->
          <Button icon="pi pi-comments" class="p-button-rounded p-button-text p-button-lg livestox-button" 
            v-tooltip.bottom="'Messages'" />
          
          <!-- Saved Listings -->
          <div class="relative">
            <Button icon="pi pi-bookmark" class="p-button-rounded p-button-text p-button-lg livestox-button" 
              v-tooltip.bottom="'Saved Listings'">
              <Badge v-if="savedItems > 0" :value="savedItems" class="livestox-badge" />
            </Button>
          </div>
          
          <!-- Notifications -->
          <div class="relative">
            <Button icon="pi pi-bell" class="p-button-rounded p-button-text p-button-lg livestox-button"
              v-tooltip.bottom="'Notifications'" @click="showNotifications">
              <Badge v-if="notifications > 0" :value="notifications" class="livestox-badge" />
            </Button>
            <Menu ref="notificationMenu" :model="notificationItems" :popup="true" />
          </div>
          
          <!-- Cart / My Orders -->
          <div class="relative">
            <Button icon="pi pi-shopping-cart" class="p-button-rounded p-button-text p-button-lg livestox-button"
              v-tooltip.bottom="'My Orders'">
              <Badge v-if="cartItems > 0" :value="cartItems" class="livestox-badge" />
            </Button>
          </div>
          
          <!-- Profile Menu -->
          <Avatar icon="pi pi-user" class="livestox-avatar cursor-pointer" @click="showProfile" 
            v-tooltip.bottom="'My Profile'" />
          <Menu ref="profileMenu" :model="profileItems" :popup="true" />
        </div>
      </template>
    </Menubar>
  </div>
</template>

<style scoped>
.navbar-container {
  width: 100%;
}

.livestox-navbar {
  background: linear-gradient(to right, #E8F5E9, #C8E6C9);
  border: none;
  border-radius: 0;
  padding: 0.85rem 2rem;
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.15);
}

.brand-logo-container {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #4CAF50;
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  margin-right: 0.75rem;
  box-shadow: 0 2px 8px rgba(76, 175, 80, 0.3);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.brand-logo-container:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.4);
}

.livestox-logo {
  font-size: 1.6rem;
  color: white;
}

.brand-name {
  background: linear-gradient(to right, #388E3C, #2E7D32);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  font-size: 1.8rem;
  margin: 0;
  font-weight: 700;
  letter-spacing: -0.5px;
}

/* Menu items */
:deep(.p-menubar-root-list > .p-menuitem > .p-menuitem-link) {
  color: #2E7D32;
  font-weight: 600;
  border-radius: 12px;
  padding: 0.75rem 1.5rem;
  margin: 0 0.5rem;
  transition: all 0.3s ease;
  background-color: rgba(255, 255, 255, 0.4);
  border: 1px solid rgba(76, 175, 80, 0.1);
}

:deep(.p-menubar-root-list > .p-menuitem > .p-menuitem-link:hover) {
  background-color: rgba(255, 255, 255, 0.7);
  transform: translateY(-3px);
  box-shadow: 0 4px 10px rgba(76, 175, 80, 0.2);
  border-color: rgba(76, 175, 80, 0.2);
}

:deep(.p-menubar-root-list > .p-menuitem > .p-menuitem-link .p-menuitem-icon) {
  color: #388E3C;
  margin-right: 0.5rem;
  font-size: 1.2rem;
}

:deep(.p-menubar-root-list > .p-menuitem > .p-menuitem-link .p-menuitem-text) {
  font-size: 1.05rem;
}

/* Search bar */
.search-container {
  position: relative;
  margin-right: 0.5rem;
}

.livestox-search {
  min-width: 280px;
  border-radius: 30px;
  padding: 0.85rem 0.75rem 0.85rem 2.5rem;
  background-color: rgba(255, 255, 255, 0.7);
  border: 1px solid rgba(76, 175, 80, 0.2);
  font-size: 1rem;
  transition: all 0.2s ease;
}

.livestox-search:hover {
  background-color: rgba(255, 255, 255, 0.9);
  box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.1);
}

:deep(.p-inputtext:enabled:focus) {
  box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.2);
  border-color: #4CAF50;
  background-color: #FFFFFF;
}

/* Icons and buttons */
.livestox-button {
  background-color: rgba(200, 230, 201, 0.5);
  color: #2E7D32;
  border: none;
  width: 3rem;
  height: 3rem;
  box-shadow: 0 2px 6px rgba(76, 175, 80, 0.1);
  transition: all 0.2s ease;
  position: relative;
}

.livestox-button:hover {
  background-color: rgba(200, 230, 201, 0.9) !important;
  color: #2E7D32 !important;
  transform: translateY(-3px);
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.25) !important;
}

.livestox-button:active {
  transform: translateY(-1px);
  box-shadow: 0 2px 6px rgba(76, 175, 80, 0.2) !important;
}

:deep(.p-button-icon) {
  font-size: 1.2rem;
}

/* Badge styling */
.livestox-badge {
  background: linear-gradient(135deg, #FF9800, #F57C00);
  font-size: 0.75rem;
  min-width: 1.4rem;
  height: 1.4rem;
  position: absolute;
  top: -6px;
  right: -6px;
  box-shadow: 0 2px 4px rgba(245, 124, 0, 0.3);
  font-weight: 700;
  border: 2px solid white;
}

/* Avatar */
.livestox-avatar {
  background: linear-gradient(135deg, #81C784, #4CAF50);
  color: white;
  cursor: pointer;
  transition: all 0.2s ease;
  width: 3rem;
  height: 3rem;
  box-shadow: 0 2px 8px rgba(76, 175, 80, 0.25);
  font-size: 1.2rem;
}

.livestox-avatar:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 12px rgba(76, 175, 80, 0.3);
}

/* Dropdown menus */
:deep(.p-menu) {
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(76, 175, 80, 0.2);
  border: none;
  padding: 0.5rem;
  background-color: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
}

:deep(.p-menu .p-menuitem-link) {
  padding: 0.85rem 1.25rem;
  border-radius: 8px;
  transition: all 0.2s;
}

:deep(.p-menu .p-menuitem-link:hover) {
  background-color: rgba(200, 230, 201, 0.5);
}

:deep(.p-menu .p-menuitem-icon) {
  color: #4CAF50;
  font-size: 1.1rem;
  margin-right: 0.75rem;
}

:deep(.p-menu .p-menuitem-text) {
  color: #2E7D32;
  font-weight: 500;
}

/* Responsive adjustments */
@media screen and (max-width: 960px) {
  .livestox-search {
    min-width: 220px;
  }
  
  :deep(.p-menubar-root-list > .p-menuitem > .p-menuitem-link) {
    padding: 0.7rem 1.2rem;
    margin: 0 0.3rem;
  }
}

@media screen and (max-width: 768px) {
  .brand-name {
    font-size: 1.5rem;
  }
  
  :deep(.p-menubar-button) {
    color: #2E7D32;
    background-color: rgba(200, 230, 201, 0.5);
    border-radius: 10px;
    width: 2.8rem;
    height: 2.8rem;
    transition: all 0.2s ease;
  }
  
  :deep(.p-menubar-button:hover) {
    background-color: rgba(200, 230, 201, 0.9);
    box-shadow: 0 4px 10px rgba(76, 175, 80, 0.2);
  }
  
  :deep(.p-menubar-root-list) {
    background: linear-gradient(to bottom, #E8F5E9, #C8E6C9);
    border-radius: 0 0 12px 12px;
    padding: 0.75rem;
    box-shadow: 0 8px 16px rgba(76, 175, 80, 0.2);
  }
  
  :deep(.p-menubar-root-list > .p-menuitem) {
    margin: 0.5rem 0;
  }
  
  :deep(.p-menubar-root-list > .p-menuitem > .p-menuitem-link) {
    margin: 0;
    width: 100%;
    text-align: left;
  }
  
  .livestox-search {
    min-width: 180px;
  }
}

@media screen and (max-width: 576px) {
  .navbar-container {
    padding: 0;
  }
  
  .livestox-navbar {
    padding: 0.6rem 1.2rem;
  }
  
  .brand-logo-container {
    width: 2.5rem;
    height: 2.5rem;
  }
  
  .livestox-logo {
    font-size: 1.3rem;
  }
  
  .brand-name {
    font-size: 1.3rem;
  }
  
  .livestox-search {
    min-width: 150px;
    font-size: 0.9rem;
    padding: 0.7rem 0.7rem 0.7rem 2.2rem;
  }
  
  .livestox-button,
  .livestox-avatar {
    width: 2.5rem;
    height: 2.5rem;
  }
  
  :deep(.p-button-icon) {
    font-size: 1rem;
  }
}
</style>