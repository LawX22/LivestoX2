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
const formatPrice = (value: number | null) => value === null ? "₱0.00" : new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
const getHealthStatusColor = (status: string) => ({
  excellent: 'text-green-600', good: 'text-green-600', fair: 'text-yellow-600'
}[status] || 'text-gray-600');
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-green-50 to-green-900 font-sans antialiased text-gray-900">
    <div class="container mx-auto py-8 px-4 lg:px-8">
      <div class="max-w-6xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden">
        <!-- Header -->
        <div class="relative bg-green-800 py-10 px-8">
          <div class="absolute top-0 left-0 w-full h-full opacity-10">
            <div
              class="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1516467508483-a7212febe31a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')] bg-cover bg-center">
            </div>
          </div>

          <div class="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between">
            <div class="mb-6 md:mb-0">
              <h1 class="text-4xl font-bold tracking-tight text-white">
                Livestock <span class="text-green-300">Marketplace</span>
              </h1>
              <p class="mt-2 text-green-200 max-w-md">
                Create a premium listing to showcase your quality livestock to buyers around the country
              </p>
            </div>

            <div v-if="!formReviewed" class="bg-white/10 backdrop-blur-md rounded-xl p-4">
              <div class="flex items-center justify-between">
                <div class="flex flex-col">
                  <span class="text-xs font-medium text-green-200">STEP</span>
                  <span class="text-2xl font-bold text-white">{{ currentStep }} <span class="text-green-300">/ {{
                      totalSteps }}</span></span>
                </div>
                <div class="h-12 w-px bg-green-300/30 mx-4"></div>
                <div class="flex flex-col">
                  <span class="text-xs font-medium text-green-200">PROGRESS</span>
                  <div class="mt-1 w-32 bg-green-800/50 rounded-full h-2.5">
                    <div class="bg-green-300 h-2.5 rounded-full" :style="`width: ${progressPercentage}%`"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Main Content Area -->
        <div class="p-6 md:p-10">
          <!-- Form Steps Navigation -->
          <div v-if="!formReviewed" class="mb-10">
            <div class="grid grid-cols-5 gap-2">
              <button v-for="(step, index) in stepsItems" :key="index" @click="goToStep(index + 1)" :class="[
                'flex flex-col items-center justify-center py-4 rounded-xl transition-all',
                currentStep === index + 1
                  ? 'bg-green-100 text-green-900'
                  : index + 1 < currentStep
                    ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    : 'bg-gray-50 text-gray-400'
              ]">
                <div :class="[
                  'w-10 h-10 flex items-center justify-center rounded-full mb-1',
                  currentStep === index + 1
                    ? 'bg-green-600 text-white'
                    : index + 1 < currentStep
                      ? 'bg-emerald-600 text-white'
                      : 'bg-gray-200 text-gray-500'
                ]">
                  <span v-if="index + 1 < currentStep" class="i-heroicons-check text-lg"></span>
                  <span v-else class="text-sm font-bold">{{ index + 1 }}</span>
                </div>
                <div class="text-xs font-medium">{{ step.title }}</div>
              </button>
            </div>
          </div>

          <!-- Form Content -->
          <div v-if="!formReviewed">
            <!-- Step 1: Basic Information -->
            <div v-if="currentStep === 1" class="space-y-8">
              <div class="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-1">
                <div class="bg-white rounded-xl p-6 md:p-8">
                  <div class="flex items-center mb-6">
                    <span class="i-heroicons-identification text-2xl text-green-600 mr-3"></span>
                    <h2 class="text-2xl font-bold text-gray-900">Basic Information</h2>
                  </div>

                  <!-- Listing Title -->
                  <div class="mb-6">
                    <label class="block text-gray-700 font-medium mb-2">Listing Title <span
                        class="text-red-500">*</span></label>
                    <input v-model="title" type="text" placeholder="e.g. Premium Black Angus Calves - Farm Raised"
                      maxlength="120"
                      class="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-green-500 focus:ring focus:ring-green-200 focus:ring-opacity-50 transition-all"
                      required />
                    <div class="flex justify-between mt-1.5">
                      <p class="text-sm text-gray-500">Make it descriptive and attention-grabbing</p>
                      <span class="text-xs text-gray-400">{{ title.length }}/120</span>
                    </div>
                  </div>

                  <!-- Category Selection with Icons -->
                  <div class="mb-6">
                    <label class="block text-gray-700 font-medium mb-2">
                      Livestock Category <span class="text-red-500">*</span>
                    </label>
                    <div class="grid grid-cols-2 md:grid-cols-5 gap-3">
                      <button v-for="cat in categoryOptions" :key="cat.value" type="button"
                        @click="category = cat.value" :class="[
                          'p-4 rounded-xl transition-all duration-200 flex flex-col items-center justify-center',
                          category === cat.value
                            ? 'bg-green-600 text-white shadow-md transform scale-105'
                            : `${cat.color} text-gray-700 ${cat.hoverColor} hover:shadow`
                        ]">
                        <span class="text-3xl mb-2">{{ cat.icon }}</span>
                        <span class="font-medium">{{ cat.label }}</span>
                      </button>
                    </div>
                  </div>

                  <!-- Breed Selection with Cards -->
                  <div v-if="category && availableBreeds.length">
                    <label class="block text-gray-700 font-medium mb-2">
                      Breed <span class="text-red-500">*</span>
                    </label>
                    <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <button v-for="b in availableBreeds" :key="b.value" @click="breed = b.value" :class="[
                        'px-4 py-3 rounded-xl border-2 transition-all duration-200',
                        breed === b.value
                          ? 'border-green-500 bg-green-50 text-green-700 font-medium shadow'
                          : 'border-gray-200 hover:border-green-200 hover:bg-green-50/50'
                      ]">
                        {{ b.label }}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Step 2: Pricing & Quantity -->
            <div v-if="currentStep === 2" class="space-y-8">
              <div class="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-1">
                <div class="bg-white rounded-xl p-6 md:p-8">
                  <div class="flex items-center mb-6">
                    <span class="i-heroicons-currency-dollar text-2xl text-green-600 mr-3"></span>
                    <h2 class="text-2xl font-bold text-gray-900">Pricing Information</h2>
                  </div>

                  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <!-- Price -->
                    <div>
                      <label class="block text-gray-700 font-medium mb-2">
                        Price <span class="text-red-500">*</span>
                      </label>
                      <div class="relative">
                        <div class="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                          <span class="text-gray-500">$</span>
                        </div>
                        <input v-model.number="price" type="number" min="0" step="0.01" placeholder="0.00"
                          class="w-full pl-8 pr-4 py-3 rounded-xl border border-gray-300 focus:border-green-500 focus:ring focus:ring-green-200 focus:ring-opacity-50" />
                      </div>
                      <div class="mt-3 flex items-center">
                        <input type="checkbox" v-model="negotiable" id="negotiable"
                          class="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500" />
                        <label for="negotiable" class="ml-2 text-gray-700">Price is negotiable</label>
                      </div>
                    </div>

                    <!-- Quantity -->
                    <div>
                      <label class="block text-gray-700 font-medium mb-2">
                        Quantity <span class="text-red-500">*</span>
                      </label>
                      <div class="flex">
                        <button @click="quantity > 1 ? quantity-- : null" type="button"
                          class="px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-l-xl border border-gray-300">
                          <span class="i-heroicons-minus text-lg"></span>
                        </button>
                        <input v-model.number="quantity" type="number" min="1"
                          class="w-full px-4 py-3 text-center border-t border-b border-gray-300 focus:border-green-500 focus:ring focus:ring-green-200 focus:ring-opacity-50" />
                        <button @click="quantity++" type="button"
                          class="px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-r-xl border border-gray-300">
                          <span class="i-heroicons-plus text-lg"></span>
                        </button>
                      </div>
                    </div>
                  </div>

                  <hr class="my-6 border-gray-200" />

                  <div>
                    <h3 class="text-lg font-semibold text-gray-900 mb-4">Additional Options</h3>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div class="relative">
                        <input type="checkbox" v-model="certified" id="certified" class="sr-only peer" />
                        <label for="certified"
                          class="flex p-4 bg-white border-2 border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 peer-checked:border-green-500 peer-checked:bg-green-50">
                          <div
                            class="flex items-center justify-center w-8 h-8 mr-3 rounded-full bg-green-100 text-green-600">
                            <span class="i-heroicons-check-badge"></span>
                          </div>
                          <div>
                            <h4 class="font-medium text-gray-900">Certified</h4>
                            <p class="text-xs text-gray-500">Stock with verified quality</p>
                          </div>
                        </label>
                      </div>

                      <div class="relative">
                        <input type="checkbox" v-model="auction" id="auction" class="sr-only peer" />
                        <label for="auction"
                          class="flex p-4 bg-white border-2 border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 peer-checked:border-green-500 peer-checked:bg-green-50">
                          <div
                            class="flex items-center justify-center w-8 h-8 mr-3 rounded-full bg-green-100 text-green-600">
                            <span class="i-heroicons-hand-raised"></span>
                          </div>
                          <div>
                            <h4 class="font-medium text-gray-900">Auction</h4>
                            <p class="text-xs text-gray-500">Enable bidding on this listing</p>
                          </div>
                        </label>
                      </div>

                      <div class="relative">
                        <input type="checkbox" v-model="availableImmediate" id="availableImmediate"
                          class="sr-only peer" />
                        <label for="availableImmediate"
                          class="flex p-4 bg-white border-2 border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 peer-checked:border-green-500 peer-checked:bg-green-50">
                          <div
                            class="flex items-center justify-center w-8 h-8 mr-3 rounded-full bg-green-100 text-green-600">
                            <span class="i-heroicons-clock"></span>
                          </div>
                          <div>
                            <h4 class="font-medium text-gray-900">Available Now</h4>
                            <p class="text-xs text-gray-500">Ready for immediate pickup</p>
                          </div>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Step 3: Physical & Health Details -->
            <div v-if="currentStep === 3" class="space-y-8">
              <div class="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-1">
                <div class="bg-white rounded-xl p-6 md:p-8">
                  <div class="flex items-center mb-6">
                    <span class="i-heroicons-clipboard-document-list text-2xl text-green-600 mr-3"></span>
                    <h2 class="text-2xl font-bold text-gray-900">Physical & Health Details</h2>
                  </div>

                  <!-- Physical Characteristics -->
                  <div class="mb-8">
                    <h3 class="text-lg font-semibold text-gray-900 mb-4">Physical Characteristics</h3>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <!-- Age -->
                      <div>
                        <label class="block text-gray-700 font-medium mb-2">Age</label>
                        <div class="flex">
                          <input v-model.number="age" type="number" min="0" placeholder="Age"
                            class="w-full px-4 py-3 rounded-l-xl border border-gray-300 focus:border-green-500 focus:ring focus:ring-green-200 focus:ring-opacity-50" />
                          <select v-model="ageUnit"
                            class="px-4 py-3 rounded-r-xl border border-gray-300 bg-gray-50 focus:border-green-500 focus:ring focus:ring-green-200 focus:ring-opacity-50">
                            <option v-for="option in ageUnitOptions" :key="option.value" :value="option.value">
                              {{ option.label }}
                            </option>
                          </select>
                        </div>
                      </div>

                      <!-- Gender -->
                      <div>
                        <label class="block text-gray-700 font-medium mb-2">Gender</label>
                        <select v-model="gender"
                          class="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-green-500 focus:ring focus:ring-green-200 focus:ring-opacity-50">
                          <option value="">Select Gender</option>
                          <option v-for="option in genderOptions" :key="option.value" :value="option.value">
                            {{ option.label }}
                          </option>
                        </select>
                      </div>

                      <!-- Weight -->
                      <div>
                        <label class="block text-gray-700 font-medium mb-2">Weight</label>
                        <div class="flex">
                          <input v-model.number="weight" type="number" min="0" placeholder="Weight"
                            class="w-full px-4 py-3 rounded-l-xl border border-gray-300 focus:border-green-500 focus:ring focus:ring-green-200 focus:ring-opacity-50" />
                          <select v-model="weightUnit"
                            class="px-4 py-3 rounded-r-xl border border-gray-300 bg-gray-50 focus:border-green-500 focus:ring focus:ring-green-200 focus:ring-opacity-50">
                            <option v-for="option in weightUnitOptions" :key="option.value" :value="option.value">
                              {{ option.label }}
                            </option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Health Information -->
                  <div>
                    <h3 class="text-lg font-semibold text-gray-900 mb-4">Health Information</h3>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <!-- Health Status -->
                      <div>
                        <label class="block text-gray-700 font-medium mb-2">Health Status</label>
                        <select v-model="healthStatus"
                          class="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-green-500 focus:ring focus:ring-green-200 focus:ring-opacity-50">
                          <option v-for="option in healthStatusOptions" :key="option.value" :value="option.value">
                            {{ option.label }}
                          </option>
                        </select>
                      </div>

                      <!-- Feeding Type -->
                      <div>
                        <label class="block text-gray-700 font-medium mb-2">Feeding Type</label>
                        <input v-model="feedingType" type="text" placeholder="e.g. Grain-fed, Grass-fed"
                          class="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-green-500 focus:ring focus:ring-green-200 focus:ring-opacity-50" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Step 4: Location & Delivery -->
            <div v-if="currentStep === 4" class="space-y-8">
              <div class="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-1">
                <div class="bg-white rounded-xl p-6 md:p-8">
                  <div class="flex items-center mb-6">
                    <span class="i-heroicons-map-pin text-2xl text-green-600 mr-3"></span>
                    <h2 class="text-2xl font-bold text-gray-900">Location & Description</h2>
                  </div>

                  <!-- Location -->
                  <div class="mb-6">
                    <label class="block text-gray-700 font-medium mb-2">
                      Location <span class="text-red-500">*</span>
                    </label>
                    <input v-model="detailedLocation" type="text" placeholder="e.g. Hereford, TX"
                      class="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-green-500 focus:ring focus:ring-green-200 focus:ring-opacity-50" />
                    <p class="text-sm text-gray-500 mt-1.5">
                      Add your farm or ranch location (city, state)
                    </p>
                  </div>

                  <!-- Delivery Options -->
                  <div class="mb-6">
                    <label class="block text-gray-700 font-medium mb-2">Delivery Options</label>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div v-for="option in deliveryOptionItems" :key="option.value" class="relative">
                        <input type="checkbox" :id="option.value" :value="option.value" v-model="deliveryOptions"
                          class="sr-only peer" />
                        <label :for="option.value"
                          class="flex p-4 bg-white border-2 border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 peer-checked:border-green-500 peer-checked:bg-green-50">
                          <div
                            class="flex items-center justify-center w-8 h-8 mr-3 rounded-full bg-green-100 text-green-600">
                            <span :class="option.icon"></span>
                          </div>
                          <div>
                            <h4 class="font-medium text-gray-900">{{ option.label }}</h4>
                          </div>
                        </label>
                      </div>
                    </div>
                  </div>

                  <!-- Max Delivery Distance (conditional) -->
                  <div v-if="deliveryOptions.includes('local-delivery')" class="mb-6">
                    <label class="block text-gray-700 font-medium mb-2">Maximum Delivery Distance</label>
                    <div class="flex">
                      <input v-model.number="maxDeliveryDistance" type="number" min="0" placeholder="Distance"
                        class="w-full px-4 py-3 rounded-l-xl border border-gray-300 focus:border-green-500 focus:ring focus:ring-green-200 focus:ring-opacity-50" />
                      <select v-model="deliveryDistanceUnit"
                        class="px-4 py-3 rounded-r-xl border border-gray-300 bg-gray-50 focus:border-green-500 focus:ring focus:ring-green-200 focus:ring-opacity-50">
                        <option v-for="option in deliveryDistanceUnitOptions" :key="option.value" :value="option.value">
                          {{ option.label }}
                        </option>
                      </select>
                    </div>
                  </div>

                  <!-- Delivery Restrictions -->
                  <div v-if="deliveryOptions.length > 0" class="mb-6">
                    <label class="block text-gray-700 font-medium mb-2">Delivery Notes/Restrictions</label>
                    <textarea v-model="deliveryRestrictions" rows="3" placeholder="Any special delivery requirements or restrictions"
                      class="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-green-500 focus:ring focus:ring-green-200 focus:ring-opacity-50"></textarea>
                  </div>
                  
                  <!-- Description -->
                  <div class="mb-6">
                    <label class="block text-gray-700 font-medium mb-2">
                      Full Description <span class="text-red-500">*</span>
                    </label>
                    <textarea v-model="description" rows="6" placeholder="Provide a detailed description of your livestock..."
                      class="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-green-500 focus:ring focus:ring-green-200 focus:ring-opacity-50"></textarea>
                    <p class="text-sm text-gray-500 mt-1.5">
                      Include details about lineage, care history, temperament, and any other relevant information
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Step 5: Media Upload -->
            <div v-if="currentStep === 5" class="space-y-8">
              <div class="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-1">
                <div class="bg-white rounded-xl p-6 md:p-8">
                  <div class="flex items-center mb-6">
                    <span class="i-heroicons-photo text-2xl text-green-600 mr-3"></span>
                    <h2 class="text-2xl font-bold text-gray-900">Media Upload</h2>
                  </div>

                  <!-- Image Upload -->
                  <div class="mb-8">
                    <label class="block text-gray-700 font-medium mb-2">Image Upload</label>
                    <div class="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center">
                      <div v-if="imagePreviewUrls.length < maxImageUploadCount" class="mb-4">
                        <span class="i-heroicons-photo text-4xl text-gray-400 mb-2"></span>
                        <h3 class="text-lg font-medium text-gray-700">
                          Drop images here or <span class="text-green-600">browse</span>
                        </h3>
                        <p class="text-sm text-gray-500 mt-1">
                          High-quality images increase interest in your listing.<br />
                          Upload up to {{ maxImageUploadCount }} images.
                        </p>
                        <input type="file" @change="handleFileUpload" accept="image/*" multiple
                          class="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                      </div>

                      <!-- Image Preview -->
                      <div v-if="imagePreviewUrls.length > 0" class="mt-4">
                        <div class="grid grid-cols-2 md:grid-cols-5 gap-4">
                          <div v-for="(url, index) in imagePreviewUrls" :key="index"
                            class="relative group aspect-square rounded-lg overflow-hidden">
                            <img :src="url" class="w-full h-full object-cover" />
                            <div
                              class="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <button @click="removeImage(index)"
                                class="p-2 bg-red-500 text-white rounded-full hover:bg-red-600">
                                <span class="i-heroicons-trash text-lg"></span>
                              </button>
                            </div>
                          </div>
                        </div>

                        <div class="mt-4 flex justify-between">
                          <span class="text-sm text-gray-500">{{ imagePreviewUrls.length }} / {{ maxImageUploadCount }}
                            images</span>
                          <button @click="clearImages" class="text-sm text-red-500 hover:text-red-700">
                            Clear all
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Video Upload -->
                  <div>
                    <label class="block text-gray-700 font-medium mb-2">Video Upload (Optional)</label>
                    <div class="border-2 border-dashed border-gray-300 rounded-xl p-6">
                      <div v-if="!videoPreview" class="text-center">
                        <span class="i-heroicons-video-camera text-4xl text-gray-400 mb-2"></span>
                        <h3 class="text-lg font-medium text-gray-700">
                          Drop video here or <span class="text-green-600">browse</span>
                        </h3>
                        <p class="text-sm text-gray-500 mt-1">
                          Add a video to showcase your livestock in action
                        </p>
                        <input type="file" @change="handleVideoUpload" accept="video/*"
                          class="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                      </div>

                      <!-- Video Preview -->
                      <div v-if="videoPreview" class="mt-4">
                        <video :src="videoPreview" controls class="w-full h-auto rounded-lg"></video>
                        <button @click="clearVideo" class="mt-2 text-sm text-red-500 hover:text-red-700">
                          Remove video
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Form Review -->
          <div v-if="formReviewed" class="space-y-8">
            <div class="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-1">
              <div class="bg-white rounded-xl p-6 md:p-8">
                <div class="flex items-center mb-6">
                  <span class="i-heroicons-check-circle text-2xl text-green-600 mr-3"></span>
                  <h2 class="text-2xl font-bold text-gray-900">Review Your Listing</h2>
                </div>

                <div class="bg-green-50 rounded-xl p-4 mb-6">
                  <div class="flex items-center text-green-800">
                    <span class="i-heroicons-information-circle text-xl mr-2"></span>
                    <p>Please review your listing details before submitting. All information is correct and ready to be published?</p>
                  </div>
                </div>

                <!-- Review Content -->
                <div class="space-y-6">
                  <!-- Basic Information -->
                  <div class="border border-gray-200 rounded-xl overflow-hidden">
                    <div class="bg-gray-50 px-4 py-3 border-b border-gray-200">
                      <h3 class="font-semibold text-gray-800">Basic Information</h3>
                    </div>
                    <div class="p-4">
                      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 class="text-sm font-medium text-gray-500">Title</h4>
                          <p class="text-gray-900">{{ title }}</p>
                        </div>
                        <div>
                          <h4 class="text-sm font-medium text-gray-500">Category</h4>
                          <div class="flex items-center">
                            <span class="text-xl mr-2">{{ getCategoryIcon }}</span>
                            <span>{{ getCategoryName }}</span>
                          </div>
                        </div>
                        <div>
                          <h4 class="text-sm font-medium text-gray-500">Breed</h4>
                          <p class="text-gray-900">{{ getBreedName }}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Pricing -->
                  <div class="border border-gray-200 rounded-xl overflow-hidden">
                    <div class="bg-gray-50 px-4 py-3 border-b border-gray-200">
                      <h3 class="font-semibold text-gray-800">Pricing</h3>
                    </div>
                    <div class="p-4">
                      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <h4 class="text-sm font-medium text-gray-500">Price</h4>
                          <p class="text-gray-900">{{ formatPrice(price) }}
                            <span v-if="negotiable" class="text-sm text-gray-500 ml-1">(Negotiable)</span>
                          </p>
                        </div>
                        <div>
                          <h4 class="text-sm font-medium text-gray-500">Quantity</h4>
                          <p class="text-gray-900">{{ quantity }}</p>
                        </div>
                        <div>
                          <h4 class="text-sm font-medium text-gray-500">Options</h4>
                          <div class="flex flex-wrap gap-2 mt-1">
                            <span v-if="certified" class="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-md">Certified</span>
                            <span v-if="auction" class="px-2 py-1 bg-amber-100 text-amber-800 text-xs rounded-md">Auction</span>
                            <span v-if="availableImmediate" class="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-md">Available Now</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Physical & Health Details -->
                  <div class="border border-gray-200 rounded-xl overflow-hidden">
                    <div class="bg-gray-50 px-4 py-3 border-b border-gray-200">
                      <h3 class="font-semibold text-gray-800">Physical & Health Details</h3>
                    </div>
                    <div class="p-4">
                      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 class="text-sm font-medium text-gray-500">Age</h4>
                          <p class="text-gray-900">{{ age !== null ? `${age} ${ageUnit}` : 'Not specified' }}</p>
                        </div>
                        <div>
                          <h4 class="text-sm font-medium text-gray-500">Gender</h4>
                          <p class="text-gray-900">{{ gender ? gender.charAt(0).toUpperCase() + gender.slice(1) : 'Not specified' }}</p>
                        </div>
                        <div>
                          <h4 class="text-sm font-medium text-gray-500">Weight</h4>
                          <p class="text-gray-900">{{ weight !== null ? `${weight} ${weightUnit}` : 'Not specified' }}</p>
                        </div>
                        <div>
                          <h4 class="text-sm font-medium text-gray-500">Health Status</h4>
                          <p :class="[healthStatus ? getHealthStatusColor(healthStatus) : 'text-gray-500']">
                            {{ healthStatus ? healthStatus.charAt(0).toUpperCase() + healthStatus.slice(1) : 'Not specified' }}
                          </p>
                        </div>
                        <div>
                          <h4 class="text-sm font-medium text-gray-500">Feeding Type</h4>
                          <p class="text-gray-900">{{ feedingType || 'Not specified' }}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Location & Delivery -->
                  <div class="border border-gray-200 rounded-xl overflow-hidden">
                    <div class="bg-gray-50 px-4 py-3 border-b border-gray-200">
                      <h3 class="font-semibold text-gray-800">Location & Delivery</h3>
                    </div>
                    <div class="p-4">
                      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 class="text-sm font-medium text-gray-500">Location</h4>
                          <p class="text-gray-900">{{ detailedLocation }}</p>
                        </div>
                        <div>
                          <h4 class="text-sm font-medium text-gray-500">Delivery Options</h4>
                          <div class="flex flex-wrap gap-2 mt-1">
                            <span v-for="option in deliveryOptions" :key="option"
                              class="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-md flex items-center">
                              <span :class="getDeliveryOptionIcon(option)" class="mr-1"></span>
                              {{ getDeliveryOptionLabel(option) }}
                            </span>
                          </div>
                          <div v-if="deliveryOptions.includes('local-delivery') && maxDeliveryDistance !== null"
                            class="mt-2 text-sm text-gray-700">
                            Maximum delivery distance: {{ maxDeliveryDistance }} {{ deliveryDistanceUnit }}
                          </div>
                        </div>
                      </div>

                      <div v-if="deliveryRestrictions" class="mt-4">
                        <h4 class="text-sm font-medium text-gray-500">Delivery Notes/Restrictions</h4>
                        <p class="text-gray-900">{{ deliveryRestrictions }}</p>
                      </div>
                    </div>
                  </div>

                  <!-- Description -->
                  <div class="border border-gray-200 rounded-xl overflow-hidden">
                    <div class="bg-gray-50 px-4 py-3 border-b border-gray-200">
                      <h3 class="font-semibold text-gray-800">Description</h3>
                    </div>
                    <div class="p-4">
                      <p class="text-gray-900 whitespace-pre-line">{{ description }}</p>
                    </div>
                  </div>

                  <!-- Media Preview -->
                  <div v-if="imagePreviewUrls.length > 0 || videoPreview" class="border border-gray-200 rounded-xl overflow-hidden">
                    <div class="bg-gray-50 px-4 py-3 border-b border-gray-200">
                      <h3 class="font-semibold text-gray-800">Media</h3>
                    </div>
                    <div class="p-4">
                      <div v-if="imagePreviewUrls.length > 0">
                        <h4 class="text-sm font-medium text-gray-500 mb-2">Images ({{ imagePreviewUrls.length }})</h4>
                        <div class="grid grid-cols-2 md:grid-cols-5 gap-4">
                          <div v-for="(url, index) in imagePreviewUrls" :key="index"
                            class="relative aspect-square rounded-lg overflow-hidden">
                            <img :src="url" class="w-full h-full object-cover" />
                          </div>
                        </div>
                      </div>

                      <div v-if="videoPreview" class="mt-4">
                        <h4 class="text-sm font-medium text-gray-500 mb-2">Video</h4>
                        <video :src="videoPreview" controls class="w-full h-auto rounded-lg"></video>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Navigation Buttons -->
          <div class="mt-8 flex justify-between">
            <button v-if="currentStep > 1 && !formReviewed" @click="prevStep"
              class="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-xl flex items-center">
              <span class="i-heroicons-arrow-left text-lg mr-2"></span>
              Back
            </button>
            <div v-else></div>

            <div class="flex space-x-4">
              <button v-if="formReviewed" @click="editForm"
                class="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-xl flex items-center">
                <span class="i-heroicons-pencil text-lg mr-2"></span>
                Edit Listing
              </button>

              <button v-if="currentStep < totalSteps && !formReviewed" :disabled="!currentStepValid"
                @click="nextStep" :class="[
                  'px-6 py-3 rounded-xl font-medium flex items-center',
                  currentStepValid 
                    ? 'bg-green-600 hover:bg-green-700 text-white'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                ]">
                Next
                <span class="i-heroicons-arrow-right text-lg ml-2"></span>
              </button>

              <button v-if="currentStep === totalSteps && !formReviewed" :disabled="!currentStepValid"
                @click="proceedToReview" :class="[
                  'px-6 py-3 rounded-xl font-medium flex items-center',
                  currentStepValid 
                    ? 'bg-green-600 hover:bg-green-700 text-white'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                ]">
                Review Listing
                <span class="i-heroicons-check text-lg ml-2"></span>
              </button>

              <button v-if="formReviewed" @click="submitForm"
                class="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-xl flex items-center">
                <span class="i-heroicons-paper-airplane text-lg mr-2"></span>
                Submit Listing
              </button>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="bg-gray-50 px-6 py-4 border-t border-gray-200 text-center text-sm text-gray-500">
          <p>
            Livestock Marketplace © {{ new Date().getFullYear() }} | 
            Need help? <a href="#" class="text-green-600 hover:text-green-700">Contact Support</a>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>