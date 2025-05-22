<script lang="ts">
import { defineComponent, PropType, ref } from 'vue';
import Avatar from 'primevue/avatar';
import Rating from 'primevue/rating';
import Button from 'primevue/button';
import Divider from 'primevue/divider';
import Dialog from 'primevue/dialog'; // Added Dialog import

interface Seller {
  id: number;
  name: string;
  avatarUrl?: string;
  rating: number;
  reviewCount: number;
  showPhoneNumber: boolean;
  phoneNumber?: string;
  memberSince: number;
  responseTime: string;
  totalListings: number;
}

export default defineComponent({
    name: 'SellerInfoCard',
    components: {
        Avatar,
        Rating,
        Button,
        Divider,
        Dialog // Added Dialog to components
    },
    props: {
        seller: {
            type: Object as PropType<Seller>,
            required: true
        }
    },
    emits: ['contactSeller', 'callSeller', 'viewSellerProfile'],
    setup(_props, { emit }) {
        const contactDialogVisible = ref(false);
        const contactMessage = ref('');

        const contactSeller = () => {
            contactDialogVisible.value = true;
            emit('contactSeller');
        };

        const callSeller = () => {
            emit('callSeller');
        };

        const viewSellerProfile = () => {
            emit('viewSellerProfile');
        };

        const sendMessage = () => {
            // In a real app, this would send the message to your backend
            alert(`Message sent: ${contactMessage.value}`);
            contactMessage.value = '';
            contactDialogVisible.value = false;
        };

        return {
            contactDialogVisible,
            contactMessage,
            contactSeller,
            callSeller,
            viewSellerProfile,
            sendMessage
        };
    }
});
</script>

<template>
    <div class="bg-white rounded-2xl shadow-lg overflow-hidden transform hover:shadow-xl transition-all duration-300">
        <div class="bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-4">
            <h3 class="text-lg font-bold text-white flex items-center">
                <i class="pi pi-user mr-2"></i> Seller Information
            </h3>
        </div>
        <div class="p-6">
            <div class="flex items-center gap-4 mb-6">
                <Avatar :image="seller.avatarUrl" :label="seller.name.charAt(0)" size="xlarge" shape="circle"
                    class="shadow-md border-4 border-emerald-100" />
                <div class="flex-1">
                    <h4 class="text-xl font-bold text-gray-800 mb-1">{{ seller.name }}</h4>
                    <div class="flex items-center gap-2 mb-2">
                        <Rating :modelValue="seller.rating" :readonly="true" :cancel="false" />
                        <span class="text-sm text-gray-600">({{ seller.reviewCount }} reviews)</span>
                    </div>
                    <button class="text-emerald-600 hover:text-emerald-700 font-medium text-sm transition-colors"
                        @click="viewSellerProfile">
                        View Full Profile →
                    </button>
                </div>
            </div>

            <div class="space-y-4">
                <Button label="Send Message" icon="pi pi-envelope"
                    class="w-full p-button-outlined border-emerald-500 text-emerald-600 hover:bg-emerald-50 py-3 rounded-full font-medium transition-all duration-300"
                    @click="contactSeller" />

            </div>

            <Divider class="my-6" />

            <div class="space-y-4">
                <div class="flex items-center justify-between">
                    <span class="text-gray-600">Member since</span>
                    <span class="font-medium text-gray-800">{{ seller.memberSince }}</span>
                </div>
                <div class="flex items-center justify-between">
                    <span class="text-gray-600">Response time</span>
                    <span class="font-medium text-gray-800">Within 2 hours</span>
                </div>
                <div class="flex items-center justify-between">
                    <span class="text-gray-600">Total listings</span>
                    <span class="font-medium text-gray-800">25 active</span>
                </div>
            </div>
        </div>

        <!-- Contact Dialog -->
        <Dialog v-model:visible="contactDialogVisible" modal header="Contact Seller"
            class="w-full max-w-lg mx-auto rounded-2xl overflow-hidden" position="top">
            <div class="p-4">
                <div class="flex items-center mb-6">
                    <Avatar v-if="seller.avatarUrl" :image="seller.avatarUrl" shape="circle" class="mr-3"
                        size="large" />
                    <Avatar v-else icon="pi pi-user" shape="circle" class="mr-3 bg-emerald-200" size="large" />
                    <div>
                        <h3 class="font-medium text-gray-800">{{ seller.name }}</h3>
                        <div class="flex items-center text-sm text-gray-600">
                            <i class="pi pi-clock mr-1"></i>
                            <span>Typically responds {{ seller.responseTime }}</span>
                        </div>
                    </div>
                </div>

                <div class="mb-4">
                    <label for="message" class="block text-sm font-medium text-gray-700 mb-2">Your Message</label>
                    <textarea v-model="contactMessage" id="message" rows="5"
                        placeholder="Hello, I'm interested in your livestock listing. Is it still available?"
                        class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"></textarea>
                </div>

                <div class="flex justify-end space-x-3">
                    <Button label="Cancel" class="p-button-outlined p-button-secondary"
                        @click="contactDialogVisible = false" />
                    <Button label="Send Message" icon="pi pi-send" class="p-button-success" @click="sendMessage" />
                </div>
            </div>
        </Dialog>
    </div>
</template>