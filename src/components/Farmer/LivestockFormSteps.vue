<script setup lang="ts">
import { ref } from 'vue';

// Types
interface Option { label: string; value: string; icon?: string; color?: string; hoverColor?: string; title?: string }

// Props
const props = defineProps({
  currentStep: { type: Number, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  breed: { type: String, required: true },
  price: { type: [Number, null], required: true },
  negotiable: { type: Boolean, required: true },
  quantity: { type: Number, required: true },
  age: { type: [Number, null], required: true },
  ageUnit: { type: String, required: true },
  gender: { type: String, required: true },
  weight: { type: [Number, null], required: true },
  weightUnit: { type: String, required: true },
  healthStatus: { type: String, required: true },
  feedingType: { type: String, required: true },
  detailedLocation: { type: String, required: true },
  deliveryOptions: { type: Array as () => string[], required: true },
  deliveryRestrictions: { type: String, required: true },
  maxDeliveryDistance: { type: [Number, null], required: true },
  deliveryDistanceUnit: { type: String, required: true },
  certified: { type: Boolean, required: true },
  auction: { type: Boolean, required: true },
  availableImmediate: { type: Boolean, required: true },
  imagePreviewUrls: { type: Array as () => string[], required: true },
  videoPreview: { type: [String, null], required: true },
  currentStepValid: { type: Boolean, required: true },
  availableBreeds: { type: Array as () => Option[], required: true }
});

// Emits
const emit = defineEmits([
  'update:title', 'update:description', 'update:category', 'update:breed', 'update:price', 'update:negotiable',
  'update:quantity', 'update:age', 'update:ageUnit', 'update:gender', 'update:weight', 'update:weightUnit',
  'update:healthStatus', 'update:feedingType', 'update:detailedLocation', 'update:deliveryOptions',
  'update:deliveryRestrictions', 'update:maxDeliveryDistance', 'update:deliveryDistanceUnit', 'update:certified',
  'update:auction', 'update:availableImmediate', 'nextStep', 'prevStep', 'proceedToReview', 'handleFileUpload',
  'handleVideoUpload', 'removeImage', 'clearImages', 'clearVideo'
]);

// Options
const categoryOptions = ref<Option[]>([
  { label: 'Cattle', value: 'cattle', icon: '🐄', color: 'bg-green-100', hoverColor: 'hover:bg-green-200' },
  { label: 'Sheep', value: 'sheep', icon: '🐑', color: 'bg-green-50', hoverColor: 'hover:bg-green-100' },
  { label: 'Goats', value: 'goats', icon: '🐐', color: 'bg-green-100', hoverColor: 'hover:bg-green-200' },
  { label: 'Pigs', value: 'pigs', icon: '🐖', color: 'bg-green-50', hoverColor: 'hover:bg-green-100' },
  { label: 'Horses', value: 'horses', icon: '🐎', color: 'bg-green-100', hoverColor: 'hover:bg-green-200' }
]);

const ageUnitOptions = ref<Option[]>([{ label: 'Months', value: 'months' }, { label: 'Years', value: 'years' }]);
const weightUnitOptions = ref<Option[]>([{ label: 'lbs', value: 'lbs' }, { label: 'kg', value: 'kg' }]);
const genderOptions = ref<Option[]>([{ label: 'Male', value: 'male' }, { label: 'Female', value: 'female' }]);
const healthStatusOptions = ref<Option[]>([
  { label: 'Select Health Status', value: '' }, 
  { label: 'Excellent', value: 'excellent' }, 
  { label: 'Good', value: 'good' }, 
  { label: 'Fair', value: 'fair' }
]);
const deliveryDistanceUnitOptions = ref<Option[]>([{ label: 'Miles', value: 'miles' }, { label: 'Kilometers', value: 'kilometers' }]);
const deliveryOptionItems = ref<Option[]>([
  { label: 'On-site Pickup', value: 'on-site-pickup', icon: 'i-heroicons-home' },
  { label: 'Local Delivery', value: 'local-delivery', icon: 'i-heroicons-truck' },
  { label: 'Transportation Services', value: 'transportation-services', icon: 'i-heroicons-globe-alt' }
]);

const maxImageUploadCount = 5;


// Methods
const toggleDeliveryOption = (value: string) => {
  const options = [...props.deliveryOptions];
  if (options.includes(value)) {
    emit('update:deliveryOptions', options.filter(o => o !== value));
  } else {
    emit('update:deliveryOptions', [...options, value]);
  }
};

</script>

<template>
    
  <!-- Main Form Steps with improved design -->
  <div class="p-8 bg-green-50 rounded-2xl shadow-lg">
    <!-- Step 1: Basic Info -->
    <div v-if="currentStep === 1" class="bg-white p-6 rounded-xl shadow-sm border border-green-100">
      <h2 class="text-2xl font-bold mb-6 text-green-800 flex items-center">
        <span
          class="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center mr-3 shadow-sm text-lg">1</span>
        Basic Information
      </h2>

      <div class="space-y-6">
        <!-- Title Field -->
        <div>
          <label for="title" class="block text-green-800 font-medium mb-2">Listing Title <span
              class="text-red-500">*</span></label>
          <input :value="title" @input="$emit('update:title', ($event.target as HTMLInputElement).value)" type="text" id="title" placeholder="e.g. Premium Angus Breeding Bulls"
            class="w-full px-4 py-3 rounded-xl border border-green-200 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all bg-green-50" />
        </div>

        <!-- Category Selection -->
        <div>
          <label class="block text-green-800 font-medium mb-3">Category <span
              class="text-red-500">*</span></label>
          <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            <button v-for="option in categoryOptions" :key="option.value" type="button"
              @click="$emit('update:category', option.value)" :class="[
                'flex items-center p-4 rounded-xl border transition-all shadow-sm',
                category === option.value
                  ? 'border-green-600 bg-green-100 ring-2 ring-green-500 ring-opacity-50'
                  : 'border-green-200 hover:border-green-300 ' + option.color + ' ' + option.hoverColor
              ]">
              <span class="text-3xl mr-3">{{ option.icon }}</span>
              <span :class="[category === option.value ? 'text-green-800' : 'text-green-700', 'font-medium']">
                {{ option.label }}
              </span>
            </button>
          </div>
        </div>

        <!-- Breed Selection -->
        <div v-if="category">
          <label for="breed" class="block text-green-800 font-medium mb-2">Breed <span
              class="text-red-500">*</span></label>
          <select :value="breed" @change="$emit('update:breed', ($event.target as HTMLSelectElement).value)" id="breed"
            class="w-full px-4 py-3 rounded-xl border border-green-200 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all bg-green-50">
            <option value="">Select Breed</option>
            <option v-for="option in availableBreeds" :key="option.value" :value="option.value">
              {{ option.label }}
            </option>
          </select>
        </div>

        <!-- Certified, Auction, Available Checkboxes -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="flex items-start p-3 rounded-lg bg-green-50 border border-green-100 shadow-sm">
            <div class="flex items-center h-6 mt-0.5">
              <input :checked="certified" @change="$emit('update:certified', ($event.target as HTMLInputElement).checked)" id="certified" type="checkbox"
                class="w-5 h-5 text-green-600 rounded border-green-300 focus:ring-green-500" />
            </div>
            <div class="ml-3">
              <label for="certified" class="font-medium text-green-800">Certified</label>
              <p class="text-sm text-green-600">Verified health records</p>
            </div>
          </div>

          <div class="flex items-start p-3 rounded-lg bg-green-50 border border-green-100 shadow-sm">
            <div class="flex items-center h-6 mt-0.5">
              <input :checked="auction" @change="$emit('update:auction', ($event.target as HTMLInputElement).checked)" id="auction" type="checkbox"
                class="w-5 h-5 text-green-600 rounded border-green-300 focus:ring-green-500" />
            </div>
            <div class="ml-3">
              <label for="auction" class="font-medium text-green-800">Auction</label>
              <p class="text-sm text-green-600">Allow bidding</p>
            </div>
          </div>

          <div class="flex items-start p-3 rounded-lg bg-green-50 border border-green-100 shadow-sm">
            <div class="flex items-center h-6 mt-0.5">
              <input :checked="availableImmediate" @change="$emit('update:availableImmediate', ($event.target as HTMLInputElement).checked)" id="available" type="checkbox"
                class="w-5 h-5 text-green-600 rounded border-green-300 focus:ring-green-500" />
            </div>
            <div class="ml-3">
              <label for="available" class="font-medium text-green-800">Available Now</label>
              <p class="text-sm text-green-600">Ready for delivery</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Step 2: Price & Quantity -->
    <div v-else-if="currentStep === 2" class="bg-white p-6 rounded-xl shadow-sm border border-green-100">
      <h2 class="text-2xl font-bold mb-6 text-green-800 flex items-center">
        <span
          class="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center mr-3 shadow-sm text-lg">2</span>
        Pricing & Quantity
      </h2>

      <div class="space-y-6">
        <!-- Price field -->
        <div>
          <label for="price" class="block text-green-800 font-medium mb-2">Price per Unit <span
              class="text-red-500">*</span></label>
          <div class="flex items-center relative">
            <span class="absolute ml-4 text-green-600">$</span>
            <input :value="price" @input="$emit('update:price', Number(($event.target as HTMLInputElement).value))" type="number" min="0" step="0.01" id="price" placeholder="0.00"
              class="w-full pl-8 pr-4 py-3 rounded-xl border border-green-200 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all bg-green-50" />
          </div>
        </div>

        <!-- Negotiable checkbox -->
        <div class="flex items-center space-x-3 bg-green-100 p-4 rounded-xl border border-green-200 shadow-sm">
          <div class="flex items-center h-5">
            <input :checked="negotiable" @change="$emit('update:negotiable', ($event.target as HTMLInputElement).checked)" id="negotiable" type="checkbox"
              class="w-5 h-5 text-green-600 rounded border-green-300 focus:ring-green-500" />
          </div>
          <div>
            <label for="negotiable" class="font-medium text-green-800">Price is negotiable</label>
            <p class="text-sm text-green-700">Allow buyers to make offers</p>
          </div>
        </div>

        <!-- Quantity field -->
        <div>
          <label for="quantity" class="block text-green-800 font-medium mb-2">Quantity Available <span
              class="text-red-500">*</span></label>
          <input :value="quantity" @input="$emit('update:quantity', Number(($event.target as HTMLInputElement).value))" type="number" min="1" id="quantity"
            class="w-full px-4 py-3 rounded-xl border border-green-200 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all bg-green-50" />
        </div>

        <!-- Price tips card -->
        <div class="bg-green-50 p-4 rounded-xl border border-green-200 shadow-sm">
          <h4 class="font-medium text-green-800 flex items-center">
            <span class="i-heroicons-information-circle text-green-600 mr-2"></span>
            Pricing Tips
          </h4>
          <ul class="mt-2 text-sm text-green-700 space-y-1">
            <li class="flex items-start">
              <span class="i-heroicons-check-circle text-green-500 mr-1 mt-0.5"></span>
              <span>Research current market prices for similar listings</span>
            </li>
            <li class="flex items-start">
              <span class="i-heroicons-check-circle text-green-500 mr-1 mt-0.5"></span>
              <span>Setting a fair price can lead to faster sales</span>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Step 3: Details -->
    <div v-else-if="currentStep === 3" class="bg-white p-6 rounded-xl shadow-sm border border-green-100">
      <h2 class="text-2xl font-bold mb-6 text-green-800 flex items-center">
        <span
          class="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center mr-3 shadow-sm text-lg">3</span>
        Physical Details
      </h2>

      <div class="space-y-6">
        <!-- Age and Gender -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label for="age" class="block text-green-800 font-medium mb-2">Age</label>
            <div class="flex space-x-3">
              <input :value="age" @input="$emit('update:age', Number(($event.target as HTMLInputElement).value))" type="number" min="0" id="age" placeholder="Age"
                class="w-full px-4 py-3 rounded-xl border border-green-200 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all bg-green-50" />
              <select :value="ageUnit" @change="$emit('update:ageUnit', ($event.target as HTMLSelectElement).value)"
                class="w-32 px-4 py-3 rounded-xl border border-green-200 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all bg-green-50">
                <option v-for="option in ageUnitOptions" :key="option.value" :value="option.value">
                  {{ option.label }}
                </option>
              </select>
            </div>
          </div>

          <div>
            <label for="gender" class="block text-green-800 font-medium mb-2">Gender</label>
            <div class="grid grid-cols-2 gap-3">
              <button v-for="option in genderOptions" :key="option.value" type="button"
                @click="$emit('update:gender', option.value)" :class="[
                  'flex items-center justify-center p-3 rounded-xl border transition-all shadow-sm',
                  gender === option.value
                    ? 'border-green-600 bg-green-100 ring-2 ring-green-500 ring-opacity-50 text-green-800'
                    : 'border-green-200 hover:border-green-300 text-green-700 bg-green-50'
                ]">
                {{ option.label }}
              </button>
            </div>
          </div>
        </div>

        <!-- Weight -->
        <div>
          <label for="weight" class="block text-green-800 font-medium mb-2">Weight</label>
          <div class="flex space-x-3">
            <input :value="weight" @input="$emit('update:weight', Number(($event.target as HTMLInputElement).value))" type="number" min="0" id="weight" placeholder="Weight"
              class="w-full px-4 py-3 rounded-xl border border-green-200 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all bg-green-50" />
            <select :value="weightUnit" @change="$emit('update:weightUnit', ($event.target as HTMLSelectElement).value)"
              class="w-24 px-4 py-3 rounded-xl border border-green-200 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all bg-green-50">
              <option v-for="option in weightUnitOptions" :key="option.value" :value="option.value">
                {{ option.label }}
              </option>
            </select>
          </div>
        </div>

        <!-- Health Status and Feeding -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label for="healthStatus" class="block text-green-800 font-medium mb-2">Health Status</label>
            <select :value="healthStatus" @change="$emit('update:healthStatus', ($event.target as HTMLSelectElement).value)" id="healthStatus"
              class="w-full px-4 py-3 rounded-xl border border-green-200 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all bg-green-50">
              <option v-for="option in healthStatusOptions" :key="option.value" :value="option.value">
                {{ option.label }}
              </option>
            </select>
          </div>

          <div>
            <label for="feedingType" class="block text-green-800 font-medium mb-2">Feeding Type</label>
            <input :value="feedingType" @input="$emit('update:feedingType', ($event.target as HTMLInputElement).value)" type="text" id="feedingType" placeholder="e.g. Grass-fed, Grain-fed"
              class="w-full px-4 py-3 rounded-xl border border-green-200 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all bg-green-50" />
          </div>
        </div>

        <!-- Description field -->
        <div>
          <label for="description" class="block text-green-800 font-medium mb-2">Description <span
              class="text-red-500">*</span></label>
          <textarea :value="description" @input="$emit('update:description', ($event.target as HTMLTextAreaElement).value)" id="description" rows="6"
            placeholder="Provide detailed information about your livestock..."
            class="w-full px-4 py-3 rounded-xl border border-green-200 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all bg-green-50"></textarea>
          <p class="mt-2 text-sm text-green-600">Include breed characteristics, health history, temperament,
            and any other relevant details</p>
        </div>
      </div>
    </div>

    <!-- Step 4: Location & Delivery -->
    <div v-else-if="currentStep === 4" class="bg-white p-6 rounded-xl shadow-sm border border-green-100">
      <h2 class="text-2xl font-bold mb-6 text-green-800 flex items-center">
        <span
          class="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center mr-3 shadow-sm text-lg">4</span>
        Location & Delivery
      </h2>

      <div class="space-y-6">
        <!-- Location field -->
        <div>
          <label for="location" class="block text-green-800 font-medium mb-2">Location <span
              class="text-red-500">*</span></label>
          <input :value="detailedLocation" @input="$emit('update:detailedLocation', ($event.target as HTMLInputElement).value)" type="text" id="location" placeholder="City, State/Province"
            class="w-full px-4 py-3 rounded-xl border border-green-200 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all bg-green-50" />
        </div>

        <!-- Delivery options -->
        <div>
          <label class="block text-green-800 font-medium mb-3">Delivery Options</label>
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div v-for="option in deliveryOptionItems" :key="option.value" :class="[
              'flex items-center p-4 rounded-xl border cursor-pointer transition-all shadow-sm',
              deliveryOptions.includes(option.value)
                ? 'border-green-600 bg-green-100 ring-2 ring-green-500 ring-opacity-50'
                : 'border-green-200 hover:border-green-300 bg-green-50'
            ]" @click="toggleDeliveryOption(option.value)">
              <span
                :class="[option.icon, 'mr-3 text-xl', deliveryOptions.includes(option.value) ? 'text-green-600' : 'text-green-400']"></span>
              <span
                :class="[deliveryOptions.includes(option.value) ? 'text-green-800' : 'text-green-700', 'font-medium']">
                {{ option.label }}
              </span>
            </div>
          </div>
        </div>

        <!-- Delivery distance -->
        <div v-if="deliveryOptions.includes('local-delivery')">
          <label for="deliveryDistance" class="block text-green-800 font-medium mb-2">Maximum Delivery
            Distance</label>
          <div class="flex space-x-3">
            <input :value="maxDeliveryDistance" @input="$emit('update:maxDeliveryDistance', Number(($event.target as HTMLInputElement).value))" type="number" min="0" id="deliveryDistance"
              placeholder="Distance"
              class="w-full px-4 py-3 rounded-xl border border-green-200 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all bg-green-50" />
            <select :value="deliveryDistanceUnit" @change="$emit('update:deliveryDistanceUnit', ($event.target as HTMLSelectElement).value)"
              class="w-32 px-4 py-3 rounded-xl border border-green-200 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all bg-green-50">
              <option v-for="option in deliveryDistanceUnitOptions" :key="option.value" :value="option.value">
                {{ option.label }}
              </option>
            </select>
          </div>
        </div>

        <!-- Delivery restrictions -->
        <div v-if="deliveryOptions.length > 0">
          <label for="deliveryRestrictions" class="block text-green-800 font-medium mb-2">Delivery
            Notes/Restrictions</label>
          <textarea :value="deliveryRestrictions" @input="$emit('update:deliveryRestrictions', ($event.target as HTMLTextAreaElement).value)" id="deliveryRestrictions" rows="3"
            placeholder="Any special requirements for delivery or pickup..."
            class="w-full px-4 py-3 rounded-xl border border-green-200 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all bg-green-50"></textarea>
        </div>
      </div>
    </div>

    <!-- Step 5: Media -->
    <div v-else-if="currentStep === 5" class="bg-white p-6 rounded-xl shadow-sm border border-green-100">
      <h2 class="text-2xl font-bold mb-6 text-green-800 flex items-center">
        <span
          class="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center mr-3 shadow-sm text-lg">5</span>
        Photos & Videos
      </h2>

      <div class="space-y-8">
        <!-- Image upload -->
        <div>
          <label class="block text-green-800 font-medium mb-3">Photos ({{ imagePreviewUrls.length }}/{{
            maxImageUploadCount }})</label>

          <div v-if="imagePreviewUrls.length > 0"
            class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mb-4">
            <div v-for="(url, index) in imagePreviewUrls" :key="index"
              class="aspect-square relative rounded-xl overflow-hidden shadow-sm border border-green-200 group">
              <img :src="url" class="w-full h-full object-cover" :alt="`Uploaded image ${index + 1}`" />
              <button @click="$emit('removeImage', index)"
                class="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-80 hover:opacity-100 transition-opacity">
                <span class="i-heroicons-x-mark text-base"></span>
              </button>
            </div>
          </div>

          <div v-if="imagePreviewUrls.length < maxImageUploadCount"
            class="flex items-center justify-center border-2 border-dashed border-green-300 rounded-xl bg-green-50 hover:bg-green-100 transition-colors p-6">
            <label class="flex flex-col items-center cursor-pointer w-full">
              <span class="i-heroicons-photo text-5xl text-green-400"></span>
              <span class="mt-2 text-green-700 font-medium">Upload Photos</span>
              <span class="text-sm text-green-600">Click to browse your files</span>
              <input type="file" class="hidden" accept="image/*" multiple @change="$emit('handleFileUpload', $event)" />
            </label>
          </div>

          <p class="mt-2 text-sm text-green-600">Add up to {{ maxImageUploadCount }} high-quality photos of
            your livestock</p>

          <div v-if="imagePreviewUrls.length > 0" class="flex justify-end mt-3">
            <button @click="$emit('clearImages')"
              class="text-red-600 hover:text-red-800 text-sm font-medium flex items-center">
              <span class="i-heroicons-trash mr-1"></span>
              Clear all photos
            </button>
          </div>
        </div>

        <!-- Video upload -->
        <div>
          <label class="block text-green-800 font-medium mb-3">Video (Optional)</label>

          <div v-if="videoPreview" class="mb-4">
            <div class="aspect-video rounded-xl overflow-hidden shadow-sm border border-green-200 bg-black">
              <video controls class="w-full h-full">
                <source :src="videoPreview" type="video/mp4">
                Your browser does not support video playback.
              </video>
            </div>
            <div class="flex justify-end mt-2">
              <button @click="$emit('clearVideo')"
              class="text-red-600 hover:text-red-800 text-sm font-medium flex items-center">
                <span class="i-heroicons-trash mr-1"></span>
                Clear video
              </button>
            </div>
          </div>

          <div v-else
            class="flex items-center justify-center border-2 border-dashed border-green-300 rounded-xl bg-green-50 hover:bg-green-100 transition-colors p-6">
            <label class="flex flex-col items-center cursor-pointer w-full">
              <span class="i-heroicons-video-camera text-5xl text-green-400"></span>
              <span class="mt-2 text-green-700 font-medium">Upload Video</span>
              <span class="text-sm text-green-600">Click to browse your files</span>
              <input type="file" class="hidden" accept="video/*" @change="$emit('handleVideoUpload', $event)" />
            </label>
          </div>

          <p class="mt-2 text-sm text-green-600">Add a short video showcasing your livestock in action</p>
        </div>

        <!-- Media tips -->
        <div class="bg-green-50 p-4 rounded-xl border border-green-200 shadow-sm">
          <h4 class="font-medium text-green-800 flex items-center">
            <span class="i-heroicons-information-circle text-green-600 mr-2"></span>
            Media Tips
          </h4>
          <ul class="mt-2 text-sm text-green-700 space-y-1">
            <li class="flex items-start">
              <span class="i-heroicons-check-circle text-green-500 mr-1 mt-0.5"></span>
              <span>Use natural lighting for clearer images</span>
            </li>
            <li class="flex items-start">
              <span class="i-heroicons-check-circle text-green-500 mr-1 mt-0.5"></span>
              <span>Include both close-up and full-body shots</span>
            </li>
            <li class="flex items-start">
              <span class="i-heroicons-check-circle text-green-500 mr-1 mt-0.5"></span>
              <span>Keep videos under 2 minutes for faster uploads</span>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Navigation Buttons -->
    <div class="mt-8 flex justify-between">
      <button @click="$emit('prevStep')" :disabled="currentStep === 1" :class="[
        'px-6 py-3 rounded-xl font-medium transition-all flex items-center',
        currentStep === 1
          ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
          : 'bg-white text-green-800 shadow-sm hover:bg-green-50 border border-green-200'
      ]">
        <span class="i-heroicons-arrow-left mr-2"></span>
        Back
      </button>

      <button v-if="currentStep < 5" @click="$emit('nextStep')" :disabled="!currentStepValid" :class="[
        'px-6 py-3 rounded-xl font-medium transition-all flex items-center',
        currentStepValid
          ? 'bg-green-600 hover:bg-green-700 text-white shadow-md'
          : 'bg-gray-200 text-gray-400 cursor-not-allowed'
      ]">
        Continue
        <span class="i-heroicons-arrow-right ml-2"></span>
      </button>

      <button v-else @click="$emit('proceedToReview')" :disabled="!currentStepValid" :class="[
        'px-6 py-3 rounded-xl font-medium transition-all flex items-center',
        currentStepValid
          ? 'bg-green-600 hover:bg-green-700 text-white shadow-md'
          : 'bg-gray-200 text-gray-400 cursor-not-allowed'
      ]">
        Review Listing
        <span class="i-heroicons-check ml-2"></span>
      </button>
    </div>
  </div>
</template>