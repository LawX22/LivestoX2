<script lang="ts">
import { defineComponent } from 'vue';
import { useRouter } from 'vue-router';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import Dropdown from 'primevue/dropdown';
import Badge from 'primevue/badge';
import Paginator from 'primevue/paginator';


export default defineComponent({
    name: 'FarmerDetails',
    components: {
        Button,
        InputText,
        Dropdown,
        Badge,
        Paginator
    },
    setup() {
        // Add router
        const router = useRouter();
        
        // Method to navigate to PostLivestockForms
        const postLivestocks = () => {
            router.push('/farmer/PostLivestockForms');
            console.log('Redirecting to /farmer/PostLivestockForms');
        };

        // Method to navigate to farmer profile
        const manageProfile = () => {
            router.push('/farmer/profile');
            console.log('Redirecting to /farmer/profile');
        };

        return {
          postLivestocks,
          manageProfile
        };
    }
});
</script>

<template>
    <div class="farmer-details-section">
        <!-- Hero/Banner Section with farm theme colors -->
        <div class="Header relative bg-gradient-to-br from-green-500 to-green-800 text-white overflow-hidden">
            <!-- Background Pattern -->
            <div class="absolute inset-0 opacity-10">
                <div class="absolute inset-0"
                    style="background-image: url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.4\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E');">
                </div>
            </div>

            <!-- Main Content -->
            <div class="container mx-auto px-4 py-16 md:py-24 relative z-10">
                <!-- Header Section -->
                <div class="flex flex-col items-center text-center mb-12">
                    <!-- Logo with improved animation -->
                    <div
                        class="bg-white p-4 rounded-full shadow-lg mb-6 transform transition duration-700 hover:scale-105">
                        <img src="/src/assets/vue.svg" alt="Farmer Portal Logo"
                            class="w-20 h-20 md:w-24 md:h-24" />
                    </div>

                    <!-- Heading with improved typography -->
                    <h1 class="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight tracking-tight">
                        Post Your Livestock <span class="block md:inline text-green-100">For Sale</span>
                    </h1>

                    <!-- Subheading with better contrast -->
                    <p class="text-xl text-green-50 mb-8 leading-relaxed max-w-2xl mx-auto">
                        List your premium livestock for sale and connect with buyers across the Philippines.
                    </p>

                    <!-- CTA Buttons - Adding multiple options -->
                    <div class="flex flex-col sm:flex-row gap-4 w-full justify-center">
                        <button @click="postLivestocks"
                            class="bg-white text-green-700 font-bold py-3 px-8 rounded-full shadow-lg hover:bg-green-50 hover:text-green-800 transform hover:scale-105 transition duration-300 flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20"
                                fill="currentColor">
                                <path fill-rule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
                                    clip-rule="evenodd" />
                            </svg>
                            Add New Livestock
                        </button>
                        <button @click="manageProfile"
                            class="bg-green-800 bg-opacity-60 text-white font-bold py-3 px-8 rounded-full shadow-lg hover:bg-green-900 transform hover:scale-105 transition duration-300 flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20"
                                fill="currentColor">
                                <path fill-rule="evenodd"
                                    d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                                    clip-rule="evenodd" />
                            </svg>
                            Update Farm Profile
                        </button>
                    </div>
                </div>

                <!-- Farmer Stats Bar -->
                <div
                    class="bg-white bg-opacity-80 rounded-lg shadow-md py-4 px-6 max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div class="text-center">
                        <p class="text-green-800 font-bold text-2xl md:text-3xl">12</p>
                        <p class="text-gray-600 text-sm">Active Listings</p>
                    </div>
                    <div class="text-center">
                        <p class="text-green-800 font-bold text-2xl md:text-3xl">45</p>
                        <p class="text-gray-600 text-sm">Total Sales</p>
                    </div>
                    <div class="text-center">
                        <p class="text-green-800 font-bold text-2xl md:text-3xl">4.8</p>
                        <p class="text-gray-600 text-sm">Farmer Rating</p>
                    </div>
                    <div class="text-center">
                        <p class="text-green-800 font-bold text-2xl md:text-3xl">3</p>
                        <p class="text-gray-600 text-sm">Years as Member</p>
                    </div>
                </div>
            </div>

            <!-- Decorative wave divider -->
            <div class="absolute bottom-0 left-0 right-0">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 100"
                    class="w-full h-auto text-white fill-current">
                    <path
                        d="M0,64L60,69.3C120,75,240,85,360,80C480,75,600,53,720,48C840,43,960,53,1080,58.7C1200,64,1320,64,1380,64L1440,64L1440,100L1380,100C1320,100,1200,100,1080,100C960,100,840,100,720,100C600,100,480,100,360,100C240,100,120,100,60,100L0,100Z">
                    </path>
                </svg>
            </div>
        </div>
    </div>
</template>

<style scoped>
/* Add any additional styles here */
.p-dropdown {
    height: auto !important;
}
</style>    