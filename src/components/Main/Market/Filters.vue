<script lang="ts">
import { defineComponent, PropType, reactive, ref, watch, computed } from 'vue';
import Card from 'primevue/card';
import Dropdown from 'primevue/dropdown';
import Slider from 'primevue/slider';
import Checkbox from 'primevue/checkbox';
import AutoComplete from 'primevue/autocomplete';
import Button from 'primevue/button';
import Divider from 'primevue/divider';
import Badge from 'primevue/badge';
import Tooltip from 'primevue/tooltip';
import InputNumber from 'primevue/inputnumber';
import ProgressBar from 'primevue/progressbar';
import ToggleButton from 'primevue/togglebutton';
import Tag from 'primevue/tag';
import SelectButton from 'primevue/selectbutton';
import Dialog from 'primevue/dialog';
import InputText from 'primevue/inputtext';
import Panel from 'primevue/panel';
import RadioButton from 'primevue/radiobutton';
import Ripple from 'primevue/ripple';

interface FilterOptions {
    category: any;
    breed: any;
    ageRange: number[];
    ageUnit: string;
    priceRange: number[];
    location: string;
    locationRadius: number;
    certified: boolean;
    auction: boolean;
    gender: string | null;
    weight: number | null;
    weightUnit: string;
    availableImmediate: boolean;
    healthStatus: string | null;
    lastUpdated: Date | null;
}

export default defineComponent({
    name: 'LivestockFilters',
    components: {
        Card,
        Dropdown,
        Slider,
        Checkbox,
        AutoComplete,
        Button,
        Divider,
        Badge,
        InputNumber,
        ProgressBar,
        ToggleButton,
        Tag,
        SelectButton,
        Dialog,
        InputText,
        Panel,
        RadioButton
    },
    directives: {
        tooltip: Tooltip,
        ripple: Ripple
    },
    props: {
        filters: {
            type: Object as PropType<FilterOptions>,
            required: true
        },
        categories: {
            type: Array as PropType<{ id: number; name: string; icon?: string }[]>,
            required: true
        },
        breeds: {
            type: Array,
            required: true
        },
        loading: {
            type: Boolean,
            default: false
        },
        savedLocations: {
            type: Array as PropType<{ name: string }[]>,
            default: () => []
        }
    },
    emits: ['apply-filters', 'clear-filters', 'update:filters', 'category-change', 'save-location'],
    setup(props, { emit }) {
        // Create a local copy of filters to avoid direct mutation
        const filterValues = reactive<FilterOptions>({
            category: props.filters.category,
            breed: props.filters.breed,
            ageRange: [...props.filters.ageRange],
            ageUnit: props.filters.ageUnit || 'years',
            priceRange: [...props.filters.priceRange],
            location: props.filters.location,
            locationRadius: props.filters.locationRadius || 50,
            certified: props.filters.certified || false,
            auction: props.filters.auction || false,
            gender: props.filters.gender || null,
            weight: props.filters.weight || null,
            weightUnit: props.filters.weightUnit || 'kg',  // Changed default to kg
            availableImmediate: props.filters.availableImmediate || false,
            healthStatus: props.filters.healthStatus || null,
            lastUpdated: props.filters.lastUpdated || null
        });

        // Watch for changes in props with proper deep clone for arrays
        watch(() => props.filters, (newFilters) => {
            filterValues.category = newFilters.category;
            filterValues.breed = newFilters.breed;
            filterValues.ageRange = [...newFilters.ageRange];
            filterValues.ageUnit = newFilters.ageUnit || 'years';
            filterValues.priceRange = [...newFilters.priceRange];
            filterValues.location = newFilters.location;
            filterValues.locationRadius = newFilters.locationRadius || 50;
            filterValues.certified = newFilters.certified || false;
            filterValues.auction = newFilters.auction || false;
            filterValues.gender = newFilters.gender || null;
            filterValues.weight = newFilters.weight || null;
            filterValues.weightUnit = newFilters.weightUnit || 'kg';  // Changed default to kg
            filterValues.availableImmediate = newFilters.availableImmediate || false;
            filterValues.healthStatus = newFilters.healthStatus || null;
            filterValues.lastUpdated = newFilters.lastUpdated || null;
        }, { deep: true });

        const locationSuggestions = ref<string[]>([]);
        const showAllCategories = ref(false);
        const expandedSections = reactive({
            basic: true,
            financial: true,
            additional: true,
            advanced: false
        });

        // Track active tab
        const activeTab = ref('basic');
        const mobileExpanded = ref(false);

        const genderOptions = [
            { name: 'Male', value: 'male', icon: 'pi pi-mars' },
            { name: 'Female', value: 'female', icon: 'pi pi-venus' }
        ];

        const weightUnitOptions = [
            { name: 'kg', value: 'kg' },
            { name: 'lbs', value: 'lbs' }
        ];

        const ageUnitOptions = [
            { label: 'Days', value: 'days' },
            { label: 'Months', value: 'months' },
            { label: 'Years', value: 'years' }
        ];

        const healthStatusOptions = [
            { name: 'Excellent', value: 'excellent', severity: 'success', icon: 'pi pi-check-circle' },
            { name: 'Good', value: 'good', severity: 'info', icon: 'pi pi-thumbs-up' },
            { name: 'Fair', value: 'fair', severity: 'warning', icon: 'pi pi-exclamation-circle' }
        ];

        const radiusOptions = [
            { value: 100, label: '100 Km' },
            { value: 150, label: '150 Km' },
            { value: 200, label: '200 Km' },
            { value: 250, label: '250 Km' },
            { value: 300, label: '300 Km' }
        ];

        const lastUpdatedOptions = [
            { name: 'Today', value: new Date() },
            { name: 'Last 7 days', value: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
            { name: 'Last 30 days', value: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
        ];

        // Animal icons for categories using emojis
        const categoryAnimalIcons = {
            cattle: '🐄', // Cow emoji for cattle
            horses: '🐎', // Horse emoji
            sheep: '🐑', // Sheep emoji
            goats: '🐐', // Goat emoji
            pigs: '🐖', // Pig emoji
            poultry: '🐔', // Chicken emoji for poultry
            rabbits: '🐇', // Rabbit emoji
            fish: '🐟', // Fish emoji
            bees: '🐝', // Bee emoji
            deer: '🦌', // Deer emoji
            default: '🐾' // Animal paw print as a generic animal icon
        };

        const getCategoryAnimalIcon = (category: any) => {
            if (!category) return categoryAnimalIcons.default;
            const name = category.name?.toLowerCase() || '';

            for (const [key, icon] of Object.entries(categoryAnimalIcons)) {
                if (name.includes(key)) {
                    return icon;
                }
            }

            return categoryAnimalIcons.default;
        };

        const ageRangeMax = computed(() => {
            switch (filterValues.ageUnit) {
                case 'days': return 365;
                case 'months': return 48;
                case 'years': return 20;
                default: return 20;
            }
        });

        const ageRangeStep = computed(() => {
            switch (filterValues.ageUnit) {
                case 'days': return 5;
                case 'months': return 1;
                case 'years': return 1;
                default: return 1;
            }
        });

        // Improved reactivity handling for age unit changes
        watch(() => filterValues.ageUnit, (newUnit) => {
            // Convert age range when unit changes with better defaults
            if (newUnit === 'days') {
                filterValues.ageRange = [0, 60]; // Default for days
            } else if (newUnit === 'months') {
                filterValues.ageRange = [0, 24]; // Default for months
            } else {
                filterValues.ageRange = [0, 10]; // Default for years
            }
        });

        const searchLocation = (event: any) => {
            setTimeout(() => {
                // In a real app, this would be an API call
                const query = event.query.toLowerCase();
                const locations = [
                    'Manila, PH', 'Quezon City, PH', 'Cebu City, PH', 'Davao City, PH',
                    'Makati City, PH', 'Cagayan de Oro, PH', 'Iloilo City, PH', 'Baguio City, PH',
                    'Bacolod City, PH', 'Tacloban City, PH', 'Zamboanga City, PH', 'Angeles City, PH',
                    'General Santos, PH', 'Caloocan City, PH', 'Marikina City, PH', 'Pasig City, PH'
                ];

                // Include saved locations
                const allLocations = [...locations, ...props.savedLocations.map((loc: any) => loc.name)];

                locationSuggestions.value = allLocations.filter(location =>
                    location.toLowerCase().includes(query)
                );
            }, 250); // Debounce
        };

        const applyFilters = () => {
            emit('update:filters', { ...filterValues });
            emit('apply-filters');
            // Auto close mobile view after applying
            if (window.innerWidth < 768) {
                mobileExpanded.value = false;
            }
        };

        const clearFilters = () => {
            filterValues.category = null;
            filterValues.breed = null;
            filterValues.ageRange = [0, 20];
            filterValues.ageUnit = 'years';
            filterValues.priceRange = [0, 50000];
            filterValues.location = '';
            filterValues.locationRadius = 50;
            filterValues.certified = false;
            filterValues.auction = false;
            filterValues.gender = null;
            filterValues.weight = null;
            filterValues.weightUnit = 'kg';  // Changed default to kg
            filterValues.availableImmediate = false;
            filterValues.healthStatus = null;
            filterValues.lastUpdated = null;

            emit('update:filters', { ...filterValues });
            emit('clear-filters');
        };

        const saveLocation = () => {
            if (filterValues.location) {
                emit('save-location', filterValues.location);
            }
        };

        const selectCategory = (category: any) => {
            if (filterValues.category?.id === category.id) {
                filterValues.category = null;
                filterValues.breed = null;
            } else {
                filterValues.category = category;
                filterValues.breed = null;
                emit('category-change', category);
            }
        };

        const selectCategoryAndClose = (category: any) => {
            selectCategory(category);
            showAllCategories.value = false;
        };

        const getActiveFiltersCount = computed(() => {
            let count = 0;
            if (filterValues.category) count++;
            if (filterValues.breed) count++;
            if (filterValues.ageRange[0] > 0 || filterValues.ageRange[1] < ageRangeMax.value) count++;
            if (filterValues.priceRange[0] > 0 || filterValues.priceRange[1] < 50000) count++;
            if (filterValues.location) count++;
            if (filterValues.locationRadius !== 50) count++;
            if (filterValues.certified) count++;
            if (filterValues.auction) count++;
            if (filterValues.gender) count++;
            if (filterValues.weight) count++;
            if (filterValues.availableImmediate) count++;
            if (filterValues.healthStatus) count++;
            if (filterValues.lastUpdated) count++;
            return count;
        });

        // Format price to Philippine Peso
        const formatPrice = (value: number) => {
            return new Intl.NumberFormat('en-PH', {
                style: 'currency',
                currency: 'PHP',
                maximumFractionDigits: 0
            }).format(value);
        };

        // Toggle mobile expansion
        const toggleMobileExpanded = () => {
            mobileExpanded.value = !mobileExpanded.value;
        };

        const getGenderIcon = (gender: string | null) => {
            if (gender === 'male') return 'pi pi-mars';
            if (gender === 'female') return 'pi pi-venus';
            return 'pi pi-question-circle';
        };

        const getGenderName = (gender: string | null) => {
            if (gender === 'male') return 'Male';
            if (gender === 'female') return 'Female';
            return 'Unknown';
        };

        return {
            filterValues,
            locationSuggestions,
            searchLocation,
            applyFilters,
            clearFilters,
            saveLocation,
            getActiveFiltersCount,
            genderOptions,
            weightUnitOptions,
            ageUnitOptions,
            healthStatusOptions,
            showAllCategories,
            expandedSections,
            ageRangeMax,
            ageRangeStep,
            selectCategory,
            selectCategoryAndClose,
            activeTab,
            radiusOptions,
            lastUpdatedOptions,
            formatPrice,
            mobileExpanded,
            toggleMobileExpanded,
            getGenderIcon,
            getGenderName,
            getCategoryAnimalIcon,
        };
    }
});
</script>

<template>
    <div class="livestock-filters bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
        <!-- Header -->
        <div class="bg-gradient-to-r from-emerald-600 to-green-500 px-4 py-3 md:px-5 md:py-4">
            <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                    <i class="pi pi-filter text-white text-lg md:text-xl"></i>
                    <h2 class="text-lg md:text-xl font-bold text-white">Livestock Filters</h2>
                    <Tag v-if="getActiveFiltersCount > 0" :value="getActiveFiltersCount"
                        class="bg-white text-emerald-600 font-bold" rounded />
                </div>

                <!-- Mobile toggle -->
                <div class="md:hidden">
                    <Button icon="pi pi-chevron-down" v-if="!mobileExpanded" @click="toggleMobileExpanded"
                        class="p-button-rounded p-button-sm p-button-text text-white" />
                    <Button icon="pi pi-chevron-up" v-else @click="toggleMobileExpanded"
                        class="p-button-rounded p-button-sm p-button-text text-white" />
                </div>

                <!-- Desktop actions -->
                <div class="hidden md:flex items-center gap-2">
                    <Button icon="pi pi-refresh" class="p-button-rounded p-button-sm p-button-text text-white"
                        v-tooltip="'Clear All Filters'" @click="clearFilters" />
                </div>
            </div>
        </div>

        <!-- Loading Indicator -->
        <ProgressBar v-if="loading" mode="indeterminate" class="h-1" style="--progress-bg: rgb(16 185 129);" />

        <!-- Desktop Filter Content -->
        <div class="hidden md:block">
            <!-- Navigation Tabs - IMPROVED ICON-ONLY WITH TOOLTIPS -->
            <div class="flex border-b border-gray-200">
                <button v-for="(tab, index) in [
                    { id: 'basic', icon: 'pi-tag', tooltip: 'Basic Filters' },
                    { id: 'price', icon: 'pi-dollar', tooltip: 'Price Filters' },
                    { id: 'location', icon: 'pi-map-marker', tooltip: 'Location Filters' },
                    { id: 'advanced', icon: 'pi-sliders-h', tooltip: 'Advanced Filters' }
                ]" :key="index"
                    class="flex-1 px-4 py-3 text-sm font-medium transition-all duration-200 outline-none focus:outline-none relative"
                    :class="activeTab === tab.id ?
                        'text-emerald-600 border-b-2 border-emerald-600' :
                        'text-gray-500 hover:text-emerald-600 hover:bg-gray-50'" @click="activeTab = tab.id"
                    v-tooltip="tab.tooltip">
                    <div class="flex flex-col items-center justify-center">
                        <div class="relative">
                            <i :class="['pi text-xl', tab.icon]"></i>
                            <Tag v-if="tab.id === 'basic' && (filterValues.category || filterValues.breed || filterValues.gender)"
                                severity="success"
                                class="h-5 w-5 flex items-center justify-center p-0 absolute -top-2 -right-3" rounded />
                            <Tag v-if="tab.id === 'price' && (filterValues.priceRange[0] > 0 || filterValues.priceRange[1] < 50000)"
                                severity="success"
                                class="h-5 w-5 flex items-center justify-center p-0 absolute -top-2 -right-3" rounded />
                            <Tag v-if="tab.id === 'location' && (filterValues.location || filterValues.locationRadius !== 50)"
                                severity="success"
                                class="h-5 w-5 flex items-center justify-center p-0 absolute -top-2 -right-3" rounded />
                            <Tag v-if="tab.id === 'advanced' && (filterValues.certified || filterValues.auction ||
                                filterValues.availableImmediate || filterValues.healthStatus || filterValues.weight ||
                                filterValues.lastUpdated ||
                                (filterValues.ageRange[0] > 0 || filterValues.ageRange[1] < ageRangeMax))"
                                severity="success"
                                class="h-5 w-5 flex items-center justify-center p-0 absolute -top-2 -right-3" rounded />
                        </div>
                    </div>
                </button>
            </div>
            <!-- Tab Content -->
            <div class="p-5">
                <!-- BASIC TAB -->
                <div v-if="activeTab === 'basic'" class="space-y-6">
                    <!-- REDESIGNED Category Selection with Animal Icons -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-3">Category</label>
                        <div class="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-3 gap-3">
                            <div v-for="cat in categories.slice(0, 11)" :key="cat.id"
                                class="relative group overflow-hidden rounded-xl cursor-pointer transition-all duration-300 transform hover:scale-105"
                                @click="selectCategory(cat)" v-tooltip="cat.name">
                                <!-- Background color & gradient -->
                                <div class="absolute inset-0 bg-gradient-to-br"
                                    :class="filterValues.category?.id === cat.id ?
                                        'from-emerald-500 to-green-600' :
                                        'from-gray-100 to-gray-200 group-hover:from-emerald-50 group-hover:to-green-100'">
                                </div>

                                <!-- Selected indicator -->
                                <div v-if="filterValues.category?.id === cat.id"
                                    class="absolute top-2 right-2 h-5 w-5 bg-white rounded-full flex items-center justify-center">
                                    <i class="pi pi-check text-emerald-600 text-xs"></i>
                                </div>

                                <!-- Content with Animal Icons -->
                                <div class="relative aspect-square flex flex-col items-center justify-center p-3 z-10">
                                    <div class="h-12 w-12 rounded-full flex items-center justify-center mb-2" :class="filterValues.category?.id === cat.id ?
                                        'bg-white/30' : 'bg-white/60'">
                                        <span class="text-2xl">{{ getCategoryAnimalIcon(cat) }}</span>
                                    </div>
                                    <span class="text-center font-medium truncate w-full" :class="filterValues.category?.id === cat.id ?
                                        'text-white' : 'text-gray-800'">
                                        {{ cat.name }}
                                    </span>
                                </div>
                            </div>

                            <!-- "More" button -->
                            <div class="relative group overflow-hidden rounded-xl cursor-pointer transition-all duration-300 transform hover:scale-105"
                                @click="showAllCategories = true" v-tooltip="'Browse All Categories'">
                                <!-- Background -->
                                <div
                                    class="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 group-hover:from-emerald-50 group-hover:to-green-100">
                                </div>

                                <!-- Content -->
                                <div class="relative aspect-square flex flex-col items-center justify-center p-3 z-10">
                                    <div
                                        class="h-12 w-12 rounded-full bg-white/60 flex items-center justify-center mb-2">
                                        <i
                                            class="pi pi-th-large text-xl text-gray-500 group-hover:text-emerald-600"></i>
                                    </div>
                                    <span class="text-center font-medium text-gray-800">All Categories</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Breed Selection -->
                    <div v-if="filterValues.category">
                        <label class="block text-sm font-medium text-gray-700 mb-2">Breed</label>
                        <Dropdown v-model="filterValues.breed" :options="breeds" optionLabel="name"
                            placeholder="Select Breed" class="w-full" />
                    </div>

                    <!-- Gender Selection -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-3">Gender</label>
                        <div class="flex gap-4">
                            <div v-for="option in genderOptions" :key="option.value"
                                class="flex-1 flex flex-col items-center justify-center p-3 rounded-lg cursor-pointer border transition-all duration-300"
                                :class="filterValues.gender === option.value ?
                                    'bg-emerald-50 border-emerald-500 text-emerald-700 shadow-md' :
                                    'border-gray-200 text-gray-600 hover:border-emerald-400 hover:-translate-y-1'"
                                @click="filterValues.gender = filterValues.gender === option.value ? null : option.value">
                                <i :class="['text-2xl mb-2', option.icon,
                                    filterValues.gender === option.value ? 'text-emerald-600' : 'text-gray-500']"></i>
                                <span class="font-medium">{{ option.name }}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- PRICE TAB -->
                <div v-if="activeTab === 'price'" class="space-y-6">
                    <div>
                        <div class="flex justify-between mb-2">
                            <label class="text-sm font-medium text-gray-700">Price Range</label>
                            <span class="text-sm font-medium text-emerald-600">
                                {{ formatPrice(filterValues.priceRange[0]) }} - {{
                                    formatPrice(filterValues.priceRange[1]) }}
                            </span>
                        </div>
                        <Slider v-model="filterValues.priceRange" range :min="0" :max="2500000" :step="5000"
                            class="custom-slider mb-3" />
                        <div class="flex justify-between text-xs text-gray-500">
                            <span>₱0</span>
                            <span>₱1,250,000</span>
                            <span>₱2,500,000+</span>
                        </div>
                    </div>

                    <!-- Quick price selection -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-3">Quick Selection</label>
                        <div class="grid grid-cols-3 gap-3">
                            <div v-for="(range, index) in [
                                { label: 'Budget', values: [0, 250000] },
                                { label: 'Mid-Range', values: [250000, 1000000] },
                                { label: 'Premium', values: [1000000, 2500000] }
                            ]" :key="index" class="p-3 rounded-lg border border-gray-200 cursor-pointer transition-all duration-300 hover:border-emerald-400 hover:-translate-y-1"
                                @click="filterValues.priceRange = range.values">
                                <h4 class="font-medium text-gray-700 mb-1">{{ range.label }}</h4>
                                <p class="text-sm text-emerald-600">{{ formatPrice(range.values[0]) }} - {{
                                    formatPrice(range.values[1]) }}</p>
                            </div>
                        </div>
                    </div>

                    <!-- Additional financial filters -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-3">Additional Options</label>
                        <div class="flex flex-wrap gap-3">
                            <div class="flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer border transition-all duration-300"
                                :class="filterValues.auction ?
                                    'bg-emerald-50 border-emerald-500 text-emerald-700' :
                                    'border-gray-200 text-gray-600 hover:border-emerald-400'"
                                @click="filterValues.auction = !filterValues.auction">
                                <i class="pi pi-ticket" :class="{ 'text-emerald-600': filterValues.auction }"></i>
                                <span>Auction Only</span>
                            </div>
                            <div class="flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer border transition-all duration-300"
                                :class="filterValues.certified ?
                                    'bg-emerald-50 border-emerald-500 text-emerald-700' :
                                    'border-gray-200 text-gray-600 hover:border-emerald-400'"
                                @click="filterValues.certified = !filterValues.certified">
                                <i class="pi pi-check-circle"
                                    :class="{ 'text-emerald-600': filterValues.certified }"></i>
                                <span>Certified</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- LOCATION TAB -->
                <div v-if="activeTab === 'location'" class="space-y-6">
                    <!-- Location Search -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Location</label>
                        <div class="flex gap-2">
                            <AutoComplete v-model="filterValues.location" :suggestions="locationSuggestions"
                                @complete="searchLocation" placeholder="Enter city, province or barangay" class="flex-1" />
                            <Button icon="pi pi-heart" class="p-button-rounded p-button-outlined p-button-success"
                                v-tooltip="'Save Location'" @click="saveLocation" :disabled="!filterValues.location" />
                        </div>
                    </div>

                    <!-- Distance Selection -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-3">Distance</label>
                        <div class="grid grid-cols-5 gap-2">
                            <div v-for="option in radiusOptions" :key="option.value"
                                class="flex flex-col items-center justify-center p-2 rounded-lg cursor-pointer border transition-all duration-300"
                                :class="filterValues.locationRadius === option.value ?
                                    'bg-emerald-50 border-emerald-500 text-emerald-700' :
                                    'border-gray-200 text-gray-600 hover:border-emerald-400'"
                                @click="filterValues.locationRadius = option.value">
                                <div class="flex items-center justify-center h-8 w-8 rounded-full mb-1"
                                    :class="filterValues.locationRadius === option.value ? 'bg-emerald-100' : 'bg-gray-100'">
                                    <span class="text-xs font-bold"
                                        :class="filterValues.locationRadius === option.value ? 'text-emerald-600' : 'text-gray-500'">
                                        {{ option.value }}
                                    </span>
                                </div>
                                <span class="text-xs text-center">{{ option.label }}</span>
                            </div>
                        </div>
                    </div>

                    <!-- Saved locations -->
                    <div v-if="savedLocations && savedLocations.length > 0">
                        <label class="block text-sm font-medium text-gray-700 mb-2">Saved Locations</label>
                        <div class="flex flex-wrap gap-2">
                            <div v-for="(location, index) in savedLocations" :key="index"
                                class="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg cursor-pointer border border-gray-200 transition-all duration-300 hover:border-emerald-400"
                                @click="filterValues.location = location.name">
                                <i class="pi pi-heart-fill text-rose-500 text-sm"></i>
                                <span class="text-sm">{{ location.name }}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- ADVANCED TAB -->
                <div v-if="activeTab === 'advanced'" class="space-y-6">
                    <!-- Age Range -->
                    <div>
                        <div class="flex justify-between mb-2">
                            <label class="text-sm font-medium text-gray-700">Age Range</label>
                            <div class="flex items-center gap-2">
                                <span class="text-sm font-medium text-emerald-600">
                                    {{ filterValues.ageRange[0] }} - {{ filterValues.ageRange[1] }}
                                </span>
                                <Dropdown v-model="filterValues.ageUnit" :options="ageUnitOptions" 
                                    optionLabel="label" optionValue="value" class="p-dropdown-sm" />
                            </div>
                        </div>
                        <Slider v-model="filterValues.ageRange" range :min="0" :max="ageRangeMax" :step="ageRangeStep"
                            class="custom-slider mb-3" />
                        <div class="flex justify-between text-xs text-gray-500">
                            <span>0 {{ filterValues.ageUnit }}</span>
                            <span>{{ Math.round(ageRangeMax / 2) }} {{ filterValues.ageUnit }}</span>
                            <span>{{ ageRangeMax }}+ {{ filterValues.ageUnit }}</span>
                        </div>
                    </div>

                    <!-- Weight -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-3">Weight</label>
                        <div class="flex gap-3 mb-4">
                            <InputNumber v-model="filterValues.weight" placeholder="Enter weight" 
                                class="flex-1" :min="0" showButtons />
                            <Dropdown v-model="filterValues.weightUnit" :options="weightUnitOptions" 
                                optionLabel="name" optionValue="value" class="w-24" />
                        </div>
                    </div>

                    <!-- Health Status -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-3">Health Status</label>
                        <div class="flex gap-3">
                            <div v-for="option in healthStatusOptions" :key="option.value"
                                class="flex-1 flex items-center justify-center gap-2 p-3 rounded-lg cursor-pointer border transition-all duration-300"
                                :class="filterValues.healthStatus === option.value ?
                                    `bg-${option.severity}-50 border-${option.severity}-500 text-${option.severity}-700` :
                                    'border-gray-200 text-gray-600 hover:border-gray-300'"
                                @click="filterValues.healthStatus = filterValues.healthStatus === option.value ? null : option.value">
                                <i :class="['', option.icon,
                                    filterValues.healthStatus === option.value ? `text-${option.severity}-600` : 'text-gray-500']"></i>
                                <span class="font-medium">{{ option.name }}</span>
                            </div>
                        </div>
                    </div>

                    <!-- Last Updated -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-3">Last Updated</label>
                        <div class="flex gap-3">
                            <div v-for="option in lastUpdatedOptions" :key="option.name"
                                class="flex-1 flex items-center justify-center gap-2 p-3 rounded-lg cursor-pointer border transition-all duration-300"
                                :class="filterValues.lastUpdated === option.value ?
                                    'bg-emerald-50 border-emerald-500 text-emerald-700' :
                                    'border-gray-200 text-gray-600 hover:border-emerald-400'"
                                @click="filterValues.lastUpdated = filterValues.lastUpdated === option.value ? null : option.value">
                                <span class="font-medium">{{ option.name }}</span>
                            </div>
                        </div>
                    </div>

                    <!-- Additional checkboxes -->
                    <div>
                        <div class="flex items-center gap-2 mb-3">
                            <Checkbox v-model="filterValues.availableImmediate" binary :inputId="'availableImmediately'" />
                            <label :for="'availableImmediately'" class="text-sm text-gray-700 cursor-pointer">
                                Available for Immediate Delivery
                            </label>
                        </div>
                    </div>
                </div>

                <!-- Apply Button -->
                <div class="mt-6 flex justify-end">
                    <Button label="Apply Filters" icon="pi pi-check" 
                        class="p-button-success" @click="applyFilters" />
                </div>
            </div>
        </div>

        <!-- Mobile Filter Content -->
        <div class="md:hidden" :class="{ 'hidden': !mobileExpanded }">
            <div class="p-4 space-y-5">
                <!-- Categories -->
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-3">Category</label>
                    <div class="grid grid-cols-3 gap-2">
                        <div v-for="cat in categories.slice(0, 5)" :key="cat.id"
                            class="relative group overflow-hidden rounded-xl cursor-pointer transition-all duration-300"
                            @click="selectCategory(cat)">
                            <!-- Background -->
                            <div class="absolute inset-0 bg-gradient-to-br"
                                :class="filterValues.category?.id === cat.id ?
                                    'from-emerald-500 to-green-600' :
                                    'from-gray-100 to-gray-200 group-hover:from-emerald-50 group-hover:to-green-100'">
                            </div>

                            <!-- Content with Animal Icons -->
                            <div class="relative aspect-square flex flex-col items-center justify-center p-2 z-10">
                                <div class="h-8 w-8 rounded-full flex items-center justify-center mb-1"
                                    :class="filterValues.category?.id === cat.id ? 'bg-white/30' : 'bg-white/60'">
                                    <span class="text-xl">{{ getCategoryAnimalIcon(cat) }}</span>
                                </div>
                                <span class="text-center font-medium truncate w-full text-xs"
                                    :class="filterValues.category?.id === cat.id ? 'text-white' : 'text-gray-800'">
                                    {{ cat.name }}
                                </span>
                            </div>
                        </div>
                        
                        <!-- "More" button -->
                        <div class="relative group overflow-hidden rounded-xl cursor-pointer transition-all duration-300"
                            @click="showAllCategories = true">
                            <!-- Background -->
                            <div class="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200">
                            </div>

                            <!-- Content -->
                            <div class="relative aspect-square flex flex-col items-center justify-center p-2 z-10">
                                <div class="h-8 w-8 rounded-full bg-white/60 flex items-center justify-center mb-1">
                                    <i class="pi pi-ellipsis-h text-gray-500"></i>
                                </div>
                                <span class="text-center font-medium text-gray-800 text-xs">More</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Breed Selection (only if category is selected) -->
                <div v-if="filterValues.category">
                    <label class="block text-sm font-medium text-gray-700 mb-2">Breed</label>
                    <Dropdown v-model="filterValues.breed" :options="breeds" optionLabel="name"
                        placeholder="Select Breed" class="w-full" />
                </div>

                <!-- Price Range -->
                <div>
                    <div class="flex justify-between mb-2">
                        <label class="text-sm font-medium text-gray-700">Price Range</label>
                        <span class="text-sm font-medium text-emerald-600">
                            {{ formatPrice(filterValues.priceRange[0]) }} - {{ formatPrice(filterValues.priceRange[1]) }}
                        </span>
                    </div>
                    <Slider v-model="filterValues.priceRange" range :min="0" :max="2500000" :step="5000"
                        class="custom-slider mb-2" />
                </div>

                <!-- Location Search -->
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Location</label>
                    <AutoComplete v-model="filterValues.location" :suggestions="locationSuggestions"
                        @complete="searchLocation" placeholder="Enter city, province or barangay" class="w-full" />
                </div>

                <!-- Gender Selection as pills -->
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                    <div class="flex gap-2">
                        <div v-for="option in genderOptions" :key="option.value"
                            class="flex-1 flex items-center justify-center gap-1 py-2 rounded-lg cursor-pointer border transition-all duration-300"
                            :class="filterValues.gender === option.value ?
                                'bg-emerald-50 border-emerald-500 text-emerald-700' :
                                'border-gray-200 text-gray-600'"
                            @click="filterValues.gender = filterValues.gender === option.value ? null : option.value">
                            <i :class="['', option.icon]"></i>
                            <span>{{ option.name }}</span>
                        </div>
                    </div>
                </div>

                <!-- Additional Options (checkboxes) -->
                <div class="space-y-2">
                    <div class="flex items-center gap-2">
                        <Checkbox v-model="filterValues.certified" binary :inputId="'certified'" />
                        <label :for="'certified'" class="text-sm text-gray-700 cursor-pointer">Certified</label>
                    </div>
                    <div class="flex items-center gap-2">
                        <Checkbox v-model="filterValues.auction" binary :inputId="'auction'" />
                        <label :for="'auction'" class="text-sm text-gray-700 cursor-pointer">Auction Only</label>
                    </div>
                    <div class="flex items-center gap-2">
                        <Checkbox v-model="filterValues.availableImmediate" binary :inputId="'availableImmediately'" />
                        <label :for="'availableImmediately'" class="text-sm text-gray-700 cursor-pointer">
                            Available for Immediate Delivery
                        </label>
                    </div>
                </div>

                <!-- Show More button to reveal advanced filters -->
                <Button label="Show Advanced Filters" icon="pi pi-sliders-h"
                    class="p-button-text p-button-plain w-full" @click="expandedSections.advanced = !expandedSections.advanced" />

                <!-- Advanced filters (collapsible) -->
                <div v-if="expandedSections.advanced" class="space-y-4">
                    <!-- Age Range -->
                    <div>
                        <div class="flex justify-between mb-2">
                            <label class="text-sm font-medium text-gray-700">Age Range</label>
                            <div class="flex items-center gap-1">
                                <span class="text-sm font-medium text-emerald-600">
                                    {{ filterValues.ageRange[0] }} - {{ filterValues.ageRange[1] }}
                                </span>
                                <Dropdown v-model="filterValues.ageUnit" :options="ageUnitOptions" 
                                    optionLabel="label" optionValue="value" class="p-dropdown-sm" />
                            </div>
                        </div>
                        <Slider v-model="filterValues.ageRange" range :min="0" :max="ageRangeMax" :step="ageRangeStep"
                            class="custom-slider mb-2" />
                    </div>

                    <!-- Weight -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Weight</label>
                        <div class="flex gap-2">
                            <InputNumber v-model="filterValues.weight" placeholder="Enter weight" 
                                class="flex-1" :min="0" />
                            <Dropdown v-model="filterValues.weightUnit" :options="weightUnitOptions" 
                                optionLabel="name" optionValue="value" class="w-24" />
                        </div>
                    </div>

                    <!-- Health Status -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Health Status</label>
                        <Dropdown v-model="filterValues.healthStatus" :options="healthStatusOptions" 
                            optionLabel="name" optionValue="value" placeholder="Select Health Status" class="w-full" />
                    </div>
                </div>

                <!-- Action Buttons -->
                <div class="pt-3 grid grid-cols-2 gap-3">
                    <Button label="Clear All" icon="pi pi-trash" 
                        class="p-button-outlined p-button-secondary" @click="clearFilters" />
                    <Button label="Apply Filters" icon="pi pi-check" 
                        class="p-button-success" @click="applyFilters" />
                </div>
            </div>
        </div>

        <!-- All Categories Dialog -->
        <Dialog v-model:visible="showAllCategories" header="Browse All Categories" 
            :modal="true" class="p-fluid" :style="{ width: '90vw', maxWidth: '600px' }">
            <div class="grid grid-cols-2 md:grid-cols-3 gap-3 mt-3">
                <div v-for="cat in categories" :key="cat.id"
                    class="p-3 rounded-lg cursor-pointer border transition-all duration-300"
                    :class="filterValues.category?.id === cat.id ?
                        'bg-emerald-50 border-emerald-500 text-emerald-700' :
                        'border-gray-200 text-gray-600 hover:border-emerald-400'"
                    @click="selectCategoryAndClose(cat)">
                    <div class="flex items-center gap-2">
                        <span class="text-xl">{{ getCategoryAnimalIcon(cat) }}</span>
                        <span class="font-medium">{{ cat.name }}</span>
                    </div>
                </div>
            </div>
        </Dialog>
    </div>
</template>

<style scoped>
.custom-slider :deep(.p-slider-range) {
    background: rgb(16 185 129);
}

.custom-slider :deep(.p-slider-handle) {
    border-color: rgb(16 185 129);
}

/* Improved scrollbar for dialog */
:deep(.p-dialog-content) {
    max-height: 70vh;
    overflow-y: auto;
    scrollbar-width: thin;
    scrollbar-color: rgba(0, 0, 0, 0.2) transparent;
}

:deep(.p-dialog-content)::-webkit-scrollbar {
    width: 6px;
}

:deep(.p-dialog-content)::-webkit-scrollbar-thumb {
    background-color: rgba(0, 0, 0, 0.2);
    border-radius: 3px;
}

/* Small fix for dropdown in mobile view */
:deep(.p-dropdown-panel) {
    z-index: 10000 !important;
}
</style>