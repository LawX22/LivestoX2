<template>
  <div class="reviews-page bg-gray-50 py-8">
    <div class="container mx-auto px-4">
      <!-- Back button -->
      <button @click="goBack" class="flex items-center text-blue-600 hover:text-blue-800 mb-6">
        <i class="pi pi-arrow-left mr-2"></i>
        <span>Back to Listing</span>
      </button>

      <!-- Header section -->
      <div class="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
        <div class="p-6">
          <!-- Header with Rating Summary -->
          <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <h1 class="text-2xl font-semibold text-gray-800">All Reviews</h1>
            <div class="flex items-center">
              <span class="text-2xl font-bold text-gray-800 mr-2">{{ seller.rating }}</span>
              <div class="flex flex-col">
                <Rating :modelValue="seller.rating" :readonly="true" :cancel="false" :stars="5" class="mb-1" />
                <span class="text-sm text-gray-500">{{ seller.reviewCount }} reviews</span>
              </div>
            </div>
          </div>

          <!-- Rating breakdown -->
          <div class="mb-8">
            <div v-for="star in 5" :key="star" class="flex items-center mb-2">
              <div class="w-8 text-sm text-gray-600">{{ 6 - star }}</div>
              <div class="w-full bg-gray-100 rounded-full h-1.5 mx-2">
                <div class="bg-amber-400 h-1.5 rounded-full"
                  :style="{ width: `${getPercentageForStar(6 - star)}%` }">
                </div>
              </div>
              <div class="text-xs text-gray-500 w-10">
                {{ getPercentageForStar(6 - star) }}%
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Filter options -->
      <div class="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
        <div class="p-6">
          <h3 class="text-lg font-medium text-gray-800 mb-4">Filter Reviews</h3>
          <div class="flex flex-wrap gap-4">
            <div class="relative">
              <Dropdown v-model="filters.rating" :options="ratingOptions" optionLabel="name" 
                placeholder="All Ratings" class="w-40" />
            </div>
            <div class="relative">
              <Dropdown v-model="filters.sortBy" :options="sortOptions" optionLabel="name" 
                placeholder="Most Recent" class="w-40" />
            </div>
            <div class="ml-auto">
              <Button @click="resetFilters" label="Reset Filters" 
                class="p-button-outlined p-button-secondary" />
            </div>
          </div>
        </div>
      </div>

      <!-- Write a review section -->
      <div v-if="canReview" class="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
        <div class="p-6">
          <h3 class="text-lg font-medium text-gray-800 mb-4">Write a Review</h3>
          <div class="space-y-4">
            <div class="flex items-center">
              <span class="mr-2 text-gray-700">Your Rating:</span>
              <Rating v-model="newReview.rating" :cancel="false" />
            </div>
            <div>
              <label for="reviewComment" class="block text-sm font-medium text-gray-700 mb-1">
                Your Review
              </label>
              <Textarea v-model="newReview.comment" id="reviewComment" rows="4" 
                placeholder="Share your experience with this seller..." 
                class="w-full rounded-lg" />
            </div>
            <div class="flex justify-end">
              <Button @click="submitReview" label="Submit Review" 
                :disabled="!newReview.rating || !newReview.comment.trim()" 
                class="p-button-primary" />
            </div>
          </div>
        </div>
      </div>

      <!-- Reviews list -->
      <div class="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
        <div class="p-6">
          <!-- Reviews count -->
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-lg font-medium text-gray-800">
              {{ filteredReviews.length }} Reviews
            </h3>
          </div>

          <!-- Reviews list -->
          <div v-if="filteredReviews.length > 0" class="space-y-8">
            <div v-for="review in filteredReviews" :key="review.id"
              class="border-b border-gray-100 last:border-b-0 pb-8 last:pb-0">
              <div class="flex justify-between mb-3">
                <div class="flex items-center">
                  <Avatar :image="review.avatarUrl" :label="review.username?.charAt(0)"
                    shape="circle" class="mr-3" />
                  <div>
                    <div class="font-medium text-gray-800">{{ review.username }}</div>
                    <div class="text-xs text-gray-500">{{ formatDate(review.date) }}</div>
                  </div>
                </div>
                <Rating :modelValue="review.rating" :readonly="true" :cancel="false" />
              </div>
              <p class="text-gray-600 pl-12">{{ review.comment }}</p>
              
              <!-- Seller response if exists -->
              <div v-if="review.sellerResponse" 
                class="mt-4 ml-12 p-4 bg-gray-50 rounded-lg border border-gray-100">
                <div class="flex items-center mb-2">
                  <Avatar :image="seller.avatarUrl" :label="seller.name?.charAt(0)"
                    shape="circle" class="mr-3" />
                  <div>
                    <div class="font-medium text-gray-800">{{ seller.name }} <span class="text-xs font-normal text-gray-500">(Seller)</span></div>
                    <div class="text-xs text-gray-500">{{ formatDate(review.sellerResponseDate) }}</div>
                  </div>
                </div>
                <p class="text-gray-600">{{ review.sellerResponse }}</p>
              </div>
            </div>
          </div>

          <!-- Empty state -->
          <div v-else class="text-center py-12">
            <i class="pi pi-inbox text-gray-300 text-5xl mb-4"></i>
            <h4 class="text-lg font-medium text-gray-600 mb-2">No Reviews Found</h4>
            <p class="text-gray-500">
              There are no reviews matching your current filters.
            </p>
            <Button @click="resetFilters" label="Clear Filters" 
              class="p-button-outlined mt-4" />
          </div>

          <!-- Pagination -->
          <div v-if="filteredReviews.length > 0" class="flex justify-center mt-8">
            <Paginator :rows="10" :totalRecords="filteredReviews.length"
              v-model:first="paginationFirst" :rowsPerPageOptions="[10, 20, 50]" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

// Sample data (would be replaced by API calls)
const seller = ref({
  id: 'seller123',
  name: 'Jane Smith',
  avatarUrl: null,
  rating: 4.8,
  reviewCount: 124,
  responseTime: 'Within 1 hour',
  memberSince: 'March 2022',
  totalListings: 48
});

const reviews = ref([
  {
    id: 1,
    username: 'Michael Johnson',
    avatarUrl: null,
    date: new Date('2025-04-15'),
    rating: 5,
    comment: 'Excellent service! The product arrived on time and was exactly as described. Very satisfied with my purchase and would definitely buy from this seller again.',
    sellerResponse: 'Thank you for your feedback! It was a pleasure doing business with you.',
    sellerResponseDate: new Date('2025-04-16')
  },
  {
    id: 2,
    username: 'Sarah Lee',
    avatarUrl: null,
    date: new Date('2025-04-10'),
    rating: 4,
    comment: 'Good quality product and fast shipping. Only giving 4 stars because the packaging was slightly damaged, but the product itself was fine.',
    sellerResponse: null,
    sellerResponseDate: null
  },
  {
    id: 3,
    username: 'David Chen',
    avatarUrl: null,
    date: new Date('2025-04-05'),
    rating: 5,
    comment: 'Outstanding service and communication. The seller was very helpful with my questions and the item is perfect!',
    sellerResponse: 'Thanks so much for your kind words! Hope to see you again soon.',
    sellerResponseDate: new Date('2025-04-05')
  },
  {
    id: 4,
    username: 'Emily Adams',
    avatarUrl: null,
    date: new Date('2025-03-28'),
    rating: 5,
    comment: 'Fantastic experience from start to finish. Fast shipping and excellent quality.',
    sellerResponse: null,
    sellerResponseDate: null
  },
  {
    id: 5,
    username: 'Robert Kim',
    avatarUrl: null,
    date: new Date('2025-03-22'),
    rating: 3,
    comment: 'Product is decent but took longer than expected to arrive. Communication could have been better regarding the shipping delay.',
    sellerResponse: 'We apologize for the delay in shipping. We had some unexpected issues with our carrier. We appreciate your feedback and will work on improving our communication.',
    sellerResponseDate: new Date('2025-03-23')
  }
]);

// Pagination
const paginationFirst = ref(0);

// Filter options
const ratingOptions = [
  { name: 'All Ratings', value: 0 },
  { name: '5 Stars', value: 5 },
  { name: '4 Stars', value: 4 },
  { name: '3 Stars', value: 3 },
  { name: '2 Stars', value: 2 },
  { name: '1 Star', value: 1 }
];

const sortOptions = [
  { name: 'Most Recent', value: 'date-desc' },
  { name: 'Oldest First', value: 'date-asc' },
  { name: 'Highest Rating', value: 'rating-desc' },
  { name: 'Lowest Rating', value: 'rating-asc' }
];

const filters = ref({
  rating: { name: 'All Ratings', value: 0 },
  sortBy: { name: 'Most Recent', value: 'date-desc' }
});

// New review form
const newReview = ref({
  rating: 0,
  comment: ''
});

// Computed properties
const filteredReviews = computed(() => {
  let result = [...reviews.value];
  
  // Filter by rating
  if (filters.value.rating.value > 0) {
    result = result.filter(review => review.rating === filters.value.rating.value);
  }
  
  // Sort
  switch(filters.value.sortBy.value) {
    case 'date-desc':
      result.sort((a, b) => new Date(b.date) - new Date(a.date));
      break;
    case 'date-asc':
      result.sort((a, b) => new Date(a.date) - new Date(b.date));
      break;
    case 'rating-desc':
      result.sort((a, b) => b.rating - a.rating);
      break;
    case 'rating-asc':
      result.sort((a, b) => a.rating - b.rating);
      break;
  }
  
  return result;
});

// Flag to check if user can review
const canReview = ref(true); // This would normally be determined by checking if user has purchased and hasn't reviewed

// Methods
const formatDate = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const getPercentageForStar = (star) => {
  const count = reviews.value.filter(r => r.rating === star).length;
  return Math.round((count / reviews.value.length) * 100) || 0;
};

const resetFilters = () => {
  filters.value = {
    rating: { name: 'All Ratings', value: 0 },
    sortBy: { name: 'Most Recent', value: 'date-desc' }
  };
};

const submitReview = () => {
  // This would normally send the review to an API
  const newReviewObj = {
    id: reviews.value.length + 1,
    username: 'You', // Would be the current user's name
    avatarUrl: null,
    date: new Date(),
    rating: newReview.value.rating,
    comment: newReview.value.comment,
    sellerResponse: null,
    sellerResponseDate: null
  };
  
  reviews.value.unshift(newReviewObj);
  seller.value.reviewCount++;
  
  // Recalculate average rating
  const totalRating = reviews.value.reduce((sum, review) => sum + review.rating, 0);
  seller.value.rating = (totalRating / reviews.value.length).toFixed(1);
  
  // Reset form
  newReview.value = {
    rating: 0,
    comment: ''
  };
  
  // Hide the review form (assuming user can only review once)
  canReview.value = false;
};

const goBack = () => {
  router.back();
};

onMounted(() => {
  // This would normally fetch the data from an API
  console.log('Reviews page mounted');
});
</script>

<style scoped>
.p-rating .p-rating-item .p-rating-icon {
  color: #fbbf24; /* amber-400 */
}

/* Additional custom styles if needed */
</style>z