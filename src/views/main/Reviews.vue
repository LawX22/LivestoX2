<script lang="ts">
import { defineComponent } from 'vue';
import { useRouter } from 'vue-router';

interface Review {
  id: number;
  username: string;
  avatarUrl: string | null;
  rating: number;
  date: Date;
  comment: string;
  sellerResponse: string | null;
  sellerResponseDate: Date | null;
  helpful: number;
  verified: boolean;
}

interface Seller {
  name: string;
  rating: number;
  reviewCount: number;
  responseTime: string;
  memberSince: string;
  lastDelivery: string;
  avatarUrl: string | null;
  completedOrders: number;
  responseRate: number;
  tags: string[];
}

interface RatingOption {
  name: string;
  value: string | number;
}

export default defineComponent({
  name: 'SellerReviews',
  setup() {
    const router = useRouter();

    const goBack = () => {
      router.go(-1); // Navigate back to the previous page
    };

    return {
      goBack
    };
  },
  data() {
    return {
      seller: {
        name: "John Doe Design",
        rating: 4.8,
        reviewCount: 243,
        responseTime: "Within 2 hours",
        memberSince: "January 2020",
        lastDelivery: "3 days ago",
        avatarUrl: null,
        completedOrders: 456,
        responseRate: 99,
        tags: ["Logo Design", "Branding", "UI/UX"]
      } as Seller,
      reviews: [
        {
          id: 1,
          username: "Sarah Johnson",
          avatarUrl: null,
          rating: 5,
          date: new Date(2023, 4, 15),
          comment: "Absolutely amazing service! The quality of work exceeded my expectations, and the seller was incredibly responsive throughout the entire process. I would definitely recommend them to anyone looking for professional design work.",
          sellerResponse: "Thank you so much for your kind words, Sarah! It was a pleasure working with you, and I'm thrilled you're happy with the results. Looking forward to collaborating again in the future!",
          sellerResponseDate: new Date(2023, 4, 16),
          helpful: 12,
          verified: true
        },
        {
          id: 2,
          username: "Michael Smith",
          avatarUrl: null,
          rating: 4,
          date: new Date(2023, 3, 28),
          comment: "Great experience overall. The designs were creative and delivered on time. Would have appreciated more initial concepts to choose from, but the final result was excellent.",
          sellerResponse: "Thanks for your feedback, Michael. I'm glad you're happy with the final result. I'll keep your suggestion about providing more initial concepts in mind for future projects. Hope to work with you again!",
          sellerResponseDate: new Date(2023, 3, 29),
          helpful: 8,
          verified: true
        },
        {
          id: 3,
          username: "Jessica Lee",
          avatarUrl: null,
          rating: 5,
          date: new Date(2023, 3, 10),
          comment: "John is a talented designer who really understands branding. He delivered exactly what I was looking for and was open to feedback throughout the process. Very professional and easy to work with.",
          sellerResponse: null,
          sellerResponseDate: null,
          helpful: 15,
          verified: true
        },
        {
          id: 4,
          username: "David Wilson",
          avatarUrl: null,
          rating: 3,
          date: new Date(2023, 2, 22),
          comment: "The work was good but took longer than initially promised. Communication could have been better during the process.",
          sellerResponse: "Hi David, I apologize for the delays in your project. You're right that communication could have been better, and I appreciate your honest feedback. I've since implemented better project management tools to ensure timely delivery and consistent updates. I hope we can work together again in the future.",
          sellerResponseDate: new Date(2023, 2, 24),
          helpful: 6,
          verified: true
        },
        {
          id: 5,
          username: "Emily Thompson",
          avatarUrl: null,
          rating: 5,
          date: new Date(2023, 2, 5),
          comment: "Incredible attention to detail! John took my vague ideas and transformed them into a stunning brand identity. The whole process was smooth and enjoyable.",
          sellerResponse: "Thank you, Emily! It was a joy working with you on your brand identity. Your input was crucial in shaping the final result, and I'm delighted that you're happy with it. Looking forward to seeing your brand grow!",
          sellerResponseDate: new Date(2023, 2, 6),
          helpful: 9,
          verified: true
        }
      ] as Review[],
      newReview: {
        rating: 0,
        comment: ""
      },
      selectedRating: "all" as string | number,
      ratingOptions: [
        { name: "All Ratings", value: "all" },
        { name: "5 Star", value: 5 },
        { name: "4 Star", value: 4 },
        { name: "3 Star", value: 3 },
        { name: "2 Star", value: 2 },
        { name: "1 Star", value: 1 }
      ] as RatingOption[],
      selectedSortOption: "newest",
      sortOptions: [
        { name: "Newest First", value: "newest" },
        { name: "Oldest First", value: "oldest" },
        { name: "Highest Rating", value: "highest" },
        { name: "Lowest Rating", value: "lowest" },
        { name: "Most Helpful", value: "helpful" }
      ] as RatingOption[],
      currentPage: 1,
      itemsPerPage: 5,
      canReview: true,
      showFiltersMobile: false
    };
  },
  computed: {
    filteredReviews(): Review[] {
      let result = [...this.reviews];

      // Filter by rating
      if (this.selectedRating !== "all") {
        result = result.filter(review => review.rating === parseInt(this.selectedRating as string));
      }

      // Sort reviews
      if (this.selectedSortOption === "newest") {
        result.sort((a, b) => b.date.getTime() - a.date.getTime());
      } else if (this.selectedSortOption === "oldest") {
        result.sort((a, b) => a.date.getTime() - b.date.getTime());
      } else if (this.selectedSortOption === "highest") {
        result.sort((a, b) => b.rating - a.rating);
      } else if (this.selectedSortOption === "lowest") {
        result.sort((a, b) => a.rating - b.rating);
      } else if (this.selectedSortOption === "helpful") {
        result.sort((a, b) => b.helpful - a.helpful);
      }

      return result;
    },
    totalPages(): number {
      return Math.ceil(this.filteredReviews.length / this.itemsPerPage);
    },
    paginatedReviews(): Review[] {
      const startIndex = (this.currentPage - 1) * this.itemsPerPage;
      const endIndex = startIndex + this.itemsPerPage;
      return this.filteredReviews.slice(startIndex, endIndex);
    },
    starLabels(): string[] {
      return ['Terrible', 'Poor', 'Average', 'Good', 'Excellent'];
    }
  },
  methods: {
    getPercentageForStar(star: number): number {
      if (this.reviews.length === 0) return 0;

      const starCount = this.reviews.filter(review => review.rating === star).length;
      return Math.round((starCount / this.reviews.length) * 100);
    },
    formatDate(date: Date | null): string {
      if (!date) return "";

      const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
      return date.toLocaleDateString(undefined, options);
    },
    resetFilters(): void {
      this.selectedRating = "all";
      this.selectedSortOption = "newest";
      this.currentPage = 1;
    },
    submitReview(): void {
      if (!this.newReview.rating || !this.newReview.comment.trim()) return;

      // Add new review
      const newReviewObj: Review = {
        id: this.reviews.length + 1,
        username: "You",
        avatarUrl: null,
        rating: this.newReview.rating,
        date: new Date(),
        comment: this.newReview.comment,
        sellerResponse: null,
        sellerResponseDate: null,
        helpful: 0,
        verified: true
      };

      this.reviews.unshift(newReviewObj);

      // Update seller rating
      const totalRating = this.reviews.reduce((sum, review) => sum + review.rating, 0);
      this.seller.rating = parseFloat((totalRating / this.reviews.length).toFixed(1));
      this.seller.reviewCount = this.reviews.length;

      // Reset form
      this.newReview = {
        rating: 0,
        comment: ""
      };

      // Prevent multiple reviews
      this.canReview = false;

      // Reset filters to show the new review
      this.resetFilters();
    },
    getStarLabel(index: number): string {
      return this.starLabels[index - 1];
    },
    markHelpful(review: Review): void {
      review.helpful += 1;
    },
    toggleFiltersMobile(): void {
      this.showFiltersMobile = !this.showFiltersMobile;
    }
  }
});
</script>

<template>
  <div class="bg-gradient-to-b from-slate-50 to-slate-100 min-h-screen w-full">
    <!-- Top navigation bar -->
    <div class="bg-white shadow-sm sticky top-0 z-10">
      <div class="container mx-auto px-4 h-16 flex items-center justify-between">
        <button @click="goBack"
          class="flex items-center text-slate-700 hover:text-blue-600 transition duration-200 group">
          <svg xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5 mr-2 transform group-hover:-translate-x-1 transition-transform duration-200" fill="none"
            viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span class="font-medium hidden sm:inline">Back to Listing</span>
        </button>

        <h1 class="text-xl font-bold text-slate-800">Seller Reviews</h1>

        <button @click="toggleFiltersMobile"
          class="lg:hidden text-slate-700 hover:text-blue-600 transition duration-200">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
          </svg>
        </button>
      </div>
    </div>

    <div class="container mx-auto px-4 py-6">
      <div class="flex flex-col lg:flex-row gap-6">
        <!-- Left sidebar for desktop -->
        <div class="hidden lg:block w-80 flex-shrink-0">
          <div class="bg-white rounded-xl shadow-sm overflow-hidden mb-6 sticky top-24">
            <!-- Seller info -->
            <div class="p-6 border-b border-slate-100">
              <div class="flex items-center gap-4 mb-4">
                <div class="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <span class="text-blue-600 font-semibold text-xl">{{ seller.name?.charAt(0) }}</span>
                </div>
                <div>
                  <h2 class="font-bold text-slate-800 text-lg">{{ seller.name }}</h2>
                  <div class="flex items-center mt-2">
                    <template v-for="n in 5" :key="n">
                      <svg v-if="n <= Math.round(seller.rating)" xmlns="http://www.w3.org/2000/svg"
                        class="h-4 w-4 text-amber-400" viewBox="0 0 20 20" fill="currentColor">
                        <path
                          d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-300" viewBox="0 0 20 20"
                        fill="currentColor">
                        <path
                          d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </template>
                    <span class="ml-2 text-sm font-medium text-slate-600">{{ seller.rating }} ({{ seller.reviewCount
                      }})</span>
                  </div>
                </div>
              </div>

              <div class="space-y-3 mt-6">
                <div class="flex justify-between text-sm">
                  <span class="text-slate-600">Completed Orders</span>
                  <span class="font-medium text-slate-800">{{ seller.completedOrders }}</span>
                </div>
                <div class="flex justify-between text-sm">
                  <span class="text-slate-600">Response Rate</span>
                  <span class="font-medium text-slate-800">{{ seller.responseRate }}%</span>
                </div>
                <div class="flex justify-between text-sm">
                  <span class="text-slate-600">Response Time</span>
                  <span class="font-medium text-slate-800">{{ seller.responseTime }}</span>
                </div>
                <div class="flex justify-between text-sm">
                  <span class="text-slate-600">Member Since</span>
                  <span class="font-medium text-slate-800">{{ seller.memberSince }}</span>
                </div>
              </div>

              <div class="mt-6">
                <h3 class="text-sm font-medium text-slate-600 mb-3">Specialties</h3>
                <div class="flex flex-wrap gap-2">
                  <span v-for="tag in seller.tags" :key="tag"
                    class="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-medium">{{ tag }}</span>
                </div>
              </div>
            </div>

            <!-- Rating breakdown -->
            <div class="p-6">
              <h3 class="text-base font-semibold text-slate-800 mb-4">Rating Breakdown</h3>
              <div v-for="star in 5" :key="star" class="flex items-center mb-3 last:mb-0">
                <div class="w-12 text-sm font-medium text-slate-600 flex items-center">
                  {{ 6 - star }}
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-amber-400 ml-1" viewBox="0 0 20 20"
                    fill="currentColor">
                    <path
                      d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
                <div class="relative w-full bg-slate-200 rounded-full h-2 mx-3 overflow-hidden">
                  <div class="absolute top-0 left-0 h-2 rounded-full transition-all duration-500"
                    :class="getPercentageForStar(6 - star) > 70 ? 'bg-green-500' : 'bg-amber-400'"
                    :style="{ width: `${getPercentageForStar(6 - star)}%` }">
                  </div>
                </div>
                <div class="text-xs font-medium text-slate-600 w-12">
                  {{ getPercentageForStar(6 - star) }}%
                </div>
              </div>
            </div>

            <!-- Filter options -->
            <div class="p-6 border-t border-slate-100">
              <h3 class="text-base font-semibold text-slate-800 mb-4">Filter Reviews</h3>

              <div class="mb-4">
                <label class="text-sm font-medium text-slate-600 mb-2 block">By Rating</label>
                <select v-model="selectedRating"
                  class="w-full rounded-lg border border-slate-300 py-2.5 px-4 bg-white text-slate-700 appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option v-for="option in ratingOptions" :key="option.value" :value="option.value">
                    {{ option.name }}
                  </option>
                </select>
              </div>

              <div class="mb-6">
                <label class="text-sm font-medium text-slate-600 mb-2 block">Sort By</label>
                <select v-model="selectedSortOption"
                  class="w-full rounded-lg border border-slate-300 py-2.5 px-4 bg-white text-slate-700 appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option v-for="option in sortOptions" :key="option.value" :value="option.value">
                    {{ option.name }}
                  </option>
                </select>
              </div>

              <button @click="resetFilters"
                class="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-slate-700 bg-white hover:bg-slate-50 transition duration-200 font-medium flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Reset Filters
              </button>
            </div>
          </div>
        </div>

        <!-- Mobile filters drawer -->
        <div v-if="showFiltersMobile" class="lg:hidden fixed inset-0 bg-slate-900 bg-opacity-50 z-50 flex items-end">
          <div class="bg-white w-full rounded-t-xl p-6 max-h-screen overflow-y-auto animate-slide-up">
            <div class="flex justify-between items-center mb-6">
              <h3 class="text-lg font-semibold text-slate-800">Filters & Sorting</h3>
              <button @click="toggleFiltersMobile" class="text-slate-400 hover:text-slate-600">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div class="mb-6">
              <h4 class="text-base font-medium text-slate-800 mb-3">Rating</h4>
              <div class="grid grid-cols-3 gap-2">
                <button v-for="option in ratingOptions" :key="option.value"
                  @click="selectedRating = option.value; currentPage = 1" :class="[
                    'py-2 px-3 rounded-lg text-sm font-medium border',
                    selectedRating === option.value
                      ? 'bg-blue-50 border-blue-300 text-blue-600'
                      : 'bg-white border-slate-200 text-slate-600'
                  ]">
                  {{ option.name }}
                </button>
              </div>
            </div>

            <div class="mb-6">
              <h4 class="text-base font-medium text-slate-800 mb-3">Sort By</h4>
              <div class="grid grid-cols-2 gap-2">
                <button v-for="option in sortOptions" :key="option.value"
                  @click="selectedSortOption = String(option.value); currentPage = 1" :class="[
                    'py-2 px-3 rounded-lg text-sm font-medium border',
                    selectedSortOption === option.value
                      ? 'bg-blue-50 border-blue-300 text-blue-600'
                      : 'bg-white border-slate-200 text-slate-600'
                  ]">
                  {{ option.name }}
                </button>
              </div>
            </div>

            <div class="flex gap-3">
              <button @click="resetFilters" class="w-1/2 py-3 rounded-lg bg-slate-100 text-slate-700 font-medium">
                Reset Filters
              </button>
              <button @click="toggleFiltersMobile" class="w-1/2 py-3 rounded-lg bg-blue-600 text-white font-medium">
                Apply Filters
              </button>
            </div>
          </div>
        </div>

        <!-- Main content area -->
        <div class="flex-1">
          <!-- Rating summary card (mobile only) -->
          <div class="lg:hidden bg-white rounded-xl shadow-sm overflow-hidden mb-6">
            <div class="p-6">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <div class="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <span class="text-blue-600 font-semibold">{{ seller.name?.charAt(0) }}</span>
                  </div>
                  <div>
                    <h2 class="font-bold text-slate-800">{{ seller.name }}</h2>
                    <div class="flex items-center mt-1">
                      <template v-for="n in 5" :key="n">
                        <svg v-if="n <= Math.round(seller.rating)" xmlns="http://www.w3.org/2000/svg"
                          class="h-4 w-4 text-amber-400" viewBox="0 0 20 20" fill="currentColor">
                          <path
                            d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-300" viewBox="0 0 20 20"
                          fill="currentColor">
                          <path
                            d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      </template>
                      <span class="ml-1 text-sm text-slate-600">{{ seller.rating }} ({{ seller.reviewCount }})</span>
                    </div>
                  </div>
                </div>
                <div class="text-center bg-amber-50 p-2 rounded-lg border border-amber-100">
                  <span class="text-2xl font-bold text-amber-600 block">{{ seller.rating }}</span>
                  <span class="text-xs font-medium text-amber-600">Rating</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Write a review section -->
          <div v-if="canReview" class="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
            <div class="p-6">
              <div class="border-b border-slate-100 pb-4 mb-6">
                <h3 class="text-lg font-semibold text-slate-800">Write a Review</h3>
                <p class="text-slate-500 text-sm mt-1">Share your experience with this seller</p>
              </div>

              <div class="space-y-6">
                <div>
                  <label class="block text-sm font-medium text-slate-700 mb-2">Your Rating</label>
                  <div class="flex items-center">
                    <template v-for="n in 5" :key="n">
                      <button @click="newReview.rating = n" class="focus:outline-none group relative">
                        <svg v-if="n <= newReview.rating" xmlns="http://www.w3.org/2000/svg"
                          class="h-8 w-8 text-amber-400 hover:text-amber-500 cursor-pointer" viewBox="0 0 20 20"
                          fill="currentColor">
                          <path
                            d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <svg v-else xmlns="http://www.w3.org/2000/svg"
                          class="h-8 w-8 text-slate-300 hover:text-amber-400 cursor-pointer" viewBox="0 0 20 20"
                          fill="currentColor">
                          <path
                            d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <div v-if="newReview.rating >= n"
                          class="absolute -bottom-6 left-1/2 transform -translate-x-1/2 whitespace-nowrap text-xs text-amber-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                          {{ getStarLabel(n) }}
                        </div>
                      </button>
                    </template>
                  </div>
                  <div v-if="newReview.rating > 0" class="text-sm text-slate-500 mt-2">
                    You selected: {{ getStarLabel(newReview.rating) }} ({{ newReview.rating }} {{ newReview.rating === 1
                      ?
                    'star' : 'stars' }})
                  </div>
                </div>

                <div>
                  <label for="reviewComment" class="block text-sm font-medium text-slate-700 mb-2">Your Review</label>
                  <textarea id="reviewComment" v-model="newReview.comment" rows="4"
                    class="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-700 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 resize-none"
                    placeholder="Share your experience with this seller..."></textarea>
                  <p class="text-xs text-slate-500 mt-2">Minimum 10 characters</p>
                </div>

                <div class="flex justify-end">
                  <button @click="submitReview" :class="[
                    'px-6 py-2.5 rounded-lg font-medium transition-colors duration-200',
                    (!newReview.rating || !newReview.comment.trim() || newReview.comment.length < 10)
                      ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  ]" :disabled="!newReview.rating || !newReview.comment.trim() || newReview.comment.length < 10">
                    Submit Review
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Reviews list -->
          <div class="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
            <div class="border-b border-slate-100">
              <div class="p-6">
                <div class="flex items-center justify-between">
                  <h3 class="text-lg font-semibold text-slate-800">
                    {{ filteredReviews.length }} {{ filteredReviews.length === 1 ? 'Review' : 'Reviews' }}
                  </h3>

                  <div class="flex items-center space-x-2">
                    <label class="text-sm font-medium text-slate-600 hidden sm:inline">Sort by:</label>
                    <select v-model="selectedSortOption"
                      class="rounded-lg border border-slate-300 py-1.5 pl-3 pr-8 text-sm bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none cursor-pointer">
                      <option v-for="option in sortOptions" :key="option.value" :value="option.value">
                        {{ option.name }}
                      </option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div v-if="filteredReviews.length === 0" class="p-10 text-center">
              <div class="text-slate-400 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                    d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
                </svg>
              </div>
              <h4 class="text-lg font-medium text-slate-700 mb-2">No reviews found</h4>
              <p class="text-slate-500">Try adjusting your filters or check back later</p>
            </div>

            <div v-else>
              <!-- Review items -->
              <div v-for="review in paginatedReviews" :key="review.id"
                class="p-6 border-b border-slate-100 last:border-0">
                <div class="flex items-start">
                  <!-- User avatar -->
                  <div
                    class="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0 mr-4">
                    <span class="text-white font-medium text-sm">{{ review.username.charAt(0) }}</span>
                  </div>

                  <div class="flex-1">
                    <div class="flex items-center justify-between flex-wrap">
                      <h4 class="font-medium text-slate-800">{{ review.username }}</h4>
                      <span class="text-sm text-slate-500">{{ formatDate(review.date) }}</span>
                    </div>

                    <div class="flex items-center mt-1 mb-3">
                      <div class="flex">
                        <template v-for="n in 5" :key="n">
                          <svg v-if="n <= review.rating" xmlns="http://www.w3.org/2000/svg"
                            class="h-4 w-4 text-amber-400" viewBox="0 0 20 20" fill="currentColor">
                            <path
                              d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-300"
                            viewBox="0 0 20 20" fill="currentColor">
                            <path
                              d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        </template>
                      </div>
                      <span class="ml-2 text-sm text-slate-600">{{ review.rating }} {{ review.rating === 1 ? 'star' :
                        'stars'
                        }}</span>

                      <div v-if="review.verified"
                        class="ml-3 px-2 py-0.5 bg-green-50 rounded text-xs font-medium text-green-600 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 mr-1" viewBox="0 0 20 20"
                          fill="currentColor">
                          <path fill-rule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clip-rule="evenodd" />
                        </svg>
                        Verified
                      </div>
                    </div>

                    <p class="text-slate-600 whitespace-pre-line">{{ review.comment }}</p>

                    <div class="mt-4 flex items-center">
                      <button @click="markHelpful(review)"
                        class="flex items-center text-sm text-slate-500 hover:text-blue-600 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24"
                          stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                        </svg>
                        Helpful ({{ review.helpful }})
                      </button>
                    </div>

                    <!-- Seller response -->
                    <div v-if="review.sellerResponse" class="mt-4 bg-slate-50 rounded-lg p-4">
                      <div class="flex items-start">
                        <div
                          class="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mr-3">
                          <span class="text-blue-600 font-medium text-xs">{{ seller.name.charAt(0) }}</span>
                        </div>
                        <div>
                          <div class="flex items-center">
                            <h5 class="font-medium text-slate-800 text-sm">{{ seller.name }}</h5>
                            <span class="mx-2 text-slate-300">•</span>
                            <span class="text-xs text-slate-500">{{ formatDate(review.sellerResponseDate) }}</span>
                          </div>
                          <p class="text-sm text-slate-600 mt-2">{{ review.sellerResponse }}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Pagination -->
              <div v-if="totalPages > 1" class="p-6 flex justify-center">
                <div class="flex items-center space-x-1">
                  <button @click="currentPage = Math.max(1, currentPage - 1)" :disabled="currentPage === 1" :class="[
                    'w-9 h-9 rounded-lg flex items-center justify-center transition-colors',
                    currentPage === 1
                      ? 'text-slate-400 cursor-not-allowed'
                      : 'text-slate-600 hover:bg-slate-100'
                  ]">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd"
                        d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                        clip-rule="evenodd" />
                    </svg>
                  </button>

                  <template v-for="page in totalPages" :key="page">
                    <button v-if="totalPages <= 5 ||
                      page === 1 ||
                      page === totalPages ||
                      (page >= currentPage - 1 && page <= currentPage + 1)" @click="currentPage = page" :class="[
          'w-9 h-9 rounded-lg flex items-center justify-center text-sm font-medium transition-colors',
          currentPage === page
            ? 'bg-blue-600 text-white'
            : 'text-slate-600 hover:bg-slate-100'
        ]">
                      {{ page }}
                    </button>

                    <span v-else-if="(page === 2 && currentPage > 3) ||
                      (page === totalPages - 1 && currentPage < totalPages - 2)" class="text-slate-400">...</span>
                  </template>

                  <button @click="currentPage = Math.min(totalPages, currentPage + 1)"
                    :disabled="currentPage === totalPages" :class="[
                      'w-9 h-9 rounded-lg flex items-center justify-center transition-colors',
                      currentPage === totalPages
                        ? 'text-slate-400 cursor-not-allowed'
                        : 'text-slate-600 hover:bg-slate-100'
                    ]">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd"
                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                        clip-rule="evenodd" />
                    </svg>
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