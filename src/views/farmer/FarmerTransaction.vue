<script lang="ts">
import { defineComponent } from 'vue'
import OrderDetailsModal from '../../components/Farmer/Transaction/OrderDetailsModal.vue'
import StatusUpdateModal from '../../components/Farmer/Transaction/StatusUpdateModal.vue'
import SendNotificationModal from '../../components/Farmer/Transaction/SendNotificationModal.vue'
import OrderTable from '../../components/Farmer/Transaction/OrderTable.vue'
import router from '../../router'

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
    components: {
        OrderDetailsModal,
        StatusUpdateModal,
        SendNotificationModal,
        OrderTable
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
            showStatusModal: false,
            showNotificationModal: false,
            selectedOrder: null as { 
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
            } | null,
            newStatus: '',
            notificationTemplate: '',
            notificationMessage: '',

            // Status classes for styling
            statusClasses: {
                'Pending': 'bg-yellow-100 text-yellow-800',
                'Processing': 'bg-blue-100 text-blue-800',
                'Ready for Pickup': 'bg-indigo-100 text-indigo-800',
                'In Transit': 'bg-purple-100 text-purple-800',
                'Delivered': 'bg-green-100 text-green-800',
                'Cancelled': 'bg-red-100 text-red-800'
            },

            // Status options
            statusOptions: [
                'Pending',
                'Processing',
                'Ready for Pickup',
                'In Transit',
                'Delivered',
                'Cancelled'
            ],

            // Tabs
            tabs: [
                { id: 'All', name: 'All Orders' },
                { id: 'Pending', name: 'Pending' },
                { id: 'Processing', name: 'Processing' },
                { id: 'Ready for Pickup', name: 'Ready for Pickup' },
                { id: 'In Transit', name: 'In Transit' },
                { id: 'Delivered', name: 'Delivered' },
                { id: 'Cancelled', name: 'Cancelled' }
            ],

            // Mock order data
            orders: [
                {
                    id: 10043,
                    buyer: {
                        name: 'Dhaiel Malinao',
                        email: 'maria.santos@email.com',
                        phone: '+63 912 345 6789',
                        address: '123 Lepiten St. Avenue, Bogo City, Cebu'
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
                    notes: 'Buyer requested health certificates'
                },
                // ... rest of your orders data
            ],

            // Order statistics
            orderStats: {
                total: 8,
                totalRevenue: 706875,
                revenueTarget: 1000000,
                delivered: 1,
                pending: 2,
                processing: 2,
                readyForPickup: 1,
                inTransit: 1,
                cancelled: 1,
                percentChange: 12.5,
                urgentPending: 1
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
                    order.buyer.name.toLowerCase().includes(query) ||
                    order.buyer.email.toLowerCase().includes(query) ||
                    order.id.toString().includes(query) ||
                    order.items.some(item =>
                        item.name.toLowerCase().includes(query) ||
                        item.breed.toLowerCase().includes(query)
                    ) ||
                    order.buyer.address.toLowerCase().includes(query)
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
        isOrderUrgent(order: Order) {
            // Consider pending orders with upcoming estimated delivery as urgent
            if (order.status === 'Pending') {
                const today = new Date();
                const estimatedDelivery = new Date(order.estimatedDelivery);
                const daysDifference = Math.ceil((estimatedDelivery.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
                return daysDifference <= 5; // Urgent if 5 or fewer days until estimated delivery
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
            this.pagination.currentPage = 1; // Reset to first page when applying filters
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
        updateStatus(order: Order | null) {
            this.selectedOrder = order;
            if (order) {
                this.newStatus = order.status;
            }
            this.showStatusModal = true;
        },
        closeStatusModal() {
            this.showStatusModal = false;
        },
        saveStatusUpdate(status: string) {
            if (this.selectedOrder) {
                // Update the order status
                this.selectedOrder.status = status;

                // Update order statistics based on status change
                this.updateOrderStats();

                // Close the modal
                this.closeStatusModal();

                // Show success notification
                this.showSuccessNotification(`Order #${this.selectedOrder.id.toString().padStart(5, '0')} status updated to ${status}`);
            }
        },
        updateOrderStats() {
            // Recalculate order stats based on current orders
            const statuses = this.orders.map(order => order.status);

            this.orderStats = {
                ...this.orderStats,
                pending: statuses.filter(status => status === 'Pending').length,
                processing: statuses.filter(status => status === 'Processing').length,
                readyForPickup: statuses.filter(status => status === 'Ready for Pickup').length,
                inTransit: statuses.filter(status => status === 'In Transit').length,
                delivered: statuses.filter(status => status === 'Delivered').length,
                cancelled: statuses.filter(status => status === 'Cancelled').length
            };

            // Calculate urgent pending orders
            this.orderStats.urgentPending = this.orders.filter(order => this.isOrderUrgent(order)).length;
        },
        sendNotification(order: Order | null) {
            this.selectedOrder = order;
            this.showNotificationModal = true;

            // Set default notification template based on order status
            this.setDefaultNotificationTemplate();
        },
        closeNotificationModal() {
            this.showNotificationModal = false;
            this.notificationTemplate = '';
            this.notificationMessage = '';
            this.selectedOrder = null;
        },
        setDefaultNotificationTemplate() {
            if (!this.selectedOrder) return;

            const buyer = this.selectedOrder.buyer.name;
            const orderId = this.selectedOrder.id.toString().padStart(5, '0');

            switch (this.selectedOrder.status) {
                case 'Pending':
                    this.notificationTemplate = 'payment';
                    this.notificationMessage = `Dear ${buyer}, your payment for Order #${orderId} is pending. Please complete your payment to process your order.`;
                    break;
                case 'Processing':
                    this.notificationTemplate = 'status';
                    this.notificationMessage = `Dear ${buyer}, your Order #${orderId} is now being processed. We'll notify you once it's ready for pickup or delivery.`;
                    break;
                case 'Ready for Pickup':
                    this.notificationTemplate = 'pickup';
                    this.notificationMessage = `Dear ${buyer}, your Order #${orderId} is now ready for pickup. Please bring your order confirmation and valid ID.`;
                    break;
                case 'In Transit':
                    this.notificationTemplate = 'delivery';
                    this.notificationMessage = `Dear ${buyer}, your Order #${orderId} is now in transit. Expected delivery date: ${this.formatDate(this.selectedOrder.estimatedDelivery)}.`;
                    break;
                default:
                    this.notificationTemplate = 'status';
                    this.notificationMessage = `Dear ${buyer}, this is an update regarding your Order #${orderId}. Current status: ${this.selectedOrder.status}.`;
            }
        },
        sendSms() {
            if (!this.notificationMessage) {
                alert('Please enter a notification message');
                return;
            }

            // In real application, call SMS API here
            if (this.selectedOrder && this.selectedOrder.buyer) {
                console.log('Sending SMS to', this.selectedOrder.buyer.phone, ':', this.notificationMessage);
            } else {
                console.error('Selected order or buyer information is missing.');
            }

            this.showSuccessNotification('SMS notification sent successfully');
            this.closeNotificationModal();
        },
        sendEmail() {
            if (!this.notificationMessage) {
                alert('Please enter a notification message');
                return;
            }

            // In real application, call Email API here
            if (this.selectedOrder && this.selectedOrder.buyer) {
                console.log('Sending Email to', this.selectedOrder.buyer.email, ':', this.notificationMessage);
            } else {
                console.error('Selected order or buyer information is missing.');
            }

            this.showSuccessNotification('Email notification sent successfully');
            this.closeNotificationModal();
        },
        showSuccessNotification(message: string) {
            // In a real application, use a toast or notification system
            alert(message);
        },
        exportData() {
            // In a real application, generate a CSV or Excel file
            console.log('Exporting order data...');
            this.showSuccessNotification('Order data exported successfully');
        },
        goBack() {
            // In a real application, navigate back or to dashboard
            router.back();
        },
        updatePagination(newPagination: { currentPage: number; perPage: number }) {
            this.pagination = newPagination;
        },
        // Helper method to get order count by status
        getOrderCountByStatus(status: string): number {
            // For 'All' return total
            if (status === 'All') {
                return this.orderStats.total;
            }

            // Convert status to the corresponding property name in orderStats
            const statusKey = status.toLowerCase().replace(/\s+/g, '');

            // Map to orderStats property names
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
        // Initialize order statistics on component mount
        this.updateOrderStats();
    }
})
</script>

<template>
    <div class="min-h-screen bg-gradient-to-b from-green-50 to-green-100">
        <!-- Header -->
        <header class="bg-gradient-to-r from-green-800 to-green-600 text-white shadow-xl sticky top-0 z-10">
            <div class="container mx-auto px-6 py-4">
                <div class="flex justify-between items-center">
                    <div class="flex items-center space-x-4">
                        <button @click="goBack"
                            class="p-2 rounded-full hover:bg-green-600 hover:shadow-lg transition-all duration-200 flex items-center justify-center">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                            </svg>
                        </button>
                        <div class="flex flex-col">
                            <h1 class="text-2xl font-bold tracking-tight">Farmstead Livestock Orders</h1>
                            <p class="text-green-200 text-sm">Manage your livestock order pipeline in the Philippines
                            </p>
                        </div>
                    </div>
                    <div class="flex items-center space-x-4">
                        <div class="relative">
                            <span class="absolute inset-y-0 left-0 flex items-center pl-3">
                                <svg class="w-5 h-5 text-green-200" fill="none" stroke="currentColor"
                                    viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                                </svg>
                            </span>
                            <input v-model="searchQuery" placeholder="Search orders, buyers, or livestock..."
                                class="pl-10 pr-4 py-2 rounded-lg bg-green-700 text-white placeholder-green-200 focus:outline-none focus:ring-2 focus:ring-green-300 shadow-inner transition-all duration-300 hover:bg-green-600 w-64">
                        </div>
                        <button @click="openFiltersModal"
                            class="flex items-center bg-green-700 hover:bg-green-600 text-white px-4 py-2 rounded-lg shadow-md transition-all duration-200">
                            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z">
                                </path>
                            </svg>
                            Filters
                        </button>
                        <button @click="exportData"
                            class="flex items-center bg-green-700 hover:bg-green-600 text-white px-4 py-2 rounded-lg shadow-md transition-all duration-200">
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
                    class="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500 hover:scale-105 transition-transform duration-200 hover:shadow-xl">
                    <div class="flex items-center">
                        <div class="p-3 rounded-full bg-green-100 mr-4 shadow-md">
                            <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2">
                                </path>
                            </svg>
                        </div>
                        <div>
                            <p class="text-gray-500 text-sm font-medium uppercase tracking-wider">Total Orders</p>
                            <p class="text-3xl font-bold text-gray-800">{{ orderStats.total }}</p>
                            <p class="text-sm text-green-600" v-if="orderStats.percentChange > 0">+{{
                                orderStats.percentChange }}% this week</p>
                            <p class="text-sm text-red-600" v-else-if="orderStats.percentChange < 0">{{
                                orderStats.percentChange }}% this week</p>
                        </div>
                    </div>
                </div>

                <div
                    class="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500 hover:scale-105 transition-transform duration-200 hover:shadow-xl">
                    <div class="flex items-center">
                        <div class="p-3 rounded-full bg-green-100 mr-4 shadow-md">
                            <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z">
                                </path>
                            </svg>
                        </div>
                        <div>
                            <p class="text-gray-500 text-sm font-medium uppercase tracking-wider">Total Revenue</p>
                            <p class="text-3xl font-bold text-gray-800">{{ formatCurrency(orderStats.totalRevenue) }}
                            </p>
                            <p class="text-xs text-gray-500">Monthly Target: {{ formatCurrency(orderStats.revenueTarget)
                                }}</p>
                        </div>
                    </div>
                </div>

                <div
                    class="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500 hover:scale-105 transition-transform duration-200 hover:shadow-xl">
                    <div class="flex items-center">
                        <div class="p-3 rounded-full bg-green-100 mr-4 shadow-md">
                            <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M5 13l4 4L19 7"></path>
                            </svg>
                        </div>
                        <div>
                            <p class="text-gray-500 text-sm font-medium uppercase tracking-wider">Delivered</p>
                            <p class="text-3xl font-bold text-gray-800">{{ orderStats.delivered }}</p>
                            <div class="mt-1 h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                                <div class="bg-green-600 h-full rounded-full"
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
                            <p class="text-gray-500 text-sm font-medium uppercase tracking-wider">Urgent Pending</p>
                            <p class="text-3xl font-bold text-gray-800">{{ orderStats.urgentPending }}</p>
                            <p class="text-xs text-yellow-600">Needs immediate attention</p>
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
                            'bg-green-600 text-white': currentTab === tab.id,
                            'bg-white text-gray-700 hover:bg-gray-100': currentTab !== tab.id
                        }"
                            class="px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 whitespace-nowrap mr-2 mb-2">
                            {{ tab.name }}
                            <span v-if="tab.id !== 'All'" class="ml-1 px-2 py-0.5 rounded-full text-xs" :class="{
                                'bg-green-700 text-white': currentTab === tab.id,
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
                :pagination="pagination" :formatDate="formatDate" :formatTime="formatTime"
                :formatCurrency="formatCurrency" :isOrderUrgent="isOrderUrgent" :filteredOrders="filteredOrders"
                @view-details="viewOrderDetails" @update-status="updateStatus" @send-notification="sendNotification"
                @update-pagination="updatePagination" />

            <!-- Order Details Modal -->
            <OrderDetailsModal v-if="showDetailsModal && selectedOrder" :order="selectedOrder" :formatDate="formatDate"
                :formatTime="formatTime" :formatCurrency="formatCurrency" @close="closeDetailsModal" />

            <!-- Status Update Modal -->
            <StatusUpdateModal :show="showStatusModal" :order="selectedOrder" :statusOptions="statusOptions"
                :initialStatus="newStatus" :currentStatus="newStatus" @close="closeStatusModal"
                @save="saveStatusUpdate" />

            <!-- Filters Modal -->
            <div v-if="showFiltersModal"
                class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div class="bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
                    <div class="flex justify-between items-center mb-4">
                        <h3 class="text-xl font-bold text-gray-800">Filter Orders</h3>
                        <button @click="closeFiltersModal" class="text-gray-500 hover:text-gray-700">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                        </button>
                    </div>
                    <div class="space-y-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
                            <div class="grid grid-cols-2 gap-2">
                                <input v-model="dateFilter.start" type="date"
                                    class="w-full p-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500">
                                <input v-model="dateFilter.end" type="date"
                                    class="w-full p-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500">
                            </div>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
                            <select v-model="currentTab"
                                class="w-full p-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500">
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
                            class="px-4 py-2 bg-green-600 rounded-lg text-white hover:bg-green-700 transition-colors duration-200">
                            Apply Filters
                        </button>
                    </div>
                </div>
            </div>

            <SendNotificationModal :show="showNotificationModal" :order="selectedOrder"
                :notification-template="notificationTemplate" :notification-message="notificationMessage"
                @close="closeNotificationModal" @send-sms="sendSms" @send-email="sendEmail"
                @update:notificationTemplate="(val: string) => notificationTemplate = val"
                @update:notificationMessage="(val: string) => notificationMessage = val" 
                />

        </div>
    </div>
</template>