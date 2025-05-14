<script lang="ts">
import { defineComponent } from 'vue';

interface Step {
  id: number;
  title: string;
  description: string;
  icon: string;
}

export default defineComponent({
  name: 'HowItWorksSection',
  props: {
    title: {
      type: String,
      default: 'How Our Platform Works'
    },
    subtitle: {
      type: String,
      default: 'Process'
    },
    description: {
      type: String,
      default: 'Simple steps to connect farmers and buyers in our trusted marketplace.'
    },
    steps: {
      type: Array as () => Step[],
      default: () => [
        {
          id: 1,
          title: 'Create Account',
          description: 'Sign up for free and complete your profile with your farm details and location.',
          icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
        },
        {
          id: 2,
          title: 'Browse or List',
          description: 'Search for animals or create detailed listings with health records and documentation.',
          icon: 'M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z'
        },
        {
          id: 3,
          title: 'Connect',
          description: 'Message sellers directly, ask questions, and arrange visits to view animals in person.',
          icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z'
        },
        {
          id: 4,
          title: 'Complete Sale',
          description: 'Finalize transactions securely and leave reviews to build our trusted community.',
          icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
        }
      ]
    },
    bgColor: {
      type: String,
      default: 'bg-gray-50'
    }
  }
});
</script>

<template>
  <section :class="['py-20', bgColor]">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-16">
        <span class="text-emerald-600 font-semibold uppercase tracking-wider">{{ subtitle }}</span>
        <h2 class="text-4xl font-extrabold text-gray-900 mt-2">{{ title }}</h2>
        <p class="text-lg text-gray-600 mt-4 max-w-2xl mx-auto">{{ description }}</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div v-for="step in steps" :key="step.id"
          class="bg-white rounded-2xl shadow-lg p-8 relative hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 text-center">
          <div class="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-emerald-600" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="step.icon" />
            </svg>
          </div>
          <div
            class="absolute -top-4 -right-4 bg-emerald-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-lg">
            {{ step.id }}</div>
          <h3 class="text-xl font-bold text-gray-900 mb-4">{{ step.title }}</h3>
          <p class="text-gray-600">{{ step.description }}</p>
        </div>
      </div>
    </div>
  </section>
</template>