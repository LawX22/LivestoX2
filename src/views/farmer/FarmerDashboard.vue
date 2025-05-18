<script setup lang="ts">
import NavBar from '../../components/Main/NavBar.vue';
import LivestockListingsTable from '../../components/Farmer/Dashboard/LivestockListingsTable.vue';
import TransactionsTable from '../../components/Farmer/Dashboard/TransactionsTable.vue';
import { computed, onMounted, ref } from 'vue';
import { useAuthStore } from '../../stores/authContext';
import { livestock } from '../../services/livestockService';
import { farmers } from '../../services/account/farmerService';



interface DashboardList {
  id: string;
  title: string;
  breed: string;
  age: string;
  price: number;
  status: string;
  quantity: number;
  images:  Record<string, any>;
  description: string;
}

interface FarmProfile {
  farm_name: string;
  location: string;
  certifications: string;
  totalAcreage: number;
  completenessPercentage: number;
}

const authStore = useAuthStore();

const livestockListings = ref<DashboardList[]>([]);
const farmProfile = ref<FarmProfile>();

const fetchListings = async () => {
  const sellerId = authStore.userId;
  if (!sellerId) return;

  try {
    livestockListings.value = await livestock.getListingsBySeller(sellerId);
    farmProfile.value = await farmers.getFarmerData(sellerId);
  } catch (error) {
    console.error("Could not fetch listings:", error);
  }
};

onMounted(() => {
  fetchListings();
});

const totalListingsCount = computed(() => livestockListings.value.length);
const limitedListings = computed(() => {
  return livestockListings.value.slice(0, 5);
});

    // Currency exchange rate (approximately 1 USD = 56.50 PHP as of May 2025)
    const phpRate = 56.50;

    // Format currency to PHP
    const formatToPHP = (value: number) => {
      return '₱' + (value * phpRate).toLocaleString('en-PH');
    };

    // Existing setup code with PHP conversions
    const dashboardStats = ref({
      totalSales: 53,
      yearToDateRevenue: 87450, // Will be displayed in PHP
      pendingOffers: 7
    });

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

    // Recent Transaction History Data
    type TransactionStatus = "Completed" | "Processing" | "Pending";
    interface Transaction {
      id: number;
      buyer: string;
      amount: number;
      date: string;
      method: string;
      reference: string;
      status: TransactionStatus;
    }
    const transactionHistory = ref<Transaction[]>([
      {
        id: 1,
        buyer: 'Mountain Valley Ranch',
        amount: 10500,
        date: 'Apr 15, 2025',
        method: 'Bank Transfer',
        reference: 'TRX-20250415-001',
        status: 'Completed'
      },
      {
        id: 2,
        buyer: 'Green Pastures Farm',
        amount: 8400,
        date: 'Apr 22, 2025',
        method: 'Mobile Payment',
        reference: 'TRX-20250422-002',
        status: 'Processing'
      },
      {
        id: 3,
        buyer: 'Golden Field Ranch',
        amount: 5600,
        date: 'May 10, 2025',
        method: 'Cash on Delivery',
        reference: 'TRX-20250510-004',
        status: 'Pending'
      }
    ]);

    const listingInsights = ref({
      totalViews: 120,
      averageListingDuration: 45,
      conversionRate: 12.5
    });

    const addNewListing = () => {
      console.log('Add new listing clicked');
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

    const viewAllTransactions = () => {
      console.log('View all transactions clicked');
    };

    const viewTransactionDetails = (id: number) => {
      console.log(`View transaction details for ID: ${id}`);
    };

    const editProfile = () => {
      console.log('Edit profile clicked');
    };
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-green-50 to-teal-50 font-sans text-gray-800 w-full">
    <!-- Sticky Navbar -->
    <div class="sticky top-0 z-50 w-full shadow-md bg-white/80 backdrop-blur-md">
      <NavBar />
    </div>

    <div class="pt-8 pb-12 container mx-auto px-4 sm:px-6 lg:px-8 max-w-full">
      <!-- Dashboard Header with improved gradient background -->
      <div
        class="mb-8 bg-gradient-to-r from-green-700 via-green-600 to-teal-500 py-8 px-6 rounded-xl shadow-lg text-white">
        <div class="flex justify-between items-center flex-wrap">
          <div>
            <h1 class="text-3xl md:text-4xl font-extrabold mb-2 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 mr-3 text-green-200" fill="none"
                viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Farmer Dashboard
            </h1>
            <p class="text-green-100 text-lg">Welcome back, {{ authStore.userMetadata.firstname }}! Here's your
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
            <h2 class="text-2xl font-bold text-green-800 mb-6 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2 text-green-600" fill="none"
                viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Business Overview
            </h2>

            <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
              <div
                class="bg-gradient-to-br from-white to-green-50 rounded-xl p-5 border border-neutral-100 shadow-md transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg">
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-sm text-neutral-500 uppercase tracking-wider mb-1 font-medium">
                      Total Listings
                    </p>
                    <p class="text-2xl font-bold text-green-700">
                      {{ totalListingsCount }}
                    </p>
                  </div>
                  <div class="bg-green-100 text-green-600 p-3 rounded-full shadow-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                      stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div
                class="bg-gradient-to-br from-white to-green-50 rounded-xl p-5 border border-neutral-100 shadow-md transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg">
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-sm text-neutral-500 uppercase tracking-wider mb-1 font-medium">
                      Total Sales
                    </p>
                    <p class="text-2xl font-bold text-green-700">
                      {{ dashboardStats.totalSales }}
                    </p>
                  </div>
                  <div class="bg-green-100 text-green-600 p-3 rounded-full shadow-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                      stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                </div>
              </div>

              <div
                class="bg-gradient-to-br from-white to-green-50 rounded-xl p-5 border border-neutral-100 shadow-md transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg">
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-sm text-neutral-500 uppercase tracking-wider mb-1 font-medium">
                      Year To Date Revenue
                    </p>
                    <p class="text-2xl font-bold text-green-700">
                      {{ formatToPHP(dashboardStats.yearToDateRevenue) }}
                    </p>
                  </div>
                  <div class="bg-green-100 text-green-600 p-3 rounded-full shadow-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                      stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div
                class="bg-gradient-to-br from-white to-green-50 rounded-xl p-5 border border-neutral-100 shadow-md transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg">
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-sm text-neutral-500 uppercase tracking-wider mb-1 font-medium">
                      Pending Offers
                    </p>
                    <p class="text-2xl font-bold text-green-700">
                      {{ dashboardStats.pendingOffers }}
                    </p>
                  </div>
                  <div class="bg-green-100 text-green-600 p-3 rounded-full shadow-sm">
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

          <!-- Livestock Listings Table Section - Now using the component -->
          <LivestockListingsTable 
            :listings="limitedListings" 
            :formatToPHP="formatToPHP" 
            @view-all="viewAllListings" 
            @add-new="addNewListing" 
          />

          <!-- Transaction Section - Now using the component -->
          <TransactionsTable 
            :transactions="transactionHistory" 
            :format-to-php="formatToPHP" 
            @view-all="viewAllTransactions" 
            @view-details="viewTransactionDetails" 
          />
        </div>

        <!-- Right Column (Sidebar) -->
        <div class="w-full lg:w-1/4 space-y-8">
          <!-- Farm Profile Card -->
          <section
            class="bg-white rounded-2xl shadow-lg border border-neutral-100 hover:shadow-xl transition-shadow duration-300 overflow-hidden">
            <div class="bg-gradient-to-r from-green-600 to-teal-500 p-6 text-white">
              <div class="flex justify-between items-center">
                <h3 class="font-bold text-lg flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Farm Profile
                </h3>
                <button @click="editProfile"
                  class="bg-white/20 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-md hover:bg-white/30 transition-colors duration-300 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit
                </button>
              </div>
            </div>
            <div class="p-6">
              <div class="flex items-center mb-4">
                <div
                  class="h-16 w-16 bg-gradient-to-br from-green-100 to-teal-100 rounded-full flex items-center justify-center text-green-700 text-xl font-bold">
                  {{ farmProfile?.farm_name.charAt(0) }} 
                </div>
                <div class="ml-4">
                  <h4 class="font-semibold text-lg text-neutral-800">{{ farmProfile?.farm_name }}</h4>
                  <p class="text-sm text-neutral-500">{{ farmProfile?.location }}</p>
                </div>
              </div>

              <!-- <div class="mb-4 border-t border-neutral-100 pt-4">
                <div class="flex justify-between items-center mb-2">
                  <h5 class="text-sm font-medium text-neutral-600">Profile Completeness</h5>
                  <span class="text-xs font-medium text-neutral-500">{{ farmProfile?.completenessPercentage }}%</span>
                </div>
                <div class="w-full bg-neutral-200 rounded-full h-2">
                  <div class="bg-green-500 h-2 rounded-full"
                    :style="{ width: farmProfile?.completenessPercentage + '%' }"></div>
                </div>
              </div> -->

              <!-- <div class="mb-4">
                <h5 class="text-sm font-medium text-neutral-600 mb-2">Farm Size</h5>
                <p class="text-sm text-neutral-800">{{ farmProfile.totalAcreage }} acres</p>
              </div> -->

              <div>
                <h5 class="text-sm font-medium text-neutral-600 mb-2">Certifications</h5>
                <div class="flex flex-wrap gap-2">
                  <span v-for="(cert, index) in farmProfile?.certifications" :key="index"
                    class="inline-block bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
                    {{ cert }}
                  </span>
                </div>
              </div>
            </div>
          </section>

          <!-- Buyer Messages -->
          <section
            class="bg-white rounded-2xl shadow-lg p-6 border border-neutral-100 hover:shadow-xl transition-shadow duration-300">
            <div class="flex justify-between items-center mb-6">
              <h3 class="font-bold text-lg text-green-800 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-green-600" fill="none"
                  viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
                Buyer Messages
              </h3>
              <button @click="viewAllMessages" class="text-green-600 hover:text-green-800 text-xs flex items-center">
                <span>View All</span>
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </div>

            <div class="space-y-4">
              <div v-for="message in buyerMessages" :key="message.id"
                class="p-4 border border-neutral-100 rounded-xl hover:bg-green-50 cursor-pointer transition-colors">
                <div class="flex items-center justify-between mb-2">
                  <div class="flex items-center">
                    <div
                      class="h-8 w-8 rounded-full bg-gradient-to-br from-teal-100 to-green-200 flex items-center justify-center text-green-700 text-xs font-bold mr-3">
                      {{ message.sender.charAt(0) }}
                    </div>
                    <span class="font-medium text-sm">{{ message.sender }}</span>
                  </div>
                  <div class="flex items-center">
                    <span class="text-xs text-neutral-500">{{ message.timestamp }}</span>
                    <div v-if="!message.isRead" class="ml-2 h-2 w-2 bg-green-500 rounded-full" title="Unread message">
                    </div>
                  </div>
                </div>
                <h4 class="font-medium text-sm text-green-800 mb-1">{{ message.subject }}</h4>
                <p class="text-xs text-neutral-600 line-clamp-2">{{ message.preview }}</p>
              </div>
            </div>
          </section>

          <!-- Listing Insights -->
          <section
            class="bg-white rounded-2xl shadow-lg p-6 border border-neutral-100 hover:shadow-xl transition-shadow duration-300">
            <div class="flex justify-between items-center mb-6">
              <h3 class="font-bold text-lg text-green-800 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-green-600" fill="none"
                  viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Listing Insights
              </h3>
              <button @click="viewFullAnalytics" class="text-green-600 hover:text-green-800 text-xs flex items-center">
                <span>Full Analytics</span>
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </div>

            <div class="space-y-6">
              <div>
                <div class="flex justify-between items-center mb-2">
                  <span class="text-sm text-neutral-600">Total Views</span>
                  <span class="text-green-700 font-medium">{{ listingInsights.totalViews }}</span>
                </div>
                <div class="w-full bg-neutral-100 rounded-full h-1.5">
                  <div class="bg-green-500 h-1.5 rounded-full" style="width: 70%"></div>
                </div>
              </div>

              <div>
                <div class="flex justify-between items-center mb-2">
                  <span class="text-sm text-neutral-600">Avg. Listing Duration</span>
                  <span class="text-green-700 font-medium">{{ listingInsights.averageListingDuration }} days</span>
                </div>
                <div class="w-full bg-neutral-100 rounded-full h-1.5">
                  <div class="bg-green-500 h-1.5 rounded-full" style="width: 40%"></div>
                </div>
              </div>

              <div>
                <div class="flex justify-between items-center mb-2">
                  <span class="text-sm text-neutral-600">Conversion Rate</span>
                  <span class="text-green-700 font-medium">{{ listingInsights.conversionRate }}%</span>
                </div>
                <div class="w-full bg-neutral-100 rounded-full h-1.5">
                  <div class="bg-green-500 h-1.5 rounded-full" style="width: 25%"></div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  </div>
</template>