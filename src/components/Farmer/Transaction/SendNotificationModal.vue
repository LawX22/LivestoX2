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
        notificationTemplate: {
            type: String,
            required: true
        },
        notificationMessage: {
            type: String,
            required: true
        }
    },
    emits: ['close', 'send-message', 'update:notificationTemplate', 'update:notificationMessage'],
    setup(props, { emit }) {
        const templates = [
            { id: 'payment', name: 'Payment Reminder' },
            { id: 'status', name: 'Status Update' },
            { id: 'pickup', name: 'Ready for Pickup' },
            { id: 'delivery', name: 'Delivery Information' },
            { id: 'custom', name: 'Custom Message' }
        ];
        
        const selectedTemplate = ref(props.notificationTemplate);
        const message = ref(props.notificationMessage);
        
        watch(() => props.notificationTemplate, (newTemplate) => {
            selectedTemplate.value = newTemplate;
        });
        
        watch(() => props.notificationMessage, (newMessage) => {
            message.value = newMessage;
        });
        
        watch(selectedTemplate, (newTemplate) => {
            emit('update:notificationTemplate', newTemplate);
        });
        
        watch(message, (newMessage) => {
            emit('update:notificationMessage', newMessage);
        });
        
        const closeModal = () => {
            emit('close');
        };
        
        const sendMessage = () => {
            emit('send-message');
        };
        
        return {
            templates,
            selectedTemplate,
            message,
            closeModal,
            sendMessage
        };
    }
})
</script>

<template>
    <div v-if="show" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
            <div class="flex justify-between items-center mb-4">
                <h3 class="text-xl font-bold text-gray-800">Send Notification</h3>
                <button @click="closeModal" class="text-gray-500 hover:text-gray-700">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12">
                        </path>
                    </svg>
                </button>
            </div>
            
            <div v-if="order" class="mb-4">
                <p class="text-sm text-gray-600 mb-1">Sending to:</p>
                <p class="font-medium text-gray-800">{{ order.buyer.name }}</p>
                <div class="flex flex-col space-y-1 mt-1 text-sm text-gray-600">
                    <p>Order #{{ order.id }}</p>
                </div>
            </div>
            
            <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-2">Template</label>
                <div class="relative">
                    <select v-model="selectedTemplate"
                        class="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 rounded-lg">
                        <option v-for="template in templates" :key="template.id" :value="template.id">
                            {{ template.name }}
                        </option>
                    </select>
                </div>
            </div>
            
            <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-2">Message</label>
                <textarea v-model="message" rows="4"
                    class="block w-full p-3 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                    placeholder="Enter your message here..."></textarea>
                <p class="mt-1 text-xs text-gray-500">Characters: {{ message.length }}</p>
            </div>
            
            <div class="mt-6 flex justify-end space-x-3">
                <button @click="closeModal"
                    class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200">
                    Cancel
                </button>
                <button @click="sendMessage" 
                    class="px-4 py-2 bg-green-600 rounded-lg text-white hover:bg-green-700 transition-colors duration-200 flex items-center">
                    <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z">
                        </path>
                    </svg>
                    Send Message
                </button>
            </div>
        </div>
    </div>
</template>