<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue';
import NavBar from '../../components/Main/NavBar.vue';

// State management
const showModal = ref(false);
const selectedCategory = ref('all');
const searchQuery = ref('');
const currentPage = ref(1);
const itemsPerPage = ref(5);

// Form state
const newTopic = reactive({
  title: '',
  category: '',
  tags: '',
  content: '',
  pinned: false
});

// Sample data
const topics = ref([
  {
    id: 1,
    title: 'Best Practices for Cattle Nutrition During Winter',
    author: 'RanchHand',
    postedTime: '2 hours ago',
    category: 'cattle',
    tags: ['cattle', 'nutrition', 'winter-care'],
    replies: 24,
    views: 1352,
    pinned: true,
    emoji: '🐄'
  },
  {
    id: 2,
    title: 'Egg Production in Free-Range Systems',
    author: 'ChickenFarmer',
    postedTime: '1 day ago',
    category: 'poultry',
    tags: ['poultry', 'eggs', 'free-range'],
    replies: 18,
    views: 876,
    pinned: false,
    emoji: '🐔'
  },
  {
    id: 3,
    title: 'Sustainable Wool Production Methods',
    author: 'SheepWhisperer',
    postedTime: '3 days ago',
    category: 'sheep',
    tags: ['sheep', 'wool', 'sustainable'],
    replies: 12,
    views: 645,
    pinned: false,
    emoji: '🐑'
  },
  {
    id: 4,
    title: 'Managing Swine Reproduction Cycles',
    author: 'PigExpert',
    postedTime: '1 week ago',
    category: 'swine',
    tags: ['swine', 'breeding', 'reproduction'],
    replies: 31,
    views: 1289,
    pinned: false,
    emoji: '🐖'
  },
  {
    id: 5,
    title: 'Goat Milk Quality Improvement Tips',
    author: 'GoatDairy',
    postedTime: '2 weeks ago',
    category: 'goats',
    tags: ['goats', 'dairy', 'milk-quality'],
    replies: 27,
    views: 932,
    pinned: false,
    emoji: '🐐'
  }
]);

// Computed topics based on filters
const filteredTopics = computed(() => {
  let result = [...topics.value];
  
  // Filter by category
  if (selectedCategory.value !== 'all') {
    result = result.filter(topic => topic.category === selectedCategory.value);
  }
  
  // Filter by search query
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(topic => 
      topic.title.toLowerCase().includes(query) || 
      topic.tags.some(tag => tag.toLowerCase().includes(query))
    );
  }
  
  // Sort pinned topics first
  result.sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return 0;
  });
  
  return result;
});

// Pagination
const totalPages = computed(() => {
  return Math.ceil(filteredTopics.value.length / itemsPerPage.value);
});

const paginatedTopics = computed(() => {
  const startIdx = (currentPage.value - 1) * itemsPerPage.value;
  const endIdx = startIdx + itemsPerPage.value;
  return filteredTopics.value.slice(startIdx, endIdx);
});

// Functions
const openModal = () => {
  showModal.value = true;
  // Reset form
  Object.assign(newTopic, {
    title: '',
    category: '',
    tags: '',
    content: '',
    pinned: false
  });
};

const closeModal = () => {
  showModal.value = false;
};

const createTopic = () => {
  // Validate form
  if (!newTopic.title.trim() || !newTopic.category || !newTopic.content.trim()) {
    alert('Please fill in all required fields.');
    return;
  }
  
  // Create new topic
  const tagArray = newTopic.tags
    .split(',')
    .map(tag => tag.trim())
    .filter(tag => tag);
    
  const newTopicObj = {
    id: topics.value.length + 1,
    title: newTopic.title,
    author: 'CurrentUser', // In a real app, this would be the logged-in user
    postedTime: 'Just now',
    category: newTopic.category,
    tags: tagArray.length > 0 ? tagArray : [newTopic.category],
    replies: 0,
    views: 1,
    pinned: false, // Start unpinned, moderator can pin later
    emoji: getCategoryEmoji(newTopic.category)
  };
  
  // Add to topics list
  topics.value.unshift(newTopicObj);
  
  // Close modal
  closeModal();
};

const getCategoryEmoji = (category: keyof typeof emojiMap) => {
  const emojiMap: { [key: string]: string } = {
    'cattle': '🐄',
    'poultry': '🐔',
    'sheep': '🐑',
    'swine': '🐖',
    'goats': '🐐',
    'horses': '🐎'
  };
  
  return emojiMap[category as keyof typeof emojiMap] || '🐾';
};

const setCategory = (category: string) => {
  selectedCategory.value = category;
  currentPage.value = 1; // Reset to first page when changing filters
};

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
};

const resetFilters = () => {
  selectedCategory.value = 'all';
  searchQuery.value = '';
  currentPage.value = 1;
};

const incrementViews = (topicId: number) => {
  const topic = topics.value.find(t => t.id === topicId);
  if (topic) {
    topic.views++;
  }
};

onMounted(() => {
  // Initialize any data or fetch from an API
  console.log('Livestock Forum component mounted');
});
</script>

<template>
  <div class="min-h-screen bg-gradient-to-b from-green-50 to-green-100 flex flex-col">
    <!-- Fixed Navbar -->
    <div class="sticky top-0 z-50 w-full">
      <NavBar />
    </div>
    
    <!-- Hero section with parallax effect -->
    <div class="relative bg-gradient-to-r from-green-800 to-green-700 py-12 px-4 mb-8 shadow-xl overflow-hidden">
      <div class="container mx-auto max-w-full px-4 sm:px-6 lg:px-8 relative z-10">
        <h1 class="text-5xl font-bold text-white mb-3 tracking-tight">Livestock Forum</h1>
        <p class="text-green-100 text-xl max-w-3xl leading-relaxed">Connect with fellow farmers, ranchers, and livestock enthusiasts to share knowledge and best practices in animal husbandry.</p>
      </div>
      <!-- Decorative farm silhouette with parallax effect -->
      <div class="absolute bottom-0 right-0 text-green-700 opacity-20 text-9xl transform translate-y-1/4 select-none">
        🏞️🐄🐑🐖🐔🐐
      </div>
      <!-- Subtle pattern overlay -->
      <div class="absolute inset-0 bg-green-900 opacity-10" style="background-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIj48cGF0aCBkPSJNMzYgMzRjMCAxIDEgMiAyIDJoMmMxIDAgMi0xIDItMnYtNGgtNnY0em0tOCAwYzAgMSAxIDIgMiAyaDJjMSAwIDItMSAyLTJ2LTRoLTZ2NHptLTE4LTRoMnYtNGgtMnY0em0xOC0xMGMtMSAwLTIgMS0yIDJ2NGg2di00YzAtMS0xLTItMi0yaC0yem04IDBjLTEgMC0yIDEtMiAydjRoNnYtNGMwLTEtMS0yLTItMmgtMnptMTggNnYtNGgtMnY0aDJ6Ii8+PC9zdmc+');"></div>
    </div>
    
    <div class="container mx-auto px-4 max-w-full sm:px-6 lg:px-8 flex-grow">
      <div class="flex flex-col lg:flex-row gap-8">
        <!-- Sidebar -->
        <div class="lg:w-1/4 space-y-6">
          <!-- Quick stats card -->
          <div class="bg-white rounded-xl shadow-lg p-5 border border-green-100">
            <h3 class="font-bold text-lg text-green-800 mb-4 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Forum Statistics
            </h3>
            <div class="grid grid-cols-3 gap-4">
              <div class="text-center p-3 bg-green-50 rounded-lg">
                <div class="text-green-800 font-bold text-2xl">{{ topics.length }}</div>
                <div class="text-xs text-gray-600 font-medium">Topics</div>
              </div>
              <div class="text-center p-3 bg-green-50 rounded-lg">
                <div class="text-green-800 font-bold text-2xl">2,568</div>
                <div class="text-xs text-gray-600 font-medium">Members</div>
              </div>
              <div class="text-center p-3 bg-green-50 rounded-lg">
                <div class="text-green-800 font-bold text-2xl">47</div>
                <div class="text-xs text-gray-600 font-medium">Online</div>
              </div>
            </div>
          </div>
          
          <!-- Categories -->
          <div class="bg-white rounded-xl shadow-lg overflow-hidden border border-green-100">
            <div class="bg-gradient-to-r from-green-700 to-green-600 text-white px-5 py-3">
              <h3 class="font-bold">Livestock Categories</h3>
            </div>
            <div class="p-4 space-y-1">
              <button 
                v-for="category in ['all', 'cattle', 'poultry', 'sheep', 'swine', 'goats', 'horses']" 
                :key="category"
                @click="setCategory(category)"
                :class="[
                  'w-full text-left px-4 py-2 rounded-lg transition-colors duration-200 flex items-center',
                  selectedCategory === category ? 'bg-green-600 text-white font-medium' : 'bg-green-100 text-green-800 font-medium hover:bg-green-200'
                ]"
              >
                <span class="mr-2 text-xl">
                  {{ category === 'all' ? '🐾' : 
                     category === 'cattle' ? '🐄' : 
                     category === 'poultry' ? '🐔' : 
                     category === 'sheep' ? '🐑' : 
                     category === 'swine' ? '🐖' : 
                     category === 'goats' ? '🐐' : 
                     category === 'horses' ? '🐎' : '🐾' }}
                </span>
                {{ category === 'all' ? 'All Animals' : category.charAt(0).toUpperCase() + category.slice(1) }}
              </button>
            </div>
          </div>
          
          <!-- Upcoming Events Card -->
          <div class="bg-white rounded-xl shadow-lg overflow-hidden border border-green-100">
            <div class="bg-gradient-to-r from-green-700 to-green-600 text-white px-5 py-3">
              <h3 class="font-bold">Upcoming Events</h3>
            </div>
            <div class="p-4 space-y-3">
              <a href="#" class="block hover:bg-green-50 p-3 rounded-lg transition-colors duration-150">
                <div class="flex items-center mb-1">
                  <span class="text-amber-500 mr-2">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </span>
                  <div class="font-medium text-green-800">Annual Livestock Expo</div>
                </div>
                <div class="text-sm text-gray-600 ml-7">May 15-17, 2025 • Virtual</div>
              </a>
              <a href="#" class="block hover:bg-green-50 p-3 rounded-lg transition-colors duration-150">
                <div class="flex items-center mb-1">
                  <span class="text-amber-500 mr-2">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </span>
                  <div class="font-medium text-green-800">Cattle Breeders Conference</div>
                </div>
                <div class="text-sm text-gray-600 ml-7">June 10, 2025 • Chicago, IL</div>
              </a>
              <a href="#" class="block hover:bg-green-50 p-3 rounded-lg transition-colors duration-150">
                <div class="flex items-center mb-1">
                  <span class="text-amber-500 mr-2">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </span>
                  <div class="font-medium text-green-800">Sustainable Farming Workshop</div>
                </div>
                <div class="text-sm text-gray-600 ml-7">July 5, 2025 • Online</div>
              </a>
            </div>
          </div>
        </div>
        
        <!-- Main content area -->
        <div class="lg:w-3/4 space-y-6">
          <!-- Actions Bar -->
          <div class="flex flex-col sm:flex-row justify-between items-center gap-4 mb-2">
            <!-- Search -->
            <div class="relative w-full sm:max-w-md">
              <input 
                type="text" 
                placeholder="Search livestock topics..." 
                v-model="searchQuery"
                class="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
              <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
            
            <!-- New Topic Button -->
            <button 
              @click="openModal"
              class="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-medium rounded-xl shadow-md transition duration-200 flex items-center justify-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
              Start New Discussion
            </button>
          </div>
          
          <!-- Topic List -->
          <div class="bg-white rounded-xl shadow-lg overflow-hidden border border-green-100">
            <div class="bg-gradient-to-r from-green-700 to-green-600 text-white px-6 py-4">
              <h2 class="text-xl font-bold flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                </svg>
                Discussion Topics
              </h2>
            </div>
            
            <!-- Topic Items -->
            <div v-for="topic in paginatedTopics" :key="topic.id" class="border-b border-gray-200 hover:bg-green-50 transition-colors duration-150">
              <div class="p-5 sm:p-6 grid grid-cols-12 gap-4 items-center">
                <div class="col-span-12 md:col-span-7">
                  <div class="flex items-start">
                    <div class="flex-shrink-0 mr-4">
                      <div class="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center text-2xl overflow-hidden shadow-inner">
                        <span class="text-3xl">{{ topic.emoji }}</span>
                      </div>
                    </div>
                    <div>
                      <div class="flex items-center">
                        <span v-if="topic.pinned" class="mr-2 text-amber-500">
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                          </svg>
                        </span>
                        <a href="#" class="text-xl font-medium text-green-800 hover:text-green-600 hover:underline transition-colors" @click="incrementViews(topic.id)">{{ topic.title }}</a>
                      </div>
                      <div class="mt-2 text-sm text-gray-600">
                        Posted by <span class="font-medium text-gray-800">{{ topic.author }}</span> • {{ topic.postedTime }}
                      </div>
                      <div class="mt-3 flex flex-wrap gap-2">
                        <span 
                          v-for="tag in topic.tags" 
                          :key="tag" 
                          class="px-3 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 hover:bg-green-200 transition-colors cursor-pointer"
                          @click="searchQuery = tag"
                        >
                          {{ tag }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col-span-4 md:col-span-2 flex items-center justify-center">
                  <div class="text-center">
                    <span class="block font-medium text-xl text-green-700">{{ topic.replies }}</span>
                    <span class="text-xs text-gray-500 font-medium">Replies</span>
                  </div>
                </div>
                <div class="col-span-4 md:col-span-1 flex items-center justify-center">
                  <div class="text-center">
                    <span class="block text-gray-700">{{ topic.views }}</span>
                    <span class="text-xs text-gray-500 font-medium">Views</span>
                  </div>
                </div>
                <div class="col-span-4 md:col-span-2 flex items-center justify-end">
                  <a href="#" class="px-4 py-2 text-sm font-medium text-green-700 bg-green-50 hover:bg-green-100 rounded-lg transition-colors">
                    Read More
                  </a>
                </div>
              </div>
            </div>

            <!-- Empty State -->
            <div v-if="paginatedTopics.length === 0" class="px-6 py-16 text-center">
              <div class="text-6xl mb-6 flex justify-center">🔍🐄</div>
              <h3 class="text-xl font-medium text-gray-900">No livestock topics found</h3>
              <p class="mt-2 text-gray-600 max-w-md mx-auto">Try adjusting your search or filter to find what you're looking for.</p>
              <button @click="resetFilters" class="mt-6 px-5 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 transition-colors">
                Show All Topics
              </button>
            </div>
          </div>
          
          <!-- Featured Resources Section -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="bg-white rounded-xl shadow-lg overflow-hidden border border-green-100">
              <div class="bg-gradient-to-r from-green-700 to-green-600 text-white px-5 py-3 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
                <h3 class="font-bold">Veterinary Resources</h3>
              </div>
              <div class="p-4 space-y-2">
                <a href="#" class="block hover:bg-green-50 p-3 rounded-lg transition-colors duration-150">
                  <div class="font-medium text-green-800">Common Livestock Diseases</div>
                  <div class="text-sm text-gray-600">Recognition and prevention guide</div>
                </a>
                <a href="#" class="block hover:bg-green-50 p-3 rounded-lg transition-colors duration-150">
                  <div class="font-medium text-green-800">Vaccination Schedules</div>
                  <div class="text-sm text-gray-600">By species and age</div>
                </a>
                <a href="#" class="block hover:bg-green-50 p-3 rounded-lg transition-colors duration-150">
                  <div class="font-medium text-green-800">Emergency Care</div>
                  <div class="text-sm text-gray-600">First aid for farm animals</div>
                </a>
              </div>
            </div>
            
            <div class="bg-white rounded-xl shadow-lg overflow-hidden border border-green-100">
              <div class="bg-gradient-to-r from-green-700 to-green-600 text-white px-5 py-3 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <h3 class="font-bold">Nutrition & Feeding</h3>
              </div>
              <div class="p-4 space-y-2">
                <a href="#" class="block hover:bg-green-50 p-3 rounded-lg transition-colors duration-150">
                  <div class="font-medium text-green-800">Feed Formulation</div>
                  <div class="text-sm text-gray-600">Balanced diets for optimal growth</div>
                </a>
                <a href="#" class="block hover:bg-green-50 p-3 rounded-lg transition-colors duration-150">
                  <div class="font-medium text-green-800">Pasture Management</div>
                  <div class="text-sm text-gray-600">Rotational grazing techniques</div>
                </a>
                <a href="#" class="block hover:bg-green-50 p-3 rounded-lg transition-colors duration-150">
                  <div class="font-medium text-green-800">Water Requirements</div>
                  <div class="text-sm text-gray-600">By species and climate</div>
                </a>
              </div>
            </div>
          </div>
          
          <!-- Pagination -->
          <div class="flex justify-between items-center py-4">
            <div class="text-sm text-gray-700 font-medium">
              Showing <span class="font-bold text-green-800">{{ Math.min(paginatedTopics.length, itemsPerPage) }}</span> of <span class="font-bold text-green-800">{{ filteredTopics.length }}</span> topics
            </div>
            <div class="flex space-x-2">
                <button 
  @click="prevPage"
  class="px-4 py-2 rounded-lg border border-green-300 hover:bg-green-100 transition-colors"
  :disabled="currentPage <= 1"
  :class="{'opacity-50 cursor-not-allowed': currentPage <= 1}"
>
  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
  </svg>
</button>
<button 
  @click="nextPage"
  class="px-4 py-2 rounded-lg border border-green-300 hover:bg-green-100 transition-colors"
  :disabled="currentPage >= totalPages"
  :class="{'opacity-50 cursor-not-allowed': currentPage >= totalPages}"
>
  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
  </svg>
</button>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Footer -->
    <footer class="bg-green-800 text-green-100 py-8 mt-12">
      <div class="container mx-auto px-4 max-w-full sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h4 class="font-bold text-white text-lg mb-4">Livestock Forum</h4>
            <p class="text-green-200 text-sm">
              A community for farmers, ranchers, and livestock enthusiasts to connect and share knowledge about animal husbandry best practices.
            </p>
          </div>
          <div>
            <h4 class="font-bold text-white text-lg mb-4">Quick Links</h4>
            <ul class="space-y-2">
              <li><a href="#" class="text-green-200 hover:text-white transition-colors">Home</a></li>
              <li><a href="#" class="text-green-200 hover:text-white transition-colors">Recent Discussions</a></li>
              <li><a href="#" class="text-green-200 hover:text-white transition-colors">Resources</a></li>
              <li><a href="#" class="text-green-200 hover:text-white transition-colors">Events</a></li>
            </ul>
          </div>
          <div>
            <h4 class="font-bold text-white text-lg mb-4">Categories</h4>
            <ul class="space-y-2">
              <li><a href="#" class="text-green-200 hover:text-white transition-colors">Cattle</a></li>
              <li><a href="#" class="text-green-200 hover:text-white transition-colors">Poultry</a></li>
              <li><a href="#" class="text-green-200 hover:text-white transition-colors">Sheep</a></li>
              <li><a href="#" class="text-green-200 hover:text-white transition-colors">Swine</a></li>
              <li><a href="#" class="text-green-200 hover:text-white transition-colors">Goats</a></li>
            </ul>
          </div>
          <div>
            <h4 class="font-bold text-white text-lg mb-4">Connect With Us</h4>
            <div class="flex space-x-4">
              <a href="#" class="text-green-200 hover:text-white transition-colors">
                <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fill-rule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clip-rule="evenodd"></path>
                </svg>
              </a>
              <a href="#" class="text-green-200 hover:text-white transition-colors">
                <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                </svg>
              </a>
              <a href="#" class="text-green-200 hover:text-white transition-colors">
                <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fill-rule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clip-rule="evenodd"></path>
                </svg>
              </a>
            </div>
          </div>
        </div>
        <div class="border-t border-green-700 mt-8 pt-8 text-center text-sm text-green-300">
          &copy; 2025 Livestock Forum. All rights reserved.
        </div>
      </div>
    </footer>
    
    <!-- New Topic Modal -->
    <div v-if="showModal" class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <!-- Background overlay -->
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" @click="closeModal"></div>

        <!-- Modal panel -->
        <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                  Create New Topic
                </h3>
                <div class="mt-4 space-y-4">
                  <div>
                    <label for="topic-title" class="block text-sm font-medium text-gray-700">Title</label>
                    <input 
                      type="text" 
                      id="topic-title" 
                      v-model="newTopic.title"
                      class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                      placeholder="Enter an engaging title"
                    />
                  </div>
                  <div>
                    <label for="topic-category" class="block text-sm font-medium text-gray-700">Category</label>
                    <select 
                      id="topic-category" 
                      v-model="newTopic.category"
                      class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                    >
                      <option value="" disabled selected>Select a category</option>
                      <option value="cattle">Cattle</option>
                      <option value="poultry">Poultry</option>
                      <option value="sheep">Sheep</option>
                      <option value="swine">Swine</option>
                      <option value="goats">Goats</option>
                      <option value="horses">Horses</option>
                    </select>
                  </div>
                  <div>
                    <label for="topic-tags" class="block text-sm font-medium text-gray-700">Tags (comma separated)</label>
                    <input 
                      type="text" 
                      id="topic-tags" 
                      v-model="newTopic.tags"
                      class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                      placeholder="nutrition, breeding, health, etc."
                    />
                  </div>
                  <div>
                    <label for="topic-content" class="block text-sm font-medium text-gray-700">Content</label>
                    <textarea 
                      id="topic-content" 
                      v-model="newTopic.content"
                      rows="5"
                      class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                      placeholder="Share your knowledge or ask your question..."
                    ></textarea>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button 
              type="button" 
              @click="createTopic"
              class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Post Topic
            </button>
            <button 
              type="button" 
              @click="closeModal"
              class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>