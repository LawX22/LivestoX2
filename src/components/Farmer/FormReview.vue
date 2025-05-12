<script setup lang="ts">
import { ref, computed } from 'vue';
import {
  CheckCircleIcon,
  PencilIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  PhotoIcon,
  TruckIcon,
  IdentificationIcon,
  CurrencyDollarIcon,
  ClipboardDocumentListIcon,
  MapPinIcon,
  TagIcon,
  ShieldCheckIcon,
  ClockIcon
} from '@heroicons/vue/24/solid';

// Props to receive all form data for review
const props = defineProps({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  breed: { type: String, required: true },
  price: { type: Number, default: null },
  negotiable: { type: Boolean, default: false },
  quantity: { type: Number, default: 1 },
  age: { type: Number, default: null },
  ageUnit: { type: String, default: 'months' },
  gender: { type: String, default: '' },
  weight: { type: Number, default: null },
  weightUnit: { type: String, default: 'lbs' },
  healthStatus: { type: String, default: '' },
  feedingType: { type: String, default: '' },
  detailedLocation: { type: String, required: true },
  deliveryOptions: { type: Array as () => string[], default: () => [] },
  deliveryRestrictions: { type: String, default: '' },
  maxDeliveryDistance: { type: Number, default: null },
  deliveryDistanceUnit: { type: String, default: 'miles' },
  certified: { type: Boolean, default: false },
  auction: { type: Boolean, default: false },
  availableImmediate: { type: Boolean, default: false },
  imagePreviewUrls: { type: Array as () => string[], default: () => [] },
  videoPreview: { type: String, default: '' },
  categoryOptions: { type: Array as () => { value: string; label: string; icon?: string }[], required: true },
  availableBreeds: { type: Array as () => { value: string; label: string }[], required: true }
});

// Emits for form actions
const emit = defineEmits(['editForm', 'submitForm']);

// UI state for accordion sections
const expandedSections = ref({
  basicInfo: true,
  pricing: true,
  details: true,
  location: true,
  media: true
});

// Toggle section visibility
const toggleSection = (section: string) => {
  expandedSections.value[section as keyof typeof expandedSections.value] = 
    !expandedSections.value[section as keyof typeof expandedSections.value];
};

// Helper computed properties
const getCategoryLabel = computed(() => {
  const category = props.categoryOptions.find((cat: { value: string; label: string }) => cat.value === props.category);
  return category ? category.label : props.category;
});

const getBreedLabel = computed(() => {
  const breed = props.availableBreeds.find((b: { value: string; label: string }) => b.value === props.breed);
  return breed ? breed.label : props.breed;
});

const getCategoryIcon = computed(() => {
  const category = props.categoryOptions.find(cat => cat.value === props.category);
  return category ? category.icon : '🐄';
});

// Format price with currency symbol
const formattedPrice = computed(() => {
  if (props.price === null) return 'Not specified';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(props.price);
});

// Handle edit and submit
const handleEditForm = () => {
  emit('editForm');
};

const handleSubmitForm = () => {
  emit('submitForm');
};

// Format physical characteristics
const formattedAge = computed(() => {
  if (!props.age) return 'Not specified';
  return `${props.age} ${props.ageUnit}`;
});

const formattedWeight = computed(() => {
  if (!props.weight) return 'Not specified';
  return `${props.weight} ${props.weightUnit}`;
});

const formattedDelivery = computed(() => {
  if (props.deliveryOptions.length === 0) return 'No delivery options specified';
  
  let result = props.deliveryOptions.join(', ');
  
  if (props.maxDeliveryDistance) {
    result += ` (up to ${props.maxDeliveryDistance} ${props.deliveryDistanceUnit})`;
  }
  
  return result;
});
</script>

<template>
  <div class="p-6 md:p-8">
    <!-- Review Header -->
    <div class="text-center mb-8">
      <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 mb-4">
        <CheckCircleIcon class="w-10 h-10 text-emerald-600" />
      </div>
      <h2 class="text-2xl font-bold text-gray-800 mb-2">Review Your Listing</h2>
      <p class="text-gray-600 max-w-lg mx-auto">
        Please review all information carefully before submitting your livestock listing. 
        You can edit any section by clicking the edit button.
      </p>
    </div>

    <!-- Listing Preview Card -->
    <div class="bg-white rounded-xl shadow-md border border-gray-200 mb-8 overflow-hidden">
      <!-- Title Card with Media Preview -->
      <div class="relative">
        <div class="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-black to-transparent opacity-50 z-10"></div>
        
        <!-- Image Gallery/Preview -->
        <div v-if="imagePreviewUrls.length > 0" class="h-56 overflow-hidden bg-gray-100">
          <div class="h-full flex gap-1 overflow-x-auto">
            <div v-for="(url, index) in imagePreviewUrls.slice(0, 3)" :key="index" 
                class="h-full min-w-[50%] md:min-w-[33%] flex-shrink-0 relative">
              <img :src="url" alt="Livestock image" class="h-full w-full object-cover">
              <div v-if="index === 2 && imagePreviewUrls.length > 3" 
                  class="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <span class="text-white font-bold text-lg">+{{ imagePreviewUrls.length - 3 }} more</span>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="h-56 bg-gradient-to-r from-emerald-400 to-green-500 flex items-center justify-center">
          <PhotoIcon class="w-16 h-16 text-white opacity-50" />
        </div>
        
        <!-- Main Listing Info -->
        <div class="relative z-20 -mt-30 mx-5">
          <div class="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div class="flex justify-between items-start mb-3">
              <h1 class="text-xl font-bold text-gray-800 mr-4 break-words flex-grow">{{ title }}</h1>
              <span class="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-sm font-medium flex items-center whitespace-nowrap">
                <span v-html="getCategoryIcon"></span>
                <span class="ml-1">{{ getCategoryLabel }}</span>
              </span>
            </div>
            
            <div class="flex flex-wrap items-center gap-3 text-sm text-gray-600 mb-4">
              <span class="flex items-center gap-1">
                <TagIcon class="w-4 h-4 text-emerald-500" />
                {{ getBreedLabel }}
              </span>
              <span v-if="gender" class="flex items-center gap-1">
                <IdentificationIcon class="w-4 h-4 text-emerald-500" />
                {{ gender }}
              </span>
              <span v-if="age" class="flex items-center gap-1">
                <ClockIcon class="w-4 h-4 text-emerald-500" />
                {{ formattedAge }}
              </span>
              <span v-if="quantity > 1" class="flex items-center gap-1 bg-gray-100 px-2 py-0.5 rounded-full">
                × {{ quantity }} available
              </span>
            </div>
            
            <!-- Price Banner -->
            <div class="bg-emerald-50 -mx-6 px-6 py-3 border-y border-emerald-100 flex items-center justify-between mb-4">
              <div>
                <div class="text-2xl font-bold text-emerald-700">{{ formattedPrice }}</div>
                <div v-if="negotiable" class="text-xs text-emerald-600">Price negotiable</div>
              </div>
              <div class="flex flex-col items-end">
                <div class="flex items-center gap-2">
                  <span v-if="availableImmediate" class="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full flex items-center">
                    <CheckCircleIcon class="w-3 h-3 mr-1" />
                    Available Now
                  </span>
                  <span v-if="auction" class="bg-amber-100 text-amber-700 text-xs px-2 py-1 rounded-full">Auction</span>
                </div>
                <div v-if="certified" class="flex items-center text-emerald-700 text-xs mt-1">
                  <ShieldCheckIcon class="w-3 h-3 mr-1" />
                  Certified
                </div>
              </div>
            </div>
            
            <!-- Location & Delivery -->
            <div class="mb-4 flex items-start">
              <MapPinIcon class="w-5 h-5 text-gray-500 mt-0.5 mr-2 flex-shrink-0" />
              <div>
                <div class="text-gray-700">{{ detailedLocation }}</div>
                <div v-if="deliveryOptions.length > 0" class="flex items-center text-sm text-gray-600 mt-1">
                  <TruckIcon class="w-4 h-4 text-emerald-500 mr-1" />
                  {{ formattedDelivery }}
                </div>
              </div>
            </div>
            
            <!-- Description Preview -->
            <div class="text-gray-700 mb-4 text-sm">
              {{ description.length > 150 ? `${description.substring(0, 150)}...` : description }}
            </div>
            
            <!-- Tags & Attributes -->
            <div class="flex flex-wrap gap-2 mb-4">
              <span v-if="healthStatus" class="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs">
                Health: {{ healthStatus }}
              </span>
              <span v-if="feedingType" class="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs">
                Feed: {{ feedingType }}
              </span>
              <span v-if="weight" class="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs">
                {{ formattedWeight }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Detailed Review Sections -->
    <div class="space-y-4 mb-8">
      <!-- Basic Info Section -->
      <div class="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm">
        <button @click="toggleSection('basicInfo')" 
            class="w-full flex items-center justify-between bg-gray-50 p-4 focus:outline-none">
          <div class="flex items-center">
            <IdentificationIcon class="w-5 h-5 text-emerald-600 mr-3" />
            <h3 class="font-medium text-gray-700">Basic Information</h3>
          </div>
          <ChevronUpIcon v-if="expandedSections.basicInfo" class="w-5 h-5 text-gray-500" />
          <ChevronDownIcon v-else class="w-5 h-5 text-gray-500" />
        </button>
        
        <div v-if="expandedSections.basicInfo" class="p-5 border-t border-gray-200">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div class="mb-4">
                <h4 class="text-sm font-medium text-gray-500 mb-1">Title</h4>
                <p class="text-gray-800">{{ title }}</p>
              </div>
              <div class="mb-4">
                <h4 class="text-sm font-medium text-gray-500 mb-1">Category</h4>
                <p class="text-gray-800">{{ getCategoryLabel }}</p>
              </div>
              <div>
                <h4 class="text-sm font-medium text-gray-500 mb-1">Breed</h4>
                <p class="text-gray-800">{{ getBreedLabel }}</p>
              </div>
            </div>
            <div>
              <div class="mb-4">
                <h4 class="text-sm font-medium text-gray-500 mb-1">Quantity</h4>
                <p class="text-gray-800">{{ quantity }}</p>
              </div>
              <div>
                <h4 class="text-sm font-medium text-gray-500 mb-1">Description</h4>
                <p class="text-gray-800 whitespace-pre-line">{{ description }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Pricing Section -->
      <div class="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm">
        <button @click="toggleSection('pricing')" 
            class="w-full flex items-center justify-between bg-gray-50 p-4 focus:outline-none">
          <div class="flex items-center">
            <CurrencyDollarIcon class="w-5 h-5 text-emerald-600 mr-3" />
            <h3 class="font-medium text-gray-700">Pricing & Availability</h3>
          </div>
          <ChevronUpIcon v-if="expandedSections.pricing" class="w-5 h-5 text-gray-500" />
          <ChevronDownIcon v-else class="w-5 h-5 text-gray-500" />
        </button>
        
        <div v-if="expandedSections.pricing" class="p-5 border-t border-gray-200">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div class="mb-4">
                <h4 class="text-sm font-medium text-gray-500 mb-1">Price</h4>
                <p class="text-gray-800">{{ formattedPrice }}</p>
              </div>
              <div>
                <h4 class="text-sm font-medium text-gray-500 mb-1">Negotiable</h4>
                <p class="text-gray-800">{{ negotiable ? 'Yes' : 'No' }}</p>
              </div>
            </div>
            <div>
              <div class="mb-4">
                <h4 class="text-sm font-medium text-gray-500 mb-1">Available Immediately</h4>
                <p class="text-gray-800">{{ availableImmediate ? 'Yes' : 'No' }}</p>
              </div>
              <div>
                <h4 class="text-sm font-medium text-gray-500 mb-1">Auction Listing</h4>
                <p class="text-gray-800">{{ auction ? 'Yes' : 'No' }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Details Section -->
      <div class="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm">
        <button @click="toggleSection('details')" 
            class="w-full flex items-center justify-between bg-gray-50 p-4 focus:outline-none">
          <div class="flex items-center">
            <ClipboardDocumentListIcon class="w-5 h-5 text-emerald-600 mr-3" />
            <h3 class="font-medium text-gray-700">Physical Characteristics</h3>
          </div>
          <ChevronUpIcon v-if="expandedSections.details" class="w-5 h-5 text-gray-500" />
          <ChevronDownIcon v-else class="w-5 h-5 text-gray-500" />
        </button>
        
        <div v-if="expandedSections.details" class="p-5 border-t border-gray-200">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div class="mb-4">
                <h4 class="text-sm font-medium text-gray-500 mb-1">Age</h4>
                <p class="text-gray-800">{{ formattedAge }}</p>
              </div>
              <div class="mb-4">
                <h4 class="text-sm font-medium text-gray-500 mb-1">Gender</h4>
                <p class="text-gray-800">{{ gender || 'Not specified' }}</p>
              </div>
              <div>
                <h4 class="text-sm font-medium text-gray-500 mb-1">Weight</h4>
                <p class="text-gray-800">{{ formattedWeight }}</p>
              </div>
            </div>
            <div>
              <div class="mb-4">
                <h4 class="text-sm font-medium text-gray-500 mb-1">Health Status</h4>
                <p class="text-gray-800">{{ healthStatus || 'Not specified' }}</p>
              </div>
              <div>
                <h4 class="text-sm font-medium text-gray-500 mb-1">Feeding Type</h4>
                <p class="text-gray-800">{{ feedingType || 'Not specified' }}</p>
              </div>
              <div>
                <h4 class="text-sm font-medium text-gray-500 mb-1">Certified</h4>
                <p class="text-gray-800">{{ certified ? 'Yes' : 'No' }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Location Section -->
      <div class="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm">
        <button @click="toggleSection('location')" 
            class="w-full flex items-center justify-between bg-gray-50 p-4 focus:outline-none">
          <div class="flex items-center">
            <MapPinIcon class="w-5 h-5 text-emerald-600 mr-3" />
            <h3 class="font-medium text-gray-700">Location & Delivery</h3>
          </div>
          <ChevronUpIcon v-if="expandedSections.location" class="w-5 h-5 text-gray-500" />
          <ChevronDownIcon v-else class="w-5 h-5 text-gray-500" />
        </button>
        
        <div v-if="expandedSections.location" class="p-5 border-t border-gray-200">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div class="mb-4">
                <h4 class="text-sm font-medium text-gray-500 mb-1">Location</h4>
                <p class="text-gray-800">{{ detailedLocation }}</p>
              </div>
              <div>
                <h4 class="text-sm font-medium text-gray-500 mb-1">Delivery Options</h4>
                <p class="text-gray-800">{{ deliveryOptions.length > 0 ? deliveryOptions.join(', ') : 'None' }}</p>
              </div>
            </div>
            <div>
              <div class="mb-4">
                <h4 class="text-sm font-medium text-gray-500 mb-1">Max Delivery Distance</h4>
                <p class="text-gray-800">{{ maxDeliveryDistance ? `${maxDeliveryDistance} ${deliveryDistanceUnit}` : 'Not specified' }}</p>
              </div>
              <div>
                <h4 class="text-sm font-medium text-gray-500 mb-1">Delivery Restrictions</h4>
                <p class="text-gray-800">{{ deliveryRestrictions || 'None' }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Media Section -->
      <div class="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm">
        <button @click="toggleSection('media')" 
            class="w-full flex items-center justify-between bg-gray-50 p-4 focus:outline-none">
          <div class="flex items-center">
            <PhotoIcon class="w-5 h-5 text-emerald-600 mr-3" />
            <h3 class="font-medium text-gray-700">Photos & Videos</h3>
          </div>
          <ChevronUpIcon v-if="expandedSections.media" class="w-5 h-5 text-gray-500" />
          <ChevronDownIcon v-else class="w-5 h-5 text-gray-500" />
        </button>
        
        <div v-if="expandedSections.media" class="p-5 border-t border-gray-200">
          <!-- Images -->
          <div class="mb-5">
            <h4 class="text-sm font-medium text-gray-500 mb-3">Photos ({{ imagePreviewUrls.length }})</h4>
            <div v-if="imagePreviewUrls.length > 0" class="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div v-for="(url, index) in imagePreviewUrls" :key="index" 
                  class="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                <img :src="url" alt="Livestock image" class="w-full h-full object-cover">
              </div>
            </div>
            <div v-else class="text-gray-500 text-sm italic">No images uploaded</div>
          </div>
          
          <!-- Video -->
          <div>
            <h4 class="text-sm font-medium text-gray-500 mb-3">Video</h4>
            <div v-if="videoPreview" class="aspect-video bg-gray-100 rounded-lg overflow-hidden">
              <video controls class="w-full h-full">
                <source :src="videoPreview" type="video/mp4">
                Your browser does not support the video tag.
              </video>
            </div>
            <div v-else class="text-gray-500 text-sm italic">No video uploaded</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="flex flex-col-reverse sm:flex-row gap-4 justify-end">
      <button @click="handleEditForm"
        class="flex items-center justify-center gap-2 bg-white text-emerald-600 border border-emerald-300 px-5 py-3 rounded-lg
        hover:bg-emerald-50 transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2">
        <PencilIcon class="w-5 h-5" />
        Edit Listing
      </button>
      
      <button @click="handleSubmitForm"
        class="flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-green-600 text-white px-6 py-3 rounded-lg
        hover:from-emerald-600 hover:to-green-700 transition-all font-medium shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2">
        <CheckCircleIcon class="w-5 h-5" />
        Submit Listing
      </button>
    </div>
    
    <!-- Success Tips -->
    <div class="mt-8 bg-gradient-to-br from-emerald-50 to-green-50 border border-emerald-100 p-5 rounded-xl">
      <h3 class="text-emerald-700 font-medium mb-2 flex items-center">
        <LightBulbIcon class="w-5 h-5 text-emerald-500 mr-2" />
        Tips for Successful Listings
      </h3>
      <ul class="text-sm text-emerald-600 space-y-2">
        <li class="flex items-center gap-2">
          <div class="w-1.5 h-1.5 bg-emerald-400 rounded-full"></div>
          Complete listings with photos receive up to 250% more inquiries
        </li>
        <li class="flex items-center gap-2">
          <div class="w-1.5 h-1.5 bg-emerald-400 rounded-full"></div>
          Detailed descriptions and health information build trust with buyers
        </li>
        <li class="flex items-center gap-2">
          <div class="w-1.5 h-1.5 bg-emerald-400 rounded-full"></div>
          Respond quickly to inquiries to maximize your selling potential
        </li>
      </ul>
    </div>
  </div>
</template>