<script lang="ts">
import { defineComponent, PropType, ref, watch } from 'vue';

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
        show: {
            type: Boolean,
            required: true
        },
        order: {
            type: Object as PropType<Order | null>,
            required: true
        },
        statusOptions: {
            type: Array as PropType<string[]>,
            required: true
        },
        initialStatus: {
            type: String,
            required: true
        },
        currentStatus: {
            type: String,
            required: true
        }
    },
    emits: ['close', 'save'],
    setup(props, { emit }) {
        const selectedStatus = ref(props.initialStatus);
        const statusDescription = ref('');
        
        // Update selected status when props change
        watch(() => props.initialStatus, (newStatus) => {
            selectedStatus.value = newStatus;
        });
        
        // Descriptions for each status
        const statusDescriptions: Record<string, string> = {
            'Pending': 'Order has been received but not yet processed.',
            'Processing': 'Order is being prepared and processed.',
            'Ready for Pickup': 'Order is prepared and waiting for pickup.',
            'In Transit': 'Order is on the way to the buyer.',
            'Delivered': 'Order has been successfully delivered to the buyer.',
            'Cancelled': 'Order has been cancelled.'
        };
        
        // Update description when status changes
        watch(selectedStatus, (newStatus) => {
            statusDescription.value = statusDescriptions[newStatus] || '';
        }, { immediate: true });
        
        const closeModal = () => {
            emit('close');
        };
        
        const saveStatus = () => {
            emit('save', selectedStatus.value);
        };
        
        return {
            selectedStatus,
            statusDescription,
            closeModal,
            saveStatus
        };
    }
})
</script>

<template>
    <div v-if="show" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
            <div class="flex justify-between items-center mb-4">
                <h3 class="text-xl font-bold text-gray-800">Update Order Status</h3>
                <button @click="closeModal" class="text-gray-500 hover:text-gray-700">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12">
                        </path>
                    </svg>
                </button>
            </div>
            
            <div v-if="order" class="mb-4">
                <p class="text-sm text-gray-600 mb-1">Current order:</p>
                <p class="font-medium text-gray-800">Order #{{ order.id.toString().padStart(5, '0') }} - {{ order.buyer.name }}</p>
            </div>
            
            <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <div class="relative">
                    <select v-model="selectedStatus"
                        class="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 rounded-lg">
                        <option v-for="status in statusOptions" :key="status" :value="status">
                            {{ status }}
                        </option>
                    </select>
                </div>
                <p class="mt-2 text-sm text-gray-500">{{ statusDescription }}</p>
            </div>
            
            <div class="mt-6 flex justify-end space-x-3">
                <button @click="closeModal"
                    class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200">
                    Cancel
                </button>
                <button @click="saveStatus"
                    class="px-4 py-2 bg-green-600 rounded-lg text-white hover:bg-green-700 transition-colors duration-200">
                    Update Status
                </button>
            </div>
            
            <!-- Status Change Notification -->
            <div v-if="currentStatus !== selectedStatus" class="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div class="flex items-start">
                    <div class="flex-shrink-0">
                        <svg class="h-5 w-5 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <div class="ml-3">
                        <h3 class="text-sm font-medium text-yellow-800">Status Change</h3>
                        <div class="mt-1 text-sm text-yellow-700">
                            <p>You are changing the order status from <strong>{{ currentStatus }}</strong> to <strong>{{ selectedStatus }}</strong>.</p>
                            <p class="mt-1">This will trigger a notification to the buyer.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template> 