<script lang="ts">
import { defineComponent, type PropType } from 'vue'

// Define the Seller type if not imported from elsewhere
type Seller = {
  name: string
  farmName: string
  email: string
  phone: string
  address: string
}


export default defineComponent({
  props: {
    seller: {
      type: Object as PropType<Seller>,
      required: true
    },
    message: {
      type: String,
      default: ''
    }
  },
  emits: ['close', 'send-message', 'update:message'],
  setup(_props, { emit }) {
    const closeModal = () => {
      emit('close')
    }

    const sendMessage = () => {
      emit('send-message')
    }

    const updateMessage = (value: string) => {
      emit('update:message', value)
    }

    return {
      closeModal,
      sendMessage,
      updateMessage
    }
  }
})
</script>

<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-xl shadow-2xl w-full max-w-md">
      <!-- Modal Header -->
      <div class="px-6 py-4 border-b flex justify-between items-center">
        <h3 class="text-xl font-bold text-gray-800">Contact Seller</h3>
        <button @click="closeModal" class="text-gray-500 hover:text-gray-700">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>

      <!-- Modal Content -->
      <div class="p-6">
        <div class="mb-6">
          <h4 class="text-lg font-semibold text-gray-800 mb-2">{{ seller.name }}</h4>
          <p class="text-gray-600">{{ seller.farmName }}</p>
        </div>

        <div class="mb-6">
          <label for="message" class="block text-sm font-medium text-gray-700 mb-2">Your Message</label>
          <textarea id="message" rows="4" :value="message" @input="updateMessage(($event.target as HTMLTextAreaElement).value)"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            placeholder="Type your message to the seller here..."></textarea>
        </div>

        <div class="mb-6 bg-blue-50 p-4 rounded-lg">
          <h4 class="text-sm font-medium text-blue-800 mb-2">Contact Information</h4>
          <div class="grid grid-cols-2 gap-2">
            <div>
              <p class="text-xs text-gray-500">Email</p>
              <p class="text-sm text-blue-600">{{ seller.email }}</p>
            </div>
            <div>
              <p class="text-xs text-gray-500">Phone</p>
              <p class="text-sm text-blue-600">{{ seller.phone }}</p>
            </div>
            <div class="col-span-2">
              <p class="text-xs text-gray-500">Address</p>
              <p class="text-sm text-blue-600">{{ seller.address }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal Footer -->
      <div class="px-6 py-4 border-t flex justify-end space-x-3">
        <button @click="closeModal"
          class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200">
          Cancel
        </button>
        <button @click="sendMessage"
          class="px-4 py-2 bg-green-600 rounded-lg text-white hover:bg-green-700 transition-colors duration-200">
          Send Message
        </button>
      </div>
    </div>
  </div>
</template>