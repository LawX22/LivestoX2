<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'HowItWork'
});
</script>

<template>
  <div class="grid md:grid-cols-3 gap-12">
    <!-- Step 1 -->
    <div class="text-center group">
      <div class="relative mb-8">
        <div
          class="w-24 h-24 bg-gradient-to-r from-emerald-500 to-blue-500 text-white rounded-3xl flex items-center justify-center font-black text-3xl mx-auto mb-6 group-hover:scale-110 transition-transform shadow-2xl">
          1
        </div>
        <div
          class="absolute -top-4 -right-4 w-8 h-8 bg-emerald-400 rounded-full opacity-20 group-hover:opacity-100 transition-opacity">
        </div>
      </div>
      <h3 class="text-2xl font-bold mb-4 text-white">Start as Buyer</h3>
      <p class="text-slate-300 leading-relaxed">
        Create your account and start browsing thousands of verified animals. As a buyer, you can search, view details, and purchase livestock from verified farmers.
      </p>
      <div class="mt-4 px-3 py-1 bg-emerald-500/20 rounded-full text-emerald-300 text-sm inline-block">
        Default Account Type
      </div>
    </div>

    <!-- Step 2 -->
    <div class="text-center group">
      <div class="relative mb-8">
        <div
          class="w-24 h-24 bg-gradient-to-r from-blue-500 to-violet-500 text-white rounded-3xl flex items-center justify-center font-black text-3xl mx-auto mb-6 group-hover:scale-110 transition-transform shadow-2xl">
          2
        </div>
        <div
          class="absolute -top-4 -right-4 w-8 h-8 bg-blue-400 rounded-full opacity-20 group-hover:opacity-100 transition-opacity">
        </div>
      </div>
      <h3 class="text-2xl font-bold mb-4 text-white">Upgrade to Farmer</h3>
      <p class="text-slate-300 leading-relaxed">
        Ready to sell? Upgrade your account to become a verified farmer. Submit your farm credentials and get approved to list and sell your own livestock.
      </p>
      <div class="mt-4 px-3 py-1 bg-blue-500/20 rounded-full text-blue-300 text-sm inline-block">
        Verification Required
      </div>
    </div>

    <!-- Step 3 -->
    <div class="text-center group">
      <div class="relative mb-8">
        <div
          class="w-24 h-24 bg-gradient-to-r from-violet-500 to-pink-500 text-white rounded-3xl flex items-center justify-center font-black text-3xl mx-auto mb-6 group-hover:scale-110 transition-transform shadow-2xl">
          3
        </div>
        <div
          class="absolute -top-4 -right-4 w-8 h-8 bg-violet-400 rounded-full opacity-20 group-hover:opacity-100 transition-opacity">
        </div>
      </div>
      <h3 class="text-2xl font-bold mb-4 text-white">Buy & Sell Freely</h3>
      <p class="text-slate-300 leading-relaxed">
        With full access, connect directly with other farmers and buyers. Secure payments, logistics coordination, and all paperwork handled seamlessly.
      </p>
      <div class="mt-4 px-3 py-1 bg-violet-500/20 rounded-full text-violet-300 text-sm inline-block">
        Complete Access
      </div>
    </div>
  </div>

  <!-- Additional Info Section -->
  <div class="mt-12 bg-slate-800/50 rounded-2xl p-8 border border-slate-700">
    <div class="grid md:grid-cols-2 gap-8 items-center">
      <div>
        <h4 class="text-xl font-bold text-white mb-4">Account Types Explained</h4>
        <div class="space-y-3">
          <div class="flex items-start gap-3">
            <div class="w-2 h-2 bg-emerald-400 rounded-full mt-2 flex-shrink-0"></div>
            <div>
              <p class="text-white font-medium">Buyer Account (Default)</p>
              <p class="text-slate-400 text-sm">Browse, search, and purchase animals from verified sellers</p>
            </div>
          </div>
          <div class="flex items-start gap-3">
            <div class="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
            <div>
              <p class="text-white font-medium">Farmer Account (Upgraded)</p>
              <p class="text-slate-400 text-sm">All buyer features plus ability to list and sell your livestock</p>
            </div>
          </div>
        </div>
      </div>
      <div class="text-center">
        <div class="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-violet-500 text-white px-6 py-3 rounded-xl font-medium">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          Verification Process Required
        </div>
      </div>
    </div>
  </div>

  <!-- CTA Button -->
  <div class="text-center mt-16">
    <slot name="button"></slot>
  </div>
</template>