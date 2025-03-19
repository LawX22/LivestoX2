<script lang="ts">
import { defineComponent, ref, PropType } from 'vue';
import Dialog from 'primevue/dialog';
import Button from 'primevue/button';
import Textarea from 'primevue/textarea';

interface User {
  id: number;
  name: string;
  email: string;
}

export default defineComponent({
  name: 'BanUserDialog',
  components: {
    Dialog,
    Button,
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
  emits: ['update:visible', 'confirm-ban'],
  setup(_, { emit }) {
    const banReason = ref('');

    const closeDialog = () => {
      emit('update:visible', false);
      banReason.value = '';
    };

    const confirmBan = () => {
      emit('confirm-ban', banReason.value);
      banReason.value = '';
    };

    return {
      banReason,
      closeDialog,
      confirmBan
    };
  }
});
</script>

<template>
  <Dialog v-model:visible="visible" header="Ban User" :modal="true" :style="{ width: '450px' }">
    <div class="p-4">
      <div class="mb-4">
        <p>Are you sure you want to ban {{ user?.name }}?</p>
        <p class="text-sm text-gray-500 mt-2">This will prevent the user from accessing their account.</p>
      </div>
      <div class="mb-4">
        <label for="banReason" class="block mb-2 text-sm font-medium">Reason for ban</label>
        <Textarea id="banReason" v-model="banReason" rows="3" class="w-full" placeholder="Enter reason (optional)"></Textarea>
      </div>
    </div>
    <template #footer>
      <Button label="Cancel" icon="pi pi-times" class="p-button-text" @click="closeDialog" />
      <Button label="Confirm Ban" icon="pi pi-check" class="p-button-danger" @click="confirmBan" />
    </template>
  </Dialog>
</template>