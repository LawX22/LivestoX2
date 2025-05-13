<script lang="ts">
import { defineComponent, ref } from 'vue';
import NavBar from '../../components/Main/NavBar.vue';

export default defineComponent({
  name: 'BuyerDashboard',
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

    // Buyer dashboard stats
    const dashboardStats = ref({
      totalOrders: 12,
      totalSpending: 68900, // Will be displayed in PHP
      activeBids: 8,
      savedListings: 15
    });

    // Active bids/offers
    const activeBids = ref([
      {
        id: 1,
        listing: 'Black Angus Bulls (3 head)',
        seller: 'Mark\'s Livestock Farm',
        bidAmount: 9800, // Will be displayed in PHP
        currentHighestBid: 10200, // Will be displayed in PHP
        endsIn: '8 hours',
        status: 'Outbid'
      },
      {
        id: 2,
        listing: 'Holstein Dairy Cows (2 head)',
        seller: 'Santos Dairy Farm',
        bidAmount: 6500, // Will be displayed in PHP
        currentHighestBid: 6500, // Will be displayed in PHP
        endsIn: '2 days',
        status: 'Highest'
      },
      {
        id: 3,
        listing: 'Brahman Cattle (5 head)',
        seller: 'Mindanao Cattle Co.',
        bidAmount: 15200, // Will be displayed in PHP
        currentHighestBid: 15700, // Will be displayed in PHP
        endsIn: '1 day',
        status: 'Outbid'
      }
    ]);

    // Purchase history
    const purchaseHistory = ref([
      {
        id: 1,
        listing: 'Hereford Heifers',
        seller: 'Rodriguez Family Ranch',
        quantity: 4,
        totalPrice: 11200, // Will be displayed in PHP
        date: 'Apr 5, 2025',
        status: 'Completed',
        deliveryStatus: 'Delivered'
      },
      {
        id: 2,
        listing: 'Black Angus Bulls',
        seller: 'Mark\'s Livestock Farm',
        quantity: 2,
        totalPrice: 7000, // Will be displayed in PHP
        date: 'Apr 18, 2025',
        status: 'Completed',
        deliveryStatus: 'In Transit'
      }
    ]);

    // Seller messages
    const sellerMessages = ref([
      {
        id: 1,
        sender: 'Mark\'s Livestock Farm',
        subject: 'Response to your inquiry about Angus Bulls',
        preview: 'Thank you for your interest in our Angus Bulls. Regarding your question about...',
        timestamp: '3 hours ago',
        isRead: false
      },
      {
        id: 2,
        sender: 'Rodriguez Family Ranch',
        subject: 'Delivery confirmation for your purchase',
        preview: 'We\'re pleased to confirm that your purchased livestock will be delivered on...',
        timestamp: '1 day ago',
        isRead: true
      }
    ]);

    // Buyer profile
    const buyerProfile = ref({
      name: 'Carlos Reyes',
      businessName: 'Reyes Ranching',
      location: 'Bulacan Province, Philippines',
      memberSince: 'January 2024',
      preferredCategories: ['Beef Cattle', 'Dairy', 'Breeding Stock'],
      completenessPercentage: 85
    });

    // Saved searches
    const savedSearches = ref([
      {
        id: 1,
        query: 'Black Angus, 20-30 months, Central Luzon',
        newResults: 3,
        lastChecked: '2 days ago'
      },
      {
        id: 2,
        query: 'Holstein dairy, 2-5 years, high milk yield',
        newResults: 1,
        lastChecked: '5 days ago'
      }
    ]);

    // Market insights
    const marketInsights = ref({
      averagePrices: {
        beefCattle: 3200, // Will be displayed in PHP
        dairyCattle: 3400, // Will be displayed in PHP
        breedingStock: 2900 // Will be displayed in PHP
      },
      priceChange: {
        beefCattle: 5.2, // percentage
        dairyCattle: -2.1, // percentage
        breedingStock: 3.8 // percentage
      },
      marketActivity: {
        listingsThisWeek: 124,
        percentChange: 8.5 // percentage
      }
    });

    // Handler functions
    const viewAllActiveBids = () => {
      console.log('View all active bids clicked');
    };

    const viewAllPurchases = () => {
      console.log('View all purchases clicked');
    };

    const viewAllMessages = () => {
      console.log('View all messages clicked');
    };

    const editProfile = () => {
      console.log('Edit profile clicked');
    };

    const placeBid = (listingId: number) => {
      console.log(`Place bid clicked for listing ${listingId}`);
    };

    const viewListing = (listingId: number) => {
      console.log(`View listing clicked for ${listingId}`);
    };

    const viewFullMarketInsights = () => {
      console.log('View full market insights clicked');
    };

    const viewSavedSearches = () => {
      console.log('View all saved searches clicked');
    };

    const updateBid = (bidId: number) => {
      console.log(`Update bid ${bidId} clicked`);
    };

    const searchListings = () => {
      console.log('Search listings clicked');
    };

    return {
      dashboardStats,
      activeBids,
      purchaseHistory,
      sellerMessages,
      buyerProfile,
      savedSearches,
      marketInsights,
      viewAllActiveBids,
      viewAllPurchases,
      viewAllMessages,
      editProfile,
      placeBid,
      viewListing,
      viewFullMarketInsights,
      viewSavedSearches,
      updateBid,
      searchListings,
      formatToPHP
    };
  }
});
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 font-sans text-gray-800 w-full">
    <!-- Sticky Navbar -->
    <div class="sticky top-0 z-50 w-full shadow-md bg-white/80 backdrop-blur-md">
      <NavBar />
    </div>

    <div class="pt-8 pb-12 container mx-auto px-4 sm:px-6 lg:px-8 max-w-full">
      <!-- Dashboard Header -->
      <div class="mb-8 bg-gradient-to-r from-green-700 via-green-600 to-emerald-500 py-8 px-6 rounded-xl shadow-lg text-white">
        <div class="flex justify-between items-center flex-wrap">
          <div>
            <h1 class="text-3xl md:text-4xl font-extrabold mb-2 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 mr-3 text-green-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Buyer Dashboard
            </h1>
            <p class="text-green-100 text-lg">Welcome back, {{ buyerProfile.name.split(' ')[0] }}! Find and purchase the perfect livestock for your needs.</p>
          </div>
          <div class="mt-4 md:mt-0 flex space-x-3">
            <button @click="searchListings" class="bg-white text-green-700 px-4 py-2 rounded-lg hover:bg-green-50 transition-colors duration-300 font-medium shadow-sm flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Search Livestock
            </button>
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
          <section class="mb-10 bg-white rounded-2xl shadow-lg p-6 border border-neutral-100 hover:shadow-xl transition-shadow duration-300">
            <h2 class="text-2xl font-bold text-green-800 mb-6 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Purchase Overview
            </h2>

            <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
              <div class="bg-gradient-to-br from-white to-green-50 rounded-xl p-5 border border-neutral-100 shadow-md transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg">
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-sm text-neutral-500 uppercase tracking-wider mb-1 font-medium">
                      Total Orders
                    </p>
                    <p class="text-2xl font-bold text-green-700">
                      {{ dashboardStats.totalOrders }}
                    </p>
                  </div>
                  <div class="bg-green-100 text-green-600 p-3 rounded-full shadow-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div class="bg-gradient-to-br from-white to-green-50 rounded-xl p-5 border border-neutral-100 shadow-md transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg">
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-sm text-neutral-500 uppercase tracking-wider mb-1 font-medium">
                      Total Spending
                    </p>
                    <p class="text-2xl font-bold text-green-700">
                      {{ formatToPHP(dashboardStats.totalSpending) }}
                    </p>
                  </div>
                  <div class="bg-green-100 text-green-600 p-3 rounded-full shadow-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div class="bg-gradient-to-br from-white to-green-50 rounded-xl p-5 border border-neutral-100 shadow-md transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg">
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-sm text-neutral-500 uppercase tracking-wider mb-1 font-medium">
                      Active Bids
                    </p>
                    <p class="text-2xl font-bold text-green-700">
                      {{ dashboardStats.activeBids }}
                    </p>
                  </div>
                  <div class="bg-green-100 text-green-600 p-3 rounded-full shadow-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div class="bg-gradient-to-br from-white to-green-50 rounded-xl p-5 border border-neutral-100 shadow-md transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg">
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-sm text-neutral-500 uppercase tracking-wider mb-1 font-medium">
                      Saved Listings
                    </p>
                    <p class="text-2xl font-bold text-green-700">
                      {{ dashboardStats.savedListings }}
                    </p>
                  </div>
                  <div class="bg-green-100 text-green-600 p-3 rounded-full shadow-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <!-- Active Bids Section -->
          <section class="mb-10 bg-white rounded-2xl shadow-lg p-6 border border-neutral-100 hover:shadow-xl transition-shadow duration-300">
            <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 border-b border-neutral-100 pb-3">
              <h2 class="text-2xl font-bold text-green-800 flex items-center mb-4 sm:mb-0">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Your Active Bids
              </h2>
              <button @click="viewAllActiveBids" class="bg-green-50 text-green-700 px-4 py-2 rounded-lg hover:bg-green-100 transition-colors duration-300 text-sm font-medium flex items-center">
                <span>View All</span>
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </div>

            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-neutral-200 rounded-lg overflow-hidden">
                <thead class="bg-gradient-to-r from-green-50 to-emerald-50">
                  <tr>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-green-700 uppercase tracking-wider">Listing</th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-green-700 uppercase tracking-wider">Seller</th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-green-700 uppercase tracking-wider">Your Bid</th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-green-700 uppercase tracking-wider">Highest Bid</th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-green-700 uppercase tracking-wider">Ends In</th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-green-700 uppercase tracking-wider">Status</th>
                    <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-green-700 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-neutral-200">
                  <tr v-for="bid in activeBids" :key="bid.id" class="hover:bg-green-50 transition-colors duration-200">
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-900">{{ bid.listing }}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">{{ bid.seller }}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-green-700 font-medium">{{ formatToPHP(bid.bidAmount) }}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">{{ formatToPHP(bid.currentHighestBid) }}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">{{ bid.endsIn }}</td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span :class="{
                        'bg-green-100 text-green-800': bid.status === 'Highest',
                        'bg-red-100 text-red-800': bid.status === 'Outbid'
                      }" class="px-2 py-1 text-xs inline-flex rounded-full font-medium">
                        {{ bid.status }}
                      </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button @click="updateBid(bid.id)" class="text-green-600 hover:text-green-900 transition-colors duration-200 underline">
                        {{ bid.status === 'Outbid' ? 'Increase Bid' : 'View Details' }}
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <!-- Purchase History Section -->
          <section class="mb-10 bg-white rounded-2xl shadow-lg p-6 border border-neutral-100 hover:shadow-xl transition-shadow duration-300">
            <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 border-b border-neutral-100 pb-3">
              <h2 class="text-2xl font-bold text-green-800 flex items-center mb-4 sm:mb-0">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
                Purchase History
              </h2>
              <button @click="viewAllPurchases" class="bg-green-50 text-green-700 px-4 py-2 rounded-lg hover:bg-green-100 transition-colors duration-300 text-sm font-medium flex items-center">
                <span>View All</span>
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </div>

            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-neutral-200 rounded-lg overflow-hidden">
                <thead class="bg-gradient-to-r from-green-50 to-emerald-50">
                  <tr>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-green-700 uppercase tracking-wider">Listing</th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-green-700 uppercase tracking-wider">Seller</th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-green-700 uppercase tracking-wider">Quantity</th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-green-700 uppercase tracking-wider">Total Price</th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-green-700 uppercase tracking-wider">Date</th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-green-700 uppercase tracking-wider">Status</th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-green-700 uppercase tracking-wider">Delivery</th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-neutral-200">
                  <tr v-for="purchase in purchaseHistory" :key="purchase.id" class="hover:bg-green-50 transition-colors duration-200">
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-900">{{ purchase.listing }}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">{{ purchase.seller }}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">{{ purchase.quantity }}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-green-700 font-medium">{{ formatToPHP(purchase.totalPrice) }}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">{{ purchase.date }}</td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span class="bg-green-100 text-green-800 px-2 py-1 text-xs inline-flex rounded-full font-medium">
                        {{ purchase.status }}
                      </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span :class="{
                        'bg-green-100 text-green-800': purchase.deliveryStatus === 'Delivered',
                        'bg-green-100 text-emerald-800': purchase.deliveryStatus === 'In Transit'
                      }" class="px-2 py-1 text-xs inline-flex rounded-full font-medium">
                        {{ purchase.deliveryStatus }}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <!-- Messages Section -->
          <section class="mb-10 bg-white rounded-2xl shadow-lg p-6 border border-neutral-100 hover:shadow-xl transition-shadow duration-300">
            <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 border-b border-neutral-100 pb-3">
              <h2 class="text-2xl font-bold text-green-800 flex items-center mb-4 sm:mb-0">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Seller Messages
              </h2>
              <button @click="viewAllMessages" class="bg-green-50 text-green-700 px-4 py-2 rounded-lg hover:bg-green-100 transition-colors duration-300 text-sm font-medium flex items-center">
                <span>View All</span>
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </div>

            <div class="space-y-4">
             <div v-for="message in sellerMessages" :key="message.id" class="border border-neutral-200 rounded-lg p-4 hover:bg-green-50 transition-colors duration-300 cursor-pointer">
                <div class="flex items-start justify-between">
                  <div class="flex items-start space-x-3">
                    <div v-if="!message.isRead" class="bg-green-500 w-2 h-2 rounded-full mt-2"></div>
                    <div v-else class="w-2 h-2 mt-2"></div>
                    <div>
                      <h4 class="font-semibold text-green-900">{{ message.sender }}</h4>
                      <p class="text-sm font-medium text-neutral-700">{{ message.subject }}</p>
                      <p class="text-sm text-neutral-500 mt-1">{{ message.preview }}</p>
                    </div>
                  </div>
                  <div class="text-xs text-neutral-400">
                    {{ message.timestamp }}
                  </div>
                </div>
              </div>
            </div>
          </section>

          <!-- Market Insights Section -->
          <section class="mb-10 bg-white rounded-2xl shadow-lg p-6 border border-neutral-100 hover:shadow-xl transition-shadow duration-300">
            <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 border-b border-neutral-100 pb-3">
              <h2 class="text-2xl font-bold text-green-800 flex items-center mb-4 sm:mb-0">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                </svg>
                Market Insights
              </h2>
              <button @click="viewFullMarketInsights" class="bg-green-50 text-green-700 px-4 py-2 rounded-lg hover:bg-green-100 transition-colors duration-300 text-sm font-medium flex items-center">
                <span>Full Report</span>
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Price Trends -->
              <div class="bg-green-50 rounded-xl p-5 border border-green-100">
                <h3 class="text-lg font-semibold text-green-800 mb-4">Average Prices (per head)</h3>
                <div class="space-y-4">
                  <div class="flex items-center justify-between">
                    <div class="flex items-center">
                      <span class="w-3 h-3 bg-green-600 rounded-full mr-2"></span>
                      <span class="text-sm text-neutral-700">Beef Cattle</span>
                    </div>
                    <div class="flex items-center space-x-2">
                      <span class="font-medium text-green-800">{{ formatToPHP(marketInsights.averagePrices.beefCattle) }}</span>
                      <span :class="marketInsights.priceChange.beefCattle > 0 ? 'text-green-600' : 'text-red-600'" class="text-xs">
                        <span v-if="marketInsights.priceChange.beefCattle > 0">▲</span>
                        <span v-else>▼</span>
                        {{ Math.abs(marketInsights.priceChange.beefCattle) }}%
                      </span>
                    </div>
                  </div>
                  <div class="flex items-center justify-between">
                    <div class="flex items-center">
                      <span class="w-3 h-3 bg-blue-600 rounded-full mr-2"></span>
                      <span class="text-sm text-neutral-700">Dairy Cattle</span>
                    </div>
                    <div class="flex items-center space-x-2">
                      <span class="font-medium text-green-800">{{ formatToPHP(marketInsights.averagePrices.dairyCattle) }}</span>
                      <span :class="marketInsights.priceChange.dairyCattle > 0 ? 'text-green-600' : 'text-red-600'" class="text-xs">
                        <span v-if="marketInsights.priceChange.dairyCattle > 0">▲</span>
                        <span v-else>▼</span>
                        {{ Math.abs(marketInsights.priceChange.dairyCattle) }}%
                      </span>
                    </div>
                  </div>
                  <div class="flex items-center justify-between">
                    <div class="flex items-center">
                      <span class="w-3 h-3 bg-amber-600 rounded-full mr-2"></span>
                      <span class="text-sm text-neutral-700">Breeding Stock</span>
                    </div>
                    <div class="flex items-center space-x-2">
                      <span class="font-medium text-green-800">{{ formatToPHP(marketInsights.averagePrices.breedingStock) }}</span>
                      <span :class="marketInsights.priceChange.breedingStock > 0 ? 'text-green-600' : 'text-red-600'" class="text-xs">
                        <span v-if="marketInsights.priceChange.breedingStock > 0">▲</span>
                        <span v-else>▼</span>
                        {{ Math.abs(marketInsights.priceChange.breedingStock) }}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Market Activity -->
              <div class="bg-green-50 rounded-xl p-5 border border-green-100">
                <h3 class="text-lg font-semibold text-green-800 mb-4">Market Activity</h3>
                <div class="flex items-center justify-between mb-4">
                  <span class="text-sm text-neutral-700">New Listings This Week</span>
                  <span class="font-medium text-green-800">{{ marketInsights.marketActivity.listingsThisWeek }}</span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-sm text-neutral-700">Change from Last Week</span>
                  <span :class="marketInsights.marketActivity.percentChange > 0 ? 'text-green-600' : 'text-red-600'" class="font-medium">
                    <span v-if="marketInsights.marketActivity.percentChange > 0">▲</span>
                    <span v-else>▼</span>
                    {{ Math.abs(marketInsights.marketActivity.percentChange) }}%
                  </span>
                </div>
                <div class="mt-4 text-sm text-neutral-600">
                  <p class="italic">Market trend: <strong class="text-green-700">Strong demand for dairy cattle</strong> in Central Luzon region.</p>
                </div>
              </div>
            </div>
          </section>
        </div>

        <!-- Right Column (Sidebar) -->
        <div class="w-full lg:w-1/4">
          <!-- Profile Card -->
          <section class="mb-8 bg-white rounded-2xl shadow-lg p-6 border border-neutral-100 hover:shadow-xl transition-shadow duration-300">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-xl font-bold text-green-800">Your Profile</h3>
              <button @click="editProfile" class="text-green-600 hover:text-green-800 transition-colors duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
            </div>

            <div class="flex flex-col items-center mb-6">
              <div class="bg-gradient-to-br from-green-500 to-emerald-600 h-20 w-20 rounded-full flex items-center justify-center mb-3 shadow-md">
                <span class="text-white text-2xl font-bold">{{ buyerProfile.name.split(' ')[0][0] + buyerProfile.name.split(' ')[1][0] }}</span>
              </div>
              <h4 class="text-lg font-semibold text-green-800">{{ buyerProfile.name }}</h4>
              <p class="text-sm text-neutral-500">{{ buyerProfile.businessName }}</p>
            </div>

            <div class="space-y-3 text-sm">
              <div class="flex items-start space-x-3">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span class="text-neutral-700">{{ buyerProfile.location }}</span>
              </div>
              <div class="flex items-start space-x-3">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span class="text-neutral-700">Member since {{ buyerProfile.memberSince }}</span>
              </div>
            </div>

            <div class="mt-5">
              <p class="text-sm font-medium text-neutral-600 mb-2">Profile Completeness</p>
              <div class="h-2 bg-neutral-200 rounded-full overflow-hidden">
                <div class="h-full bg-green-600 rounded-full" :style="{ width: buyerProfile.completenessPercentage + '%' }"></div>
              </div>
              <p class="text-xs text-neutral-500 mt-1 text-right">{{ buyerProfile.completenessPercentage }}% - Complete your profile to unlock all features</p>
            </div>
          </section>

          <!-- Saved Searches -->
          <section class="mb-8 bg-white rounded-2xl shadow-lg p-6 border border-neutral-100 hover:shadow-xl transition-shadow duration-300">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-xl font-bold text-green-800">Saved Searches</h3>
              <button @click="viewSavedSearches" class="text-green-600 hover:text-green-800 transition-colors duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            <div class="space-y-4">
              <div v-for="search in savedSearches" :key="search.id" class="bg-green-50 rounded-lg p-3 hover:bg-green-100 transition-colors duration-300 cursor-pointer">
                <div class="flex justify-between items-start">
                  <div class="flex items-center space-x-2">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <p class="text-sm font-medium text-green-800">{{ search.query }}</p>
                  </div>
                  <div v-if="search.newResults > 0" class="bg-green-600 text-white rounded-full h-5 w-5 flex items-center justify-center text-xs font-bold">
                    {{ search.newResults }}
                  </div>
                </div>
                <p class="text-xs text-neutral-500 mt-2">Last checked {{ search.lastChecked }}</p>
              </div>
            </div>
          </section>

          <!-- Preferred Categories -->
          <section class="mb-8 bg-white rounded-2xl shadow-lg p-6 border border-neutral-100 hover:shadow-xl transition-shadow duration-300">
            <h3 class="text-xl font-bold text-green-800 mb-4">Your Categories</h3>
            <div class="flex flex-wrap gap-2">
              <div v-for="(category, index) in buyerProfile.preferredCategories" :key="index" class="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                {{ category }}
              </div>
            </div>
          </section>

          <!-- Quick Actions -->
          <section class="bg-white rounded-2xl shadow-lg p-6 border border-neutral-100 hover:shadow-xl transition-shadow duration-300">
            <h3 class="text-xl font-bold text-green-800 mb-4">Quick Actions</h3>
            <div class="space-y-3">
              <a href="#" class="flex items-center space-x-3 p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <span class="text-sm font-medium text-green-800">Browse New Listings</span>
              </a>
              <a href="#" class="flex items-center space-x-3 p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span class="text-sm font-medium text-green-800">Get Help & Support</span>
              </a>
              <a href="#" class="flex items-center space-x-3 p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span class="text-sm font-medium text-green-800">Livestock Resources</span>
              </a>
            </div>
          </section>
        </div>
      </div>
    </div>
  </div>
</template>

