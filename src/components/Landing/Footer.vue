<script>
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'AppFooter',
  setup() {
    const footerSections = [
      {
        title: 'Marketplace',
        links: [
          { name: 'Browse Animals', href: '#' },
          { name: 'Sell Animals', href: '#' },
          { name: 'Featured Listings', href: '#' },
          { name: 'Recently Added', href: '#' }
        ]
      },
      {
        title: 'Community',
        links: [
          { name: 'Forum', href: '#' },
          { name: 'Success Stories', href: '#' },
          { name: 'Expert Advice', href: '#' },
          { name: 'Farmer Network', href: '#' }
        ]
      },
      {
        title: 'Resources',
        links: [
          { name: 'Health Guides', href: '#' },
          { name: 'Breeding Tips', href: '#' },
          { name: 'Care Manuals', href: '#' },
          { name: 'Market Insights', href: '#' }
        ]
      },
      {
        title: 'Support',
        links: [
          { name: 'Help Center', href: '#' },
          { name: 'Contact Us', href: '#' },
          { name: 'Live Chat', href: '#' },
          { name: 'FAQ', href: '#' }
        ]
      }
    ];

    const legalLinks = [
      { name: 'Privacy Policy', href: '#' },
      { name: 'Terms of Service', href: '#' },
      { name: 'Cookie Policy', href: '#' },
      { name: 'Data Protection', href: '#' }
    ];

    const socialLinks = [
      { 
        name: 'Facebook', 
        href: '#',
        icon: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z'
      },
      { 
        name: 'Instagram', 
        href: '#',
        icon: 'M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987c6.62 0 11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM12 6.492c3.018 0 5.508 2.49 5.508 5.508S15.018 17.508 12 17.508S6.492 15.018 6.492 12S8.982 6.492 12 6.492zm6.216-3.924c0 .715-.582 1.297-1.297 1.297s-1.297-.582-1.297-1.297s.582-1.297 1.297-1.297s1.297.582 1.297 1.297z'
      },
      { 
        name: 'Twitter', 
        href: '#',
        icon: 'M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z'
      },
      { 
        name: 'LinkedIn', 
        href: '#',
        icon: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z'
      }
    ];

    const scrollToTop = () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    };

    return {
      footerSections,
      legalLinks,
      socialLinks,
      scrollToTop,
      currentYear: new Date().getFullYear()
    };
  }
});
</script>

<template>
  <footer class="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
    <!-- Background Pattern -->
    <div class="absolute inset-0 opacity-5">
      <div class="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500 rounded-full blur-3xl"></div>
      <div class="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500 rounded-full blur-3xl"></div>
    </div>
    
    <!-- Back to Top Button -->
    <div class="absolute top-6 right-6 z-20">
      <button 
        @click="scrollToTop"
        class="w-12 h-12 bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 rounded-full flex items-center justify-center text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 group"
        aria-label="Back to top"
      >
        <svg class="w-6 h-6 transform group-hover:-translate-y-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18"/>
        </svg>
      </button>
    </div>
    
    <!-- Main Footer Content -->
    <div class="relative z-10">
      <!-- Main Footer Links -->
      <div class="max-w-7xl mx-auto px-4 py-16">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 lg:gap-12">
          <!-- Brand Section -->
          <div class="lg:col-span-2 space-y-6">
            <div>
              <h3 class="text-3xl font-black text-white mb-4">
                <span class="bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
                  LivestoX
                </span>
              </h3>
              <p class="text-slate-300 text-lg leading-relaxed">
                Connecting farmers worldwide with premium livestock. Your trusted marketplace for quality animals and expert knowledge.
              </p>
            </div>
            
            <!-- Trust Badges -->
            <div class="flex flex-wrap gap-3">
              <div class="inline-flex items-center gap-2 bg-emerald-500 bg-opacity-10 border border-emerald-500 border-opacity-30 text-emerald-400 px-3 py-2 rounded-lg text-sm font-semibold">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                </svg>
                VERIFIED
              </div>
              <div class="inline-flex items-center gap-2 bg-blue-500 bg-opacity-10 border border-blue-500 border-opacity-30 text-blue-400 px-3 py-2 rounded-lg text-sm font-semibold">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                TRUSTED
              </div>
            </div>
          </div>

          <!-- Footer Sections -->
          <div v-for="section in footerSections" :key="section.title" class="space-y-4">
            <h4 class="text-white font-bold text-lg mb-6 relative">
              {{ section.title }}
              <div class="absolute -bottom-2 left-0 w-8 h-0.5 bg-gradient-to-r from-emerald-500 to-blue-500"></div>
            </h4>
            <ul class="space-y-3">
              <li v-for="link in section.links" :key="link.name">
                <a :href="link.href" 
                   class="text-slate-400 hover:text-white transition-colors duration-300 hover:translate-x-1 inline-block">
                  {{ link.name }}
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Bottom Section -->
      <div class="border-t border-slate-700 border-opacity-50">
        <div class="max-w-7xl mx-auto px-4 py-8">
          <div class="flex flex-col md:flex-row items-center justify-between gap-6">
            <!-- Copyright -->
            <p class="text-slate-400 text-center md:text-left">
              &copy; {{ currentYear }} LivestoX. All rights reserved. 
              <span class="text-slate-500">|</span>
              <span class="text-emerald-400">Trusted by farmers worldwide</span>
            </p>

            <!-- Legal Links -->
            <div class="flex flex-wrap justify-center gap-6">
              <a v-for="link in legalLinks" :key="link.name" :href="link.href" 
                 class="text-slate-400 hover:text-white transition-colors duration-300 text-sm">
                {{ link.name }}
              </a>
            </div>

            <!-- Social Links -->
            <div class="flex items-center gap-4">
              <span class="text-slate-500 text-sm hidden md:block">Follow us:</span>
              <div class="flex gap-4">
                <a v-for="social in socialLinks" :key="social.name" :href="social.href" 
                   class="w-10 h-10 bg-slate-800 hover:bg-gradient-to-r hover:from-emerald-500 hover:to-blue-500 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110 group">
                  <svg class="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" fill="currentColor" :viewBox="`0 0 24 24`">
                    <path :d="social.icon"/>
                  </svg>
                  <span class="sr-only">{{ social.name }}</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>