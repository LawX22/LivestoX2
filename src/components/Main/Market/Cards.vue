<script setup lang="ts">
import { ref, computed } from "vue";
import Button from "primevue/button";
import InputText from "primevue/inputtext";
import Dropdown from "primevue/dropdown";
import Paginator from "primevue/paginator";
import router from "../../../router";
import { LivestockListing } from "../../../types/listing";

// Search and basic filters
const searchQuery = ref("");
const selectedCategory = ref<{ name: string; code: string } | null>(null);
const sortOption = ref({ value: "newest", label: "Newest First" });
const first = ref(0);
// const selectedListing = ref();

const props = defineProps<{
  listings: LivestockListing[];
}>();

// View mode toggle (grid, list, compact)
const viewMode = ref<"grid" | "list" | "compact">("grid");

const categories = computed(() => {
  const uniqueCategories = Array.from(
    new Set(props.listings.map(item => item.category))
  ).map(category => ({ name: category, code: category.toLowerCase() }));

  return uniqueCategories;
});

const sortOptions = ref([
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
  { value: "price_low", label: "Price: Low to High" },
  { value: "price_high", label: "Price: High to Low" },
  { value: "popularity", label: "Popularity" },
]);

const filteredListings = computed(() => {
  let result = props.listings;

  // Apply search query filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(
      (item) =>
        item.title.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query) ||
        item.breed.toLowerCase().includes(query) ||
        item.location.toLowerCase().includes(query)
    );
  }

  // Apply category filter
  if (selectedCategory.value) {
    result = result.filter(
      (item) =>
        selectedCategory.value && item.category === selectedCategory.value.name
    );
  }

  // Apply sorting
  if (sortOption.value) {
    switch (sortOption.value.value) {
      case "newest":
        result = [...result].sort(
          (a, b) =>
            new Date(b.listed_date).getTime() -
            new Date(a.listed_date).getTime()
        );
        break;
      case "oldest":
        result = [...result].sort(
          (a, b) =>
            new Date(a.listed_date).getTime() -
            new Date(b.listed_date).getTime()
        );
        break;
      case "price_low":
        result = [...result].sort((a, b) => a.price - b.price);
        break;
      case "price_high":
        result = [...result].sort((a, b) => b.price - a.price);
        break;
      // For popularity, we could use a combination of views, favorites, etc.
      // For demo purposes, we'll just use a random sort
      case "popularity":
        result = [...result].sort(() => Math.random() - 0.5);
        break;
    }
  }

  return result;
});

// Updated method to view a listing - redirects to the ViewListings route without using ID
const viewListing = (listing: LivestockListing) => {

  router.push({ path: '/main/ViewListings', query: { id: listing.id } });
};


// const toggleFavorite = (listing: AnimalListing) => {
//   listing.isFavorite = !listing.isFavorite;
// };

const formatPrice = (price: number): string => {
  return price.toLocaleString();
};

const formatDate = (date: Date): string => {
  // Calculate days ago
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - new Date(date).getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return "Today";
  } else if (diffDays === 1) {
    return "Yesterday";
  } else if (diffDays < 7) {
    return `${diffDays} days ago`;
  } else {
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  }
};

</script>

<template>
  <div>
    <!-- Search Section - More elegant and refined -->
    <div class="bg-white border-b shadow-sm sticky top-0 z-10">
      <div class="container mx-auto px-4 py-3">
        <div
          class="flex flex-col md:flex-row justify-between items-center gap-4"
        >
          <div class="w-full md:w-2/5">
            <span class="p-input-icon-left w-full relative">
              <i
                class="pi pi-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              ></i>
              <InputText
                v-model="searchQuery"
                placeholder="Search by type, breed, or location..."
                class="w-full pl-10 py-2 rounded-full border-gray-300"
              />
            </span>
          </div>
          <div class="w-full md:w-auto flex flex-wrap items-center gap-3">
            <Dropdown
              v-model="selectedCategory"
              :options="categories"
              optionLabel="name"
              placeholder="All Categories"
              class="w-48"
              optionClass="text-ellipsis whitespace-nowrap overflow-hidden"
            />
            <Dropdown
              v-model="sortOption"
              :options="sortOptions"
              optionLabel="label"
              class="w-52"
              optionClass="text-ellipsis whitespace-nowrap overflow-hidden"
            />
            <!-- View Toggle -->
            <div class="flex items-center border rounded-full p-1 bg-gray-100">
              <button
                @click="viewMode = 'grid'"
                class="p-2 rounded-full transition-colors"
                :class="
                  viewMode === 'grid'
                    ? 'bg-green-200 text-green-800'
                    : 'text-gray-500 hover:text-green-700'
                "
              >
                <i class="pi pi-th-large"></i>
              </button>
              <button
                @click="viewMode = 'list'"
                class="p-2 rounded-full transition-colors"
                :class="
                  viewMode === 'list'
                    ? 'bg-green-200 text-green-800'
                    : 'text-gray-500 hover:text-green-700'
                "
              >
                <i class="pi pi-list"></i>
              </button>
              <button
                @click="viewMode = 'compact'"
                class="p-2 rounded-full transition-colors"
                :class="
                  viewMode === 'compact'
                    ? 'bg-green-200 text-green-800'
                    : 'text-gray-500 hover:text-green-700'
                "
              >
                <i class="pi pi-table"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content Area -->
    <div class="cards-container mx-auto px-4 py-8">
      <!-- Filter chips and result count -->
      <div class="flex flex-wrap items-center gap-2 mb-6">
        <span class="text-gray-700 font-medium"
          >{{ filteredListings.length }} listings found</span
        >
        <div class="h-4 w-px bg-gray-300 mx-2"></div>
        <div class="flex flex-wrap gap-2">
          <span
            v-if="selectedCategory"
            class="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm flex items-center"
          >
            {{ selectedCategory.name }}
            <button
              class="ml-2 text-green-600 hover:text-green-800"
              @click="selectedCategory = null"
            >
              <i class="pi pi-times-circle"></i>
            </button>
          </span>
        </div>
      </div>

      <!-- Grid View -->
      <div
        v-if="viewMode === 'grid'"
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <div
          v-for="listing in filteredListings"
          :key="listing.id"
          class="livestock-card bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col"
        >
          <div class="relative">
            <!-- Image with gradient overlay -->
            <div class="relative h-52 overflow-hidden">
              <img
                :src="listing.image_url[0]"
                :alt="listing.title"
                class="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
              />

              <!-- Price badge -->
              <div
                class="absolute bottom-3 left-3 bg-white/90 text-green-600 px-3 py-1 rounded-lg text-base font-bold shadow-md"
              >
                ${{ formatPrice(listing.price) }}
              </div>

              <!-- Available now badge -->
              <div
                v-if="listing.available_immediate"
                class="absolute bottom-3 right-3 bg-green-100 text-green-800 px-2 py-0.5 rounded-full text-xs font-medium inline-flex items-center"
              >
                <i class="pi pi-check-circle mr-1"></i> Available Now
              </div>
            </div>

            <!-- Top badges -->
            <div class="absolute top-3 left-3 right-3 flex justify-between">
              <div class="flex gap-1.5">
                <span
                  v-if="listing.certified"
                  class="bg-purple-100 text-purple-800 px-2.5 py-1 rounded-full text-xs font-semibold flex items-center shadow-sm"
                >
                  <i class="pi pi-check-circle mr-1"></i> Certified
                </span>
                <span
                  v-if="listing.auction"
                  class="bg-amber-100 text-amber-800 px-2.5 py-1 rounded-full text-xs font-semibold flex items-center shadow-sm"
                >
                  <i class="pi pi-clock mr-1"></i> Auction
                </span>
              </div>

              <!-- Favorite button -->
              <!-- <button
                class="w-8 h-8 flex items-center justify-center rounded-full shadow-md transition-all duration-200"
                :class="[
                  listing.isFavorite
                    ? 'bg-red-500 text-white'
                    : 'bg-white/90 text-gray-500 hover:bg-red-50 hover:text-red-500',
                ]"
                @click="toggleFavorite(listing)"
                aria-label="Toggle favorite"
              >
                <i class="pi pi-heart-fill text-sm"></i>
              </button> -->
            </div>
          </div>

          <div class="p-4 flex-1 flex flex-col">
            <!-- Title -->
            <h3
              class="text-base font-bold text-gray-800 hover:text-green-600 transition-colors cursor-pointer line-clamp-2 mb-2"
              @click="viewListing(listing)"
            >
              {{ listing.title }}
            </h3>

            <!-- Location and date -->
            <div class="flex items-center text-xs text-gray-500 mb-3">
              <i class="pi pi-map-marker mr-1 text-green-600"></i>
              <span>{{ listing.location }}</span>
              <div class="mx-2 h-1 w-1 rounded-full bg-gray-300"></div>
              <span>{{ formatDate(listing.listed_date) }}</span>
            </div>

            <!-- Description -->
            <div class="bg-gray-50 p-3 rounded-lg mb-3">
              <p class="text-gray-700 text-xs line-clamp-2">
                {{ listing.description }}
              </p>
            </div>

            <!-- Key specs -->
            <div class="flex flex-col gap-y-2 text-xs text-gray-700 mb-3">
              <!-- First row -->
              <div class="grid grid-cols-2 gap-2">
                <div
                  class="flex items-center p-2 border border-gray-200 rounded-md bg-gray-50"
                >
                  <i class="pi pi-tag text-green-600 mr-1.5"></i>
                  <span>{{ listing.category }}</span>
                </div>
                <div
                  class="flex items-center p-2 border border-gray-200 rounded-md bg-gray-50"
                >
                  <i class="pi pi-calendar text-green-600 mr-1.5"></i>
                  <span>{{ listing.age }} {{ listing.age_unit }}</span>
                </div>
              </div>

              <!-- Second row -->
              <div class="grid grid-cols-2 gap-2">
                <div
                  class="flex items-center p-2 border border-gray-200 rounded-md bg-gray-50"
                >
                  <i class="pi pi-heart text-green-600 mr-1.5"></i>
                  <span>{{ listing.health_status }}</span>
                </div>
                <div
                  v-if="listing.quantity > 1"
                  class="flex items-center p-2 border border-gray-200 rounded-md bg-gray-50"
                >
                  <i class="pi pi-th-large text-green-600 mr-1.5"></i>
                  <span>{{ listing.quantity }} Left</span>
                </div>
              </div>
            </div>

            <!-- Spacer to push button to bottom -->
            <div class="flex-grow"></div>

            <!-- Button -->
            <Button
              label="View Details"
              icon="pi pi-arrow-right"
              iconPos="right"
              class="p-button-rounded p-button-success w-full font-medium text-sm mt-3 text-white"
              @click="viewListing(listing)"
            />
          </div>
        </div>
      </div>

      <!-- List View -->
      <div v-else-if="viewMode === 'list'" class="flex flex-col gap-4">
        <div
          v-for="listing in filteredListings"
          :key="listing.id ?? 0"
          class="livestock-card bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 flex flex-col md:flex-row overflow-hidden border border-gray-100"
        >
          <div class="relative md:w-1/4 lg:w-1/5">
            <!-- Image with gradient overlay -->
            <div class="relative h-48 md:h-full overflow-hidden">
              <img
                :src="listing.image_url[0]"
                :alt="listing.title"
                class="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
              />
              <div
                class="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent md:opacity-40"
              ></div>

              <!-- Price badge -->
              <div
                class="absolute bottom-3 left-3 bg-white/90 text-green-600 px-3 py-1 rounded-lg text-base font-bold shadow-md md:hidden"
              >
                ${{ formatPrice(listing.price) }}
              </div>
            </div>

            <!-- Badges -->
            <div class="absolute top-3 left-3 flex gap-1.5">
              <span
                v-if="listing.certified"
                class="bg-purple-100 text-purple-800 px-2.5 py-1 rounded-full text-xs font-semibold flex items-center shadow-sm"
              >
                <i class="pi pi-check-circle mr-1"></i> Certified
              </span>
              <span
                v-if="listing.auction"
                class="bg-amber-100 text-amber-800 px-2.5 py-1 rounded-full text-xs font-semibold flex items-center shadow-sm"
              >
                <i class="pi pi-clock mr-1"></i> Auction
              </span>
            </div>
          </div>

          <div class="p-4 flex-1 flex flex-col">
            <div class="flex items-start justify-between mb-2">
              <!-- Title -->
              <h3
                class="text-lg font-bold text-gray-800 hover:text-green-600 transition-colors cursor-pointer"
                @click="viewListing(listing)"
              >
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
              <span>{{ formatDate(listing.listed_date) }}</span>
            </div>

            <!-- Description - Now with better styling -->
            <div class="bg-gray-50 p-3 rounded-lg mb-3">
              <h4 class="text-xs font-bold text-gray-700 mb-1">Description</h4>
              <p class="text-gray-700 text-xs line-clamp-2">
                {{ listing.description }}
              </p>
            </div>

            <!-- Tags -->
            <div class="flex flex-wrap gap-1.5 mb-3">
              <span
                class="bg-blue-100 text-blue-800 px-2.5 py-0.5 rounded-full text-xs font-medium"
              >
                {{ listing.category }}
              </span>
              <span
                class="bg-gray-100 text-gray-800 px-2.5 py-0.5 rounded-full text-xs font-medium"
              >
                {{ listing.gender }}
              </span>
              <span
                v-if="listing.available_immediate"
                class="bg-green-100 text-green-800 px-2.5 py-0.5 rounded-full text-xs font-medium"
              >
                Available Now
              </span>
              <span
                class="bg-gray-100 text-gray-800 px-2.5 py-0.5 rounded-full text-xs font-medium"
              >
                {{ listing.age }} {{ listing.age_unit }}
              </span>
            </div>

            <!-- Specs grid -->
            <div class="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs mb-4">
              <div
                class="flex items-center p-2 border border-gray-200 rounded-md bg-gray-50"
              >
                <i class="pi pi-tag text-green-600 mr-1.5"></i>
                <span>{{ listing.breed }}</span>
              </div>
              <div
                class="flex items-center p-2 border border-gray-200 rounded-md bg-gray-50"
              >
                <i class="pi pi-heart text-green-600 mr-1.5"></i>
                <span>{{ listing.health_status }}</span>
              </div>
              <div
                class="flex items-center p-2 border border-gray-200 rounded-md bg-gray-50"
              >
                <i class="pi pi-weight text-green-600 mr-1.5"></i>
                <span>{{ listing.weight }} {{ listing.weight_unit }}</span>
              </div>
              <div
                v-if="listing.quantity > 1"
                class="flex items-center p-2 border border-gray-200 rounded-md bg-gray-50"
              >
                <i class="pi pi-th-large text-green-600 mr-1.5"></i>
                <span>{{ listing.quantity }} Left</span>
              </div>
            </div>

            <!-- Action buttons -->
            <!-- <div class="mt-auto flex items-center gap-3">
              <Button
                label="View Details"
                icon="pi pi-arrow-right"
                iconPos="right"
                class="p-button-rounded p-button-success flex-1 text-sm text-white"
                @click="viewListing(listing)"
              />
              <button
                class="w-10 h-10 flex items-center justify-center rounded-full border border-gray-200 hover:bg-red-50 hover:border-red-200 hover:text-red-500 transition-colors"
                :class="[
                  listing.isFavorite
                    ? 'bg-red-500 border-red-500 text-white'
                    : 'text-gray-400',
                ]"
                @click="toggleFavorite(listing)"
                aria-label="Toggle favorite"
              >
                <i class="pi pi-heart-fill"></i>
              </button>
            </div> -->
          </div>
        </div>
      </div>

      <!-- Compact View -->
      <div v-else-if="viewMode === 'compact'" class="overflow-x-auto">
        <table class="min-w-full bg-white rounded-lg shadow-sm">
          <thead>
            <tr class="bg-gray-100 text-gray-700 text-sm">
              <th class="py-3 px-4 text-left">Livestock</th>
              <th class="py-3 px-4 text-left">Category</th>
              <th class="py-3 px-4 text-left">Breed</th>
              <th class="py-3 px-4 text-left">Location</th>
              <th class="py-3 px-4 text-left">Price</th>
              <th class="py-3 px-4 text-left">Age</th>
              <th class="py-3 px-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="listing in filteredListings"
              :key="listing.id"
              class="border-b border-gray-200 hover:bg-gray-50"
            >
              <td class="py-3 px-4">
                <div class="flex items-center space-x-3">
                  <div
                    class="flex-shrink-0 w-10 h-10 rounded-md overflow-hidden"
                  >
                    <img
                      :src="listing.image_url[0]"
                      :alt="listing.title"
                      class="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <div class="font-medium text-gray-800">
                      {{ listing.title }}
                    </div>
                    <div class="text-xs text-gray-500">
                      {{ formatDate(listing.listed_date) }}
                    </div>
                  </div>
                </div>
              </td>
              <td class="py-3 px-4">
                <span
                  class="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full"
                >
                  {{ listing.category }}
                </span>
              </td>
              <td class="py-3 px-4 text-sm text-gray-700">
                {{ listing.breed }}
              </td>
              <td class="py-3 px-4 text-sm text-gray-700">
                {{ listing.location }}
              </td>
              <td class="py-3 px-4 text-sm font-medium text-green-600">
                ${{ formatPrice(listing.price) }}
              </td>
              <td class="py-3 px-4 text-sm text-gray-700">
                {{ listing.age }} {{ listing.age_unit }}
              </td>
              <td class="py-3 px-4">
                <!-- <div class="flex items-center justify-center space-x-2">
                  <button
                    class="text-green-600 hover:text-green-800 transition-colors p-1"
                    @click="viewListing(listing)"
                    title="View Details"
                  >
                    <i class="pi pi-eye"></i>
                  </button>
                  <button
                    class="transition-colors p-1"
                    :class="[
                      listing.isFavorite
                        ? 'text-red-500 hover:text-red-700'
                        : 'text-gray-400 hover:text-red-500',
                    ]"
                    @click="toggleFavorite(listing)"
                    title="Add to Favorites"
                  >
                    <i class="pi pi-heart-fill"></i>
                  </button>
                </div> -->
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- No results message -->
      <div v-if="filteredListings.length === 0" class="text-center py-16">
        <div class="mb-4">
          <i class="pi pi-search text-5xl text-gray-300"></i>
        </div>
        <h3 class="text-xl font-semibold text-gray-700 mb-2">
          No livestock found
        </h3>
        <p class="text-gray-500 mb-6">
          Try adjusting your search or filters to find what you're looking for.
        </p>
        <Button
          label="Clear Filters"
          icon="pi pi-filter-slash"
          class="p-button-outlined"
          @click="
            searchQuery = '';
            selectedCategory = null;
          "
        />
      </div>

      <!-- Pagination -->
      <div class="mt-6 flex justify-center">
        <Paginator
          v-model:first="first"
          :rows="10"
          :totalRecords="filteredListings.length"
          class="border rounded-lg shadow-sm"
        />
      </div>
    </div>
  </div>
</template>
