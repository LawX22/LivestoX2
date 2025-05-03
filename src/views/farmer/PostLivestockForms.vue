<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import LivestockFormSteps from '../../components/Farmer/LivestockFormSteps.vue';
import LivestockFormReview from '../../components/Farmer/LivestockFormReview.vue';

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

const stepsItems = ref<{ title: string; icon: string }[]>([
  { title: 'Basic Info', icon: 'i-heroicons-identification' },
  { title: 'Pricing', icon: 'i-heroicons-currency-dollar' },
  { title: 'Details', icon: 'i-heroicons-clipboard-document-list' },
  { title: 'Location', icon: 'i-heroicons-map-pin' },
  { title: 'Media', icon: 'i-heroicons-photo' }
]);

const categoryOptions = ref<Option[]>([
  { label: 'Cattle', value: 'cattle', icon: '🐄' },
  { label: 'Sheep', value: 'sheep', icon: '🐑' },
  { label: 'Goats', value: 'goats', icon: '🐐' },
  { label: 'Pigs', value: 'pigs', icon: '🐖' },
  { label: 'Horses', value: 'horses', icon: '🐎' }
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
</script>

<template>
  <div
    class="min-h-screen bg-gradient-to-br from-green-200 via-green-300 to-emerald-400 font-sans antialiased text-gray-800">
    <!-- Back button -->
    <div class="fixed top-4 left-4 z-50">
      <button @click="goBack"
        class="flex items-center gap-2 bg-white bg-opacity-90 hover:bg-opacity-100 text-green-600 px-4 py-2 rounded-full shadow-md transition-all duration-300 font-medium transform hover:scale-105">
        <span class="i-heroicons-arrow-left text-lg"></span>
        <span>Back to Market</span>
      </button>
    </div>

    <!-- Fixed sidebar and main content layout -->
    <div class="flex flex-col lg:flex-row">
      <!-- Sidebar - Fixed on large screens -->
      <div class="lg:w-80 lg:fixed lg:top-0 lg:left-0 lg:bottom-0 bg-white lg:shadow-lg z-20 border-r border-green-100">
        <!-- Brand -->
        <div class="px-6 py-8 bg-gradient-to-r from-green-500 to-green-600 text-white">
          <div class="flex items-center space-x-3">
            <span class="i-heroicons-square-3-stack-3d text-4xl text-white"></span>
            <div>
              <h1 class="text-2xl font-bold">Livestock Market</h1>
              <p class="text-green-100 text-sm">Premium Listing Portal</p>
            </div>
          </div>
        </div>

        <!-- Progress indicator -->
        <div class="p-6 border-b border-gray-100">
          <div class="flex justify-between items-center mb-3">
            <span class="text-sm font-medium text-gray-600">LISTING PROGRESS</span>
            <span class="text-sm font-bold text-green-500">{{ Math.round(progressPercentage) }}%</span>
          </div>
          <div class="h-3 bg-gray-100 rounded-full overflow-hidden shadow-inner">
            <div class="h-full bg-gradient-to-r from-green-400 to-green-500 transition-all duration-500 rounded-full"
              :style="`width: ${progressPercentage}%`"></div>
          </div>
          <div class="mt-2 text-xs font-medium text-gray-500 flex justify-between">
            <span>Step {{ currentStep }} of {{ totalSteps }}</span>
            <span v-if="progressPercentage === 100" class="text-green-500">Ready for review!</span>
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
                    ? 'bg-gradient-to-r from-green-400 to-green-500 text-white font-medium shadow-sm'
                    : index + 1 < currentStep
                      ? 'bg-green-50 text-green-700 hover:bg-green-100'
                      : 'text-gray-500 hover:bg-gray-100'
                ]">
                <span
                  :class="[step.icon, 'mr-3 text-xl', currentStep === index + 1 ? 'text-white' : 'text-green-500']"></span>
                <span>{{ step.title }}</span>

                <span v-if="index + 1 < currentStep" class="ml-auto i-heroicons-check-circle text-green-500"></span>
                <span v-else-if="index + 1 === currentStep" class="ml-auto w-2 h-2 rounded-full bg-white"></span>
              </button>
            </li>
          </ul>
        </nav>

        <!-- Tips section -->
        <div class="mx-4 mt-6 p-4 bg-green-50 rounded-xl border border-green-100">
          <h4 class="font-medium text-green-700 flex items-center mb-2">
            <span class="i-heroicons-light-bulb text-green-500 mr-2"></span>
            Listing Tips
          </h4>
          <p class="text-sm text-green-600">
            High-quality listings with clear photos and detailed descriptions get up to 3x more buyer interest.
          </p>
        </div>
      </div>

      <!-- Main content - Adjusts based on sidebar -->
      <div class="lg:ml-80 w-full lg:px-10 py-8">
        <div class="max-w-4xl mx-auto">
          <!-- Main Form Card -->
          <div class="bg-white rounded-3xl shadow-xl overflow-hidden border border-white border-opacity-30">
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
        </div>
      </div>
    </div>
  </div>
</template>
