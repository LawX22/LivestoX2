<script setup lang="ts">
import { computed } from 'vue';

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
  excellent: 'text-green-600', 
  good: 'text-green-600', 
  fair: 'text-yellow-600'
}[status] || 'text-gray-600');

const getDeliveryOptionLabel = (value: string) => value || '';

const getDeliveryOptionIcon = (value: string) => {
  const option = props.deliveryOptions.find(item => item === value);
  return option ? 'default-icon-class' : '';
};
</script>

<template>
  <div class="p-8">
    <div class="flex items-center justify-between mb-8 pb-5 border-b border-gray-100">
      <div class="flex items-center">
        <span class="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-600 mr-4 shadow-sm">
          <span class="i-heroicons-check text-xl"></span>
        </span>
        <h2 class="text-2xl font-bold text-gray-800">Review Your Listing</h2>
      </div>
      <button @click="emit('editForm')"
        class="text-green-600 hover:text-green-800 flex items-center text-sm font-medium bg-green-50 hover:bg-green-100 px-4 py-2 rounded-lg transition-colors">
        <span class="i-heroicons-pencil-square mr-1"></span>
        Edit Listing
      </button>
    </div>

    <!-- Review Content -->
    <div class="space-y-8">
      <!-- Preview card with image -->
      <div class="bg-white rounded-xl overflow-hidden shadow-lg border border-gray-100">
        <div class="aspect-video bg-gray-100 relative">
          <img :src="imagePreviewUrls.length ? imagePreviewUrls[0] : '/src/assets/Bull.jpg'"
            alt="Listing preview" class="w-full h-full object-cover" />
          <div class="absolute top-0 left-0 m-4 flex flex-col gap-2">
            <span class="px-3 py-1.5 rounded-full bg-green-600 text-white text-sm font-medium shadow-md">
              {{ getCategoryName }}
            </span>
            <span v-if="certified"
              class="px-3 py-1.5 rounded-full bg-blue-600 bg-opacity-80 text-white text-sm font-medium shadow-md flex items-center">
              <span class="i-heroicons-badge-check mr-1"></span>
              Certified
            </span>
          </div>
        </div>
        <div class="p-6">
          <h3 class="font-bold text-2xl text-gray-800">{{ title }}</h3>
          <div class="flex items-center gap-3 mt-3">
            <span class="font-bold text-xl text-green-700">{{ formatPrice(price) }}</span>
            <span v-if="negotiable"
              class="text-xs bg-green-100 rounded-full px-3 py-1 text-green-800 font-medium">Negotiable</span>
            <span v-if="auction"
              class="text-xs bg-amber-100 rounded-full px-3 py-1 text-amber-800 font-medium flex items-center">
              <span class="i-heroicons-hand-raised mr-1"></span>
              Auction
            </span>
          </div>
          <div class="mt-3 flex items-center text-gray-600">
            <span class="i-heroicons-map-pin mr-2 text-green-600"></span>
            {{ detailedLocation }}
          </div>
        </div>
      </div>

      <!-- Details sections -->
      <div class="space-y-8">
        <!-- Basic Info Section -->
        <div class="review-section bg-white p-6 rounded-xl shadow-md border border-gray-100">
          <h3 class="text-lg font-bold text-gray-800 flex items-center mb-4 pb-2 border-b border-gray-100">
            <span class="i-heroicons-identification mr-2 text-green-600"></span>
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
                  class="py-1 px-3 rounded-full bg-green-100 text-green-800 text-xs font-medium">Certified</span>
                <span v-if="auction"
                  class="py-1 px-3 rounded-full bg-amber-100 text-amber-800 text-xs font-medium">Auction</span>
                <span v-if="availableImmediate"
                  class="py-1 px-3 rounded-full bg-blue-100 text-blue-800 text-xs font-medium">Available
                  Now</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Physical Details Section -->
        <div class="review-section bg-white p-6 rounded-xl shadow-md border border-gray-100">
          <h3 class="text-lg font-bold text-gray-800 flex items-center mb-4 pb-2 border-b border-gray-100">
            <span class="i-heroicons-clipboard-document-list mr-2 text-green-600"></span>
            Physical Characteristics
          </h3>
          <div class="grid grid-cols-3 gap-6">
            <div>
              <span class="text-sm font-medium text-gray-500 block mb-1">Age</span>
              <span class="font-medium text-gray-800">{{ age !== null ? `${age} ${ageUnit}` : '—' }}</span>
            </div>
            <div>
              <span class="text-sm font-medium text-gray-500 block mb-1">Gender</span>
              <span class="font-medium text-gray-800">{{ gender ? gender.charAt(0).toUpperCase() +
                gender.slice(1) : '—' }}</span>
            </div>
            <div>
              <span class="text-sm font-medium text-gray-500 block mb-1">Weight</span>
              <span class="font-medium text-gray-800">{{ weight !== null ? `${weight} ${weightUnit}` : '—'
              }}</span>
            </div>
            <div>
              <span class="text-sm font-medium text-gray-500 block mb-1">Health Status</span>
              <span :class="[healthStatus ? getHealthStatusColor(healthStatus) : '', 'font-medium']">
                {{ healthStatus ? healthStatus.charAt(0).toUpperCase() + healthStatus.slice(1) : '—' }}
              </span>
            </div>
            <div>
              <span class="text-sm font-medium text-gray-500 block mb-1">Feeding Type</span>
              <span class="font-medium text-gray-800">{{ feedingType || '—' }}</span>
            </div>
          </div>
        </div>

        <!-- Delivery Section -->
        <div class="review-section bg-white p-6 rounded-xl shadow-md border border-gray-100">
          <h3 class="text-lg font-bold text-gray-800 flex items-center mb-4 pb-2 border-b border-gray-100">
            <span class="i-heroicons-truck mr-2 text-green-600"></span>
            Delivery Options
          </h3>
          <div>
            <div class="flex flex-wrap gap-2 mb-3">
              <span v-for="option in deliveryOptions" :key="option"
                class="py-1.5 px-3 rounded-full bg-green-100 text-green-800 flex items-center text-sm font-medium">
                <span :class="getDeliveryOptionIcon(option)" class="mr-1"></span>
                {{ getDeliveryOptionLabel(option) }}
              </span>
            </div>

            <div v-if="deliveryOptions.includes('local-delivery') && maxDeliveryDistance !== null"
              class="mt-3 bg-gray-50 p-3 rounded-lg">
              <span class="text-gray-700 font-medium">Maximum delivery distance:</span>
              <span class="text-green-700 font-bold">{{ maxDeliveryDistance }} {{ deliveryDistanceUnit
              }}</span>
            </div>

            <div v-if="deliveryRestrictions" class="mt-4">
              <span class="text-sm font-medium text-gray-500 block mb-1">Delivery Notes:</span>
              <p class="text-gray-700 bg-gray-50 p-3 rounded-lg">{{ deliveryRestrictions }}</p>
            </div>
          </div>
        </div>

        <!-- Description Section -->
        <div class="review-section bg-white p-6 rounded-xl shadow-md border border-gray-100">
          <h3 class="text-lg font-bold text-gray-800 flex items-center mb-4 pb-2 border-b border-gray-100">
            <span class="i-heroicons-document-text mr-2 text-green-600"></span>
            Description
          </h3>
          <p class="text-gray-700 whitespace-pre-line leading-relaxed">{{ description }}</p>
        </div>

        <!-- Media Section -->
        <div v-if="imagePreviewUrls.length > 0 || videoPreview"
          class="review-section bg-white p-6 rounded-xl shadow-md border border-gray-100">
          <h3 class="text-lg font-bold text-gray-800 flex items-center mb-4 pb-2 border-b border-gray-100">
            <span class="i-heroicons-photo mr-2 text-green-600"></span>
            Media Gallery
          </h3>

          <div v-if="imagePreviewUrls.length > 0" class="mb-6">
            <h4 class="text-sm font-medium text-gray-700 mb-3">Images ({{ imagePreviewUrls.length }})</h4>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div v-for="(url, index) in imagePreviewUrls" :key="index"
                class="aspect-square rounded-xl overflow-hidden shadow-lg border border-gray-200 transform hover:scale-105 transition-transform">
                <img :src="url" class="w-full h-full object-cover" :alt="`Listing image ${index + 1}`" />
              </div>
            </div>
          </div>

          <div v-if="videoPreview">
            <h4 class="text-sm font-medium text-gray-700 mb-3">Video</h4>
            <div class="aspect-video rounded-xl overflow-hidden shadow-lg border border-gray-200">
              <video controls class="w-full h-full object-cover">
                <source :src="videoPreview" type="video/mp4">
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        </div>
      </div>

      <!-- Submit section -->
      <div class="pt-8 border-t border-gray-200">
        <div class="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
          <button @click="emit('editForm')"
            class="order-2 md:order-1 px-6 py-3 rounded-xl bg-white text-green-700 border border-green-200 hover:bg-green-50 transition-colors shadow-sm font-medium flex items-center">
            <span class="i-heroicons-pencil-square mr-2"></span>
            Edit Listing
          </button>

          <button @click="emit('submitForm')"
            class="order-1 md:order-2 w-full md:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white transition-colors shadow-md font-bold flex items-center justify-center">
            <span class="i-heroicons-check-circle mr-2"></span>
            Submit Listing
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.review-section {
  transition: all 0.3s ease;
}
.review-section:hover {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}
</style>