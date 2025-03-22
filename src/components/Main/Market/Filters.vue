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
        InputText
    },
    directives: {
        tooltip: Tooltip
    },
    props: {
        filters: {
            type: Object as PropType<FilterOptions>,
            required: true
        },
        categories: {
            type: Array,
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
            type: Array,
            default: () => []
        }
    },
    emits: ['apply-filters', 'clear-filters', 'update:filters', 'save-preset', 'category-change', 'save-location'],
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
            certified: props.filters.certified,
            auction: props.filters.auction,
            gender: props.filters.gender || null,
            weight: props.filters.weight || null,
            weightUnit: props.filters.weightUnit || 'lbs',
            availableImmediate: props.filters.availableImmediate || false,
            healthStatus: props.filters.healthStatus || null,
            lastUpdated: props.filters.lastUpdated || null
        });

        // Watch for changes in props
        watch(() => props.filters, (newFilters) => {
            filterValues.category = newFilters.category;
            filterValues.breed = newFilters.breed;
            filterValues.ageRange = [...newFilters.ageRange];
            filterValues.ageUnit = newFilters.ageUnit || 'years';
            filterValues.priceRange = [...newFilters.priceRange];
            filterValues.location = newFilters.location;
            filterValues.locationRadius = newFilters.locationRadius || 50;
            filterValues.certified = newFilters.certified;
            filterValues.auction = newFilters.auction;
            filterValues.gender = newFilters.gender || null;
            filterValues.weight = newFilters.weight || null;
            filterValues.weightUnit = newFilters.weightUnit || 'lbs';
            filterValues.availableImmediate = newFilters.availableImmediate || false;
            filterValues.healthStatus = newFilters.healthStatus || null;
            filterValues.lastUpdated = newFilters.lastUpdated || null;
        }, { deep: true });

        const locationSuggestions = ref<string[]>([]);
        const filterPresetName = ref('');
        const locationName = ref('');
        const showPresetDialog = ref(false);
        const showLocationDialog = ref(false);
        const expandedSections = reactive({
            basic: true,
            financial: true,
            additional: true,
            advanced: false
        });

        const genderOptions = [
            { name: 'Male', value: 'male' },
            { name: 'Female', value: 'female' }
        ];

        const weightUnitOptions = [
            { name: 'lbs', value: 'lbs' },
            { name: 'kg', value: 'kg' }
        ];

        const ageUnitOptions = [
            { label: 'Days', value: 'days' },
            { label: 'Months', value: 'months' },
            { label: 'Years', value: 'years' }
        ];

        const healthStatusOptions = [
            { name: 'Excellent', value: 'excellent' },
            { name: 'Good', value: 'good' },
            { name: 'Fair', value: 'fair' }
        ];

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

        watch(() => filterValues.ageUnit, (newUnit) => {
            // Convert age range when unit changes
            if (newUnit === 'days') {
                filterValues.ageRange = [0, 60]; // Default for days
            } else if (newUnit === 'months') {
                filterValues.ageRange = [0, 24]; // Default for months
            } else {
                filterValues.ageRange = [0, 10]; // Default for years
            }
        });

        const searchLocation = (event: any) => {
            // In a real app, this would be an API call
            const query = event.query.toLowerCase();
            const locations = [
                'Austin, TX', 'Dallas, TX', 'Houston, TX', 'Cheyenne, WY',
                'Des Moines, IA', 'Kansas City, MO', 'Omaha, NE', 'Denver, CO',
                'Tulsa, OK', 'Amarillo, TX', 'Wichita, KS', 'Boise, ID',
                'Billings, MT', 'Sioux Falls, SD', 'Fargo, ND', 'Lincoln, NE'
            ];

            // Include saved locations
            const allLocations = [...locations, ...props.savedLocations.map((loc: any) => loc.name)];

            locationSuggestions.value = allLocations.filter(location =>
                location.toLowerCase().includes(query)
            );
        };

        const applyFilters = () => {
            emit('update:filters', { ...filterValues });
            emit('apply-filters');
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
            filterValues.weightUnit = 'lbs';
            filterValues.availableImmediate = false;
            filterValues.healthStatus = null;
            filterValues.lastUpdated = null;

            emit('update:filters', { ...filterValues });
            emit('clear-filters');
        };

        const savePreset = () => {
            if (filterPresetName.value) {
                // In a real app, this would store the preset
                emit('save-preset', { name: filterPresetName.value, filters: { ...filterValues } });
                filterPresetName.value = '';
                showPresetDialog.value = false;
            }
        };

        const saveLocation = () => {
            if (locationName.value && filterValues.location) {
                emit('save-location', {
                    name: locationName.value,
                    address: filterValues.location,
                    radius: filterValues.locationRadius
                });
                locationName.value = '';
                showLocationDialog.value = false;
            }
        };

        const getActiveFiltersCount = () => {
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
        };

        const activeFiltersCount = computed(() => getActiveFiltersCount());

        const toggleSection = (section: string) => {
            expandedSections[section as keyof typeof expandedSections] =
                !expandedSections[section as keyof typeof expandedSections];
        };

        const onCategoryChange = () => {
            // Reset breed when category changes
            filterValues.breed = null;
            emit('category-change', filterValues.category);
        };

        const radiusOptions = [
            { label: '10 miles', value: 10 },
            { label: '25 miles', value: 25 },
            { label: '50 miles', value: 50 },
            { label: '100 miles', value: 100 },
            { label: '250 miles', value: 250 }
        ];

        return {
            filterValues,
            locationSuggestions,
            searchLocation,
            applyFilters,
            clearFilters,
            getActiveFiltersCount,
            activeFiltersCount,
            genderOptions,
            weightUnitOptions,
            ageUnitOptions,
            healthStatusOptions,
            filterPresetName,
            locationName,
            showPresetDialog,
            showLocationDialog,
            savePreset,
            saveLocation,
            expandedSections,
            toggleSection,
            onCategoryChange,
            ageRangeMax,
            ageRangeStep,
            radiusOptions
        };
    }
});
</script>

<template>
    <Card class="livestock-filters">
        <template #header>
            <div class="filter-header">
                <div class="filter-title">
                    <h3>Filter Livestock</h3>
                    <Tag v-if="activeFiltersCount > 0" :value="activeFiltersCount" severity="info" rounded />
                </div>
                <div class="header-actions">
                    <Button icon="pi pi-map-marker" class="p-button-rounded p-button-text p-button-sm"
                        v-tooltip="'Save Current Location'" @click="showLocationDialog = true" />
                    <Button icon="pi pi-save" class="p-button-rounded p-button-text p-button-sm"
                        v-tooltip="'Save Filter Preset'" @click="showPresetDialog = true" />
                </div>
            </div>
        </template>
        <template #content>
            <ProgressBar v-if="loading" mode="indeterminate" style="height: 4px" class="mb-3" />

            <div class="filter-section-header" @click="toggleSection('basic')">
                <h4>Animal Information</h4>
                <i :class="['pi', expandedSections.basic ? 'pi-chevron-down' : 'pi-chevron-right']"></i>
            </div>
            <div v-if="expandedSections.basic" class="filter-section">
                <div class="p-field">
                    <label for="category">Category</label>
                    <Dropdown id="category" v-model="filterValues.category" :options="categories" optionLabel="name"
                        placeholder="Select Category" class="p-inputtext-sm w-full" @change="onCategoryChange" />
                </div>

                <div class="p-field">
                    <label for="breed">Breed</label>
                    <Dropdown id="breed" v-model="filterValues.breed" :options="breeds" optionLabel="name"
                        placeholder="Select Breed" class="p-inputtext-sm w-full" :disabled="!filterValues.category" />
                </div>

                <div class="p-field">
                    <label for="gender">Gender</label>
                    <Dropdown id="gender" v-model="filterValues.gender" :options="genderOptions" optionLabel="name"
                        placeholder="Select Gender" class="p-inputtext-sm w-full" />
                </div>

                <div class="p-field">
                    <div class="age-range-label">
                        <label for="age">Age Range</label>
                        <span class="age-values">{{ filterValues.ageRange[0] }} - {{ filterValues.ageRange[1] }} {{
                            filterValues.ageUnit }}</span>
                    </div>
                    <div class="age-unit-selector">
                        <SelectButton v-model="filterValues.ageUnit" :options="ageUnitOptions" optionLabel="label" />
                    </div>
                    <Slider v-model="filterValues.ageRange" range :min="0" :max="ageRangeMax" :step="ageRangeStep"
                        class="mt-2" />
                </div>

                <div class="weight-input">
                    <div class="p-field weight-field">
                        <label for="weight">Weight</label>
                        <InputNumber id="weight" v-model="filterValues.weight" placeholder="Enter weight" :min="0"
                            :max="5000" class="p-inputtext-sm w-full" />
                    </div>
                    <div class="p-field unit-field">
                        <label for="weightUnit">Unit</label>
                        <Dropdown id="weightUnit" v-model="filterValues.weightUnit" :options="weightUnitOptions"
                            optionLabel="name" class="p-inputtext-sm w-full" />
                    </div>
                </div>
            </div>

            <Divider />

            <div class="filter-section-header" @click="toggleSection('financial')">
                <h4>Financial & Location</h4>
                <i :class="['pi', expandedSections.financial ? 'pi-chevron-down' : 'pi-chevron-right']"></i>
            </div>
            <div v-if="expandedSections.financial" class="filter-section">
                <div class="p-field">
                    <div class="price-range-label">
                        <label for="price">Price Range</label>
                        <span class="price-values">${{ filterValues.priceRange[0].toLocaleString() }} - ${{
                            filterValues.priceRange[1].toLocaleString() }}</span>
                    </div>
                    <Slider v-model="filterValues.priceRange" range :min="0" :max="50000" class="mt-2" />
                </div>

                <div class="p-field">
                    <label for="location">Location</label>
                    <div class="location-input">
                        <AutoComplete id="location" v-model="filterValues.location" :suggestions="locationSuggestions"
                            @complete="searchLocation" placeholder="Enter location" class="w-full" />
                        <Button icon="pi pi-star" class="p-button-rounded p-button-text p-button-sm favorite-btn"
                            v-tooltip="'Save this location'" @click="showLocationDialog = true" />
                    </div>
                </div>

                <div class="p-field">
                    <label for="locationRadius">Search Radius</label>
                    <SelectButton v-model="filterValues.locationRadius" :options="radiusOptions" optionLabel="label"
                        class="radius-selector" />
                </div>

                <div class="p-field-checkbox">
                    <Checkbox id="auction" v-model="filterValues.auction" :binary="true" />
                    <label for="auction" class="p-ml-2" v-tooltip="'Show livestock available for auction'">
                        Auction Available
                    </label>
                </div>
            </div>

            <Divider />

            <div class="filter-section-header" @click="toggleSection('additional')">
                <h4>Additional Options</h4>
                <i :class="['pi', expandedSections.additional ? 'pi-chevron-down' : 'pi-chevron-right']"></i>
            </div>
            <div v-if="expandedSections.additional" class="filter-section">
                <div class="p-field">
                    <label for="healthStatus">Health Status</label>
                    <Dropdown id="healthStatus" v-model="filterValues.healthStatus" :options="healthStatusOptions"
                        optionLabel="name" placeholder="Select Health Status" class="p-inputtext-sm w-full" />
                </div>

                <div class="options-container">
                    <div class="p-field-checkbox">
                        <Checkbox id="certified" v-model="filterValues.certified" :binary="true" />
                        <label for="certified" class="p-ml-2" v-tooltip="'Only show livestock with certification'">
                            Certified Only
                        </label>
                    </div>

                    <div class="p-field-checkbox">
                        <Checkbox id="availableImmediate" v-model="filterValues.availableImmediate" :binary="true" />
                        <label for="availableImmediate" class="p-ml-2"
                            v-tooltip="'Show only livestock available for immediate delivery'">
                            Available Immediately
                        </label>
                    </div>
                </div>
            </div>

            <div v-if="expandedSections.advanced" class="filter-section">
                <div class="p-field">
                    <label for="lastUpdated">Last Updated</label>
                    <Dropdown id="lastUpdated" v-model="filterValues.lastUpdated" :options="[
                        { name: 'Today', value: new Date() },
                        { name: 'Last 7 days', value: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
                        { name: 'Last 30 days', value: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
                    ]" optionLabel="name" placeholder="Select Time Frame" class="p-inputtext-sm w-full" />
                </div>
            </div>

            <Button v-if="!expandedSections.advanced" label="Show Advanced Options"
                class="p-button-text p-button-sm w-full my-2" @click="expandedSections.advanced = true" />
            <Button v-else label="Hide Advanced Options" class="p-button-text p-button-sm w-full my-2"
                @click="expandedSections.advanced = false" />

            <div class="filter-actions">
                <Button label="Apply Filters" icon="pi pi-filter" class="p-button-sm p-button-primary"
                    @click="applyFilters" :disabled="loading" />
                <Button label="Reset" icon="pi pi-times" class="p-button-outlined p-button-sm" @click="clearFilters"
                    :disabled="loading || activeFiltersCount === 0" />
            </div>

            <!-- Save Filter Preset Dialog -->
            <Dialog v-model:visible="showPresetDialog" header="Save Filter Preset" :modal="true" class="preset-dialog">
                <div class="p-field">
                    <label for="presetName">Preset Name</label>
                    <InputText id="presetName" v-model="filterPresetName" placeholder="Enter preset name"
                        class="w-full" />
                </div>
                <div class="preset-actions">
                    <Button label="Save" icon="pi pi-save" class="p-button-sm p-button-primary" @click="savePreset" />
                    <Button label="Cancel" icon="pi pi-times" class="p-button-outlined p-button-sm"
                        @click="showPresetDialog = false" />
                </div>
            </Dialog>

            <!-- Save Location Dialog -->
            <Dialog v-model:visible="showLocationDialog" header="Save Location" :modal="true" class="location-dialog">
                <div class="p-field">
                    <label for="locationName">Location Name</label>
                    <InputText id="locationName" v-model="locationName" placeholder="Enter a name for this location"
                        class="w-full" />
                </div>
                <div class="location-details">
                    <p>Address: {{ filterValues.location || 'No location selected' }}</p>
                    <p>Radius: {{ filterValues.locationRadius }} miles</p>
                </div>
                <div class="preset-actions">
                    <Button label="Save" icon="pi pi-save" class="p-button-sm p-button-primary" @click="saveLocation"
                        :disabled="!filterValues.location || !locationName" />
                    <Button label="Cancel" icon="pi pi-times" class="p-button-outlined p-button-sm"
                        @click="showLocationDialog = false" />
                </div>
            </Dialog>
        </template>
    </Card>
</template>

<style scoped>
.livestock-filters {
    max-width: 400px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    border-radius: 12px;
    background-color: #ffffff;
}

.filter-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.75rem 1rem;
    background-color: #f7f9fc;
    border-bottom: 1px solid #edf2f7;
    border-radius: 12px 12px 0 0;
}

.header-actions {
    display: flex;
    gap: 0.25rem;
}

.filter-title {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.filter-header h3 {
    margin: 0;
    font-size: 1.2rem;
    font-weight: 600;
    color: #5a67d8;
}

.filter-section-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    cursor: pointer;
    padding: 0.25rem 0;
    transition: all 0.2s ease;
}

.filter-section-header:hover {
    color: #6b7fd7;
}

.filter-section {
    margin-bottom: 1rem;
    animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(-10px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.filter-section h4 {
    margin-top: 0;
    margin-bottom: 0.75rem;
    font-size: 1rem;
    color: #5a67d8;
    font-weight: 600;
}

.p-field {
    margin-bottom: 1rem;
}

.p-field label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
    color: #606770;
    font-size: 0.9rem;
}

.age-range-label,
.price-range-label {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.age-values,
.price-values {
    font-size: 0.85rem;
    color: #606770;
    font-weight: 500;
}

.age-unit-selector {
    margin-bottom: 0.5rem;
}

.weight-input {
    display: flex;
    gap: 0.5rem;
}

.weight-field {
    flex: 7;
}

.unit-field {
    flex: 3;
}

.location-input {
    display: flex;
    align-items: center;
    gap: 0.25rem;
}

.favorite-btn {
    flex-shrink: 0;
}

.radius-selector {
    display: flex;
    flex-wrap: wrap;
    gap: 0.25rem;
}

.options-container {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
}

.p-field-checkbox {
    display: flex;
    align-items: center;
    margin-bottom: 0.75rem;
}

.p-field-checkbox label {
    margin-bottom: 0;
    margin-left: 0.5rem;
}

.filter-actions {
    display: flex;
    justify-content: space-between;
    margin-top: 1.5rem;
    gap: 0.5rem;
}

.preset-actions {
    display: flex;
    justify-content: flex-end;
    gap: 0.5rem;
    margin-top: 1rem;
}

.location-details {
    background-color: #f7f9fc;
    padding: 0.75rem;
    border-radius: 8px;
    margin: 1rem 0;
}

.location-details p {
    margin: 0.25rem 0;
    font-size: 0.9rem;
    color: #606770;
}

:deep(.p-button) {
    flex: 1;
}

:deep(.p-button-primary) {
    background-color: #a5b4fc;
    border-color: #a5b4fc;
    color: #4338ca;
}

:deep(.p-button-primary:hover) {
    background-color: #818cf8;
    border-color: #818cf8;
    color: #ffffff;
}

:deep(.p-button-outlined) {
    color: #6b7fd7;
    border-color: #a5b4fc;
}

:deep(.p-button-outlined:hover) {
    background-color: #eef2ff;
    border-color: #818cf8;
}

:deep(.p-button-text) {
    color: #6b7fd7;
}

:deep(.p-button-text:hover) {
    background-color: #eef2ff;
}

:deep(.p-card-content) {
    padding: 1rem;
}

:deep(.p-slider) {
    margin-top: 1rem;
}

:deep(.p-slider .p-slider-range) {
    background-color: #a5b4fc;
}

:deep(.p-slider .p-slider-handle) {
    border-color: #a5b4fc;
    background: #a5b4fc;
}

:deep(.p-slider .p-slider-handle:hover) {
    background: #818cf8;
    border-color: #818cf8;
}

:deep(.p-dropdown) {
    border-color: #cbd5e1;
}

:deep(.p-dropdown:hover) {
    border-color: #a5b4fc;
}

:deep(.p-dropdown .p-dropdown-label) {
    padding: 0.5rem;
}

:deep(.p-inputtext) {
    padding: 0.5rem;
    border-color: #cbd5e1;
}

:deep(.p-inputtext:hover) {
    border-color: #a5b4fc;
}

:deep(.p-inputtext:focus) {
    border-color: #a5b4fc;
    box-shadow: 0 0 0 1px #eef2ff;
}

:deep(.p-tag) {
    background-color: #a5b4fc;
    color: #4338ca;
}

:deep(.p-progressbar) {
    height: 4px;
}

:deep(.p-progressbar .p-progressbar-value) {
    background-color: #a5b4fc;
}

:deep(.p-dropdown-panel .p-dropdown-items .p-dropdown-item.p-highlight) {
    background-color: #eef2ff;
    color: #4338ca;
}

:deep(.p-autocomplete-panel .p-autocomplete-items .p-autocomplete-item.p-highlight) {
    background-color: #eef2ff;
    color: #4338ca;
}

:deep(.p-checkbox .p-checkbox-box) {
    border-color: #cbd5e1;
}

:deep(.p-checkbox .p-checkbox-box.p-highlight) {
    background-color: #a5b4fc;
    border-color: #a5b4fc;
}

:deep(.p-checkbox:not(.p-checkbox-disabled) .p-checkbox-box.p-highlight:hover) {
    background-color: #818cf8;
    border-color: #818cf8;
}

:deep(.p-divider) {
    margin: 1rem 0;
}

:deep(.p-selectbutton .p-button) {
    background-color: #f7f9fc;
    border-color: #cbd5e1;
    color: #64748b;
    padding: 0.4rem;
    font-size: 0.875rem;
}

:deep(.p-selectbutton .p-button.p-highlight) {
    background-color: #eef2ff;
    border-color: #a5b4fc;
    color: #4338ca;
}

:deep(.p-selectbutton .p-button:not(.p-disabled):not(.p-highlight):hover) {
    background-color: #eef2ff;
    border-color: #a5b4fc;
    color: #4338ca;
}

:deep(.p-dialog .p-dialog-header) {
    background-color: #f7f9fc;
    padding: 1rem;
    border-bottom: 1px solid #edf2f7;
}

:deep(.p-dialog .p-dialog-content) {
    padding: 1rem;
}

:deep(.p-dialog .p-dialog-footer) {
    padding: 1rem;
    border-top: 1px solid #edf2f7;
}

:deep(.p-tooltip .p-tooltip-text) {
    background-color: #4338ca;
    color: #ffffff;
    font-size: 0.8rem;
    padding: 0.5rem 0.75rem;
}

:deep(.p-tooltip .p-tooltip-arrow) {
    border-top-color: #4338ca;
}

@media (max-width: 768px) {
    .livestock-filters {
        max-width: 100%;
    }

    .weight-input {
        flex-direction: column;
        gap: 1rem;
    }

    .filter-actions {
        flex-direction: column;
    }
}
</style>