<script setup lang="ts">
import { ref, onMounted } from 'vue';
import router from '../../router';

// Type definitions
interface LivestockPost {
  id: number;
  type: string;
  breed: string;
  age: number;
  weight: number;
  health: string;
  price: number;
  description: string;
  imageUrl: string;
  date: string;
  status: 'available' | 'sold' | 'reserved';
}

// State
const livestockPosts = ref<LivestockPost[]>([]);
const loading = ref(true);
const filterStatus = ref('all');
const searchTerm = ref('');
const showEditForm = ref(false);
const currentPost = ref<LivestockPost | null>(null);

// Form data for edit livestock
const formData = ref({
  type: '',
  breed: '',
  age: null as number | null,
  weight: null as number | null,
  health: '',
  price: null as number | null,
  description: '',
  imageUrl: '',
  status: 'available' as 'available' | 'sold' | 'reserved'
});

// Mock data - In a real app, this would come from an API
const mockLivestockData: LivestockPost[] = [
  {
    id: 1,
    type: 'Cattle',
    breed: 'Angus',
    age: 3,
    weight: 1200,
    health: 'Excellent',
    price: 1200,
    description: 'Healthy Angus bull, grass-fed and ready for breeding.',
    imageUrl: '/api/placeholder/400/300',
    date: '2025-05-01',
    status: 'available'
  },
  {
    id: 2, 
    type: 'Sheep',
    breed: 'Merino',
    age: 2,
    weight: 150,
    health: 'Good',
    price: 350,
    description: 'Quality wool producer, vaccinated and dewormed regularly.',
    imageUrl: '/api/placeholder/400/300',
    date: '2025-05-03',
    status: 'reserved'  
  },
  {
    id: 3,
    type: 'Poultry',
    breed: 'Rhode Island Red',
    age: 1,
    weight: 6,
    health: 'Good',
    price: 15,
    description: 'Egg-laying hens, currently producing 5-6 eggs weekly.',
    imageUrl: '/api/placeholder/400/300',
    date: '2025-05-10',
    status: 'available'
  },
  {
    id: 4,
    type: 'Goat',
    breed: 'Boer',
    age: 2,
    weight: 100,
    health: 'Excellent',
    price: 300,
    description: 'Strong meat goat with good genetics.',
    imageUrl: '/api/placeholder/400/300',
    date: '2025-04-28',
    status: 'sold'
  }
];

// Navigation functions
const goBack = () => {
  router.back();
};

// Navigate to Add Livestock Form
const goToAddLivestockForm = () => {
  router.push('/farmer/PostLivestockForms');
};

// Fetch livestock data (simulated)
const fetchLivestock = () => {
  loading.value = true;
  // Simulate API call delay
  setTimeout(() => {
    livestockPosts.value = mockLivestockData;
    loading.value = false;
  }, 500);
};

// Filter functions
const filteredPosts = () => {
  return livestockPosts.value.filter(post => {
    // Filter by status
    const statusMatch = filterStatus.value === 'all' || post.status === filterStatus.value;
    // Filter by search term
    const searchMatch = searchTerm.value === '' || 
      post.type.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
      post.breed.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
      post.description.toLowerCase().includes(searchTerm.value.toLowerCase());
    
    return statusMatch && searchMatch;
  });
};

// Edit livestock post
const editLivestockPost = (post: LivestockPost) => {
  currentPost.value = post;
  
  // Set form data to selected post
  formData.value = {
    type: post.type,
    breed: post.breed,
    age: post.age,
    weight: post.weight,
    health: post.health,
    price: post.price,
    description: post.description,
    imageUrl: post.imageUrl,
    status: post.status
  };
  
  showEditForm.value = true;
};

// Update livestock post
const updateLivestockPost = () => {
  if (!currentPost.value) return;
  
  // Find post index
  const index = livestockPosts.value.findIndex(p => p.id === currentPost.value?.id);
  if (index !== -1) {
    // Update post
    livestockPosts.value[index] = {
      ...livestockPosts.value[index],
      type: formData.value.type,
      breed: formData.value.breed,
      age: formData.value.age || 0,
      weight: formData.value.weight || 0,
      health: formData.value.health,
      price: formData.value.price || 0,
      description: formData.value.description,
      imageUrl: formData.value.imageUrl,
      status: formData.value.status
    };
  }
  
  // Reset form
  resetForm();
  showEditForm.value = false;
  currentPost.value = null;
};

// Delete livestock post
const deleteLivestockPost = (id: number) => {
  if (confirm('Are you sure you want to delete this livestock post?')) {
    livestockPosts.value = livestockPosts.value.filter(post => post.id !== id);
  }
};

// Update status
const updateStatus = (post: LivestockPost, newStatus: 'available' | 'sold' | 'reserved') => {
  const index = livestockPosts.value.findIndex(p => p.id === post.id);
  if (index !== -1) {
    livestockPosts.value[index].status = newStatus;
  }
};

// Reset form
const resetForm = () => {
  formData.value = {
    type: '',
    breed: '',
    age: null,
    weight: null,
    health: '',
    price: null,
    description: '',
    imageUrl: '',
    status: 'available'
  };
};

// Get status badge color
const getStatusColor = (status: string) => {
  switch (status) {
    case 'available': return 'bg-green-100 text-green-800';
    case 'reserved': return 'bg-yellow-100 text-yellow-800';
    case 'sold': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

// Load livestock data when component mounts
onMounted(() => {
  fetchLivestock();
});
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="flex items-center justify-between mb-6">
      <!-- Go Back Button -->
      <button @click="goBack" class="text-sm text-gray-600 hover:text-gray-800 flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24"
          stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        Go Back
      </button>
      
      <h1 class="text-2xl font-bold text-gray-900">My Livestock Posts</h1>
      
      <!-- Changed to redirect to form page instead of showing modal -->
      <button @click="goToAddLivestockForm" class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Add Livestock
      </button>
    </div>
    
    <!-- Filters and Search -->
    <div class="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
      <div class="flex items-center space-x-4 mb-4 md:mb-0">
        <span class="text-gray-700">Filter by:</span>
        <select v-model="filterStatus" class="border-gray-300 rounded-md shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50">
          <option value="all">All</option>
          <option value="available">Available</option>
          <option value="reserved">Reserved</option>
          <option value="sold">Sold</option>
        </select>
      </div>
      
      <div class="relative">
        <input 
          v-model="searchTerm"
          type="text" 
          placeholder="Search by type, breed or description..." 
          class="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full md:w-80 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
        <div class="absolute left-3 top-2.5 text-gray-400">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>
    </div>
    
    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center my-12">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
    </div>
    
    <!-- No Results -->
    <div v-else-if="filteredPosts().length === 0" class="text-center py-12">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <h3 class="mt-4 text-lg font-medium text-gray-900">No livestock posts found</h3>
      <p class="mt-1 text-gray-500">Try adjusting your filters or add your first livestock post.</p>
    </div>
    
    <!-- Livestock Grid -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="post in filteredPosts()" :key="post.id" class="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
        <div class="relative">
          <img :src="post.imageUrl" :alt="post.breed" class="w-full h-48 object-cover">
          <span :class="[getStatusColor(post.status), 'absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-medium capitalize']">
            {{ post.status }}
          </span>
        </div>
        
        <div class="p-4">
          <div class="flex justify-between items-start">
            <div>
              <h2 class="text-lg font-semibold text-gray-900">{{ post.type }} - {{ post.breed }}</h2>
              <p class="text-gray-600 text-sm">Posted on {{ post.date }}</p>
            </div>
            <span class="text-lg font-bold text-green-600">${{ post.price }}</span>
          </div>
          
          <div class="mt-4 grid grid-cols-2 gap-2 text-sm">
            <div class="flex items-center">
              <span class="text-gray-500">Age:</span>
              <span class="ml-1 font-medium">{{ post.age }} years</span>
            </div>
            <div class="flex items-center">
              <span class="text-gray-500">Weight:</span>
              <span class="ml-1 font-medium">{{ post.weight }} lbs</span>
            </div>
            <div class="flex items-center col-span-2">
              <span class="text-gray-500">Health:</span>
              <span class="ml-1 font-medium">{{ post.health }}</span>
            </div>
          </div>
          
          <p class="mt-3 text-gray-700 text-sm">{{ post.description }}</p>
          
          <div class="mt-4 pt-4 border-t border-gray-200">
            <div class="flex flex-wrap justify-between">
              <div class="flex space-x-2 mb-2">
                <button 
                  v-if="post.status !== 'available'"
                  @click="updateStatus(post, 'available')" 
                  class="text-xs bg-green-100 text-green-800 px-2 py-1 rounded hover:bg-green-200">
                  Mark Available
                </button>
                <button 
                  v-if="post.status !== 'reserved'"
                  @click="updateStatus(post, 'reserved')" 
                  class="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded hover:bg-yellow-200">
                  Mark Reserved
                </button>
                <button 
                  v-if="post.status !== 'sold'"
                  @click="updateStatus(post, 'sold')" 
                  class="text-xs bg-red-100 text-red-800 px-2 py-1 rounded hover:bg-red-200">
                  Mark Sold
                </button>
              </div>
              
              <div class="flex space-x-2">
                <button @click="editLivestockPost(post)" class="text-blue-600 hover:text-blue-800">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button @click="deleteLivestockPost(post.id)" class="text-red-600 hover:text-red-800">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Edit Livestock Modal -->
    <div v-if="showEditForm" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-full max-w-2xl max-h-screen overflow-y-auto">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-bold">Edit Livestock</h2>
          <button @click="showEditForm = false" class="text-gray-500 hover:text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <form @submit.prevent="updateLivestockPost" class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="col-span-2 md:col-span-1">
            <label class="block text-sm font-medium text-gray-700">Type *</label>
            <select v-model="formData.type" required class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500">
              <option value="Cattle">Cattle</option>
              <option value="Sheep">Sheep</option>
              <option value="Goat">Goat</option>
              <option value="Poultry">Poultry</option>
              <option value="Pig">Pig</option>
              <option value="Horse">Horse</option>
              <option value="Other">Other</option>
            </select>
          </div>
          
          <div class="col-span-2 md:col-span-1">
            <label class="block text-sm font-medium text-gray-700">Breed *</label>
            <input v-model="formData.breed" required type="text" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500">
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700">Age (years)</label>
            <input v-model.number="formData.age" type="number" min="0" step="0.1" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500">
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700">Weight (lbs)</label>
            <input v-model.number="formData.weight" type="number" min="0" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500">
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700">Health Status</label>
            <select v-model="formData.health" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500">
              <option value="Excellent">Excellent</option>
              <option value="Good">Good</option>
              <option value="Fair">Fair</option>
              <option value="Poor">Poor</option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700">Price ($) *</label>
            <input v-model.number="formData.price" required type="number" min="0" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500">
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700">Status</label>
            <select v-model="formData.status" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500">
              <option value="available">Available</option>
              <option value="reserved">Reserved</option>
              <option value="sold">Sold</option>
            </select>
          </div>
          
          <div class="col-span-2 md:col-span-1">
            <label class="block text-sm font-medium text-gray-700">Image URL</label>
            <input v-model="formData.imageUrl" type="text" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500">
          </div>
          
          <div class="col-span-2">
            <label class="block text-sm font-medium text-gray-700">Description</label>
            <textarea v-model="formData.description" rows="3" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"></textarea>
          </div>
          
          <div class="col-span-2 flex justify-end space-x-3 mt-4">
            <button type="button" @click="showEditForm = false" class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50">
              Cancel
            </button>
            <button type="submit" class="px-4 py-2 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              Update Livestock
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>