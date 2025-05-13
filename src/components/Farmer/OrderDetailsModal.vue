<script lang="ts">
import { defineComponent, PropType } from 'vue'

interface Order {
  id: number
  buyer: {
    name: string
    email: string
    phone: string
  }
  items: {
    name: string
    quantity: number
    unitPrice: number
  }[]
  status: string
  orderDate: string
  totalPrice: number
}

export default defineComponent({
  props: {
    order: {
      type: Object as PropType<Order>,
      required: true
    },
    statusClasses: {
      type: Object as PropType<Record<string, string>>,
      required: true
    }
  },
  emits: ['close', 'update-status'],
  methods: {
    formatDate(dateString: string): string {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    },
    formatCurrency(amount: number): string {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
      }).format(amount)
    }
  }
})
</script>

<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
    <div class="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-auto animate-modal-in">
      <!-- Header -->
      <div class="p-6 border-b border-gray-200 flex justify-between items-center bg-green-50">
        <h2 class="text-xl font-bold text-green-800">
          Order #{{ order.id.toString().padStart(5, '0') }}
          <span 
            :class="[statusClasses[order.status], 'ml-3 px-3 py-1 rounded-full text-xs align-middle']"
          >
            {{ order.status }}
          </span>
        </h2>
        <button 
          @click="$emit('close')" 
          class="text-gray-400 hover:text-gray-600 focus:outline-none p-1 rounded-full hover:bg-gray-100"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>
      
      <!-- Body -->
      <div class="p-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <!-- Customer Info -->
          <div class="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
            <h3 class="font-bold mb-3 text-green-700 flex items-center">
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
              Customer Information
            </h3>
            <div class="space-y-2 text-gray-700">
              <p class="flex items-center">
                <span class="font-medium w-20">Name:</span> 
                {{ order.buyer.name }}
              </p>
              <p class="flex items-center">
                <span class="font-medium w-20">Email:</span>
                <a :href="`mailto:${order.buyer.email}`" class="text-blue-600 hover:underline">
                  {{ order.buyer.email }}
                </a>
              </p>
              <p class="flex items-center">
                <span class="font-medium w-20">Phone:</span>
                <a :href="`tel:${order.buyer.phone}`" class="text-blue-600 hover:underline">
                  {{ order.buyer.phone }}
                </a>
              </p>
            </div>
          </div>
          
          <!-- Order Info -->
          <div class="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
            <h3 class="font-bold mb-3 text-green-700 flex items-center">
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
              </svg>
              Order Information
            </h3>
            <div class="space-y-2 text-gray-700">
              <p class="flex items-center">
                <span class="font-medium w-20">Date:</span> 
                {{ formatDate(order.orderDate) }}
              </p>
              <p class="flex items-center">
                <span class="font-medium w-20">Status:</span>
                <span 
                  :class="[statusClasses[order.status], 'px-3 py-1 rounded-full text-xs']"
                >
                  {{ order.status }}
                </span>
              </p>
              <p class="flex items-center">
                <span class="font-medium w-20">Total:</span> 
                <span class="font-bold">{{ formatCurrency(order.totalPrice) }}</span>
              </p>
            </div>
          </div>
        </div>
        
        <!-- Animal Ordered -->
        <div class="mb-6">
          <h3 class="font-bold mb-3 text-green-700 flex items-center">
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"></path>
            </svg>
            Animal Ordered
          </h3>
          <div class="bg-green-50 p-4 rounded-lg border border-green-100">
            <div v-for="(item, index) in order.items" :key="index" class="flex justify-between items-center">
              <div>
                <p class="font-medium text-green-800">{{ item.name }}</p>
                <p class="text-sm text-gray-600">Quantity: {{ item.quantity }}</p>
              </div>
              <div class="text-right">
                <p class="font-bold text-green-700">{{ formatCurrency(item.unitPrice) }}</p>
                <p class="text-sm text-gray-600">per unit</p>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Additional Information -->
        <div class="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-6">
          <h3 class="font-bold mb-2 text-gray-700">Delivery Notes</h3>
          <p class="text-gray-600 text-sm">
            Standard delivery protocol applies for this animal order. Customer has been informed about proper care instructions.
          </p>
        </div>
      </div>
      
      <!-- Footer -->
      <div class="p-4 border-t border-gray-200 flex justify-end space-x-3 bg-gray-50">
        <button 
          @click="$emit('update-status', order)" 
          class="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md shadow-sm transition-colors flex items-center"
        >
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
          </svg>
          Update Status
        </button>
        <button 
          @click="$emit('close')" 
          class="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-md shadow-sm transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.animate-modal-in {
  animation: modal-in 0.3s ease-out;
}

@keyframes modal-in {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>