<script lang="ts">
import { defineComponent, PropType } from 'vue';

// Define the Order type
type Order = {
  id: number;
  buyer: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
  items: {
    name: string;
    breed: string;
    quantity: number;
    weight: number;
    unitPrice: number;
  }[];
  orderDate: Date;
  totalPrice: number;
  status: string;
  estimatedDelivery: Date;
  paymentStatus: string;
  paymentMethod: string;
  notes: string;
};

export default defineComponent({
  name: 'OrderTable',
  props: {
    orders: {
      type: Array as PropType<Order[]>,
      required: true
    },
    statusClasses: {
      type: Object as PropType<Record<string, string>>,
      required: true
    },
    totalPages: {
      type: Number,
      required: true
    },
    pagination: {
      type: Object as PropType<{
        currentPage: number;
        perPage: number;
      }>,
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
    filteredOrders: {
      type: Array as PropType<Order[]>,
      required: true
    }
  },
  emits: ['view-details', 'update-status', 'send-notification', 'update-pagination', 'reset-filters'],
  methods: {
    viewDetails(order: Order) {
      this.$emit('view-details', order);
    },
    updateStatus(order: Order) {
      this.$emit('update-status', order);
    },
    sendNotification(order: Order) {
      this.$emit('send-notification', order);
    },
    changePage(page: number) {
      if (page < 1 || page > this.totalPages) return;
      
      const newPagination = {
        ...this.pagination,
        currentPage: page
      };
      
      this.$emit('update-pagination', newPagination);
    },
    changePerPage(event: Event) {
      const target = event.target as HTMLSelectElement;
      const newPerPage = parseInt(target.value);
      
      const newPagination = {
        currentPage: 1, // Reset to first page when changing items per page
        perPage: newPerPage
      };
      
      this.$emit('update-pagination', newPagination);
    },
    // Format order ID with leading zeros
    formatOrderId(id: number): string {
      return id.toString().padStart(5, '0');
    },
    // Get total quantity of items in an order
    getTotalQuantity(order: Order): number {
      return order.items.reduce((sum, item) => sum + item.quantity, 0);
    },
    // Get the first item name, or indicate multiple items
    getItemsDisplay(order: Order): string {
      if (order.items.length === 0) return 'No items';
      if (order.items.length === 1) return order.items[0].name;
      return `${order.items[0].name} +${order.items.length - 1} more`;
    }
  }
});
</script>

<template>
  <div class="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
    <!-- Empty state when no orders match filters -->
    <div v-if="filteredOrders.length === 0" class="p-8 text-center">
      <div class="flex flex-col items-center justify-center py-12">
        <svg class="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
        </svg>
        <h3 class="text-xl font-medium text-gray-800 mb-2">No orders found</h3>
        <p class="text-gray-500 mb-6">Try adjusting your filters or search term</p>
        <button @click="$emit('reset-filters')"
          class="px-4 py-2 bg-green-600 rounded-lg text-white hover:bg-green-700 transition-colors duration-200">
          Reset Filters
        </button>
      </div>
    </div>

    <!-- Orders table -->
    <div v-else class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-green-50">
          <tr>
            <th scope="col"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
              Order ID
            </th>
            <th scope="col"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
              Buyer
            </th>
            <th scope="col"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
              Livestock
            </th>
            <th scope="col"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
              Order Date
            </th>
            <th scope="col"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
              Amount
            </th>
            <th scope="col"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
              Status
            </th>
            <th scope="col"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
              Actions
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="order in orders" :key="order.id"
            class="hover:bg-green-50 transition-colors duration-150 cursor-pointer"
            :class="{ 'bg-yellow-50': isOrderUrgent(order) }">
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-center">
                <div class="text-sm font-medium text-gray-900">
                  #{{ formatOrderId(order.id) }}
                </div>
                <div v-if="isOrderUrgent(order)" class="ml-2 px-2 py-0.5 rounded-full text-xs bg-yellow-200 text-yellow-800">
                  Urgent
                </div>
              </div>
            </td>
            <td class="px-6 py-4">
              <div class="text-sm font-medium text-gray-900">{{ order.buyer.name }}</div>
              <div class="text-xs text-gray-500 truncate max-w-xs">{{ order.buyer.address }}</div>
            </td>
            <td class="px-6 py-4">
              <div class="text-sm text-gray-900">{{ getItemsDisplay(order) }}</div>
              <div class="text-xs text-gray-500">Qty: {{ getTotalQuantity(order) }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-900">{{ formatDate(order.orderDate) }}</div>
              <div class="text-xs text-gray-500">{{ formatTime(order.orderDate) }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm font-semibold text-gray-900">{{ formatCurrency(order.totalPrice) }}</div>
              <div class="text-xs text-gray-500">
                <span :class="{
                  'text-green-600': order.paymentStatus === 'Paid',
                  'text-yellow-600': order.paymentStatus === 'Partial',
                  'text-red-600': order.paymentStatus === 'Unpaid'
                }">{{ order.paymentStatus }}</span>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full"
                :class="statusClasses[order.status]">
                {{ order.status }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
              <div class="flex space-x-2">
                <button @click.stop="viewDetails(order)"
                  class="text-green-600 hover:text-green-800 transition-colors duration-200" title="View Details">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z">
                    </path>
                  </svg>
                </button>
                <button @click.stop="updateStatus(order)"
                  class="text-blue-600 hover:text-blue-800 transition-colors duration-200" title="Update Status">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z">
                    </path>
                  </svg>
                </button>
                <button @click.stop="sendNotification(order)"
                  class="text-purple-600 hover:text-purple-800 transition-colors duration-200" title="Send Notification">
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

    <!-- Pagination -->
    <div class="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
      <div class="flex-1 flex justify-between sm:hidden">
        <!-- Mobile pagination -->
        <button @click="changePage(pagination.currentPage - 1)"
          :disabled="pagination.currentPage === 1"
          :class="[
            pagination.currentPage === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50',
            'relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md'
          ]">
          Previous
        </button>
        <button @click="changePage(pagination.currentPage + 1)"
          :disabled="pagination.currentPage === totalPages"
          :class="[
            pagination.currentPage === totalPages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50',
            'ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md'
          ]">
          Next
        </button>
      </div>
      <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
        <!-- Desktop pagination -->
        <div>
          <p class="text-sm text-gray-700">
            Showing
            <span class="font-medium">{{ (pagination.currentPage - 1) * pagination.perPage + 1 }}</span>
            to
            <span class="font-medium">
              {{ Math.min(pagination.currentPage * pagination.perPage, filteredOrders.length) }}
            </span>
            of
            <span class="font-medium">{{ filteredOrders.length }}</span>
            results
          </p>
        </div>
        <div class="flex items-center space-x-4">
          <!-- Items per page selector -->
          <div class="flex items-center space-x-2">
            <label for="perPage" class="text-sm text-gray-600">Show:</label>
            <select id="perPage" @change="changePerPage" :value="pagination.perPage"
              class="border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-green-500 focus:border-green-500">
              <option value="4">4</option>
              <option value="8">8</option>
              <option value="16">16</option>
              <option value="32">32</option>
            </select>
          </div>
          
          <!-- Page navigation -->
          <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
            <button @click="changePage(1)" :disabled="pagination.currentPage === 1"
              class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium"
              :class="pagination.currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'">
              <span class="sr-only">First Page</span>
              <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
                <path fill-rule="evenodd" d="M8.707 5.293a1 1 0 010 1.414L5.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
              </svg>
            </button>
            <button @click="changePage(pagination.currentPage - 1)" :disabled="pagination.currentPage === 1"
              class="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium"
              :class="pagination.currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'">
              <span class="sr-only">Previous</span>
              <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
              </svg>
            </button>
            
            <!-- Page numbers -->
            <template v-for="page in totalPages" :key="page">
              <!-- Show first page, current page +-1, and last page -->
              <button v-if="page === 1 || page === totalPages || (page >= pagination.currentPage - 1 && page <= pagination.currentPage + 1)"
                @click="changePage(page)"
                :class="[
                  pagination.currentPage === page ? 'z-10 bg-green-50 border-green-500 text-green-600' : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50',
                  'relative inline-flex items-center px-4 py-2 border text-sm font-medium'
                ]">
                {{ page }}
              </button>
              
              <!-- Ellipsis for skipped pages -->
              <span v-else-if="
                (page === 2 && pagination.currentPage > 3) || 
                (page === totalPages - 1 && pagination.currentPage < totalPages - 2)"
                class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                ...
              </span>
            </template>
            
            <button @click="changePage(pagination.currentPage + 1)" :disabled="pagination.currentPage === totalPages"
              class="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium"
              :class="pagination.currentPage === totalPages ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'">
              <span class="sr-only">Next</span>
              <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
              </svg>
            </button> 
            <button @click="changePage(totalPages)" :disabled="pagination.currentPage === totalPages"
              class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium"
              :class="pagination.currentPage === totalPages ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'">
              <span class="sr-only">Last Page</span>
              <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                <path fill-rule="evenodd" d="M11.293 14.707a1 1 0 010-1.414L14.586 10l-3.293-3.293a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
              </svg>
            </button>
          </nav>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Custom scrollbar for horizontal overflow */
.scrollbar-thin::-webkit-scrollbar {
  height: 4px;
}

.scrollbar-thin::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 20px;
}

.scrollbar-thin::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 20px;
}

.scrollbar-thin::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}
</style>