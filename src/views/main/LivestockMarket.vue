<script lang="ts">
// Script remains the same as your current implementation
import { defineComponent, reactive, ref, computed } from 'vue';
import NavBar from '../../components/Main/NavBar.vue';
import Filters from '../../components/Main/Market/Filters.vue';
import LivestockListing from '../../components/Main/Market/LivestockListings.vue';
import FarmerLivestockListings from '../../components/Main/Market/FarmerLivestockListings.vue';

export default defineComponent({
  name: 'LivestockMarket',
  components: {
    NavBar,
    Filters,
    LivestockListing,
    FarmerLivestockListings
  },
  setup() {
    const loading = ref(false);
    const filteredListings = ref([]);
    const savedLocations = ref<any[]>([]);
    const savedPresets = ref<any[]>([]);

    // Initialize default filter values
    const filters = reactive({
      category: null,
      breed: null,
      ageRange: [0, 10],
      ageUnit: 'years',
      priceRange: [0, 50000],
      location: '',
      locationRadius: 50,
      certified: false,
      auction: false,
      gender: null,
      weight: null,
      weightUnit: 'lbs',
      availableImmediate: false,
      healthStatus: null,
      lastUpdated: null
    });

    // Mock data for categories
    const categories = ref([
      { name: 'Cattle', id: 1 },
      { name: 'Sheep', id: 2 },
      { name: 'Goats', id: 3 },
      { name: 'Pigs', id: 4 },
      { name: 'Horses', id: 5 },
      { name: 'Poultry', id: 6 }
    ]);

    // Breeds will be populated based on selected category
    const breeds = ref<{ name: string; id: number }[]>([]);

    // Calculate if there are active filters
    const hasActiveFilters = computed(() => {
      return filters.category !== null ||
        filters.breed !== null ||
        filters.ageRange[0] > 0 ||
        filters.ageRange[1] < 10 ||
        filters.priceRange[0] > 0 ||
        filters.priceRange[1] < 50000 ||
        filters.location !== '' ||
        filters.locationRadius !== 50 ||
        filters.certified ||
        filters.auction ||
        filters.gender !== null ||
        filters.weight !== null ||
        filters.availableImmediate ||
        filters.healthStatus !== null ||
        filters.lastUpdated !== null;
    });

    // Handle category change to update breeds
    const handleCategoryChange = (category: any) => {
      loading.value = true;
      // In a real app, you would fetch breeds based on category
      setTimeout(() => {
        if (category) {
          switch (category.id) {
            case 1: // Cattle
              breeds.value = [
                { name: 'Angus', id: 1 },
                { name: 'Hereford', id: 2 },
                { name: 'Brahman', id: 3 },
                { name: 'Charolais', id: 4 }
              ];
              break;
            case 2: // Sheep
              breeds.value = [
                { name: 'Merino', id: 5 },
                { name: 'Suffolk', id: 6 },
                { name: 'Dorper', id: 7 }
              ];
              break;
            case 3: // Goats
              breeds.value = [
                { name: 'Boer', id: 8 },
                { name: 'Nubian', id: 9 },
                { name: 'Alpine', id: 10 }
              ];
              break;
            case 4: // Pigs
              breeds.value = [
                { name: 'Duroc', id: 11 },
                { name: 'Hampshire', id: 12 },
                { name: 'Yorkshire', id: 13 }
              ];
              break;
            case 5: // Horses
              breeds.value = [
                { name: 'Quarter Horse', id: 14 },
                { name: 'Arabian', id: 15 },
                { name: 'Thoroughbred', id: 16 }
              ];
              break;
            case 6: // Poultry
              breeds.value = [
                { name: 'Leghorn', id: 17 },
                { name: 'Rhode Island Red', id: 18 },
                { name: 'Plymouth Rock', id: 19 }
              ];
              break;
            default:
              breeds.value = [];
          }
        } else {
          breeds.value = [];
        }
        loading.value = false;
      }, 500);
    };

    // Handle applying filters
    const handleApplyFilters = () => {
      loading.value = true;
      // In a real app, you would fetch filtered data from an API
      setTimeout(() => {
        // Mock response with filtered listings
        filteredListings.value = [
          // This would be populated with actual livestock data
        ];
        loading.value = false;
      }, 1000);
    };

    // Handle clearing filters
    const handleClearFilters = () => {
      // The filter component itself resets the values
      // Just refresh the listings here
      loading.value = true;
      setTimeout(() => {
        filteredListings.value = [];
        loading.value = false;
      }, 500);
    };

    // Update filters
    const updateFilters = (newFilters: any) => {
      Object.assign(filters, newFilters);
    };

    // Save filter preset
    const handleSavePreset = (preset: any) => {
      savedPresets.value.push(preset);
      // In a real app, you would save this to local storage or a backend
    };

    // Save location
    const handleSaveLocation = (location: any) => {
      savedLocations.value.push(location);
      // In a real app, you would save this to local storage or a backend
    };

    return {
      filters,
      categories,
      breeds,
      loading,
      filteredListings,
      savedLocations,
      savedPresets,
      hasActiveFilters,
      handleApplyFilters,
      handleClearFilters,
      updateFilters,
      handleSavePreset,
      handleCategoryChange,
      handleSaveLocation
    };
  }
});
</script>

<template>
  <div class="livestock-market">
    <div class="navbar-container">
      <NavBar />
    </div>
    <div class="main-container">
      <div class="content-container">
        <div class="sidebar">
          <Filters :filters="filters" :categories="categories" :breeds="breeds" :loading="loading"
            :savedLocations="savedLocations" @apply-filters="handleApplyFilters" @clear-filters="handleClearFilters"
            @update:filters="updateFilters" @save-preset="handleSavePreset" @category-change="handleCategoryChange"
            @save-location="handleSaveLocation" />
        </div>
        <div class="main-content">
  
          <LivestockListing :loading="loading" :filters="filters" @refresh-listings="handleApplyFilters" />
          
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.livestock-market {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.navbar-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background-color: #ffffff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.main-container {
  margin-top: 60px;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.content-container {
  display: flex;
  flex: 1;
  padding: 20px;
  gap: 20px;
}

.sidebar {
  width: 350px;
  flex-shrink: 0;
}

.main-content {
  flex: 1;
  background-color: #f9f9f9;
  border-radius: 8px;
  padding: 20px;
}

.loading-state {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
}

@media (max-width: 768px) {
  .content-container {
    flex-direction: column;
  }

  .sidebar {
    width: 100%;
  }
}
</style>