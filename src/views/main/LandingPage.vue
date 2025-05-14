<script lang="ts">
import { computed, defineComponent, ref } from 'vue';
import NavBar from '../../components/Landing/NavBar.vue';
import Footer from '../../components/Landing/Footer.vue';
import AnimalsMarketplace from '../../components/Landing/AnimalsMarketplace.vue';
import CommunityForum from '../../components/Landing/CommunityForum.vue';
import TestimonialsSection from '../../components/Landing/TestimonialsSection.vue';
import HowItWork from '../../components/Landing/HowItWork.vue';
import CategoriesSection from '../../components/Landing/CategoriesSection.vue';
import imageUrl from '/src/assets/Bull.jpg';

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

interface ForumPost {
  id: number;
  title: string;
  author: string;
  date: string;
  excerpt: string;
  likes: number;
  comments: number;
  authorImage: string;
  category: string;
}

// Platform statistics
interface PlatformStats {
  activeUsers: number;
  totalAnimalsListed: number;
  successfulSales: number;
  forumPosts: number;
  countries: number;
  farmersHelped: number;
}

export default defineComponent({
  name: 'LandingPage',
  components: {
    NavBar,
    Footer,
    AnimalsMarketplace,
    CommunityForum,
    TestimonialsSection,
    HowItWork,
    CategoriesSection
  },
  setup() {
    const searchQuery = ref('');
    const animalCategory = ref('all');

    // Platform statistics
    const platformStats = ref<PlatformStats>({
      activeUsers: 12467,
      totalAnimalsListed: 35892,
      successfulSales: 18754,
      forumPosts: 24689,
      countries: 28,
      farmersHelped: 8900
    });

    // Last updated timestamp
    const lastUpdated = ref('April 24, 2025 09:30 AM');

    const bestSellingAnimals = ref<AnimalListing[]>([
      {
        id: 1,
        name: 'Bella',
        type: 'Cow',
        breed: 'Holstein',
        age: '3 years',
        price: 1200,
        image: imageUrl,
        seller: 'Johnson Farm',
        location: 'Springfield',
        rating: 4.8,
        listed: '2 days ago',
        views: 134,
        featured: true
      },
      {
        id: 2,
        name: 'Max',
        type: 'Horse',
        breed: 'Quarter Horse',
        age: '5 years',
        price: 5000,
        image: imageUrl,
        seller: 'Green Pastures',
        location: 'Millfield',
        rating: 4.9,
        listed: '1 week ago',
        views: 298,
        discount: 10
      },
      {
        id: 3,
        name: 'Daisy',
        type: 'Goat',
        breed: 'Nubian',
        age: '2 years',
        price: 350,
        image: imageUrl,
        seller: 'Happy Hills Farm',
        location: 'Oakridge',
        rating: 4.7,
        listed: '3 days ago',
        views: 87
      },
      {
        id: 4,
        name: 'Wilbur',
        type: 'Pig',
        breed: 'Yorkshire',
        age: '1 year',
        price: 300,
        image: imageUrl,
        seller: 'Sunset Acres',
        location: 'Riverdale',
        rating: 4.6,
        listed: '5 days ago',
        views: 112,
        discount: 15
      }
    ]);

    // Recently added animals
    const recentlyAddedAnimals = ref<AnimalListing[]>([
      {
        id: 5,
        name: 'Thunder',
        type: 'Bull',
        breed: 'Angus',
        age: '4 years',
        price: 3500,
        image: imageUrl,
        seller: 'Mountain Range Ranch',
        location: 'Highfields',
        rating: 4.9,
        listed: '6 hours ago',
        views: 38,
        isNew: true
      },
      {
        id: 6,
        name: 'Goldie',
        type: 'Chicken',
        breed: 'Leghorn',
        age: '8 months',
        price: 25,
        image: imageUrl,
        seller: 'Sunrise Poultry',
        location: 'Meadowvale',
        rating: 4.7,
        listed: '12 hours ago',
        views: 64,
        isNew: true
      },
      {
        id: 7,
        name: 'Clover',
        type: 'Sheep',
        breed: 'Merino',
        age: '2 years',
        price: 450,
        image: imageUrl,
        seller: 'Hillside Farms',
        location: 'Valleytown',
        rating: 4.8,
        listed: '1 day ago',
        views: 92,
        isNew: true,
        featured: true
      },
      {
        id: 8,
        name: 'Duke',
        type: 'Horse',
        breed: 'Appaloosa',
        age: '7 years',
        price: 7800,
        image: imageUrl,
        seller: 'Elite Equestrian',
        location: 'Westridge',
        rating: 5.0,
        listed: '2 days ago',
        views: 187,
        featured: true
      }
    ]);

    const forumPosts = ref<ForumPost[]>([
      {
        id: 1,
        title: 'Best feed for dairy cows during winter months',
        author: 'FarmerJohn',
        date: '2 days ago',
        excerpt: 'I\'ve been experimenting with different feed mixes and wanted to share my results. The silage-based approach has shown significant improvements in milk production while maintaining cow health.',
        likes: 42,
        comments: 18,
        authorImage: imageUrl,
        category: 'Cattle Care'
      },
      {
        id: 2,
        title: 'Preventing hoof problems in sheep',
        author: 'SheepWhisperer',
        date: '4 days ago',
        excerpt: 'After years of dealing with various hoof issues, I\'ve developed a routine that has virtually eliminated foot rot in my flock. Regular trimming schedule combined with...',
        likes: 35,
        comments: 24,
        authorImage: imageUrl,
        category: 'Sheep Husbandry'
      },
      {
        id: 3,
        title: 'Organic certification process - my journey',
        author: 'GreenFarmer',
        date: '1 week ago',
        excerpt: 'I completed my organic certification last month and wanted to share the steps, costs, and timeline to help others considering making the transition to certified organic livestock farming.',
        likes: 87,
        comments: 56,
        authorImage: imageUrl,
        category: 'Organic Farming'
      }
    ]);

    const testimonials = ref([
      {
        text: "I found the perfect breeding bull for my dairy farm through this platform. The seller was honest and the transaction was smooth. The health records were complete and accurate which saved me a lot of worry.",
        name: "Sarah Johnson",
        farm: "Johnson Dairy Farm",
        image: imageUrl,
        state: "Iowa",
        memberSince: "2023"
      },
      {
        text: "As a new farmer, the forums have been invaluable for learning. I've received great advice about raising my first flock of chickens. Within 3 months, my egg production has increased by 40%.",
        name: "Mike Peters",
        farm: "Sunrise Acres",
        image: imageUrl,
        state: "Nebraska",
        memberSince: "2024"
      },
      {
        text: "Sold my quarter horses quickly and to a good home. The verification process gave buyers confidence in my listings. I've now completed 12 transactions through the platform with zero issues.",
        name: "Linda Martinez",
        farm: "Golden Meadow Stables",
        image: imageUrl,
        state: "Kentucky",
        memberSince: "2022"
      }
    ]);

    const animalCategories = ref([
      { value: 'all', label: 'All Animals', count: 35892, icon: '🐾' },
      { value: 'cattle', label: 'Cattle', count: 12483, icon: '🐄' },
      { value: 'horses', label: 'Horses', count: 8976, icon: '🐎' },
      { value: 'sheep', label: 'Sheep', count: 5214, icon: '🐑' },
      { value: 'goats', label: 'Goats', count: 3689, icon: '🐐' },
      { value: 'pigs', label: 'Pigs', count: 2975, icon: '🐖' },
      { value: 'poultry', label: 'Poultry', count: 2555, icon: '🐓' }
    ]);

    // Active users by time
    const activeUsersByTime = ref({
      now: 428,
      today: 2467,
      week: 8192,
      month: 12467
    });

    // Featured regions with high activity
    const activeRegions = ref([
      { name: "Midwest", activeUsers: 3842, listings: 12467 },
      { name: "South", activeUsers: 2975, listings: 9854 },
      { name: "West", activeUsers: 2341, listings: 7654 },
      { name: "Northeast", activeUsers: 1876, listings: 5917 }
    ]);

    const animals = computed(() => {
      // Combine or filter animals as needed. Here, we combine both lists.
      return [...bestSellingAnimals.value, ...recentlyAddedAnimals.value];
    });

    return {
      searchQuery,
      animalCategory,
      bestSellingAnimals,
      recentlyAddedAnimals,
      forumPosts,
      testimonials,
      animalCategories,
      platformStats,
      activeUsersByTime,
      activeRegions,
      lastUpdated,
      animals
    };
  }
});
</script>

<template>
  <div class="min-h-screen font-sans text-gray-800 bg-gray-50 antialiased">
    <!-- Fixed header with modern glass morphism design -->
    <div class="fixed top-0 left-0 w-full z-50 bg-white bg-opacity-95 backdrop-blur-sm shadow-lg">
      <NavBar />
    </div>

    <!-- Statistics Bar - Gradient animation and improved stats design -->
    <div class="sticky top-16 z-40 bg-gradient-to-r from-emerald-800 via-teal-800 to-emerald-700 text-white py-2 shadow-md">
      <div class="max-w-7xl mx-auto flex flex-wrap justify-between items-center text-sm px-4">
        <div class="flex items-center space-x-2">
          <div class="h-2.5 w-2.5 rounded-full bg-emerald-300 animate-pulse"></div>
          <span class="font-medium">{{ activeUsersByTime.now }} users online now</span>
        </div>
        <div class="hidden md:flex items-center divide-x divide-emerald-600">
          <span class="px-4 flex items-center"><svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1 text-emerald-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg> {{ platformStats.totalAnimalsListed.toLocaleString() }} Listings</span>
          <span class="px-4 flex items-center"><svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1 text-emerald-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> {{ platformStats.successfulSales.toLocaleString() }} Sales</span>
          <span class="px-4 flex items-center"><svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1 text-emerald-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg> {{ platformStats.activeUsers.toLocaleString() }} Users</span>
          <span class="pl-4 text-emerald-200 text-xs flex items-center"><svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> Updated: {{ lastUpdated }}</span>
        </div>
        <!-- Mobile stats view -->
        <div class="md:hidden flex items-center space-x-3 text-xs">
          <span>{{ platformStats.totalAnimalsListed.toLocaleString() }} Listed</span>
          <span>{{ platformStats.successfulSales.toLocaleString() }} Sales</span>
        </div>
      </div>
    </div>

    <!-- Hero Section - Enhanced with modern design elements -->
    <section class="relative pt-32 pb-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-emerald-800 via-teal-700 to-emerald-600 overflow-hidden">
      <!-- Animated wave pattern overlay -->
      <div class="absolute inset-0 opacity-5">
        <svg class="h-full w-full" viewBox="0 0 1440 320" xmlns="http://www.w3.org/2000/svg">
          <path fill="#ffffff" fill-opacity="0.3" d="M0,192L48,176C96,160,192,128,288,138.7C384,149,480,203,576,202.7C672,203,768,149,864,138.7C960,128,1056,160,1152,165.3C1248,171,1344,149,1392,138.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z" class="animate-pulse" style="animation-duration: 15s;"></path>
          <path fill="#ffffff" fill-opacity="0.3" d="M0,96L48,122.7C96,149,192,203,288,208C384,213,480,171,576,170.7C672,171,768,213,864,218.7C960,224,1056,192,1152,170.7C1248,149,1344,139,1392,133.3L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z" class="animate-pulse" style="animation-duration: 20s; animation-delay: 1s;"></path>
        </svg>
      </div>
      
      <!-- Decorative circles -->
      <div class="absolute top-20 left-1/4 w-64 h-64 bg-white rounded-full opacity-5 mix-blend-overlay filter blur-xl"></div>
      <div class="absolute bottom-20 right-1/4 w-96 h-96 bg-yellow-300 rounded-full opacity-10 mix-blend-overlay filter blur-3xl"></div>

      <div class="max-w-7xl mx-auto">
        <div class="flex flex-col md:flex-row items-center justify-between">
          <div class="md:w-1/2 mb-12 md:mb-0 relative z-10">
            <!-- Enhanced trust badge with gradient -->
            <div class="inline-block bg-gradient-to-r from-white to-white/70 bg-opacity-10 backdrop-blur-sm rounded-full px-4 py-1.5 text-emerald-50 text-sm mb-6 shadow-sm border border-white border-opacity-20">
              <div class="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2 text-yellow-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                Trusted by <span class="font-semibold">{{ platformStats.farmersHelped.toLocaleString() }}+</span> farmers nationwide
              </div>
            </div>
            
            <!-- Enhanced heading with underline animation -->
            <h1 class="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight tracking-tight">
              Find Your <span class="text-yellow-300 relative inline-block">
                Perfect
                <span class="absolute bottom-1 left-0 w-full h-1 bg-yellow-300 opacity-50 rounded"></span>
              </span> Farm Animals
            </h1>
            
            <p class="text-lg text-emerald-50 mb-8 leading-relaxed max-w-lg font-light">
              Connect with trusted farmers and livestock sellers across the country.
              Buy, sell, and learn about quality farm animals.
            </p>
            
            <!-- Enhanced search box with soft glow -->
            <div class="bg-white rounded-xl p-2 mb-8 shadow-xl ring-1 ring-white/20 ring-offset-4 ring-offset-emerald-700/30">
              <div class="flex flex-col sm:flex-row">
                <div class="relative flex-grow">
                  <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <input 
                    v-model="searchQuery" 
                    type="text" 
                    placeholder="Search for animals..." 
                    class="w-full pl-12 pr-4 py-3.5 rounded-l-lg border-0 focus:ring-2 focus:ring-emerald-500 focus:outline-none text-gray-700"
                  >
                </div>
                
                <select 
                  v-model="animalCategory"
                  class="px-4 py-3.5 bg-gray-50 text-gray-700 border-l border-gray-100 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                >
                  <option v-for="category in animalCategories" :key="category.value" :value="category.value">
                    {{ category.icon }} {{ category.label }}
                  </option>
                </select>
                
                <button class="bg-gradient-to-br from-emerald-500 to-emerald-700 hover:from-emerald-600 hover:to-emerald-800 text-white font-medium py-3.5 px-6 rounded-r-lg transition duration-300 shadow-md">
                  <div class="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    Search
                  </div>
                </button>
              </div>
            </div>
            
            <!-- Enhanced call to action buttons -->
            <div class="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <button class="bg-white text-emerald-800 font-medium py-3.5 px-8 rounded-lg transition duration-300 shadow-lg hover:shadow-xl hover:bg-gray-50 flex items-center justify-center group">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 group-hover:animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                Browse Animals
              </button>
              <button class="bg-transparent border-2 border-white text-white font-medium py-3.5 px-8 rounded-lg hover:bg-white hover:bg-opacity-10 transition duration-300 shadow-md flex items-center justify-center group">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 group-hover:animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Join Community
              </button>
            </div>
          </div>
          
          <!-- Enhanced hero image with multi-layer effects -->
          <div class="md:w-1/2">
            <div class="relative">
              <!-- Enhanced decorative elements -->
              <div class="absolute -top-8 -right-8 w-80 h-80 bg-gradient-to-tr from-yellow-300 to-yellow-200 rounded-full opacity-20 filter blur-3xl"></div>
              <div class="absolute -bottom-12 -left-12 w-64 h-64 bg-gradient-to-bl from-emerald-300 to-teal-200 rounded-full opacity-20 filter blur-3xl"></div>

              <!-- Main image with enhanced styling -->
              <div class="relative rounded-2xl overflow-hidden shadow-2xl transform transition-transform duration-500 hover:scale-[1.02]">
                <!-- Card glow effect -->
                <div class="absolute inset-0 rounded-2xl bg-gradient-to-tr from-emerald-400 to-teal-300 opacity-30 blur-xl -z-10"></div>
                
                <img 
                  src="/src/assets/Bull.jpg" 
                  alt="Quality farm animals" 
                  class="w-full h-96 object-cover"
                >
                <div class="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-70"></div>
                
                <!-- Enhanced card footer with glass morphism -->
                <div class="absolute bottom-0 left-0 right-0 p-6 backdrop-blur-sm bg-black/20">
                  <div class="flex justify-between items-center">
                    <p class="text-white font-medium text-base">
                      <span class="text-xs uppercase tracking-wider font-light block mb-1 text-emerald-100">Global Network</span>
                      Verified sellers across <span class="font-bold">{{ platformStats.countries }}</span> countries
                    </p>
                    <div class="bg-emerald-600 text-white rounded-full px-3.5 py-1.5 text-sm font-medium flex items-center shadow-md">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Verified Listings
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Enhanced platform statistics with glass morphism -->
        <div class="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div class="group relative p-5 rounded-xl backdrop-blur-md bg-white/10 border border-white/20 overflow-hidden transition-all duration-300 hover:bg-white/15">
            <!-- Animated background element -->
            <div class="absolute inset-0 bg-gradient-to-br from-emerald-400/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div class="text-3xl font-bold text-white mb-1 relative">{{ platformStats.activeUsers.toLocaleString() }}</div>
            <div class="text-emerald-100 text-sm relative flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1 text-emerald-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              Active Users
            </div>
          </div>
          <div class="group relative p-5 rounded-xl backdrop-blur-md bg-white/10 border border-white/20 overflow-hidden transition-all duration-300 hover:bg-white/15">
            <div class="absolute inset-0 bg-gradient-to-br from-emerald-400/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div class="text-3xl font-bold text-white mb-1 relative">{{ platformStats.totalAnimalsListed.toLocaleString() }}</div>
      <div class="text-emerald-100 text-sm relative flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1 text-emerald-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              Total Listings
            </div>
          </div>
          <div class="group relative p-5 rounded-xl backdrop-blur-md bg-white/10 border border-white/20 overflow-hidden transition-all duration-300 hover:bg-white/15">
            <div class="absolute inset-0 bg-gradient-to-br from-emerald-400/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div class="text-3xl font-bold text-white mb-1 relative">{{ platformStats.successfulSales.toLocaleString() }}</div>
            <div class="text-emerald-100 text-sm relative flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1 text-emerald-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Successful Sales
            </div>
          </div>
          <div class="group relative p-5 rounded-xl backdrop-blur-md bg-white/10 border border-white/20 overflow-hidden transition-all duration-300 hover:bg-white/15">
            <div class="absolute inset-0 bg-gradient-to-br from-emerald-400/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div class="text-3xl font-bold text-white mb-1 relative">{{ platformStats.countries }}</div>
            <div class="text-emerald-100 text-sm relative flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1 text-emerald-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Countries
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Featured Categories Section -->
    <CategoriesSection :categories="animalCategories" />

    <!-- How It Works Section -->
    <HowItWork />

    <!-- Marketplace Section -->
    <AnimalsMarketplace 
      :bestSellingAnimals="bestSellingAnimals" 
      :recentlyAddedAnimals="recentlyAddedAnimals" 
    />

    <!-- Community Section -->
    <CommunityForum :forumPosts="forumPosts" />

    <!-- Testimonials Section -->
    <TestimonialsSection :testimonials="testimonials" />

    <!-- Call to Action Section -->
    <section class="relative py-20 bg-emerald-800 overflow-hidden">
      <!-- Decorative background elements -->
      <div class="absolute inset-0 opacity-10">
        <svg class="h-full w-full" viewBox="0 0 1440 320" xmlns="http://www.w3.org/2000/svg">
          <path fill="#ffffff" fill-opacity="1" d="M0,192L48,176C96,160,192,128,288,138.7C384,149,480,203,576,202.7C672,203,768,149,864,138.7C960,128,1056,160,1152,165.3C1248,171,1344,149,1392,138.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
        </svg>
      </div>
      
      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold text-white mb-4">Ready to Find Your Next Farm Animal?</h2>
          <p class="text-lg text-emerald-100 max-w-2xl mx-auto">Join thousands of farmers who buy, sell, and learn about farm animals on our trusted platform.</p>
        </div>
        
        <div class="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6">
          <a href="#" class="inline-block bg-white text-emerald-800 font-medium py-3.5 px-8 rounded-lg hover:bg-gray-50 transition duration-300 shadow-lg">
            Create Free Account
          </a>
          <a href="#" class="inline-block border-2 border-white text-white font-medium py-3.5 px-8 rounded-lg hover:bg-white hover:bg-opacity-10 transition duration-300">
            Learn More
          </a>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <Footer />
  </div>
</template>
