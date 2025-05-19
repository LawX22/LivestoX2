<script setup lang="ts">
import { ref } from 'vue';

// Recent activity mock data
const recentActivity = [
  {
    id: 1,
    type: 'new_post',
    user: 'RanchHand42',
    title: 'Best practices for cattle nutrition during winter months',
    time: '2 hours ago'
  },
  {
    id: 2,
    type: 'comment',
    user: 'OrganicFarmer',
    title: 'Organic treatments for common poultry parasites',
    time: '4 hours ago'
  },
  {
    id: 3,
    type: 'like',
    user: 'GoatWhisperer',
    title: 'Preventing and treating hoof rot in goats',
    time: '6 hours ago'
  },
  {
    id: 4,
    type: 'new_post',
    user: 'PigFarmer101',
    title: 'Managing heat stress in pigs during summer',
    time: '8 hours ago'
  }
];

// Top contributors mock data
const topContributors = [
  { name: 'RanchHand42', posts: 86, avatar: '/src/assets/Bull.jpg' },
  { name: 'OrganicFarmer', posts: 73, avatar: '/src/assets/Bull.jpg' },
  { name: 'GoatWhisperer', posts: 65, avatar: '/src/assets/Bull.jpg' },
  { name: 'PigFarmer101', posts: 52, avatar: '/src/assets/Bull.jpg' },
  { name: 'ChickenLady', posts: 48, avatar: '/src/assets/Bull.jpg' }
];

// Popular tags with post counts
const popularTags = [
  { name: 'Nutrition', count: 124 },
  { name: 'Health', count: 98 },
  { name: 'Breeding', count: 87 },
  { name: 'Equipment', count: 76 },
  { name: 'Pasture Management', count: 65 },
  { name: 'Diseases', count: 58 },
  { name: 'Marketing', count: 43 },
  { name: 'Sustainability', count: 37 }
];


// Toggle sidebar visibility on mobile
const showMobileSidebar = ref(false);

const toggleMobileSidebar = () => {
  showMobileSidebar.value = !showMobileSidebar.value;
};
</script>

<template>
  <!-- Mobile toggle button -->
  <button @click="toggleMobileSidebar" class="md:hidden fixed bottom-6 right-6 z-20 p-4 bg-green-600 text-white rounded-full shadow-lg">
    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7" />
    </svg>
  </button>

  <!-- Sidebar - hidden on mobile by default, toggled with button -->
  <aside :class="[
    'w-full md:w-1/4 bg-white rounded-lg shadow-md p-6',
    'md:block', // Always visible on desktop
    showMobileSidebar ? 'fixed inset-0 z-10 overflow-y-auto' : 'hidden' // Toggle on mobile
  ]">
    <!-- Close button for mobile sidebar -->
    <button @click="toggleMobileSidebar" class="md:hidden absolute top-4 right-4 text-gray-500 hover:text-gray-700">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>

    <!-- Forum Stats -->
    <div class="mb-8">
      <h3 class="font-semibold text-lg mb-4 text-gray-800">Forum Stats</h3>
      <div class="grid grid-cols-2 gap-4">
        <div class="bg-green-50 p-3 rounded-lg text-center">
          <p class="text-2xl font-bold text-green-700">1,245</p>
          <p class="text-sm text-gray-600">Total Posts</p>
        </div>
        <div class="bg-green-50 p-3 rounded-lg text-center">
          <p class="text-2xl font-bold text-green-700">3,782</p>
          <p class="text-sm text-gray-600">Members</p>
        </div>
        <div class="bg-green-50 p-3 rounded-lg text-center">
          <p class="text-2xl font-bold text-green-700">512</p>
          <p class="text-sm text-gray-600">Active Today</p>
        </div>
        <div class="bg-green-50 p-3 rounded-lg text-center">
          <p class="text-2xl font-bold text-green-700">24</p>
          <p class="text-sm text-gray-600">New Topics</p>
        </div>
      </div>
    </div>

    <!-- Recent Activity -->
    <div class="mb-8">
      <h3 class="font-semibold text-lg mb-4 text-gray-800">Recent Activity</h3>
      <div class="space-y-3">
        <div v-for="activity in recentActivity" :key="activity.id" class="p-3 bg-gray-50 rounded-lg">
          <div class="flex items-start">
            <div class="mr-3">
              <div v-if="activity.type === 'new_post'" class="bg-green-100 p-2 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <div v-else-if="activity.type === 'comment'" class="bg-blue-100 p-2 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <div v-else-if="activity.type === 'like'" class="bg-red-100 p-2 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
            </div>
            <div>
              <p class="text-sm">
                <span class="font-medium text-gray-900">{{ activity.user }}</span>
                <span v-if="activity.type === 'new_post'" class="text-gray-600"> posted </span>
                <span v-else-if="activity.type === 'comment'" class="text-gray-600"> commented on </span>
                <span v-else-if="activity.type === 'like'" class="text-gray-600"> liked </span>
                <span class="font-medium">{{ activity.title }}</span>
              </p>
              <p class="text-xs text-gray-500 mt-1">{{ activity.time }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Top Contributors -->
    <div class="mb-8">
      <h3 class="font-semibold text-lg mb-4 text-gray-800">Top Contributors</h3>
      <div class="space-y-3">
        <div v-for="contributor in topContributors" :key="contributor.name" class="flex items-center justify-between p-2 hover:bg-green-50 rounded-lg">
          <div class="flex items-center">
            <img :src="contributor.avatar" :alt="contributor.name" class="w-8 h-8 rounded-full mr-3" />
            <span class="font-medium text-gray-900">{{ contributor.name }}</span>
          </div>
          <span class="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">{{ contributor.posts }} posts</span>
        </div>
      </div>
    </div>

    <!-- Popular Tags -->
    <div class="mb-8">
      <h3 class="font-semibold text-lg mb-4 text-gray-800">Popular Tags</h3>
      <div class="flex flex-wrap gap-2">
        <span v-for="tag in popularTags" :key="tag.name" 
          class="px-2 py-1 bg-gray-100 hover:bg-green-100 text-gray-700 hover:text-green-800 rounded-full text-sm cursor-pointer transition-colors flex items-center">
          {{ tag.name }}
          <span class="ml-1 bg-gray-200 text-gray-700 px-1.5 py-0.5 rounded-full text-xs">{{ tag.count }}</span>
        </span>
      </div>
    </div>

  </aside>
</template>