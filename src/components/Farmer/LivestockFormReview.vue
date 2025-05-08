<script setup lang="ts">
import { computed, ref } from 'vue';
import { CheckIcon, PencilSquareIcon, MapPinIcon, 
  IdentificationIcon, ClipboardDocumentListIcon, TruckIcon, 
  DocumentTextIcon, PhotoIcon, HandRaisedIcon, CheckCircleIcon,
  ArrowRightIcon, PlayCircleIcon, XMarkIcon,
  ChevronLeftIcon, ChevronRightIcon } from '@heroicons/vue/24/outline';
import { CheckBadgeIcon } from '@heroicons/vue/24/solid';

// Define props
const props = defineProps({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  breed: { type: String, required: true },
  price: { type: Number as () => number | null, required: true },
  negotiable: { type: Boolean, required: true },
  quantity: { type: Number, required: true },
  age: { type: Number as () => number | null, required: true },
  ageUnit: { type: String, required: true },
  gender: { type: String, required: true },
  weight: { type: Number as () => number | null, required: true },
  weightUnit: { type: String, required: true },
  healthStatus: { type: String, required: true },
  feedingType: { type: String, required: true },
  detailedLocation: { type: String, required: true },
  deliveryOptions: { type: Array as () => string[], required: true },
  deliveryRestrictions: { type: String, required: true },
  maxDeliveryDistance: { type: Number as () => number | null, required: true },
  deliveryDistanceUnit: { type: String, required: true },
  certified: { type: Boolean, required: true },
  auction: { type: Boolean, required: true },
  availableImmediate: { type: Boolean, required: true },
  imagePreviewUrls: { type: Array as () => string[], required: true },
  videoPreview: { type: String as () => string | null, required: true },
  categoryOptions: { type: Array as () => { label: string; value: string; icon?: string }[], required: true },
  availableBreeds: { type: Array as () => { label: string; value: string }[], required: true }
});

// Define emits
const emit = defineEmits(['editForm', 'submitForm']);

// State for image gallery and video modal
const showFullGallery = ref(false);
const currentImageIndex = ref(0);
const showVideoModal = ref(false);
const videoLoaded = ref(false);
const videoError = ref(false);

// Computed properties
const getCategoryIcon = computed(() => 
  props.categoryOptions.find(cat => cat.value === props.category)?.icon || '🐄'
);

const getCategoryName = computed(() => 
  props.categoryOptions.find(cat => cat.value === props.category)?.label || ''
);

const getBreedName = computed(() => 
  props.availableBreeds.find(b => b.value === props.breed)?.label || ''
);

const formatPrice = (value: number | null) => 
  value === null ? "$0.00" : new Intl.NumberFormat('en-US', { 
    style: 'currency', 
    currency: 'USD' 
  }).format(value);

const getHealthStatusColor = (status: string) => ({
  excellent: 'text-emerald-600 bg-emerald-50', 
  good: 'text-green-600 bg-green-50', 
  fair: 'text-amber-600 bg-amber-50',
  poor: 'text-red-600 bg-red-50'
}[status.toLowerCase()] || 'text-gray-600 bg-gray-50');

const getDeliveryOptionLabel = (value: string) => {
  const labels = {
    'pickup-only': 'Pickup Only',
    'local-delivery': 'Local Delivery',
    'shipping': 'Shipping Available',
    'transport-service': 'Transport Service'
  };
  return labels[value as keyof typeof labels] || value;
};

const getDeliveryOptionIcon = (value: string) => {
  const icons = {
    'pickup-only': 'i-heroicons-home',
    'local-delivery': 'i-heroicons-truck',
    'shipping': 'i-heroicons-globe-americas',
    'transport-service': 'i-heroicons-truck-container'
  };
  return icons[value as keyof typeof icons] || '';
};

// Computed for main preview image
const mainPreviewImage = computed(() => {
  return props.imagePreviewUrls.length > 0 ? props.imagePreviewUrls[0] : undefined;
});

// Computed to check if there are any images
const hasImages = computed(() => {
  return props.imagePreviewUrls.length > 0;
});

// Display only max 5 images in the preview grid
// const imageGridItems = computed(() => {
//   const maxImagesShown = Math.min(props.imagePreviewUrls.length, 5);
//   return props.imagePreviewUrls.slice(0, maxImagesShown);
// });

// Check if the fifth image is the last one or if there are more images
const lastImageIsMore = computed(() => {
  return props.imagePreviewUrls.length > 5;
});

// Calculate how many additional images are not shown
const additionalImagesCount = computed(() => {
  return props.imagePreviewUrls.length - 4;
});

// Get the first 4 images for the main grid
const firstFourImages = computed(() => {
  return props.imagePreviewUrls.slice(0, 4);
});

// Get the 5th image for the grid, if it exists
const fifthImage = computed(() => {
  return props.imagePreviewUrls.length >= 5 ? props.imagePreviewUrls[4] : null;
});

// Functions to navigate through images in the gallery
const nextImage = () => {
  if (currentImageIndex.value < props.imagePreviewUrls.length - 1) {
    currentImageIndex.value++;
  } else {
    currentImageIndex.value = 0;
  }
};

const prevImage = () => {
  if (currentImageIndex.value > 0) {
    currentImageIndex.value--;
  } else {
    currentImageIndex.value = props.imagePreviewUrls.length - 1;
  }
};

// Open full gallery with specific image
const openGallery = (index: number) => {
  currentImageIndex.value = index;
  showFullGallery.value = true;
};

// Close full gallery
const closeGallery = () => {
  showFullGallery.value = false;
};

// Open video modal
const openVideoModal = () => {
  showVideoModal.value = true;
};

// Close video modal
const closeVideoModal = () => {
  showVideoModal.value = false;
  videoLoaded.value = false;
};

// Handle video load event
const handleVideoLoad = () => {
  videoLoaded.value = true;
};

// Handle video error
const handleVideoError = () => {
  videoError.value = true;
};

// Check if video format is supported
const isVideoFormatSupported = computed(() => {
  if (!props.videoPreview) return false;
  
  const videoExtension = props.videoPreview.split('.').pop()?.toLowerCase();
  return ['mp4', 'webm', 'ogg'].includes(videoExtension || '');
});

// Format video duration
// const formatVideoDuration = (seconds: number) => {
//   const mins = Math.floor(seconds / 60);
//   const secs = Math.floor(seconds % 60);
//   return `${mins}:${secs < 10 ? '0' + secs : secs}`;
// };

// Check if video preview is available
const hasVideoPreview = computed(() => {
  return props.videoPreview !== null && props.videoPreview !== '';
});

// Get video thumbnail (use first image if available, otherwise placeholder)
const videoThumbnail = computed(() => {
  return hasImages.value ? props.imagePreviewUrls[0] : null;
});
</script>

<template>
  <div class="p-4 md:p-8 bg-gray-50">
    <div class="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 md:mb-8 pb-5 border-b border-gray-200">
      <div class="flex items-center mb-4 md:mb-0">
        <span class="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white mr-4 shadow-md">
          <CheckIcon class="w-6 h-6" />
        </span>
        <div>
          <h2 class="text-2xl font-bold text-gray-800">Review Your Listing</h2>
          <p class="text-gray-500 text-sm">Verify all details before publishing</p>
        </div>
      </div>
      <button @click="emit('editForm')"
        class="text-green-600 hover:text-green-800 flex items-center text-sm font-medium bg-green-50 hover:bg-green-100 px-4 py-2 rounded-lg transition-colors shadow-sm">
        <PencilSquareIcon class="w-4 h-4 mr-2" />
        Edit Listing
      </button>
    </div>

    <!-- Review Content -->
    <div class="space-y-6 md:space-y-8">
      <!-- Preview card with image -->
      <div class="bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100 transition-all hover:shadow-xl">
        <div class="aspect-video bg-gray-100 relative">
          <!-- Only show the image if there are uploaded images -->
          <template v-if="hasImages">
            <img :src="mainPreviewImage" alt="Listing preview" class="w-full h-full object-cover" />
          </template>
          <!-- Show placeholder if no images were uploaded -->
          <div v-else class="w-full h-full flex items-center justify-center bg-gray-200">
            <PhotoIcon class="w-16 h-16 text-gray-400" />
          </div>

          <div class="absolute top-0 left-0 m-4 flex flex-col gap-2">
            <span class="px-3 py-1.5 rounded-full bg-gradient-to-r from-green-600 to-green-700 text-white text-sm font-medium shadow-md">
              {{ getCategoryName }}
            </span>
            <span v-if="certified"
              class="px-3 py-1.5 rounded-full bg-blue-600 bg-opacity-90 text-white text-sm font-medium shadow-md flex items-center">
              <CheckBadgeIcon class="w-4 h-4 mr-1" />
              Certified
            </span>
          </div>
          <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
            <h3 class="font-bold text-xl md:text-2xl text-white">{{ title }}</h3>
            <div class="flex items-center gap-3 mt-1">
              <span class="font-bold text-lg md:text-xl text-white">{{ formatPrice(price) }}</span>
              <span v-if="negotiable"
                class="text-xs bg-green-100 bg-opacity-90 rounded-full px-3 py-1 text-green-800 font-medium">Negotiable</span>
            </div>
          </div>
        </div>
        <div class="p-4 md:p-6">
          <div class="flex items-center justify-between">
            <div class="flex items-center text-gray-600">
              <MapPinIcon class="w-4 h-4 mr-2 text-green-600" />
              <span class="text-sm md:text-base">{{ detailedLocation }}</span>
            </div>
            <div class="flex items-center gap-2">
              <span v-if="auction"
                class="text-xs bg-amber-100 rounded-full px-3 py-1 text-amber-800 font-medium flex items-center">
                <HandRaisedIcon class="w-3 h-3 mr-1" />
                Auction
              </span>
              <span v-if="availableImmediate"
                class="text-xs bg-blue-100 rounded-full px-3 py-1 text-blue-800 font-medium">
                Available Now
              </span>
            </div>
          </div>

          <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            <div class="bg-gray-50 p-3 rounded-lg text-center">
              <span class="text-xs text-gray-500 block">Breed</span>
              <span class="font-medium text-gray-800">{{ getBreedName }}</span>
            </div>
            <div class="bg-gray-50 p-3 rounded-lg text-center">
              <span class="text-xs text-gray-500 block">Age</span>
              <span class="font-medium text-gray-800">{{ age !== null ? `${age} ${ageUnit}` : '—' }}</span>
            </div>
            <div class="bg-gray-50 p-3 rounded-lg text-center">
              <span class="text-xs text-gray-500 block">Gender</span>
              <span class="font-medium text-gray-800">{{ gender ? gender.charAt(0).toUpperCase() + gender.slice(1) : '—' }}</span>
            </div>
            <div class="bg-gray-50 p-3 rounded-lg text-center">
              <span class="text-xs text-gray-500 block">Health</span>
              <span :class="[healthStatus ? getHealthStatusColor(healthStatus) : '', 'font-medium px-2 py-0.5 rounded-full text-xs']">
                {{ healthStatus ? healthStatus.charAt(0).toUpperCase() + healthStatus.slice(1) : '—' }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div class="md:grid md:grid-cols-3 gap-6 space-y-6 md:space-y-0">
        <!-- Left column: Basic Info & Physical Details -->
        <div class="md:col-span-2 space-y-6">
          <!-- Basic Info Section -->
          <div class="review-section bg-white p-5 md:p-6 rounded-xl shadow-md border border-gray-100">
            <h3 class="text-lg font-bold text-gray-800 flex items-center mb-4 pb-2 border-b border-gray-100">
              <IdentificationIcon class="w-5 h-5 mr-2 text-green-600" />
              Basic Information
            </h3>
            <div class="grid grid-cols-2 gap-6">
              <div>
                <span class="text-sm font-medium text-gray-500 block mb-1">Category</span>
                <div class="flex items-center">
                  <span class="text-2xl mr-2">{{ getCategoryIcon }}</span>
                  <span class="font-medium text-gray-800">{{ getCategoryName }}</span>
                </div>
              </div>
              <div>
                <span class="text-sm font-medium text-gray-500 block mb-1">Breed</span>
                <span class="font-medium text-gray-800">{{ getBreedName }}</span>
              </div>
              <div>
                <span class="text-sm font-medium text-gray-500 block mb-1">Quantity</span>
                <span class="font-medium text-gray-800">{{ quantity }}</span>
              </div>
              <div>
                <span class="text-sm font-medium text-gray-500 block mb-1">Features</span>
                <div class="flex flex-wrap gap-2">
                  <span v-if="certified"
                    class="py-1 px-3 rounded-full bg-blue-100 text-blue-800 text-xs font-medium flex items-center">
                    <CheckBadgeIcon class="w-3 h-3 mr-1" />
                    Certified
                  </span>
                  <span v-if="auction"
                    class="py-1 px-3 rounded-full bg-amber-100 text-amber-800 text-xs font-medium flex items-center">
                    <HandRaisedIcon class="w-3 h-3 mr-1" />
                    Auction
                  </span>
                  <span v-if="availableImmediate"
                    class="py-1 px-3 rounded-full bg-blue-100 text-blue-800 text-xs font-medium">Available Now</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Physical Details Section -->
          <div class="review-section bg-white p-5 md:p-6 rounded-xl shadow-md border border-gray-100">
            <h3 class="text-lg font-bold text-gray-800 flex items-center mb-4 pb-2 border-b border-gray-100">
              <ClipboardDocumentListIcon class="w-5 h-5 mr-2 text-green-600" />
              Physical Characteristics
            </h3>
            <div class="grid grid-cols-2 md:grid-cols-3 gap-6">
              <div>
                <span class="text-sm font-medium text-gray-500 block mb-1">Age</span>
                <span class="font-medium text-gray-800">{{ age !== null ? `${age} ${ageUnit}` : '—' }}</span>
              </div>
              <div>
                <span class="text-sm font-medium text-gray-500 block mb-1">Gender</span>
                <span class="font-medium text-gray-800">{{ gender ? gender.charAt(0).toUpperCase() + gender.slice(1) : '—' }}</span>
              </div>
              <div>
                <span class="text-sm font-medium text-gray-500 block mb-1">Weight</span>
                <span class="font-medium text-gray-800">{{ weight !== null ? `${weight} ${weightUnit}` : '—' }}</span>
              </div>
              <div>
                <span class="text-sm font-medium text-gray-500 block mb-1">Health Status</span>
                <span :class="[healthStatus ? getHealthStatusColor(healthStatus) : '', 'font-medium px-3 py-1 rounded-full inline-block']">
                  {{ healthStatus ? healthStatus.charAt(0).toUpperCase() + healthStatus.slice(1) : '—' }}
                </span>
              </div>
              <div>
                <span class="text-sm font-medium text-gray-500 block mb-1">Feeding Type</span>
                <span class="font-medium text-gray-800">{{ feedingType || '—' }}</span>
              </div>
            </div>
          </div>

          <!-- Description Section -->
          <div class="review-section bg-white p-5 md:p-6 rounded-xl shadow-md border border-gray-100">
            <h3 class="text-lg font-bold text-gray-800 flex items-center mb-4 pb-2 border-b border-gray-100">
              <DocumentTextIcon class="w-5 h-5 mr-2 text-green-600" />
              Description
            </h3>
            <p class="text-gray-700 whitespace-pre-line leading-relaxed">{{ description }}</p>
          </div>

          <!-- Enhanced Media Gallery -->
          <div class="review-section bg-white p-5 md:p-6 rounded-xl shadow-md border border-gray-100">
            <h3 class="text-lg font-bold text-gray-800 flex items-center mb-4 pb-2 border-b border-gray-100">
              <PhotoIcon class="w-5 h-5 mr-2 text-green-600" />
              Media Gallery
            </h3>

            <!-- No Media Message -->
            <div v-if="!hasImages && !hasVideoPreview" class="text-center py-8 bg-gray-50 rounded-lg">
              <PhotoIcon class="w-12 h-12 mx-auto text-gray-400 mb-2" />
              <p class="text-gray-500">No media has been uploaded for this listing</p>
            </div>

            <!-- Enhanced Image Gallery with limit of 5 -->
            <div v-if="hasImages" class="mb-6">
              <div class="flex justify-between items-center mb-3">
                <h4 class="text-sm font-medium text-gray-700">Images ({{ imagePreviewUrls.length }})</h4>
                <button v-if="imagePreviewUrls.length > 1" @click="openGallery(0)" 
                  class="text-green-600 hover:text-green-700 text-sm font-medium flex items-center">
                  View All <ArrowRightIcon class="w-4 h-4 ml-1" />
                </button>
              </div>
              
              <!-- Responsive image grid with special 5th image handling -->
              <div class="grid grid-cols-4 gap-3">
                <!-- First 4 images in a 2x2 grid, taking up 75% of the space -->
                <div v-for="(url, index) in firstFourImages" :key="index"
                  @click="openGallery(index)"
                  class="aspect-square rounded-lg overflow-hidden border border-gray-200 shadow-sm cursor-pointer hover:shadow-md transition-all duration-300"
                  :class="{ 'col-span-2 row-span-2': index === 0, 'col-span-1': index > 0 }">
                  <img :src="url" class="w-full h-full object-cover" :alt="`Listing image ${index + 1}`" />
                </div>

                <!-- 5th image (if exists) OR "more images" indicator -->
                <div v-if="fifthImage || lastImageIsMore" 
                  @click="openGallery(4)"
                  class="aspect-square rounded-lg overflow-hidden border border-gray-200 shadow-sm cursor-pointer hover:shadow-md transition-all duration-300 relative">
                  <img v-if="fifthImage" :src="fifthImage" class="w-full h-full object-cover" alt="Listing image 5" />
                  <div v-if="lastImageIsMore" class="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
                    <div class="text-white text-center">
                      <span class="block text-xl font-bold">+{{ additionalImagesCount }}</span>
                      <span class="text-sm">more</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Enhanced Video Section -->
            <div v-if="hasVideoPreview" class="mt-6">
              <h4 class="text-sm font-medium text-gray-700 mb-3">Video</h4>
              <div class="aspect-video rounded-xl overflow-hidden shadow-md border border-gray-200 relative group">
                <!-- Video thumbnail - use first image if available, otherwise show placeholder -->
                <template v-if="videoThumbnail">
                  <img :src="videoThumbnail" class="w-full h-full object-cover filter brightness-75" alt="Video thumbnail" />
                </template>
                <div v-else class="w-full h-full bg-gray-200 flex items-center justify-center">
                  <PlayCircleIcon class="w-16 h-16 text-gray-400" />
                </div>
                
                <div class="absolute inset-0 flex items-center justify-center" @click="openVideoModal">
                  <div class="w-16 h-16 rounded-full bg-white bg-opacity-80 flex items-center justify-center group-hover:bg-opacity-100 transition-all duration-300 cursor-pointer">
                    <PlayCircleIcon class="w-12 h-12 text-green-600" />
                  </div>
                </div>
                
                <div class="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 to-transparent">
                  <div class="flex items-center justify-between">
                    <span class="text-white font-medium">Watch video</span>
                    <span class="bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded-full">
                      Preview
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right column: Delivery Options -->
        <div class="space-y-6">
          <!-- Price Card -->
          <div class="review-section bg-white p-5 md:p-6 rounded-xl shadow-md border border-gray-100">
            <div class="flex flex-col items-center text-center p-4">
              <span class="text-sm font-medium text-gray-500 mb-2">Price</span>
              <span class="font-bold text-3xl text-green-700">{{ formatPrice(price) }}</span>
              <div class="flex mt-2">
                <span v-if="negotiable" class="text-xs bg-green-100 rounded-full px-3 py-1 text-green-800 font-medium mr-2">Negotiable</span>
                <span v-if="auction" class="text-xs bg-amber-100 rounded-full px-3 py-1 text-amber-800 font-medium flex items-center">
                  <HandRaisedIcon class="w-3 h-3 mr-1" />
                  Auction
                </span>
              </div>
              <button @click="emit('submitForm')"
                class="w-full mt-6 px-6 py-3 rounded-xl bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white transition-colors shadow-md font-bold flex items-center justify-center">
                <CheckCircleIcon class="w-5 h-5 mr-2" />
                Submit Listing
              </button>
            </div>
          </div>

          <!-- Delivery Section -->
          <div class="review-section bg-white p-5 md:p-6 rounded-xl shadow-md border border-gray-100">
            <h3 class="text-lg font-bold text-gray-800 flex items-center mb-4 pb-2 border-b border-gray-100">
              <TruckIcon class="w-5 h-5 mr-2 text-green-600" />
              Delivery Options
            </h3>
            <div class="space-y-4">
              <div class="flex flex-col gap-2">
                <span v-for="option in deliveryOptions" :key="option"
                  class="py-2 px-4 rounded-lg bg-green-50 text-green-700 flex items-center text-sm font-medium">
                  <span v-if="getDeliveryOptionIcon(option)" :class="getDeliveryOptionIcon(option)" class="mr-2"></span>
                  <span v-else class="w-5 h-5 mr-2 text-green-600">
                    <TruckIcon class="w-5 h-5" />
                  </span>
                  {{ getDeliveryOptionLabel(option) }}
                </span>
              </div>

              <div v-if="deliveryOptions.includes('local-delivery') && maxDeliveryDistance !== null"
                class="mt-4 bg-gray-50 p-4 rounded-lg">
                <span class="text-gray-700">Maximum delivery distance:</span>
                <span class="text-green-700 font-bold ml-2">{{ maxDeliveryDistance }} {{ deliveryDistanceUnit }}</span>
              </div>

              <div v-if="deliveryRestrictions" class="mt-4">
                <span class="text-sm font-medium text-gray-500 block mb-2">Delivery Notes:</span>
                <p class="text-gray-700 bg-gray-50 p-4 rounded-lg border border-gray-200">{{ deliveryRestrictions }}</p>
              </div>
            </div>
          </div>

          <!-- Location Card -->
          <div class="review-section bg-white p-5 md:p-6 rounded-xl shadow-md border border-gray-100">
            <h3 class="text-lg font-bold text-gray-800 flex items-center mb-4 pb-2 border-b border-gray-100">
              <MapPinIcon class="w-5 h-5 mr-2 text-green-600" />
              Location
            </h3>
            <div class="bg-gray-100 rounded-lg p-4 flex items-center">
              <MapPinIcon class="w-5 h-5 text-green-600 mr-2 flex-shrink-0" />
              <span class="text-gray-800">{{ detailedLocation }}</span>
            </div>
            <div class="mt-4 bg-gray-50 rounded-lg h-40 flex items-center justify-center border border-gray-200">
              <span class="text-gray-500 text-sm">Location Map Preview</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Submit section -->
      <div class="pt-6 border-t border-gray-200">
        <div class="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
          <button @click="emit('editForm')"
            class="order-2 md:order-1 px-6 py-3 rounded-xl bg-white text-green-700 border border-green-200 hover:bg-green-50 transition-colors shadow-sm font-medium flex items-center">
            <PencilSquareIcon class="w-5 h-5 mr-2" />
            Edit Listing
          </button>

          <button @click="emit('submitForm')"
            class="order-1 md:order-2 w-full md:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white transition-colors shadow-lg font-bold flex items-center justify-center">
            <CheckCircleIcon class="w-5 h-5 mr-2" />
            Submit Listing
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Full Image Gallery Modal -->
  <div v-if="showFullGallery" class="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
    <div class="relative w-full max-w-4xl">
      <!-- Close button -->
      <button @click="closeGallery"
        class="absolute top-4 right-4 bg-black bg-opacity-50 rounded-full p-2 text-white hover:bg-opacity-70 z-10">
        <XMarkIcon class="w-6 h-6" />
      </button>

      <!-- Main image -->
      <div class="relative">
        <img :src="props.imagePreviewUrls[currentImageIndex]" alt="Listing image"
          class="w-full object-contain max-h-[80vh] rounded-lg" />
        
        <!-- Navigation arrows -->
        <button v-if="props.imagePreviewUrls.length > 1" @click="prevImage"
          class="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 rounded-full p-3 text-white hover:bg-opacity-70">
          <ChevronLeftIcon class="w-6 h-6" />
        </button>
        <button v-if="props.imagePreviewUrls.length > 1" @click="nextImage"
          class="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 rounded-full p-3 text-white hover:bg-opacity-70">
          <ChevronRightIcon class="w-6 h-6" />
        </button>
      </div>

      <!-- Image counter -->
      <div class="text-center mt-4 text-white">
        {{ currentImageIndex + 1 }} / {{ props.imagePreviewUrls.length }}
      </div>

      <!-- Thumbnail navigation -->
      <div v-if="props.imagePreviewUrls.length > 1" class="mt-4 flex gap-2 overflow-x-auto pb-2">
        <div v-for="(url, index) in props.imagePreviewUrls" :key="index"
          @click="currentImageIndex = index"
          class="w-20 h-20 flex-shrink-0 rounded-md overflow-hidden cursor-pointer border-2 transition-all"
          :class="currentImageIndex === index ? 'border-green-500' : 'border-transparent'">
          <img :src="url" class="w-full h-full object-cover" :alt="`Thumbnail ${index + 1}`" />
        </div>
      </div>
    </div>
  </div>

  <!-- Video Modal -->
  <div v-if="showVideoModal" class="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
    <div class="relative w-full max-w-4xl">
      <!-- Close button -->
      <button @click="closeVideoModal"
        class="absolute top-4 right-4 bg-black bg-opacity-50 rounded-full p-2 text-white hover:bg-opacity-70 z-10">
        <XMarkIcon class="w-6 h-6" />
      </button>

      <!-- Video player -->
      <div class="relative bg-black rounded-lg overflow-hidden aspect-video">
        <video 
          v-if="props.videoPreview && isVideoFormatSupported" 
          controls
          @loadeddata="handleVideoLoad"
          @error="handleVideoError"
          class="w-full h-full"
          :class="{ 'hidden': !videoLoaded }">
          <source :src="props.videoPreview" :type="`video/${props.videoPreview.split('.').pop()}`">
          Your browser does not support the video tag.
        </video>
        
        <!-- Loading state -->
        <div v-if="!videoLoaded && !videoError" class="absolute inset-0 flex items-center justify-center">
          <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
        </div>
        
        <!-- Error state -->
        <div v-if="videoError" class="absolute inset-0 flex items-center justify-center flex-col text-white">
          <XMarkIcon class="w-12 h-12 text-red-500 mb-2" />
          <p>Unable to load video</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Custom scrollbar for thumbnail navigation */
::-webkit-scrollbar {
  height: 8px;
}

::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.5);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.7);
}
</style>