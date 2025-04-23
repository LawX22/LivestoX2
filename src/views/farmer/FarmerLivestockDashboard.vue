<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Using your existing NavBar component -->
    <div class="navbar-container">
      <NavBar />
    </div>

    <!-- Main Content -->
    <div class="pt-16 pb-10">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Welcome Section -->
        <div class="py-6">
          <h2 class="text-2xl font-semibold text-gray-800">Welcome back, Mark!</h2>
          <p class="mt-1 text-sm text-gray-600">Here's what's happening with your livestock sales today.</p>
        </div>

        <!-- Stats Cards -->
        <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mt-4">
          <div class="bg-white overflow-hidden shadow rounded-lg">
            <div class="px-4 py-5 sm:p-6">
              <div class="flex items-center">
                <div class="flex-shrink-0 bg-green-100 rounded-md p-3">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div class="ml-5 w-0 flex-1">
                  <dt class="text-sm font-medium text-gray-500 truncate">Active Listings</dt>
                  <dd class="flex items-baseline">
                    <div class="text-2xl font-semibold text-gray-900">15</div>
                  </dd>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-white overflow-hidden shadow rounded-lg">
            <div class="px-4 py-5 sm:p-6">
              <div class="flex items-center">
                <div class="flex-shrink-0 bg-blue-100 rounded-md p-3">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div class="ml-5 w-0 flex-1">
                  <dt class="text-sm font-medium text-gray-500 truncate">Sales (YTD)</dt>
                  <dd class="flex items-baseline">
                    <div class="text-2xl font-semibold text-gray-900">53</div>
                  </dd>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-white overflow-hidden shadow rounded-lg">
            <div class="px-4 py-5 sm:p-6">
              <div class="flex items-center">
                <div class="flex-shrink-0 bg-yellow-100 rounded-md p-3">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div class="ml-5 w-0 flex-1">
                  <dt class="text-sm font-medium text-gray-500 truncate">Pending Offers</dt>
                  <dd class="flex items-baseline">
                    <div class="text-2xl font-semibold text-gray-900">7</div>
                  </dd>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-white overflow-hidden shadow rounded-lg">
            <div class="px-4 py-5 sm:p-6">
              <div class="flex items-center">
                <div class="flex-shrink-0 bg-red-100 rounded-md p-3">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div class="ml-5 w-0 flex-1">
                  <dt class="text-sm font-medium text-gray-500 truncate">Revenue (YTD)</dt>
                  <dd class="flex items-baseline">
                    <div class="text-2xl font-semibold text-gray-900">$87,450</div>
                  </dd>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Recent Activity and Inventory Status -->
        <div class="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <!-- Recent Activity -->
          <div class="bg-white shadow rounded-lg">
            <div class="px-4 py-5 border-b border-gray-200 sm:px-6">
              <h3 class="text-lg font-medium leading-6 text-gray-900">Recent Activity</h3>
            </div>
            <ul class="divide-y divide-gray-200">
              <li v-for="(activity, index) in recentActivities" :key="index" class="px-4 py-4 sm:px-6">
                <div class="flex items-center">
                  <div :class="`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center ${activity.iconBg}`">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" :class="activity.iconColor" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="activity.iconPath" />
                    </svg>
                  </div>
                  <div class="ml-4">
                    <p class="text-sm font-medium text-gray-900">{{ activity.title }}</p>
                    <p class="text-sm text-gray-500">{{ activity.description }}</p>
                  </div>
                  <div class="ml-auto text-sm text-gray-500">{{ activity.time }}</div>
                </div>
              </li>
            </ul>
            <div class="px-4 py-3 bg-gray-50 text-right sm:px-6">
              <button class="text-sm font-medium text-green-600 hover:text-green-500">View all activity</button>
            </div>
          </div>

          <!-- Inventory Status -->
          <div class="bg-white shadow rounded-lg">
            <div class="px-4 py-5 border-b border-gray-200 sm:px-6">
              <h3 class="text-lg font-medium leading-6 text-gray-900">Inventory Status</h3>
            </div>
            <ul class="divide-y divide-gray-200">
              <li v-for="(item, index) in inventoryItems" :key="index" class="px-4 py-4 sm:px-6">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-10 w-10 rounded-md bg-gray-100 flex items-center justify-center">
                    <span class="text-xs font-medium text-gray-800">{{ item.category }}</span>
                  </div>
                  <div class="ml-4 flex-1">
                    <div class="flex items-center justify-between">
                      <p class="text-sm font-medium text-gray-900">{{ item.name }}</p>
                      <p class="text-sm font-medium text-gray-600">{{ item.count }}</p>
                    </div>
                    <div class="mt-1 flex items-center">
                      <div class="w-full bg-gray-200 rounded-full h-2">
                        <div class="bg-green-600 h-2 rounded-full" :style="`width: ${item.healthPercentage}%`"></div>
                      </div>
                      <span class="ml-2 text-xs text-gray-500">{{ item.healthPercentage }}% healthy</span>
                    </div>
                  </div>
                </div>
              </li>
            </ul>
            <div class="px-4 py-3 bg-gray-50 text-right sm:px-6">
              <button class="text-sm font-medium text-green-600 hover:text-green-500">View full inventory</button>
            </div>
          </div>
        </div>

        <!-- Upcoming Auctions for Your Listings -->
        <div class="mt-8">
          <div class="bg-white shadow rounded-lg">
            <div class="px-4 py-5 border-b border-gray-200 sm:px-6">
              <h3 class="text-lg font-medium leading-6 text-gray-900">Your Upcoming Auction Entries</h3>
            </div>
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Livestock Type</th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th scope="col" class="relative px-6 py-3">
                      <span class="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr v-for="(auction, index) in upcomingAuctions" :key="index">
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ auction.date }}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ auction.location }}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ auction.type }}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ auction.quantity }}</td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span :class="`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${auction.statusClass}`">
                        {{ auction.status }}
                      </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <a href="#" class="text-green-600 hover:text-green-900">Manage</a>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- Current Market Trends -->
        <div class="mt-8">
          <h3 class="text-lg font-medium text-gray-900">Current Market Trends</h3>
          <div class="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <div v-for="(trend, index) in marketTrends" :key="index" class="bg-white overflow-hidden shadow rounded-lg">
              <div class="px-4 py-5 sm:p-6">
                <div class="flex items-center">
                  <div class="flex-1">
                    <h4 class="text-lg font-medium text-gray-900">{{ trend.title }}</h4>
                    <p class="mt-1 text-sm text-gray-500">{{ trend.description }}</p>
                  </div>
                  <div :class="`flex-shrink-0 ${trend.trendUp ? 'text-green-600' : 'text-red-600'}`">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path v-if="trend.trendUp" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 17h8m0 0v-8m0 8l-8-8-4 4-6-6" />
                    </svg>
                  </div>
                </div>
                <div class="mt-4">
                  <div class="flex justify-between items-baseline">
                    <div class="text-2xl font-semibold text-gray-900">{{ trend.currentPrice }}</div>
                    <div :class="`flex items-center ${trend.trendUp ? 'text-green-600' : 'text-red-600'}`">
                      <span class="text-sm font-medium">{{ trend.change }}</span>
                    </div>
                  </div>
                  <div class="mt-1">
                    <div class="text-sm text-gray-500">Average 30-day price</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Your Active Listings -->
        <div class="mt-8">
          <div class="flex justify-between items-center">
            <h3 class="text-lg font-medium text-gray-900">Your Active Listings</h3>
            <button class="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
              + Add New Listing
            </button>
          </div>
          <div class="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <div v-for="(listing, index) in activeListings" :key="index" class="bg-white overflow-hidden shadow rounded-lg">
              <div class="h-48 bg-gray-200">
                <!-- Placeholder for livestock image -->
                <div class="h-full w-full flex items-center justify-center text-gray-500">
                  <span>Livestock Image</span>
                </div>
              </div>
              <div class="px-4 py-4">
                <div class="flex justify-between items-center">
                  <h4 class="text-lg font-medium text-gray-900">{{ listing.title }}</h4>
                  <span class="text-green-600 font-medium">{{ listing.price }}</span>
                </div>
                <p class="mt-1 text-sm text-gray-500">{{ listing.description }}</p>
                <div class="mt-3 flex flex-wrap gap-2">
                  <span class="text-xs font-medium bg-gray-100 px-2 py-1 rounded">{{ listing.breed }}</span>
                  <span class="text-xs font-medium bg-gray-100 px-2 py-1 rounded">{{ listing.age }}</span>
                  <span class="text-xs font-medium bg-gray-100 px-2 py-1 rounded">{{ listing.weight }}</span>
                </div>
                <div class="mt-3">
                  <div class="flex items-center text-sm text-gray-500">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    {{ listing.views }} views
                  </div>
                </div>
                <div class="mt-4 flex justify-between">
                  <button class="text-sm text-gray-500 hover:text-gray-700">
                    Edit listing
                  </button>
                  <button class="text-sm text-green-600 hover:text-green-700 font-medium">
                    View offers ({{ listing.offers }})
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import NavBar from '../../components/Main/NavBar.vue';

export default defineComponent({
  name: 'FarmerDashboard',
  components: {
    NavBar
  },
  setup() {
    const recentActivities = ref([
      {
        title: 'New offer received',
        description: 'You received an offer of $3,200 for Angus Bull #247',
        time: '1h ago',
        iconBg: 'bg-green-100',
        iconColor: 'text-green-600',
        iconPath: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
      },
      {
        title: 'Sale completed',
        description: 'You sold 5 Hereford Heifers for $14,500',
        time: '3h ago',
        iconBg: 'bg-blue-100',
        iconColor: 'text-blue-600',
        iconPath: 'M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z'
      },
      {
        title: 'Auction registration confirmed',
        description: 'Your entry for 10 Dorper Lambs has been confirmed',
        time: '1d ago',
        iconBg: 'bg-yellow-100',
        iconColor: 'text-yellow-600',
        iconPath: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'
      },
      {
        title: 'New message',
        description: 'You received a message from Johnson Farms',
        time: '2d ago',
        iconBg: 'bg-yellow-100',
        iconColor: 'text-yellow-600',
        iconPath: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z'
      }
    ]);

    const inventoryItems = ref([
      {
        category: 'CA',
        name: 'Angus Bulls',
        count: '12 head',
        healthPercentage: 95
      },
      {
        category: 'CA',
        name: 'Hereford Heifers',
        count: '24 head',
        healthPercentage: 98
      },
      {
        category: 'SH',
        name: 'Suffolk Ewes',
        count: '35 head',
        healthPercentage: 92
      },
      {
        category: 'GO',
        name: 'Boer Goats',
        count: '18 head',
        healthPercentage: 90
      }
    ]);

    const upcomingAuctions = ref([
      {
        date: 'Apr 25, 2025',
        location: 'Central Valley Auction House, CA',
        type: 'Angus Bulls',
        quantity: '5 head',
        status: 'Confirmed',
        statusClass: 'bg-green-100 text-green-800'
      },
      {
        date: 'Apr 28, 2025',
        location: 'Eastside Livestock Exchange, TX',
        type: 'Hereford Heifers',
        quantity: '8 head',
        status: 'Pending',
        statusClass: 'bg-yellow-100 text-yellow-800'
      },
      {
        date: 'May 2, 2025',
        location: 'Mountain State Fair Grounds, CO',
        type: 'Suffolk Lambs',
        quantity: '12 head',
        status: 'Confirmed',
        statusClass: 'bg-green-100 text-green-800'
      },
      {
        date: 'May 5, 2025',
        location: 'Western Ranchers Auction, MT',
        type: 'Mixed Cattle',
        quantity: '15 head',
        status: 'Scheduled',
        statusClass: 'bg-blue-100 text-blue-800'
      }
    ]);

    const marketTrends = ref([
      {
        title: 'Angus Bulls',
        description: 'Market trend over the last 30 days',
        currentPrice: '$3,250/head',
        change: '+5.2%',
        trendUp: true
      },
      {
        title: 'Hereford Heifers',
        description: 'Market trend over the last 30 days',
        currentPrice: '$2,850/head',
        change: '+2.7%',
        trendUp: true
      },
      {
        title: 'Lamb Prices',
        description: 'Market trend over the last 30 days',
        currentPrice: '$245/head',
        change: '-1.2%',
        trendUp: false
      }
    ]);

    const activeListings = ref([
      {
        title: 'Prime Angus Bulls',
        price: '$3,500/head',
        description: 'High-quality Black Angus bulls with excellent genetics and health records.',
        breed: 'Black Angus',
        age: '24-28 months',
        weight: '1200-1350 lbs',
        views: 45,
        offers: 2
      },
      {
        title: 'Hereford Breeding Heifers',
        price: '$2,800/head',
        description: 'Purebred Hereford heifers, ready for breeding, excellent temperament.',
        breed: 'Hereford',
        age: '18-20 months',
        weight: '850-950 lbs',
        views: 38,
        offers: 1
      },
      {
        title: 'Suffolk Lambs',
        price: '$275/head',
        description: 'Healthy Suffolk lambs, grass-fed and ready for market or breeding stock.',
        breed: 'Suffolk',
        age: '6 months',
        weight: '90-110 lbs',
        views: 26,
        offers: 0
      }
    ]);

    return {
      recentActivities,
      inventoryItems,
      upcomingAuctions,
      marketTrends,
      activeListings
    };
  }
});
</script>

<style scoped>
.navbar-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background-color: #ffffff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
</style>