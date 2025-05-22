<script lang="ts">
import { defineComponent, PropType } from 'vue';

// Define the Animal interface
interface Animal {
  id: number | string;
  name: string;
  image: string;
  rating: number;
  type: string;
  breed: string;
  age: string | number;
  location: string;
  price: number;
  views: number;
  seller: string;
  listed: string;
  featured?: boolean;
  discount?: number;
  isNew?: boolean;
}

export default defineComponent({
  name: 'AnimalsMarketplace',
  props: {
    bestSellingAnimals: {
      type: Array as PropType<Animal[]>,
      required: true
    },
    recentlyAddedAnimals: {
      type: Array as PropType<Animal[]>,
      required: true
    }
  }
});
</script>

<template>
  <!-- Best Selling Animals -->
  <div class="mb-16">
    <slot name="title-best-selling"></slot>
    <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
      <div v-for="animal in bestSellingAnimals" :key="animal.id"
        class="group bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer">
        <!-- Featured Badge -->
        <div v-if="animal.featured"
          class="absolute top-4 left-4 z-20 bg-gradient-to-r from-emerald-500 to-blue-500 text-white px-3 py-1 rounded-full text-xs font-bold uppercase">
          Featured
        </div>

        <!-- Discount Badge -->
        <div v-if="animal.discount"
          class="absolute top-4 right-4 z-20 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold">
          -{{ animal.discount }}%
        </div>

        <div class="relative overflow-hidden">
          <img :src="animal.image" :alt="animal.name"
            class="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300">
          <div
            class="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-60 transition-opacity">
          </div>
        </div>

        <div class="p-6">
          <div class="flex items-center justify-between mb-3">
            <h4 class="text-xl font-bold text-slate-800 group-hover:text-emerald-600 transition-colors">{{
              animal.name }}</h4>
            <div class="flex items-center text-yellow-500">
              <svg class="w-4 h-4 fill-current" viewBox="0 0 20 20">
                <path
                  d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
              </svg>
              <span class="text-sm font-medium text-slate-600 ml-1">{{ animal.rating }}</span>
            </div>
          </div>

          <div class="space-y-2 mb-4">
            <div class="flex justify-between text-sm">
              <span class="text-slate-500">Type:</span>
              <span class="font-medium text-slate-700">{{ animal.type }}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-slate-500">Breed:</span>
              <span class="font-medium text-slate-700">{{ animal.breed }}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-slate-500">Age:</span>
              <span class="font-medium text-slate-700">{{ animal.age }}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-slate-500">Location:</span>
              <span class="font-medium text-slate-700">{{ animal.location }}</span>
            </div>
          </div>

          <div class="flex items-center justify-between mb-4">
            <div class="text-2xl font-black text-emerald-600">${{ animal.price.toLocaleString() }}</div>
            <div class="text-xs text-slate-500">{{ animal.views }} views</div>
          </div>

          <div class="flex items-center justify-between text-xs text-slate-500 mb-4">
            <span>{{ animal.seller }}</span>
            <span>{{ animal.listed }}</span>
          </div>

          <button
            class="w-full bg-gradient-to-r from-emerald-500 to-blue-500 text-white py-3 rounded-xl font-bold hover:from-emerald-600 hover:to-blue-600 transition-all shadow-lg group-hover:shadow-xl">
            View Details
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Recently Added Animals -->
  <div>
    <slot name="title-recently-added"></slot>
    <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
      <div v-for="animal in recentlyAddedAnimals" :key="animal.id"
        class="group bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer">
        <!-- New Badge -->
        <div v-if="animal.isNew"
          class="absolute top-4 left-4 z-20 bg-gradient-to-r from-pink-500 to-red-500 text-white px-3 py-1 rounded-full text-xs font-bold uppercase animate-pulse">
          New
        </div>

        <!-- Featured Badge -->
        <div v-if="animal.featured"
          class="absolute top-4 right-4 z-20 bg-gradient-to-r from-emerald-500 to-blue-500 text-white px-3 py-1 rounded-full text-xs font-bold uppercase">
          Featured
        </div>

        <div class="relative overflow-hidden">
          <img :src="animal.image" :alt="animal.name"
            class="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300">
          <div
            class="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-60 transition-opacity">
          </div>
        </div>

        <div class="p-6">
          <div class="flex items-center justify-between mb-3">
            <h4 class="text-xl font-bold text-slate-800 group-hover:text-emerald-600 transition-colors">{{
              animal.name }}</h4>
            <div class="flex items-center text-yellow-500">
              <svg class="w-4 h-4 fill-current" viewBox="0 0 20 20">
                <path
                  d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
              </svg>
              <span class="text-sm font-medium text-slate-600 ml-1">{{ animal.rating }}</span>
            </div>
          </div>

          <div class="space-y-2 mb-4">
            <div class="flex justify-between text-sm">
              <span class="text-slate-500">Type:</span>
              <span class="font-medium text-slate-700">{{ animal.type }}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-slate-500">Breed:</span>
              <span class="font-medium text-slate-700">{{ animal.breed }}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-slate-500">Age:</span>
              <span class="font-medium text-slate-700">{{ animal.age }}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-slate-500">Location:</span>
              <span class="font-medium text-slate-700">{{ animal.location }}</span>
            </div>
          </div>

          <div class="flex items-center justify-between mb-4">
            <div class="text-2xl font-black text-emerald-600">${{ animal.price.toLocaleString() }}</div>
            <div class="text-xs text-slate-500">{{ animal.views }} views</div>
          </div>

          <div class="flex items-center justify-between text-xs text-slate-500 mb-4">
            <span>{{ animal.seller }}</span>
            <span>{{ animal.listed }}</span>
          </div>

          <button
            class="w-full bg-gradient-to-r from-emerald-500 to-blue-500 text-white py-3 rounded-xl font-bold hover:from-emerald-600 hover:to-blue-600 transition-all shadow-lg group-hover:shadow-xl">
            View Details
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- View All Button -->
  <div class="text-center mt-16">
    <slot name="button"></slot>
  </div>
</template>