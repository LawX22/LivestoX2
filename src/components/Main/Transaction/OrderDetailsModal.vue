<script lang="ts">
import { defineComponent, type PropType } from 'vue'

type Order = {
  id: number
  orderDate: string | Date
  estimatedDelivery: string | Date
  status: string
  paymentStatus: string
  paymentMethod: string
  totalPrice: number
  seller: {
    name: string
    farmName: string
    email: string
    phone: string
    address: string
  }
  items: Array<{
    name: string
    breed: string
    quantity: number
    weight: number
    unitPrice: number
  }>
  notes?: string
}

export default defineComponent({
  props: {
    order: {
      type: Object as PropType<Order>,
      required: true
    },
    formatDate: {
      type: Function,
      required: true
    },
    formatTime: {
      type: Function,
      required: true
    },
    formatCurrency: {
      type: Function,
      required: true
    }
  },
  emits: ['close'],
  setup(_props, { emit }) {
    const closeModal = () => {
      emit('close')
    }

    return {
      closeModal
    }
  }
})
</script>

<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
      <!-- Modal Header -->
      <div class="sticky top-0 bg-white px-6 py-4 border-b flex justify-between items-center z-10">
        <h3 class="text-xl font-bold text-gray-800">Order Details #{{ order.id }}</h3>
        <button @click="closeModal" class="text-gray-500 hover:text-gray-700">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>

      <!-- Modal Content -->
      <div class="p-6">
        <!-- Order Summary -->
        <div class="mb-6">
          <h4 class="text-lg font-semibold text-gray-800 mb-3">Order Summary</h4>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p class="text-sm text-gray-500">Order Date</p>
              <p class="font-medium">{{ formatDate(order.orderDate) }} at {{ formatTime(order.orderDate) }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-500">Status</p>
              <p class="font-medium">{{ order.status }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-500">Estimated Delivery</p>
              <p class="font-medium">{{ formatDate(order.estimatedDelivery) }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-500">Payment Status</p>
              <p class="font-medium">{{ order.paymentStatus }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-500">Payment Method</p>
              <p class="font-medium">{{ order.paymentMethod }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-500">Total Amount</p>
              <p class="font-medium text-blue-600">{{ formatCurrency(order.totalPrice) }}</p>
            </div>
          </div>
        </div>

        <!-- Seller Information -->
        <div class="mb-6">
          <h4 class="text-lg font-semibold text-gray-800 mb-3">Seller Information</h4>
          <div class="bg-gray-50 p-4 rounded-lg">
            <p class="font-medium">{{ order.seller.name }}</p>
            <p class="text-gray-600">{{ order.seller.farmName }}</p>
            <p class="text-gray-600">{{ order.seller.email }}</p>
            <p class="text-gray-600">{{ order.seller.phone }}</p>
            <p class="text-gray-600">{{ order.seller.address }}</p>
          </div>
        </div>

        <!-- Order Items -->
        <div class="mb-6">
          <h4 class="text-lg font-semibold text-gray-800 mb-3">Livestock Purchased</h4>
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Item
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Breed
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Qty
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Weight (kg)
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Unit Price
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="(item, index) in order.items" :key="index">
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {{ item.name }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ item.breed }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ item.quantity }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ item.weight }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ formatCurrency(item.unitPrice) }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ formatCurrency(item.unitPrice * item.quantity) }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Additional Notes -->
        <div v-if="order.notes" class="mb-6">
          <h4 class="text-lg font-semibold text-gray-800 mb-3">Additional Notes</h4>
          <div class="bg-gray-50 p-4 rounded-lg">
            <p class="text-gray-600">{{ order.notes }}</p>
          </div>
        </div>

        <!-- Modal Footer -->
        <div class="pt-4 border-t flex justify-end">
          <button @click="closeModal"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200">
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>