<script lang="ts">
import { defineComponent, ref, computed, onMounted } from 'vue';
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

        // Methods
        const viewListing = (id: number) => {
            // In a real app, this would navigate to the listing details page
            console.log(`Navigating to listing ${id}`);
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
        <div class="relative bg-gradient-to-br from-green-400 to-green-700 text-white overflow-hidden">
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
                    <div
                        class="bg-white p-4 rounded-full shadow-lg mb-6 transform transition duration-700 hover:scale-105">
                        <img src="/src/assets/vue.svg" alt="Livestock Marketplace Logo"
                            class="w-20 h-20 md:w-24 md:h-24" />
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
                        <button
                            class="bg-white text-green-700 font-bold py-3 px-8 rounded-full shadow-lg hover:bg-green-50 hover:text-green-800 transform hover:scale-105 transition duration-300 flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20"
                                fill="currentColor">
                                <path fill-rule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
                                    clip-rule="evenodd" />
                            </svg>
                            Become a Farmer
                        </button>
                        <button
                            class="bg-green-800 bg-opacity-60 text-white font-bold py-3 px-8 rounded-full shadow-lg hover:bg-green-900 transform hover:scale-105 transition duration-300 flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20"
                                fill="currentColor">
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
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 100"
                    class="w-full h-auto text-white fill-current">
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
                            <i
                                class="pi pi-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                            <InputText v-model="searchQuery" placeholder="Search by type, breed, or location..."
                                class="w-full pl-10 py-2 rounded-full border-gray-300" />
                        </span>
                    </div>
                    <div class="w-full md:w-auto flex items-center gap-3">
                        <Dropdown v-model="selectedCategory" :options="categories" optionLabel="name"
                            placeholder="All Categories" class="w-40" />
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
                            <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent">
                            </div>

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
                        <h3 class="text-base font-bold text-gray-800 hover:text-green-600 transition-colors cursor-pointer line-clamp-2 mb-2"
                            @click="viewListing(listing.id)">
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
                        <div class="flex flex-wrap gap-x-4 gap-y-2 text-xs text-gray-700 mb-3">
                            <div class="flex items-center">
                                <i class="pi pi-tag text-green-600 mr-1.5"></i>
                                <span>{{ listing.category }}</span>
                            </div>
                            <div class="flex items-center">
                                <i class="pi pi-calendar text-green-600 mr-1.5"></i>
                                <span>{{ listing.age }} {{ listing.ageUnit }}</span>
                            </div>
                            <div class="flex items-center">
                                <i class="pi pi-heart text-green-600 mr-1.5"></i>
                                <span>{{ listing.healthStatus }}</span>
                            </div>
                            <div v-if="listing.quantity > 1" class="flex items-center">
                                <i class="pi pi-th-large text-green-600 mr-1.5"></i>
                                <span>{{ listing.quantity }} Left </span>
                            </div>
                        </div>

                        <!-- Spacer to push button to bottom -->
                        <div class="flex-grow"></div>

                        <!-- Button -->
                        <Button label="View Details" icon="pi pi-arrow-right" iconPos="right"
                            class="p-button-rounded p-button-success w-full font-medium text-sm mt-3"
                            @click="viewListing(listing.id)" />
                    </div>
                </div>
            </div>

            <!-- List View -->
            <div v-else-if="viewMode === 'list'" class="flex flex-col gap-4">
                <div v-for="listing in filteredListings" :key="listing.id"
                    class="livestock-card bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 flex flex-col md:flex-row overflow-hidden border border-gray-100">
                    <div class="relative md:w-1/4 lg:w-1/5">
                        <!-- Image with gradient overlay -->
                        <div class="relative h-48 md:h-full overflow-hidden">
                            <img :src="listing.imageUrl" :alt="listing.title"
                                class="w-full h-full object-cover transition-transform duration-500 hover:scale-105" />
                            <div class="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent md:opacity-40">
                            </div>

                            <!-- Price badge -->
                            <div
                                class="absolute bottom-3 left-3 bg-white/90 text-green-600 px-3 py-1 rounded-lg text-base font-bold shadow-md md:hidden">
                                ${{ formatPrice(listing.price) }}
                            </div>
                        </div>

                        <!-- Badges -->
                        <div class="absolute top-3 left-3 flex gap-1.5">
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

                    <div class="p-4 flex-1 flex flex-col">
                        <div class="flex items-start justify-between mb-2">
                            <!-- Title -->
                            <h3 class="text-lg font-bold text-gray-800 hover:text-green-600 transition-colors cursor-pointer"
                                @click="viewListing(listing.id)">
                                {{ listing.title }}
                            </h3>
                            <!-- Price (desktop) -->
                            <div class="text-lg font-bold text-green-600 hidden md:block">
                                ${{ formatPrice(listing.price) }}
                            </div>
                        </div>

                        <!-- Location and date -->
                        <div class="flex items-center text-xs text-gray-500 mb-3">
                            <i class="pi pi-map-marker mr-1 text-green-600"></i>
                            <span>{{ listing.location }}</span>
                            <div class="mx-2 h-1 w-1 rounded-full bg-gray-300"></div>
                            <span>{{ formatDate(listing.listedDate) }}</span>
                        </div>

                        <!-- Description - Now with better styling -->
                        <div class="bg-gray-50 p-3 rounded-lg mb-3">
                            <h4 class="text-xs font-bold text-gray-700 mb-1">Description</h4>
                            <p class="text-gray-700 text-xs line-clamp-2">{{ listing.description }}</p>
                        </div>

                        <!-- Tags -->
                        <div class="flex flex-wrap gap-1.5 mb-3">
                            <span class="bg-blue-100 text-blue-800 px-2.5 py-0.5 rounded-full text-xs font-medium">
                                {{ listing.category }}
                            </span>
                            <span class="bg-gray-100 text-gray-800 px-2.5 py-0.5 rounded-full text-xs font-medium">
                                {{ listing.gender }}
                            </span>
                            <span v-if="listing.availableImmediate"
                                class="bg-green-100 text-green-800 px-2.5 py-0.5 rounded-full text-xs font-medium">
                                <i class="pi pi-check-circle mr-1"></i> Available Now
                            </span>
                        </div>

                        <!-- Specifications -->
                        <div class="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-2 text-xs text-gray-700 mb-3">
                            <div class="flex items-center">
                                <i class="pi pi-calendar text-green-600 mr-1.5"></i>
                                <span class="text-gray-500 mr-1">Age:</span> {{ listing.age }} {{ listing.ageUnit }}
                            </div>
                            <div class="flex items-center">
                                <i class="pi pi-tag text-green-600 mr-1.5"></i>
                                <span class="text-gray-500 mr-1">Weight:</span> {{ listing.weight }} {{
                                    listing.weightUnit }}
                            </div>
                            <div class="flex items-center">
                                <i class="pi pi-bookmark text-green-600 mr-1.5"></i>
                                <span class="text-gray-500 mr-1">Breed:</span> {{ listing.breed }}
                            </div>
                            <div v-if="listing.quantity > 1" class="flex items-center">
                                <i class="pi pi-th-large text-green-600 mr-1.5"></i>
                                <span class="text-gray-500 mr-1">Quantity:</span> {{ listing.quantity }}
                            </div>
                            <div class="flex items-center">
                                <i class="pi pi-heart text-green-600 mr-1.5"></i>
                                <span class="text-gray-500 mr-1">Health:</span> {{ listing.healthStatus }}
                            </div>
                            <div class="flex items-center">
                                <i class="pi pi-box text-green-600 mr-1.5"></i>
                                <span class="text-gray-500 mr-1">Feed:</span> {{ listing.feedingType }}
                            </div>
                        </div>

                        <!-- Spacer to push button to bottom -->
                        <div class="flex-grow"></div>

                        <!-- Actions -->
                        <div class="flex items-center justify-between mt-3">
                            <Button label="View Details" icon="pi pi-arrow-right" iconPos="right"
                                class="p-button-rounded p-button-success text-sm" @click="viewListing(listing.id)" />

                            <button
                                class="ml-3 w-9 h-9 flex items-center justify-center rounded-full transition-all duration-200"
                                :class="[listing.isFavorite ? 'bg-red-500 text-white shadow-md' : 'bg-gray-100 text-gray-500 hover:bg-red-50 hover:text-red-500']"
                                @click="toggleFavorite(listing)" aria-label="Toggle favorite">
                                <i class="pi pi-heart-fill"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Compact View -->
            <div v-else class="overflow-x-auto">
                <table class="min-w-full bg-white border-collapse">
                    <thead>
                        <tr class="bg-green-300 text-green-800 border-b border-green-100 rounded-xl">
                            <th class="py-3 px-4 text-left font-medium">Image</th>
                            <th class="py-3 px-4 text-left font-medium">Details</th>
                            <th class="py-3 px-4 text-left font-medium">Location</th>
                            <th class="py-3 px-4 text-left font-medium">Category</th>
                            <th class="py-3 px-4 text-left font-medium">Age/Weight</th>
                            <th class="py-3 px-4 text-right font-medium">Price</th>
                            <th class="py-3 px-4 text-center font-medium">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="listing in filteredListings" :key="listing.id"
                            class="border-b hover:bg-gray-50 transition-colors">
                            <td class="py-3 px-4">
                                <div class="relative w-16 h-16">
                                    <img :src="listing.imageUrl" :alt="listing.title"
                                        class="w-16 h-16 rounded-lg object-cover shadow-sm" />
                                    <div v-if="listing.certified"
                                        class="absolute -top-1 -right-1 w-5 h-5 bg-purple-100 text-purple-800 rounded-full flex items-center justify-center text-xs border border-white shadow-sm">
                                        <i class="pi pi-check"></i>
                                    </div>
                                </div>
                            </td>
                            <td class="py-3 px-4">
                                <div class="font-medium text-gray-800 hover:text-green-600 cursor-pointer"
                                    @click="viewListing(listing.id)">{{ listing.title }}</div>
                                <div class="text-xs text-gray-500 mt-1">{{ formatDate(listing.listedDate) }}</div>
                            </td>
                            <td class="py-3 px-4 text-gray-600">{{ listing.location }}</td>
                            <td class="py-3 px-4">
                                <Badge :value="listing.category" severity="info" class="p-badge-sm" />
                            </td>
                            <td class="py-3 px-4 text-gray-600 text-sm">
                                {{ listing.age }} {{ listing.ageUnit }} / {{ listing.weight }} {{ listing.weightUnit }}
                            </td>
                            <td class="py-3 px-4 text-right">
                                <div class="font-bold text-green-600">${{ formatPrice(listing.price) }}</div>
                                <div v-if="listing.negotiable" class="text-xs text-gray-500">Negotiable</div>
                            </td>
                            <td class="py-3 px-4">
                                <div class="flex items-center justify-center gap-2">
                                    <button
                                        class="w-8 h-8 flex items-center justify-center rounded-full transition-all duration-200"
                                        :class="[listing.isFavorite ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-500 hover:bg-red-50 hover:text-red-500']"
                                        @click="toggleFavorite(listing)">
                                        <i class="pi pi-heart-fill text-sm"></i>
                                    </button>
                                    <button
                                        class="w-8 h-8 flex items-center justify-center bg-green-100 text-green-700 rounded-full hover:bg-green-200 transition-all duration-200"
                                        @click="viewListing(listing.id)">
                                        <i class="pi pi-eye text-sm"></i>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <!-- Improved pagination with style -->
            <div class="flex justify-center mt-8">
                <Paginator :rows="12" :totalRecords="120" v-model:first="first" :rowsPerPageOptions="[12, 24, 36]"
                    class="p-paginator-rounded" />
            </div>
        </div>

        <!-- Footer section with pastel colors -->
        <div class="bg-purple-50 border-t mt-12">
            <div class="container mx-auto px-4 py-8">
                <div class="flex flex-col md:flex-row justify-between items-center">
                    <div class="mb-4 md:mb-0">
                        <h3 class="text-lg font-bold text-purple-800 mb-2">PH Livestock Marketplace</h3>
                        <p class="text-purple-600">Connecting farmers with quality livestock since 2023</p>
                    </div>
                    <div class="flex space-x-4">
                        <Button icon="pi pi-facebook" class="p-button-rounded p-button-text p-button-sm" />
                        <Button icon="pi pi-twitter" class="p-button-rounded p-button-text p-button-sm" />
                        <Button icon="pi pi-instagram" class="p-button-rounded p-button-text p-button-sm" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.livestock-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -2px rgba(0, 0, 0, 0.04);
}

/* Improved card accessibility */
.livestock-card:focus-within {
    box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.25);
    outline: 2px solid #10b981;
    outline-offset: 2px;
}
</style>