<script lang="ts">
import { defineComponent, PropType } from 'vue';

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
    props: {
        order: {
            type: Object as PropType<Order>,
            required: true
        },
        formatDate: {
            type: Function as PropType<(date: Date | string | number) => string>,
            required: true
        },
        formatTime: {
            type: Function as PropType<(date: Date | string | number) => string>,
            required: true
        },
        formatCurrency: {
            type: Function as PropType<(amount: number | bigint) => string>,
            required: true
        }
    },
    setup(_props, { emit }) {
        const calculateTotal = (item: { quantity: number; unitPrice: number; }) => {
            return item.quantity * item.unitPrice;
        };

        const closeModal = () => {
            emit('close');
        };

        return {
            calculateTotal,
            closeModal
        };
    }
})
</script>

<template>
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white rounded-xl shadow-2xl w-full max-w-4xl p-6 max-h-[90vh] overflow-y-auto">
            <!-- Modal Header -->
            <div class="flex justify-between items-center mb-4 border-b pb-4">
                <div class="flex items-center">
                    <div class="bg-green-100 rounded-full p-2 mr-3">
                        <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2">
                            </path>
                        </svg>
                    </div>
                    <div>
                        <h2 class="text-xl font-bold text-gray-800">Order #{{ order.id.toString().padStart(5, '0') }}</h2>
                        <p class="text-sm text-gray-500">
                            Placed on {{ formatDate(order.orderDate) }} at {{ formatTime(order.orderDate) }}
                        </p>
                    </div>
                </div>
                <button @click="closeModal" class="text-gray-500 hover:text-gray-700">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12">
                        </path>
                    </svg>
                </button>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Order Status and Info -->
                <div class="bg-gray-50 p-4 rounded-lg">
                    <h3 class="text-lg font-semibold text-gray-800 mb-4">Order Status</h3>
                    <div class="space-y-3">
                        <div class="flex justify-between">
                            <span class="text-gray-600">Status:</span>
                            <span :class="{
                                'text-yellow-600': order.status === 'Pending',
                                'text-blue-600': order.status === 'Processing',
                                'text-indigo-600': order.status === 'Ready for Pickup',
                                'text-purple-600': order.status === 'In Transit',
                                'text-green-600': order.status === 'Delivered',
                                'text-red-600': order.status === 'Cancelled'
                            }" class="font-medium">{{ order.status }}</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-gray-600">Payment Status:</span>
                            <span :class="{
                                'text-yellow-600': order.paymentStatus === 'Pending',
                                'text-orange-600': order.paymentStatus === 'Partial',
                                'text-green-600': order.paymentStatus === 'Paid'
                            }" class="font-medium">{{ order.paymentStatus }}</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-gray-600">Payment Method:</span>
                            <span class="font-medium">{{ order.paymentMethod }}</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-gray-600">Estimated Delivery:</span>
                            <span class="font-medium">{{ formatDate(order.estimatedDelivery) }}</span>
                        </div>
                    </div>

                    <div class="mt-6">
                        <h3 class="text-lg font-semibold text-gray-800 mb-2">Notes</h3>
                        <div class="bg-white p-3 rounded-lg border border-gray-200">
                            <p class="text-gray-700">{{ order.notes || 'No notes for this order.' }}</p>
                        </div>
                    </div>
                </div>

                <!-- Buyer Information -->
                <div class="bg-gray-50 p-4 rounded-lg">
                    <h3 class="text-lg font-semibold text-gray-800 mb-4">Buyer Information</h3>
                    <div class="space-y-3">
                        <div class="flex flex-col">
                            <span class="text-gray-600">Name:</span>
                            <span class="font-medium text-gray-800">{{ order.buyer.name }}</span>
                        </div>
                        <div class="flex flex-col">
                            <span class="text-gray-600">Email:</span>
                            <span class="font-medium text-gray-800">{{ order.buyer.email }}</span>
                        </div>
                        <div class="flex flex-col">
                            <span class="text-gray-600">Phone:</span>
                            <span class="font-medium text-gray-800">{{ order.buyer.phone }}</span>
                        </div>
                        <div class="flex flex-col">
                            <span class="text-gray-600">Address:</span>
                            <span class="font-medium text-gray-800">{{ order.buyer.address }}</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Order Items -->
            <div class="mt-6">
                <h3 class="text-lg font-semibold text-gray-800 mb-4">Order Items</h3>
                <div class="bg-gray-50 rounded-lg overflow-hidden">
                    <table class="min-w-full divide-y divide-gray-200">
                        <thead class="bg-gray-100">
                            <tr>
                                <th scope="col"
                                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Livestock
                                </th>
                                <th scope="col"
                                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Breed
                                </th>
                                <th scope="col"
                                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Quantity
                                </th>
                                <th scope="col"
                                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Weight (kg)
                                </th>
                                <th scope="col"
                                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Unit Price
                                </th>
                                <th scope="col"
                                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
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
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                                    {{ formatCurrency(calculateTotal(item)) }}
                                </td>
                            </tr>
                        </tbody>
                        <tfoot class="bg-gray-50">
                            <tr>
                                <td colspan="5" class="px-6 py-4 text-right text-sm font-medium text-gray-900">
                                    Total Amount:
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-base text-green-600 font-bold">
                                    {{ formatCurrency(order.totalPrice) }}
                                </td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>

            <!-- Action Buttons -->
            <div class="mt-6 flex justify-end space-x-3">
                <button @click="closeModal"
                    class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors duration-200">
                    Close
                </button>
            </div>
        </div>
    </div>
</template>