<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
    props: {
        order: {
            type: Object,
            required: true
        },
        statusOptions: {
            type: Array as () => string[],
            required: true
        },
        initialStatus: {
            type: String,
            required: true
        }
    },
    data() {
        return {
            selectedStatus: this.initialStatus
        }
    },
    watch: {
        initialStatus(newValue) {
            this.selectedStatus = newValue
        }
    },
    methods: {
        save() {
            this.$emit('save', this.selectedStatus)
        },
        close() {
            this.$emit('close')
        }
    }
})
</script>

<template>
    <div class="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center p-4 z-50">
        <div class="bg-white rounded-lg shadow-xl max-w-lg w-full">
            <!-- Header -->
            <div class="bg-green-50 p-6 rounded-t-lg border-b border-gray-200">
                <div class="flex justify-between items-center">
                    <h2 class="text-xl font-semibold text-green-800">Update Order Status</h2>
                    <button @click="close" class="text-gray-500 hover:text-gray-700 focus:outline-none">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                </div>
            </div>

            <!-- Content -->
            <div class="p-6">
                <div class="mb-6">
                    <div class="flex items-center mb-4">
                        <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                            <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2">
                                </path>
                            </svg>
                        </div>
                        <div>
                            <h3 class="font-medium">Order #{{ order.id.toString().padStart(5, '0') }}</h3>
                            <p class="text-sm text-gray-500">{{ order.items[0].name }} (Qty: {{ order.items[0].quantity }})</p>
                        </div>
                    </div>

                    <div class="mb-4">
                        <label class="block text-sm font-medium text-gray-700 mb-2">Current Status</label>
                        <div class="px-4 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm">
                            {{ order.status }}
                        </div>
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">New Status</label>
                        <select v-model="selectedStatus"
                            class="block w-full px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:border-green-500 focus:ring focus:ring-green-200 focus:ring-opacity-50">
                            <option v-for="status in statusOptions" :key="status" :value="status">
                                {{ status }}
                            </option>
                        </select>
                    </div>

                    <div class="mt-6 bg-yellow-50 p-4 rounded-md border border-yellow-100" v-if="selectedStatus === 'Ready for Pickup'">
                        <div class="flex">
                            <div class="flex-shrink-0">
                                <svg class="h-5 w-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z">
                                    </path>
                                </svg>
                            </div>
                            <div class="ml-3">
                                <h3 class="text-sm font-medium text-yellow-800">Pickup Notification</h3>
                                <p class="mt-1 text-sm text-yellow-700">
                                    Changing status to "Ready for Pickup" will automatically send a notification to the buyer.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div class="mt-6 bg-blue-50 p-4 rounded-md border border-blue-100" v-if="selectedStatus === 'Delivered'">
                        <div class="flex">
                            <div class="flex-shrink-0">
                                <svg class="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                            </div>
                            <div class="ml-3">
                                <h3 class="text-sm font-medium text-blue-800">Delivery Confirmation</h3>
                                <p class="mt-1 text-sm text-blue-700">
                                    Please confirm that the livestock has been delivered to the buyer before changing this status.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Footer -->
            <div class="bg-gray-50 px-6 py-4 rounded-b-lg border-t border-gray-200 flex justify-end space-x-4">
                <button @click="close"
                    class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                    Cancel
                </button>
                <button @click="save"
                    class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                    Update Status
                </button>
            </div>
        </div>
    </div>
</template>