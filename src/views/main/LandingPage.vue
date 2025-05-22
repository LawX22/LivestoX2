<script lang="ts">
import { computed, defineComponent, ref } from 'vue';
import NavBar from '../../components/Main/NavBar.vue';
import Footer from '../../components/Landing/Footer.vue';
import AnimalsMarketplace from '../../components/Landing/AnimalsMarketplace.vue';
import CommunityForum from '../../components/Landing/CommunityForum.vue';
import TestimonialsSection from '../../components/Landing/TestimonialsSection.vue';
import HowItWork from '../../components/Landing/HowItWork.vue';
import AdsSection from '../../components/Landing/AdsSection.vue';
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
    AdsSection,
  },
  setup() {
    const searchQuery = ref('');
    const animalCategory = ref('all');

    const platformStats = ref<PlatformStats>({
      activeUsers: 12467,
      totalAnimalsListed: 35892,
      successfulSales: 18754,
      forumPosts: 24689,
      countries: 28,
      farmersHelped: 8900
    });

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

    const activeUsersByTime = ref({
      now: 428,
      today: 2467,
      week: 8192,
      month: 12467
    });

    const activeRegions = ref([
      { name: "Midwest", activeUsers: 3842, listings: 12467 },
      { name: "South", activeUsers: 2975, listings: 9854 },
      { name: "West", activeUsers: 2341, listings: 7654 },
      { name: "Northeast", activeUsers: 1876, listings: 5917 }
    ]);

    const animals = computed(() => {
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
      animals,
      imageUrl
    };
  }
});
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 font-sans text-slate-900">
    <!-- Navigation -->
    <nav
      class="fixed top-0 left-0 w-full z-50 bg-white bg-opacity-95 backdrop-blur-lg shadow-sm border-b border-slate-200 border-opacity-50">
      <NavBar />
    </nav>

    <!-- Hero Section with Background Image -->
    <section class="relative min-h-screen bg-cover bg-center bg-no-repeat pt-16 overflow-hidden" :style="{}">
      <!-- Enhanced Overlay with Multiple Gradients -->
      <div class="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-transparent opacity-90"></div>
      <div class="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-70"></div>
      <div class="absolute inset-0 bg-gradient-to-r from-emerald-900 via-transparent to-blue-900 opacity-40"></div>

      <!-- Live Stats Ticker -->
      <div
        class="absolute top-16 left-0 w-full z-40 bg-gradient-to-r from-emerald-600 via-blue-600 to-violet-600 text-white py-3 overflow-hidden shadow-lg">
        <div>
          <div class="flex items-center justify-center space-x-8 text-sm font-medium">
            <span class="inline-flex items-center">
              <div class="w-2 h-2 bg-green-300 rounded-full mr-2"></div>
              {{ activeUsersByTime.now }} users online
            </span>
            <span class="inline-flex items-center">
              <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {{ platformStats.successfulSales.toLocaleString() }} completed sales
            </span>
            <span class="inline-flex items-center">
              <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
              </svg>
              {{ platformStats.activeUsers.toLocaleString() }} registered farmers
            </span>
            <span class="inline-flex items-center">
              <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path
                  d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
              </svg>
              {{ platformStats.totalAnimalsListed.toLocaleString() }} active listings
            </span>
          </div>
        </div>
      </div>

      <!-- Main Hero Content -->
      <div class="relative z-30 flex items-center min-h-screen pt-20 pb-12">
        <div class="max-w-7xl mx-auto px-4 w-full">
          <div class="grid lg:grid-cols-2 gap-16 items-center">
            <!-- Left Column - Content -->
            <div class="text-white space-y-8">
              <!-- Trust Badge -->
              <div
                class="inline-flex items-center gap-3 bg-gradient-to-r from-emerald-500 to-blue-500 text-white px-6 py-3 rounded-full text-sm font-semibold shadow-xl">
                <div class="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                TRUSTED BY {{ platformStats.farmersHelped.toLocaleString() }}+ FARMERS
              </div>

              <!-- Main Headline -->
              <div class="space-y-4">
                <h1 class="text-5xl md:text-7xl font-black leading-tight tracking-tight">
                  <span class="block text-white drop-shadow-2xl">Premium</span>
                  <span
                    class="block bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent drop-shadow-lg">Farm
                    Animals</span>
                  <span class="block text-slate-100 drop-shadow-xl">Marketplace</span>
                </h1>
              </div>

              <p class="text-xl md:text-2xl text-slate-200 max-w-2xl font-light leading-relaxed drop-shadow-lg">
                Connect directly with verified farmers and livestock sellers worldwide.
                <span class="font-semibold text-emerald-300">No intermediaries</span>, no complications, just trusted
                transactions.
              </p>

              <!-- Action Buttons -->
              <div class="flex flex-col sm:flex-row gap-6 pt-4">
                <button
                  class="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-10 py-4 font-bold text-lg hover:from-emerald-600 hover:to-emerald-700 transition-all rounded-xl shadow-2xl hover:shadow-emerald-500 hover:shadow-lg transform hover:scale-105 hover:-translate-y-1">
                  BROWSE ANIMALS
                </button>
                <button
                  class="border-2 border-white text-white px-10 py-4 font-bold text-lg hover:bg-white hover:text-slate-900 transition-all rounded-xl backdrop-blur-sm bg-white bg-opacity-10">
                  SELL ANIMALS
                </button>
              </div>

              <!-- Quality Badges -->
              <div class="flex flex-wrap gap-4 pt-6">
                <div
                  class="inline-flex items-center gap-2 bg-emerald-500 bg-opacity-90 text-white px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wide backdrop-blur-sm">
                  <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd"
                      d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clip-rule="evenodd" />
                  </svg>
                  VERIFIED SELLERS
                </div>
                <div
                  class="inline-flex items-center gap-2 bg-blue-500 bg-opacity-90 text-white px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wide backdrop-blur-sm">
                  <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  HEALTH CERTIFIED
                </div>
                <div
                  class="inline-flex items-center gap-2 bg-violet-500 bg-opacity-90 text-white px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wide backdrop-blur-sm">
                  <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      d="M3 6a3 3 0 013-3h10a1 1 0 01.8 1.6L14.25 8l2.55 3.4A1 1 0 0116 13H6a1 1 0 00-1 1v3a1 1 0 11-2 0V6z" />
                  </svg>
                  BREED VERIFIED
                </div>
              </div>
            </div>

            <!-- Right Column - Search & Stats -->
            <div class="space-y-8">
              <!-- Advanced Search Interface -->
              <div
                class="bg-white bg-opacity-95 backdrop-blur-lg border border-slate-200 border-opacity-50 rounded-3xl shadow-2xl p-6">
                <div class="text-center mb-6">
                  <h3 class="text-2xl font-bold text-slate-900 mb-2">Find Your Perfect Animal</h3>
                  <p class="text-slate-600">Search through thousands of verified listings</p>
                </div>

                <div class="space-y-4">
                  <div class="relative">
                    <input v-model="searchQuery" type="text" placeholder="What animal are you looking for?"
                      class="w-full px-6 py-4 text-lg border border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-emerald-500 focus:ring-opacity-30 focus:border-emerald-500 font-medium placeholder-slate-400">
                    <div class="absolute right-4 top-1/2 transform -translate-y-1/2">
                      <svg class="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                  </div>

                  <select v-model="animalCategory"
                    class="w-full px-6 py-4 text-lg border border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-emerald-500 focus:ring-opacity-30 focus:border-emerald-500 font-medium text-slate-700">
                    <option v-for="category in animalCategories" :key="category.value" :value="category.value">
                      {{ category.icon }} {{ category.label }}
                    </option>
                  </select>

                  <button
                    class="w-full bg-gradient-to-r from-emerald-600 to-blue-600 text-white px-8 py-4 font-bold text-lg hover:from-emerald-700 hover:to-blue-700 transition-all rounded-xl shadow-lg hover:shadow-xl">
                    SEARCH NOW
                  </button>
                </div>
              </div>

              <!-- Live Statistics Grid -->
              <div class="grid grid-cols-2 gap-4">
                <div
                  class="bg-white bg-opacity-90 backdrop-blur-sm border border-slate-200 border-opacity-50 rounded-2xl p-6 text-center shadow-xl hover:shadow-2xl transition-all hover:scale-105 group">
                  <div
                    class="text-3xl font-black mb-2 bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent group-hover:scale-110 transition-transform">
                    {{ platformStats.activeUsers.toLocaleString() }}
                  </div>
                  <div class="text-xs uppercase tracking-wide font-bold text-slate-600">
                    ACTIVE USERS
                  </div>
                </div>
                <div
                  class="bg-white bg-opacity-90 backdrop-blur-sm border border-slate-200 border-opacity-50 rounded-2xl p-6 text-center shadow-xl hover:shadow-2xl transition-all hover:scale-105 group">
                  <div
                    class="text-3xl font-black mb-2 bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent group-hover:scale-110 transition-transform">
                    {{ platformStats.totalAnimalsListed.toLocaleString() }}
                  </div>
                  <div class="text-xs uppercase tracking-wide font-bold text-slate-600">
                    LISTINGS
                  </div>
                </div>
                <div
                  class="bg-white bg-opacity-90 backdrop-blur-sm border border-slate-200 border-opacity-50 rounded-2xl p-6 text-center shadow-xl hover:shadow-2xl transition-all hover:scale-105 group">
                  <div
                    class="text-3xl font-black mb-2 bg-gradient-to-r from-violet-600 to-pink-600 bg-clip-text text-transparent group-hover:scale-110 transition-transform">
                    {{ platformStats.successfulSales.toLocaleString() }}
                  </div>
                  <div class="text-xs uppercase tracking-wide font-bold text-slate-600">
                    SALES
                  </div>
                </div>
                <div
                  class="bg-white bg-opacity-90 backdrop-blur-sm border border-slate-200 border-opacity-50 rounded-2xl p-6 text-center shadow-xl hover:shadow-2xl transition-all hover:scale-105 group">
                  <div
                    class="text-3xl font-black mb-2 bg-gradient-to-r from-pink-600 to-emerald-600 bg-clip-text text-transparent group-hover:scale-110 transition-transform">
                    {{ platformStats.countries }}
                  </div>
                  <div class="text-xs uppercase tracking-wide font-bold text-slate-600">
                    COUNTRIES
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Bottom Wave Separator -->
      <div class="absolute bottom-0 left-0 w-full">
        <svg class="w-full h-24 text-white" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path
            d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z"
            fill="currentColor"></path>
        </svg>
      </div>
    </section>

    <!-- Ads Section -->
    <section class="py-5 ">
      <div class="text-center mb-10">
          <h2 class="text-4xl md:text-6xl font-black mb-6 tracking-tight">
            Livestock Animals
          </h2>
          <p class="text-xl text-slate-300 font-light max-w-2xl mx-auto">
           All aboard the farm animal express!
          </p>
        </div>
       <AdsSection />
    </section>

    <!-- How It Works Section -->
    <section
      class="py-24 bg-gradient-to-br from-slate-900 via-blue-900 to-emerald-900 text-white relative overflow-hidden">
      <div class="max-w-7xl mx-auto px-4 relative z-10">
        <div class="text-center mb-20">
          <h2 class="text-4xl md:text-6xl font-black mb-6 tracking-tight">
            How It Works
          </h2>
          <p class="text-xl text-slate-300 font-light max-w-2xl mx-auto">
            Get started in just three simple steps
          </p>
        </div>

        <HowItWork>
          <template #button>
            <button
              class="bg-gradient-to-r from-emerald-500 to-blue-500 text-white px-12 py-4 font-bold text-lg hover:from-emerald-600 hover:to-blue-600 transition-all rounded-xl shadow-2xl hover:shadow-emerald-500 hover:shadow-lg transform hover:scale-105">
              GET STARTED NOW
            </button>
          </template>
        </HowItWork>
      </div>
    </section>

    <!-- Animals Marketplace Section -->
    <section class="py-24 bg-gradient-to-br from-slate-50 to-white">
      <div class="max-w-7xl mx-auto px-4">
        <div class="text-center mb-20">
          <h2 class="text-4xl md:text-6xl font-black mb-6 tracking-tight">
            <span class="bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">Featured
              Animals</span>
          </h2>
          <p class="text-xl text-slate-600 font-light max-w-2xl mx-auto">
            Discover premium livestock from verified sellers across the country
          </p>
        </div>

        <AnimalsMarketplace :best-selling-animals="bestSellingAnimals" :recently-added-animals="recentlyAddedAnimals">
          <template #title-best-selling>
            <h3 class="text-2xl font-bold mb-8 text-slate-800">🔥 Best Selling This Week</h3>
          </template>
          <template #title-recently-added>
            <h3 class="text-2xl font-bold mb-8 text-slate-800">🆕 Recently Added</h3>
          </template>
          <template #button>
            <button
              class="bg-gradient-to-r from-slate-800 to-slate-900 text-white px-12 py-4 font-bold text-lg hover:from-slate-900 hover:to-black transition-all rounded-xl shadow-2xl">
              VIEW ALL ANIMALS
            </button>
          </template>
        </AnimalsMarketplace>
      </div>
    </section>

    <!-- Community Forum Section -->
    <section class="py-24 bg-gradient-to-br from-emerald-50 to-blue-50">
      <div class="max-w-7xl mx-auto px-4">
        <div class="text-center mb-20">
          <h2 class="text-4xl md:text-6xl font-black mb-6 tracking-tight">
            <span class="bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">Community
              Forum</span>
          </h2>
          <p class="text-xl text-slate-600 font-light max-w-2xl mx-auto">
            Connect with fellow farmers, share knowledge, and get expert advice
          </p>
        </div>

        <CommunityForum :forum-posts="forumPosts" :platform-stats="platformStats"
          :active-users-by-time="activeUsersByTime">
          <template #button>
            <button
              class="bg-gradient-to-r from-emerald-500 to-blue-500 text-white px-12 py-4 font-bold text-lg hover:from-emerald-600 hover:to-blue-600 transition-all rounded-xl shadow-2xl">
              JOIN THE COMMUNITY
            </button>
          </template>
        </CommunityForum>
      </div>
    </section>

    <!-- Testimonials Section -->
    <section class="py-24 bg-white">
      <div class="max-w-7xl mx-auto px-4">
        <div class="text-center mb-20">
          <h2 class="text-4xl md:text-6xl font-black mb-6 tracking-tight">
            <span class="bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">What Farmers
              Say</span>
          </h2>
          <p class="text-xl text-slate-600 font-light max-w-2xl mx-auto">
            Real stories from real farmers who've found success on our platform
          </p>
        </div>

        <TestimonialsSection :testimonials="testimonials">
          <template #trust-title>
            <h3 class="text-3xl font-bold mb-8">Trusted by Thousands</h3>
          </template>
        </TestimonialsSection>
      </div>
    </section>

    <!-- Final CTA Section -->
    <section
      class="py-24 bg-gradient-to-br from-slate-900 via-blue-900 to-emerald-900 text-white relative overflow-hidden">
      <div class="absolute inset-0 bg-gradient-to-r from-blue-600 to-emerald-600 opacity-10"></div>
      <div class="absolute top-0 left-1/4 w-96 h-96 bg-blue-500 opacity-20 rounded-full blur-3xl"></div>
      <div class="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-500 opacity-20 rounded-full blur-3xl"></div>

      <div class="max-w-4xl mx-auto px-4 text-center relative z-10">
        <h2 class="text-4xl md:text-6xl font-black mb-8 tracking-tight">
          Ready to Transform Your Farm?
        </h2>
        <p class="text-xl text-slate-300 font-light mb-12 max-w-2xl mx-auto">
          Join thousands of successful farmers who've found their perfect animals and grown their operations with our
          trusted platform.
        </p>

        <div class="flex flex-col sm:flex-row gap-6 justify-center">
          <button
            class="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-12 py-4 font-bold text-lg hover:from-emerald-600 hover:to-emerald-700 transition-all rounded-xl shadow-2xl hover:shadow-emerald-500 hover:shadow-lg transform hover:scale-105">
            START BUYING
          </button>
          <button
            class="border-2 border-white text-white px-12 py-4 font-bold text-lg hover:bg-white hover:text-slate-900 transition-all rounded-xl backdrop-blur-sm bg-white bg-opacity-10">
            START SELLING
          </button>
        </div>

        <div class="mt-12 text-slate-400 text-sm">
          Last updated: {{ lastUpdated }} • {{ activeUsersByTime.now }} users currently online
        </div>
      </div>
    </section>

    <!-- Footer -->
    <Footer />
  </div>
</template>
