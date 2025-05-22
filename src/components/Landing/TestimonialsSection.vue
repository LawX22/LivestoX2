<script lang="ts">
import { defineComponent, PropType } from 'vue';

interface Testimonial {
  name: string;
  image: string;
  farm: string;
  state: string;
  memberSince: string;
  text: string;
}

export default defineComponent({
  name: 'TestimonialsSection',
  props: {
    testimonials: {
      type: Array as PropType<Testimonial[]>,
      required: true
    }
  }
});
</script>

<template>
  <div class="grid md:grid-cols-3 gap-8">
    <div v-for="testimonial in testimonials" :key="testimonial.name"
      class="bg-gradient-to-br from-slate-50 to-white border border-slate-200 rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105">
      <div class="flex items-center mb-6">
        <img :src="testimonial.image" :alt="testimonial.name" class="w-16 h-16 rounded-full object-cover mr-4">
        <div>
          <div class="font-bold text-slate-800">{{ testimonial.name }}</div>
          <div class="text-slate-600">{{ testimonial.farm }}</div>
          <div class="text-xs text-slate-500">{{ testimonial.state }} • Member since {{ testimonial.memberSince }}
          </div>
        </div>
      </div>

      <blockquote class="text-slate-700 leading-relaxed mb-6 italic">
        "{{ testimonial.text }}"
      </blockquote>

      <div class="flex text-yellow-500">
        <svg class="w-5 h-5 fill-current" viewBox="0 0 20 20">
          <path
            d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
        </svg>
        <svg class="w-5 h-5 fill-current" viewBox="0 0 20 20">
          <path
            d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
        </svg>
        <svg class="w-5 h-5 fill-current" viewBox="0 0 20 20">
          <path
            d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
        </svg>
        <svg class="w-5 h-5 fill-current" viewBox="0 0 20 20">
          <path
            d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
        </svg>
        <svg class="w-5 h-5 fill-current" viewBox="0 0 20 20">
          <path
            d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
        </svg>
      </div>
    </div>
  </div>

  <!-- Trust Indicators -->
  <div class="mt-20 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-3xl p-12 text-white text-center">
    <slot name="trust-title"></slot>
    <div class="grid grid-cols-2 md:grid-cols-4 gap-8">
      <div>
        <div class="text-4xl font-black mb-2">98%</div>
        <div class="text-emerald-100">Satisfaction Rate</div>
      </div>
      <div>
        <div class="text-4xl font-black mb-2">24/7</div>
        <div class="text-emerald-100">Customer Support</div>
      </div>
      <div>
        <div class="text-4xl font-black mb-2">100%</div>
        <div class="text-emerald-100">Verified Sellers</div>
      </div>
      <div>
        <div class="text-4xl font-black mb-2">$0</div>
        <div class="text-emerald-100">Hidden Fees</div>
      </div>
    </div>
  </div>
</template>