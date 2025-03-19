<script lang="ts">
import { defineComponent, PropType } from 'vue';
import Dialog from 'primevue/dialog';
import Avatar from 'primevue/avatar';
import Tag from 'primevue/tag';
import Button from 'primevue/button';
import TabView from 'primevue/tabview';
import TabPanel from 'primevue/tabpanel';
import Timeline from 'primevue/timeline';
import Textarea from 'primevue/textarea';
import Badge from 'primevue/badge';

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
  verificationStatus: 'verified' | 'unverified' | 'pending';
}

export default defineComponent({
  name: 'UserDetailsDialog',
  components: {
    Dialog,
    Avatar,
    Tag,
    Button,
    TabView,
    TabPanel,
    Timeline,
    Textarea,
    Badge
  },
  props: {
    visible: {
      type: Boolean,
      required: true
    },
    user: {
      type: Object as PropType<User | null>,
      default: null
    }
  },
  emits: ['update:visible', 'ban-user', 'reactivate-account'],
  setup(_, { emit }) {
    const closeDialog = () => {
      emit('update:visible', false);
    };

    const openBanDialog = () => {
      emit('ban-user');
    };

    const reactivateAccount = () => {
      emit('reactivate-account');
    };

    const getStatusSeverity = (status: string) => {
      switch (status) {
        case 'active': return 'success';
        case 'inactive': return 'warning';
        case 'pending': return 'info';
        case 'banned': return 'danger';
        default: return 'info';
      }
    };

    const getStatusIcon = (status: string) => {
      switch (status) {
        case 'active': return 'pi pi-check-circle';
        case 'inactive': return 'pi pi-clock';
        case 'pending': return 'pi pi-spin pi-spinner';
        case 'banned': return 'pi pi-ban';
        default: return 'pi pi-info-circle';
      }
    };

    const getTypeIcon = (type: string) => {
      return type === 'buyer' ? 'pi pi-shopping-cart' : 'pi pi-tag';
    };

    return {
      closeDialog,
      openBanDialog,
      reactivateAccount,
      getStatusSeverity,
      getStatusIcon,
      getTypeIcon
    };
  }
});
</script>

<template>
  <Dialog v-model:visible="visible" :style="{ width: '850px' }" :modal="true" :dismissableMask="true"
    :closeOnEscape="true" :showHeader="false" class="rounded-xl overflow-hidden user-details-dialog p-0">
    <div v-if="user" class="user-details">
      <!-- User Header -->
      <div class="relative overflow-hidden">
        <!-- Background Pattern -->
        <div class="absolute inset-0 bg-indigo-800 opacity-90">
          <div class="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-800"></div>
          <div class="absolute inset-0" style="background-image: url('data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z\' fill=\'%23ffffff\' fill-opacity=\'0.1\' fill-rule=\'evenodd\'/%3E%3C/svg%3E')"></div>
        </div>
        
        <!-- User Info -->
        <div class="relative p-8 text-white">
          <div class="flex items-center gap-6">
            <div class="relative">
              <Avatar :image="user.avatarUrl" size="xlarge" shape="circle" class="border-4 border-white shadow-lg" style="width: 100px; height: 100px;" />
              <span v-if="user.verificationStatus === 'verified'" class="absolute -bottom-1 -right-1 bg-blue-500 rounded-full p-1 shadow-md">
                <i class="pi pi-check-circle text-white"></i>
              </span>
            </div>
            <div class="flex-1">
              <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h2 class="text-2xl font-bold m-0">{{ user.name }}</h2>
                  <div class="opacity-90 flex items-center gap-2 mt-1">
                    <i class="pi pi-envelope text-sm"></i>
                    <span>{{ user.email }}</span>
                  </div>
                </div>
                <div class="flex gap-2">
                  <Tag :value="user.status" :severity="getStatusSeverity(user.status)" class="capitalize">
                    <template #icon>
                      <i :class="getStatusIcon(user.status)" class="mr-1"></i>
                    </template>
                  </Tag>
                  <Tag class="capitalize" :severity="user.type === 'buyer' ? 'info' : 'warning'">
                    <template #icon>
                      <i :class="getTypeIcon(user.type)" class="mr-1"></i>
                    </template>
                    {{ user.type }}
                  </Tag>
                </div>
              </div>
              <div class="mt-4 pt-4 border-t border-white border-opacity-20 flex flex-wrap gap-4">
                <div class="flex items-center gap-2">
                  <i class="pi pi-id-card text-blue-200"></i>
                  <span>ID: #{{ user.id }}</span>
                </div>
                <div class="flex items-center gap-2">
                  <i class="pi pi-calendar text-blue-200"></i>
                  <span>Joined: {{ user.registrationDate }}</span>
                </div>
                <div class="flex items-center gap-2">
                  <i class="pi pi-clock text-blue-200"></i>
                  <span>Last active: {{ user.lastActive }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="p-6">
        <TabView class="user-tabs">
          <!-- Basic Information Tab -->
          <TabPanel header="Profile">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 class="text-lg font-semibold mb-4 text-gray-700 flex items-center gap-2">
                  <i class="pi pi-user text-blue-500"></i>
                  Contact Information
                </h3>
                <div class="space-y-4">
                  <div class="flex items-start gap-3">
                    <div class="bg-blue-50 p-2 rounded-lg">
                      <i class="pi pi-phone text-blue-500"></i>
                    </div>
                    <div>
                      <div class="text-sm text-gray-500">Phone Number</div>
                      <div class="font-medium">{{ user.phone }}</div>
                    </div>
                  </div>
                  <div class="flex items-start gap-3">
                    <div class="bg-blue-50 p-2 rounded-lg">
                      <i class="pi pi-map-marker text-blue-500"></i>
                    </div>
                    <div>
                      <div class="text-sm text-gray-500">Address</div>
                      <div class="font-medium">
                        {{ user.address }}
                        <div class="text-gray-600">{{ user.city }}, {{ user.country }} {{ user.postalCode }}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Account Stats -->
              <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 class="text-lg font-semibold mb-4 text-gray-700 flex items-center gap-2">
                  <i class="pi pi-chart-bar text-blue-500"></i>
                  Account Statistics
                </h3>
                
                <div class="grid grid-cols-1 gap-4">
                  <div v-if="user.type === 'buyer'" class="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg flex items-center justify-between">
                    <div>
                      <div class="text-sm text-gray-600 mb-1">Orders Placed</div>
                      <div class="font-bold text-xl text-blue-700">{{ user.ordersPlaced }}</div>
                    </div>
                    <div class="bg-blue-500 bg-opacity-10 p-3 rounded-full">
                      <i class="pi pi-shopping-bag text-blue-500 text-xl"></i>
                    </div>
                  </div>

                  <div v-if="user.type === 'seller'" class="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-lg flex items-center justify-between">
                    <div>
                      <div class="text-sm text-gray-600 mb-1">Products Listed</div>
                      <div class="font-bold text-xl text-purple-700">{{ user.productsListed }}</div>
                    </div>
                    <div class="bg-purple-500 bg-opacity-10 p-3 rounded-full">
                      <i class="pi pi-tag text-purple-500 text-xl"></i>
                    </div>
                  </div>

                  <div v-if="user.type === 'seller'" class="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg flex items-center justify-between">
                    <div>
                      <div class="text-sm text-gray-600 mb-1">Total Revenue</div>
                      <div class="font-bold text-xl text-green-700">${{ user.revenue?.toLocaleString() }}</div>
                    </div>
                    <div class="bg-green-500 bg-opacity-10 p-3 rounded-full">
                      <i class="pi pi-dollar text-green-500 text-xl"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabPanel>

          <!-- Activity Tab -->
          <TabPanel header="Activity History">
            <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 class="text-lg font-semibold mb-4 text-gray-700 flex items-center gap-2">
                <i class="pi pi-history text-blue-500"></i>
                Recent Activity
              </h3>
              
              <Timeline class="activity-timeline">
                <template #content="slotProps">
                  <div class="bg-white p-4 rounded-lg shadow-sm border border-gray-100 mb-4">
                    <div class="font-medium text-gray-800">{{ slotProps.item.event }}</div>
                    <div class="text-sm text-gray-500 mt-1">{{ slotProps.item.date }}</div>
                  </div>
                </template>
                <template #opposite>
                  <div></div>
                </template>
                <template #marker="slotProps">
                  <span class="custom-marker flex items-center justify-center w-10 h-10 shadow-md bg-white border border-gray-200 rounded-full">
                    <i :class="slotProps.item.icon + ' text-blue-500'"></i>
                  </span>
                </template>
              </Timeline>
              
              <div class="text-center py-6">
                <div class="inline-flex items-center justify-center gap-2 text-gray-400 bg-gray-50 px-4 py-2 rounded-full">
                  <i class="pi pi-check-circle"></i>
                  <span>No more activity to show</span>
                </div>
              </div>
            </div>
          </TabPanel>

          <!-- Notes Tab -->
          <TabPanel header="Admin Notes">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 class="text-lg font-semibold mb-4 text-gray-700 flex items-center gap-2">
                  <i class="pi pi-pencil text-blue-500"></i>
                  Add Note
                </h3>
                <Textarea rows="6" class="w-full mb-4 shadow-sm" placeholder="Enter admin notes here..."></Textarea>
                <Button label="Save Note" icon="pi pi-save" class="p-button-sm w-full" />
              </div>
              
              <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 class="text-lg font-semibold mb-4 text-gray-700 flex items-center gap-2">
                  <i class="pi pi-list text-blue-500"></i>
                  Previous Notes
                </h3>
                <div class="flex flex-col items-center justify-center h-40 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                  <i class="pi pi-file-o text-gray-400 text-2xl mb-2"></i>
                  <div class="text-gray-500">No notes found</div>
                </div>
              </div>
            </div>
          </TabPanel>
        </TabView>

        <!-- Action Buttons -->
        <div class="flex flex-wrap gap-4 justify-between mt-6 pt-6 border-t border-gray-200">
          <div>
            <Button v-if="user.status === 'banned'" label="Reactivate Account" icon="pi pi-check-circle"
              class="p-button-success p-button-raised" @click="reactivateAccount" />
            <Button v-else label="Ban User" icon="pi pi-ban" class="p-button-danger p-button-raised" @click="openBanDialog" />
          </div>
          <Button label="Close" icon="pi pi-times" class="p-button-outlined" @click="closeDialog" />
        </div>
      </div>
    </div>
  </Dialog>
</template>

<style scoped>
.user-tabs :deep(.p-tabview-nav) {
  border-bottom-width: 2px;
}

.user-tabs :deep(.p-tabview-nav li .p-tabview-nav-link) {
  border: none;
  border-radius: 0.5rem 0.5rem 0 0;
  padding: 0.75rem 1.25rem;
  font-weight: 500;
}

.user-tabs :deep(.p-tabview-nav li.p-highlight .p-tabview-nav-link) {
  border-bottom: 2px solid #3b82f6;
  margin-bottom: -2px;
}

.user-tabs :deep(.p-tabview-panels) {
  padding: 1.5rem 0;
}

.custom-marker {
  transition: all 0.2s ease-in-out;
}

.custom-marker:hover {
  transform: scale(1.1);
  box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
}
</style>