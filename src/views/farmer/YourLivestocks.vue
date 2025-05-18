<script setup lang="ts">
import { useRouter } from 'vue-router';
import Cards from '../../components/Main/Market/Cards.vue'; 

const router = useRouter();

// Navigation functions
const goBack = () => {
  router.back();
};

const goToAddLivestockForm = () => {
  router.push('/farmer/PostLivestockForms');
};
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Header Navigation -->
    <div class="flex items-center justify-between mb-6">
      <button @click="goBack" class="text-sm text-gray-600 hover:text-gray-800 flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24"
          stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        Go Back
      </button>
      
      <h1 class="text-2xl font-bold text-gray-900">My Livestock Posts</h1>
      
      <button @click="goToAddLivestockForm" class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Add Livestock
      </button>
    </div>

    <!-- Cards Component -->
    <Cards />
  </div>
</template>