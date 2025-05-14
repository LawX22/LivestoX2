<script lang="ts">
import { defineComponent } from 'vue';

interface AnimalCategory {
  value: string;
  label: string;
  count: number;
  icon: string;
}

export default defineComponent({
  name: 'CategoriesSection',
  props: {
    title: {
      type: String,
      default: 'Find Your Perfect Farm Animal'
    },
    description: {
      type: String,
      default: 'Browse by category'
    },
    categories: {
      type: Array as () => AnimalCategory[],
      required: true
    }
  },
  setup() {
    return {};
  }
});
</script>

<template>
  <section class="py-16 bg-gray-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-12">
        <span class="text-emerald-600 text-sm font-medium uppercase tracking-wider">{{ description }}</span>
        <h2 class="text-3xl font-semibold text-gray-900 mt-2">{{ title }}</h2>
        <div class="w-16 h-1 bg-emerald-500 mx-auto mt-4"></div>
      </div>

      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-5">
        <div 
          v-for="category in categories" 
          :key="category.value"
          class="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden group relative"
        >
          <div class="bg-emerald-50 p-5 text-center group-hover:bg-emerald-100 transition-all duration-300">
            <div class="text-3xl mb-2">{{ category.icon }}</div>
            <h3 class="font-medium text-gray-900">{{ category.label }}</h3>
            <p class="text-emerald-600 text-xs mt-1">{{ category.count.toLocaleString() }} listings</p>
            <div class="absolute bottom-0 left-0 w-full h-0.5 bg-emerald-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>