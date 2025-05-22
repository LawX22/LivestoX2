<script setup lang="ts">
import { ref, onMounted } from 'vue';
import NavBar from '../../components/Main/NavBar.vue';
import Header from '../../components/Main/Market/Header.vue';
import Cards from '../../components/Main/Market/Cards.vue';
import FarmerHeader from '../../components/Main/Market/FarmerHeader.vue';
import Footer from '../../components/Main/Market/Footer.vue';
import { useAuthStore } from '../../stores/authContext';
import { LivestockListing } from '../../types/listing';
import { livestock } from '../../services/livestockService';

const authStore = useAuthStore();

const listings = ref<LivestockListing[]>([]);

const fetchListings = async () => {
  // const sellerId = authStore.userId;
  // if (!sellerId) return;

  try {
    listings.value = await livestock.getListingsForMarket();
  } catch (error) {
    console.error("Could not fetch listings:", error);
  }
};

onMounted(() => {
  fetchListings();
});

</script>

<template>
  <div class="livestock-market font-sans text-gray-800 bg-gray-50 antialiased ">
    <div class="fixed top-0 left-0 w-full z-50 bg-white bg-opacity-95 backdrop-blur-sm shadow-lg">
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
          <FarmerHeader v-if="authStore?.userMetadata.role === 'Farmer'" />

          <!-- BUYER SIDE -->
          <Header v-else />

          <Cards :listings="listings" />
        </div>
      </div>
    </div>
    <Footer />
  </div>
</template>