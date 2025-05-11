<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'LeftPanel',
  props: {
    currentStep: {
      type: Number,
      required: true
    }
  }
});
</script>

<template>
  <div class="hidden lg:block lg:w-2/5 bg-gradient-to-br from-emerald-700 to-emerald-800 relative overflow-hidden">
    
    <!-- Decorative background -->
    <div class="absolute inset-0 bg-[url('/api/placeholder/600/900')] opacity-10 bg-cover bg-center mix-blend-overlay"></div>
    
    <!-- Wavy bottom SVG -->
    <div class="absolute bottom-0 left-0 right-0 h-32 opacity-20 pointer-events-none select-none">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" fill="#ffffff">
        <path fill-opacity="1"
          d="M0,160L48,154.7C96,149,192,139,288,149.3C384,160,480,192,576,197.3C672,203,768,181,864,165.3C960,149,1056,139,1152,149.3C1248,160,1344,192,1392,208L1440,224L1440,320L0,320Z">
        </path>
      </svg>
    </div>

    <!-- Content -->
    <div class="relative z-10 h-full flex flex-col justify-between p-12 text-white">
      <!-- Top Section -->
      <div>
        <!-- Logo -->
        <div class="flex items-center space-x-3 mb-10">
          <div class="w-12 h-12 rounded-full bg-white flex items-center justify-center">
            <!-- PrimeVue logo -->
            <img src="/src/assets/vue.svg" alt="">
          </div>
          <span class="text-2xl font-extrabold tracking-wide">LivestoX</span>
        </div>

        <!-- Headline -->
        <h2 class="text-4xl font-extrabold mb-4 leading-snug">Welcome to LivestoX</h2>
        <p class="text-emerald-100 text-base mb-6 leading-relaxed max-w-md">
          Step into the future of smart farming. Manage your livestock, connect with the community,
          and explore tools designed to grow your business.
        </p>

        <!-- Feature highlights -->
        <div class="space-y-4">
          <div class="flex items-center gap-3">
            <div class="w-9 h-9 rounded-full bg-emerald-600 flex items-center justify-center shadow-md">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24"
                stroke="currentColor" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round"
                  d="M9 12.75L11.25 15 15 9.75" />
              </svg>
            </div>
            <span>Advanced farm analytics & insights</span>
          </div>

          <div class="flex items-center gap-3">
            <div class="w-9 h-9 rounded-full bg-emerald-600 flex items-center justify-center shadow-md">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24"
                stroke="currentColor" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round"
                  d="M9 12.75L11.25 15 15 9.75" />
              </svg>
            </div>
            <span>Seamless livestock inventory tracking</span>
          </div>

          <div class="flex items-center gap-3">
            <div class="w-9 h-9 rounded-full bg-emerald-600 flex items-center justify-center shadow-md">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24"
                stroke="currentColor" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round"
                  d="M9 12.75L11.25 15 15 9.75" />
              </svg>
            </div>
            <span>Connect with thousands of local farmers</span>
          </div>
        </div>
      </div>

      <!-- Help info -->
      <div class="text-sm text-emerald-200 flex items-center space-x-2 mt-10">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24"
          stroke="currentColor" stroke-width="1.5">
          <path stroke-linecap="round" stroke-linejoin="round"
            d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
        </svg>
        <span>Need help? <a href="mailto:support@livestox.com" class="underline hover:text-white">Contact us</a></span>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Add any scoped styles if needed */
</style>
