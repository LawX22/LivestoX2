<script setup>
import { defineProps } from 'vue';
import { useRouter } from 'vue-router';

const props = defineProps({
  listings: {
    type: Array,
    required: true
  },
  formatToPHP: {
    type: Function,
    required: true
  }
});

const router = useRouter();

const viewAllListings = () => {
  router.push('/farmer/YourLivestocks');
};


const getStatusBadgeClass = (status) => {
  switch (status.toLowerCase()) {
    case 'active':
      return 'bg-green-100 text-green-800';
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'sold':
      return 'bg-blue-100 text-blue-800';
    case 'inactive':
      return 'bg-gray-100 text-gray-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};
</script>

<template>
  <section class="mb-10 bg-white rounded-2xl shadow-lg p-6 border border-neutral-100 hover:shadow-xl transition-shadow duration-300">

    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold text-green-800 flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
        </svg>
        Current Livestock Listings
      </h2>
      <div class="flex space-x-3">
        <button @click="viewAllListings" class="text-green-600 hover:text-green-800 text-sm flex items-center">
          <span>View All</span>
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </button>
      </div>
    </div>

    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-neutral-200">
        <thead>
          <tr>
            <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
              Title
            </th>
            <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
              Breed
            </th>
            <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
              Age
            </th>
            <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
              Price
            </th>
            <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
              Status
            </th>
            <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
              Quantity
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-neutral-200">
          <tr v-for="listing in listings" :key="listing.id" class="hover:bg-green-50 transition-colors duration-200">
            <td class="px-4 py-4 whitespace-nowrap">
              <div class="text-sm font-medium text-neutral-800">{{ listing.title }}</div>
            </td>
            <td class="px-4 py-4 whitespace-nowrap">
              <div class="text-sm text-neutral-600">{{ listing.breed }}</div>
            </td>
            <td class="px-4 py-4 whitespace-nowrap">
              <div class="text-sm text-neutral-600">{{ listing.age }}</div>
            </td>
            <td class="px-4 py-4 whitespace-nowrap">
              <div class="text-sm font-medium text-green-700">{{ formatToPHP(listing.price) }}</div>
            </td>
            <td class="px-4 py-4 whitespace-nowrap">
              <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                :class="getStatusBadgeClass(listing.status)">
                {{ listing.status }}
              </span>
            </td>
            <td class="px-4 py-4 whitespace-nowrap text-sm text-neutral-600">
              {{ listing.quantity }} head
            </td>
          </tr>

          <!-- Empty state when no listings are available -->
          <tr v-if="listings.length === 0">
            <td colspan="6" class="px-4 py-8 text-center">
              <div class="flex flex-col items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-neutral-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
                <p class="text-neutral-500 text-lg font-medium">No livestock listings available</p>
                <p class="text-neutral-400 text-sm mt-1">Please check back later for new listings.</p>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>
