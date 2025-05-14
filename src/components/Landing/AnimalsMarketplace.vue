<script lang="ts">
import { defineComponent, PropType } from 'vue';

interface AnimalListing {
  id: number;
  name: string;
  type: string;
  breed: string;
  age: string;
  price: number;
  image: string;
  seller: string;
  location: string;
  rating: number;
  listed: string;
  views: number;
  isNew?: boolean;
  featured?: boolean;
  discount?: number;
}

export default defineComponent({
  name: 'AnimalsMarketplace',
  props: {
    bestSellingAnimals: {
      type: Array as PropType<AnimalListing[]>,
      required: true
    },
    recentlyAddedAnimals: {
      type: Array as PropType<AnimalListing[]>,
      required: true
    },
    title: {
      type: String,
      default: 'Animal Marketplace'
    },
    description: {
      type: String,
      default: 'Discover quality livestock from our trusted sellers with verified health records and thorough documentation.'
    }
  }
});
</script>

<template>
  <section class="py-20 bg-white relative overflow-hidden">

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
      <div class="flex flex-col md:flex-row justify-between items-center mb-16">
        <div>
          <span class="text-emerald-600 font-semibold uppercase tracking-wider">Premium selections</span>
          <h2 class="text-4xl font-extrabold text-gray-900 mt-2">{{ title }}</h2>
          <p class="text-lg text-gray-600 mt-4 max-w-2xl">{{ description }}</p>
        </div>

        <div class="mt-8 md:mt-0 flex items-center space-x-4">
          <div class="bg-emerald-100 text-emerald-800 font-bold px-6 py-3 rounded-xl shadow-sm flex items-center">
            <span class="inline-flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              Filter Animals
            </span>
          </div>

          <button
            class="bg-white text-gray-800 border border-gray-300 font-bold px-6 py-3 rounded-xl shadow-sm hover:bg-gray-50 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7" />
            </svg>
            Sort By
          </button>

          <a href="#" class="text-emerald-600 font-bold hover:text-emerald-700 hover:underline flex items-center">
            View All
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 ml-1" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>

      <!-- Best Selling Animals -->
      <div>
        <h3 class="text-2xl font-bold text-gray-900 mb-8">Best Selling Animals</h3>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <!-- Animal Cards -->
          <div v-for="animal in bestSellingAnimals" :key="animal.id"
            class="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
            <!-- Featured badge if applicable -->
            <div v-if="animal.featured" class="absolute top-4 left-4">
              <div
                class="bg-yellow-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
                Featured
              </div>
            </div>

            <!-- Discount tag if applicable -->
            <div v-if="animal.discount" class="absolute top-4 right-4">
              <div class="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {{ animal.discount }}% OFF
              </div>
            </div>

            <div class="relative">
              <img :src="animal.image" :alt="animal.name" class="w-full h-56 object-cover">
              <div class="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-60">
              </div>
              <div class="absolute bottom-4 left-4">
                <span class="bg-emerald-600 text-white text-xs font-medium px-2 py-1 rounded-full">{{ animal.type
                  }}</span>
                <span class="bg-gray-800 bg-opacity-75 text-white text-xs font-medium px-2 py-1 rounded-full ml-2">{{
                  animal.views }} views</span>
              </div>
            </div>

            <div class="p-6">
              <div class="flex justify-between items-start mb-2">
                <h4 class="text-xl font-bold text-gray-900">{{ animal.name }}</h4>
                <div class="flex items-center bg-emerald-50 px-2 py-1 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-yellow-500" fill="currentColor"
                    viewBox="0 0 24 24">
                    <path
                      d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                  </svg>
                  <span class="text-sm font-medium text-gray-700 ml-1">{{ animal.rating }}</span>
                </div>
              </div>

              <div class="text-sm text-gray-600 mb-4">
                <div class="flex items-center mb-1">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-400 mr-1" fill="none"
                    viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                  {{ animal.breed }}
                </div>
                <div class="flex items-center mb-1">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-400 mr-1" fill="none"
                    viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {{ animal.age }}
                </div>
                <div class="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-400 mr-1" fill="none"
                    viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {{ animal.location }}
                </div>
              </div>

              <div class="flex items-center justify-between mb-6">
                <div>
                  <span class="text-xs text-gray-500">Listed {{ animal.listed }}</span>
                </div>
                <div>
                  <span class="text-xs text-gray-500">By {{ animal.seller }}</span>
                </div>
              </div>

              <div class="flex items-center justify-between">
                <div>
                  <span class="text-2xl font-bold text-emerald-600">${{ animal.price.toLocaleString() }}</span>
                  <span v-if="animal.discount" class="text-sm text-gray-500 line-through ml-2">${{
                    Math.round(animal.price / (1 - animal.discount / 100)).toLocaleString() }}</span>
                </div>
                <button
                  class="bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-4 py-2 rounded-lg transition-colors duration-300 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  View Details
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Recently Added Animals -->
      <div class="mt-20">
        <h3 class="text-2xl font-bold text-gray-900 mb-8">Recently Added Animals</h3>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <!-- Animal Cards (similar structure as best selling) -->
          <div v-for="animal in recentlyAddedAnimals" :key="animal.id"
            class="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
            <!-- New badge if applicable -->
            <div v-if="animal.isNew" class="absolute top-4 left-4">
              <div class="bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                New
              </div>
            </div>

            <!-- Featured badge if applicable -->
            <div v-if="animal.featured" class="absolute top-4 right-4">
              <div
                class="bg-yellow-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
                Featured
              </div>
            </div>

            <div class="relative">
              <img :src="animal.image" :alt="animal.name" class="w-full h-56 object-cover">
              <div class="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-60">
              </div>
              <div class="absolute bottom-4 left-4">
                <span class="bg-emerald-600 text-white text-xs font-medium px-2 py-1 rounded-full">{{ animal.type
                  }}</span>
                <span class="bg-gray-800 bg-opacity-75 text-white text-xs font-medium px-2 py-1 rounded-full ml-2">{{
                  animal.views }} views</span>
              </div>
            </div>

            <div class="p-6">
              <div class="flex justify-between items-start mb-2">
                <h4 class="text-xl font-bold text-gray-900">{{ animal.name }}</h4>
                <div class="flex items-center bg-emerald-50 px-2 py-1 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-yellow-500" fill="currentColor"
                    viewBox="0 0 24 24">
                    <path
                      d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                  </svg>
                  <span class="text-sm font-medium text-gray-700 ml-1">{{ animal.rating }}</span>
                </div>
              </div>

              <div class="text-sm text-gray-600 mb-4">
                <div class="flex items-center mb-1">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-400 mr-1" fill="none"
                    viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                  {{ animal.breed }}
                </div>
                <div class="flex items-center mb-1">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-400 mr-1" fill="none"
                    viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {{ animal.age }}
                </div>
                <div class="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-400 mr-1" fill="none"
                    viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {{ animal.location }}
                </div>
              </div>

              <div class="flex items-center justify-between mb-6">
                <div>
                  <span class="text-xs text-gray-500">Listed {{ animal.listed }}</span>
                </div>
                <div>
                  <span class="text-xs text-gray-500">By {{ animal.seller }}</span>
                </div>
              </div>

              <div class="flex items-center justify-between">
                <div>
                  <span class="text-2xl font-bold text-emerald-600">${{ animal.price.toLocaleString() }}</span>
                  <span v-if="animal.discount" class="text-sm text-gray-500 line-through ml-2">${{
                    Math.round(animal.price / (1 - animal.discount / 100)).toLocaleString() }}</span>
                </div>
                <button
                  class="bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-4 py-2 rounded-lg transition-colors duration-300 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  View Details
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>