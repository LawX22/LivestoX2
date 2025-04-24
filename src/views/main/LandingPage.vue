<script lang="ts">
import { computed, defineComponent, ref } from 'vue';
import NavBar from '../../components/Landing/NavBar.vue';
import Footer from '../../components/Landing/Footer.vue';
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
    Footer
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

    const animalCategories = [
      { value: 'all', label: 'All Animals', count: 35892, icon: '🐾' },
      { value: 'cattle', label: 'Cattle', count: 12483, icon: '🐄' },
      { value: 'horses', label: 'Horses', count: 8976, icon: '🐎' },
      { value: 'sheep', label: 'Sheep', count: 5214, icon: '🐑' },
      { value: 'goats', label: 'Goats', count: 3689, icon: '🐐' },
      { value: 'pigs', label: 'Pigs', count: 2975, icon: '🐖' },
      { value: 'poultry', label: 'Poultry', count: 2555, icon: '🐓' }
    ];

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
  <div class="min-h-screen font-sans text-gray-900 bg-white">
    <div class="fixed top-0 left-0 w-full z-50 bg-white shadow">
      <NavBar />
    </div>

    <!-- Sticky Statistics Bar BELOW NavBar -->
    <div class="sticky top-[64px] z-40 bg-gradient-to-r from-emerald-700 to-teal-800 text-white py-3 px-4 shadow-lg">
      <div class="max-w-7xl mx-auto flex flex-wrap justify-between items-center text-sm">
        <div class="flex items-center">
          <div class="animate-ping mr-2 h-2 w-2 rounded-full bg-emerald-300"></div>
          <span class="font-medium tracking-wide">{{ activeUsersByTime.now }} users online now</span>
        </div>
        <div class="flex items-center space-x-6">
          <span class="hidden md:inline-block">{{ platformStats.totalAnimalsListed.toLocaleString() }} Animals
            Listed</span>
          <span class="hidden md:inline-block">{{ platformStats.successfulSales.toLocaleString() }} Successful
            Transactions</span>
          <span>{{ platformStats.activeUsers.toLocaleString() }} Active Users</span>
          <span class="text-emerald-200 text-xs">Updated: {{ lastUpdated }}</span>
        </div>
      </div>
    </div>

    <!-- Hero and Statistics Section with Improved Visual Appeal -->
    <section
      class="relative py-28 px-4 sm:px-6 lg:px-8 overflow-hidden bg-gradient-to-br from-emerald-700 via-teal-600 to-green-500">
      <!-- Decorative elements -->
      <div class="absolute top-0 left-0 w-full h-full overflow-hidden opacity-10">
        <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <pattern id="dots" width="20" height="20" patternUnits="userSpaceOnUse">
              <circle cx="10" cy="10" r="1.5" fill="white" />
            </pattern>
            <pattern id="smallGrid" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" stroke-width="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dots)" />
          <rect x="10%" y="10%" width="80%" height="80%" fill="url(#smallGrid)" />
        </svg>
      </div>

      <!-- Subtle wave pattern for background interest -->
      <div class="absolute bottom-0 left-0 w-full opacity-20">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path
            d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
            fill="white"></path>
        </svg>
      </div>

      <div class="max-w-7xl mx-auto">
        <div class="flex flex-col md:flex-row items-center justify-between">
          <div class="md:w-1/2 mb-10 md:mb-0 relative">
            <div
              class="inline-block bg-white bg-opacity-20 rounded-full px-4 py-1 text-emerald-50 font-medium text-sm mb-6 backdrop-blur-sm shadow-sm">
              Trusted by {{ platformStats.farmersHelped.toLocaleString() }}+ farmers
            </div>
            <h1 class="text-5xl sm:text-7xl font-extrabold text-white mb-8 leading-tight tracking-tight">
              Find Your <span class="text-yellow-300 relative inline-block">
                Perfect
                <svg class="absolute -bottom-2 left-0 w-full" viewBox="0 0 100 10" preserveAspectRatio="none">
                  <path d="M0,5 C30,15 70,0 100,5 L100,10 L0,10 Z" fill="rgba(253, 224, 71, 0.3)" />
                </svg>
              </span> Farm Animals
            </h1>
            <p class="text-xl text-emerald-50 mb-10 font-light leading-relaxed max-w-lg">
              Connect with trusted farmers and livestock sellers across the country.
              Buy, sell, and learn about quality farm animals.
            </p>
            <div
              class="bg-white rounded-2xl p-2 mb-10 shadow-2xl backdrop-blur-sm transform hover:scale-105 transition-all duration-300">
              <div class="flex flex-col sm:flex-row space-y-2 sm:space-y-0">
                <div class="relative flex-grow">
                  <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none"
                      viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <input v-model="searchQuery" type="text" placeholder="Search for animals..."
                    class="w-full pl-12 pr-4 py-4 rounded-l-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 border-0 shadow-inner">
                </div>
                <select v-model="animalCategory"
                  class="px-4 py-4 bg-gray-50 text-gray-700 border-l border-gray-200 sm:rounded-none rounded-none">
                  <option v-for="category in animalCategories" :key="category.value" :value="category.value">
                    {{ category.icon }} {{ category.label }} ({{ category.count.toLocaleString() }})
                  </option>
                </select>
                <button
                  class="bg-gradient-to-r from-emerald-600 to-teal-700 text-white font-bold py-4 px-8 rounded-r-xl hover:shadow-lg transition duration-300 transform hover:-translate-y-1">
                  <div class="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24"
                      stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    Search
                  </div>
                </button>
              </div>
            </div>
            <div class="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <button
                class="bg-white text-emerald-800 font-bold py-4 px-8 rounded-xl hover:bg-emerald-50 transition duration-300 shadow-xl transform hover:-translate-y-1 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                Browse Animals
              </button>
              <button
                class="bg-transparent border-2 border-white text-white font-bold py-4 px-8 rounded-xl hover:bg-white hover:bg-opacity-10 transition duration-300 shadow-lg transform hover:-translate-y-1 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Join Community
              </button>
            </div>
          </div>
          <div class="md:w-1/2">
            <div class="relative">
              <!-- Decorative elements behind image -->
              <div class="absolute -top-6 -right-6 w-80 h-80 bg-yellow-300 rounded-full opacity-20 filter blur-3xl">
              </div>
              <div
                class="absolute -bottom-10 -left-10 w-64 h-64 bg-emerald-300 rounded-full opacity-20 filter blur-3xl">
              </div>

              <div
                class="relative rounded-3xl overflow-hidden shadow-2xl transform rotate-2 hover:rotate-0 transition-transform duration-500 group">
                <img src="/src/assets/Bull.jpg" alt="Happy farm animals"
                  class="w-full h-96 object-cover transform group-hover:scale-105 transition-transform duration-700">
                <div class="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-70">
                </div>
                <div class="absolute bottom-0 left-0 right-0 p-8">
                  <div class="flex justify-between items-center">
                    <p class="text-white font-bold text-lg">Trusted by {{ platformStats.farmersHelped.toLocaleString()
                      }}+
                      farmers nationwide</p>
                    <div
                      class="bg-emerald-500 text-white rounded-full px-4 py-2 text-sm font-bold flex items-center shadow-lg">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
                      </svg>
                      {{ platformStats.countries }} Countries
                    </div>
                  </div>
                </div>
              </div>

              <!-- Decorative pattern element -->
              <div
                class="absolute -bottom-8 -right-8 h-24 w-24 rounded-lg bg-yellow-400 bg-opacity-30 backdrop-blur-sm transform rotate-12">
              </div>
            </div>
          </div>
        </div>

        <!-- Integrated Platform Statistics with Motion -->
        <div class="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div
            class="text-center p-5 bg-white bg-opacity-20 rounded-2xl backdrop-blur-sm shadow-xl transform hover:scale-105 transition-all duration-300 border border-white border-opacity-20">
            <div class="text-4xl font-bold text-white mb-1">{{ platformStats.activeUsers.toLocaleString() }}</div>
            <div class="text-emerald-100 font-medium">Active Users</div>
          </div>
          <div
            class="text-center p-5 bg-white bg-opacity-20 rounded-2xl backdrop-blur-sm shadow-xl transform hover:scale-105 transition-all duration-300 border border-white border-opacity-20">
            <div class="text-4xl font-bold text-white mb-1">{{ platformStats.totalAnimalsListed.toLocaleString() }}
            </div>
            <div class="text-emerald-100 font-medium">Animals Listed</div>
          </div>
          <div
            class="text-center p-5 bg-white bg-opacity-20 rounded-2xl backdrop-blur-sm shadow-xl transform hover:scale-105 transition-all duration-300 border border-white border-opacity-20">
            <div class="text-4xl font-bold text-white mb-1">{{ platformStats.successfulSales.toLocaleString() }}</div>
            <div class="text-emerald-100 font-medium">Successful Sales</div>
          </div>
          <div
            class="text-center p-5 bg-white bg-opacity-20 rounded-2xl backdrop-blur-sm shadow-xl transform hover:scale-105 transition-all duration-300 border border-white border-opacity-20">
            <div class="text-4xl font-bold text-white mb-1">{{ platformStats.forumPosts.toLocaleString() }}</div>
            <div class="text-emerald-100 font-medium">Forum Posts</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Featured Categories Section -->
    <section class="py-16 bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <span class="text-emerald-600 font-semibold uppercase tracking-wider">Browse by category</span>
          <h2 class="text-3xl font-extrabold text-gray-900 mt-2">Find Your Perfect Farm Animal</h2>
          <div class="w-24 h-1 bg-gradient-to-r from-teal-500 to-emerald-500 mx-auto mt-4 rounded-full"></div>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-6">
          <div v-for="category in animalCategories" :key="category.value"
            class="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden group relative">
            <div class="bg-emerald-50 p-6 text-center group-hover:bg-emerald-100 transition-all duration-300">
              <div class="text-4xl mb-3">{{ category.icon }}</div>
              <h3 class="font-bold text-gray-900">{{ category.label }}</h3>
              <p class="text-emerald-600 font-medium text-sm mt-1">{{ category.count.toLocaleString() }} listings</p>
              <div
                class="absolute bottom-0 left-0 w-full h-1 bg-emerald-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left">
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Animals Marketplace Section with Enhanced Cards -->
    <section class="py-20 bg-white relative overflow-hidden">
      <!-- Decorative elements -->
      <div class="absolute top-0 right-0 -mt-20 -mr-20 opacity-5 w-96 h-96">
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <path fill="#10B981"
            d="M40.9,-47.3C56.1,-35.3,73.2,-24.8,79.2,-9.5C85.1,5.8,79.8,26,68.2,38.8C56.6,51.6,38.8,57,21.4,62.1C4,67.2,-13,72,-26.5,67.6C-40,63.1,-50,49.5,-59.5,34.8C-69,20.1,-78,4.3,-77.2,-11.2C-76.3,-26.7,-65.7,-41.8,-51.4,-53.9C-37.1,-65.9,-18.6,-74.9,-2.8,-71.6C13,-68.3,25.9,-59.3,40.9,-47.3Z"
            transform="translate(100 100)" />
        </svg>
      </div>
      <div class="absolute bottom-0 left-0 -mb-20 -ml-20 opacity-5 w-96 h-96">
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <path fill="#10B981"
            d="M46.3,-47.8C59.9,-34.6,70.5,-17.3,71.2,0.8C71.9,18.8,62.6,37.6,49,49.9C35.4,62.2,17.7,68,0.8,67.2C-16.1,66.4,-32.2,59,-45.8,46.8C-59.4,34.5,-70.6,17.3,-71.5,-0.9C-72.5,-19.1,-63.4,-38.1,-49.8,-51.3C-36.1,-64.4,-18.1,-71.8,-0.4,-71.4C17.3,-71,34.6,-62.8,46.3,-47.8Z"
            transform="translate(100 100)" />
        </svg>
      </div>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div class="flex flex-col md:flex-row justify-between items-center mb-16">
          <div>
            <span class="text-emerald-600 font-semibold uppercase tracking-wider">Premium selections</span>
            <h2 class="text-4xl font-extrabold text-gray-900 mt-2">Animal Marketplace</h2>
            <p class="text-lg text-gray-600 mt-4 max-w-2xl">Discover quality livestock from our trusted sellers with
              verified health records and thorough documentation.</p>
          </div>

          <div class="mt-8 md:mt-0 flex items-center space-x-4">
            <div class="bg-emerald-100 text-emerald-800 font-bold px-6 py-3 rounded-xl shadow-sm flex items-center">
              <span class="inline-flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                Filter Animals
              </span>
            </div>

            <button
              class="bg-white text-gray-800 border border-gray-300 font-bold px-6 py-3 rounded-xl shadow-sm hover:bg-gray-50 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7" />
              </svg>
              Sort By
            </button>

            <a href="#" class="text-emerald-600 font-bold hover:text-emerald-700 hover:underline flex items-center">
              View All
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 ml-1" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        </div>

        <!-- Best Selling Animals -->
        <div>
          <h3 class="text-2xl font-bold text-gray-900 mb-8">Best Selling Animals</h3>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <!-- Animal Cards -->
            <div v-for="animal in bestSellingAnimals" :key="animal.id"
              class="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
              <!-- Featured badge if applicable -->
              <div v-if="animal.featured" class="absolute top-4 left-4">
                <div
                  class="bg-yellow-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                  Featured
                </div>
              </div>

              <!-- Discount tag if applicable -->
              <div v-if="animal.discount" class="absolute top-4 right-4">
                <div class="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {{ animal.discount }}% OFF
                </div>
              </div>

              <div class="relative">
                <img :src="animal.image" :alt="animal.name" class="w-full h-56 object-cover">
                <div class="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-60">
                </div>
                <div class="absolute bottom-4 left-4">
                  <span class="bg-emerald-600 text-white text-xs font-medium px-2 py-1 rounded-full">{{ animal.type
                    }}</span>
                  <span class="bg-gray-800 bg-opacity-75 text-white text-xs font-medium px-2 py-1 rounded-full ml-2">{{
                    animal.views }} views</span>
                </div>
              </div>

              <div class="p-6">
                <div class="flex justify-between items-start mb-2">
                  <h4 class="text-xl font-bold text-gray-900">{{ animal.name }}</h4>
                  <div class="flex items-center bg-emerald-50 px-2 py-1 rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-yellow-500" fill="currentColor"
                      viewBox="0 0 24 24">
                      <path
                        d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                    <span class="text-sm font-medium text-gray-700 ml-1">{{ animal.rating }}</span>
                  </div>
                </div>

                <div class="text-sm text-gray-600 mb-4">
                  <div class="flex items-center mb-1">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-400 mr-1" fill="none"
                      viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                    {{ animal.breed }}
                  </div>
                  <div class="flex items-center mb-1">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-400 mr-1" fill="none"
                      viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {{ animal.age }}
                  </div>
                  <div class="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-400 mr-1" fill="none"
                      viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {{ animal.location }}
                  </div>
                </div>

                <div class="flex items-center justify-between mb-6">
                  <div>
                    <span class="text-xs text-gray-500">Listed {{ animal.listed }}</span>
                  </div>
                  <div>
                    <span class="text-xs text-gray-500">By {{ animal.seller }}</span>
                  </div>
                </div>

                <div class="flex items-center justify-between">
                  <div>
                    <span class="text-2xl font-bold text-emerald-600">${{ animal.price.toLocaleString() }}</span>
                    <span v-if="animal.discount" class="text-sm text-gray-500 line-through ml-2">${{
                      Math.round(animal.price / (1 - animal.discount / 100)).toLocaleString() }}</span>
                  </div>
                  <button
                    class="bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-4 py-2 rounded-lg transition-colors duration-300 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24"
                      stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    View Details
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Recently Added Animals -->
        <div class="mt-20">
          <h3 class="text-2xl font-bold text-gray-900 mb-8">Recently Added Animals</h3>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <!-- Animal Cards (similar structure as best selling) -->
            <div v-for="animal in recentlyAddedAnimals" :key="animal.id"
              class="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
              <!-- New badge if applicable -->
              <div v-if="animal.isNew" class="absolute top-4 left-4">
                <div
                  class="bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  New
                </div>
              </div>

              <!-- Featured badge if applicable -->
              <div v-if="animal.featured" class="absolute top-4 right-4">
                <div
                  class="bg-yellow-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                  Featured
                </div>
              </div>

              <div class="relative">
                <img :src="animal.image" :alt="animal.name" class="w-full h-56 object-cover">
                <div class="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-60">
                </div>
                <div class="absolute bottom-4 left-4">
                  <span class="bg-emerald-600 text-white text-xs font-medium px-2 py-1 rounded-full">{{ animal.type
                    }}</span>
                  <span class="bg-gray-800 bg-opacity-75 text-white text-xs font-medium px-2 py-1 rounded-full ml-2">{{
                    animal.views }} views</span>
                </div>
              </div>

              <div class="p-6">
                <div class="flex justify-between items-start mb-2">
                  <h4 class="text-xl font-bold text-gray-900">{{ animal.name }}</h4>
                  <div class="flex items-center bg-emerald-50 px-2 py-1 rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-yellow-500" fill="currentColor"
                      viewBox="0 0 24 24">
                      <path
                        d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                    <span class="text-sm font-medium text-gray-700 ml-1">{{ animal.rating }}</span>
                  </div>
                </div>

                <div class="text-sm text-gray-600 mb-4">
                  <div class="flex items-center mb-1">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-400 mr-1" fill="none"
                      viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                    {{ animal.breed }}
                  </div>
                  <div class="flex items-center mb-1">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-400 mr-1" fill="none"
                      viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {{ animal.age }}
                  </div>
                  <div class="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-400 mr-1" fill="none"
                      viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {{ animal.location }}
                  </div>
                </div>

                <div class="flex items-center justify-between mb-6">
                  <div>
                    <span class="text-xs text-gray-500">Listed {{ animal.listed }}</span>
                  </div>
                  <div>
                    <span class="text-xs text-gray-500">By {{ animal.seller }}</span>
                  </div>
                </div>

                <div class="flex items-center justify-between">
                  <div>
                    <span class="text-2xl font-bold text-emerald-600">${{ animal.price.toLocaleString() }}</span>
                    <span v-if="animal.discount" class="text-sm text-gray-500 line-through ml-2">${{
                      Math.round(animal.price / (1 - animal.discount / 100)).toLocaleString() }}</span>
                  </div>
                  <button
                    class="bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-4 py-2 rounded-lg transition-colors duration-300 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24"
                      stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    View Details
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Community Forum Section -->
    <section class="py-20 bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <span class="text-emerald-600 font-semibold uppercase tracking-wider">Knowledge sharing</span>
          <h2 class="text-4xl font-extrabold text-gray-900 mt-2">Community Forum</h2>
          <p class="text-lg text-gray-600 mt-4 max-w-2xl mx-auto">Connect with experienced farmers, share knowledge, and
            get advice from our thriving farming community.</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div v-for="post in forumPosts" :key="post.id"
            class="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
            <div class="p-6">
              <div class="flex items-center space-x-2 mb-4">
                <img :src="post.authorImage" :alt="post.author" class="w-10 h-10 rounded-full">
                <div>
                  <h4 class="font-medium text-gray-900">{{ post.author }}</h4>
                  <p class="text-sm text-gray-500">{{ post.date }}</p>
                </div>
              </div>

              <span
                class="inline-block px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-medium rounded-full mb-4">
                {{ post.category }}
              </span>

              <h3 class="text-xl font-bold text-gray-900 mb-3">{{ post.title }}</h3>
              <p class="text-gray-600 mb-6">{{ post.excerpt }}</p>

              <div class="flex justify-between items-center border-t border-gray-100 pt-4">
                <div class="flex items-center space-x-4">
                  <div class="flex items-center text-gray-500">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24"
                      stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    {{ post.likes }}
                  </div>
                  <div class="flex items-center text-gray-500">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24"
                      stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    {{ post.comments }}
                  </div>
                </div>

                <a href="#" class="text-emerald-600 font-medium hover:text-emerald-700 hover:underline">Read Post</a>
              </div>
            </div>
          </div>
        </div>

        <div class="text-center">
          <a href="#"
            class="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700 md:py-4 md:text-lg md:px-10 transition-colors duration-300 shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
            </svg>
            Explore All Forum Topics
          </a>
        </div>
      </div>
    </section>

    <!-- Testimonials Section with Enhanced Cards -->
    <section class="py-20 bg-white relative overflow-hidden">
      <div class="absolute top-20 right-0 w-96 h-96 bg-emerald-100 rounded-full filter blur-3xl opacity-30"></div>
      <div class="absolute bottom-20 left-0 w-96 h-96 bg-emerald-100 rounded-full filter blur-3xl opacity-30"></div>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div class="text-center mb-16">
          <span class="text-emerald-600 font-semibold uppercase tracking-wider">Testimonials</span>
          <h2 class="text-4xl font-extrabold text-gray-900 mt-2">What Our Community Says</h2>
          <p class="text-lg text-gray-600 mt-4 max-w-2xl mx-auto">Hear from farmers who have successfully bought, sold,
            and learned on our platform.</p>
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

    <!-- Call to Action Section -->
    <section class="py-20 bg-gradient-to-br from-emerald-700 via-teal-600 to-green-500 relative overflow-hidden">
      <div class="absolute inset-0 overflow-hidden opacity-10">
        <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <pattern id="dots-footer" width="20" height="20" patternUnits="userSpaceOnUse">
              <circle cx="10" cy="10" r="1.5" fill="white" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dots-footer)" />
        </svg>
      </div>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div class="max-w-4xl mx-auto text-center">
          <h2 class="text-4xl sm:text-5xl font-extrabold text-white mb-8 leading-tight tracking-tight">Ready to Connect
            with Quality Livestock Sellers?</h2>
          <p class="text-xl text-emerald-50 mb-12">Join thousands of farmers who find their perfect farm animals, share
            knowledge, and grow their agricultural business with us.</p>

          <div class="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 justify-center">
            <button
              class="bg-white text-emerald-800 font-bold py-4 px-8 rounded-xl hover:bg-emerald-50 transition duration-300 shadow-xl flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Create Free Account
            </button>
            <button
              class="bg-transparent border-2 border-white text-white font-bold py-4 px-8 rounded-xl hover:bg-white hover:bg-opacity-10 transition duration-300 shadow-lg flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Learn More
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- How It Works Section -->
    <section class="py-20 bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <span class="text-emerald-600 font-semibold uppercase tracking-wider">Process</span>
          <h2 class="text-4xl font-extrabold text-gray-900 mt-2">How Our Platform Works</h2>
          <p class="text-lg text-gray-600 mt-4 max-w-2xl mx-auto">Simple steps to connect farmers and buyers in our
            trusted marketplace.</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
          <!-- Step 1 -->
          <div
            class="bg-white rounded-2xl shadow-lg p-8 relative hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 text-center">
            <div class="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-emerald-600" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div
              class="absolute -top-4 -right-4 bg-emerald-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-lg">
              1</div>
            <h3 class="text-xl font-bold text-gray-900 mb-4">Create Account</h3>
            <p class="text-gray-600">Sign up for free and complete your profile with your farm details and location.</p>
          </div>

          <!-- Step 2 -->
          <div
            class="bg-white rounded-2xl shadow-lg p-8 relative hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 text-center">
            <div class="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-emerald-600" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
              </svg>
            </div>
            <div
              class="absolute -top-4 -right-4 bg-emerald-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-lg">
              2</div>
            <h3 class="text-xl font-bold text-gray-900 mb-4">Browse or List</h3>
            <p class="text-gray-600">Search for animals or create detailed listings with health records and
              documentation.</p>
          </div>

          <!-- Step 3 -->
          <div
            class="bg-white rounded-2xl shadow-lg p-8 relative hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 text-center">
            <div class="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-emerald-600" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <div
              class="absolute -top-4 -right-4 bg-emerald-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-lg">
              3</div>
            <h3 class="text-xl font-bold text-gray-900 mb-4">Connect</h3>
            <p class="text-gray-600">Message sellers directly, ask questions, and arrange visits to view animals in
              person.</p>
          </div>

          <!-- Step 4 -->
          <div
            class="bg-white rounded-2xl shadow-lg p-8 relative hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 text-center">
            <div class="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-emerald-600" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div
              class="absolute -top-4 -right-4 bg-emerald-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-lg">
              4</div>
            <h3 class="text-xl font-bold text-gray-900 mb-4">Complete Sale</h3>
            <p class="text-gray-600">Finalize transactions securely and leave reviews to build our trusted community.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Newsletter Section -->
    <section class="py-16 bg-emerald-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="bg-white rounded-3xl shadow-xl overflow-hidden">
          <div class="flex flex-col md:flex-row">
            <div class="md:w-1/2 bg-gradient-to-br from-emerald-700 via-teal-600 to-green-500 p-12 text-white">
              <h3 class="text-3xl font-bold mb-6">Stay Updated with Farm Animal Market Trends</h3>
              <p class="text-emerald-50 mb-8">Get weekly insights on market prices, farming tips, and exclusive deals
                delivered to your inbox.</p>
              <ul class="space-y-4">
                <li class="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-emerald-300 mr-2" fill="none"
                    viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Weekly market price updates
                </li>
                <li class="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-emerald-300 mr-2" fill="none"
                    viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Exclusive deals and offers
                </li>
                <li class="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-emerald-300 mr-2" fill="none"
                    viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Expert farming advice and tips
                </li>
                <li class="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-emerald-300 mr-2" fill="none"
                    viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Agricultural policy updates
                </li>
              </ul>
            </div>

            <div class="md:w-1/2 p-12 flex items-center">
              <div class="w-full">
                <h4 class="text-2xl font-bold text-gray-900 mb-6">Subscribe to Our Newsletter</h4>
                <form class="space-y-4">
                  <div>
                    <label for="full-name" class="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input type="text" id="full-name"
                      class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500">
                  </div>
                  <div>
                    <label for="email" class="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                    <input type="email" id="email"
                      class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500">
                  </div>
                  <div>
                    <label for="farm-type" class="block text-sm font-medium text-gray-700 mb-1">Farm Type</label>
                    <select id="farm-type"
                      class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500">
                      <option>Select farm type</option>
                      <option>Dairy Farm</option>
                      <option>Cattle Ranch</option>
                      <option>Poultry Farm</option>
                      <option>Mixed Livestock</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <button type="submit"
                    class="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-300 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24"
                      stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    Subscribe Now
                  </button>
                </form>
                <p class="text-xs text-gray-500 mt-4">By subscribing, you agree to our Privacy Policy and consent to
                  receive updates from our company.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Include the Footer component -->
    <Footer />
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}

@keyframes ping {

  75%,
  100% {
    transform: scale(2);
    opacity: 0;
  }
}

.animate-ping {
  animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
}
</style>