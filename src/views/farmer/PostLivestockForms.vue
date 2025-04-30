<script setup lang="ts">
import { ref, computed, watch } from 'vue';

// Types
interface Option { label: string; value: string; icon?: string; color?: string; hoverColor?: string; title?: string }
interface FormData {
  title: string; category: string; breed: string; price: number | null; negotiable: boolean;
  quantity: number; age: number | null; ageUnit: string; gender: string; weight: number | null;
  weightUnit: string; healthStatus: string; feedingType: string; detailedLocation: string;
  deliveryOptions: string[]; deliveryRestrictions: string; maxDeliveryDistance: number | null;
  deliveryDistanceUnit: string; certified: boolean; auction: boolean; availableImmediate: boolean;
  description: string; images: string[]; video: string | null;
}

// Form state
const currentStep = ref(1), totalSteps = 5, formReviewed = ref(false);

// Form fields
const title = ref(''), description = ref(''), category = ref(''), breed = ref(''), price = ref<number | null>(null);
const negotiable = ref(false), quantity = ref(1), age = ref<number | null>(null), ageUnit = ref('months');
const gender = ref(''), weight = ref<number | null>(null), weightUnit = ref('lbs'), healthStatus = ref('');
const feedingType = ref(''), detailedLocation = ref(''), deliveryOptions = ref<string[]>([]);
const deliveryRestrictions = ref(''), maxDeliveryDistance = ref<number | null>(null), deliveryDistanceUnit = ref('miles');
const certified = ref(false), auction = ref(false), availableImmediate = ref(false);
const imagePreviewUrls = ref<string[]>([]), videoPreview = ref<string | null>(null), maxImageUploadCount = 5;

// Options
const categoryOptions = ref<Option[]>([
  { label: 'Cattle', value: 'cattle', icon: '🐄', color: 'bg-green-100', hoverColor: 'hover:bg-green-200' },
  { label: 'Sheep', value: 'sheep', icon: '🐑', color: 'bg-gray-100', hoverColor: 'hover:bg-gray-200' },
  { label: 'Goats', value: 'goats', icon: '🐐', color: 'bg-lime-100', hoverColor: 'hover:bg-lime-200' },
  { label: 'Pigs', value: 'pigs', icon: '🐖', color: 'bg-pink-100', hoverColor: 'hover:bg-pink-200' },
  { label: 'Horses', value: 'horses', icon: '🐎', color: 'bg-amber-100', hoverColor: 'hover:bg-amber-200' }
]);

const breedMap: Record<string, Option[]> = {
  cattle: [{ label: 'Angus', value: 'angus' }, { label: 'Hereford', value: 'hereford' }, { label: 'Holstein', value: 'holstein' }, { label: 'Brahman', value: 'brahman' }, { label: 'Charolais', value: 'charolais' }],
  sheep: [{ label: 'Merino', value: 'merino' }, { label: 'Suffolk', value: 'suffolk' }, { label: 'Dorper', value: 'dorper' }, { label: 'Hampshire', value: 'hampshire' }],
  goats: [{ label: 'Boer', value: 'boer' }, { label: 'Alpine', value: 'alpine' }, { label: 'Nubian', value: 'nubian' }, { label: 'Saanen', value: 'saanen' }],
  pigs: [{ label: 'Berkshire', value: 'berkshire' }, { label: 'Yorkshire', value: 'yorkshire' }, { label: 'Duroc', value: 'duroc' }, { label: 'Hampshire', value: 'hampshire' }],
  horses: [{ label: 'Quarter Horse', value: 'quarter-horse' }, { label: 'Arabian', value: 'arabian' }, { label: 'Thoroughbred', value: 'thoroughbred' }, { label: 'Appaloosa', value: 'appaloosa' }, { label: 'Morgan', value: 'morgan' }]
};

const availableBreeds = ref<Option[]>([]);
const ageUnitOptions = ref<Option[]>([{ label: 'Months', value: 'months' }, { label: 'Years', value: 'years' }]);
const weightUnitOptions = ref<Option[]>([{ label: 'lbs', value: 'lbs' }, { label: 'kg', value: 'kg' }]);
const genderOptions = ref<Option[]>([{ label: 'Male', value: 'male' }, { label: 'Female', value: 'female' }]);
const healthStatusOptions = ref<Option[]>([{ label: 'Select Health Status', value: '' }, { label: 'Excellent', value: 'excellent' }, { label: 'Good', value: 'good' }, { label: 'Fair', value: 'fair' }]);
const deliveryDistanceUnitOptions = ref<Option[]>([{ label: 'Miles', value: 'miles' }, { label: 'Kilometers', value: 'kilometers' }]);
const deliveryOptionItems = ref<Option[]>([
  { label: 'On-site Pickup', value: 'on-site-pickup', icon: 'i-heroicons-home' },
  { label: 'Local Delivery', value: 'local-delivery', icon: 'i-heroicons-truck' },
  { label: 'Transportation Services', value: 'transportation-services', icon: 'i-heroicons-globe-alt' }
]);

const stepsItems = ref<{ title: string; icon: string }[]>([
  { title: 'Basic Info', icon: 'i-heroicons-identification' },
  { title: 'Pricing', icon: 'i-heroicons-currency-dollar' },
  { title: 'Details', icon: 'i-heroicons-clipboard-document-list' },
  { title: 'Location', icon: 'i-heroicons-map-pin' },
  { title: 'Media', icon: 'i-heroicons-photo' }
]);

// Computed
const progressPercentage = computed(() => (currentStep.value / totalSteps) * 100);
const getCategoryIcon = computed(() => categoryOptions.value.find(cat => cat.value === category.value)?.icon || '🐄');
const getCategoryName = computed(() => categoryOptions.value.find(cat => cat.value === category.value)?.label || '');
const getBreedName = computed(() => availableBreeds.value.find(b => b.value === breed.value)?.label || '');

const stepValidation = computed(() => ({
  1: title.value.trim() !== '' && category.value !== '' && breed.value !== '',
  2: price.value !== null && price.value > 0 && quantity.value > 0,
  3: true, // Physical characteristics optional
  4: detailedLocation.value.trim() !== '' && description.value.trim() !== '',
  5: true // Media optional
}));

const currentStepValid = computed(() => stepValidation.value[currentStep.value as keyof typeof stepValidation.value]);

// Watchers
watch(category, (newCategory) => {
  breed.value = '';
  availableBreeds.value = breedMap[newCategory] || [];
});

// Methods
const goBack = () => {
  window.location.href = '/main/LivestockMarket';
};

const nextStep = () => {
  if (currentStep.value < totalSteps && currentStepValid.value) {
    currentStep.value++;
    window.scrollTo(0, 0);
  }
};

const prevStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--;
    window.scrollTo(0, 0);
  }
};

const goToStep = (step: number) => {
  if (step < currentStep.value || stepValidation.value[step as keyof typeof stepValidation.value]) {
    currentStep.value = step;
    window.scrollTo(0, 0);
  }
};

const handleFileUpload = (event: Event) => {
  const files = (event.target as HTMLInputElement).files;
  if (!files?.length) return;

  for (let i = 0; i < files.length && imagePreviewUrls.value.length < maxImageUploadCount; i++) {
    const reader = new FileReader();
    reader.onload = (e) => e.target?.result && imagePreviewUrls.value.push(e.target.result as string);
    reader.readAsDataURL(files[i]);
  }
  (event.target as HTMLInputElement).value = '';
};

const handleVideoUpload = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => e.target?.result && (videoPreview.value = e.target.result as string);
  reader.readAsDataURL(file);
  (event.target as HTMLInputElement).value = '';
};

const removeImage = (index: number) => imagePreviewUrls.value.splice(index, 1);
const clearImages = () => imagePreviewUrls.value = [];
const clearVideo = () => videoPreview.value = null;

const validateForm = () => {
  for (let i = 1; i <= totalSteps - 1; i++) {
    if (!stepValidation.value[i as keyof typeof stepValidation.value]) {
      currentStep.value = i;
      return false;
    }
  }
  return true;
};

const proceedToReview = () => {
  if (validateForm()) {
    formReviewed.value = true;
    window.scrollTo(0, 0);
  }
};

const submitForm = () => {
  const formData: FormData = {
    title: title.value, category: category.value, breed: breed.value, price: price.value,
    negotiable: negotiable.value, quantity: quantity.value, age: age.value, ageUnit: ageUnit.value,
    gender: gender.value, weight: weight.value, weightUnit: weightUnit.value, healthStatus: healthStatus.value,
    feedingType: feedingType.value, detailedLocation: detailedLocation.value, deliveryOptions: deliveryOptions.value,
    deliveryRestrictions: deliveryRestrictions.value, maxDeliveryDistance: maxDeliveryDistance.value,
    deliveryDistanceUnit: deliveryDistanceUnit.value, certified: certified.value, auction: auction.value,
    availableImmediate: availableImmediate.value, description: description.value,
    images: imagePreviewUrls.value, video: videoPreview.value
  };

  console.log('Submitting Listing:', formData);
  alert('Listing submitted successfully!');
  resetForm();
};

const resetForm = () => {
  title.value = '';
  description.value = '';
  category.value = '';
  breed.value = '';
  price.value = null;
  negotiable.value = false;
  quantity.value = 1;
  age.value = null;
  ageUnit.value = 'months';
  gender.value = '';
  weight.value = null;
  weightUnit.value = 'lbs';
  healthStatus.value = '';
  feedingType.value = '';
  detailedLocation.value = '';
  deliveryOptions.value = [];
  deliveryRestrictions.value = '';
  maxDeliveryDistance.value = null;
  deliveryDistanceUnit.value = 'miles';
  certified.value = false;
  auction.value = false;
  availableImmediate.value = false;
  imagePreviewUrls.value = [];
  videoPreview.value = null;
  formReviewed.value = false;
  currentStep.value = 1;
};

const editForm = () => {
  formReviewed.value = false;
  currentStep.value = 1;
};

const getDeliveryOptionLabel = (value: string) => deliveryOptionItems.value.find(item => item.value === value)?.label || '';
const getDeliveryOptionIcon = (value: string) => deliveryOptionItems.value.find(item => item.value === value)?.icon || '';
const formatPrice = (value: number | null) => value === null ? "$0.00" : new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
const getHealthStatusColor = (status: string) => ({
  excellent: 'text-green-600', good: 'text-green-600', fair: 'text-yellow-600'
}[status] || 'text-gray-600');
</script>

<template>
  <div
    class="min-h-screen bg-gradient-to-br from-green-400 via-emerald-500 to-teal-600 font-sans antialiased text-gray-900">
    <!-- Back button -->
    <div class="fixed top-4 left-4 z-50">
      <button @click="goBack"
        class="flex items-center gap-2 bg-white bg-opacity-90 hover:bg-opacity-100 text-green-800 px-4 py-2 rounded-full shadow-lg transition-all duration-300 font-medium transform hover:scale-105">
        <span class="i-heroicons-arrow-left text-lg"></span>
        <span>Back to Market</span>
      </button>
    </div>

    <!-- Fixed sidebar and main content layout -->
    <div class="flex flex-col lg:flex-row">
      <!-- Sidebar - Fixed on large screens -->
      <div class="lg:w-80 lg:fixed lg:top-0 lg:left-0 lg:bottom-0 bg-white lg:shadow-xl z-20 border-r border-green-100">
        <!-- Brand -->
        <div class="px-6 py-8 bg-gradient-to-r from-green-700 to-green-900 text-white">
          <div class="flex items-center space-x-3">
            <span class="i-heroicons-square-3-stack-3d text-4xl text-green-200"></span>
            <div>
              <h1 class="text-2xl font-bold">Livestock Market</h1>
              <p class="text-green-200 text-sm">Premium Listing Portal</p>
            </div>
          </div>
        </div>

        <!-- Progress indicator -->
        <div class="p-6 border-b border-gray-100">
          <div class="flex justify-between items-center mb-3">
            <span class="text-sm font-medium text-gray-600">LISTING PROGRESS</span>
            <span class="text-sm font-bold text-green-600">{{ Math.round(progressPercentage) }}%</span>
          </div>
          <div class="h-3 bg-gray-100 rounded-full overflow-hidden shadow-inner">
            <div class="h-full bg-gradient-to-r from-green-500 to-teal-500 transition-all duration-500 rounded-full"
              :style="`width: ${progressPercentage}%`"></div>
          </div>
          <div class="mt-2 text-xs font-medium text-gray-500 flex justify-between">
            <span>Step {{ currentStep }} of {{ totalSteps }}</span>
            <span v-if="progressPercentage === 100" class="text-green-600">Ready for review!</span>
          </div>
        </div>

        <!-- Step navigation -->
        <nav class="p-4">
          <ul class="space-y-2">
            <li v-for="(step, index) in stepsItems" :key="index">
              <button @click="goToStep(index + 1)"
                :disabled="index + 1 > currentStep && !stepValidation[index + 1 as keyof typeof stepValidation]" :class="[
                  'w-full flex items-center py-3 px-4 rounded-xl transition-all duration-300',
                  currentStep === index + 1
                    ? 'bg-gradient-to-r from-green-600 to-green-700 text-white font-medium shadow-md'
                    : index + 1 < currentStep
                      ? 'bg-green-50 text-green-800 hover:bg-green-100'
                      : 'text-gray-500 hover:bg-gray-100'
                ]">
                <span
                  :class="[step.icon, 'mr-3 text-xl', currentStep === index + 1 ? 'text-white' : 'text-green-600']"></span>
                <span>{{ step.title }}</span>

                <span v-if="index + 1 < currentStep" class="ml-auto i-heroicons-check-circle text-green-500"></span>
                <span v-else-if="index + 1 === currentStep" class="ml-auto w-2 h-2 rounded-full bg-white"></span>
              </button>
            </li>
          </ul>
        </nav>

        <!-- Tips section -->
        <div class="mx-4 mt-6 p-4 bg-amber-50 rounded-xl border border-amber-100">
          <h4 class="font-medium text-amber-800 flex items-center mb-2">
            <span class="i-heroicons-light-bulb text-amber-600 mr-2"></span>
            Listing Tips
          </h4>
          <p class="text-sm text-amber-700">
            High-quality listings with clear photos and detailed descriptions get up to 3x more buyer interest.
          </p>
        </div>
      </div>

      <!-- Main content - Adjusts based on sidebar -->
      <div class="lg:ml-80 w-full lg:px-10 py-8">
        <div class="max-w-4xl mx-auto">
          <!-- Header -->
          <div class="mb-8">
            <div class="flex items-center justify-between">
              <div>
                <h1 class="text-3xl lg:text-4xl font-bold text-white drop-shadow-md">Create Livestock Listing</h1>
                <p class="mt-2 text-lg text-white text-opacity-90">Showcase your quality livestock to buyers nationwide
                </p>
              </div>

              <div class="hidden md:block">
                <img src="/src/assets/Bull.jpg" alt="Livestock illustration"
                  class="h-20 rounded-xl shadow-xl opacity-95" />
              </div>
            </div>
          </div>

          <!-- Main Form Card -->
          <div class="bg-white rounded-3xl shadow-2xl overflow-hidden border border-white border-opacity-30">
            <!-- Form Review Mode -->
            <div v-if="formReviewed" class="p-8">
              <div class="flex items-center justify-between mb-8 pb-5 border-b border-gray-100">
                <div class="flex items-center">
                  <span
                    class="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-600 mr-4 shadow-sm">
                    <span class="i-heroicons-check text-xl"></span>
                  </span>
                  <h2 class="text-2xl font-bold text-gray-800">Review Your Listing</h2>
                </div>
                <button @click="editForm"
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
                    <button @click="editForm"
                      class="order-2 md:order-1 px-6 py-3 rounded-xl bg-white text-green-700 border border-green-200 hover:bg-green-50 transition-colors shadow-sm font-medium flex items-center">
                      <span class="i-heroicons-pencil-square mr-2"></span>
                      Edit Listing
                    </button>

                    <button @click="submitForm"
                      class="order-1 md:order-2 w-full md:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white transition-colors shadow-md font-bold flex items-center justify-center">
                      <span class="i-heroicons-check-circle mr-2"></span>
                      Submit Listing
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Main Form Steps -->
            <div v-else class="p-8">
              <!-- Step 1: Basic Info -->
              <div v-if="currentStep === 1">
                <h2 class="text-2xl font-bold mb-6 text-gray-800 flex items-center">
                  <span
                    class="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center mr-3 shadow-sm text-lg">1</span>
                  Basic Information
                </h2>

                <div class="space-y-6">
                  <!-- Title Field -->
                  <div>
                    <label for="title" class="block text-gray-700 font-medium mb-2">Listing Title <span
                        class="text-red-500">*</span></label>
                    <input v-model="title" type="text" id="title" placeholder="e.g. Premium Angus Breeding Bulls"
                      class="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all" />
                  </div>

                  <!-- Category Selection -->
                  <div>
                    <label class="block text-gray-700 font-medium mb-3">Category <span
                        class="text-red-500">*</span></label>
                    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                      <button v-for="option in categoryOptions" :key="option.value" type="button"
                        @click="category = option.value" :class="[
                          'flex items-center p-4 rounded-xl border transition-all',
                          category === option.value
                            ? 'border-green-600 bg-green-50 ring-2 ring-green-500 ring-opacity-50'
                            : 'border-gray-200 hover:border-green-300 ' + option.color + ' ' + option.hoverColor
                        ]">
                        <span class="text-3xl mr-3">{{ option.icon }}</span>
                        <span :class="[category === option.value ? 'text-green-800' : 'text-gray-700', 'font-medium']">
                          {{ option.label }}
                        </span>
                      </button>
                    </div>
                  </div>

                  <!-- Breed Selection -->
                  <div v-if="category">
                    <label for="breed" class="block text-gray-700 font-medium mb-2">Breed <span
                        class="text-red-500">*</span></label>
                    <select v-model="breed" id="breed"
                      class="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all bg-white">
                      <option value="">Select Breed</option>
                      <option v-for="option in availableBreeds" :key="option.value" :value="option.value">
                        {{ option.label }}
                      </option>
                    </select>
                  </div>

                  <!-- Certified, Auction, Available Checkboxes -->
                  <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div class="flex items-start space-x-3">
                      <div class="flex items-center h-6 mt-0.5">
                        <input v-model="certified" id="certified" type="checkbox"
                          class="w-5 h-5 text-green-600 rounded border-gray-300 focus:ring-green-500" />
                      </div>
                      <div>
                        <label for="certified" class="font-medium text-gray-800">Certified</label>
                        <p class="text-sm text-gray-500">Verified health records</p>
                      </div>
                    </div>

                    <div class="flex items-start space-x-3">
                      <div class="flex items-center h-6 mt-0.5">
                        <input v-model="auction" id="auction" type="checkbox"
                          class="w-5 h-5 text-green-600 rounded border-gray-300 focus:ring-green-500" />
                      </div>
                      <div>
                        <label for="auction" class="font-medium text-gray-800">Auction</label>
                        <p class="text-sm text-gray-500">Allow bidding</p>
                      </div>
                    </div>

                    <div class="flex items-start space-x-3">
                      <div class="flex items-center h-6 mt-0.5">
                        <input v-model="availableImmediate" id="available" type="checkbox"
                          class="w-5 h-5 text-green-600 rounded border-gray-300 focus:ring-green-500" />
                      </div>
                      <div>
                        <label for="available" class="font-medium text-gray-800">Available Now</label>
                        <p class="text-sm text-gray-500">Ready for delivery</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Step 2: Price & Quantity -->
              <div v-else-if="currentStep === 2">
                <h2 class="text-2xl font-bold mb-6 text-gray-800 flex items-center">
                  <span
                    class="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center mr-3 shadow-sm text-lg">2</span>
                  Pricing & Quantity
                </h2>

                <div class="space-y-6">
                  <!-- Price field -->
                  <div>
                    <label for="price" class="block text-gray-700 font-medium mb-2">Price per Unit <span
                        class="text-red-500">*</span></label>
                    <div class="flex items-center">
                      <span class="absolute ml-4 text-gray-500">$</span>
                      <input v-model="price" type="number" min="0" step="0.01" id="price" placeholder="0.00"
                        class="w-full pl-8 pr-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all" />
                    </div>
                  </div>

                  <!-- Negotiable checkbox -->
                  <div class="flex items-center space-x-3 bg-green-50 p-4 rounded-xl">
                    <div class="flex items-center h-5">
                      <input v-model="negotiable" id="negotiable" type="checkbox"
                        class="w-5 h-5 text-green-600 rounded border-gray-300 focus:ring-green-500" />
                    </div>
                    <div>
                      <label for="negotiable" class="font-medium text-gray-800">Price is negotiable</label>
                      <p class="text-sm text-gray-600">Allow buyers to make offers</p>
                    </div>
                  </div>

                  <!-- Quantity field -->
                  <div>
                    <label for="quantity" class="block text-gray-700 font-medium mb-2">Quantity Available <span
                        class="text-red-500">*</span></label>
                    <input v-model="quantity" type="number" min="1" id="quantity"
                      class="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all" />
                  </div>

                  <!-- Price tips card -->
                  <div class="bg-blue-50 p-4 rounded-xl border border-blue-100">
                    <h4 class="font-medium text-blue-800 flex items-center">
                      <span class="i-heroicons-information-circle text-blue-600 mr-2"></span>
                      Pricing Tips
                    </h4>
                    <ul class="mt-2 text-sm text-blue-700 space-y-1">
                      <li class="flex items-start">
                        <span class="i-heroicons-check-circle text-blue-500 mr-1 mt-0.5"></span>
                        <span>Research current market prices for similar listings</span>
                      </li>
                      <li class="flex items-start">
                        <span class="i-heroicons-check-circle text-blue-500 mr-1 mt-0.5"></span>
                        <span>Setting a fair price can lead to faster sales</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <!-- Step 3: Details -->
              <div v-else-if="currentStep === 3">
                <h2 class="text-2xl font-bold mb-6 text-gray-800 flex items-center">
                  <span
                    class="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center mr-3 shadow-sm text-lg">3</span>
                  Physical Details
                </h2>

                <div class="space-y-6">
                  <!-- Age and Gender -->
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label for="age" class="block text-gray-700 font-medium mb-2">Age</label>
                      <div class="flex space-x-3">
                        <input v-model="age" type="number" min="0" id="age" placeholder="Age"
                          class="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all" />
                        <select v-model="ageUnit"
                          class="w-32 px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all bg-white">
                          <option v-for="option in ageUnitOptions" :key="option.value" :value="option.value">
                            {{ option.label }}
                          </option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label for="gender" class="block text-gray-700 font-medium mb-2">Gender</label>
                      <div class="grid grid-cols-2 gap-3">
                        <button v-for="option in genderOptions" :key="option.value" type="button"
                          @click="gender = option.value" :class="[
                            'flex items-center justify-center p-3 rounded-xl border transition-all',
                            gender === option.value
                              ? 'border-green-600 bg-green-50 ring-2 ring-green-500 ring-opacity-50 text-green-800'
                              : 'border-gray-200 hover:border-green-300 text-gray-700 bg-white'
                          ]">
                          {{ option.label }}
                        </button>
                      </div>
                    </div>
                  </div>

                  <!-- Weight -->
                  <div>
                    <label for="weight" class="block text-gray-700 font-medium mb-2">Weight</label>
                    <div class="flex space-x-3">
                      <input v-model="weight" type="number" min="0" id="weight" placeholder="Weight"
                        class="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all" />
                      <select v-model="weightUnit"
                        class="w-24 px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all bg-white">
                        <option v-for="option in weightUnitOptions" :key="option.value" :value="option.value">
                          {{ option.label }}
                        </option>
                      </select>
                    </div>
                  </div>

                  <!-- Health Status and Feeding -->
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label for="healthStatus" class="block text-gray-700 font-medium mb-2">Health Status</label>
                      <select v-model="healthStatus" id="healthStatus"
                        class="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all bg-white">
                        <option v-for="option in healthStatusOptions" :key="option.value" :value="option.value">
                          {{ option.label }}
                        </option>
                      </select>
                    </div>

                    <div>
                      <label for="feedingType" class="block text-gray-700 font-medium mb-2">Feeding Type</label>
                      <input v-model="feedingType" type="text" id="feedingType" placeholder="e.g. Grass-fed, Grain-fed"
                        class="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all" />
                    </div>
                  </div>

                  <!-- Description field -->
                  <div>
                    <label for="description" class="block text-gray-700 font-medium mb-2">Description <span
                        class="text-red-500">*</span></label>
                    <textarea v-model="description" id="description" rows="6"
                      placeholder="Provide detailed information about your livestock..."
                      class="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all"></textarea>
                    <p class="mt-2 text-sm text-gray-500">Include breed characteristics, health history, temperament,
                      and any other relevant details</p>
                  </div>
                </div>
              </div>

              <!-- Step 4: Location & Delivery -->
              <div v-else-if="currentStep === 4">
                <h2 class="text-2xl font-bold mb-6 text-gray-800 flex items-center">
                  <span
                    class="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center mr-3 shadow-sm text-lg">4</span>
                  Location & Delivery
                </h2>

                <div class="space-y-6">
                  <!-- Location field -->
                  <div>
                    <label for="location" class="block text-gray-700 font-medium mb-2">Location <span
                        class="text-red-500">*</span></label>
                    <input v-model="detailedLocation" type="text" id="location" placeholder="City, State/Province"
                      class="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all" />
                  </div>

                  <!-- Delivery options -->
                  <div>
                    <label class="block text-gray-700 font-medium mb-3">Delivery Options</label>
                    <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div v-for="option in deliveryOptionItems" :key="option.value" :class="[
                        'flex items-center p-4 rounded-xl border cursor-pointer transition-all',
                        deliveryOptions.includes(option.value)
                          ? 'border-green-600 bg-green-50 ring-2 ring-green-500 ring-opacity-50'
                          : 'border-gray-200 hover:border-green-300 bg-white'
                      ]" @click="deliveryOptions.includes(option.value)
                        ? deliveryOptions = deliveryOptions.filter(o => o !== option.value)
                        : deliveryOptions.push(option.value)">
                        <span
                          :class="[option.icon, 'mr-3 text-xl', deliveryOptions.includes(option.value) ? 'text-green-600' : 'text-gray-400']"></span>
                        <span
                          :class="[deliveryOptions.includes(option.value) ? 'text-green-800' : 'text-gray-700', 'font-medium']">
                          {{ option.label }}
                        </span>
                      </div>
                    </div>
                  </div>

                  <!-- Delivery distance -->
                  <div v-if="deliveryOptions.includes('local-delivery')">
                    <label for="deliveryDistance" class="block text-gray-700 font-medium mb-2">Maximum Delivery
                      Distance</label>
                    <div class="flex space-x-3">
                      <input v-model="maxDeliveryDistance" type="number" min="0" id="deliveryDistance"
                        placeholder="Distance"
                        class="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all" />
                      <select v-model="deliveryDistanceUnit"
                        class="w-32 px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all bg-white">
                        <option v-for="option in deliveryDistanceUnitOptions" :key="option.value" :value="option.value">
                          {{ option.label }}
                        </option>
                      </select>
                    </div>
                  </div>

                  <!-- Delivery restrictions -->
                  <div v-if="deliveryOptions.length > 0">
                    <label for="deliveryRestrictions" class="block text-gray-700 font-medium mb-2">Delivery
                      Notes/Restrictions</label>
                    <textarea v-model="deliveryRestrictions" id="deliveryRestrictions" rows="3"
                      placeholder="Any special requirements for delivery or pickup..."
                      class="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all"></textarea>
                  </div>
                </div>
              </div>

              <!-- Step 5: Media -->
              <div v-else-if="currentStep === 5">
                <h2 class="text-2xl font-bold mb-6 text-gray-800 flex items-center">
                  <span
                    class="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center mr-3 shadow-sm text-lg">5</span>
                  Photos & Videos
                </h2>

                <div class="space-y-8">
                  <!-- Image upload -->
                  <div>
                    <label class="block text-gray-700 font-medium mb-3">Photos ({{ imagePreviewUrls.length }}/{{
                      maxImageUploadCount }})</label>

                    <div v-if="imagePreviewUrls.length > 0"
                      class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mb-4">
                      <div v-for="(url, index) in imagePreviewUrls" :key="index"
                        class="aspect-square relative rounded-xl overflow-hidden shadow-sm border border-gray-200 group">
                        <img :src="url" class="w-full h-full object-cover" :alt="`Uploaded image ${index + 1}`" />
                        <button @click="removeImage(index)"
                          class="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-80 hover:opacity-100 transition-opacity">
                          <span class="i-heroicons-x-mark text-base"></span>
                        </button>
                      </div>
                    </div>

                    <div v-if="imagePreviewUrls.length < maxImageUploadCount"
                      class="flex items-center justify-center border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors p-6">
                      <label class="flex flex-col items-center cursor-pointer w-full">
                        <span class="i-heroicons-photo text-5xl text-gray-400"></span>
                        <span class="mt-2 text-gray-600 font-medium">Upload Photos</span>
                        <span class="text-sm text-gray-500">Click to browse your files</span>
                        <input type="file" class="hidden" accept="image/*" multiple @change="handleFileUpload" />
                      </label>
                    </div>

                    <p class="mt-2 text-sm text-gray-500">Add up to {{ maxImageUploadCount }} high-quality photos of
                      your livestock</p>

                    <div v-if="imagePreviewUrls.length > 0" class="flex justify-end mt-3">
                      <button @click="clearImages"
                        class="text-red-600 hover:text-red-800 text-sm font-medium flex items-center">
                        <span class="i-heroicons-trash mr-1"></span>
                        Clear all photos
                      </button>
                    </div>
                  </div>

                  <!-- Video upload -->
                  <div>
                    <label class="block text-gray-700 font-medium mb-3">Video (Optional)</label>

                    <div v-if="videoPreview" class="mb-4">
                      <div class="aspect-video rounded-xl overflow-hidden shadow-sm border border-gray-200 bg-black">
                        <video controls class="w-full h-full">
                          <source :src="videoPreview" type="video/mp4">
                          Your browser does not support video playback.
                        </video>
                      </div>
                      <div class="flex justify-end mt-2">
                        <button @click="clearVideo"
                          class="text-red-600 hover:text-red-800 text-sm font-medium flex items-center">
                          <span class="i-heroicons-trash mr-1"></span>
                          Remove video
                        </button>
                      </div>
                    </div>

                    <div v-if="!videoPreview"
                      class="flex items-center justify-center border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors p-6">
                      <label class="flex flex-col items-center cursor-pointer w-full">
                        <span class="i-heroicons-film text-5xl text-gray-400"></span>
                        <span class="mt-2 text-gray-600 font-medium">Upload Video</span>
                        <span class="text-sm text-gray-500">Click to browse your files</span>
                        <input type="file" class="hidden" accept="video/*" @change="handleVideoUpload" />
                      </label>
                    </div>

                    <p class="mt-2 text-sm text-gray-500">Upload a video showcasing your livestock (max 100MB)</p>
                  </div>

                  <!-- Tips card -->
                  <div class="bg-amber-50 p-4 rounded-xl border border-amber-100">
                    <h4 class="font-medium text-amber-800 flex items-center">
                      <span class="i-heroicons-light-bulb text-amber-600 mr-2"></span>
                      Media Tips
                    </h4>
                    <ul class="mt-2 text-sm text-amber-700 space-y-1">
                      <li class="flex items-start">
                        <span class="i-heroicons-check-circle text-amber-500 mr-1 mt-0.5"></span>
                        <span>Use natural lighting for best results</span>
                      </li>
                      <li class="flex items-start">
                        <span class="i-heroicons-check-circle text-amber-500 mr-1 mt-0.5"></span>
                        <span>Include multiple angles of the livestock</span>
                      </li>
                      <li class="flex items-start">
                        <span class="i-heroicons-check-circle text-amber-500 mr-1 mt-0.5"></span>
                        <span>Videos showing movement and behavior increase buyer interest</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <!-- Form Navigation Buttons -->
              <div class="mt-12 pt-6 border-t border-gray-200">
                <div class="flex justify-between">
                  <button @click="prevStep" v-if="currentStep > 1"
                    class="px-6 py-3 rounded-xl bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 transition-colors shadow-sm font-medium flex items-center">
                    <span class="i-heroicons-arrow-left mr-2"></span>
                    Back
                  </button>
                  <div v-else></div>

                  <button v-if="currentStep < totalSteps" @click="nextStep" :disabled="!currentStepValid" :class="[
                    'px-6 py-3 rounded-xl shadow-sm font-medium flex items-center',
                    currentStepValid
                      ? 'bg-green-600 hover:bg-green-700 text-white transition-colors'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  ]">
                    Continue
                    <span class="i-heroicons-arrow-right ml-2"></span>
                  </button>

                  <button v-else @click="proceedToReview"
                    class="px-8 py-4 rounded-xl bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white transition-colors shadow-md font-bold flex items-center">
                    Review Listing
                    <span class="i-heroicons-check-circle ml-2"></span>
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