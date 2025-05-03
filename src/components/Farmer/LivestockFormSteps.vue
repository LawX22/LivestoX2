<script setup lang="ts">
import { ref } from 'vue';
import {
    CheckCircleIcon, ArrowLeftIcon, ArrowRightIcon, CheckIcon, ChevronDownIcon, ClipboardDocumentListIcon, BanknotesIcon,
    ClipboardDocumentCheckIcon, MapIcon, PhotoIcon, TagIcon, DocumentTextIcon, Squares2X2Icon, IdentificationIcon, StarIcon, CheckBadgeIcon,
    CurrencyDollarIcon, ClockIcon, CalculatorIcon, HashtagIcon, ChatBubbleLeftRightIcon, LightBulbIcon, ChartBarIcon, HandThumbUpIcon, CalendarIcon,
    UserCircleIcon, UserIcon, ScaleIcon, HeartIcon, FireIcon, MapPinIcon, TruckIcon, ArrowsRightLeftIcon, ExclamationTriangleIcon, CloudArrowUpIcon,
    PhotoIcon as PhotoIconStacked, TrashIcon, FilmIcon, VideoCameraIcon, SparklesIcon, InformationCircleIcon, GlobeAltIcon
} from '@heroicons/vue/24/outline';

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
    { label: 'Cattle', value: 'cattle', icon: '🐄', color: 'bg-emerald-100', hoverColor: 'hover:bg-emerald-200' },
    { label: 'Sheep', value: 'sheep', icon: '🐑', color: 'bg-lime-100', hoverColor: 'hover:bg-lime-200' },
    { label: 'Goats', value: 'goats', icon: '🐐', color: 'bg-teal-100', hoverColor: 'hover:bg-teal-200' },
    { label: 'Pigs', value: 'pigs', icon: '🐖', color: 'bg-green-100', hoverColor: 'hover:bg-green-200' },
    { label: 'Horses', value: 'horses', icon: '🐎', color: 'bg-cyan-100', hoverColor: 'hover:bg-cyan-200' }
]);

const ageUnitOptions = ref<Option[]>([{ label: 'Months', value: 'months' }, { label: 'Years', value: 'years' }]);
const weightUnitOptions = ref<Option[]>([{ label: 'lbs', value: 'lbs' }, { label: 'kg', value: 'kg' }]);
const genderOptions = ref<Option[]>([
    { label: 'Male', value: 'male' },
    { label: 'Female', value: 'female' }
]);
const healthStatusOptions = ref<Option[]>([
    { label: 'Select Health Status', value: '' },
    { label: 'Excellent', value: 'excellent' },
    { label: 'Good', value: 'good' },
    { label: 'Fair', value: 'fair' }
]);
const deliveryDistanceUnitOptions = ref<Option[]>([{ label: 'Miles', value: 'miles' }, { label: 'Kilometers', value: 'kilometers' }]);
const deliveryOptionItems = ref<Option[]>([
    { label: 'On-site Pickup', value: 'on-site-pickup' },
    { label: 'Local Delivery', value: 'local-delivery' },
    { label: 'Transportation Services', value: 'transportation-services' }
]);


// Steps configuration
const stepConfig = ref([
    { number: 1, title: 'Basic Info', icon: ClipboardDocumentListIcon },
    { number: 2, title: 'Price & Quantity', icon: BanknotesIcon },
    { number: 3, title: 'Details', icon: ClipboardDocumentCheckIcon },
    { number: 4, title: 'Location', icon: MapIcon },
    { number: 5, title: 'Media', icon: PhotoIcon }
]);

// Methods
const toggleDeliveryOption = (value: string) => {
    const options = [...props.deliveryOptions];
    if (options.includes(value)) {
        emit('update:deliveryOptions', options.filter(o => o !== value));
    } else {
        emit('update:deliveryOptions', [...options, value]);
    }
};

const imageInput = ref<HTMLInputElement | null>(null);
const videoInput = ref<HTMLInputElement | null>(null);
const maxImageUploadCount = 5;

// Trigger file dialogs
const triggerFileUpload = () => imageInput.value?.click();
const triggerVideoUpload = () => videoInput.value?.click();

// Upload Image
const handleFileUpload = (e: Event) => {
    const files = (e.target as HTMLInputElement).files;
    if (!files) return;
    emit('handleFileUpload', files);
};

// Remove Image
const handleRemoveImage = (index: number, e: Event) => {
    e.stopPropagation();
    emit('removeImage', index);
};

// Clear all images
const clearAllImages = (e: Event) => {
    e.stopPropagation();
    emit('clearImages');
};

// Upload Video
const handleVideoUpload = (e: Event) => {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (!file) return;
    emit('handleVideoUpload', file);
};

// Clear video
const clearVideoFile = (e: Event) => {
    e.stopPropagation();
    emit('clearVideo');
};

</script>

<template>
    <!-- Main container with improved color scheme -->
    <div class="bg-gradient-to-br from-green-50 via-emerald-50 to-teal-100 p-4 md:p-8 rounded-3xl shadow-lg">

        <!-- Steps progress bar -->
        <div class="max-w-5xl mx-auto mb-8">
            <div class="flex items-center justify-between px-2">
                <div v-for="step in stepConfig" :key="step.number" class="flex flex-col items-center w-1/5">
                    <div :class="[
                        'w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-all duration-300',
                        currentStep === step.number
                            ? 'bg-gradient-to-r from-emerald-600 to-green-500 text-white shadow-lg shadow-emerald-200'
                            : currentStep > step.number
                                ? 'bg-gradient-to-r from-teal-500 to-green-500 text-white'
                                : 'bg-white text-green-600 border border-emerald-300'
                    ]">
                        <component :is="step.icon" class="w-6 h-6" />
                    </div>
                    <span :class="[
                        'text-sm font-medium hidden md:block transition-colors duration-300',
                        currentStep === step.number ? 'text-emerald-800' : 'text-teal-600'
                    ]">
                        {{ step.title }}
                    </span>
                </div>
            </div>
            <div class="relative mt-4 hidden md:block">
                <div class="absolute top-0 h-1 bg-gradient-to-r from-green-200 to-teal-200 w-full rounded-full"></div>
                <div class="absolute top-0 h-1 bg-gradient-to-r from-emerald-600 to-green-500 rounded-full transition-all duration-500"
                    :style="{ width: `${(currentStep - 1) * 25}%` }"></div>
            </div>
        </div>

        <!-- Form Container -->
        <div class="bg-white rounded-2xl shadow-md p-5 md:p-8 max-w-5xl mx-auto backdrop-blur-sm bg-opacity-95">
            <!-- Step 1: Basic Info -->
            <div v-if="currentStep === 1" class="space-y-8">
                <div class="border-b border-emerald-100 pb-4 mb-6">
                    <div class="flex items-center">
                        <ClipboardDocumentListIcon class="w-8 h-8 text-emerald-600 mr-3" />
                        <h2 class="text-2xl font-bold text-emerald-800">Basic Information</h2>
                    </div>
                    <p class="text-teal-600 mt-1 ml-9">Tell us about your livestock</p>
                </div>

                <!-- Title Field -->
                <div class="space-y-3">
                    <label for="title" class="text-emerald-800 font-medium flex items-center">
                        <TagIcon class="w-5 h-5 text-teal-600 mr-2" />
                        Listing Title <span class="text-red-500 ml-1">*</span>
                    </label>
                    <div class="relative">
                        <span class="absolute inset-y-0 left-0 pl-4 flex items-center text-emerald-600">
                            <DocumentTextIcon class="w-5 h-5" />
                        </span>
                        <input :value="title" @input="$emit('update:title', ($event.target as HTMLInputElement).value)"
                            type="text" id="title" placeholder="e.g. Premium Angus Breeding Bulls"
                            class="pl-12 w-full rounded-xl border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500 py-3 bg-gradient-to-r from-emerald-50 to-green-50" />
                    </div>
                    <div class="text-xs text-emerald-600 flex items-center ml-2">
                        <SparklesIcon class="w-4 h-4 text-amber-500 mr-1" />
                        An attractive title helps your listing stand out
                    </div>
                </div>

                <!-- Category Selection -->
                <div class="space-y-3">
                    <label class="text-emerald-800 font-medium flex items-center">
                        <Squares2X2Icon class="w-5 h-5 text-teal-600 mr-2" />
                        Category <span class="text-red-500 ml-1">*</span>
                    </label>
                    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                        <button v-for="option in categoryOptions" :key="option.value" type="button"
                            @click="$emit('update:category', option.value)" :class="[
                                'flex flex-col items-center justify-center p-4 rounded-xl border transition-all shadow-sm',
                                category === option.value
                                    ? 'border-emerald-500 bg-gradient-to-br from-emerald-100 to-green-100 ring-2 ring-emerald-500 ring-opacity-50'
                                    : 'border-emerald-200 hover:border-emerald-300 ' + option.color + ' ' + option.hoverColor
                            ]">
                            <span class="text-4xl mb-2">{{ option.icon }}</span>
                            <span
                                :class="[category === option.value ? 'text-emerald-800' : 'text-emerald-700', 'font-medium']">
                                {{ option.label }}
                            </span>
                        </button>
                    </div>
                </div>

                <!-- Breed Selection -->
                <div v-if="category" class="space-y-3">
                    <label for="breed" class="text-emerald-800 font-medium flex items-center">
                        <IdentificationIcon class="w-5 h-5 text-teal-600 mr-2" />
                        Breed <span class="text-red-500 ml-1">*</span>
                    </label>
                    <div class="relative">
                        <span class="absolute inset-y-0 left-0 pl-4 flex items-center text-emerald-600">
                            <TagIcon class="w-5 h-5" />
                        </span>
                        <select :value="breed"
                            @change="$emit('update:breed', ($event.target as HTMLSelectElement).value)" id="breed"
                            class="pl-12 w-full rounded-xl border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500 py-3 bg-gradient-to-r from-emerald-50 to-green-50">
                            <option value="">Select Breed</option>
                            <option v-for="option in availableBreeds" :key="option.value" :value="option.value">
                                {{ option.label }}
                            </option>
                        </select>
                        <span class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                            <ChevronDownIcon class="w-5 h-5 text-emerald-500" />
                        </span>
                    </div>
                </div>

                <!-- Feature Checkboxes -->
                <div class="space-y-3">
                    <label class="text-emerald-800 font-medium flex items-center">
                        <StarIcon class="w-5 h-5 text-teal-600 mr-2" />
                        Features
                    </label>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <!-- Certified -->
                        <div
                            class="flex items-center space-x-3 p-4 rounded-xl bg-gradient-to-r from-emerald-50 via-green-50 to-lime-50 border border-emerald-200 shadow-sm hover:shadow-md transition-shadow">
                            <input :checked="certified"
                                @change="$emit('update:certified', ($event.target as HTMLInputElement).checked)"
                                id="certified" type="checkbox"
                                class="w-5 h-5 text-emerald-600 rounded border-emerald-300 focus:ring-emerald-500" />
                            <div>
                                <label for="certified" class="font-medium text-emerald-800 flex items-center">
                                    <CheckBadgeIcon class="w-5 h-5 text-teal-600 mr-2" />
                                    Certified
                                </label>
                                <p class="text-sm text-emerald-600">Verified health records</p>
                            </div>
                        </div>

                        <!-- Auction -->
                        <div
                            class="flex items-center space-x-3 p-4 rounded-xl bg-gradient-to-r from-teal-50 via-emerald-50 to-green-50 border border-emerald-200 shadow-sm hover:shadow-md transition-shadow">
                            <input :checked="auction"
                                @change="$emit('update:auction', ($event.target as HTMLInputElement).checked)"
                                id="auction" type="checkbox"
                                class="w-5 h-5 text-emerald-600 rounded border-emerald-300 focus:ring-emerald-500" />
                            <div>
                                <label for="auction" class="font-medium text-emerald-800 flex items-center">
                                    <CurrencyDollarIcon class="w-5 h-5 text-teal-600 mr-2" />
                                    Auction
                                </label>
                                <p class="text-sm text-emerald-600">Allow bidding</p>
                            </div>
                        </div>

                        <!-- Available Now -->
                        <div
                            class="flex items-center space-x-3 p-4 rounded-xl bg-gradient-to-r from-green-50 via-emerald-50 to-teal-50 border border-emerald-200 shadow-sm hover:shadow-md transition-shadow">
                            <input :checked="availableImmediate"
                                @change="$emit('update:availableImmediate', ($event.target as HTMLInputElement).checked)"
                                id="available" type="checkbox"
                                class="w-5 h-5 text-emerald-600 rounded border-emerald-300 focus:ring-emerald-500" />
                            <div>
                                <label for="available" class="font-medium text-emerald-800 flex items-center">
                                    <ClockIcon class="w-5 h-5 text-teal-600 mr-2" />
                                    Available Now
                                </label>
                                <p class="text-sm text-emerald-600">Ready for delivery</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Step 2: Price & Quantity -->
            <div v-else-if="currentStep === 2" class="space-y-8">
                <div class="border-b border-emerald-100 pb-4 mb-6">
                    <div class="flex items-center">
                        <BanknotesIcon class="w-8 h-8 text-emerald-600 mr-3" />
                        <h2 class="text-2xl font-bold text-emerald-800">Pricing & Quantity</h2>
                    </div>
                    <p class="text-teal-600 mt-1 ml-9">Set your price and available quantity</p>
                </div>

                <!-- Price field -->
                <div class="space-y-3">
                    <label for="price" class="text-emerald-800 font-medium flex items-center">
                        <CurrencyDollarIcon class="w-5 h-5 text-teal-600 mr-2" />
                        Price per Unit <span class="text-red-500 ml-1">*</span>
                    </label>
                    <div class="relative">
                        <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <span class="text-emerald-600 font-medium">₱</span>
                        </div>
                        <input :value="price"
                            @input="$emit('update:price', Number(($event.target as HTMLInputElement).value))"
                            type="number" min="0" step="0.01" id="price" placeholder="0.00"
                            class="pl-10 w-full rounded-xl border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500 py-3 bg-gradient-to-r from-emerald-50 to-green-50" />
                        <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                            <CurrencyDollarIcon class="w-5 h-5 text-emerald-500" />
                        </div>
                    </div>
                    <div class="text-sm text-emerald-600 flex items-center ml-2">
                        <InformationCircleIcon class="w-5 h-5 mr-1" />
                        Enter price in Philippine Peso (₱)
                    </div>
                </div>

                <!-- Negotiable toggle -->
                <div class="space-y-3">
                    <label class="block text-emerald-800 font-medium items-center">
                        <ChatBubbleLeftRightIcon class="w-5 h-5 text-teal-600 mr-2" />
                        Price Negotiability
                    </label>
                    <div
                        class="flex items-center space-x-3 p-4 rounded-xl bg-gradient-to-r from-teal-50 via-emerald-50 to-green-50 border border-emerald-200 shadow-sm hover:shadow-md transition-shadow">
                        <div class="flex items-center">
                            <input :checked="negotiable"
                                @change="$emit('update:negotiable', ($event.target as HTMLInputElement).checked)"
                                id="negotiable" type="checkbox"
                                class="w-5 h-5 text-emerald-600 rounded border-emerald-300 focus:ring-emerald-500" />
                        </div>
                        <div class="flex-1">
                            <label for="negotiable" class="font-medium text-emerald-800 flex items-center">
                                <ChatBubbleLeftRightIcon class="w-5 h-5 text-teal-600 mr-2" />
                                Price is negotiable
                            </label>
                            <p class="text-sm text-emerald-600">Allow buyers to make offers</p>
                        </div>
                        <div v-if="negotiable"
                            class="h-10 w-10 bg-gradient-to-r from-emerald-100 to-green-100 rounded-full flex items-center justify-center">
                            <CheckIcon class="w-5 h-5 text-emerald-600" />
                        </div>
                    </div>
                </div>

                <!-- Quantity field -->
                <div class="space-y-3">
                    <label for="quantity" class="text-emerald-800 font-medium flex items-center">
                        <CalculatorIcon class="w-5 h-5 text-teal-600 mr-2" />
                        Quantity Available <span class="text-red-500 ml-1">*</span>
                    </label>
                    <div class="relative">
                        <span class="absolute inset-y-0 left-0 pl-4 flex items-center text-emerald-600">
                            <CalculatorIcon class="w-5 h-5" />
                        </span>
                        <input :value="quantity"
                            @input="$emit('update:quantity', Number(($event.target as HTMLInputElement).value))"
                            type="number" min="1" id="quantity"
                            class="pl-12 w-full rounded-xl border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500 py-3 bg-gradient-to-r from-emerald-50 to-green-50" />
                        <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                            <HashtagIcon class="w-5 h-5 text-emerald-500" />
                        </div>
                    </div>
                </div>

                <!-- Price tips card -->
                <div
                    class="bg-gradient-to-br from-emerald-50 via-green-50 to-teal-100 p-5 rounded-xl border border-emerald-200 shadow-sm">
                    <h4 class="font-bold text-emerald-800 flex items-center text-lg mb-3">
                        <LightBulbIcon class="w-6 h-6 text-amber-500 mr-2" />
                        Pricing Tips
                    </h4>
                    <ul class="space-y-3">
                        <li class="flex items-start">
                            <CheckCircleIcon class="w-5 h-5 text-emerald-600 mr-3 mt-1 flex-shrink-0" />
                            <span class="text-emerald-700">Research current market prices for similar livestock in your
                                area</span>
                        </li>
                        <li class="flex items-start">
                            <ChartBarIcon class="w-5 h-5 text-teal-600 mr-3 mt-1 flex-shrink-0" />
                            <span class="text-emerald-700">Consider seasonal demand variations when setting your
                                price</span>
                        </li>
                        <li class="flex items-start">
                            <HandThumbUpIcon class="w-5 h-5 text-green-600 mr-3 mt-1 flex-shrink-0" />
                            <span class="text-emerald-700">Setting a fair price can lead to faster sales and better
                                buyer relationships</span>
                        </li>
                    </ul>
                </div>
            </div>

            <!-- Step 3: Details -->
            <div v-else-if="currentStep === 3" class="space-y-8">
                <div class="border-b border-emerald-100 pb-4 mb-6">
                    <div class="flex items-center">
                        <ClipboardDocumentCheckIcon class="w-8 h-8 text-emerald-600 mr-3" />
                        <h2 class="text-2xl font-bold text-emerald-800">Physical Details</h2>
                    </div>
                    <p class="text-teal-600 mt-1 ml-9">Provide complete information about your livestock</p>
                </div>

                <!-- Age and Gender -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <!-- Age -->
                    <div class="space-y-3">
                        <label for="age" class="text-emerald-800 font-medium flex items-center">
                            <CalendarIcon class="w-5 h-5 text-teal-600 mr-2" />
                            Age
                        </label>
                        <div class="flex space-x-3">
                            <div class="relative flex-1">
                                <span class="absolute inset-y-0 left-0 pl-4 flex items-center text-emerald-600">
                                    <CalendarIcon class="w-5 h-5" />
                                </span>
                                <input :value="age"
                                    @input="$emit('update:age', Number(($event.target as HTMLInputElement).value))"
                                    type="number" min="0" id="age" placeholder="Age"
                                    class="pl-12 w-full rounded-xl border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500 py-3 bg-gradient-to-r from-emerald-50 to-green-50" />
                            </div>
                            <div class="relative">
                                <select :value="ageUnit"
                                    @change="$emit('update:ageUnit', ($event.target as HTMLSelectElement).value)"
                                    class="w-36 pr-10 rounded-xl border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500 py-3 bg-gradient-to-r from-emerald-50 to-green-50">
                                    <option v-for="option in ageUnitOptions" :key="option.value" :value="option.value">
                                        {{ option.label }}
                                    </option>
                                </select>
                                <span class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                    <ChevronDownIcon class="w-5 h-5 text-emerald-500" />
                                </span>
                            </div>
                        </div>
                    </div>

                    <!-- Gender -->
                    <div class="space-y-3">
                        <label class="text-emerald-800 font-medium flex items-center">
                            <UserCircleIcon class="w-5 h-5 text-teal-600 mr-2" />
                            Gender
                        </label>
                        <div class="grid grid-cols-2 gap-3">
                            <button v-for="option in genderOptions" :key="option.value" type="button"
                                @click="$emit('update:gender', option.value)" :class="[
                                    'flex items-center justify-center p-4 rounded-xl border transition-all shadow-sm',
                                    gender === option.value
                                        ? 'border-emerald-600 bg-gradient-to-r from-emerald-100 to-green-100 ring-2 ring-emerald-500 ring-opacity-50 text-emerald-800'
                                        : 'border-emerald-200 hover:border-emerald-300 text-emerald-700 bg-gradient-to-r from-emerald-50 to-green-50'
                                ]">
                                <component :is="option.value === 'male' ? UserIcon : UserCircleIcon"
                                    class="w-5 h-5 mr-2" />
                                {{ option.label }}
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Weight -->
                <div class="space-y-3">
                    <label for="weight" class="text-emerald-800 font-medium flex items-center">
                        <ScaleIcon class="w-5 h-5 text-teal-600 mr-2" />
                        Weight
                    </label>
                    <div class="flex space-x-3">
                        <div class="relative flex-1">
                            <span class="absolute inset-y-0 left-0 pl-4 flex items-center text-emerald-600">
                                <ScaleIcon class="w-5 h-5" />
                            </span>
                            <input :value="weight"
                                @input="$emit('update:weight', Number(($event.target as HTMLInputElement).value))"
                                type="number" min="0" id="weight" placeholder="Weight"
                                class="pl-12 w-full rounded-xl border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500 py-3 bg-gradient-to-r from-emerald-50 to-green-50" />
                        </div>
                        <div class="relative">
                            <select :value="weightUnit"
                                @change="$emit('update:weightUnit', ($event.target as HTMLSelectElement).value)"
                                class="w-36 pr-10 rounded-xl border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500 py-3 bg-gradient-to-r from-emerald-50 to-green-50">
                                <option v-for="option in weightUnitOptions" :key="option.value" :value="option.value">
                                    {{ option.label }}
                                </option>
                            </select>
                            <span class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                <ChevronDownIcon class="w-5 h-5 text-emerald-500" />
                            </span>
                        </div>
                    </div>
                </div>

                <!-- Health Status & Feeding Type -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <!-- Health Status -->
                    <div class="space-y-3">
                        <label for="healthStatus" class="text-emerald-800 font-medium flex items-center">
                            <HeartIcon class="w-5 h-5 text-teal-600 mr-2" />
                            Health Status
                        </label>
                        <div class="relative">
                            <span class="absolute inset-y-0 left-0 pl-4 flex items-center text-emerald-600">
                                <HeartIcon class="w-5 h-5" />
                            </span>
                            <select :value="healthStatus"
                                @change="$emit('update:healthStatus', ($event.target as HTMLSelectElement).value)"
                                id="healthStatus"
                                class="pl-12 w-full rounded-xl border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500 py-3 bg-gradient-to-r from-emerald-50 to-green-50">
                                <option v-for="option in healthStatusOptions" :key="option.value" :value="option.value">
                                    {{ option.label }}
                                </option>
                            </select>
                            <span class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                <ChevronDownIcon class="w-5 h-5 text-emerald-500" />
                            </span>
                        </div>
                    </div>

                    <!-- Feeding Type -->
                    <div class="space-y-3">
                        <label for="feedingType" class="text-emerald-800 font-medium flex items-center">
                            <FireIcon class="w-5 h-5 text-teal-600 mr-2" />
                            Feeding Type
                        </label>
                        <div class="relative">
                            <span class="absolute inset-y-0 left-0 pl-4 flex items-center text-emerald-600">
                                <FireIcon class="w-5 h-5" />
                            </span>
                            <input :value="feedingType"
                                @input="$emit('update:feedingType', ($event.target as HTMLInputElement).value)"
                                type="text" id="feedingType" placeholder="e.g. Grass-fed, Grain-finished"
                                class="pl-12 w-full rounded-xl border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500 py-3 bg-gradient-to-r from-emerald-50 to-green-50" />
                        </div>
                    </div>
                </div>

                <!-- Description -->
                <div class="space-y-3">
                    <label for="description" class="text-emerald-800 font-medium flex items-center">
                        <DocumentTextIcon class="w-5 h-5 text-teal-600 mr-2" />
                        Description <span class="text-red-500 ml-1">*</span>
                    </label>
                    <textarea :value="description"
                        @input="$emit('update:description', ($event.target as HTMLTextAreaElement).value)"
                        id="description" rows="5" placeholder="Provide detailed information about your livestock..."
                        class="w-full rounded-xl border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500 py-3 bg-gradient-to-r from-emerald-50 to-green-50"></textarea>
                    <div class="text-xs text-emerald-600 flex items-center ml-2">
                        <SparklesIcon class="w-4 h-4 text-amber-500 mr-1" />
                        Include breed characteristics, lineage, and any special qualities
                    </div>
                </div>
            </div>

            <!-- Step 4: Location & Delivery -->
            <div v-else-if="currentStep === 4" class="space-y-8">
                <div class="border-b border-emerald-100 pb-4 mb-6">
                    <div class="flex items-center">
                        <MapIcon class="w-8 h-8 text-emerald-600 mr-3" />
                        <h2 class="text-2xl font-bold text-emerald-800">Location & Delivery</h2>
                    </div>
                    <p class="text-teal-600 mt-1 ml-9">Specify your location and delivery options</p>
                </div>

                <!-- Location -->
                <div class="space-y-3">
                    <label for="detailedLocation" class="text-emerald-800 font-medium flex items-center">
                        <MapPinIcon class="w-5 h-5 text-teal-600 mr-2" />
                        Location <span class="text-red-500 ml-1">*</span>
                    </label>
                    <div class="relative">
                        <span class="absolute inset-y-0 left-0 pl-4 flex items-center text-emerald-600">
                            <MapPinIcon class="w-5 h-5" />
                        </span>
                        <input :value="detailedLocation"
                            @input="$emit('update:detailedLocation', ($event.target as HTMLInputElement).value)"
                            type="text" id="detailedLocation" placeholder="e.g. Barangay, Municipality, Province"
                            class="pl-12 w-full rounded-xl border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500 py-3 bg-gradient-to-r from-emerald-50 to-green-50" />
                        <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                            <GlobeAltIcon class="w-5 h-5 text-emerald-500" />
                        </div>
                    </div>
                    <div class="text-xs text-emerald-600 flex items-center ml-2">
                        <InformationCircleIcon class="w-4 h-4 mr-1" />
                        Please provide specific location details for better visibility
                    </div>
                </div>

                <!-- Delivery Options -->
                <div class="space-y-3">
                    <label class="text-emerald-800 font-medium flex items-center">
                        <TruckIcon class="w-5 h-5 text-teal-600 mr-2" />
                        Delivery Options <span class="text-red-500 ml-1">*</span>
                    </label>
                    <div class="space-y-3">
                        <div v-for="option in deliveryOptionItems" :key="option.value" :class="[
                            'flex items-center space-x-3 p-4 rounded-xl border shadow-sm hover:shadow-md transition-shadow',
                            deliveryOptions.includes(option.value)
                                ? 'border-emerald-500 bg-gradient-to-r from-emerald-100 to-green-100'
                                : 'border-emerald-200 bg-gradient-to-r from-emerald-50 to-green-50'
                        ]" @click="toggleDeliveryOption(option.value)">
                            <input :checked="deliveryOptions.includes(option.value)" type="checkbox"
                                class="w-5 h-5 text-emerald-600 rounded border-emerald-300 focus:ring-emerald-500" />
                            <div class="flex-1">
                                <label class="font-medium flex items-center cursor-pointer">
                                    <component
                                        :is="option.value === 'on-site-pickup' ? MapPinIcon : (option.value === 'local-delivery' ? TruckIcon : ArrowsRightLeftIcon)"
                                        class="w-5 h-5 text-teal-600 mr-2" />
                                    {{ option.label }}
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Delivery Distance -->
                <div v-if="deliveryOptions.includes('local-delivery')" class="space-y-3">
                    <label for="maxDeliveryDistance" class="text-emerald-800 font-medium flex items-center">
                        <MapIcon class="w-5 h-5 text-teal-600 mr-2" />
                        Maximum Delivery Distance
                    </label>
                    <div class="flex space-x-3">
                        <div class="relative flex-1">
                            <span class="absolute inset-y-0 left-0 pl-4 flex items-center text-emerald-600">
                                <MapIcon class="w-5 h-5" />
                            </span>
                            <input :value="maxDeliveryDistance"
                                @input="$emit('update:maxDeliveryDistance', Number(($event.target as HTMLInputElement).value))"
                                type="number" min="0" id="maxDeliveryDistance" placeholder="Distance"
                                class="pl-12 w-full rounded-xl border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500 py-3 bg-gradient-to-r from-emerald-50 to-green-50" />
                        </div>
                        <div class="relative">
                            <select :value="deliveryDistanceUnit"
                                @change="$emit('update:deliveryDistanceUnit', ($event.target as HTMLSelectElement).value)"
                                class="w-36 pr-10 rounded-xl border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500 py-3 bg-gradient-to-r from-emerald-50 to-green-50">
                                <option v-for="option in deliveryDistanceUnitOptions" :key="option.value"
                                    :value="option.value">
                                    {{ option.label }}
                                </option>
                            </select>
                            <span class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                <ChevronDownIcon class="w-5 h-5 text-emerald-500" />
                            </span>
                        </div>
                    </div>
                </div>

                <!-- Delivery Restrictions -->
                <div class="space-y-3">
                    <label for="deliveryRestrictions" class="text-emerald-800 font-medium flex items-center">
                        <ExclamationTriangleIcon class="w-5 h-5 text-teal-600 mr-2" />
                        Delivery Restrictions/Notes
                    </label>
                    <div class="relative">
                        <span class="absolute top-3 left-4 text-emerald-600">
                            <ExclamationTriangleIcon class="w-5 h-5" />
                        </span>
                        <textarea :value="deliveryRestrictions"
                            @input="$emit('update:deliveryRestrictions', ($event.target as HTMLTextAreaElement).value)"
                            id="deliveryRestrictions" rows="3"
                            placeholder="Any limitations or special requirements for delivery..."
                            class="pl-12 w-full rounded-xl border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500 py-3 bg-gradient-to-r from-emerald-50 to-green-50"></textarea>
                    </div>
                </div>
            </div>

            <!-- Step 5: Media -->
            <div v-else-if="currentStep === 5" class="space-y-8">
                <div class="border-b border-emerald-100 pb-4 mb-6">
                    <div class="flex items-center">
                        <PhotoIcon class="w-8 h-8 text-emerald-600 mr-3" />
                        <h2 class="text-2xl font-bold text-emerald-800">Media</h2>
                    </div>
                    <p class="text-teal-600 mt-1 ml-9">Add photos and videos to showcase your livestock</p>
                </div>

                <!-- Image Upload -->
                <div class="space-y-3">
                    <label class="text-emerald-800 font-medium flex items-center">
                        <PhotoIconStacked class="w-5 h-5 text-teal-600 mr-2" />
                        Photos <span class="text-red-500 ml-1">*</span>
                    </label>

                    <input ref="imageInput" type="file" multiple accept="image/*" @change="handleFileUpload" hidden />

                    <div @click="triggerFileUpload"
                        class="border-2 border-dashed border-emerald-300 rounded-xl p-8 text-center cursor-pointer hover:bg-emerald-50 transition-colors">
                        <div class="space-y-4">
                            <div class="mx-auto w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center">
                                <CloudArrowUpIcon class="w-8 h-8 text-emerald-600" />
                            </div>
                            <p class="text-emerald-800">Click to upload photos (max {{ maxImageUploadCount }})</p>
                            <p class="text-emerald-600 text-sm">JPG, PNG or GIF (max. 5MB per image)</p>

                            <div v-if="imagePreviewUrls.length > 0" class="mt-6 flex flex-wrap gap-4 justify-center">
                                <div v-for="(url, index) in imagePreviewUrls" :key="index"
                                    class="relative group w-32 h-32 overflow-hidden rounded-lg shadow-md">
                                    <img :src="url" class="w-full h-full object-cover" alt="Preview" />
                                    <button @click="handleRemoveImage(index, $event)"
                                        class="absolute top-2 right-2 bg-white bg-opacity-70 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <TrashIcon class="w-5 h-5 text-red-600" />
                                    </button>
                                </div>
                            </div>

                            <div v-if="imagePreviewUrls.length > 0" class="pt-2">
                                <button @click="clearAllImages($event)" type="button"
                                    class="text-red-600 hover:text-red-700 text-sm font-medium flex items-center mx-auto">
                                    <TrashIcon class="w-4 h-4 mr-1" />
                                    Remove all images
                                </button>
                            </div>
                        </div>
                    </div>
                    <div class="text-xs text-emerald-600 flex items-center ml-2">
                        <InformationCircleIcon class="w-4 h-4 mr-1" />
                        High-quality images from different angles help attract buyers
                    </div>
                </div>

                <!-- Video Upload -->
                <div class="space-y-3">
                    <label class="text-emerald-800 font-medium flex items-center">
                        <FilmIcon class="w-5 h-5 text-teal-600 mr-2" />
                        Video (Optional)
                    </label>

                    <input ref="videoInput" type="file" accept="video/*" @change="handleVideoUpload" hidden />

                    <div @click="triggerVideoUpload"
                        class="border-2 border-dashed border-emerald-300 rounded-xl p-8 text-center cursor-pointer hover:bg-emerald-50 transition-colors">
                        <div class="space-y-4">
                            <div class="mx-auto w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center">
                                <VideoCameraIcon class="w-8 h-8 text-emerald-600" />
                            </div>
                            <p class="text-emerald-800">Click to upload a video</p>
                            <p class="text-emerald-600 text-sm">MP4, MOV or AVI (max. 100MB)</p>

                            <div v-if="videoPreview" class="mt-6">
                                <div class="relative mx-auto max-w-md">
                                    <video class="w-full rounded-lg shadow-md" controls>
                                        <source :src="videoPreview" type="video/mp4">
                                        Your browser does not support the video tag.
                                    </video>
                                    <button @click="clearVideoFile($event)"
                                        class="absolute top-2 right-2 bg-white bg-opacity-70 rounded-full p-1">
                                        <TrashIcon class="w-5 h-5 text-red-600" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="text-xs text-emerald-600 flex items-center ml-2">
                        <InformationCircleIcon class="w-4 h-4 mr-1" />
                        A video showing the livestock in motion can greatly increase buyer interest
                    </div>
                </div>
            </div>

            <!-- Navigation Buttons -->
            <div class="flex justify-between pt-8 border-t border-emerald-100 mt-8">
                <button v-if="currentStep > 1" @click="$emit('prevStep')" type="button"
                    class="flex items-center px-6 py-3 bg-white border border-emerald-300 rounded-xl font-medium text-emerald-700 hover:bg-emerald-50 transition-colors shadow-sm">
                    <ArrowLeftIcon class="w-5 h-5 mr-2" />
                    Previous
                </button>
                <div v-else></div>

                <div>
                    <button v-if="currentStep < 5" @click="$emit('nextStep')" type="button"
                        :disabled="!currentStepValid" :class="[
                            'flex items-center px-8 py-3 rounded-xl font-medium transition-all shadow-md',
                            currentStepValid
                                ? 'bg-gradient-to-r from-emerald-600 to-green-500 text-white hover:shadow-lg'
                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        ]">
                        Next
                        <ArrowRightIcon class="w-5 h-5 ml-2" />
                    </button>

                    <button v-else @click="$emit('proceedToReview')" type="button" :disabled="!currentStepValid" :class="[
                        'flex items-center px-8 py-3 rounded-xl font-medium transition-all shadow-md',
                        currentStepValid
                            ? 'bg-gradient-to-r from-emerald-600 to-green-500 text-white hover:shadow-lg'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    ]">
                        Preview & Submit
                        <CheckIcon class="w-5 h-5 ml-2" />
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>