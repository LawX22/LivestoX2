<script setup lang="ts">
import { defineProps, defineEmits, ref, computed } from 'vue';
import {
  ArrowLeftIcon, ArrowRightIcon, CheckCircleIcon, XMarkIcon, PlusIcon, TrashIcon,
  PhotoIcon, VideoCameraIcon, ClipboardDocumentCheckIcon, CurrencyDollarIcon,
  MapPinIcon, InformationCircleIcon
} from '@heroicons/vue/24/solid';

interface Option { label: string; value: string; icon?: string; color?: string; hoverColor?: string; title?: string }

const props = defineProps({
  currentStep: { type: Number, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  breed: { type: String, required: true },
  price: { type: Number, required: false, default: null },
  negotiable: { type: Boolean, required: true },
  quantity: { type: Number, required: true },
  age: { type: Number, required: false, default: null },
  ageUnit: { type: String, required: true },
  gender: { type: String, required: true },
  weight: { type: Number, required: false, default: null },
  weightUnit: { type: String, required: true },
  healthStatus: { type: String, required: true },
  feedingType: { type: String, required: true },
  detailedLocation: { type: String, required: true },
  deliveryOptions: { type: Array as () => string[], required: true },
  deliveryRestrictions: { type: String, required: true },
  maxDeliveryDistance: { type: Number, required: false, default: null },
  deliveryDistanceUnit: { type: String, required: true },
  certified: { type: Boolean, required: true },
  auction: { type: Boolean, required: true },
  availableImmediate: { type: Boolean, required: true },
  imagePreviewUrls: { type: Array as () => string[], required: true },
  videoPreview: { type: String, required: false, default: null },
  currentStepValid: { type: Boolean, required: true },
  availableBreeds: { type: Array as () => Option[], required: true }
});

const emit = defineEmits([
  'update:title', 'update:description', 'update:category', 'update:breed', 'update:price', 'update:negotiable',
  'update:quantity', 'update:age', 'update:ageUnit', 'update:gender', 'update:weight', 'update:weightUnit',
  'update:healthStatus', 'update:feedingType', 'update:detailedLocation', 'update:deliveryOptions',
  'update:deliveryRestrictions', 'update:maxDeliveryDistance', 'update:deliveryDistanceUnit',
  'update:certified', 'update:auction', 'update:availableImmediate', 'nextStep', 'prevStep',
  'proceedToReview', 'handleFileUpload', 'handleVideoUpload', 'removeImage', 'clearImages', 'clearVideo'
]);

// Options for form selects
const genderOptions = [
  { label: 'Male', value: 'male' },
  { label: 'Female', value: 'female' },
  { label: 'Mixed', value: 'mixed' }
];

const ageUnitOptions = [
  { label: 'Days', value: 'days' },
  { label: 'Weeks', value: 'weeks' },
  { label: 'Months', value: 'months' },
  { label: 'Years', value: 'years' }
];

const weightUnitOptions = [
  { label: 'lbs', value: 'lbs' },
  { label: 'kg', value: 'kg' }
];

const deliveryDistanceUnitOptions = [
  { label: 'Miles', value: 'miles' },
  { label: 'Kilometers', value: 'km' }
];

const healthStatusOptions = [
  { label: 'Excellent', value: 'excellent', color: 'bg-green-100 text-green-800 border-green-200' },
  { label: 'Good', value: 'good', color: 'bg-blue-100 text-blue-800 border-blue-200' },
  { label: 'Fair', value: 'fair', color: 'bg-amber-100 text-amber-800 border-amber-200' },
  { label: 'Requires Attention', value: 'requires_attention', color: 'bg-red-100 text-red-800 border-red-200' }
];

const feedingTypeOptions = [
  { label: 'Grass Fed', value: 'grass_fed', icon: '🌿' },
  { label: 'Grain Fed', value: 'grain_fed', icon: '🌾' },
  { label: 'Mixed Feed', value: 'mixed_feed', icon: '🔄' },
  { label: 'Organic', value: 'organic', icon: '🍃' }
];

const deliveryOptionsList = [
  { label: 'Farm Pickup', value: 'farm_pickup', icon: '🏡' },
  { label: 'Local Delivery', value: 'local_delivery', icon: '🚚' },
  { label: 'Shipping Available', value: 'shipping_available', icon: '📦' },
  { label: 'Auction Transport', value: 'auction_transport', icon: '🔄' }
];

// Track if form sections have been visited
const visitedSteps = ref(new Set([1]));

// Add step to visited when navigated to
const markStepVisited = (step: number) => {
  visitedSteps.value.add(step);
};

// Step titles for progress indicator
const stepTitles = [
  'Basic Info',
  'Pricing',
  'Details',
  'Location',
  'Media'
];

// Computed properties
const canProceed = computed(() => {
  return props.currentStepValid;
});

const categoryOptions = ref<Option[]>([
  { label: 'Cattle', value: 'cattle', icon: '🐄', color: 'bg-amber-100', hoverColor: 'hover:bg-amber-200' },
  { label: 'Sheep', value: 'sheep', icon: '🐑', color: 'bg-blue-100', hoverColor: 'hover:bg-blue-200' },
  { label: 'Goats', value: 'goats', icon: '🐐', color: 'bg-emerald-100', hoverColor: 'hover:bg-emerald-200' },
  { label: 'Pigs', value: 'pigs', icon: '🐖', color: 'bg-pink-100', hoverColor: 'hover:bg-pink-200' },
  { label: 'Horses', value: 'horses', icon: '🐎', color: 'bg-orange-100', hoverColor: 'hover:bg-orange-200' }
]);

// Methods
const nextStep = () => {
  if (canProceed.value) {
    emit('nextStep');
    // Mark next step as visited
    markStepVisited(props.currentStep + 1);
  }
};

const prevStep = () => {
  emit('prevStep');
};

const proceedToReview = () => {
  emit('proceedToReview');
};

const handleFileInput = (event: Event) => {
  emit('handleFileUpload', event);
};

const handleVideoInput = (event: Event) => {
  emit('handleVideoUpload', event);
};

const removeImage = (index: number) => {
  emit('removeImage', index);
};

const clearAllImages = () => {
  emit('clearImages');
};

const clearVideo = () => {
  emit('clearVideo');
};

// Helper methods for input management
const updateDeliveryOptions = (option: string, checked: boolean) => {
  const currentOptions = [...props.deliveryOptions];

  if (checked && !currentOptions.includes(option)) {
    currentOptions.push(option);
  } else if (!checked && currentOptions.includes(option)) {
    const index = currentOptions.indexOf(option);
    currentOptions.splice(index, 1);
  }

  emit('update:deliveryOptions', currentOptions);
};

const isOptionSelected = (option: string) => {
  return props.deliveryOptions.includes(option);
};


</script>

<template>
  <div class="bg-white rounded-2xl shadow-sm border border-gray-100">
    <!-- Progress steps -->
    <div class="px-6 lg:px-8 py-5 border-b border-gray-100">
      <div class="flex items-center justify-between">
        <div v-for="(title, index) in stepTitles" :key="index" class="flex items-center">
          <div class="flex items-center">
            <div :class="[
              'flex items-center justify-center w-8 h-8 rounded-full font-medium text-sm border transition-all',
              props.currentStep > index + 1
                ? 'bg-emerald-500 text-white border-emerald-500'
                : props.currentStep === index + 1
                  ? 'bg-emerald-500 text-white border-emerald-500'
                  : visitedSteps.has(index + 1)
                    ? 'bg-emerald-50 text-emerald-600 border-emerald-200'
                    : 'bg-gray-50 text-gray-400 border-gray-200'
            ]">
              {{ index + 1 }}
            </div>
            <p :class="[
              'hidden md:block text-sm ml-2',
              props.currentStep === index + 1 ? 'text-emerald-600 font-medium' : 'text-gray-500'
            ]">
              {{ title }}
            </p>
          </div>

          <div v-if="index < stepTitles.length - 1" class="w-8 md:w-12 lg:w-24 xl:w-32 h-0.5 mx-1" :class="[
            props.currentStep > index + 1 ? 'bg-emerald-500' : 'bg-gray-200'
          ]"></div>
        </div>
      </div>
    </div>

    <!-- Step 1: Basic Info -->
    <div v-if="currentStep === 1" class="p-6 lg:p-8">
      <div class="flex items-center space-x-2 mb-6">
        <InformationCircleIcon class="h-6 w-6 text-emerald-500" />
        <h2 class="text-xl font-bold text-gray-900">Basic Information</h2>
      </div>

      <div class="space-y-6">
        <!-- Title -->
        <div>
          <label for="title" class="block text-sm font-medium text-gray-700 mb-1">Listing Title</label>
          <input id="title" type="text" :value="title"
            @input="$event => emit('update:title', ($event.target as HTMLInputElement).value)"
            class="w-full px-4 py-3 rounded-xl border border-gray-300 shadow-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            placeholder="Enter a descriptive title (e.g. 'Premium Angus Cattle - Grass Fed')" />
        </div>

        <!-- Category -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Category</label>
          <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            <button v-for="option in categoryOptions" :key="option.value" @click="emit('update:category', option.value)"
              :class="[
                'flex flex-col items-center px-4 py-5 rounded-xl border transition-all duration-200 hover:shadow-md',
                category === option.value
                  ? 'bg-gradient-to-br from-emerald-500 to-emerald-600 text-white border-emerald-600 shadow-md'
                  : `${option.color} ${option.hoverColor} text-gray-800 border-transparent`
              ]">
              <span class="text-3xl mb-2">{{ option.icon }}</span>
              <span class="font-medium text-center">{{ option.label }}</span>
            </button>
          </div>
        </div>

        <!-- Breed -->
        <div v-if="category">
          <label for="breed" class="block text-sm font-medium text-gray-700 mb-1">Breed</label>
          <div class="relative">
            <select id="breed" :value="breed"
              @change="$event => emit('update:breed', ($event.target as HTMLSelectElement).value)"
              class="appearance-none w-full px-4 py-3 rounded-xl border border-gray-300 shadow-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 pr-10">
              <option value="" disabled>Select breed</option>
              <option v-for="breedOption in availableBreeds" :key="breedOption.value" :value="breedOption.value">
                {{ breedOption.label }}
              </option>
            </select>
            <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
              <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd"
                  d="M10 3a1 1 0 01.707.293l7 7a1 1 0 01-1.414 1.414L10 5.414 3.707 11.707a1 1 0 01-1.414-1.414l7-7A1 1 0 0110 3z"
                  clip-rule="evenodd" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Navigation buttons -->
      <div class="mt-10 flex justify-end">
        <button @click="nextStep" :disabled="!canProceed" :class="[
          'flex items-center py-3 px-6 rounded-xl font-medium shadow transition-all duration-200',
          canProceed
            ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:shadow-lg hover:from-emerald-600 hover:to-emerald-700'
            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
        ]">
          <span>Next: Pricing</span>
          <ArrowRightIcon class="w-5 h-5 ml-2" />
        </button>
      </div>
    </div>

    <!-- Step 2: Pricing -->
    <div v-else-if="currentStep === 2" class="p-6 lg:p-8">
      <div class="flex items-center space-x-2 mb-6">
        <CurrencyDollarIcon class="h-6 w-6 text-emerald-500" />
        <h2 class="text-xl font-bold text-gray-900">Pricing Information</h2>
      </div>

      <div class="bg-gray-50 border border-gray-100 rounded-xl p-5 mb-6">
        <div class="space-y-6">
          <!-- Price -->
          <div>
            <label for="price" class="block text-sm font-medium text-gray-700 mb-1">Price per Animal</label>
            <div class="relative mt-1">
              <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <span class="text-gray-500 text-lg">$</span>
              </div>
              <input id="price" type="number" :value="price"
                @input="$event => emit('update:price', Number(($event.target as HTMLInputElement).value) || null)"
                class="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 shadow-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="0.00" min="0" step="0.01" />
            </div>
          </div>

          <!-- Negotiable price toggle -->
          <div class="flex items-center bg-white p-4 rounded-lg border border-gray-100">
            <button @click="emit('update:negotiable', !negotiable)" :class="[
              'relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500',
              negotiable ? 'bg-emerald-500' : 'bg-gray-200'
            ]">
              <span :class="[
                'pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200',
                negotiable ? 'translate-x-5' : 'translate-x-0'
              ]"></span>
            </button>
            <span class="ml-3 text-sm text-gray-700">Price is negotiable</span>
          </div>

          <!-- Quantity -->
          <div>
            <label for="quantity" class="block text-sm font-medium text-gray-700 mb-1">Quantity Available</label>
            <div class="flex items-center mt-1">
              <button @click="emit('update:quantity', Math.max(1, quantity - 1))"
                class="bg-gray-100 hover:bg-gray-200 text-gray-700 h-12 w-12 rounded-l-xl border border-gray-300 flex items-center justify-center transition-colors">
                <span class="text-xl font-medium">-</span>
              </button>
              <input id="quantity" type="number" :value="quantity"
                @input="$event => emit('update:quantity', Number(($event.target as HTMLInputElement).value) || 1)"
                class="h-12 border-t border-b border-gray-300 text-center w-20 focus:outline-none focus:ring-0 focus:border-gray-300"
                min="1" />
              <button @click="emit('update:quantity', quantity + 1)"
                class="bg-gray-100 hover:bg-gray-200 text-gray-700 h-12 w-12 rounded-r-xl border border-gray-300 flex items-center justify-center transition-colors">
                <span class="text-xl font-medium">+</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Special options -->
      <div class="space-y-3 pt-3">
        <h3 class="text-sm font-medium text-gray-700 mb-3">Special Options</h3>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="flex items-center p-4 rounded-xl border border-gray-100 bg-white shadow-sm">
            <button @click="emit('update:auction', !auction)" :class="[
              'relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500',
              auction ? 'bg-emerald-500' : 'bg-gray-200'
            ]">
              <span :class="[
                'pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200',
                auction ? 'translate-x-5' : 'translate-x-0'
              ]"></span>
            </button>
            <div class="ml-3">
              <span class="font-medium text-gray-800">Available for auction</span>
              <p class="text-xs text-gray-500 mt-1">List your livestock in our auction platform</p>
            </div>
          </div>

          <div class="flex items-center p-4 rounded-xl border border-gray-100 bg-white shadow-sm">
            <button @click="emit('update:availableImmediate', !availableImmediate)" :class="[
              'relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500',
              availableImmediate ? 'bg-emerald-500' : 'bg-gray-200'
            ]">
              <span :class="[
                'pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200',
                availableImmediate ? 'translate-x-5' : 'translate-x-0'
              ]"></span>
            </button>
            <div class="ml-3">
              <span class="font-medium text-gray-800">Available immediately</span>
              <p class="text-xs text-gray-500 mt-1">Ready for immediate purchase or delivery</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Navigation buttons -->
      <div class="mt-10 flex justify-between">
        <button @click="prevStep"
          class="flex items-center py-3 px-6 rounded-xl font-medium border border-gray-300 hover:bg-gray-50 transition-all duration-200">
          <ArrowLeftIcon class="w-5 h-5 mr-2" />
          <span>Previous</span>
        </button>

        <button @click="nextStep" :disabled="!canProceed" :class="[
          'flex items-center py-3 px-6 rounded-xl font-medium shadow transition-all duration-200',
          canProceed
            ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:shadow-lg hover:from-emerald-600 hover:to-emerald-700'
            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
        ]">
          <span>Next: Details</span>
          <ArrowRightIcon class="w-5 h-5 ml-2" />
        </button>
      </div>
    </div>

    <!-- Step 3: Details -->
    <div v-else-if="currentStep === 3" class="p-6 lg:p-8">
      <div class="flex items-center space-x-2 mb-6">
        <ClipboardDocumentCheckIcon class="h-6 w-6 text-emerald-500" />
        <h2 class="text-xl font-bold text-gray-900">Physical Characteristics</h2>
      </div>

      <div class="space-y-6">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div class="bg-gray-50 border border-gray-100 rounded-xl p-5">
            <h3 class="text-base font-medium text-gray-800 mb-4">Age & Gender</h3>
            <!-- Age -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label for="age" class="block text-sm font-medium text-gray-700 mb-1">Age</label>
                <input id="age" type="number" :value="age"
                  @input="$event => emit('update:age', Number(($event.target as HTMLInputElement).value) || null)"
                  class="w-full px-4 py-3 rounded-xl border border-gray-300 shadow-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="Age" min="0" />
              </div>

              <div>
                <label for="ageUnit" class="block text-sm font-medium text-gray-700 mb-1">Age Unit</label>
                <div class="relative">
                  <select id="ageUnit" :value="ageUnit"
                    @change="$event => emit('update:ageUnit', ($event.target as HTMLSelectElement).value)"
                    class="appearance-none w-full px-4 py-3 rounded-xl border border-gray-300 shadow-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 pr-10">
                    <option v-for="option in ageUnitOptions" :key="option.value" :value="option.value">
                      {{ option.label }}
                    </option>
                  </select>
                  <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                    <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd"
                        d="M10 3a1 1 0 01.707.293l7 7a1 1 0 01-1.414 1.414L10 5.414 3.707 11.707a1 1 0 01-1.414-1.414l7-7A1 1 0 0110 3z"
                        clip-rule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            <!-- Gender -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Gender</label>
              <div class="flex flex-wrap gap-3">
                <button v-for="option in genderOptions" :key="option.value" @click="emit('update:gender', option.value)"
                  :class="[
                    'px-5 py-3 rounded-xl border transition-all duration-200 flex-1 text-center',
                    gender === option.value
                      ? 'bg-emerald-500 text-white border-emerald-600'
                      : 'bg-white hover:bg-gray-50 text-gray-700 border-gray-200'
                  ]">
                  {{ option.label }}
                </button>
              </div>
            </div>
          </div>

          <div class="bg-gray-50 border border-gray-100 rounded-xl p-5">
            <h3 class="text-base font-medium text-gray-800 mb-4">Weight & Size</h3>
            <!-- Weight -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label for="weight" class="block text-sm font-medium text-gray-700 mb-1">Weight</label>
                <input id="weight" type="number" :value="weight"
                  @input="$event => emit('update:weight', Number(($event.target as HTMLInputElement).value) || null)"
                  class="w-full px-4 py-3 rounded-xl border border-gray-300 shadow-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="Weight" min="0" />
              </div>

              <div>
                <label for="weightUnit" class="block text-sm font-medium text-gray-700 mb-1">Weight Unit</label>
                <div class="relative">
                  <select id="weightUnit" :value="weightUnit"
                    @change="$event => emit('update:weightUnit', ($event.target as HTMLSelectElement).value)"
                    class="appearance-none w-full px-4 py-3 rounded-xl border border-gray-300 shadow-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 pr-10">
                    <option v-for="option in weightUnitOptions" :key="option.value" :value="option.value">
                      {{ option.label }}
                    </option>
                  </select>
                  <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                    <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd"
                        d="M10 3a1 1 0 01.707.293l7 7a1 1 0 01-1.414 1.414L10 5.414 3.707 11.707a1 1 0 01-1.414-1.414l7-7A1 1 0 0110 3z"
                        clip-rule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Health Status -->
          <div>
            <label for="healthStatus" class="block text-sm font-medium text-gray-700 mb-1">Health Status</label>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-2">
              <button v-for="option in healthStatusOptions" :key="option.value"
                @click="emit('update:healthStatus', option.value)" :class="[
                  'py-2 px-3 rounded-lg border text-center text-sm transition-all',
                  healthStatus === option.value ? option.color : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                ]">
                {{ option.label }}
              </button>
            </div>
          </div>

          <!-- Feeding Type -->
          <div>
            <label for="feedingType" class="block text-sm font-medium text-gray-700 mb-1">Feeding Type</label>
            <div class="grid grid-cols-2 gap-2">
              <button v-for="option in feedingTypeOptions" :key="option.value"
                @click="emit('update:feedingType', option.value)" :class="[
                  'py-3 px-4 rounded-lg border text-sm transition-all flex items-center justify-center space-x-2',
                  feedingType === option.value
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200 shadow-sm'
                    : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                ]">
                <span>{{ option.icon }}</span>
                <span>{{ option.label }}</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Description -->
        <div>
          <label for="description" class="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea id="description" :value="description"
            @input="$event => emit('update:description', ($event.target as HTMLTextAreaElement).value)" rows="4"
            class="w-full px-4 py-3 rounded-xl border border-gray-300 shadow-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            placeholder="Provide detailed information about your livestock..."></textarea>
        </div>

        <!-- Certification status -->
        <div class="flex items-center p-4 rounded-xl border border-gray-100 bg-gray-50">
          <button @click="emit('update:certified', !certified)" :class="[
            'relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500',
            certified ? 'bg-emerald-500' : 'bg-gray-200'
          ]">
            <span :class="[
              'pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200',
              certified ? 'translate-x-5' : 'translate-x-0'
            ]"></span>
          </button>
          <div class="ml-3">
            <span class="font-medium text-gray-800">USDA Certified</span>
            <p class="text-xs text-gray-500 mt-1">Indicates that your livestock meets USDA certification requirements
            </p>
          </div>
        </div>
      </div>

      <!-- Navigation buttons -->
      <div class="mt-10 flex justify-between">
        <button @click="prevStep"
          class="flex items-center py-3 px-6 rounded-xl font-medium border border-gray-300 hover:bg-gray-50 transition-all duration-200">
          <ArrowLeftIcon class="w-5 h-5 mr-2" />
          <span>Previous</span>
        </button>

        <button @click="nextStep" :disabled="!canProceed" :class="[
          'flex items-center py-3 px-6 rounded-xl font-medium shadow transition-all duration-200',
          canProceed
            ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:shadow-lg hover:from-emerald-600 hover:to-emerald-700'
            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
        ]">
          <span>Next: Location</span>
          <ArrowRightIcon class="w-5 h-5 ml-2" />
        </button>
      </div>
    </div>

    <!-- Step 4: Location -->
    <div v-else-if="currentStep === 4" class="p-6 lg:p-8">
      <div class="flex items-center space-x-2 mb-6">
        <MapPinIcon class="h-6 w-6 text-emerald-500" />
        <h2 class="text-xl font-bold text-gray-900">Location & Delivery Options</h2>
      </div>

      <div class="space-y-6">
        <!-- Location -->
        <div>
          <label for="detailedLocation" class="block text-sm font-medium text-gray-700 mb-1">Location</label>
          <input id="detailedLocation" type="text" :value="detailedLocation"
            @input="$event => emit('update:detailedLocation', ($event.target as HTMLInputElement).value)"
            class="w-full px-4 py-3 rounded-xl border border-gray-300 shadow-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            placeholder="Enter your farm or ranch location" />
        </div>

        <!-- Delivery Options -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Delivery Options</label>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div v-for="option in deliveryOptionsList" :key="option.value"
              class="flex items-center p-4 rounded-xl border border-gray-200 bg-white">
              <input :id="option.value" type="checkbox" :checked="isOptionSelected(option.value)"
                @change="updateDeliveryOptions(option.value, ($event.target as HTMLInputElement).checked)"
                class="h-5 w-5 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded" />
              <label :for="option.value" class="ml-3 flex items-center">
                <span class="text-xl mr-2">{{ option.icon }}</span>
                <span class="text-sm text-gray-700">{{ option.label }}</span>
              </label>
            </div>
          </div>
        </div>

        <!-- Delivery Distance -->
        <div class="bg-gray-50 border border-gray-100 rounded-xl p-5">
          <h3 class="text-base font-medium text-gray-800 mb-4">Delivery Details</h3>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label for="maxDeliveryDistance" class="block text-sm font-medium text-gray-700 mb-1">Max Delivery
                Distance</label>
              <input id="maxDeliveryDistance" type="number" :value="maxDeliveryDistance"
                @input="$event => emit('update:maxDeliveryDistance', Number(($event.target as HTMLInputElement).value) || null)"
                class="w-full px-4 py-3 rounded-xl border border-gray-300 shadow-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="Maximum distance" min="0" />
            </div>

            <div>
              <label for="deliveryDistanceUnit" class="block text-sm font-medium text-gray-700 mb-1">Distance
                Unit</label>
              <div class="relative">
                <select id="deliveryDistanceUnit" :value="deliveryDistanceUnit"
                  @change="$event => emit('update:deliveryDistanceUnit', ($event.target as HTMLSelectElement).value)"
                  class="appearance-none w-full px-4 py-3 rounded-xl border border-gray-300 shadow-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 pr-10">
                  <option v-for="option in deliveryDistanceUnitOptions" :key="option.value" :value="option.value">
                    {{ option.label }}
                  </option>
                </select>
                <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                  <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd"
                      d="M10 3a1 1 0 01.707.293l7 7a1 1 0 01-1.414 1.414L10 5.414 3.707 11.707a1 1 0 01-1.414-1.414l7-7A1 1 0 0110 3z"
                      clip-rule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <!-- Delivery Restrictions -->
          <div>
            <label for="deliveryRestrictions" class="block text-sm font-medium text-gray-700 mb-1">Delivery Restrictions
              or Notes</label>
            <textarea id="deliveryRestrictions" :value="deliveryRestrictions"
              @input="$event => emit('update:deliveryRestrictions', ($event.target as HTMLTextAreaElement).value)"
              rows="3"
              class="w-full px-4 py-3 rounded-xl border border-gray-300 shadow-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="Any restrictions or additional information about delivery..."></textarea>
          </div>
        </div>
      </div>

      <!-- Navigation buttons -->
      <div class="mt-10 flex justify-between">
        <button @click="prevStep"
          class="flex items-center py-3 px-6 rounded-xl font-medium border border-gray-300 hover:bg-gray-50 transition-all duration-200">
          <ArrowLeftIcon class="w-5 h-5 mr-2" />
          <span>Previous</span>
        </button>

        <button @click="nextStep" :disabled="!canProceed" :class="[
          'flex items-center py-3 px-6 rounded-xl font-medium shadow transition-all duration-200',
          canProceed
            ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:shadow-lg hover:from-emerald-600 hover:to-emerald-700'
            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
        ]">
          <span>Next: Media</span>
          <ArrowRightIcon class="w-5 h-5 ml-2" />
        </button>
      </div>
    </div>

    <!-- Step 5: Media -->
    <div v-else-if="currentStep === 5" class="p-6 lg:p-8">
      <div class="flex items-center space-x-2 mb-6">
        <PhotoIcon class="h-6 w-6 text-emerald-500" />
        <h2 class="text-xl font-bold text-gray-900">Add Photos & Video</h2>
      </div>

      <div class="space-y-8">
        <!-- Photos Upload -->
        <div>
          <div class="flex items-center justify-between mb-3">
            <h3 class="text-base font-medium text-gray-700">Photos (up to 5)</h3>
            <button v-if="imagePreviewUrls.length > 0" @click="clearAllImages"
              class="flex items-center text-sm text-red-600 hover:text-red-800">
              <TrashIcon class="w-4 h-4 mr-1" />
              <span>Clear All</span>
            </button>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <!-- Images preview -->
            <div v-for="(url, index) in imagePreviewUrls" :key="index"
              class="relative rounded-xl overflow-hidden border border-gray-200 aspect-square bg-gray-50">
              <img :src="url" alt="Livestock preview" class="w-full h-full object-cover" />
              <button @click="removeImage(index)"
                class="absolute top-2 right-2 bg-white p-1.5 rounded-full shadow-md hover:bg-red-100 transition-colors">
                <XMarkIcon class="w-4 h-4 text-red-600" />
              </button>
            </div>

            <!-- Upload button -->
            <div v-if="imagePreviewUrls.length < 5"
              class="border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center p-6 bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer aspect-square">
              <input type="file" accept="image/*" @change="handleFileInput" class="hidden" id="image-upload" multiple />
              <label for="image-upload" class="cursor-pointer flex flex-col items-center">
                <PlusIcon class="w-8 h-8 text-emerald-500 mb-2" />
                <span class="text-sm font-medium text-emerald-600">Add Photos</span>
                <span class="text-xs text-gray-500 mt-2 text-center">Click to browse files</span>
              </label>
            </div>
          </div>
        </div>

        <!-- Video Upload -->
        <div>
          <h3 class="text-base font-medium text-gray-700 mb-3">Video (optional, 1 max)</h3>

          <div v-if="!videoPreview">
            <div
              class="border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center p-8 bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer">
              <input type="file" accept="video/*" @change="handleVideoInput" class="hidden" id="video-upload" />
              <label for="video-upload" class="cursor-pointer flex flex-col items-center">
                <VideoCameraIcon class="w-8 h-8 text-emerald-500 mb-3" />
                <span class="text-sm font-medium text-emerald-600">Add Video</span>
                <span class="text-xs text-gray-500 mt-2 text-center">Upload a brief video of your livestock</span>
              </label>
            </div>
          </div>

          <div v-else class="relative">
            <video :src="videoPreview" controls class="w-full rounded-xl border border-gray-200"></video>
            <button @click="clearVideo"
              class="absolute top-2 right-2 bg-white p-1.5 rounded-full shadow-md hover:bg-red-100 transition-colors">
              <XMarkIcon class="w-4 h-4 text-red-600" />
            </button>
          </div>
        </div>
      </div>

      <!-- Navigation buttons -->
      <div class="mt-10 flex justify-between">
        <button @click="prevStep"
          class="flex items-center py-3 px-6 rounded-xl font-medium border border-gray-300 hover:bg-gray-50 transition-all duration-200">
          <ArrowLeftIcon class="w-5 h-5 mr-2" />
          <span>Previous</span>
        </button>

        <button @click="proceedToReview" :disabled="!canProceed" :class="[
          'flex items-center py-3 px-6 rounded-xl font-medium shadow transition-all duration-200',
          canProceed
            ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:shadow-lg hover:from-emerald-600 hover:to-emerald-700'
            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
        ]">
          <span>Review Listing</span>
          <CheckCircleIcon class="w-5 h-5 ml-2" />
        </button>
      </div>
    </div>
  </div>
</template>