<script lang="ts">
import { defineComponent, type PropType } from 'vue'

// Define or import the Order type
type Order = {
  id: number
  seller: {
    name: string
    farmName: string
  }
  orderDate: string | Date
  items: { name: string }[]
  totalPrice: number
  status: string
}

export default defineComponent({
  props: {
    orders: {
      type: Array as PropType<Order[]>,
      required: true
    },
    statusClasses: {
      type: Object,
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
    },
    isOrderUrgent: {
      type: Function,
      required: true
    },
    filteredOrders: {
      type: Array as PropType<Order[]>,
      required: true
    },
    pagination: {
      type: Object,
      required: true
    },
    totalPages: {
      type: Number,
      required: true
    }
  },
  emits: ['view-details', 'contact-seller', 'update-pagination'],
  setup(props, { emit }) {
    const viewDetails = (order: Order) => {
      emit('view-details', order)
    }

    const contactSeller = (order: Order) => {
      emit('contact-seller', order)
    }

    const updatePagination = (page: number) => {
      emit('update-pagination', { ...props.pagination, currentPage: page })
    }

    return {
      viewDetails,
      contactSeller,
      updatePagination
    }
  }
})
</script>

<template>
  <div class="bg-white rounded-xl shadow-lg overflow-hidden">
    <!-- Table -->
    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Order ID
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Seller/Farm
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Date
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Items
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Total
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="order in orders" :key="order.id" class="hover:bg-gray-50">
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
              #{{ order.id }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm font-medium text-gray-900">{{ order.seller.name }}</div>
              <div class="text-sm text-gray-500">{{ order.seller.farmName }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-900">{{ formatDate(order.orderDate) }}</div>
              <div class="text-sm text-gray-500">{{ formatTime(order.orderDate) }}</div>
            </td>
            <td class="px-6 py-4">
              <div class="text-sm text-gray-900">
                {{ order.items.length }} item{{ order.items.length > 1 ? 's' : '' }}
              </div>
              <div class="text-sm text-gray-500">
                {{ order.items[0].name }} {{ order.items.length > 1 ? '+ more' : '' }}
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ formatCurrency(order.totalPrice) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span class="px-2 py-1 text-xs font-semibold rounded-full" :class="statusClasses[order.status]">
                {{ order.status }}
                <span v-if="isOrderUrgent(order)" class="ml-1 animate-pulse">🚚</span>
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <button @click="viewDetails(order)"
                class="text-blue-600 hover:text-blue-900 mr-3 transition-colors duration-200">
                Details
              </button>
              <button @click="contactSeller(order)"
                class="text-green-600 hover:text-green-900 transition-colors duration-200">
                Contact
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Empty State -->
    <div v-if="orders.length === 0" class="p-8 text-center">
      <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1"
          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2">
        </path>
      </svg>
      <h3 class="mt-2 text-sm font-medium text-gray-900">No orders found</h3>
      <p class="mt-1 text-sm text-gray-500">Try adjusting your search or filter to find what you're looking for.</p>
    </div>

    <!-- Pagination -->
    <div v-if="filteredOrders.length > 0" class="px-6 py-4 border-t flex items-center justify-between">
      <div class="text-sm text-gray-500">
        Showing <span class="font-medium">{{ (pagination.currentPage - 1) * pagination.perPage + 1 }}</span> to
        <span class="font-medium">{{ Math.min(pagination.currentPage * pagination.perPage, filteredOrders.length) }}</span>
        of <span class="font-medium">{{ filteredOrders.length }}</span> results
      </div>
      <div class="flex space-x-2">
        <button @click="updatePagination(pagination.currentPage - 1)" :disabled="pagination.currentPage === 1"
          :class="{ 'opacity-50 cursor-not-allowed': pagination.currentPage === 1 }"
          class="px-3 py-1 border rounded-md text-sm font-medium hover:bg-gray-50 transition-colors duration-200">
          Previous
        </button>
        <button v-for="page in totalPages" :key="page" @click="updatePagination(page)"
          :class="{ 'bg-blue-600 text-white': pagination.currentPage === page, 'hover:bg-gray-50': pagination.currentPage !== page }"
          class="px-3 py-1 border rounded-md text-sm font-medium transition-colors duration-200">
          {{ page }}
        </button>
        <button @click="updatePagination(pagination.currentPage + 1)" :disabled="pagination.currentPage === totalPages"
          :class="{ 'opacity-50 cursor-not-allowed': pagination.currentPage === totalPages }"
          class="px-3 py-1 border rounded-md text-sm font-medium hover:bg-gray-50 transition-colors duration-200">
          Next
        </button>
      </div>
    </div>
  </div>
</template>