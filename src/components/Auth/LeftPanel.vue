<script lang="ts">
import { defineComponent, ref, onMounted, onBeforeUnmount } from 'vue';

export default defineComponent({
  name: 'LeftPanel',
  props: {
    logoPath: {
      type: String,
      required: false,
    },
    carouselImages: {
      type: Array,
      default: () => [
        'https://images.unsplash.com/photo-1566438480900-0609be27a4be?q=80&w=1000&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1605185618600-181fc9567a0b?q=80&w=1000&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1500595046743-cd271d694d30?q=80&w=1000&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1516467508483-a7212febe31a?q=80&w=1000&auto=format&fit=crop'
      ]
    }
  },
  setup(props) {
    const currentSlide = ref(0);
    const autoplayInterval = ref(null as any);
    const isHoveringCarousel = ref(false);
    
    const startAutoplay = () => {
      autoplayInterval.value = setInterval(() => {
        if (!isHoveringCarousel.value) {
          nextSlide();
        }
      }, 5000);
    };
    
    const stopAutoplay = () => {
      if (autoplayInterval.value) {
        clearInterval(autoplayInterval.value);
      }
    };
    
    const nextSlide = () => {
      currentSlide.value = (currentSlide.value + 1) % props.carouselImages.length;
    };
    
    const prevSlide = () => {
      currentSlide.value = (currentSlide.value - 1 + props.carouselImages.length) % props.carouselImages.length;
    };
    
    const goToSlide = (index: number) => {
      currentSlide.value = index;
      // Reset autoplay timer on manual navigation
      stopAutoplay();
      startAutoplay();
    };
    
    const onCarouselEnter = () => {
      isHoveringCarousel.value = true;
    };
    
    const onCarouselLeave = () => {
      isHoveringCarousel.value = false;
    };
    
    onMounted(() => {
      startAutoplay();
    });
    
    onBeforeUnmount(() => {
      stopAutoplay();
    });
    
    return {
      currentSlide,
      nextSlide,
      prevSlide,
      goToSlide,
      onCarouselEnter,
      onCarouselLeave
    };
  }
});
</script>

<template>
  <div class="w-full lg:w-5/12 bg-gradient-to-br from-emerald-400 via-emerald-600 to-green-700 relative p-6 md:p-8 lg:p-12 text-white flex flex-col justify-between overflow-hidden min-h-[300px] lg:min-h-screen">
    <!-- Enhanced background patterns -->
    <div class="absolute inset-0 overflow-hidden">
      <div class="absolute top-0 right-0 w-full h-full opacity-10">
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" class="w-full h-full">
          <path fill="white" d="M42.7,-62.9C56.7,-51.5,70.2,-40.5,76.3,-26.5C82.4,-12.5,81.1,4.6,75.8,20.1C70.6,35.7,61.3,49.8,48.4,58.4C35.5,67,18.7,70.1,2.4,67.1C-13.9,64.1,-27.8,55,-40.9,44.7C-54,34.4,-66.3,22.9,-73.5,7.3C-80.6,-8.3,-82.6,-28,-73.9,-40.9C-65.2,-53.8,-45.8,-59.8,-29.6,-70.3C-13.4,-80.8,-0.2,-95.7,11.8,-94.1C23.8,-92.4,28.7,-74.2,42.7,-62.9Z" transform="translate(100 100)" />
        </svg>
      </div>
      <div class="absolute bottom-0 left-0 w-full h-full opacity-10">
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" class="w-full h-full">
          <path fill="white" d="M47.9,-71.2C62.3,-62.6,74.4,-49.2,80.7,-33.2C87,-17.2,87.5,1.4,82.5,18.8C77.6,36.2,67.1,52.4,53.5,65.6C39.9,78.7,23.2,88.8,4.9,84.3C-13.4,79.8,-33.3,60.8,-51.2,44.6C-69.2,28.4,-85.2,14.2,-88.2,-2.9C-91.2,-20,-81.1,-40,-66.5,-53.2C-52,-66.4,-33,-72.8,-14.6,-77.7C3.8,-82.5,22.6,-85.9,38.8,-80.4C55,-74.9,68.7,-54.4,47.9,-71.2Z" transform="translate(100 100)" />
        </svg>
      </div>
      <div class="absolute w-full h-full bg-gradient-to-t from-green-950/50 to-transparent"></div>
    </div>

    <!-- Branding content with enhanced design -->
    <div class="relative z-10 animate-fadeIn">
      <!-- Logo and app name -->
      <div class="flex items-center mb-8">
        <div class="bg-white/20 backdrop-blur-md p-3 rounded-2xl shadow-lg inline-flex border border-white/10 hover:bg-white/30 transition-all duration-300">
          <img :src="logoPath" alt="LivestoX Logo" class="w-8 h-8 object-contain">
        </div>
        <div class="ml-3">
          <h1 class="text-xl font-bold tracking-tight">LivestoX</h1>
          <p class="text-xs opacity-90 font-light tracking-wider">Farm Connect 2025</p>
        </div>
      </div>

      <!-- Enhanced tagline -->
      <div class="my-8">
        <h2 class="text-3xl md:text-4xl font-bold leading-tight mb-4 text-shadow-sm">
          Join Our Growing <span class="text-emerald-300">Community</span> of Livestock Experts
        </h2>
        <p class="text-sm md:text-base leading-relaxed opacity-90 max-w-md">
          Connect with verified farmers, buyers and agriculture enthusiasts. 
          Grow your business with our trusted platform.
        </p>
        <div class="mt-6 flex items-center">
          <span class="inline-flex items-center px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-300/30 text-emerald-200 text-xs">
            <span class="relative flex h-2 w-2 mr-2">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75"></span>
              <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-300"></span>
            </span>
            We're growing rapidly
          </span>
        </div>
      </div>
    </div>

    <!-- Enhanced Image Carousel -->
    <div class="relative z-10 my-2" @mouseenter="onCarouselEnter" @mouseleave="onCarouselLeave">
      <div class="carousel-container rounded-xl overflow-hidden shadow-xl border border-white/20 transform hover:scale-[1.01] transition-all duration-300">
        <div class="carousel-wrapper h-56 md:h-64 relative">
          <!-- Image slides with enhanced transitions -->
          <div v-for="(image, index) in carouselImages" :key="index"
               class="carousel-slide absolute inset-0 w-full h-full transition-all duration-1000 ease-in-out bg-cover bg-center"
               :class="{'opacity-100 scale-100': index === currentSlide, 'opacity-0 scale-105': index !== currentSlide}"
               :style="`background-image: url('${image}')`">
            <div class="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
          </div>
          
          <!-- Enhanced caption -->
          <div class="absolute bottom-0 left-0 right-0 p-4 text-white z-10">
            <div class="overflow-hidden h-6">
              <p class="font-medium text-sm transition-transform duration-300" 
                v-if="currentSlide === 0"
                :class="{'translate-y-0': currentSlide === 0, 'translate-y-full': currentSlide !== 0}">
                <span class="font-bold text-emerald-300">Premium</span> cattle breeds from trusted farmers
              </p>
              <p class="font-medium text-sm transition-transform duration-300" 
                v-else-if="currentSlide === 1"
                :class="{'translate-y-0': currentSlide === 1, 'translate-y-full': currentSlide !== 1}">
                <span class="font-bold text-emerald-300">Modern</span> farming techniques & equipment
              </p>
              <p class="font-medium text-sm transition-transform duration-300" 
                v-else-if="currentSlide === 2"
                :class="{'translate-y-0': currentSlide === 2, 'translate-y-full': currentSlide !== 2}">
                <span class="font-bold text-emerald-300">Agricultural</span> partners across the country
              </p>
              <p class="font-medium text-sm transition-transform duration-300" 
                v-else
                :class="{'translate-y-0': currentSlide === 3, 'translate-y-full': currentSlide !== 3}">
                <span class="font-bold text-emerald-300">Quality</span> livestock from certified sellers
              </p>
            </div>
          </div>
          
          <!-- Enhanced navigation buttons -->
          <button @click="prevSlide" 
                  class="absolute left-3 top-1/2 transform -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2.5 rounded-full backdrop-blur-sm transition-all duration-300 opacity-0 group-hover:opacity-100 hover:scale-110">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button @click="nextSlide" 
                  class="absolute right-3 top-1/2 transform -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2.5 rounded-full backdrop-blur-sm transition-all duration-300 opacity-0 group-hover:opacity-100 hover:scale-110">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
          
          <!-- Enhanced indicator dots -->
          <div class="absolute bottom-0 left-0 right-0 flex justify-center pb-3">
            <div v-for="(_, index) in carouselImages" :key="`dot-${index}`" 
                 @click="goToSlide(index)"
                 class="w-2 h-2 mx-1.5 rounded-full cursor-pointer transition-all duration-300"
                 :class="index === currentSlide ? 'bg-white scale-125' : 'bg-white/50 hover:bg-white/80'">
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Enhanced Core Features -->
    <div class="relative z-10 mt-auto">
      <h3 class="text-base font-semibold mb-4 flex items-center">
        <span class="w-6 h-6 bg-emerald-500/30 rounded-full flex items-center justify-center mr-2 border border-emerald-300/30">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
        </span>
        Why Choose LivestoX
      </h3>

      <!-- Enhanced features list -->
      <ul class="space-y-3 text-sm">
        <li class="flex items-start p-2 rounded-lg transition-all duration-300 hover:bg-white/10">
          <span class="text-emerald-300 mr-2 mt-0.5">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591.802 10.006 2.382 11.323A12.13 12.13 0 0012 21.27c2.846 0 5.365-1.058 6.618-1.947 1.58-1.317 2.382-5.732 2.382-11.323 0-1.07-.117-2.121-.349-3.116z" />
            </svg>
          </span>
          <span>
            <strong class="text-emerald-200">Verified</strong> sellers and buyers for secure transactions
          </span>
        </li>
        <li class="flex items-start p-2 rounded-lg transition-all duration-300 hover:bg-white/10">
          <span class="text-emerald-300 mr-2 mt-0.5">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </span>
          <span>
            <strong class="text-emerald-200">Streamlined</strong> payment system with buyer protection
          </span>
        </li>
        <li class="flex items-start p-2 rounded-lg transition-all duration-300 hover:bg-white/10">
          <span class="text-emerald-300 mr-2 mt-0.5">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
          </span>
          <span>
            <strong class="text-emerald-200">Access</strong> to agricultural experts and resources
          </span>
        </li>
      </ul>
    </div>
    
    <!-- Enhanced stats footer -->
    <div class="relative z-10 mt-8 pt-6 border-t border-white/20 hidden md:block">
      <div class="flex justify-between">
        <div class="text-center flex-1 px-2 transform hover:scale-105 transition-transform duration-300">
          <div class="text-2xl font-bold text-white">10k<span class="text-emerald-300">+</span></div>
          <div class="text-xs opacity-70 font-light uppercase tracking-wider">Farmers</div>
        </div>
        <div class="text-center flex-1 px-2 transform hover:scale-105 transition-transform duration-300">
          <div class="text-2xl font-bold text-white">50k<span class="text-emerald-300">+</span></div>
          <div class="text-xs opacity-70 font-light uppercase tracking-wider">Transactions</div>
        </div>
        <div class="text-center flex-1 px-2 transform hover:scale-105 transition-transform duration-300">
          <div class="text-2xl font-bold text-white">95<span class="text-emerald-300">%</span></div>
          <div class="text-xs opacity-70 font-light uppercase tracking-wider">Satisfaction</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.text-shadow-sm {
  text-shadow: 0 2px 4px rgba(0,0,0,0.3);
}

.carousel-slide {
  transition: opacity 800ms ease-in-out, transform 1200ms ease-in-out;
}

/* Make the carousel container a group to show/hide buttons on hover */
.carousel-container {
  position: relative;
}

.carousel-container:hover button {
  opacity: 1;
}

/* Animation for initial load */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-fadeIn {
  animation: fadeIn 1s ease-out;
}

/* Hide full left panel content on very small height screens */
@media (max-height: 600px) and (min-width: 1024px) {
  .lg\:min-h-screen {
    min-height: 600px;
  }
}
</style>