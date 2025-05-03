<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import LivestockFormSteps from '../../components/Farmer/LivestockFormSteps.vue';
import LivestockFormReview from '../../components/Farmer/LivestockFormReview.vue';
import { ArrowLeftIcon, IdentificationIcon, CurrencyDollarIcon, ClipboardDocumentListIcon, MapPinIcon, PhotoIcon, CheckCircleIcon } from '@heroicons/vue/24/solid'

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
const mobileMenuOpen = ref(false);

const progressPercentage = computed(() => (currentStep.value / totalSteps) * 100);

// Form fields
const title = ref(''), description = ref(''), category = ref(''), breed = ref(''), price = ref<number | null>(null);
const negotiable = ref(false), quantity = ref(1), age = ref<number | null>(null), ageUnit = ref('months');
const gender = ref(''), weight = ref<number | null>(null), weightUnit = ref('lbs'), healthStatus = ref('');
const feedingType = ref(''), detailedLocation = ref(''), deliveryOptions = ref<string[]>([]);
const deliveryRestrictions = ref(''), maxDeliveryDistance = ref<number | null>(null), deliveryDistanceUnit = ref('miles');
const certified = ref(false), auction = ref(false), availableImmediate = ref(false);
const imagePreviewUrls = ref<string[]>([]), videoPreview = ref<string | null>(null), maxImageUploadCount = 5;

// Options
const breedMap: Record<string, Option[]> = {
  cattle: [{ label: 'Angus', value: 'angus' }, { label: 'Hereford', value: 'hereford' }, { label: 'Holstein', value: 'holstein' }, { label: 'Brahman', value: 'brahman' }, { label: 'Charolais', value: 'charolais' }],
  sheep: [{ label: 'Merino', value: 'merino' }, { label: 'Suffolk', value: 'suffolk' }, { label: 'Dorper', value: 'dorper' }, { label: 'Hampshire', value: 'hampshire' }],
  goats: [{ label: 'Boer', value: 'boer' }, { label: 'Alpine', value: 'alpine' }, { label: 'Nubian', value: 'nubian' }, { label: 'Saanen', value: 'saanen' }],
  pigs: [{ label: 'Berkshire', value: 'berkshire' }, { label: 'Yorkshire', value: 'yorkshire' }, { label: 'Duroc', value: 'duroc' }, { label: 'Hampshire', value: 'hampshire' }],
  horses: [{ label: 'Quarter Horse', value: 'quarter-horse' }, { label: 'Arabian', value: 'arabian' }, { label: 'Thoroughbred', value: 'thoroughbred' }, { label: 'Appaloosa', value: 'appaloosa' }, { label: 'Morgan', value: 'morgan' }]
};

const availableBreeds = ref<Option[]>([]);

// Updated icons with consistent icon library (heroicons)
const stepsItems = ref([
  { title: 'Basic Info', icon: IdentificationIcon },
  { title: 'Pricing', icon: CurrencyDollarIcon },
  { title: 'Details', icon: ClipboardDocumentListIcon },
  { title: 'Location', icon: MapPinIcon },
  { title: 'Media', icon: PhotoIcon }
])

// Added more visually appealing colors to category options
const categoryOptions = ref<Option[]>([
  { label: 'Cattle', value: 'cattle', icon: '🐄', color: 'bg-amber-100', hoverColor: 'hover:bg-amber-200' },
  { label: 'Sheep', value: 'sheep', icon: '🐑', color: 'bg-blue-100', hoverColor: 'hover:bg-blue-200' },
  { label: 'Goats', value: 'goats', icon: '🐐', color: 'bg-emerald-100', hoverColor: 'hover:bg-emerald-200' },
  { label: 'Pigs', value: 'pigs', icon: '🐖', color: 'bg-pink-100', hoverColor: 'hover:bg-pink-200' },
  { label: 'Horses', value: 'horses', icon: '🐎', color: 'bg-orange-100', hoverColor: 'hover:bg-orange-200' }
]);

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
    window.scrollTo({ top: 0, behavior: 'smooth' });
    mobileMenuOpen.value = false; // Close mobile menu when moving to next step
  }
};

const prevStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    mobileMenuOpen.value = false; // Close mobile menu when moving to previous step
  }
};

const goToStep = (step: number) => {
  if (step < currentStep.value || stepValidation.value[step as keyof typeof stepValidation.value]) {
    currentStep.value = step;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    mobileMenuOpen.value = false; // Close mobile menu when selecting a specific step
  }
};

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value;
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
    window.scrollTo({ top: 0, behavior: 'smooth' });
    mobileMenuOpen.value = false; // Close mobile menu when proceeding to review
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
  // Show success toast instead of alert
  showToast('Listing submitted successfully!');
  resetForm();
};

// Toast notification system
const toastVisible = ref(false);
const toastMessage = ref('');
const toastType = ref('success');

const showToast = (message: string, type: string = 'success') => {
  toastMessage.value = message;
  toastType.value = type;
  toastVisible.value = true;

  setTimeout(() => {
    toastVisible.value = false;
  }, 3000);
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
  mobileMenuOpen.value = false;
};

const editForm = () => {
  formReviewed.value = false;
  currentStep.value = 1;
};
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-emerald-50 to-green-100 font-sans antialiased text-gray-800">
    <!-- Toast Notification -->
    <div v-if="toastVisible"
      class="fixed top-5 right-5 z-50 max-w-sm p-4 rounded-lg shadow-lg transition-all duration-300 transform scale-100 opacity-100"
      :class="[toastType === 'success' ? 'bg-green-500' : 'bg-red-500']">
      <div class="flex items-center">
        <div class="flex-shrink-0">
          <span v-if="toastType === 'success'" class="i-heroicons-check-circle-solid text-white text-xl"></span>
          <span v-else class="i-heroicons-x-circle-solid text-white text-xl"></span>
        </div>
        <div class="ml-3">
          <p class="text-sm font-medium text-white">{{ toastMessage }}</p>
        </div>
        <div class="ml-4 flex-shrink-0 flex">
          <button @click="toastVisible = false" class="inline-flex text-white">
            <span class="i-heroicons-x-mark text-sm"></span>
          </button>
        </div>
      </div>
    </div>

    <!-- Header with mobile menu toggle -->
    <header class="bg-white shadow-md lg:hidden sticky top-0 z-50 border-b border-green-100">
      <div class="flex items-center justify-between px-4 py-3">
        <button @click="goBack" class="text-green-600 flex items-center gap-1 font-medium">
          <span class="i-heroicons-arrow-left-solid"></span>
          <span>Back</span>
        </button>
        <h1 class="text-lg font-semibold text-green-700">New Livestock Listing</h1>
        <button @click="toggleMobileMenu" class="text-green-600 p-2">
          <span v-if="!mobileMenuOpen" class="i-heroicons-bars-3-solid"></span>
          <span v-else class="i-heroicons-x-mark-solid"></span>
        </button>
      </div>

      <!-- Mobile Progress Bar -->
      <div class="px-4 py-2 bg-green-50">
        <div class="flex justify-between items-center mb-1">
          <span class="text-xs font-medium text-gray-600">Step {{ currentStep }} of {{ totalSteps }}</span>
          <span class="text-xs font-bold text-green-500">{{ Math.round(progressPercentage) }}%</span>
        </div>
        <div class="h-2 bg-gray-100 rounded-full overflow-hidden shadow-inner">
          <div class="h-full bg-gradient-to-r from-green-400 to-green-500 transition-all duration-500 rounded-full"
            :style="`width: ${progressPercentage}%`"></div>
        </div>
      </div>
    </header>

    <!-- Mobile Navigation Menu with improved animation -->
    <div v-if="mobileMenuOpen"
      class="fixed inset-0 z-40 lg:hidden bg-black bg-opacity-50 transition-opacity duration-300"
      @click="mobileMenuOpen = false">
      <div
        class="absolute top-16 right-0 bottom-0 w-64 bg-white shadow-xl transition-transform duration-300 animate-slide-in-right"
        @click.stop>
        <div class="p-4 border-b border-gray-100">
          <h3 class="font-bold text-green-700 mb-2 flex items-center">
            <span class="i-heroicons-square-3-stack-3d-solid mr-2"></span>
            Livestock Listing
          </h3>
          <p class="text-sm text-gray-500">Complete your listing in 5 easy steps</p>
        </div>

        <!-- Step navigation with improved icons -->
        <nav class="p-4">
          <ul class="space-y-2">
            <li v-for="(step, index) in stepsItems" :key="index">
              <button @click="goToStep(index + 1)"
                :disabled="index + 1 > currentStep && !stepValidation[index + 1 as keyof typeof stepValidation]" :class="[
                  'w-full flex items-center py-3 px-4 rounded-lg transition-all duration-300',
                  currentStep === index + 1
                    ? 'bg-gradient-to-r from-green-400 to-green-500 text-white font-medium shadow-sm'
                    : index + 1 < currentStep
                      ? 'bg-green-50 text-green-700 hover:bg-green-100'
                      : 'text-gray-500 hover:bg-gray-100'
                ]">
                <span
                  :class="[step.icon, 'mr-3 text-xl', currentStep === index + 1 ? 'text-white' : 'text-green-500']"></span>
                <span>{{ step.title }}</span>

                <span v-if="index + 1 < currentStep"
                  class="ml-auto i-heroicons-check-circle-solid text-green-500"></span>
                <span v-else-if="index + 1 === currentStep" class="ml-auto w-2 h-2 rounded-full bg-white"></span>
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </div>

    <!-- Main Layout -->
    <div class="flex flex-col lg:flex-row">
      <!-- Sidebar - Further enhanced -->
      <div
        class="hidden lg:block lg:w-72 fixed top-0 left-0 bottom-0 bg-white shadow-lg z-20 border-r border-green-100">
        <!-- Brand and Header with animated gradient -->
        <div class="bg-gradient-to-br from-green-600 to-emerald-700 text-white px-6 py-6 bg-animate">
          <div class="flex items-center gap-3 mb-4">
            <div class="bg-white bg-opacity-20 p-2 rounded-xl">
              <span class="i-heroicons-square-3-stack-3d-solid text-2xl text-white"></span>
            </div>
            <div>
              <h1 class="text-xl font-bold">Livestock Market</h1>
              <p class="text-green-100 text-xs">Premium Listing Portal</p>
            </div>
          </div>

          <button @click="goBack" class="flex items-center gap-2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-4 py-2 rounded-lg 
    transition-all duration-300 w-full text-sm font-medium">
            <ArrowLeftIcon class="w-5 h-5" />
            <span>Back to Market</span>
          </button>
        </div>

        <!-- Progress indicator - Enhanced with animation -->
        <div class="p-4 border-b border-gray-100">
          <div class="flex justify-between items-center mb-2">
            <span class="text-sm font-medium text-gray-700">Your Progress</span>
            <span class="text-sm font-bold text-green-600">{{ Math.round(progressPercentage) }}%</span>
          </div>
          <div class="h-2 bg-gray-100 rounded-full overflow-hidden shadow-inner">
            <div class="h-full bg-gradient-to-r from-green-400 to-emerald-500 transition-all duration-500 rounded-full"
              :style="`width: ${progressPercentage}%`"></div>
          </div>
          <div class="mt-2 text-xs font-medium text-gray-500 flex justify-between">
            <span>Step {{ currentStep }} of {{ totalSteps }}</span>
            <span v-if="progressPercentage === 100" class="text-green-500 animate-pulse">Ready for review!</span>
          </div>
        </div>

        <!-- Step navigation - With enhanced visual indicators -->
        <nav class="p-4 overflow-y-auto">
          <h3 class="text-xs font-bold uppercase text-gray-500 mb-3 tracking-wider px-2">Form Steps</h3>
          <ul class="space-y-1.5">
            <li v-for="(step, index) in stepsItems" :key="index">
              <button @click="goToStep(index + 1)" :disabled="index + 1 > currentStep && !stepValidation[index + 1 as keyof typeof stepValidation]"
                :class="[
                  'w-full flex items-center py-2.5 px-3 rounded-lg transition-all duration-300',
                  currentStep === index + 1
                    ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white font-medium shadow-sm'
                    : index + 1 < currentStep
                      ? 'bg-green-50 text-green-700 hover:bg-green-100'
                      : 'text-gray-500 hover:bg-gray-100'
                ]">
                <div class="flex items-center justify-center h-7 w-7 rounded-full mr-3" :class="[
                  currentStep === index + 1
                    ? 'bg-white bg-opacity-20 text-white'
                    : index + 1 < currentStep
                      ? 'bg-green-100 text-green-600'
                      : 'bg-gray-100 text-gray-400'
                ]">
                  <component :is="step.icon" class="w-5 h-5" />
                </div>

                <span>{{ step.title }}</span>

                <component v-if="index + 1 < currentStep" :is="CheckCircleIcon"
                  class="ml-auto w-5 h-5 text-green-600" />
                <span v-else-if="index + 1 === currentStep" class="ml-auto w-1.5 h-1.5 rounded-full bg-white"></span>
              </button>
            </li>
          </ul>
        </nav>

        <!-- Tips section - Enhanced with card hover effect -->
        <div class="absolute bottom-0 left-0 right-0 p-4">
          <div class="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-100 shadow-sm
                      hover:shadow-md transition-all duration-300 hover:border-green-200">
            <h4 class="font-medium text-green-700 flex items-center mb-2">
              <span class="i-heroicons-light-bulb-solid text-green-500 mr-2"></span>
              Pro Tips
            </h4>
            <p class="text-sm text-green-600">
              High-quality listings with clear photos and detailed descriptions get up to 3x more buyer interest.
            </p>
          </div>
        </div>
      </div>

      <!-- Main content - Enhanced with animations and better spacing -->
      <div class="lg:ml-72 w-full px-4 lg:px-8 py-4 lg:py-8">
        <div class="max-w-4xl mx-auto">
          <!-- Desktop-only header with refined typography -->
          <div class="hidden lg:block mb-6">
            <h1 class="text-2xl font-bold text-gray-800 flex items-center">
              <span class="i-heroicons-clipboard-document-list-solid text-green-500 mr-2"></span>
              Create New Livestock Listing
            </h1>
            <p class="text-gray-500 pl-7">Complete all steps to create your premium livestock listing</p>
          </div>

          <!-- Form Card - Enhanced with subtle animations -->
          <div
            class="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 transition-all duration-300 hover:shadow-xl">
            <!-- Form Review Mode -->
            <LivestockFormReview v-if="formReviewed" :title="title" :description="description" :category="category"
              :breed="breed" :price="price" :negotiable="negotiable" :quantity="quantity" :age="age" :age-unit="ageUnit"
              :gender="gender" :weight="weight" :weight-unit="weightUnit" :health-status="healthStatus"
              :feeding-type="feedingType" :detailed-location="detailedLocation" :delivery-options="deliveryOptions"
              :delivery-restrictions="deliveryRestrictions" :max-delivery-distance="maxDeliveryDistance"
              :delivery-distance-unit="deliveryDistanceUnit" :certified="certified" :auction="auction"
              :available-immediate="availableImmediate" :image-preview-urls="imagePreviewUrls"
              :video-preview="videoPreview" :category-options="categoryOptions" :available-breeds="availableBreeds"
              @editForm="editForm" @submitForm="submitForm" />

            <!-- Main Form Steps -->
            <LivestockFormSteps v-else :current-step="currentStep" :title="title" :description="description"
              :category="category" :breed="breed" :price="price" :negotiable="negotiable" :quantity="quantity"
              :age="age" :age-unit="ageUnit" :gender="gender" :weight="weight" :weight-unit="weightUnit"
              :health-status="healthStatus" :feeding-type="feedingType" :detailed-location="detailedLocation"
              :delivery-options="deliveryOptions" :delivery-restrictions="deliveryRestrictions"
              :max-delivery-distance="maxDeliveryDistance" :delivery-distance-unit="deliveryDistanceUnit"
              :certified="certified" :auction="auction" :available-immediate="availableImmediate"
              :image-preview-urls="imagePreviewUrls" :video-preview="videoPreview"
              :current-step-valid="currentStepValid" :available-breeds="availableBreeds" @update:title="title = $event"
              @update:description="description = $event" @update:category="category = $event"
              @update:breed="breed = $event" @update:price="price = $event" @update:negotiable="negotiable = $event"
              @update:quantity="quantity = $event" @update:age="age = $event" @update:ageUnit="ageUnit = $event"
              @update:gender="gender = $event" @update:weight="weight = $event" @update:weightUnit="weightUnit = $event"
              @update:healthStatus="healthStatus = $event" @update:feedingType="feedingType = $event"
              @update:detailedLocation="detailedLocation = $event" @update:deliveryOptions="deliveryOptions = $event"
              @update:deliveryRestrictions="deliveryRestrictions = $event"
              @update:maxDeliveryDistance="maxDeliveryDistance = $event"
              @update:deliveryDistanceUnit="deliveryDistanceUnit = $event" @update:certified="certified = $event"
              @update:auction="auction = $event" @update:availableImmediate="availableImmediate = $event"
              @nextStep="nextStep" @prevStep="prevStep" @proceedToReview="proceedToReview"
              @handleFileUpload="handleFileUpload" @handleVideoUpload="handleVideoUpload" @removeImage="removeImage"
              @clearImages="clearImages" @clearVideo="clearVideo" />
          </div>

          <!-- Footer with refined appearance -->
          <div class="mt-8 text-center text-sm text-gray-500 border-t border-gray-100 pt-4">
            <p>Livestock Market © 2025 •
              <a href="#"
                class="text-green-600 hover:text-green-700 hover:underline transition-colors duration-300">Terms of
                Service</a> •
              <a href="#"
                class="text-green-600 hover:text-green-700 hover:underline transition-colors duration-300">Privacy
                Policy</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Add required animations */
.animate-slide-in-right {
  animation: slideInRight 0.3s ease-out forwards;
}

.bg-animate {
  background-size: 200% 200%;
  animation: gradientShift 15s ease infinite;
}

@keyframes slideInRight {
  from {
    transform: translateX(100%);
  }

  to {
    transform: translateX(0);
  }
}

@keyframes gradientShift {
  0% {
    background-position: 0% 50%;
  }

  50% {
    background-position: 100% 50%;
  }

  100% {
    background-position: 0% 50%;
  }
}
</style>