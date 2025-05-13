<script lang="ts">
import { defineComponent, ref } from 'vue';
import NavBar from '../../components/Main/NavBar.vue';

export default defineComponent({
  name: 'FarmerDashboard',
  components: {
    NavBar
  },
  setup() {
    // Currency exchange rate (approximately 1 USD = 56.50 PHP as of May 2025)
    const phpRate = 56.50;

    // Format currency to PHP
    const formatToPHP = (value: number) => {
      return '₱' + (value * phpRate).toLocaleString('en-PH');
    };

    // Existing setup code with PHP conversions
    const dashboardStats = ref({
      totalListings: 15,
      totalSales: 53,
      yearToDateRevenue: 87450, // Will be displayed in PHP
      pendingOffers: 7
    });

    const livestockListings = ref([
      {
        id: 1,
        title: 'Prime Angus Bulls',
        breed: 'Black Angus',
        age: '24-28 months',
        price: 3500, // Will be displayed in PHP
        status: 'Active',
        quantity: 5,
        images: [],
        description: 'High-quality Black Angus bulls with excellent genetics and health records.'
      },
      {
        id: 2,
        title: 'Hereford Breeding Heifers',
        breed: 'Hereford',
        age: '18-20 months',
        price: 2800, // Will be displayed in PHP
        status: 'Active',
        quantity: 8,
        images: [],
        description: 'Purebred Hereford heifers, ready for breeding, excellent temperament.'
      },
      {
        id: 3,
        title: 'Holstein Dairy Cows',
        breed: 'Holstein',
        age: '3-4 years',
        price: 3200, // Will be displayed in PHP
        status: 'Active',
        quantity: 4,
        images: [],
        description: 'Productive Holstein dairy cows with excellent milk production records.'
      }
    ]);

    const buyerMessages = ref([
      {
        id: 1,
        sender: 'Johnson Farms',
        subject: 'Inquiry about Angus Bulls',
        preview: 'Interested in learning more about the genetics of your bulls...',
        timestamp: '2 days ago',
        isRead: false
      },
      {
        id: 2,
        sender: 'Western Ranchers',
        subject: 'Price Negotiation',
        preview: 'Would like to discuss the pricing for the Hereford Heifers...',
        timestamp: '1 day ago',
        isRead: true
      }
    ]);

    const salesHistory = ref([
      {
        id: 1,
        buyer: 'Mountain Valley Ranch',
        livestockType: 'Angus Bulls',
        quantity: 3,
        totalPrice: 10500, // Will be displayed in PHP
        date: 'Apr 15, 2025',
        status: 'Completed'
      },
      {
        id: 2,
        buyer: 'Green Pastures Farm',
        livestockType: 'Hereford Heifers',
        quantity: 5,
        totalPrice: 14000, // Will be displayed in PHP
        date: 'Apr 22, 2025',
        status: 'Pending'
      }
    ]);

    const farmProfile = ref({
      name: 'Mark\'s Livestock Farm',
      location: 'Central Valley, Luzon, Philippines',
      certifications: ['Organic', 'Animal Welfare Approved', 'PH-GAP'],
      totalAcreage: 250,
      completenessPercentage: 75
    });

    const listingInsights = ref({
      totalViews: 120,
      averageListingDuration: 45,
      conversionRate: 12.5
    });

    const addNewListing = () => {
      console.log('Add new listing clicked');
    };

    const viewAllSales = () => {
      console.log('View all sales clicked');
    };

    const viewAllListings = () => {
      console.log('View all listings clicked');
    };

    const viewFullAnalytics = () => {
      console.log('View full analytics clicked');
    };

    const viewAllMessages = () => {
      console.log('View all messages clicked');
    };

    const editProfile = () => {
      console.log('Edit profile clicked');
    };

    return {
      dashboardStats,
      livestockListings,
      buyerMessages,
      salesHistory,
      farmProfile,
      listingInsights,
      addNewListing,
      viewAllSales,
      viewAllListings,
      viewFullAnalytics,
      viewAllMessages,
      editProfile,
      formatToPHP
    };
  }
});
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 font-sans text-gray-800 w-full">
    <!-- Sticky Navbar -->
    <div class="sticky top-0 z-50 w-full shadow-md bg-white/80 backdrop-blur-md">
      <NavBar />
    </div>

    <div class="pt-8 pb-12 container mx-auto px-4 sm:px-6 lg:px-8 max-w-full">
      <!-- Dashboard Header with improved gradient background -->
      <div
        class="mb-8 bg-gradient-to-r from-emerald-700 via-emerald-600 to-teal-500 py-8 px-6 rounded-xl shadow-lg text-white">
        <div class="flex justify-between items-center flex-wrap">
          <div>
            <h1 class="text-3xl md:text-4xl font-extrabold mb-2 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 mr-3 text-emerald-200" fill="none"
                viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Farmer Dashboard
            </h1>
            <p class="text-emerald-100 text-lg">Welcome back, {{ farmProfile.name.split('\'')[0] }}! Here's your
              livestock business at a glance.</p>
          </div>
          <div class="mt-4 md:mt-0">
            <div class="bg-white/20 backdrop-blur-sm py-2 px-4 rounded-lg text-sm font-medium">
              Last updated: May 13, 2025
            </div>
          </div>
        </div>
      </div>

      <!-- Main Content -->
      <div class="flex flex-col lg:flex-row gap-8">
        <!-- Left Column (Main Content) -->
        <div class="flex-grow w-full lg:w-3/4">
          <!-- Overview Stats Cards -->
          <section
            class="mb-10 bg-white rounded-2xl shadow-lg p-6 border border-neutral-100 hover:shadow-xl transition-shadow duration-300">
            <h2 class="text-2xl font-bold text-emerald-800 mb-6 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2 text-emerald-600" fill="none"
                viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Business Overview
            </h2>

            <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
              <div
                class="bg-gradient-to-br from-white to-emerald-50 rounded-xl p-5 border border-neutral-100 shadow-md transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg">
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-sm text-neutral-500 uppercase tracking-wider mb-1 font-medium">
                      Total Listings
                    </p>
                    <p class="text-2xl font-bold text-emerald-700">
                      {{ dashboardStats.totalListings }}
                    </p>
                  </div>
                  <div class="bg-emerald-100 text-emerald-600 p-3 rounded-full shadow-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                      stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div
                class="bg-gradient-to-br from-white to-emerald-50 rounded-xl p-5 border border-neutral-100 shadow-md transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg">
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-sm text-neutral-500 uppercase tracking-wider mb-1 font-medium">
                      Total Sales
                    </p>
                    <p class="text-2xl font-bold text-emerald-700">
                      {{ dashboardStats.totalSales }}
                    </p>
                  </div>
                  <div class="bg-emerald-100 text-emerald-600 p-3 rounded-full shadow-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                      stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                </div>
              </div>

              <div
                class="bg-gradient-to-br from-white to-emerald-50 rounded-xl p-5 border border-neutral-100 shadow-md transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg">
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-sm text-neutral-500 uppercase tracking-wider mb-1 font-medium">
                      Year To Date Revenue
                    </p>
                    <p class="text-2xl font-bold text-emerald-700">
                      {{ formatToPHP(dashboardStats.yearToDateRevenue) }}
                    </p>
                  </div>
                  <div class="bg-emerald-100 text-emerald-600 p-3 rounded-full shadow-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                      stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div
                class="bg-gradient-to-br from-white to-emerald-50 rounded-xl p-5 border border-neutral-100 shadow-md transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg">
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-sm text-neutral-500 uppercase tracking-wider mb-1 font-medium">
                      Pending Offers
                    </p>
                    <p class="text-2xl font-bold text-emerald-700">
                      {{ dashboardStats.pendingOffers }}
                    </p>
                  </div>
                  <div class="bg-emerald-100 text-emerald-600 p-3 rounded-full shadow-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                      stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <!-- Livestock Listings Table Section -->
          <section
            class="mb-10 bg-white rounded-2xl shadow-lg p-6 border border-neutral-100 hover:shadow-xl transition-shadow duration-300">
            <div
              class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 border-b border-neutral-100 pb-3">
              <h2 class="text-2xl font-bold text-emerald-800 flex items-center mb-4 sm:mb-0">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2 text-emerald-600" fill="none"
                  viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
                My Livestock Listings
              </h2>
              <div class="flex space-x-3">
                <button @click="viewAllListings"
                  class="bg-emerald-50 text-emerald-700 px-4 py-2 rounded-lg hover:bg-emerald-100 transition-colors duration-300 text-sm font-medium">
                  View All
                </button>
                <button @click="addNewListing"
                  class="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors duration-300 shadow-sm hover:shadow-md flex items-center space-x-2">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd"
                      d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                      clip-rule="evenodd" />
                  </svg>
                  <span>Add New Listing</span>
                </button>
              </div>
            </div>

            <!-- Table Format -->
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-neutral-200 rounded-lg overflow-hidden">
                <thead class="bg-gradient-to-r from-emerald-50 to-teal-50">
                  <tr>
                    <th scope="col"
                      class="px-6 py-3 text-left text-xs font-medium text-emerald-700 uppercase tracking-wider">Title
                    </th>
                    <th scope="col"
                      class="px-6 py-3 text-left text-xs font-medium text-emerald-700 uppercase tracking-wider">Breed
                    </th>
                    <th scope="col"
                      class="px-6 py-3 text-left text-xs font-medium text-emerald-700 uppercase tracking-wider">Age</th>
                    <th scope="col"
                      class="px-6 py-3 text-left text-xs font-medium text-emerald-700 uppercase tracking-wider">Quantity
                    </th>
                    <th scope="col"
                      class="px-6 py-3 text-left text-xs font-medium text-emerald-700 uppercase tracking-wider">
                      Price/Head</th>
                    <th scope="col"
                      class="px-6 py-3 text-left text-xs font-medium text-emerald-700 uppercase tracking-wider">Status
                    </th>
                    <th scope="col"
                      class="px-6 py-3 text-right text-xs font-medium text-emerald-700 uppercase tracking-wider">Actions
                    </th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-neutral-200">
                  <tr v-for="listing in livestockListings" :key="listing.id"
                    class="hover:bg-emerald-50 transition-colors">
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="flex items-center">
                        <div
                          class="h-12 w-12 flex-shrink-0 rounded-md bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center text-emerald-600">
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <div class="ml-4">
                          <div class="text-sm font-medium text-emerald-800">{{ listing.title }}</div>
                          <div class="text-xs text-neutral-500 max-w-xs truncate">{{ listing.description }}</div>
                        </div>
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">{{ listing.breed }}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">{{ listing.age }}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">{{ listing.quantity }}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-emerald-700">{{
                      formatToPHP(listing.price) }}</td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span
                        class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        {{ listing.status }}
                      </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div class="flex justify-end space-x-3">
                        <button class="text-emerald-600 hover:text-emerald-900 flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
               
                        </button>
                        <button class="text-red-600 hover:text-red-900 flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
             
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <!-- Recent Sales Section -->
          <section
            class="mb-10 bg-white rounded-2xl shadow-lg p-6 border border-neutral-100 hover:shadow-xl transition-shadow duration-300">
            <div
              class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 border-b border-neutral-100 pb-3">
              <h2 class="text-2xl font-bold text-emerald-800 flex items-center mb-4 sm:mb-0">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2 text-emerald-600" fill="none"
                  viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Recent Sales
              </h2>
              <button @click="viewAllSales"
                class="bg-emerald-50 text-emerald-700 px-4 py-2 rounded-lg hover:bg-emerald-100 transition-colors duration-300 text-sm font-medium flex items-center">
                <span>View All Sales</span>
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </div>
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-neutral-200 rounded-lg overflow-hidden">
                <thead class="bg-gradient-to-r from-emerald-50 to-teal-50">
                  <tr>
                    <th scope="col"
                      class="px-6 py-3 text-left text-xs font-medium text-emerald-700 uppercase tracking-wider">Buyer
                    </th>
                    <th scope="col"
                      class="px-6 py-3 text-left text-xs font-medium text-emerald-700 uppercase tracking-wider">
                      Livestock</th>
                    <th scope="col"
                      class="px-6 py-3 text-left text-xs font-medium text-emerald-700 uppercase tracking-wider">Quantity
                    </th>
                    <th scope="col"
                      class="px-6 py-3 text-left text-xs font-medium text-emerald-700 uppercase tracking-wider">Date
                    </th>
                    <th scope="col"
                      class="px-6 py-3 text-left text-xs font-medium text-emerald-700 uppercase tracking-wider">Status
                    </th>
                    <th scope="col"
                      class="px-6 py-3 text-right text-xs font-medium text-emerald-700 uppercase tracking-wider">Total
                    </th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-neutral-200">
                  <tr v-for="sale in salesHistory" :key="sale.id" class="hover:bg-emerald-50 transition-colors">
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="flex items-center">
                        <div
                          class="h-8 w-8 rounded-full bg-gradient-to-br from-teal-100 to-emerald-200 flex items-center justify-center text-emerald-700 text-xs font-bold mr-3">
                          {{ sale.buyer.charAt(0) }}
                        </div>
                        <span class="text-sm font-medium text-emerald-800">{{ sale.buyer }}</span>
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">{{ sale.livestockType }}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">{{ sale.quantity }}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">{{ sale.date }}</td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full"
                        :class="sale.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'">
                        {{ sale.status }}
                      </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-emerald-700 text-right">{{
                      formatToPHP(sale.totalPrice) }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        </div>

        <!-- Right Column (Sidebar) -->
        <div class="w-full lg:w-1/4 space-y-8">
          <!-- Farm Profile Section -->
          <section
            class="bg-gradient-to-br from-white to-emerald-50 rounded-2xl shadow-lg p-6 border border-neutral-100 hover:shadow-xl transition-shadow duration-300">
            <h2 class="text-xl font-bold text-emerald-800 mb-4 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-emerald-600" fill="none"
                viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Farm Profile
            </h2>
            <div class="mb-6">
              <div class="flex justify-between items-center mb-2">
                <div class="flex items-center">
                  <div
                    class="h-10 w-10 rounded-full bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-white font-bold shadow-md mr-2">
                    {{ farmProfile.name.charAt(0) }}
                  </div>
                  <h3 class="font-bold text-emerald-800">{{ farmProfile.name }}</h3>
                </div>
                <button @click="editProfile" class="text-xs text-emerald-600 hover:text-emerald-800 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit
                </button>
              </div>

              <div class="text-sm text-neutral-600 mb-3 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1 text-emerald-500" fill="none"
                  viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {{ farmProfile.location }}
              </div>

              <div class="text-sm text-neutral-600 mb-4">
                <div class="flex items-center mt-2">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1 text-emerald-500" fill="none"
                    viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
                  </svg>
                  <span>{{ farmProfile.totalAcreage }} Acres</span>
                </div>
              </div>

              <div class="mb-4">
                <p class="text-xs font-medium text-neutral-500 mb-1">Certifications:</p>
                <div class="flex flex-wrap gap-2">
                  <span v-for="(cert, index) in farmProfile.certifications" :key="index"
                    class="bg-emerald-100 text-emerald-800 text-xs px-2 py-1 rounded-md">
                    {{ cert }}
                  </span>
                </div>
              </div>

              <div>
                <div class="flex items-center justify-between mb-1">
                  <span class="text-xs font-medium text-neutral-500">Profile Completeness</span>
                  <span class="text-xs font-medium text-emerald-700">{{ farmProfile.completenessPercentage }}%</span>
                </div>
                <div class="w-full bg-neutral-200 rounded-full h-2">
                  <div class="bg-gradient-to-r from-emerald-500 to-teal-400 h-2 rounded-full"
                    :style="`width: ${farmProfile.completenessPercentage}%`"></div>
                </div>
              </div>
            </div>
          </section>

          <!-- Messages Section -->
          <section
            class="bg-white rounded-2xl shadow-lg p-6 border border-neutral-100 hover:shadow-xl transition-shadow duration-300">
            <div class="flex justify-between items-center mb-4">
              <h2 class="text-xl font-bold text-emerald-800 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-emerald-600" fill="none"
                  viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Messages
              </h2>
              <button @click="viewAllMessages"
                class="text-xs text-emerald-600 hover:text-emerald-800 flex items-center">
                View All
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            <div class="space-y-3">
              <div v-for="message in buyerMessages" :key="message.id"
                class="rounded-lg p-3 hover:bg-emerald-50 transition-colors cursor-pointer"
                :class="message.isRead ? 'bg-white' : 'bg-emerald-50'">
                <div class="flex items-center justify-between mb-2">
                  <h4 class="font-medium text-emerald-800 flex items-center">
                    <span class="h-2 w-2 rounded-full mr-2"
                      :class="message.isRead ? 'bg-transparent' : 'bg-emerald-500'"></span>
                    {{ message.sender }}
                  </h4>
                  <span class="text-xs text-neutral-500">{{ message.timestamp }}</span>
                </div>
                <p class="text-sm font-medium mb-1">{{ message.subject }}</p>
                <p class="text-xs text-neutral-600 truncate">{{ message.preview }}</p>
              </div>
            </div>
          </section>

          <!-- Listing Insights -->
          <section
            class="bg-white rounded-2xl shadow-lg p-6 border border-neutral-100 hover:shadow-xl transition-shadow duration-300">
            <div class="flex justify-between items-center mb-4">
              <h2 class="text-xl font-bold text-emerald-800 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-emerald-600" fill="none"
                  viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Listing Insights
              </h2>
              <button @click="viewFullAnalytics"
                class="text-xs text-emerald-600 hover:text-emerald-800 flex items-center">
                Full Analytics
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            <div class="space-y-4">
              <div class="bg-emerald-50 rounded-lg p-4">
                <div class="flex items-center justify-between mb-3">
                  <p class="text-sm font-medium text-emerald-800">Total Views</p>
                  <p class="text-lg font-bold text-emerald-700">{{ listingInsights.totalViews }}</p>
                </div>
                <div class="w-full h-2 bg-emerald-200 rounded-full overflow-hidden">
                  <div class="bg-emerald-600 h-2 rounded-full" style="width: 75%"></div>
                </div>
              </div>

              <div class="bg-teal-50 rounded-lg p-4">
                <div class="flex items-center justify-between mb-3">
                  <p class="text-sm font-medium text-teal-800">Avg. Listing Duration</p>
                  <p class="text-lg font-bold text-teal-700">{{ listingInsights.averageListingDuration }} days</p>
                </div>
                <div class="w-full h-2 bg-teal-200 rounded-full overflow-hidden">
                  <div class="bg-teal-600 h-2 rounded-full" style="width: 60%"></div>
                </div>
              </div>

              <div class="bg-cyan-50 rounded-lg p-4">
                <div class="flex items-center justify-between mb-3">
                  <p class="text-sm font-medium text-cyan-800">Conversion Rate</p>
                  <p class="text-lg font-bold text-cyan-700">{{ listingInsights.conversionRate }}%</p>
                </div>
                <div class="w-full h-2 bg-cyan-200 rounded-full overflow-hidden">
                  <div class="bg-cyan-600 h-2 rounded-full" style="width: 40%"></div>
                </div>
              </div>
            </div>
          </section>

        </div>
      </div>
    </div>
  </div>
</template>