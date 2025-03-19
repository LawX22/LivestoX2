<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import SideBar from '../../components/Admin/SideBar.vue';
import Button from 'primevue/button';
import Toast from 'primevue/toast';
import ConfirmDialog from 'primevue/confirmdialog';
import Card from 'primevue/card';
import UserTable from '../../components/Admin/UserTable.vue';
import UserDetailsDialog from '../../components/Admin/UserDetailsDialog.vue';
import BanUserDialog from '../../components/Admin/BanUserDialog.vue';

interface User {
  id: number;
  name: string;
  email: string;
  status: 'active' | 'inactive' | 'pending' | 'banned';
  type: 'buyer' | 'seller';
  registrationDate: string;
  lastActive: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  postalCode: string;
  ordersPlaced?: number;
  productsListed?: number;
  revenue?: number;
  avatarUrl: string;
  verificationStatus: 'verified' | 'unverified' | 'pending' ;
}

export default defineComponent({
  name: 'UserManagement',
  components: {
    SideBar,
    Button,
    Toast,
    ConfirmDialog,
    Card,
    UserTable,
    UserDetailsDialog,
    BanUserDialog
  },
  setup() {
    const sidebarCollapsed = ref(false);
    const users = ref<User[]>([]);
    const selectedUser = ref<User | null>(null);
    const showUserDetails = ref(false);
    const showBanDialog = ref(false);
    const loading = ref(true);
    const userStats = ref({
      totalUsers: 0,
      activeUsers: 0,
      newUsersToday: 0,
      bannedUsers: 0
    });

    // Mock user data with more details
    const mockUsers: User[] = [
      {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        status: 'active',
        type: 'buyer',
        registrationDate: '2024-01-15',
        lastActive: '2025-03-18',
        phone: '+1 (555) 123-4567',
        address: '123 Main Street',
        city: 'San Francisco',
        country: 'USA',
        postalCode: '94105',
        ordersPlaced: 24,
        avatarUrl: '/api/placeholder/40/40',
        verificationStatus: 'verified'
      },
      {
        id: 2,
        name: 'Alice Smith',
        email: 'alice@example.com',
        status: 'inactive',
        type: 'seller',
        registrationDate: '2023-11-10',
        lastActive: '2024-12-25',
        phone: '+44 7700 900123',
        address: '45 Oxford Road',
        city: 'London',
        country: 'UK',
        postalCode: 'W1D 3QX',
        ordersPlaced: 58,
        avatarUrl: '/api/placeholder/40/40',
        verificationStatus: 'pending'
      },
      {
        id: 3,
        name: 'Carlos Mendoza',
        email: 'carlos@example.com',
        status: 'active',
        type: 'buyer',
        registrationDate: '2024-05-22',
        lastActive: '2025-03-15',
        phone: '+52 55 1234 5678',
        address: 'Av. Insurgentes 450',
        city: 'Mexico City',
        country: 'Mexico',
        postalCode: '03100',
        ordersPlaced: 10,
        avatarUrl: '/api/placeholder/40/40',
        verificationStatus: 'verified'
      },
      {
        id: 4,
        name: 'Sophia Lee',
        email: 'sophia@example.com',
        status: 'banned',
        type: 'seller',
        registrationDate: '2022-09-30',
        lastActive: '2024-11-12',
        phone: '+82 2-3456-7890',
        address: '123 Gangnam Street',
        city: 'Seoul',
        country: 'South Korea',
        postalCode: '06000',
        ordersPlaced: 120,
        avatarUrl: '/api/placeholder/40/40',
        verificationStatus: 'pending'
      },
      {
        id: 5,
        name: 'Liam O\'Connor',
        email: 'liam@example.com',
        status: 'active',
        type: 'seller',
        registrationDate: '2021-07-19',
        lastActive: '2025-03-19',
        phone: '+353 1 234 5678',
        address: '78 Dublin Street',
        city: 'Dublin',
        country: 'Ireland',
        postalCode: 'D02 XY45',
        ordersPlaced: 0,
        avatarUrl: '/api/placeholder/40/40',
        verificationStatus: 'verified'
      }

    ];

    const handleSidebarCollapse = (collapsed: boolean) => {
      sidebarCollapsed.value = collapsed;
    };

    const viewUserDetails = (user: User) => {
      selectedUser.value = { ...user }; // Create a copy to avoid direct mutations
      showUserDetails.value = true;
    };

    const openBanDialog = () => {
      if (selectedUser.value) {
        showBanDialog.value = true;
      }
    };

    const confirmBanUser = () => {
      if (selectedUser.value) {
        // In a real app, you would call an API to ban the user
        const userId = selectedUser.value.id;
        const userIndex = users.value.findIndex(u => u.id === userId);

        if (userIndex !== -1) {
          // Update local state
          users.value[userIndex].status = 'banned';

          // Update the selected user to reflect the change
          selectedUser.value.status = 'banned';

          // Update stats
          userStats.value.bannedUsers++;
          userStats.value.activeUsers--;
        }

        // Close the confirmation dialog
        showBanDialog.value = false;
      }
    };

    const handleBanUser = (user: User) => {
      selectedUser.value = { ...user };
      openBanDialog();
    };

    const reactivateAccount = () => {
      if (selectedUser.value && selectedUser.value.status === 'banned') {
        // In a real app, you would call an API to reactivate the user
        const userId = selectedUser.value.id;
        const userIndex = users.value.findIndex(u => u.id === userId);

        if (userIndex !== -1) {
          // Update local state
          users.value[userIndex].status = 'active';

          // Update the selected user to reflect the change
          selectedUser.value.status = 'active';

          // Update stats
          userStats.value.bannedUsers--;
          userStats.value.activeUsers++;
        }
      }
    };

    const calculateStats = (users: User[]) => {
      const today = new Date().toISOString().split('T')[0];

      userStats.value = {
        totalUsers: users.length,
        activeUsers: users.filter(u => u.status === 'active').length,
        newUsersToday: users.filter(u => u.registrationDate === today).length,
        bannedUsers: users.filter(u => u.status === 'banned').length
      };
    };

    onMounted(() => {
      // Simulate API call with a delay
      setTimeout(() => {
        users.value = mockUsers;
        loading.value = false;
        calculateStats(mockUsers);
      }, 600);
    });

    return {
      sidebarCollapsed,
      handleSidebarCollapse,
      users,
      selectedUser,
      showUserDetails,
      showBanDialog,
      loading,
      viewUserDetails,
      openBanDialog,
      confirmBanUser,
      handleBanUser,
      reactivateAccount,
      userStats
    };
  }
});
</script>

<template>
  <div class="flex h-screen bg-gray-100">
    <!-- Sidebar -->
    <SideBar :collapsed="sidebarCollapsed" @collapse-change="handleSidebarCollapse" />

    <!-- Main Content -->
    <div class="flex-1 transition-all duration-300 ease-in-out overflow-auto"
      :class="{ 'ml-1': sidebarCollapsed, 'ml-2': !sidebarCollapsed }">
      <Toast position="top-right" />
      <ConfirmDialog />

      <div class="p-6">
        <!-- Page Header -->
        <div class="mb-6 flex justify-between items-center">
          <div>
            <h1 class="text-3xl font-bold text-gray-800">User Management</h1>
            <p class="text-gray-500 mt-1">View, search, and manage user accounts</p>
          </div>
        </div>

        <!-- Stats Cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div class="bg-white rounded-xl shadow-sm p-4 border-l-4 border-blue-500">
            <div class="flex justify-between items-center">
              <div>
                <div class="text-sm text-gray-500">Total Users</div>
                <div class="text-2xl font-bold mt-1">{{ userStats.totalUsers }}</div>
              </div>
              <div class="bg-blue-100 p-3 rounded-full">
                <i class="pi pi-users text-blue-500 text-xl"></i>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-xl shadow-sm p-4 border-l-4 border-green-500">
            <div class="flex justify-between items-center">
              <div>
                <div class="text-sm text-gray-500">Active Users</div>
                <div class="text-2xl font-bold mt-1">{{ userStats.activeUsers }}</div>
              </div>
              <div class="bg-green-100 p-3 rounded-full">
                <i class="pi pi-check-circle text-green-500 text-xl"></i>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-xl shadow-sm p-4 border-l-4 border-purple-500">
            <div class="flex justify-between items-center">
              <div>
                <div class="text-sm text-gray-500">New Users Today</div>
                <div class="text-2xl font-bold mt-1">{{ userStats.newUsersToday }}</div>
              </div>
              <div class="bg-purple-100 p-3 rounded-full">
                <i class="pi pi-plus-circle text-purple-500 text-xl"></i>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-xl shadow-sm p-4 border-l-4 border-red-500">
            <div class="flex justify-between items-center">
              <div>
                <div class="text-sm text-gray-500">Banned Users</div>
                <div class="text-2xl font-bold mt-1">{{ userStats.bannedUsers }}</div>
              </div>
              <div class="bg-red-100 p-3 rounded-full">
                <i class="pi pi-ban text-red-500 text-xl"></i>
              </div>
            </div>
          </div>
        </div>

        <!-- Main Card -->
        <Card class="rounded-xl shadow-md">
          <template #content>
            <!-- User Table Component -->
            <UserTable :users="users" :loading="loading" @view-user="viewUserDetails" @ban-user="handleBanUser" />
          </template>
        </Card>
      </div>
    </div>

    <!-- Refactored Dialogs -->
    <UserDetailsDialog v-model:visible="showUserDetails" :user="selectedUser" @ban-user="openBanDialog"
      @reactivate-account="reactivateAccount" />

    <BanUserDialog v-model:visible="showBanDialog" :user="selectedUser" @confirm-ban="confirmBanUser" />
  </div>
</template>