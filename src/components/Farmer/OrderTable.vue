<script lang="ts">
import { defineComponent, PropType } from 'vue';

interface OrderItem {
  name: string;
  breed: string;
  quantity: number;
  weight: number;
  unitPrice: number;
}

interface Buyer {
  name: string;
  email: string;
  phone: string;
  address: string;
}

export interface Order {
  id: number;
  buyer: Buyer;
  items: OrderItem[];
  orderDate: Date;
  totalPrice: number;
  status: string;
  estimatedDelivery: Date;
  paymentStatus: string;
  paymentMethod: string;
  notes: string;
}

export default defineComponent({
  props: {
    orders: {
      type: Array as PropType<Order[]>,
      required: true
    },
    statusClasses: {
      type: Object as PropType<Record<string, string>>,
      required: true
    },
    formatDate: {
      type: Function as PropType<(date: string | number | Date) => string>,
      required: true
    },
    formatTime: {
      type: Function as PropType<(date: string | number | Date) => string>,
      required: true
    },
    formatCurrency: {
      type: Function as PropType<(amount: number | bigint) => string>,
      required: true
    },
    isOrderUrgent: {
      type: Function as PropType<(order: Order) => boolean>,
      required: true
    },
    pagination: {
      type: Object as PropType<{ currentPage: number; perPage: number }>,
      required: true
    },
    filteredOrders: {
      type: Array as PropType<Order[]>,
      required: true
    },
    totalPages: {
      type: Number,
      required: true
    }
  },
  emits: [
    'view-order-details',
    'update-status',
    'send-notification',
    'update:pagination'
  ],
  methods: {
    handlePageChange(page: number) {
      this.$emit('update:pagination', { ...this.pagination, currentPage: page });
    }
  }
});
</script>

<template>
  <div class="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
    <div class="px-6 py-4 border-b border-gray-200 bg-gray-50">
      <h2 class="text-xl font-semibold text-gray-800">Livestock Order Management</h2>
      <p class="text-sm text-gray-600">Showing {{ filteredOrders.length }} orders</p>
    </div>

    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Order ID
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Buyer
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Livestock
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Date & Time
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Amount
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Payment
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="order in orders" :key="order.id"
              :class="isOrderUrgent(order) ? 'bg-yellow-50' : ''"
              class="hover:bg-gray-50 transition-all">
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm font-medium text-gray-900">#{{ order.id.toString().padStart(5, '0') }}</div>
              <div v-if="isOrderUrgent(order)"
                  class="text-xs text-yellow-600 font-medium flex items-center mt-1">
                <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd"
                      d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                      clip-rule="evenodd"></path>
                </svg>
                Urgent
              </div>
            </td>
            <td class="px-6 py-4">
              <div class="text-sm font-medium text-gray-900">{{ order.buyer.name }}</div>
              <div class="text-xs text-gray-500">{{ order.buyer.email }}</div>
            </td>
            <td class="px-6 py-4">
              <div v-for="(item, index) in order.items" :key="index">
                <div class="text-sm font-medium text-gray-900">{{ item.name }}</div>
                <div class="text-xs text-gray-500">{{ item.breed }} • {{ item.quantity }} units</div>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-900">{{ formatDate(order.orderDate) }}</div>
              <div class="text-xs text-gray-500">{{ formatTime(order.orderDate) }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span
                  :class="[statusClasses[order.status], 'px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full']">
                {{ order.status }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {{ formatCurrency(order.totalPrice) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span
                  :class="[order.paymentStatus === 'Paid' ? 'bg-green-100 text-green-800' : order.paymentStatus === 'Partial' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800', 'px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full']">
                {{ order.paymentStatus }}
              </span>
              <div class="text-xs text-gray-500 mt-1">{{ order.paymentMethod }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
              <div class="flex space-x-2">
                <button @click="$emit('view-order-details', order)"
                    class="text-green-600 hover:text-green-900 transition-all hover:scale-110">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z">
                    </path>
                  </svg>
                </button>
                <button @click="$emit('update-status', order)"
                    class="text-indigo-600 hover:text-indigo-900 transition-all hover:scale-110">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z">
                    </path>
                  </svg>
                </button>
                <button @click="$emit('send-notification', order)"
                    class="text-blue-600 hover:text-blue-900 transition-all hover:scale-110">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z">
                    </path>
                  </svg>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Empty State -->
    <div v-if="filteredOrders.length === 0" class="flex flex-col items-center justify-center py-12 bg-gray-50">
      <svg class="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
      </svg>
      <p class="mt-4 text-lg font-medium text-gray-600">No orders found</p>
      <p class="text-gray-500">Try adjusting your search or filter criteria</p>
      <slot name="empty-state-actions"></slot>
    </div>

    <!-- Pagination -->
    <div v-if="filteredOrders.length > 0"
        class="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
      <div class="text-sm text-gray-500">
        Showing {{ (pagination.currentPage - 1) * pagination.perPage + 1 }} to
        {{ Math.min(pagination.currentPage * pagination.perPage, filteredOrders.length) }} of
        {{ filteredOrders.length }} entries
      </div>
      <div class="flex space-x-2">
        <button @click="handlePageChange(pagination.currentPage - 1)"
            :disabled="pagination.currentPage === 1"
            :class="[pagination.currentPage === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50', 'px-3 py-1 border border-gray-300 rounded-md text-sm']">
          Previous
        </button>
        <button v-for="page in totalPages" :key="page"
            @click="handlePageChange(page)"
            :class="[pagination.currentPage === page ? 'bg-green-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50', 'px-3 py-1 border border-gray-300 rounded-md text-sm']">
          {{ page }}
        </button>
        <button @click="handlePageChange(pagination.currentPage + 1)"
            :disabled="pagination.currentPage === totalPages"
            :class="[pagination.currentPage === totalPages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50', 'px-3 py-1 border border-gray-300 rounded-md text-sm']">
          Next
        </button>
      </div>
    </div>
  </div>
</template>