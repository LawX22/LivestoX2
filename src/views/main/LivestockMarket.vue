<script lang="ts">
import { defineComponent, reactive, ref, computed } from 'vue';
import NavBar from '../../components/Main/NavBar.vue';
import Filters from '../../components/Main/Market/Filters.vue';
import Header from '../../components/Main/Market/Header.vue';
import Cards from '../../components/Main/Market/Cards.vue';
import FarmerHeader from '../../components/Main/Market/FarmerHeader.vue';
import Footer from '../../components/Main/Market/Footer.vue';
import { useAuthStore } from '../../stores/authContext';

export default defineComponent({
  name: 'LivestockMarket',
  components: {
    NavBar,
    Filters,
    Header,
    Cards,
    FarmerHeader,
    Footer
  },

  setup() {
    const loading = ref(false);
    const filteredListings = ref([]);
    const savedLocations = ref<any[]>([]);
    const savedPresets = ref<any[]>([]);

    const authStore = useAuthStore();

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
      handleSaveLocation,
      authStore,
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
        <!-- <div class="sidebar">
          <Filters :filters="filters" :categories="categories" :breeds="breeds" :loading="loading"
            :savedLocations="savedLocations" @apply-filters="handleApplyFilters" @clear-filters="handleClearFilters"
            @update:filters="updateFilters" @save-preset="handleSavePreset" @category-change="handleCategoryChange"
            @save-location="handleSaveLocation" />
        </div> -->
        <div class="main-content">

          <!-- FARMER SIDE  -->
          <FarmerHeader v-if="authStore?.user?.user_metadata?.role === 'Farmer'" :loading="loading" :filters="filters"
            @refresh-listings="handleApplyFilters" />

          <!-- BUYER SIDE -->
          <Header v-else :loading="loading" :filters="filters" @refresh-listings="handleApplyFilters" />

          <Cards :loading="loading" :filters="filters" @refresh-listings="handleApplyFilters" />
        </div>
      </div>
    </div>
    <Footer />
  </div>
</template>