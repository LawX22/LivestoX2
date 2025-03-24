<script lang="ts">
import { defineComponent, ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import Dropdown from 'primevue/dropdown';
import Badge from 'primevue/badge';
import Paginator from 'primevue/paginator';

interface Livestock {
  id: number;
  title: string;
  description: string;
  category: string;
  breed: string;
  age: number;
  ageUnit: string;
  gender: string;
  weight: number;
  weightUnit: string;
  price: number;
  negotiable: boolean;
  quantity: number;
  location: string;
  healthStatus: string;
  feedingType: string;
  imageUrl: string;
  videoUrl?: string;
  videoThumbnail?: string;
  certified: boolean;
  auction: boolean;
  availableImmediate: boolean;
  isFavorite: boolean;
  listedDate: Date;
}

export default defineComponent({
  name: 'LivestockMarketplace',
  components: {
    Button,
    InputText,
    Dropdown,
    Badge,
    Paginator
  },
  setup() {
    // Add router
    const router = useRouter();

    // Search and basic filters
    const searchQuery = ref('');
    const selectedCategory = ref<{ name: string; code: string } | null>(null);
    const sortOption = ref({ value: 'newest', label: 'Newest First' });
    const first = ref(0);

    // View mode toggle (grid, list, compact)
    const viewMode = ref<'grid' | 'list' | 'compact'>('grid');

    // Options for dropdowns
    const categories = ref([
      { name: 'Cattle', code: 'cattle' },
      { name: 'Pigs', code: 'pigs' },
      { name: 'Goats', code: 'goats' },
      { name: 'Sheep', code: 'sheep' },
      { name: 'Horses', code: 'horses' },
      { name: 'Poultry', code: 'poultry' }
    ]);

    const sortOptions = ref([
      { value: 'newest', label: 'Newest First' },
      { value: 'oldest', label: 'Oldest First' },
      { value: 'price_low', label: 'Price: Low to High' },
      { value: 'price_high', label: 'Price: High to Low' },
      { value: 'popularity', label: 'Popularity' }
    ]);

    // Livestock listings
    const listings = ref<Livestock[]>([]);

    // Generate mock listings data
    const generateListings = () => {
      const items: Livestock[] = [];
      const categories = ['Cattle', 'Pigs', 'Goats', 'Sheep', 'Horses', 'Poultry'];
      const breeds = ['Brahman', 'Angus', 'Holstein', 'Jersey', 'Duroc', 'Hampshire'];
      const genders = ['Male', 'Female'];
      const locations = ['Cebu City', 'Mandaue City', 'Lapu-Lapu City', 'Bogo City', 'Toledo City'];

      for (let i = 0; i < 20; i++) {
        const categoryIndex = i % categories.length;
        const breedIndex = i % breeds.length;
        const gender = genders[i % 2];
        const location = locations[i % locations.length];
        const daysAgo = Math.floor(Math.random() * 30);

        items.push({
          id: i + 1,
          title: `${breeds[breedIndex]} ${categories[categoryIndex]} - ${gender}`,
          description: "Quality livestock for sale. Well cared for and in excellent health.",
          category: categories[categoryIndex],
          breed: breeds[breedIndex],
          age: Math.floor(Math.random() * 5) + 1,
          ageUnit: "years",
          gender: gender,
          weight: Math.floor(Math.random() * 500) + 200,
          weightUnit: "kg",
          price: Math.floor(Math.random() * 4000) + 500,
          negotiable: Math.random() > 0.5,
          quantity: Math.floor(Math.random() * 5) + 1,
          location: location,
          healthStatus: "Vaccinated",
          feedingType: "Grass-fed",
          imageUrl: `/src/assets/Bull.jpg?text=${breeds[breedIndex]}+${i}`,
          certified: Math.random() > 0.7,
          auction: Math.random() > 0.8,
          availableImmediate: Math.random() > 0.3,
          isFavorite: Math.random() > 0.9,
          listedDate: new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000)
        });
      }

      return items;
    };

    const filteredListings = computed(() => {
      let result = listings.value;

      // Apply search query filter
      if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase();
        result = result.filter(item =>
          item.title.toLowerCase().includes(query) ||
          item.category.toLowerCase().includes(query) ||
          item.breed.toLowerCase().includes(query) ||
          item.location.toLowerCase().includes(query)
        );
      }

      // Apply category filter
      if (selectedCategory.value) {
        result = result.filter(item =>
          selectedCategory.value && item.category === selectedCategory.value.name
        );
      }

      // Apply sorting
      if (sortOption.value) {
        switch (sortOption.value.value) {
          case 'newest':
            result = [...result].sort((a, b) =>
              b.listedDate.getTime() - a.listedDate.getTime()
            );
            break;
          case 'oldest':
            result = [...result].sort((a, b) =>
              a.listedDate.getTime() - b.listedDate.getTime()
            );
            break;
          case 'price_low':
            result = [...result].sort((a, b) => a.price - b.price);
            break;
          case 'price_high':
            result = [...result].sort((a, b) => b.price - a.price);
            break;
          // For popularity, we could use a combination of views, favorites, etc.
          // For demo purposes, we'll just use a random sort
          case 'popularity':
            result = [...result].sort(() => Math.random() - 0.5);
            break;
        }
      }

      return result;
    });

    // Updated method to view a listing - redirects to the ViewListings route without using ID
    const viewListing = (listing: Livestock) => {
      // Store the selected listing in localStorage
      localStorage.setItem('selectedListing', JSON.stringify(listing));

      // Navigate to the view page without ID parameter
      router.push('/main/ViewListings');
      console.log('Redirecting to /main/ViewListings without ID parameter');
    };

    // Navigate to post new livestock page
    const navigateToPostLivestock = () => {
      router.push('/main/PostLivestock');
      console.log('Redirecting to /main/PostLivestock');
    };

    const toggleFavorite = (listing: Livestock) => {
      listing.isFavorite = !listing.isFavorite;
      // In a real app, you would save this to your API
    };

    const formatPrice = (price: number): string => {
      return price.toLocaleString();
    };

    const formatDate = (date: Date): string => {
      // Calculate days ago
      const now = new Date();
      const diffTime = Math.abs(now.getTime() - date.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 0) {
        return 'Today';
      } else if (diffDays === 1) {
        return 'Yesterday';
      } else if (diffDays < 7) {
        return `${diffDays} days ago`;
      } else {
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      }
    };

    onMounted(() => {
      // In a real app, this would be an API call
      listings.value = generateListings();
    });

    return {
      searchQuery,
      selectedCategory,
      sortOption,
      first,
      viewMode,

      categories,
      sortOptions,

      listings,
      filteredListings,

      viewListing,
      navigateToPostLivestock,
      toggleFavorite,
      formatPrice,
      formatDate
    };
  }
});
</script>

<template>
  <div class="livestock-marketplace">
    <!-- Hero/Banner Section with pastel colors -->
    <div class="relative bg-gradient-to-br from-green-500 to-green-800 text-white overflow-hidden">
      <!-- Background Pattern -->
      <div class="absolute inset-0 opacity-10">
        <div class="absolute inset-0"
          style="background-image: url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.4\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E');">
        </div>
      </div>

      <!-- Main Content -->
      <div class="container mx-auto px-4 py-16 md:py-24 relative z-10">
        <!-- Header Section -->
        <div class="flex flex-col items-center text-center mb-12">
          <!-- Logo with improved animation -->
          <div class="bg-white p-4 rounded-full shadow-lg mb-6 transform transition duration-700 hover:scale-105">
            <img src="/src/assets/vue.svg" alt="Livestock Marketplace Logo" class="w-20 h-20 md:w-24 md:h-24" />
          </div>

          <!-- Heading with improved typography -->
          <h1 class="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight tracking-tight">
            Find Premium Livestock <span class="block md:inline text-green-100">For Your Farm</span>
          </h1>

          <!-- Subheading with better contrast -->
          <p class="text-xl text-green-50 mb-8 leading-relaxed max-w-2xl mx-auto">
            Connect directly with trusted breeders and sellers across the Philippines.
          </p>

          <!-- CTA Buttons - Adding multiple options -->
          <div class="flex flex-col sm:flex-row gap-4 w-full justify-center">
            <button @click="navigateToPostLivestock"
              class="bg-white text-green-700 font-bold py-3 px-8 rounded-full shadow-lg hover:bg-green-50 hover:text-green-800 transform hover:scale-105 transition duration-300 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
                  clip-rule="evenodd" />
              </svg>
              Post Your Livestock
            </button>
            <button
              class="bg-green-800 bg-opacity-60 text-white font-bold py-3 px-8 rounded-full shadow-lg hover:bg-green-900 transform hover:scale-105 transition duration-300 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                <path fill-rule="evenodd"
                  d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                  clip-rule="evenodd" />
              </svg>
              Browse Livestock
            </button>
          </div>
        </div>

        <!-- Stats Bar -->
        <div
          class="bg-white bg-opacity-80 rounded-lg shadow-md py-4 px-6 max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
          <div class="text-center">
            <p class="text-green-800 font-bold text-2xl md:text-3xl">5,000+</p>
            <p class="text-gray-600 text-sm">Active Listings</p>
          </div>
          <div class="text-center">
            <p class="text-green-800 font-bold text-2xl md:text-3xl">3,200+</p>
            <p class="text-gray-600 text-sm">Verified Sellers</p>
          </div>
          <div class="text-center">
            <p class="text-green-800 font-bold text-2xl md:text-3xl">98%</p>
            <p class="text-gray-600 text-sm">Satisfaction Rate</p>
          </div>
          <div class="text-center">
            <p class="text-green-800 font-bold text-2xl md:text-3xl">78</p>
            <p class="text-gray-600 text-sm">Provinces Covered</p>
          </div>
        </div>
      </div>

      <!-- Decorative wave divider -->
      <div class="absolute bottom-0 left-0 right-0">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 100" class="w-full h-auto text-white fill-current">
          <path
            d="M0,64L60,69.3C120,75,240,85,360,80C480,75,600,53,720,48C840,43,960,53,1080,58.7C1200,64,1320,64,1380,64L1440,64L1440,100L1380,100C1320,100,1200,100,1080,100C960,100,840,100,720,100C600,100,480,100,360,100C240,100,120,100,60,100L0,100Z">
          </path>
        </svg>
      </div>
    </div>

    <!-- Search Section - More elegant and refined -->
    <div class="bg-white border-b shadow-sm sticky top-0 z-10">
      <div class="container mx-auto px-4 py-3">
        <div class="flex flex-col md:flex-row justify-between items-center gap-4">
          <div class="w-full md:w-1/2">
            <span class="p-input-icon-left w-full relative">
              <i class="pi pi-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
              <InputText v-model="searchQuery" placeholder="Search by type, breed, or location..."
                class="w-full pl-10 py-2 rounded-full border-gray-300" />
            </span>
          </div>
          <div class="w-full md:w-auto flex items-center gap-3">
            <Dropdown v-model="selectedCategory" :options="categories" optionLabel="name" placeholder="All Categories"
              class="w-40" />
            <Dropdown v-model="sortOption" :options="sortOptions" optionLabel="label" class="w-48" />
            <!-- View Toggle -->
            <div class="flex items-center border rounded-full p-1 bg-gray-100">
              <button @click="viewMode = 'grid'" class="p-2 rounded-full transition-colors"
                :class="viewMode === 'grid' ? 'bg-green-200 text-green-800' : 'text-gray-500 hover:text-green-700'">
                <i class="pi pi-th-large"></i>
              </button>
              <button @click="viewMode = 'list'" class="p-2 rounded-full transition-colors"
                :class="viewMode === 'list' ? 'bg-green-200 text-green-800' : 'text-gray-500 hover:text-green-700'">
                <i class="pi pi-list"></i>
              </button>
              <button @click="viewMode = 'compact'" class="p-2 rounded-full transition-colors"
                :class="viewMode === 'compact' ? 'bg-green-200 text-green-800' : 'text-gray-500 hover:text-green-700'">
                <i class="pi pi-table"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content Area -->
    <div class="container mx-auto px-4 py-8">
      <!-- Filter chips and result count -->
      <div class="flex flex-wrap items-center gap-2 mb-6">
        <span class="text-gray-700 font-medium">{{ filteredListings.length }} listings found</span>
        <div class="h-4 w-px bg-gray-300 mx-2"></div>
        <div class="flex flex-wrap gap-2">
          <span v-if="selectedCategory"
            class="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm flex items-center">
            {{ selectedCategory.name }}
            <button class="ml-2 text-green-600 hover:text-green-800" @click="selectedCategory = null">
              <i class="pi pi-times-circle"></i>
            </button>
          </span>
        </div>
      </div>

      <!-- Grid View -->
      <div v-if="viewMode === 'grid'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="listing in filteredListings" :key="listing.id"
          class="livestock-card bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col">
          <div class="relative">
            <!-- Image with gradient overlay -->
            <div class="relative h-52 overflow-hidden">
              <img :src="listing.imageUrl" :alt="listing.title"
                class="w-full h-full object-cover transition-transform duration-500 hover:scale-105" />

              <!-- Price badge -->
              <div
                class="absolute bottom-3 left-3 bg-white/90 text-green-600 px-3 py-1 rounded-lg text-base font-bold shadow-md">
                ${{ formatPrice(listing.price) }}
              </div>

              <!-- Available now badge -->
              <div v-if="listing.availableImmediate"
                class="absolute bottom-3 right-3 bg-green-100 text-green-800 px-2 py-0.5 rounded-full text-xs font-medium inline-flex items-center">
                <i class="pi pi-check-circle mr-1"></i> Available Now
              </div>
            </div>

            <!-- Top badges -->
            <div class="absolute top-3 left-3 right-3 flex justify-between">
              <div class="flex gap-1.5">
                <span v-if="listing.certified"
                  class="bg-purple-100 text-purple-800 px-2.5 py-1 rounded-full text-xs font-semibold flex items-center shadow-sm">
                  <i class="pi pi-check-circle mr-1"></i> Certified
                </span>
                <span v-if="listing.auction"
                  class="bg-amber-100 text-amber-800 px-2.5 py-1 rounded-full text-xs font-semibold flex items-center shadow-sm">
                  <i class="pi pi-clock mr-1"></i> Auction
                </span>
              </div>

              <!-- Favorite button -->
              <button
                class="w-8 h-8 flex items-center justify-center rounded-full shadow-md transition-all duration-200"
                :class="[listing.isFavorite ? 'bg-red-500 text-white' : 'bg-white/90 text-gray-500 hover:bg-red-50 hover:text-red-500']"
                @click="toggleFavorite(listing)" aria-label="Toggle favorite">
                <i class="pi pi-heart-fill text-sm"></i>
              </button>
            </div>
          </div>

          <div class="p-4 flex-1 flex flex-col">
            <!-- Title -->
            <h3
              class="text-base font-bold text-gray-800 hover:text-green-600 transition-colors cursor-pointer line-clamp-2 mb-2"
              @click="viewListing(listing)">
              {{ listing.title }}
            </h3>

            <!-- Location and date -->
            <div class="flex items-center text-xs text-gray-500 mb-3">
              <i class="pi pi-map-marker mr-1 text-green-600"></i>
              <span>{{ listing.location }}</span>
              <div class="mx-2 h-1 w-1 rounded-full bg-gray-300"></div>
              <span>{{ formatDate(listing.listedDate) }}</span>
            </div>

            <!-- Description -->
            <div class="bg-gray-50 p-3 rounded-lg mb-3">
              <p class="text-gray-700 text-xs line-clamp-2">{{ listing.description }}</p>
            </div>

            <!-- Key specs -->
            <div class="flex flex-col gap-y-2 text-xs text-gray-700 mb-3">
              <!-- First row -->
              <div class="grid grid-cols-2 gap-2">
                <div class="flex items-center p-2 border border-gray-200 rounded-md bg-gray-50">
                  <i class="pi pi-tag text-green-600 mr-1.5"></i>
                  <span>{{ listing.category }}</span>
                </div>
                <div class="flex items-center p-2 border border-gray-200 rounded-md bg-gray-50">
                  <i class="pi pi-calendar text-green-600 mr-1.5"></i>
                  <span>{{ listing.age }} {{ listing.ageUnit }}</span>
                </div>
              </div>

              <!-- Second row -->
              <div class="grid grid-cols-2 gap-2">
                <div class="flex items-center p-2 border border-gray-200 rounded-md bg-gray-50">
                  <i class="pi pi-heart text-green-600 mr-1.5"></i>
                  <span>{{ listing.gender }}</span>
                </div>
                <div class="flex items-center p-2 border border-gray-200 rounded-md bg-gray-50">
                  <i class="pi pi-arrows-h text-green-600 mr-1.5"></i>
                  <span>{{ listing.weight }} {{ listing.weightUnit }}</span>
                </div>
              </div>
            </div>

            <!-- CTA Button -->
            <div class="mt-auto">
              <button @click="viewListing(listing)"
                class="w-full py-2.5 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors duration-300 flex items-center justify-center">
                <i class="pi pi-eye mr-2"></i>
                View Details
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- List View -->
      <div v-if="viewMode === 'list'" class="flex flex-col gap-4">
        <div v-for="listing in filteredListings" :key="listing.id"
          class="livestock-list-item bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100">
          <div class="flex flex-col md:flex-row">
            <!-- Image container -->
            <div class="relative w-full md:w-64 h-48 md:h-auto">
              <img :src="listing.imageUrl" :alt="listing.title" class="w-full h-full object-cover" />

              <!-- Badges overlay -->
              <div class="absolute top-3 left-3 flex flex-col gap-1.5">
                <span v-if="listing.certified"
                  class="bg-purple-100 text-purple-800 px-2.5 py-1 rounded-full text-xs font-semibold flex items-center shadow-sm">
                  <i class="pi pi-check-circle mr-1"></i> Certified
                </span>
                <span v-if="listing.auction"
                  class="bg-amber-100 text-amber-800 px-2.5 py-1 rounded-full text-xs font-semibold flex items-center shadow-sm">
                  <i class="pi pi-clock mr-1"></i> Auction
                </span>
              </div>
            </div>

            <!-- Content -->
            <div class="flex-1 p-4 flex flex-col">
              <div class="flex justify-between items-start mb-2">
                <!-- Title -->
                <h3 class="text-lg font-bold text-gray-800 hover:text-green-600 transition-colors cursor-pointer"
                  @click="viewListing(listing)">
                  {{ listing.title }}
                </h3>

                <!-- Favorite button -->
                <button
                  class="w-8 h-8 flex items-center justify-center rounded-full shadow-sm transition-all duration-200"
                  :class="[listing.isFavorite ? 'bg-red-500 text-white' : 'bg-white text-gray-500 hover:bg-red-50 hover:text-red-500']"
                  @click="toggleFavorite(listing)" aria-label="Toggle favorite">
                  <i class="pi pi-heart-fill text-sm"></i>
                </button>
              </div>

              <!-- Location and date -->
              <div class="flex items-center text-sm text-gray-500 mb-3">
                <i class="pi pi-map-marker mr-1 text-green-600"></i>
                <span>{{ listing.location }}</span>
                <div class="mx-2 h-1 w-1 rounded-full bg-gray-300"></div>
                <span>{{ formatDate(listing.listedDate) }}</span>
              </div>

              <!-- Description -->
              <p class="text-gray-600 text-sm mb-4 line-clamp-2">{{ listing.description }}</p>

              <!-- Specs -->
              <div class="flex flex-wrap gap-3 mb-4">
                <div class="flex items-center text-sm">
                  <i class="pi pi-tag text-green-600 mr-1.5"></i>
                  <span class="text-gray-700">{{ listing.category }}</span>
                </div>
                <div class="flex items-center text-sm">
                  <i class="pi pi-calendar text-green-600 mr-1.5"></i>
                  <span class="text-gray-700">{{ listing.age }} {{ listing.ageUnit }}</span>
                </div>
                <div class="flex items-center text-sm">
                  <i class="pi pi-heart text-green-600 mr-1.5"></i>
                  <span class="text-gray-700">{{ listing.gender }}</span>
                </div>
                <div class="flex items-center text-sm">
                  <i class="pi pi-arrows-h text-green-600 mr-1.5"></i>
                  <span class="text-gray-700">{{ listing.weight }} {{ listing.weightUnit }}</span>
                </div>
              </div>

              <!-- Price and CTA -->
              <div class="mt-auto flex flex-wrap items-center justify-between gap-3">
                <div>
                  <span class="text-lg font-bold text-green-600">${{ formatPrice(listing.price) }}</span>
                  <span v-if="listing.negotiable" class="text-sm text-gray-500 ml-2">(Negotiable)</span>
                </div>
                <div class="flex items-center gap-3">
                  <span v-if="listing.availableImmediate"
                    class="bg-green-100 text-green-800 px-2 py-0.5 rounded-full text-xs font-medium inline-flex items-center">
                    <i class="pi pi-check-circle mr-1"></i> Available Now
                  </span>
                  <button @click="viewListing(listing)"
                    class="py-2 px-4 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors duration-300 flex items-center">
                    <i class="pi pi-eye mr-2"></i>
                    View Details
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Compact View -->
      <div v-if="viewMode === 'compact'" class="overflow-x-auto">
        <table class="min-w-full bg-white border border-gray-200 shadow-sm rounded-lg">
          <thead class="bg-gray-50">
            <tr>
              <th class="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Listing</th>
              <th class="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
              <th class="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Breed</th>
              <th class="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Age</th>
              <th class="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Weight</th>
              <th class="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
              <th class="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
              <th class="py-3 px-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr v-for="listing in filteredListings" :key="listing.id" class="hover:bg-gray-50">
              <td class="py-3 px-4">
                <div class="flex items-center">
                  <div class="h-10 w-10 flex-shrink-0 mr-3 rounded-md overflow-hidden">
                    <img :src="listing.imageUrl" :alt="listing.title" class="h-full w-full object-cover" />
                  </div>
                  <div class="flex flex-col">
                    <span class="text-sm font-medium text-gray-900 hover:text-green-600 cursor-pointer"
                      @click="viewListing(listing)">{{ listing.title }}</span>
                    <span class="text-xs text-gray-500">{{ formatDate(listing.listedDate) }}</span>
                  </div>
                </div>
              </td>
              <td class="py-3 px-4 text-sm text-gray-700">{{ listing.category }}</td>
              <td class="py-3 px-4 text-sm text-gray-700">{{ listing.breed }}</td>
              <td class="py-3 px-4 text-sm text-gray-700">{{ listing.age }} {{ listing.ageUnit }}</td>
              <td class="py-3 px-4 text-sm text-gray-700">{{ listing.weight }} {{ listing.weightUnit }}</td>
              <td class="py-3 px-4">
                <span class="text-sm font-medium text-green-600">${{ formatPrice(listing.price) }}</span>
              </td>
              <td class="py-3 px-4 text-sm text-gray-700">{{ listing.location }}</td>
              <td class="py-3 px-4 text-sm text-center">
                <div class="flex items-center justify-center gap-2">
                  <button @click="toggleFavorite(listing)"
                    :class="[listing.isFavorite ? 'text-red-500' : 'text-gray-400 hover:text-red-500']"
                    class="p-1.5 rounded-full transition-colors">
                    <i class="pi pi-heart-fill"></i>
                  </button>
                  <button @click="viewListing(listing)"
                    class="bg-green-600 hover:bg-green-700 text-white text-xs py-1 px-2.5 rounded transition-colors">
                    View
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Empty State -->
      <div v-if="filteredListings.length === 0" class="bg-white border border-gray-200 rounded-lg p-8 text-center">
        <div class="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <i class="pi pi-search text-3xl text-gray-400"></i>
        </div>
        <h3 class="text-lg font-medium text-gray-800 mb-2">No listings found</h3>
        <p class="text-gray-600 mb-4">Try adjusting your search or filter criteria.</p>
        <button @click="searchQuery = ''; selectedCategory = null"
          class="text-green-600 font-medium hover:text-green-700">
          Reset filters
        </button>
      </div>

      <!-- Pagination -->
      <div class="mt-8">
        <Paginator v-model:first="first" :rows="10" :totalRecords="filteredListings.length" />
      </div>
    </div>

    <!-- Footer Section with better styling -->
    <footer class="bg-gray-900 text-white pt-12 pb-6">
      <div class="container mx-auto px-4">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <!-- About Column -->
          <div>
            <h3 class="text-lg font-bold mb-4 text-green-400">About Livestock Marketplace</h3>
            <p class="text-gray-400 mb-4 text-sm">
              Connecting farmers, breeders, and buyers across the Philippines with the best livestock and
              agricultural products.
            </p>
            <div class="flex space-x-4">
              <a href="#" class="text-gray-400 hover:text-white transition-colors">
                <i class="pi pi-facebook text-xl"></i>
              </a>
              <a href="#" class="text-gray-400 hover:text-white transition-colors">
                <i class="pi pi-twitter text-xl"></i>
              </a>
              <a href="#" class="text-gray-400 hover:text-white transition-colors">
                <i class="pi pi-instagram text-xl"></i>
              </a>
            </div>
          </div>

          <!-- Quick Links -->
          <div>
            <h3 class="text-lg font-bold mb-4 text-green-400">Quick Links</h3>
            <ul class="space-y-2 text-sm">
              <li><a href="#" class="text-gray-400 hover:text-white transition-colors">Home</a></li>
              <li><a href="#" class="text-gray-400 hover:text-white transition-colors">Browse Livestock</a></li>
              <li><a href="#" class="text-gray-400 hover:text-white transition-colors">Post Your Livestock</a></li>
              <li><a href="#" class="text-gray-400 hover:text-white transition-colors">About Us</a></li>
              <li><a href="#" class="text-gray-400 hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>

          <!-- Categories -->
          <div>
            <h3 class="text-lg font-bold mb-4 text-green-400">Categories</h3>
            <ul class="space-y-2 text-sm">
              <li><a href="#" class="text-gray-400 hover:text-white transition-colors">Cattle</a></li>
              <li><a href="#" class="text-gray-400 hover:text-white transition-colors">Pigs</a></li>
              <li><a href="#" class="text-gray-400 hover:text-white transition-colors">Goats</a></li>
              <li><a href="#" class="text-gray-400 hover:text-white transition-colors">Sheep</a></li>
              <li><a href="#" class="text-gray-400 hover:text-white transition-colors">Poultry</a></li>
            </ul>
          </div>

          <!-- Contact -->
          <div>
            <h3 class="text-lg font-bold mb-4 text-green-400">Contact Us</h3>
            <ul class="space-y-2 text-sm">
              <li class="flex items-start">
                <i class="pi pi-envelope mt-1 mr-2 text-green-400"></i>
                <span class="text-gray-400">support@livestockmarket.ph</span>
              </li>
              <li class="flex items-start">
                <i class="pi pi-phone mt-1 mr-2 text-green-400"></i>
                <span class="text-gray-400">+63 (2) 8123 4567</span>
              </li>
              <li class="flex items-start">
                <i class="pi pi-map-marker mt-1 mr-2 text-green-400"></i>
                <span class="text-gray-400">123 Agri Building, Cebu City, Philippines</span>
              </li>
            </ul>
          </div>
        </div>

        <div class="border-t border-gray-800 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p class="text-gray-500 text-sm mb-4 md:mb-0">
            &copy; 2025 Livestock Marketplace. All rights reserved.
          </p>
          <ul class="flex space-x-6 text-sm">
            <li><a href="#" class="text-gray-500 hover:text-white transition-colors">Privacy Policy</a></li>
            <li><a href="#" class="text-gray-500 hover:text-white transition-colors">Terms of Service</a></li>
            <li><a href="#" class="text-gray-500 hover:text-white transition-colors">FAQ</a></li>
          </ul>
        </div>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.livestock-card {
  transition: all 0.3s ease;
}

.livestock-card:hover {
  transform: translateY(-5px);
}

.pi {
  font-size: 0.9rem;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

table th:first-child {
  border-top-left-radius: 0.5rem;
}

table th:last-child {
  border-top-right-radius: 0.5rem;
}
</style>