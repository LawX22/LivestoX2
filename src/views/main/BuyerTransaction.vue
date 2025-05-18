<script lang="ts">
import { defineComponent } from 'vue'
import OrderDetailsModal from '../../components/Main/Transaction/OrderDetailsModal.vue'
import OrderTable from '../../components/Main/Transaction/OrderTable.vue'
import ContactSellerModal from '../../components/Main/Transaction/ContactSellerModal.vue'
import router from '../../router'

// Define the Order type
type Order = {
  id: number;
  seller: {
    name: string;
    email: string;
    phone: string;
    address: string;
    farmName: string;
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
  components: {
    OrderDetailsModal,
    OrderTable,
    ContactSellerModal
  },
  data() {
    return {
      searchQuery: '',
      dateFilter: {
        start: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0],
        end: new Date().toISOString().split('T')[0]
      },
      showFiltersModal: false,
      currentTab: 'All',
      pagination: {
        currentPage: 1,
        perPage: 8
      },
      showDetailsModal: false,
      showContactModal: false,
      selectedOrder: null as Order | null,
      messageToSeller: '',

      // Status classes for styling
      statusClasses: {
        'Pending': 'bg-yellow-100 text-yellow-800',
        'Processing': 'bg-blue-100 text-blue-800',
        'Ready for Pickup': 'bg-indigo-100 text-indigo-800',
        'In Transit': 'bg-purple-100 text-purple-800',
        'Delivered': 'bg-green-100 text-green-800',
        'Cancelled': 'bg-red-100 text-red-800'
      },

      // Tabs
      tabs: [
        { id: 'All', name: 'All Orders' },
        { id: 'Pending', name: 'Pending' },
        { id: 'Processing', name: 'Processing' },
        { id: 'Ready for Pickup', name: 'Ready' },
        { id: 'In Transit', name: 'In Transit' },
        { id: 'Delivered', name: 'Delivered' },
        { id: 'Cancelled', name: 'Cancelled' }
      ],

      // Mock order data (from buyer's perspective)
      orders: [
        {
          id: 10043,
          seller: {
            name: 'Juan Dela Cruz',
            farmName: 'Green Pastures Livestock Farm',
            email: 'juan.delacruz@email.com',
            phone: '+63 912 345 6789',
            address: '456 Farm Road, Bogo City, Cebu'
          },
          items: [
            {
              name: 'Holstein Cattle',
              breed: 'Holstein Friesian',
              quantity: 2,
              weight: 1050,
              unitPrice: 85000
            }
          ],
          orderDate: new Date('2025-05-05T09:30:00'),
          totalPrice: 170000,
          status: 'Pending',
          estimatedDelivery: new Date('2025-05-25'),
          paymentStatus: 'Pending',
          paymentMethod: 'On Hand Cash',
          notes: 'Requested health certificates'
        },
        // ... more orders
      ],

      // Order statistics
      orderStats: {
        total: 8,
        totalSpent: 706875,
        delivered: 1,
        pending: 2,
        processing: 2,
        readyForPickup: 1,
        inTransit: 1,
        cancelled: 1,
        percentChange: 12.5,
        upcomingDeliveries: 1
      }
    }
  },
  computed: {
    filteredOrders() {
      let result = this.orders;

      // Filter by search query
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase();
        result = result.filter(order =>
          order.seller.name.toLowerCase().includes(query) ||
          order.seller.farmName.toLowerCase().includes(query) ||
          order.id.toString().includes(query) ||
          order.items.some(item =>
            item.name.toLowerCase().includes(query) ||
            item.breed.toLowerCase().includes(query)
          )
        );
      }

      // Filter by tab (status)
      if (this.currentTab !== 'All') {
        result = result.filter(order => order.status === this.currentTab);
      }

      // Filter by date range
      if (this.dateFilter.start && this.dateFilter.end) {
        const startDate = new Date(this.dateFilter.start);
        const endDate = new Date(this.dateFilter.end);
        endDate.setHours(23, 59, 59); // Set to end of day

        result = result.filter(order => {
          const orderDate = new Date(order.orderDate);
          return orderDate >= startDate && orderDate <= endDate;
        });
      }

      return result;
    },
    paginatedOrders() {
      const startIndex = (this.pagination.currentPage - 1) * this.pagination.perPage;
      const endIndex = startIndex + this.pagination.perPage;
      return this.filteredOrders.slice(startIndex, endIndex);
    },
    totalPages() {
      return Math.ceil(this.filteredOrders.length / this.pagination.perPage);
    }
  },
  methods: {
    formatDate(date: string | number | Date) {
      return new Date(date).toLocaleDateString('en-PH', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    },
    formatTime(date: string | number | Date) {
      return new Date(date).toLocaleTimeString('en-PH', {
        hour: '2-digit',
        minute: '2-digit'
      });
    },
    formatCurrency(amount: number | bigint) {
      return new Intl.NumberFormat('en-PH', {
        style: 'currency',
        currency: 'PHP'
      }).format(amount);
    },
    isOrderUpcoming(order: Order) {
      if (order.status === 'In Transit' || order.status === 'Ready for Pickup') {
        const today = new Date();
        const estimatedDelivery = new Date(order.estimatedDelivery);
        const daysDifference = Math.ceil((estimatedDelivery.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        return daysDifference <= 5;
      }
      return false;
    },
    openFiltersModal() {
      this.showFiltersModal = true;
    },
    closeFiltersModal() {
      this.showFiltersModal = false;
    },
    applyFilters() {
      this.pagination.currentPage = 1;
      this.closeFiltersModal();
    },
    resetFilters() {
      this.searchQuery = '';
      this.dateFilter = {
        start: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0],
        end: new Date().toISOString().split('T')[0]
      };
      this.currentTab = 'All';
      this.pagination.currentPage = 1;
    },
    viewOrderDetails(order: Order | null) {
      this.selectedOrder = order;
      this.showDetailsModal = true;
    },
    closeDetailsModal() {
      this.showDetailsModal = false;
      this.selectedOrder = null;
    },
    contactSeller(order: Order | null) {
      this.selectedOrder = order;
      this.messageToSeller = '';
      this.showContactModal = true;
    },
    closeContactModal() {
      this.showContactModal = false;
    },
    sendMessageToSeller() {
      if (!this.messageToSeller || !this.selectedOrder) return;

      // In a real app, this would send to backend
      console.log(`Sending message to ${this.selectedOrder.seller.name}: ${this.messageToSeller}`);

      this.showSuccessNotification('Message sent to seller successfully');
      this.closeContactModal();
    },
    showSuccessNotification(message: string) {
      // In a real application, use a toast or notification system
      alert(message);
    },
    exportData() {
      console.log('Exporting order data...');
      this.showSuccessNotification('Order data exported successfully');
    },
    goBack() {
      router.back();
    },
    updatePagination(newPagination: { currentPage: number; perPage: number }) {
      this.pagination = newPagination;
    },
    getOrderCountByStatus(status: string): number {
      if (status === 'All') return this.orderStats.total;

      const statusKey = status.toLowerCase().replace(/\s+/g, '');
      const statusMap: Record<string, keyof typeof this.orderStats> = {
        'pending': 'pending',
        'processing': 'processing',
        'readyforpickup': 'readyForPickup',
        'intransit': 'inTransit',
        'delivered': 'delivered',
        'cancelled': 'cancelled'
      };

      return this.orderStats[statusMap[statusKey] as keyof typeof this.orderStats] || 0;
    }
  },
  mounted() {
    // Calculate order statistics
    const statuses = this.orders.map(order => order.status);

    this.orderStats = {
      ...this.orderStats,
      total: this.orders.length,
      totalSpent: this.orders.reduce((sum, order) => sum + order.totalPrice, 0),
      pending: statuses.filter(status => status === 'Pending').length,
      processing: statuses.filter(status => status === 'Processing').length,
      readyForPickup: statuses.filter(status => status === 'Ready for Pickup').length,
      inTransit: statuses.filter(status => status === 'In Transit').length,
      delivered: statuses.filter(status => status === 'Delivered').length,
      cancelled: statuses.filter(status => status === 'Cancelled').length,
      upcomingDeliveries: this.orders.filter(order => this.isOrderUpcoming(order)).length
    };
  }
})
</script>

<template>
  <div class="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100">
    <!-- Header -->
    <header class="bg-gradient-to-r from-blue-800 to-blue-600 text-white shadow-xl sticky top-0 z-10">
      <div class="container mx-auto px-6 py-4">
        <div class="flex justify-between items-center">
          <div class="flex items-center space-x-4">
            <button @click="goBack"
              class="p-2 rounded-full hover:bg-blue-600 hover:shadow-lg transition-all duration-200 flex items-center justify-center">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18">
                </path>
              </svg>
            </button>
            <div class="flex flex-col">
              <h1 class="text-2xl font-bold tracking-tight">My Livestock Orders</h1>
              <p class="text-blue-200 text-sm">Track and manage your livestock purchases in the Philippines</p>
            </div>
          </div>
          <div class="flex items-center space-x-4">
            <div class="relative">
              <span class="absolute inset-y-0 left-0 flex items-center pl-3">
                <svg class="w-5 h-5 text-blue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              </span>
              <input v-model="searchQuery" placeholder="Search orders, sellers, or livestock..."
                class="pl-10 pr-4 py-2 rounded-lg bg-blue-700 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-300 shadow-inner transition-all duration-300 hover:bg-blue-600 w-64">
            </div>
            <button @click="openFiltersModal"
              class="flex items-center bg-blue-700 hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md transition-all duration-200">
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z">
                </path>
              </svg>
              Filters
            </button>
            <button @click="exportData"
              class="flex items-center bg-blue-700 hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md transition-all duration-200">
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
              </svg>
              Export
            </button>
          </div>
        </div>
      </div>
    </header>

    <div class="container mx-auto px-6 py-8">
      <!-- Dashboard Stats -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div
          class="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500 hover:scale-105 transition-transform duration-200 hover:shadow-xl">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-blue-100 mr-4 shadow-md">
              <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2">
                </path>
              </svg>
            </div>
            <div>
              <p class="text-gray-500 text-sm font-medium uppercase tracking-wider">Total Orders</p>
              <p class="text-3xl font-bold text-gray-800">{{ orderStats.total }}</p>
              <p class="text-sm text-blue-600" v-if="orderStats.percentChange > 0">+{{
                orderStats.percentChange }}% this month</p>
            </div>
          </div>
        </div>

        <div
          class="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500 hover:scale-105 transition-transform duration-200 hover:shadow-xl">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-blue-100 mr-4 shadow-md">
              <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z">
                </path>
              </svg>
            </div>
            <div>
              <p class="text-gray-500 text-sm font-medium uppercase tracking-wider">Total Spent</p>
              <p class="text-3xl font-bold text-gray-800">{{ formatCurrency(orderStats.totalSpent) }}</p>
            </div>
          </div>
        </div>

        <div
          class="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500 hover:scale-105 transition-transform duration-200 hover:shadow-xl">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-blue-100 mr-4 shadow-md">
              <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <div>
              <p class="text-gray-500 text-sm font-medium uppercase tracking-wider">Completed</p>
              <p class="text-3xl font-bold text-gray-800">{{ orderStats.delivered }}</p>
              <div class="mt-1 h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                <div class="bg-blue-600 h-full rounded-full"
                  :style="{ width: `${(orderStats.delivered / orderStats.total) * 100}%` }"></div>
              </div>
            </div>
          </div>
        </div>

        <div
          class="bg-white rounded-xl shadow-lg p-6 border-l-4 border-yellow-500 hover:scale-105 transition-transform duration-200 hover:shadow-xl">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-yellow-100 mr-4 shadow-md">
              <svg class="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <div>
              <p class="text-gray-500 text-sm font-medium uppercase tracking-wider">Upcoming</p>
              <p class="text-3xl font-bold text-gray-800">{{ orderStats.upcomingDeliveries }}</p>
              <p class="text-xs text-yellow-600">Deliveries/pickups soon</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Status Tabs -->
      <div class="col-span-full bg-white rounded-xl shadow-lg p-4 mb-8">
        <div class="flex flex-wrap items-center justify-between">
          <div
            class="flex space-x-1 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            <button v-for="tab in tabs" :key="tab.id" @click="currentTab = tab.id" :class="{
              'bg-blue-600 text-white': currentTab === tab.id,
              'bg-white text-gray-700 hover:bg-gray-100': currentTab !== tab.id
            }"
              class="px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 whitespace-nowrap mr-2 mb-2">
              {{ tab.name }}
              <span v-if="tab.id !== 'All'" class="ml-1 px-2 py-0.5 rounded-full text-xs" :class="{
                'bg-blue-700 text-white': currentTab === tab.id,
                'bg-gray-200 text-gray-700': currentTab !== tab.id
              }">
                {{ getOrderCountByStatus(tab.id) }}
              </span>
            </button>
          </div>
          <div class="text-sm text-gray-500">
            Showing {{ filteredOrders.length }} of {{ orders.length }} orders
          </div>
        </div>
      </div>

      <!-- Order Table -->
      <OrderTable :orders="paginatedOrders" :statusClasses="statusClasses" :totalPages="totalPages"
        :pagination="pagination" :formatDate="formatDate" :formatTime="formatTime" :formatCurrency="formatCurrency"
        :isOrderUrgent="isOrderUpcoming" :filteredOrders="filteredOrders" @view-details="viewOrderDetails"
        @contact-seller="contactSeller" @update-pagination="updatePagination" />

      <!-- Order Details Modal -->
      <OrderDetailsModal v-if="showDetailsModal && selectedOrder" :order="selectedOrder" :formatDate="formatDate"
        :formatTime="formatTime" :formatCurrency="formatCurrency" @close="closeDetailsModal" />

      <!-- Contact Seller Modal -->
      <ContactSellerModal v-if="showContactModal && selectedOrder" :seller="selectedOrder.seller"
        :message="messageToSeller" @close="closeContactModal" @send-message="sendMessageToSeller"
        @update:message="(val: string) => messageToSeller = val" />

      <!-- Filters Modal -->
      <div v-if="showFiltersModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-xl font-bold text-gray-800">Filter Orders</h3>
            <button @click="closeFiltersModal" class="text-gray-500 hover:text-gray-700">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
              <div class="grid grid-cols-2 gap-2">
                <input v-model="dateFilter.start" type="date"
                  class="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500">
                <input v-model="dateFilter.end" type="date"
                  class="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500">
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select v-model="currentTab"
                class="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500">
                <option v-for="tab in tabs" :key="tab.id" :value="tab.id">{{ tab.name }}</option>
              </select>
            </div>
          </div>
          <div class="mt-6 flex justify-end space-x-3">
            <button @click="resetFilters"
              class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200">
              Reset
            </button>
            <button @click="applyFilters"
              class="px-4 py-2 bg-blue-600 rounded-lg text-white hover:bg-blue-700 transition-colors duration-200">
              Apply Filters
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>