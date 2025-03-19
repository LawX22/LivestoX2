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
    Textarea
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

    const getTypeIcon = (type: string) => {
      return type === 'buyer' ? 'pi pi-shopping-cart' : 'pi pi-tag';
    };

    return {
      closeDialog,
      openBanDialog,
      reactivateAccount,
      getStatusSeverity,
      getTypeIcon
    };
  }
});
</script>

<template>
  <Dialog v-model:visible="visible" :style="{ width: '800px' }" :modal="true" :dismissableMask="true"
    :closeOnEscape="true" :showHeader="false" class="rounded-xl overflow-hidden user-details-dialog">
    <div v-if="user" class="user-details">
      <!-- User Header -->
      <div class="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white">
        <div class="flex items-center gap-6">
          <Avatar :image="user.avatarUrl" size="xlarge" shape="circle" class="border-4 border-white shadow-lg" />
          <div>
            <div class="flex items-center gap-2">
              <h2 class="text-2xl font-bold m-0">{{ user.name }}</h2>
              <span v-if="user.verificationStatus === 'verified'"
                class="bg-blue-500 bg-opacity-25 px-2 py-1 rounded-full text-xs">
                <i class="pi pi-check-circle mr-1"></i>Verified
              </span>
            </div>
            <div class="opacity-90 flex items-center gap-1 mt-1">
              <i class="pi pi-envelope text-sm"></i>
              <span>{{ user.email }}</span>
            </div>
            <div class="flex gap-2 mt-4">
              <Tag :value="user.status" :severity="getStatusSeverity(user.status)" class="capitalize" />
              <span class="px-2 py-1 rounded-full text-xs font-medium bg-white bg-opacity-25 flex items-center gap-1">
                <i :class="getTypeIcon(user.type)"></i>
                {{ user.type === 'buyer' ? 'Buyer' : 'Seller' }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div class="p-6">
        <TabView>
          <!-- Basic Information Tab -->
          <TabPanel header="Basic Information">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div class="space-y-6">
                <div class="bg-gray-50 p-5 rounded-lg shadow-sm">
                  <div class="text-sm text-gray-500 mb-1 flex items-center gap-1">
                    <i class="pi pi-id-card text-blue-500"></i>
                    User ID
                  </div>
                  <div class="font-medium">#{{ user.id }}</div>
                </div>
                <div class="bg-gray-50 p-5 rounded-lg shadow-sm">
                  <div class="text-sm text-gray-500 mb-1 flex items-center gap-1">
                    <i class="pi pi-calendar text-blue-500"></i>
                    Registration Date
                  </div>
                  <div class="font-medium">{{ user.registrationDate }}</div>
                </div>
                <div class="bg-gray-50 p-5 rounded-lg shadow-sm">
                  <div class="text-sm text-gray-500 mb-1 flex items-center gap-1">
                    <i class="pi pi-clock text-blue-500"></i>
                    Last Active
                  </div>
                  <div class="font-medium">{{ user.lastActive }}</div>
                </div>
              </div>
              <div class="space-y-6">
                <div class="bg-gray-50 p-5 rounded-lg shadow-sm">
                  <div class="text-sm text-gray-500 mb-1 flex items-center gap-1">
                    <i class="pi pi-phone text-blue-500"></i>
                    Phone Number
                  </div>
                  <div class="font-medium">{{ user.phone }}</div>
                </div>
                <div class="bg-gray-50 p-5 rounded-lg shadow-sm">
                  <div class="text-sm text-gray-500 mb-1 flex items-center gap-1">
                    <i class="pi pi-map-marker text-blue-500"></i>
                    Address
                  </div>
                  <div class="font-medium">
                    {{ user.address }}<br>
                    {{ user.city }}, {{ user.country }} {{ user.postalCode }}
                  </div>
                </div>
              </div>
            </div>

            <!-- Account Stats -->
            <div class="mt-8">
              <h3 class="text-lg font-semibold mb-4">Account Statistics</h3>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div v-if="user.type === 'buyer'" class="bg-blue-50 p-4 rounded-lg shadow-sm">
                  <div class="text-sm text-gray-600 mb-1">Orders Placed</div>
                  <div class="font-bold text-xl text-blue-700">{{ user.ordersPlaced }}</div>
                </div>
                <div v-if="user.type === 'seller'" class="bg-purple-50 p-4 rounded-lg shadow-sm">
                  <div class="text-sm text-gray-600 mb-1">Products Listed</div>
                  <div class="font-bold text-xl text-purple-700">{{ user.productsListed }}</div>
                </div>
                <div v-if="user.type === 'seller'" class="bg-green-50 p-4 rounded-lg shadow-sm">
                  <div class="text-sm text-gray-600 mb-1">Total Revenue</div>
                  <div class="font-bold text-xl text-green-700">${{ user.revenue?.toLocaleString() }}</div>
                </div>
              </div>
            </div>
          </TabPanel>

          <!-- Activity Tab -->
          <TabPanel header="Activity History">
            <div class="bg-gray-50 p-5 rounded-lg">
              <h3 class="text-lg font-semibold mb-4">Recent Activity</h3>
              <Timeline class="activity-timeline">
                <template #content="slotProps">
                  <div class="activity-item">
                    <div class="font-medium">{{ slotProps.item.event }}</div>
                    <div class="text-sm text-gray-500">{{ slotProps.item.date }}</div>
                  </div>
                </template>
                <template #opposite>
                  <div></div>
                </template>
                <template #marker="slotProps">
                  <span class="custom-marker p-2 shadow-sm bg-white border border-gray-300 rounded-full flex items-center justify-center">
                    <i :class="slotProps.item.icon + ' text-blue-500'"></i>
                  </span>
                </template>
              </Timeline>
              <div class="text-center text-gray-500 mt-6">No more activity to show</div>
            </div>
          </TabPanel>

          <!-- Notes Tab -->
          <TabPanel header="Admin Notes">
            <div class="space-y-6">
              <div class="bg-gray-50 p-5 rounded-lg">
                <h3 class="text-lg font-semibold mb-4">Add Note</h3>
                <Textarea rows="4" class="w-full mb-4" placeholder="Enter admin notes here..."></Textarea>
                <Button label="Save Note" icon="pi pi-save" class="p-button-sm" />
              </div>
              <div class="bg-gray-50 p-5 rounded-lg">
                <h3 class="text-lg font-semibold mb-4">Previous Notes</h3>
                <div class="text-center text-gray-500">No notes found</div>
              </div>
            </div>
          </TabPanel>
        </TabView>

        <!-- Action Buttons -->
        <div class="flex justify-between mt-6 pt-6 border-t border-gray-200">
          <div>
            <Button v-if="user.status === 'banned'" label="Reactivate Account" icon="pi pi-check-circle"
              class="p-button-success mr-2" @click="reactivateAccount" />
            <Button v-else label="Ban User" icon="pi pi-ban" class="p-button-danger mr-2" @click="openBanDialog" />
          </div>
          <Button label="Close" icon="pi pi-times" class="p-button-outlined" @click="closeDialog" />
        </div>
      </div>
    </div>
  </Dialog>
</template>