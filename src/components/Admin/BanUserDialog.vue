<script lang="ts">
import { defineComponent, ref, PropType } from 'vue';
import Dialog from 'primevue/dialog';
import Button from 'primevue/button';
import Divider from 'primevue/divider';
import Dropdown from 'primevue/dropdown';

interface User {
  id: number;
  name: string;
  email: string;
  avatarUrl?: string;
}

export default defineComponent({
  name: 'BanUserDialog',
  components: {
    Dialog,
    Button,
    Divider,
    Dropdown
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
  emits: ['update:visible', 'confirm-ban'],
  setup(_, { emit }) {
    const selectedReason = ref('');
    const isSubmitting = ref(false);
    const reasonOptions = ref([
      'Violation of community guidelines',
      'Repeated inappropriate behavior',
      'Spam or promotional content',
      'Harassment of other users',
      'Fake or misleading information'
    ]);

    const closeDialog = () => {
      emit('update:visible', false);
      selectedReason.value = '';
    };

    const confirmBan = () => {
      isSubmitting.value = true;
      // Simulate API call delay
      setTimeout(() => {
        emit('confirm-ban', selectedReason.value);
        selectedReason.value = '';
        isSubmitting.value = false;
        closeDialog();
      }, 500);
    };

    return {
      isSubmitting,
      reasonOptions,
      selectedReason,
      closeDialog,
      confirmBan
    };
  }
});
</script>

<template>
  <Dialog v-model:visible="visible" header="Ban User" :modal="true" :style="{ width: '550px' }" :closable="false"
    :closeOnEscape="false" :dismissableMask="false" class="ban-user-dialog">
    <div class="p-2">
      <div class="flex items-center mb-5">
        <div class="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mr-4 shadow-sm">
          <i class="pi pi-ban text-red-500 text-xl"></i>
        </div>
        <div>
          <h3 class="text-xl font-semibold">{{ user?.name }}</h3>
          <p class="text-sm text-gray-500">{{ user?.email }}</p>
        </div>
      </div>

      <Divider />

      <div class="mb-5">
        <div class="bg-red-50 border-l-4 border-red-500 p-4 rounded-r mb-4">
          <p class="font-medium text-red-800">Are you sure you want to ban this user?</p>
          <p class="text-sm text-red-700 mt-1">This action cannot be automatically reversed.</p>
        </div>

        <div class="bg-gray-50 p-4 rounded">
          <p class="text-sm text-gray-700 font-medium mb-2">This action will:</p>
          <ul class="text-sm text-gray-600 pl-5 space-y-2">
            <li class="flex items-start">
              <i class="pi pi-lock text-gray-500 mr-2 mt-0.5"></i>
              <span>Prevent the user from logging into their account</span>
            </li>
            <li class="flex items-start">
              <i class="pi pi-eye-slash text-gray-500 mr-2 mt-0.5"></i>
              <span>Hide all their future content from other users</span>
            </li>
            <li class="flex items-start">
              <i class="pi pi-envelope text-gray-500 mr-2 mt-0.5"></i>
              <span>Send them an email notification about the ban</span>
            </li>
          </ul>
        </div>
      </div>

      <div class="mb-4">
        <label for="reasonDropdown" class="block mb-2 text-sm font-medium">Reason for ban</label>

        <Dropdown id="reasonDropdown" v-model="selectedReason" :options="reasonOptions" placeholder="Select a reason"
          class="w-full" />
        <small class="text-gray-500 mt-2 flex items-center">
          <i class="pi pi-info-circle mr-1"></i>
          This reason will be included in the notification email sent to the user.
        </small>
      </div>
    </div>

    <template #footer>
      <div class="flex justify-between items-center border-t border-gray-200 pt-4 px-5 pb-3">
        <div class="text-sm text-gray-500 px-4">
          <i class="pi pi-user-edit mr-1"></i>
          Action by: Admin
        </div>
        <div class="flex space-x-3">
          <Button label="Cancel" class="p-button-outlined" @click="closeDialog" :disabled="isSubmitting" />
          <Button label="Confirm Ban" icon="pi pi-ban" class="p-button-danger" @click="confirmBan"
            :loading="isSubmitting" :disabled="isSubmitting || !selectedReason" />
        </div>
      </div>
    </template>
  </Dialog>
</template>

<style scoped>
.ban-user-dialog :deep(.p-dialog-header) {
  border-bottom: 1px solid #e2e8f0;
  padding: 1.25rem 1.5rem;
  background-color: #f8fafc;
}

.ban-user-dialog :deep(.p-dialog-content) {
  padding: 0;
}

.ban-user-dialog :deep(.p-dialog-footer) {
  padding: 0;
}

/* Remove outline from dropdown */
.ban-user-dialog :deep(.p-dropdown) {
  border-color: #d1d5db;
  box-shadow: none;
}

.ban-user-dialog :deep(.p-dropdown:not(.p-disabled).p-focus) {
  border-color: #3b82f6;
  box-shadow: 0 0 0 1px rgba(59, 130, 246, 0.1);
}
</style>