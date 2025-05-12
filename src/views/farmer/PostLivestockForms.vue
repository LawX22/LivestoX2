<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import LivestockFormSteps from '../../components/Farmer/FormSteps.vue';
import LivestockFormReview from '../../components/Farmer/FormReview.vue';
import {
  ArrowLeftIcon,
  IdentificationIcon,
  CurrencyDollarIcon,
  ClipboardDocumentListIcon,
  MapPinIcon,
  PhotoIcon,
  CheckCircleIcon,
  XMarkIcon,
  Bars3Icon,
  LightBulbIcon,
  Square3Stack3DIcon
} from '@heroicons/vue/24/solid';

// Types
interface Option { label: string; value: string; icon?: string; color?: string; hoverColor?: string; title?: string }
interface FormData {
  title: string; category: string; breed: string; price: number; negotiable: boolean;
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
const title = ref(''), description = ref(''), category = ref(''), breed = ref(''), price = ref<number>(0);
const negotiable = ref(false), quantity = ref(1), age = ref<number | null>(null), ageUnit = ref('months');
const computedAgeValue = computed<number | undefined>(() => (age.value === null ? undefined : age.value));
const gender = ref(''), weight = ref<number | null>(null), weightUnit = ref('lbs'), healthStatus = ref('');
const feedingType = ref(''), detailedLocation = ref(''), deliveryOptions = ref<string[]>([]);
const deliveryRestrictions = ref(''), maxDeliveryDistance = ref<number | null>(null), deliveryDistanceUnit = ref('miles');
const certified = ref(false), auction = ref(false), availableImmediate = ref(false);
const imagePreviewUrls = ref<string[]>([]), videoPreview = ref<string | undefined>(undefined), maxImageUploadCount = 5;

// Options
const breedMap: Record<string, Option[]> = {
  cattle: [{ label: 'Angus', value: 'angus' }, { label: 'Hereford', value: 'hereford' }, { label: 'Holstein', value: 'holstein' }, { label: 'Brahman', value: 'brahman' }, { label: 'Charolais', value: 'charolais' }],
  sheep: [{ label: 'Merino', value: 'merino' }, { label: 'Suffolk', value: 'suffolk' }, { label: 'Dorper', value: 'dorper' }, { label: 'Hampshire', value: 'hampshire' }],
  goats: [{ label: 'Boer', value: 'boer' }, { label: 'Alpine', value: 'alpine' }, { label: 'Nubian', value: 'nubian' }, { label: 'Saanen', value: 'saanen' }],
  pigs: [{ label: 'Berkshire', value: 'berkshire' }, { label: 'Yorkshire', value: 'yorkshire' }, { label: 'Duroc', value: 'duroc' }, { label: 'Hampshire', value: 'hampshire' }],
  horses: [{ label: 'Quarter Horse', value: 'quarter-horse' }, { label: 'Arabian', value: 'arabian' }, { label: 'Thoroughbred', value: 'thoroughbred' }, { label: 'Appaloosa', value: 'appaloosa' }, { label: 'Morgan', value: 'morgan' }]
};

const availableBreeds = ref<Option[]>([]);

const stepsItems = ref([
  { title: 'Basic Info', icon: IdentificationIcon },
  { title: 'Pricing', icon: CurrencyDollarIcon },
  { title: 'Details', icon: ClipboardDocumentListIcon },
  { title: 'Location', icon: MapPinIcon },
  { title: 'Media', icon: PhotoIcon }
])

const categoryOptions = ref<Option[]>([
  { label: 'Cattle', value: 'cattle', icon: '🐄', color: 'bg-amber-100', hoverColor: 'hover:bg-amber-200' },
  { label: 'Sheep', value: 'sheep', icon: '🐑', color: 'bg-blue-100', hoverColor: 'hover:bg-blue-200' },
  { label: 'Goats', value: 'goats', icon: '🐐', color: 'bg-emerald-100', hoverColor: 'hover:bg-emerald-200' },
  { label: 'Pigs', value: 'pigs', icon: '🐖', color: 'bg-pink-100', hoverColor: 'hover:bg-pink-200' },
  { label: 'Horses', value: 'horses', icon: '🐎', color: 'bg-orange-100', hoverColor: 'hover:bg-orange-200' }
]);

const stepValidation = computed(() => ({
  1: title.value.trim() !== '' && category.value !== '' && breed.value !== '',
  2: price.value > 0 && quantity.value > 0, // Changed from price.value !== null
  3: true,
  4: detailedLocation.value.trim() !== '' && description.value.trim() !== '',
  5: true
}));

const currentStepValid = computed(() => stepValidation.value[currentStep.value as keyof typeof stepValidation.value]);

watch(category, (newCategory) => {
  breed.value = '';
  availableBreeds.value = breedMap[newCategory] || [];
});

const goBack = () => {
  window.location.href = '/main/LivestockMarket';
};

const nextStep = () => {
  if (currentStep.value < totalSteps && currentStepValid.value) {
    currentStep.value++;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    mobileMenuOpen.value = false;
  }
};

const prevStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    mobileMenuOpen.value = false;
  }
};

const goToStep = (step: number) => {
  if (step < currentStep.value || stepValidation.value[step as keyof typeof stepValidation.value]) {
    currentStep.value = step;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    mobileMenuOpen.value = false;
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
const clearVideo = () => videoPreview.value = undefined;

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
    mobileMenuOpen.value = false;
  }
};

const submitForm = () => {
  const formData: FormData = {
    title: title.value,
    category: category.value,
    breed: breed.value,
    price: price.value,
    negotiable: negotiable.value,
    quantity: quantity.value,
    age: age.value,
    ageUnit: ageUnit.value,
    gender: gender.value,
    weight: weight.value,
    weightUnit: weightUnit.value,
    healthStatus: healthStatus.value,
    feedingType: feedingType.value,
    detailedLocation: detailedLocation.value,
    deliveryOptions: deliveryOptions.value,
    deliveryRestrictions: deliveryRestrictions.value,
    maxDeliveryDistance: maxDeliveryDistance.value,
    deliveryDistanceUnit: deliveryDistanceUnit.value,
    certified: certified.value,
    auction: auction.value,
    availableImmediate: availableImmediate.value,
    description: description.value,
    images: imagePreviewUrls.value,
    video: videoPreview.value ?? null
  };

  console.log('Submitting Listing:', formData);
  showToast('Listing submitted successfully!');
  resetForm();
};

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
  price.value = 0; // Changed from null to 0
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
  videoPreview.value = undefined;
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
  <div class="min-h-screen bg-gradient-to-br from-emerald-50 to-green-50 font-sans antialiased text-gray-800">
    <!-- Toast Notification -->
    <div v-if="toastVisible"
      class="fixed top-5 right-5 z-50 max-w-sm p-4 rounded-lg shadow-xl transition-all duration-300 transform translate-y-0 opacity-100"
      :class="[toastType === 'success' ? 'bg-gradient-to-r from-green-500 to-emerald-500' : 'bg-gradient-to-r from-red-500 to-rose-500']">
      <div class="flex items-center">
        <div class="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-white bg-opacity-25">
          <CheckCircleIcon v-if="toastType === 'success'" class="w-5 h-5 text-white" />
          <XMarkIcon v-else class="w-5 h-5 text-white" />
        </div>
        <div class="ml-3 flex-1">
          <p class="text-sm font-medium text-white">{{ toastMessage }}</p>
        </div>
        <button @click="toastVisible = false"
          class="ml-4 flex-shrink-0 text-white hover:text-gray-100 focus:outline-none">
          <span class="sr-only">Close</span>
          <XMarkIcon class="w-5 h-5" />
        </button>
      </div>
    </div>

    <!-- Header with mobile menu toggle -->
    <header class="bg-white shadow-md lg:hidden sticky top-0 z-40 border-b border-green-100">
      <div class="flex items-center justify-between px-4 py-3">
        <button @click="goBack"
          class="text-emerald-600 flex items-center gap-1 font-medium hover:text-emerald-700 transition-colors">
          <ArrowLeftIcon class="w-5 h-5" />
          <span>Back</span>
        </button>
        <h1 class="text-lg font-bold text-emerald-800">New Listing</h1>
        <button @click="toggleMobileMenu"
          class="text-emerald-600 p-2 rounded-md hover:bg-emerald-50 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500">
          <Bars3Icon v-if="!mobileMenuOpen" class="w-5 h-5" />
          <XMarkIcon v-else class="w-5 h-5" />
        </button>
      </div>

      <!-- Mobile Progress Bar -->
      <div class="px-4 py-3 bg-emerald-50">
        <div class="flex justify-between items-center mb-1.5">
          <span class="text-xs font-medium text-emerald-700">Step {{ currentStep }} of {{ totalSteps }}: {{
            stepsItems[currentStep - 1].title }}</span>
          <span class="text-xs font-bold text-emerald-600">{{ Math.round(progressPercentage) }}%</span>
        </div>
        <div class="h-2.5 bg-gray-100 rounded-full overflow-hidden shadow-inner">
          <div
            class="h-full bg-gradient-to-r from-emerald-400 to-green-500 transition-all duration-500 ease-out rounded-full"
            :style="`width: ${progressPercentage}%`"></div>
        </div>
      </div>
    </header>

    <!-- Mobile Navigation Menu -->
    <div v-if="mobileMenuOpen"
      class="fixed inset-0 z-30 lg:hidden bg-black bg-opacity-50 backdrop-blur-sm transition-opacity duration-300"
      @click="mobileMenuOpen = false">
      <div
        class="absolute top-16 right-0 bottom-0 w-72 bg-white shadow-2xl transition-transform duration-300 transform translate-x-0"
        @click.stop>
        <div class="p-5 border-b border-gray-100">
          <h3 class="font-bold text-emerald-700 mb-2 flex items-center">
            <Square3Stack3DIcon class="w-5 h-5 mr-2" />
            Livestock Listing
          </h3>
          <p class="text-sm text-gray-600">Complete your listing in 5 easy steps</p>
        </div>

        <!-- Step navigation -->
        <nav class="p-5">
          <ul class="space-y-3">
            <li v-for="(step, index) in stepsItems" :key="index">
              <button @click="goToStep(index + 1)"
                :disabled="index + 1 > currentStep && !stepValidation[index + 1 as keyof typeof stepValidation]" :class="[
                  'w-full flex items-center py-3.5 px-4 rounded-xl transition-all duration-300',
                  currentStep === index + 1
                    ? 'bg-gradient-to-r from-emerald-500 to-green-500 text-white font-medium shadow-md'
                    : index + 1 < currentStep
                      ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                      : 'text-gray-500 hover:bg-gray-100'
                ]">
                <div class="flex items-center justify-center h-8 w-8 rounded-full mr-3" :class="[
                  currentStep === index + 1
                    ? 'bg-white bg-opacity-25 text-white'
                    : index + 1 < currentStep
                      ? 'bg-emerald-200 text-emerald-600'
                      : 'bg-gray-100 text-gray-400'
                ]">
                  <component :is="step.icon" class="w-5 h-5" />
                </div>

                <span>{{ step.title }}</span>

                <CheckCircleIcon v-if="index + 1 < currentStep" class="ml-auto w-5 h-5 text-emerald-500" />
                <span v-else-if="index + 1 === currentStep"
                  class="ml-auto w-2 h-2 rounded-full bg-white animate-pulse"></span>
              </button>
            </li>
          </ul>
        </nav>

        <!-- Mobile tips section -->
        <div class="p-5 mt-4">
          <div class="p-4 bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl border border-emerald-100 shadow-sm">
            <h4 class="font-medium text-emerald-700 flex items-center mb-2">
              <LightBulbIcon class="w-5 h-5 text-emerald-500 mr-2" />
              Tips for Success
            </h4>
            <p class="text-sm text-emerald-600">
              Add multiple high-quality photos to increase interest in your listing by up to 250%!
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Layout -->
    <div class="flex flex-col lg:flex-row">
      <!-- Sidebar -->
      <div
        class="hidden lg:block lg:w-80 fixed top-0 left-0 bottom-0 bg-white shadow-lg z-20 border-r border-emerald-100">
        <!-- Brand and Header with gradient background -->
        <div class="bg-gradient-to-br from-emerald-600 to-green-700 text-white px-6 py-8 bg-opacity-100">
          <div class="flex items-center gap-3 mb-5">
            <div class="bg-white bg-opacity-15 p-2.5 rounded-xl shadow-md">
              <Square3Stack3DIcon class="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 class="text-xl font-bold">Livestock Market</h1>
              <p class="text-emerald-100 text-xs">Premium Listing Portal</p>
            </div>
          </div>

          <button @click="goBack"
            class="flex items-center gap-2 bg-white bg-opacity-15 hover:bg-opacity-25 text-white px-4 py-2.5 rounded-lg 
            transition-all duration-300 w-full text-sm font-medium shadow-sm hover:shadow focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-30">
            <ArrowLeftIcon class="w-5 h-5" />
            <span>Back to Market</span>
          </button>
        </div>

        <!-- Progress indicator -->
        <div class="p-5 border-b border-gray-100">
          <div class="flex justify-between items-center mb-2">
            <span class="text-sm font-medium text-gray-700">Your Progress</span>
            <span class="text-sm font-bold text-emerald-600">{{ Math.round(progressPercentage) }}%</span>
          </div>
          <div class="h-3 bg-gray-100 rounded-full overflow-hidden shadow-inner">
            <div
              class="h-full bg-gradient-to-r from-emerald-400 to-green-500 transition-all duration-500 ease-out rounded-full"
              :style="`width: ${progressPercentage}%`"></div>
          </div>
          <div class="mt-2 text-xs font-medium text-gray-600 flex justify-between">
            <span>Step {{ currentStep }} of {{ totalSteps }}: {{ stepsItems[currentStep - 1].title }}</span>
            <span v-if="progressPercentage === 100" class="text-emerald-500 animate-pulse">Ready for review!</span>
          </div>
        </div>

        <!-- Step navigation -->
        <nav class="p-5 overflow-y-auto">
          <h3 class="text-xs font-bold uppercase text-gray-500 mb-3 tracking-wider px-2">Form Steps</h3>
          <ul class="space-y-2">
            <li v-for="(step, index) in stepsItems" :key="index">
              <button @click="goToStep(index + 1)"
                :disabled="index + 1 > currentStep && !stepValidation[index + 1 as keyof typeof stepValidation]" :class="[
                  'w-full flex items-center py-3 px-4 rounded-xl transition-all duration-300',
                  currentStep === index + 1
                    ? 'bg-gradient-to-r from-emerald-500 to-green-500 text-white font-medium shadow-md'
                    : index + 1 < currentStep
                      ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                      : index + 1 === currentStep + 1
                        ? 'text-gray-600 border border-dashed border-emerald-200 hover:border-emerald-300 hover:bg-emerald-50'
                        : 'text-gray-500 hover:bg-gray-100'
                ]">
                <div class="flex items-center justify-center h-9 w-9 rounded-full mr-3" :class="[
                  currentStep === index + 1
                    ? 'bg-white bg-opacity-20 text-white'
                    : index + 1 < currentStep
                      ? 'bg-emerald-100 text-emerald-600'
                      : 'bg-gray-100 text-gray-400'
                ]">
                  <component :is="step.icon" class="w-5 h-5" />
                </div>

                <span>{{ step.title }}</span>

                <CheckCircleIcon v-if="index + 1 < currentStep" class="ml-auto w-5 h-5 text-emerald-500" />
                <span v-else-if="index + 1 === currentStep"
                  class="ml-auto w-2 h-2 rounded-full bg-white animate-pulse"></span>
              </button>
            </li>
          </ul>
        </nav>
      </div>

      <!-- Main content -->
      <div class="lg:ml-80 w-full px-4 lg:px-8 py-4 lg:py-8">
        <div class="max-w-4xl mx-auto">
          <!-- Desktop-only header -->
          <div class="hidden lg:block mb-6">
            <h1 class="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <span
                class="flex items-center justify-center w-10 h-10 bg-emerald-100 text-emerald-600 rounded-lg shadow-sm">
                <ClipboardDocumentListIcon class="w-6 h-6" />
              </span>
              Create New Livestock Listing
            </h1>
            <p class="text-gray-500 ml-12">Complete all steps to create your premium livestock listing</p>
          </div>

          <!-- Form Card -->
          <div class="bg-white rounded-xl shadow-md overflow-hidden mb-8">
            <!-- Form Review Mode -->
            <LivestockFormReview v-if="formReviewed" :title="title" :description="description" :category="category"
              :breed="breed" :price="price" :negotiable="negotiable" :quantity="quantity" :age="computedAgeValue"
              :age-unit="ageUnit" :gender="gender" :weight="weight ?? undefined" :weight-unit="weightUnit"
              :health-status="healthStatus" :feeding-type="feedingType" :detailed-location="detailedLocation"
              :delivery-options="deliveryOptions" :delivery-restrictions="deliveryRestrictions"
              :max-delivery-distance="maxDeliveryDistance ?? undefined" :delivery-distance-unit="deliveryDistanceUnit"
              :certified="certified" :auction="auction" :available-immediate="availableImmediate"
              :image-preview-urls="imagePreviewUrls" :video-preview="videoPreview" :category-options="categoryOptions"
              :available-breeds="availableBreeds" @editForm="editForm" @submitForm="submitForm" />

            <!-- Main Form Steps -->
            <LivestockFormSteps v-else :current-step="currentStep" :title="title" :description="description"
              :category="category" :breed="breed" :price="price" :negotiable="negotiable" :quantity="quantity"
              :age="age ?? undefined" :age-unit="ageUnit" :gender="gender" :weight="weight ?? undefined"
              :weight-unit="weightUnit" :health-status="healthStatus" :feeding-type="feedingType"
              :detailed-location="detailedLocation" :delivery-options="deliveryOptions"
              :delivery-restrictions="deliveryRestrictions" :max-delivery-distance="maxDeliveryDistance ?? undefined"
              :delivery-distance-unit="deliveryDistanceUnit" :certified="certified" :auction="auction"
              :available-immediate="availableImmediate" :image-preview-urls="imagePreviewUrls"
              :video-preview="videoPreview ?? undefined" :current-step-valid="currentStepValid"
              :available-breeds="availableBreeds" @update:title="title = $event"
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

          <!-- Footer -->
          <div class="mt-8 text-center text-sm text-gray-500 border-t border-gray-100 pt-6">
            <p class="flex items-center justify-center gap-3 flex-wrap">
              <span>Livestock Market © 2025</span>
              <span class="w-1.5 h-1.5 rounded-full bg-gray-300 hidden sm:block"></span>
              <a href="#" class="text-emerald-600 hover:text-emerald-700 hover:underline transition-colors">Terms of
                Service</a>
              <span class="w-1.5 h-1.5 rounded-full bg-gray-300 hidden sm:block"></span>
              <a href="#" class="text-emerald-600 hover:text-emerald-700 hover:underline transition-colors">Privacy
                Policy</a>
              <span class="w-1.5 h-1.5 rounded-full bg-gray-300 hidden sm:block"></span>
              <a href="#" class="text-emerald-600 hover:text-emerald-700 hover:underline transition-colors">Help
                Center</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>