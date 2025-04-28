<script lang="ts">
import { defineComponent, ref } from 'vue';
import NavBar from '../../components/Main/NavBar.vue';
import { useAuthStore } from '../../stores/authContext';

export default defineComponent({
    name: 'BuyerDashboard',
    components: {
        NavBar
    },
    setup() {
        const recentActivities = ref([
            {
                title: 'Bid placed',
                description: 'You placed a bid of $2,500 on Angus Bull #247',
                time: '2h ago',
                iconBg: 'bg-green-100',
                iconColor: 'text-green-600',
                iconPath: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
            },
            {
                title: 'Outbid notification',
                description: 'You were outbid on Hereford Heifer #122',
                time: '4h ago',
                iconBg: 'bg-red-100',
                iconColor: 'text-red-600',
                iconPath: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z'
            },
            {
                title: 'Purchase completed',
                description: 'Successfully purchased 5 Dorper Lambs',
                time: '1d ago',
                iconBg: 'bg-blue-100',
                iconColor: 'text-blue-600',
                iconPath: 'M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z'
            },
            {
                title: 'New message',
                description: 'You received a message from Smith Farms',
                time: '2d ago',
                iconBg: 'bg-yellow-100',
                iconColor: 'text-yellow-600',
                iconPath: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z'
            }
        ]);

        const watchlistItems = ref([
            {
                category: 'CA',
                name: 'Angus Bulls',
                price: '$2,500 - $3,800',
                details: 'Age: 2-3 years • Black Angus • 5 listings'
            },
            {
                category: 'SH',
                name: 'Suffolk Ewes',
                price: '$275 - $450',
                details: 'Age: 1-2 years • Breeding stock • 8 listings'
            },
            {
                category: 'GO',
                name: 'Boer Goats',
                price: '$180 - $350',
                details: 'Age: 6-18 months • Various colors • 12 listings'
            },
            {
                category: 'PG',
                name: 'Yorkshire Gilts',
                price: '$320 - $480',
                details: 'Age: 4-8 months • Show quality • 3 listings'
            }
        ]);

        const upcomingAuctions = ref([
            {
                date: 'Apr 25, 2025',
                location: 'Central Valley Auction House, CA',
                type: 'Cattle',
                lots: '120+',
                status: 'Registered',
                statusClass: 'bg-green-100 text-green-800'
            },
            {
                date: 'Apr 28, 2025',
                location: 'Eastside Livestock Exchange, TX',
                type: 'Mixed',
                lots: '85+',
                status: 'Open',
                statusClass: 'bg-blue-100 text-blue-800'
            },
            {
                date: 'May 2, 2025',
                location: 'Mountain State Fair Grounds, CO',
                type: 'Premium',
                lots: '40+',
                status: 'Open',
                statusClass: 'bg-blue-100 text-blue-800'
            },
            {
                date: 'May 5, 2025',
                location: 'Western Ranchers Auction, MT',
                type: 'Cattle & Sheep',
                lots: '150+',
                status: 'Coming Soon',
                statusClass: 'bg-gray-100 text-gray-800'
            }
        ]);

        const recommendedListings = ref([
            {
                title: 'Angus Yearling Bulls',
                price: '$3,200',
                description: 'High quality Black Angus yearling bulls with excellent genetics.',
                breed: 'Black Angus',
                age: '12-14 months',
                weight: '950-1100 lbs'
            },
            {
                title: 'Hereford Heifers',
                price: '$2,800',
                description: 'Purebred Hereford heifers ready for breeding.',
                breed: 'Hereford',
                age: '18 months',
                weight: '800-900 lbs'
            },
            {
                title: 'Dorper Lambs',
                price: '$275/each',
                description: 'Healthy Dorper lambs, grass-fed and ready for finishing.',
                breed: 'Dorper',
                age: '4-6 months',
                weight: '65-80 lbs'
            }
        ]);

        const authStore = useAuthStore();

        return {
            recentActivities,
            watchlistItems,
            upcomingAuctions,
            recommendedListings,
            authStore
        };
    }
});
</script>

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
                    <h2 class="text-2xl font-semibold text-gray-800">Welcome back, {{authStore?.user?.user_metadata.firstname}}</h2>
                    <p class="mt-1 text-sm text-gray-600">Here's what's happening with your livestock purchases today.
                    </p>
                </div>

                <!-- Stats Cards -->
                <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mt-4">
                    <div class="bg-white overflow-hidden shadow rounded-lg">
                        <div class="px-4 py-5 sm:p-6">
                            <div class="flex items-center">
                                <div class="flex-shrink-0 bg-green-100 rounded-md p-3">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-green-600" fill="none"
                                        viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div class="ml-5 w-0 flex-1">
                                    <dt class="text-sm font-medium text-gray-500 truncate">Active Bids</dt>
                                    <dd class="flex items-baseline">
                                        <div class="text-2xl font-semibold text-gray-900">12</div>
                                    </dd>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="bg-white overflow-hidden shadow rounded-lg">
                        <div class="px-4 py-5 sm:p-6">
                            <div class="flex items-center">
                                <div class="flex-shrink-0 bg-blue-100 rounded-md p-3">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-blue-600" fill="none"
                                        viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                </div>
                                <div class="ml-5 w-0 flex-1">
                                    <dt class="text-sm font-medium text-gray-500 truncate">Purchases (YTD)</dt>
                                    <dd class="flex items-baseline">
                                        <div class="text-2xl font-semibold text-gray-900">47</div>
                                    </dd>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="bg-white overflow-hidden shadow rounded-lg">
                        <div class="px-4 py-5 sm:p-6">
                            <div class="flex items-center">
                                <div class="flex-shrink-0 bg-yellow-100 rounded-md p-3">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-yellow-600" fill="none"
                                        viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div class="ml-5 w-0 flex-1">
                                    <dt class="text-sm font-medium text-gray-500 truncate">Upcoming Auctions</dt>
                                    <dd class="flex items-baseline">
                                        <div class="text-2xl font-semibold text-gray-900">8</div>
                                    </dd>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="bg-white overflow-hidden shadow rounded-lg">
                        <div class="px-4 py-5 sm:p-6">
                            <div class="flex items-center">
                                <div class="flex-shrink-0 bg-red-100 rounded-md p-3">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-red-600" fill="none"
                                        viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div class="ml-5 w-0 flex-1">
                                    <dt class="text-sm font-medium text-gray-500 truncate">Budget Remaining</dt>
                                    <dd class="flex items-baseline">
                                        <div class="text-2xl font-semibold text-gray-900">$24,500</div>
                                    </dd>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Recent Activity and Watchlist -->
                <div class="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
                    <!-- Recent Activity -->
                    <div class="bg-white shadow rounded-lg">
                        <div class="px-4 py-5 border-b border-gray-200 sm:px-6">
                            <h3 class="text-lg font-medium leading-6 text-gray-900">Recent Activity</h3>
                        </div>
                        <ul class="divide-y divide-gray-200">
                            <li v-for="(activity, index) in recentActivities" :key="index" class="px-4 py-4 sm:px-6">
                                <div class="flex items-center">
                                    <div
                                        :class="`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center ${activity.iconBg}`">
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5"
                                            :class="activity.iconColor" fill="none" viewBox="0 0 24 24"
                                            stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                :d="activity.iconPath" />
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
                            <button class="text-sm font-medium text-green-600 hover:text-green-500">View all
                                activity</button>
                        </div>
                    </div>

                    <!-- Watchlist -->
                    <div class="bg-white shadow rounded-lg">
                        <div class="px-4 py-5 border-b border-gray-200 sm:px-6">
                            <h3 class="text-lg font-medium leading-6 text-gray-900">Your Watchlist</h3>
                        </div>
                        <ul class="divide-y divide-gray-200">
                            <li v-for="(item, index) in watchlistItems" :key="index" class="px-4 py-4 sm:px-6">
                                <div class="flex items-center">
                                    <div
                                        class="flex-shrink-0 h-10 w-10 rounded-md bg-gray-100 flex items-center justify-center">
                                        <span class="text-xs font-medium text-gray-800">{{ item.category }}</span>
                                    </div>
                                    <div class="ml-4 flex-1">
                                        <div class="flex items-center justify-between">
                                            <p class="text-sm font-medium text-gray-900">{{ item.name }}</p>
                                            <p class="text-sm font-medium text-green-600">{{ item.price }}</p>
                                        </div>
                                        <p class="text-sm text-gray-500">{{ item.details }}</p>
                                    </div>
                                </div>
                            </li>
                        </ul>
                        <div class="px-4 py-3 bg-gray-50 text-right sm:px-6">
                            <button class="text-sm font-medium text-green-600 hover:text-green-500">View full
                                watchlist</button>
                        </div>
                    </div>
                </div>

                <!-- Upcoming Auctions -->
                <div class="mt-8">
                    <div class="bg-white shadow rounded-lg">
                        <div class="px-4 py-5 border-b border-gray-200 sm:px-6">
                            <h3 class="text-lg font-medium leading-6 text-gray-900">Upcoming Auctions</h3>
                        </div>
                        <div class="overflow-x-auto">
                            <table class="min-w-full divide-y divide-gray-200">
                                <thead class="bg-gray-50">
                                    <tr>
                                        <th scope="col"
                                            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Date</th>
                                        <th scope="col"
                                            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Location</th>
                                        <th scope="col"
                                            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Auction Type</th>
                                        <th scope="col"
                                            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Available Lots</th>
                                        <th scope="col"
                                            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Status</th>
                                        <th scope="col" class="relative px-6 py-3">
                                            <span class="sr-only">Actions</span>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody class="bg-white divide-y divide-gray-200">
                                    <tr v-for="(auction, index) in upcomingAuctions" :key="index">
                                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ auction.date }}
                                        </td>
                                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{
                                            auction.location }}</td>
                                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ auction.type }}
                                        </td>
                                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ auction.lots }}
                                        </td>
                                        <td class="px-6 py-4 whitespace-nowrap">
                                            <span
                                                :class="`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${auction.statusClass}`">
                                                {{ auction.status }}
                                            </span>
                                        </td>
                                        <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <a href="#" class="text-green-600 hover:text-green-900">View</a>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <!-- Recommended Listings -->
                <div class="mt-8">
                    <h3 class="text-lg font-medium text-gray-900">Recommended Listings</h3>
                    <div class="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        <div v-for="(listing, index) in recommendedListings" :key="index"
                            class="bg-white overflow-hidden shadow rounded-lg">
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
                                    <span class="text-xs font-medium bg-gray-100 px-2 py-1 rounded">{{ listing.breed
                                        }}</span>
                                    <span class="text-xs font-medium bg-gray-100 px-2 py-1 rounded">{{ listing.age
                                        }}</span>
                                    <span class="text-xs font-medium bg-gray-100 px-2 py-1 rounded">{{ listing.weight
                                        }}</span>
                                </div>
                                <div class="mt-4 flex justify-between">
                                    <button class="text-sm text-gray-500 hover:text-gray-700">
                                        Add to watchlist
                                    </button>
                                    <button class="text-sm text-green-600 hover:text-green-700 font-medium">
                                        View details
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