<script lang="ts">
import { defineComponent, PropType } from 'vue';

interface Testimonial {
  text: string;
  name: string;
  farm: string;
  image: string;
  state: string;
  memberSince: string;
}

export default defineComponent({
  name: 'TestimonialsSection',
  props: {
    testimonials: {
      type: Array as PropType<Testimonial[]>,
      required: true
    },
    title: {
      type: String,
      default: 'What Our Community Says'
    },
    description: {
      type: String,
      default: 'Hear from farmers who have successfully bought, sold, and learned on our platform.'
    }
  }
});
</script>

<template>
  <section class="py-20 bg-white relative overflow-hidden">
    <div class="absolute top-20 right-0 w-96 h-96 bg-emerald-100 rounded-full filter blur-3xl opacity-30"></div>
    <div class="absolute bottom-20 left-0 w-96 h-96 bg-emerald-100 rounded-full filter blur-3xl opacity-30"></div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
      <div class="text-center mb-16">
        <span class="text-emerald-600 font-semibold uppercase tracking-wider">Testimonials</span>
        <h2 class="text-4xl font-extrabold text-gray-900 mt-2">{{ title }}</h2>
        <p class="text-lg text-gray-600 mt-4 max-w-2xl mx-auto">{{ description }}</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div v-for="(testimonial, index) in testimonials" :key="index"
          class="bg-white rounded-2xl shadow-lg p-8 relative hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
          <div
            class="absolute top-0 right-0 transform translate-x-2 -translate-y-2 text-6xl text-emerald-200 opacity-50 pointer-events-none font-serif">
            "</div>

          <p class="text-gray-600 mb-6 relative">{{ testimonial.text }}</p>

          <div class="flex items-center">
            <img :src="testimonial.image" :alt="testimonial.name" class="w-12 h-12 rounded-full mr-4">
            <div>
              <h4 class="font-bold text-gray-900">{{ testimonial.name }}</h4>
              <p class="text-sm text-gray-500">{{ testimonial.farm }}, {{ testimonial.state }}</p>
              <p class="text-xs text-emerald-600 mt-1">Member since {{ testimonial.memberSince }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>