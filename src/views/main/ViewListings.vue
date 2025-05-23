<script setup lang="ts">
import { defineProps, ref, computed, onMounted } from "vue";
import Button from "primevue/button";
import ProgressSpinner from "primevue/progressspinner";
import TabView from "primevue/tabview";
import TabPanel from "primevue/tabpanel";
import Rating from "primevue/rating";
import Avatar from "primevue/avatar";
import Dialog from "primevue/dialog";
import { useRoute, useRouter } from "vue-router";
import { livestock as livestockRepo } from "../../services/livestockService";

import SellerInfoCard from "../../components/Main/ViewListings/SellerInfoCard.vue";
import SimilarListings from "../../components/Main/ViewListings/SimilarListings.vue";

interface Livestock {
  id: number;
  title: string;
  description: string;
  category: string;
  breed: string;
  age: number;
  ageUnit: string;
  gender: string;
  weight: number;
  weightUnit: string;
  price: number;
  negotiable: boolean;
  quantity: number;
  location: string;
  healthStatus: string;
  feedingType: string;
  imageUrl: string;
  videoUrl?: string;
  videoThumbnail?: string;
  certified: boolean;
  auction: boolean;
  availableImmediate: boolean;
  isFavorite: boolean;
  listedDate: Date;
  deliveryOption: string;
  deliveryDetails: string;
  restrictions: string;
  sellerId: number;
}

interface Seller {
  id: number;
  name: string;
  avatarUrl?: string;
  rating: number;
  reviewCount: number;
  showPhoneNumber: boolean;
  phoneNumber?: string;
  memberSince: number;
  responseTime: string;
  totalListings: number;
}

interface Review {
  id: number;
  username: string;
  avatarUrl?: string;
  rating: number;
  comment: string;
  date: Date;
}

type SimListing = {
  id: number | string;
  image_url: string;
  title: string;
  certified?: boolean;
  isFavorite?: boolean;
  price: number;
  negotiable?: boolean;
  location: string;
  breed: string;
  age: number | string;
  ageUnit: string;
};

const route = useRoute();
const router = useRouter();

const loading = ref(true);
const livestock = ref<Livestock>({} as Livestock);
const seller = ref<Seller>({} as Seller);
const reviews = ref<Review[]>([]);
const similarListings = ref<SimListing[]>([]);
const selectedImage = ref(0);
const additionalImages = ref<string[]>([]);
const selectedQuantity = ref(1);
const videoDialogVisible = ref(false);
const activeImageIndex = ref(0);
const imageGalleryModalVisible = ref(false);

const listingId = route.query.id as string;

defineProps<{
  type: number;
  required: true;
}>();

// Compute livestock details for display
const livestockDetails = computed(() => {
  if (!livestock.value) return [];

  return [
    { label: "Category", value: livestock.value.category },
    { label: "Breed", value: livestock.value.breed },
    {
      label: "Age",
      value: `${livestock.value.age} ${livestock.value.ageUnit}`,
    },
    { label: "Gender", value: livestock.value.gender },
    {
      label: "Weight",
      value: `${livestock.value.weight} ${livestock.value.weightUnit}`,
    },
    { label: "Health Status", value: livestock.value.healthStatus },
    { label: "Feeding Type", value: livestock.value.feedingType },
  ];
});

// Fetch livestock details
const fetchLivestockDetails = async () => {
  const livestockData = await livestockRepo.getListingsById(listingId);
  livestock.value = {
    id: livestockData.id,
    title: livestockData.title,
    description: livestockData.description,
    category: livestockData.category,
    breed: livestockData.breed,
    age: livestockData.age,
    ageUnit: livestockData.age_unit,
    gender: livestockData.gender,
    weight: livestockData.weight,
    weightUnit: livestockData.weight_unit,
    price: livestockData.price,
    negotiable: livestockData.negotiable,
    quantity: livestockData.quantity,
    location: livestockData.location,
    healthStatus: livestockData.health_status,
    feedingType: livestockData.feeding_type,
    imageUrl: livestockData.image_url[0],
    videoThumbnail: "/src/assets/Bull.jpg?text=Video+Thumbnail",
    videoUrl: livestockData.video_url,
    certified: livestockData.certified,
    auction: livestockData.auction,
    availableImmediate: livestockData.available_immediate,
    isFavorite: false,
    listedDate: new Date(livestockData.listed_date),
    deliveryOption: livestockData.delivery_option,
    deliveryDetails: "Available for pick-up Monday to Saturday, 8am to 5pm",
    restrictions: livestockData.restrictions,
    sellerId: livestockData.seller_id,
  };

  // Generate additional images
  additionalImages.value = [
    livestock.value.imageUrl,

  ];

  // Mock seller data
  seller.value = {
    id: livestockData.farms.user_id,
    name: livestockData.farms.farm_name,
    avatarUrl: "/src/assets/Bull.jpg?text=JD",
    rating: 4.8,
    reviewCount: 15,
    showPhoneNumber: true,
    phoneNumber: livestockData.farms.phone,
    memberSince: new Date(livestockData.farms.created_at).getFullYear(),
    responseTime: "Within 2 hours",
    totalListings: 25,
  };

  // Mock reviews
  reviews.value = [
    {
      id: 1,
      username: "FarmerMike",
      avatarUrl: "/src/assets/Bull.jpg?text=FM",
      rating: 5,
      comment:
        "Great quality livestock! Healthy and exactly as described. The seller was very knowledgeable and helpful.",
      date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
    },
    {
      id: 2,
      username: "RanchOwner22",
      rating: 4,
      comment:
        "Good cattle, slightly smaller than expected but overall healthy and good condition.",
      date: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
    },
    {
      id: 3,
      username: "AgriBusiness101",
      avatarUrl: "/src/assets/Bull.jpg?text=AB",
      rating: 5,
      comment:
        "Excellent Brahman cattle. We purchased 3 and all arrived in perfect health. Will definitely buy again from this seller.",
      date: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
    },
    {
      id: 4,
      username: "LivestockLover",
      rating: 4,
      comment:
        "Very good experience overall. The cow was as described and the delivery was smooth.",
      date: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
    },
  ];

  // Similar listings
  fetchSimilarListings(livestockData.seller_id, listingId);

  loading.value = false;
};

// Fetch similar listings
const fetchSimilarListings = async (sellerId: string, listId: string) => {
  const similar = await livestockRepo.getListingsBySeller(sellerId, 3, listId);
  similarListings.value = similar;
};

onMounted(() => {
  fetchLivestockDetails();
});

// Methods for interaction
const selectImage = (index: number) => {
  selectedImage.value = index;
  livestock.value.imageUrl = additionalImages.value[index];
};

const toggleFavorite = (item: Livestock) => {
  item.isFavorite = !item.isFavorite;
  // In a real app, you would save this to your API
};

const incrementQuantity = () => {
  if (selectedQuantity.value < livestock.value.quantity) {
    selectedQuantity.value++;
  }
};

const decrementQuantity = () => {
  if (selectedQuantity.value > 1) {
    selectedQuantity.value--;
  }
};

const buyNow = () => {
  // In a real app, this would redirect to checkout or payment page
  alert(
    `Proceeding to purchase ${
      selectedQuantity.value
    } item(s) for $${formatPrice(
      livestock.value.price * selectedQuantity.value
    )}`
  );
};

const goBack = () => {
  router.back(); // This will go back one step in the browser history
};

const viewSellerProfile = () => {
  // In a real app, this would navigate to the seller's profile
  alert(`Viewing profile for seller: ${seller.value.name}`);
};

const callSeller = () => {
  // In a real app, this would use the device's call functionality
  if (seller.value.phoneNumber) {
    alert(`Calling seller at: ${seller.value.phoneNumber}`);
  }
};

const reportListing = () => {
  // In a real app, this would open a report dialog
  alert("Opening report listing form");
};

const playVideo = () => {
  videoDialogVisible.value = true;
};

const viewListing = (id: number) => {
  // In a real app, this would navigate to the selected listing
  alert(`Navigating to listing with ID: ${id}`);
};

const openGallery = (index: number) => {
  activeImageIndex.value = index;
  imageGalleryModalVisible.value = true;
};

const nextImage = () => {
  activeImageIndex.value =
    (activeImageIndex.value + 1) % additionalImages.value.length;
};

const prevImage = () => {
  activeImageIndex.value =
    (activeImageIndex.value - 1 + additionalImages.value.length) %
    additionalImages.value.length;
};

const formatDate = (date: Date) => {
  // Calculate days difference
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return "Today";
  } else if (diffDays === 1) {
    return "Yesterday";
  } else if (diffDays < 7) {
    return `${diffDays} days ago`;
  } else if (diffDays < 30) {
    return `${Math.floor(diffDays / 7)} weeks ago`;
  } else {
    return `${Math.floor(diffDays / 30)} months ago`;
  }
};

const formatPrice = (price: number) => {
  return price.toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
};

// View all reviews method
// const viewAllReviews = () => {
//   alert("Viewing all reviews for this seller.");
// };
</script>

<template>
  <div
    class="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-blue-50"
  >
    <!-- Header with sticky navigation -->
    <header
      class="sticky top-0 z-50 bg-white/90 backdrop-blur-md shadow-md border-b border-emerald-100"
    >
      <div
        class="container mx-auto px-4 py-3 flex items-center justify-between"
      >
        <div class="flex items-center gap-3">
          <Button
            icon="pi pi-arrow-left"
            class="text-emerald-700 bg-transparent hover:bg-emerald-100 border-none p-button-rounded"
            @click="goBack"
            v-tooltip.right="'Back to Listings'"
          />
          <div class="hidden md:block">
            <h1 class="text-lg font-semibold text-gray-800 truncate max-w-md">
              {{ livestock.title }}
            </h1>
          </div>
        </div>

        <div class="flex items-center gap-2">
          <Button
            icon="pi pi-bookmark"
            :class="[
              'p-button-rounded p-button-text',
              livestock.isFavorite ? 'text-amber-600' : 'text-gray-500',
            ]"
            @click="toggleFavorite(livestock)"
            v-tooltip.left="
              livestock.isFavorite
                ? 'Remove from Favorites'
                : 'Add to Favorites'
            "
          />

          <Button
            icon="pi pi-share-alt"
            class="p-button-rounded p-button-text text-gray-500"
            v-tooltip.left="'Share Listing'"
          />

          <Button
            icon="pi pi-flag"
            class="p-button-rounded p-button-text text-gray-500"
            @click="reportListing"
            v-tooltip.left="'Report Listing'"
          />
        </div>
      </div>
    </header>

    <!-- Loading spinner -->
    <div v-if="loading" class="flex justify-center items-center py-32">
      <div class="text-center">
        <ProgressSpinner
          style="width: 80px; height: 80px"
          strokeWidth="4"
          fill="var(--surface-ground)"
          animationDuration=".5s"
          aria-label="Loading"
          class="mb-4"
        />
        <p class="text-emerald-700 text-lg font-medium animate-pulse">
          Loading livestock details...
        </p>
      </div>
    </div>

    <div v-else class="container mx-auto px-4 pb-16 pt-6">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <!-- Left column: Images & Gallery -->
        <div class="lg:col-span-7">
          <!-- Main image with zoom effect -->
          <div class="bg-white rounded-2xl shadow-lg overflow-hidden mb-4">
            <div
              class="relative cursor-pointer"
              @click="openGallery(selectedImage)"
            >
              <div class="aspect-w-4 aspect-h-3">
                <img
                  :src="livestock.imageUrl"
                  :alt="livestock.title"
                  class="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>

              <!-- Image zoom/expand hint -->
              <div
                class="absolute bottom-4 right-4 bg-white/80 backdrop-blur-sm text-emerald-800 rounded-full p-2 shadow-lg"
              >
                <i class="pi pi-search-plus text-lg"></i>
              </div>

              <!-- Feature badges -->
              <div class="absolute top-4 left-4 flex flex-col gap-2">
                <div
                  v-if="livestock.certified"
                  class="bg-emerald-600 text-white px-3 py-1.5 rounded-lg shadow-md text-sm font-medium flex items-center"
                >
                  <i class="pi pi-verified mr-1.5"></i> Certified
                </div>
                <div
                  v-if="livestock.auction"
                  class="bg-amber-500 text-white px-3 py-1.5 rounded-lg shadow-md text-sm font-medium flex items-center"
                >
                  <i class="pi pi-clock mr-1.5"></i> Auction
                </div>
                <div
                  v-if="livestock.availableImmediate"
                  class="bg-blue-600 text-white px-3 py-1.5 rounded-lg shadow-md text-sm font-medium flex items-center"
                >
                  <i class="pi pi-check-circle mr-1.5"></i> Available Now
                </div>
              </div>
            </div>
          </div>

          <!-- Thumbnails bar -->
          <div class="grid grid-cols-5 gap-2 mb-8">
            <div
              v-for="(image, index) in additionalImages"
              :key="index"
              @click="selectImage(index)"
              class="aspect-square rounded-lg overflow-hidden cursor-pointer relative"
            >
              <img
                :src="image"
                :alt="`Image ${index + 1}`"
                class="w-full h-full object-cover transition-all duration-300"
                :class="[
                  selectedImage === index
                    ? 'brightness-100'
                    : 'brightness-75 hover:brightness-90',
                ]"
              />
              <div
                v-if="selectedImage === index"
                class="absolute inset-0 border-2 border-emerald-500 rounded-lg"
              ></div>
            </div>

            <!-- Video thumbnail -->
            <div
              v-if="livestock.videoUrl"
              @click="playVideo"
              class="aspect-square rounded-lg overflow-hidden cursor-pointer relative bg-black"
            >
              <img
                :src="livestock.videoThumbnail"
                alt="Video thumbnail"
                class="w-full h-full object-cover opacity-70 hover:opacity-90 transition-all duration-300"
              />
              <div class="absolute inset-0 flex items-center justify-center">
                <div
                  class="w-10 h-10 rounded-full bg-white/80 flex items-center justify-center"
                >
                  <i class="pi pi-play text-emerald-600"></i>
                </div>
              </div>
            </div>
          </div>

          <!-- Location and key details -->
          <div class="bg-white rounded-2xl shadow-lg overflow-hidden mb-8 p-5">
            <div class="flex flex-wrap gap-3 mb-4">
              <div
                class="flex items-center bg-emerald-100 text-emerald-800 px-3 py-1.5 rounded-lg"
              >
                <i class="pi pi-map-marker mr-1.5"></i>
                <span class="font-medium">{{ livestock.location }}</span>
              </div>
              <div
                class="flex items-center bg-blue-100 text-blue-800 px-3 py-1.5 rounded-lg"
              >
                <i class="pi pi-calendar mr-1.5"></i>
                <span class="font-medium"
                  >Listed {{ formatDate(livestock.listedDate) }}</span
                >
              </div>
              <div
                class="flex items-center bg-amber-100 text-amber-800 px-3 py-1.5 rounded-lg"
              >
                <i class="pi pi-tag mr-1.5"></i>
                <span class="font-medium"
                  >{{ livestock.category }} / {{ livestock.breed }}</span
                >
              </div>
            </div>
          </div>

          <!-- Tabbed information -->
          <div class="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
            <TabView>
              <TabPanel header="Description">
                <div class="p-6">
                  <h3
                    class="text-xl font-bold text-gray-800 mb-4 flex items-center"
                  >
                    <i class="pi pi-info-circle mr-2 text-emerald-600"></i>
                    About this Livestock
                  </h3>
                  <p class="text-gray-700 leading-relaxed">
                    {{ livestock.description }}
                  </p>

                  <!-- Quick specs preview -->
                  <div class="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-6">
                    <div
                      v-for="(detail, index) in livestockDetails.slice(0, 3)"
                      :key="index"
                      class="bg-emerald-50 rounded-lg p-3 text-center"
                    >
                      <div class="text-sm text-emerald-700 mb-1">
                        {{ detail.label }}
                      </div>
                      <div class="font-medium text-gray-800">
                        {{ detail.value }}
                      </div>
                    </div>
                  </div>
                </div>
              </TabPanel>

              <TabPanel header="Specifications">
                <div class="p-6">
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div
                      v-for="(detail, index) in livestockDetails"
                      :key="index"
                      class="flex rounded-xl overflow-hidden border border-emerald-100 shadow-sm"
                    >
                      <div
                        class="bg-emerald-100 text-emerald-800 p-3 flex items-center justify-center min-w-16"
                      >
                        <i class="pi pi-check-circle"></i>
                      </div>
                      <div class="p-3 flex flex-col">
                        <span class="text-sm text-gray-500">{{
                          detail.label
                        }}</span>
                        <span class="font-medium text-gray-800">{{
                          detail.value
                        }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </TabPanel>

              <TabPanel header="Location & Delivery">
                <div class="p-6">
                  <div class="space-y-4">
                    <div
                      class="flex items-start gap-4 p-4 bg-emerald-50 rounded-xl"
                    >
                      <div
                        class="bg-emerald-100 rounded-full p-3 text-emerald-700"
                      >
                        <i class="pi pi-map-marker text-lg"></i>
                      </div>
                      <div>
                        <h4 class="font-medium text-gray-800 mb-1">Location</h4>
                        <p class="text-gray-600">{{ livestock.location }}</p>
                      </div>
                    </div>

                    <div
                      class="flex items-start gap-4 p-4 bg-blue-50 rounded-xl"
                    >
                      <div class="bg-blue-100 rounded-full p-3 text-blue-700">
                        <i class="pi pi-truck text-lg"></i>
                      </div>
                      <div>
                        <h4 class="font-medium text-gray-800 mb-1">
                          Delivery Option
                        </h4>
                        <p class="text-gray-600">
                          <span
                            v-for="(
                              deliveryOption, index
                            ) in livestock.deliveryOption"
                            :key="index"
                            class="mr-2"
                          >
                            {{ deliveryOption }},
                          </span>
                        </p>
                        <p class="text-sm text-gray-500 mt-1">
                          {{ livestock.deliveryDetails }}
                        </p>
                      </div>
                    </div>

                    <div
                      class="flex items-start gap-4 p-4 bg-amber-50 rounded-xl"
                    >
                      <div class="bg-amber-100 rounded-full p-3 text-amber-700">
                        <i class="pi pi-exclamation-circle text-lg"></i>
                      </div>
                      <div>
                        <h4 class="font-medium text-gray-800 mb-1">
                          Restrictions
                        </h4>
                        <p class="text-gray-600">
                          {{ livestock.restrictions }}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </TabPanel>
            </TabView>
          </div>
        </div>

        <!-- Right column: Pricing & Seller Info -->
        <div class="lg:col-span-5">
          <!-- Mobile title (visible on smaller screens) -->
          <div class="lg:hidden mb-6">
            <h1 class="text-2xl font-bold text-gray-800 mb-3">
              {{ livestock.title }}
            </h1>
          </div>

          <!-- Price card -->
          <div
            class="bg-white rounded-2xl shadow-lg overflow-hidden mb-6 border border-gray-100"
          >
            <!-- Card Header with Image -->
            <div class="relative h-48 bg-gray-100">
              <img
                src="/src/assets/Bull.jpg"
                alt="Livestock"
                class="w-full h-full object-cover"
              />
              <div class="absolute top-0 right-0 m-4">
                <span
                  v-if="livestock.negotiable"
                  class="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-sm font-medium inline-flex items-center"
                >
                  <i class="pi pi-tag mr-1 text-xs"></i>
                  Negotiable
                </span>
              </div>
            </div>

            <div class="p-6">
              <!-- Title -->
              <h1 class="text-2xl font-bold text-gray-800 mb-3">
                {{ livestock.title }}
              </h1>

              <!-- Price and Availability -->
              <div class="flex justify-between items-center mb-6">
                <div>
                  <div class="text-sm text-gray-500 mb-1">Price per unit</div>
                  <div class="text-3xl font-bold text-gray-800">
                    ₱{{ formatPrice(livestock.price) }}
                  </div>
                </div>

                <div
                  v-if="livestock.quantity > 1"
                  class="bg-blue-50 text-blue-700 px-4 py-2 rounded-xl text-center"
                >
                  <div class="text-xs uppercase font-semibold tracking-wide">
                    Available
                  </div>
                  <div class="font-bold text-lg">{{ livestock.quantity }}</div>
                </div>
              </div>

              <!-- Key specs with icons -->
              <div class="grid grid-cols-3 gap-4 mb-6">
                <div
                  class="bg-gray-50 rounded-xl p-4 text-center flex flex-col items-center"
                >
                  <i class="pi pi-calendar text-gray-400 mb-2 text-lg"></i>
                  <div class="text-xs text-gray-500 mb-1">Age</div>
                  <div class="font-medium text-gray-800">
                    {{ livestock.age }} {{ livestock.ageUnit }}
                  </div>
                </div>
                <div
                  class="bg-gray-50 rounded-xl p-4 text-center flex flex-col items-center"
                >
                  <i class="pi pi-user text-gray-400 mb-2 text-lg"></i>
                  <div class="text-xs text-gray-500 mb-1">Gender</div>
                  <div class="font-medium text-gray-800">
                    {{ livestock.gender }}
                  </div>
                </div>
                <div
                  class="bg-gray-50 rounded-xl p-4 text-center flex flex-col items-center"
                >
                  <i class="pi pi-chart-bar text-gray-400 mb-2 text-lg"></i>
                  <div class="text-xs text-gray-500 mb-1">Weight</div>
                  <div class="font-medium text-gray-800">
                    {{ livestock.weight }} {{ livestock.weightUnit }}
                  </div>
                </div>
              </div>

              <!-- Quantity selector -->
              <div v-if="livestock.quantity > 1" class="mb-6">
                <label
                  class="text-sm font-medium text-gray-700 mb-2 flex items-center"
                >
                  <i class="pi pi-shopping-cart mr-2 text-gray-400"></i>
                  Select Quantity
                </label>
                <div class="flex items-center bg-gray-50 rounded-xl p-2">
                  <button
                    class="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-200 transition-colors"
                    @click="decrementQuantity"
                    :disabled="selectedQuantity <= 1"
                  >
                    <i
                      class="pi pi-minus"
                      :class="{ 'text-gray-400': selectedQuantity <= 1 }"
                    ></i>
                  </button>
                  <div class="flex-grow text-center font-medium text-lg">
                    {{ selectedQuantity }}
                  </div>
                  <button
                    class="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-200 transition-colors"
                    @click="incrementQuantity"
                    :disabled="selectedQuantity >= livestock.quantity"
                  >
                    <i
                      class="pi pi-plus"
                      :class="{
                        'text-gray-400': selectedQuantity >= livestock.quantity,
                      }"
                    ></i>
                  </button>
                </div>
                <div class="mt-2 text-sm text-gray-500 text-center">
                  (Maximum of {{ livestock.quantity }} units available)
                </div>
              </div>

              <!-- Total price calculation -->
              <div
                v-if="selectedQuantity > 1"
                class="mb-6 p-4 bg-emerald-50 rounded-xl border border-emerald-100"
              >
                <div class="flex justify-between items-center">
                  <span class="text-emerald-700 font-medium">Total Price:</span>
                  <span class="text-xl font-bold text-emerald-800"
                    >₱{{
                      formatPrice(livestock.price * selectedQuantity)
                    }}</span
                  >
                </div>
              </div>

              <!-- Action buttons -->
              <div class="grid grid-cols-2 gap-4">
                <button
                  class="py-3 px-4 bg-white border border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-colors flex items-center justify-center"
                >
                  <i class="pi pi-envelope mr-2"></i> Contact Seller
                </button>
                <button
                  class="py-3 px-4 bg-emerald-600 rounded-xl text-white font-medium hover:bg-emerald-700 transition-colors flex items-center justify-center"
                  @click="buyNow"
                >
                  <i class="pi pi-shopping-cart mr-2"></i> Buy Now
                </button>
              </div>
            </div>
          </div>

          <!-- Seller info card -->
          <SellerInfoCard
            :seller="seller"
            @view-profile="viewSellerProfile"
            @call-seller="callSeller"
          />

          <!-- Reviews Section -->
          <div class="bg-white rounded-lg shadow-sm overflow-hidden mb-6 mt-6">
            <div class="p-6">
              <!-- Header with Rating Summary -->
              <div
                class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8"
              >
                <h3 class="text-lg font-semibold text-gray-800">
                  Customer Reviews
                </h3>
                <div class="flex items-center">
                  <span class="text-2xl font-bold text-gray-800 mr-2">{{
                    seller.rating
                  }}</span>
                  <div class="flex flex-col">
                    <Rating
                      :modelValue="seller.rating"
                      :readonly="true"
                      :cancel="false"
                      :stars="5"
                      class="mb-1"
                    />
                    <span class="text-sm text-gray-500"
                      >{{ seller.reviewCount }} reviews</span
                    >
                  </div>
                </div>
              </div>

              <!-- Rating breakdown - Simplified -->
              <div class="mb-8">
                <div
                  v-for="star in 5"
                  :key="star"
                  class="flex items-center mb-2"
                >
                  <div class="w-8 text-sm text-gray-600">{{ 6 - star }}</div>
                  <div class="w-full bg-gray-100 rounded-full h-1.5 mx-2">
                    <div
                      class="bg-amber-400 h-1.5 rounded-full"
                      :style="{
                        width: `${
                          6 - star === 5 ? 70 : 6 - star === 4 ? 20 : 10 - star
                        }%`,
                      }"
                    ></div>
                  </div>
                  <div class="text-xs text-gray-500 w-8">
                    {{ 6 - star === 5 ? 70 : 6 - star === 4 ? 20 : 10 - star }}%
                  </div>
                </div>
              </div>

              <!-- Seller Response & History - Simplified -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <!-- Response metrics -->
                <div class="flex items-start space-x-6">
                  <div>
                    <div class="text-sm text-gray-500 mb-1">Response time</div>
                    <div class="font-medium text-gray-800">
                      {{ seller.responseTime }}
                    </div>
                  </div>
                  <div>
                    <div class="text-sm text-gray-500 mb-1">Response rate</div>
                    <div class="font-medium text-gray-800">98%</div>
                  </div>
                </div>

                <!-- Seller History -->
                <div class="flex items-start space-x-6">
                  <div>
                    <div class="text-sm text-gray-500 mb-1">Member since</div>
                    <div class="font-medium text-gray-800">
                      {{ seller.memberSince }}
                    </div>
                  </div>
                  <div>
                    <div class="text-sm text-gray-500 mb-1">Total listings</div>
                    <div class="font-medium text-gray-800">
                      {{ seller.totalListings }}
                    </div>
                  </div>
                </div>
              </div>

              <!-- Title with view all link -->
              <div class="flex justify-between items-center mb-4">
                <h4 class="font-medium text-gray-800">Recent Reviews</h4>
                <router-link
                  to="/main/Reviews"
                  class="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  View all {{ seller.reviewCount }} reviews
                </router-link>
              </div>

              <!-- Recent Reviews - Simplified -->
              <div class="space-y-6">
                <div
                  v-for="review in reviews.slice(0, 3)"
                  :key="review.id"
                  class="border-b border-gray-100 last:border-b-0 pb-6 last:pb-0"
                >
                  <div class="flex justify-between mb-3">
                    <div class="flex items-center">
                      <Avatar
                        :image="review.avatarUrl"
                        :label="review.username?.charAt(0)"
                        shape="circle"
                        class="mr-3"
                      />
                      <div>
                        <div class="font-medium text-gray-800">
                          {{ review.username }}
                        </div>
                        <div class="text-xs text-gray-500">
                          {{ formatDate(review.date) }}
                        </div>
                      </div>
                    </div>
                    <Rating
                      :modelValue="review.rating"
                      :readonly="true"
                      :cancel="false"
                    />
                  </div>
                  <p class="text-gray-600 pl-12">{{ review.comment }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Similar listings section -->
      <SimilarListings
        :listings="similarListings"
        @view-listing="viewListing"
      />

      <!-- Video dialog -->
      <Dialog
        v-model:visible="videoDialogVisible"
        modal
        header="Video Preview"
        class="w-full max-w-4xl"
        dismissableMask
      >
        <div class="p-4">
          <div class="aspect-w-16 aspect-h-9 rounded-xl overflow-hidden">
            <div
              class="flex items-center justify-center bg-gray-900 text-center p-10"
            >
              <span class="text-white text-lg"
                >Video playback would be implemented here</span
              >
            </div>
          </div>
        </div>
      </Dialog>

      <!-- Image gallery modal -->
      <Dialog
        v-model:visible="imageGalleryModalVisible"
        modal
        class="w-full max-w-6xl"
        dismissableMask
      >
        <template #header>
          <div class="flex justify-between items-center w-full">
            <h3 class="text-lg font-medium">Image Gallery</h3>
            <div class="text-sm text-gray-500">
              {{ activeImageIndex + 1 }} of {{ additionalImages.length }}
            </div>
          </div>
        </template>
        <div class="p-4 relative">
          <div class="aspect-w-16 aspect-h-9 rounded-xl overflow-hidden">
            <img
              :src="additionalImages[activeImageIndex]"
              :alt="`Image ${activeImageIndex + 1}`"
              class="w-full h-full object-contain"
            />
          </div>

          <!-- Navigation buttons -->
          <Button
            icon="pi pi-chevron-left"
            class="absolute top-1/2 left-8 -translate-y-1/2 p-button-rounded p-button-outlined bg-white/80"
            @click="prevImage"
          />
          <Button
            icon="pi pi-chevron-right"
            class="absolute top-1/2 right-8 -translate-y-1/2 p-button-rounded p-button-outlined bg-white/80"
            @click="nextImage"
          />
        </div>
        <template #footer>
          <div class="flex justify-center gap-2 p-2 overflow-x-auto">
            <div
              v-for="(image, index) in additionalImages"
              :key="index"
              @click="activeImageIndex = index"
              class="w-16 h-16 rounded overflow-hidden cursor-pointer border-2"
              :class="[
                activeImageIndex === index
                  ? 'border-emerald-500'
                  : 'border-transparent',
              ]"
            >
              <img
                :src="image"
                :alt="`Thumbnail ${index + 1}`"
                class="w-full h-full object-cover"
              />
            </div>
          </div>
        </template>
      </Dialog>
    </div>
  </div>
</template>
