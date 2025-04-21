<script>
import { ref, reactive, computed, watch, onMounted } from 'vue';
import PrimeVue from 'primevue/config';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import InputNumber from 'primevue/inputnumber';
import Dropdown from 'primevue/dropdown';
import RadioButton from 'primevue/radiobutton';
import Checkbox from 'primevue/checkbox';
import Textarea from 'primevue/textarea';
import FileUpload from 'primevue/fileupload';
import ProgressBar from 'primevue/progressbar';
import Steps from 'primevue/steps';
import Card from 'primevue/card';
import Panel from 'primevue/panel';
import Divider from 'primevue/divider';
import Tooltip from 'primevue/tooltip';
import MultiSelect from 'primevue/multiselect';
import Chip from 'primevue/chip';
import Avatar from 'primevue/avatar';
import Galleria from 'primevue/galleria';

export default {
  components: {
    Button,
    InputText,
    InputNumber,
    Dropdown,
    RadioButton,
    Checkbox,
    Textarea,
    FileUpload,
    ProgressBar,
    Steps,
    Card,
    Panel,
    Divider,
    MultiSelect,
    Chip,
    Avatar,
    Galleria
  },
  directives: {
    tooltip: Tooltip
  },
  setup() {
    const currentStep = ref(1);
    const totalSteps = ref(5);
    
    // Listing Details
    const title = ref('');
    const description = ref('');
    const category = ref('');
    const breed = ref('');

    // Pricing
    const price = ref(null);
    const negotiable = ref(false);
    const quantity = ref(1);

    // Physical Characteristics
    const age = ref(null);
    const ageUnit = ref('months');
    const gender = ref('');
    const weight = ref(null);
    const weightUnit = ref('lbs');

    // Health Information
    const healthStatus = ref('');
    const feedingType = ref('');

    // Location & Delivery
    const detailedLocation = ref('');
    const deliveryOptions = ref([]);
    const deliveryRestrictions = ref('');
    const maxDeliveryDistance = ref(null);
    const deliveryDistanceUnit = ref('miles');

    // Additional Flags
    const certified = ref(false);
    const auction = ref(false);
    const availableImmediate = ref(false);

    // Media Upload
    const imagePreviewUrls = ref([]);
    const videoPreview = ref(null);
    const maxImageUploadCount = ref(5);

    // Form State
    const formReviewed = ref(false);
    const errors = ref({});

    // Options for Dropdowns
    const categoryOptions = ref([
      { label: 'Cattle', value: 'cattle', icon: '🐄' },
      { label: 'Sheep', value: 'sheep', icon: '🐑' },
      { label: 'Goats', value: 'goats', icon: '🐐' },
      { label: 'Pigs', value: 'pigs', icon: '🐖' },
      { label: 'Horses', value: 'horses', icon: '🐎' }
    ]);
    
    const availableBreeds = ref([]);
    
    const ageUnitOptions = ref([
      { label: 'Months', value: 'months' },
      { label: 'Years', value: 'years' }
    ]);
    
    const weightUnitOptions = ref([
      { label: 'lbs', value: 'lbs' },
      { label: 'kg', value: 'kg' }
    ]);
    
    const genderOptions = ref([
      { label: 'Male', value: 'male' },
      { label: 'Female', value: 'female' }
    ]);
    
    const healthStatusOptions = ref([
      { label: 'Select Health Status', value: '' },
      { label: 'Excellent', value: 'excellent' },
      { label: 'Good', value: 'good' },
      { label: 'Fair', value: 'fair' }
    ]);
    
    const deliveryDistanceUnitOptions = ref([
      { label: 'Miles', value: 'miles' },
      { label: 'Kilometers', value: 'kilometers' }
    ]);
    
    const deliveryOptionItems = ref([
      { label: 'On-site Pickup', value: 'on-site-pickup' },
      { label: 'Local Delivery', value: 'local-delivery' },
      { label: 'Transportation Services', value: 'transportation-services' }
    ]);
    
    // Steps configuration
    const stepsItems = ref([
      { label: 'Basic Information', command: () => goToStep(1) },
      { label: 'Pricing & Quantity', command: () => goToStep(2) },
      { label: 'Physical Details', command: () => goToStep(3) },
      { label: 'Location & Description', command: () => goToStep(4) },
      { label: 'Media Upload', command: () => goToStep(5) }
    ]);

    // Breed map for different categories
    const breedMap = {
      cattle: [
        { label: 'Angus', value: 'angus' },
        { label: 'Hereford', value: 'hereford' },
        { label: 'Holstein', value: 'holstein' },
        { label: 'Brahman', value: 'brahman' },
        { label: 'Charolais', value: 'charolais' }
      ],
      sheep: [
        { label: 'Merino', value: 'merino' },
        { label: 'Suffolk', value: 'suffolk' },
        { label: 'Dorper', value: 'dorper' },
        { label: 'Hampshire', value: 'hampshire' }
      ],
      goats: [
        { label: 'Boer', value: 'boer' },
        { label: 'Alpine', value: 'alpine' },
        { label: 'Nubian', value: 'nubian' },
        { label: 'Saanen', value: 'saanen' }
      ],
      pigs: [
        { label: 'Berkshire', value: 'berkshire' },
        { label: 'Yorkshire', value: 'yorkshire' },
        { label: 'Duroc', value: 'duroc' },
        { label: 'Hampshire', value: 'hampshire' }
      ],
      horses: [
        { label: 'Quarter Horse', value: 'quarter-horse' },
        { label: 'Arabian', value: 'arabian' },
        { label: 'Thoroughbred', value: 'thoroughbred' },
        { label: 'Appaloosa', value: 'appaloosa' },
        { label: 'Morgan', value: 'morgan' }
      ]
    };

    // Watch for category changes to update available breeds
    watch(category, (newCategory) => {
      // Reset breed when category changes
      breed.value = '';
      
      // Set available breeds for the selected category
      availableBreeds.value = breedMap[newCategory] || [];
    });

    // Computed properties
    const progressPercentage = computed(() => {
      return (currentStep.value / totalSteps.value) * 100;
    });
    
    const getCategoryIcon = computed(() => {
      const cat = categoryOptions.value.find(cat => cat.value === category.value);
      return cat ? cat.icon : '🐄';
    });
    
    const stepValidation = computed(() => {
      return {
        1: validateStep1(),
        2: validateStep2(),
        3: validateStep3(),
        4: validateStep4(),
        5: true // Media is optional
      };
    });
    
    const currentStepValid = computed(() => {
      return stepValidation.value[currentStep.value];
    });

    // Validation methods
    function validateStep1() {
      return title.value.trim() !== '' && category.value !== '' && breed.value !== '';
    }
    
    function validateStep2() {
      return price.value !== null && price.value > 0 && quantity.value > 0;
    }
    
    function validateStep3() {
      // Physical characteristics are optional
      return true;
    }
    
    function validateStep4() {
      return detailedLocation.value.trim() !== '' && description.value.trim() !== '';
    }
    
    // Navigation functions
    function nextStep() {
      if (currentStep.value < totalSteps.value && currentStepValid.value) {
        currentStep.value++;
        window.scrollTo(0, 0);
      }
    }
    
    function prevStep() {
      if (currentStep.value > 1) {
        currentStep.value--;
        window.scrollTo(0, 0);
      }
    }
    
    function goToStep(step) {
      // Allow going back to any step, but forward only to validated steps
      if (step < currentStep.value || stepValidation.value[step - 1]) {
        currentStep.value = step;
        window.scrollTo(0, 0);
      }
    }

    // Media handling
    function handleFileUpload(event) {
      const files = event.files;
      
      if (!files.length) return;

      // Process each file
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (imagePreviewUrls.value.length >= maxImageUploadCount.value) break;
        
        const reader = new FileReader();
        reader.onload = (e) => {
          imagePreviewUrls.value.push(e.target.result);
        };
        reader.readAsDataURL(file);
      }

      // Clear the fileupload component
      event.options.clear();
    }

    function handleVideoUpload(event) {
      const file = event.files[0];

      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          videoPreview.value = e.target.result;
        };
        reader.readAsDataURL(file);
      }
      
      // Clear the fileupload component
      event.options.clear();
    }

    function removeImage(index) {
      imagePreviewUrls.value.splice(index, 1);
    }

    function clearImages() {
      imagePreviewUrls.value = [];
    }

    function clearVideo() {
      videoPreview.value = null;
    }

    // Form handling
    function validateForm() {
      // Check all steps
      for (let i = 1; i <= totalSteps.value - 1; i++) {
        if (!stepValidation.value[i]) {
          currentStep.value = i;
          return false;
        }
      }
      return true;
    }

    function proceedToReview() {
      if (validateForm()) {
        formReviewed.value = true;
        window.scrollTo(0, 0);
      }
    }

    function submitForm() {
      // Collect all form data
      const formData = {
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
        video: videoPreview.value
      };

      // Replace with actual API call to submit listing
      console.log('Submitting Listing:', formData);
      alert('Listing submitted successfully!');

      // Reset form
      resetForm();
    }

    function resetForm() {
      // Reset all form fields
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
    }
    
    function editForm() {
      formReviewed.value = false;
      currentStep.value = 1;
    }

    return {
      currentStep,
      totalSteps,
      title,
      description,
      category,
      breed,
      price,
      negotiable,
      quantity,
      age,
      ageUnit,
      gender,
      weight,
      weightUnit,
      healthStatus,
      feedingType,
      detailedLocation,
      deliveryOptions,
      deliveryRestrictions,
      maxDeliveryDistance,
      deliveryDistanceUnit,
      certified,
      auction,
      availableImmediate,
      imagePreviewUrls,
      videoPreview,
      maxImageUploadCount,
      formReviewed,
      errors,
      categoryOptions,
      availableBreeds,
      ageUnitOptions,
      weightUnitOptions,
      genderOptions,
      healthStatusOptions,
      deliveryDistanceUnitOptions,
      deliveryOptionItems,
      stepsItems,
      progressPercentage,
      getCategoryIcon,
      currentStepValid,
      nextStep,
      prevStep,
      goToStep,
      handleFileUpload,
      handleVideoUpload,
      removeImage,
      clearImages,
      clearVideo,
      proceedToReview,
      submitForm,
      resetForm,
      editForm
    };
  }
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-teal-50 to-emerald-600 flex justify-center py-8 px-4 font-sans text-gray-800">
    <div class="w-full max-w-6xl bg-white rounded-3xl shadow-xl overflow-hidden">
      <!-- Header -->
      <div class="bg-emerald-700 py-8 px-8 text-white">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 class="text-4xl font-bold tracking-tight">Livestock <span class="text-emerald-300">Marketplace</span></h1>
            <p class="mt-2 text-emerald-100">Create a premium listing to showcase your quality livestock</p>
          </div>
          <div v-if="!formReviewed" class="mt-6 md:mt-0">
            <div class="flex items-center">
              <span class="text-sm font-medium text-emerald-200">{{ currentStep }} of {{ totalSteps }}</span>
              <div class="w-64 ml-4">
                <ProgressBar :value="progressPercentage" class="h-2" :pt="{
                  root: { class: 'h-2 bg-emerald-900 rounded-full' },
                  value: { class: 'bg-emerald-300 h-2 rounded-full' }
                }" />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Main Content Area -->
      <div v-if="!formReviewed" class="p-6 md:p-10">
        <!-- Steps Navigation -->
        <div class="mb-8">
          <Steps :model="stepsItems" :readonly="false" :activeIndex="currentStep - 1" :pt="{
            root: { class: 'border-b border-gray-200' },
            step: { class: 'py-3' },
            action: { class: 'flex flex-col items-center min-w-24' },
            label: { class: 'mt-2 font-medium text-sm' }
          }" />
        </div>
        
        <!-- Step 1: Basic Information -->
        <div v-if="currentStep === 1" class="space-y-8">
          <Card class="bg-emerald-50 border border-emerald-100 shadow-sm">
            <template #title>
              <h2 class="text-2xl font-bold text-emerald-800">Title & Category</h2>
            </template>
            <template #content>
              <!-- Listing Title -->
              <div class="mb-6">
                <label class="block text-gray-700 font-medium mb-2">Listing Title <span class="text-red-500">*</span></label>
                <span class="p-input-icon-right w-full">
                  <InputText
                    v-model="title"
                    placeholder="e.g. Premium Black Angus Calves - Farm Raised"
                    class="w-full p-inputtext-lg"
                    maxlength="120"
                    required
                  />
                  <small class="text-xs">{{ title.length }}/120</small>
                </span>
                <p class="text-sm text-gray-500 mt-1">Make it descriptive and attention-grabbing</p>
              </div>
              
              <!-- Category Selection with Icons -->
              <div class="mb-6">
                <label class="block text-gray-700 font-medium mb-2">
                  Livestock Category <span class="text-red-500">*</span>
                </label>
                <div class="grid grid-cols-2 md:grid-cols-5 gap-3">
                  <button 
                    v-for="cat in categoryOptions" 
                    :key="cat.value" 
                    type="button" 
                    @click="category = cat.value"
                    :class="[
                      'p-3 rounded-xl transition-all duration-200 flex flex-col items-center justify-center',
                      category === cat.value
                        ? 'bg-emerald-600 text-white shadow-md'
                        : 'bg-white border-2 border-gray-200 text-gray-700 hover:bg-emerald-50 hover:border-emerald-200'
                    ]"
                  >
                    <span class="text-2xl mb-1">{{ cat.icon }}</span>
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
                  <Button
                    v-for="b in availableBreeds"
                    :key="b.value"
                    @click="breed = b.value"
                    :class="[
                      'p-button-lg',
                      breed === b.value
                        ? 'p-button-outlined p-button-success'
                        : 'p-button-outlined p-button-secondary'
                    ]"
                    :label="b.label"
                  />
                </div>
              </div>
            </template>
          </Card>
        </div>
        
        <!-- Step 2: Pricing & Quantity -->
        <div v-if="currentStep === 2" class="space-y-8">
          <Card class="bg-emerald-50 border border-emerald-100 shadow-sm">
            <template #title>
              <h2 class="text-2xl font-bold text-emerald-800">Pricing Information</h2>
            </template>
            <template #content>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Price -->
                <div>
                  <label class="block text-gray-700 font-medium mb-2">
                    Price <span class="text-red-500">*</span>
                  </label>
                  <div class="p-inputgroup">
                    <span class="p-inputgroup-addon">$</span>
                    <InputNumber
                      v-model="price"
                      placeholder="0.00"
                      mode="decimal"
                      :minFractionDigits="2"
                      :maxFractionDigits="2"
                      class="w-full"
                    />
                  </div>
                  <div class="mt-3 flex items-center">
                    <Checkbox
                      v-model="negotiable"
                      :binary="true"
                      inputId="negotiable"
                    />
                    <label for="negotiable" class="ml-2 text-gray-700">Price is negotiable</label>
                  </div>
                </div>
                
                <!-- Quantity -->
                <div>
                  <label class="block text-gray-700 font-medium mb-2">
                    Quantity <span class="text-red-500">*</span>
                  </label>
                  <InputNumber
                    v-model="quantity"
                    showButtons
                    buttonLayout="horizontal"
                    :step="1"
                    :min="1"
                    decrementButtonClass="p-button-secondary"
                    incrementButtonClass="p-button-secondary"
                    class="w-full"
                  />
                </div>
              </div>
              
              <Divider />
              
              <div>
                <h3 class="text-lg font-semibold text-emerald-700 mb-3">Additional Options</h3>
                <div class="flex flex-wrap gap-4">
                  <div class="flex items-center">
                    <Checkbox v-model="certified" :binary="true" inputId="certified" />
                    <label for="certified" class="ml-2 text-gray-700">Certified</label>
                  </div>
                  <div class="flex items-center">
                    <Checkbox v-model="auction" :binary="true" inputId="auction" />
                    <label for="auction" class="ml-2 text-gray-700">Auction</label>
                  </div>
                  <div class="flex items-center">
                    <Checkbox v-model="availableImmediate" :binary="true" inputId="availableImmediate" />
                    <label for="availableImmediate" class="ml-2 text-gray-700">Available Immediately</label>
                  </div>
                </div>
              </div>
            </template>
          </Card>
        </div>
        
        <!-- Step 3: Physical Characteristics -->
        <div v-if="currentStep === 3" class="space-y-8">
          <Card class="bg-emerald-50 border border-emerald-100 shadow-sm">
            <template #title>
              <h2 class="text-2xl font-bold text-emerald-800">Physical Characteristics</h2>
            </template>
            <template #content>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Age -->
                <div>
                  <label class="block text-gray-700 font-medium mb-2">Age</label>
                  <div class="flex space-x-3">
                    <InputNumber
                      v-model="age"
                      placeholder="Age"
                      class="w-full"
                      :min="0"
                    />
                    <Dropdown
                      v-model="ageUnit"
                      :options="ageUnitOptions"
                      optionLabel="label"
                      optionValue="value"
                      class="w-40"
                    />
                  </div>
                </div>
                
                <!-- Gender -->
                <div>
                  <label class="block text-gray-700 font-medium mb-2">Gender</label>
                  <div class="flex space-x-3">
                    <div class="flex-1">
                      <Button
                        type="button"
                        @click="gender = 'male'"
                        :class="[
                          'p-button-lg w-full',
                          gender === 'male' ? 'p-button-info' : 'p-button-outlined p-button-info'
                        ]"
                        label="Male"
                        icon="pi pi-mars"
                      />
                    </div>
                    <div class="flex-1">
                      <Button
                        type="button"
                        @click="gender = 'female'"
                        :class="[
                          'p-button-lg w-full',
                          gender === 'female' ? 'p-button-help' : 'p-button-outlined p-button-help'
                        ]"
                        label="Female"
                        icon="pi pi-venus"
                      />
                    </div>
                  </div>
                </div>
                
                <!-- Weight -->
                <div>
                  <label class="block text-gray-700 font-medium mb-2">Weight</label>
                  <div class="flex space-x-3">
                    <InputNumber
                      v-model="weight"
                      placeholder="Weight"
                      class="w-full"
                      :min="0"
                    />
                    <Dropdown
                      v-model="weightUnit"
                      :options="weightUnitOptions"
                      optionLabel="label"
                      optionValue="value"
                      class="w-40"
                    />
                  </div>
                </div>
                
                <!-- Health Status -->
                <div>
                  <label class="block text-gray-700 font-medium mb-2">Health Status</label>
                  <Dropdown
                    v-model="healthStatus"
                    :options="healthStatusOptions"
                    optionLabel="label"
                    optionValue="value"
                    placeholder="Select Health Status"
                    class="w-full"
                  />
                </div>
              </div>
              
              <!-- Feeding Type -->
              <div class="mt-6">
                <label class="block text-gray-700 font-medium mb-2">Feeding Type</label>
                <InputText
                  v-model="feedingType"
                  placeholder="E.g., Grass-fed, Grain-fed, Free-range"
                  class="w-full"
                />
              </div>
            </template>
          </Card>
        </div>
        
        <!-- Step 4: Location & Description -->
        <div v-if="currentStep === 4" class="space-y-8">
          <!-- Location Section -->
          <Card class="bg-emerald-50 border border-emerald-100 shadow-sm">
            <template #title>
              <h2 class="text-2xl font-bold text-emerald-800">Location & Delivery</h2>
            </template>
            <template #content>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Location -->
                <div>
                  <label class="block text-gray-700 font-medium mb-2">
                    Farm/Ranch Location <span class="text-red-500">*</span>
                  </label>
                  <span class="p-input-icon-right w-full">
                    <i class="pi pi-map-marker" />
                    <InputText
                      v-model="detailedLocation"
                      placeholder="City, State or Full Address"
                      class="w-full"
                      required
                    />
                  </span>
                </div>
                
                <!-- Delivery Distance -->
                <div>
                  <label class="block text-gray-700 font-medium mb-2">Maximum Delivery Distance</label>
                  <div class="flex space-x-3">
                    <InputNumber
                      v-model="maxDeliveryDistance"
                      placeholder="Distance"
                      class="w-full"
                      :min="0"
                    />
                    <Dropdown
                      v-model="deliveryDistanceUnit"
                      :options="deliveryDistanceUnitOptions"
                      optionLabel="label"
                      optionValue="value"
                      class="w-40"
                    />
                  </div>
                </div>
              </div>
              
              <!-- Delivery Options -->
              <div class="mt-6">
                <label class="block text-gray-700 font-medium mb-2">Delivery Options</label>
                <MultiSelect
                  v-model="deliveryOptions"
                  :options="deliveryOptionItems"
                  optionLabel="label"
                  optionValue="value"
                  display="chip"
                  placeholder="Select Delivery Options"
                  class="w-full"
                />
              </div>
              
              <!-- Delivery Restrictions -->
              <div class="mt-6">
                <label class="block text-gray-700 font-medium mb-2">Delivery Restrictions</label>
                <Textarea
                  v-model="deliveryRestrictions"
                  rows="3"
                  placeholder="Any specific delivery limitations or requirements"
                  class="w-full"
                />
              </div>
            </template>
          </Card>
          
          <!-- Description Section -->
          <Card class="bg-emerald-50 border border-emerald-100 shadow-sm">
            <template #title>
              <h2 class="text-2xl font-bold text-emerald-800">Detailed Description</h2>
            </template>
            <template #content>
              <div>
                <label class="block text-gray-700 font-medium mb-2">
                  Description <span class="text-red-500">*</span>
                </label>
                <Textarea
                  v-model="description"
                  rows="6"
                  placeholder="Provide detailed information about your livestock..."
                  class="w-full"
                  required
                />
                <p class="text-sm text-gray-500 mt-1">
                  Include relevant information like background, lineage, temperament, and care instructions
                </p>
              </div>
            </template>
          </Card>
        </div>
        
        <!-- Step 5: Media Upload -->
        <div v-if="currentStep === 5" class="space-y-8">
          <Card class="bg-emerald-50 border border-emerald-100 shadow-sm">
            <template #title>
              <h2 class="text-2xl font-bold text-emerald-800">Media Upload</h2>
            </template>
            <template #content>
              <!-- Photo Upload -->
              <div class="mb-8">
                <label class="block text-gray-700 font-medium mb-2">
                  Photos ({{ imagePreviewUrls.length }}/{{ maxImageUploadCount }})
                </label>
                <div class="bg-white border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <FileUpload
                    mode="basic"
                    name="photos[]"
                    :multiple="true"
                    accept="image/*"
                    :maxFileSize="5000000"
                    :disabled="imagePreviewUrls.length >= maxImageUploadCount"
                    @upload="handleFileUpload"
                    auto
                    chooseLabel="Select Photos"
                    class="w-full mb-4"
                    :pt="{
                      chooseButton: { class: 'p-button-lg w-full md:w-auto' }
                    }"
                  />
                  <p class="text-sm text-gray-500">
                    Upload up to {{ maxImageUploadCount }} photos (Max 5MB each)
                  </p>
                </div>
                
                <!-- Image Preview Grid -->
                <div v-if="imagePreviewUrls.length > 0" class="mt-4">
                  <div class="flex justify-between items-center mb-3">
                    <h3 class="font-medium text-gray-700">Photo Preview</h3>
                    <Button
                      type="button"
                      @click="clearImages"
                      icon="pi pi-trash"
                      class="p-button-sm p-button-danger p-button-outlined"
                      label="Clear All"
                    />
                  </div>
                  <div class="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <div
                      v-for="(url, index) in imagePreviewUrls"
                      :key="index"
                      class="relative bg-white rounded-lg overflow-hidden border border-gray-200 aspect-square"
                    >
                      <img :src="url" class="w-full h-full object-cover" />
                      <Button
                        type="button"
                        icon="pi pi-times"
                        @click="removeImage(index)"
                        class="p-button-rounded p-button-danger p-button-sm absolute top-1 right-1"
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- Video Upload -->
              <div>
                <label class="block text-gray-700 font-medium mb-2">
                  Video (Optional)
                </label>
                <div class="bg-white border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <FileUpload
                    mode="basic"
                    name="video"
                    accept="video/*"
                    :maxFileSize="50000000"
                    @upload="handleVideoUpload"
                    auto
                    chooseLabel="Select Video"
                    class="w-full mb-4"
                    :pt="{
                      chooseButton: { class: 'p-button-lg w-full md:w-auto' }
                    }"
                  />
                  <p class="text-sm text-gray-500">
                    Upload a single video to showcase your livestock (Max 50MB)
                  </p>
                </div>
                
                <!-- Video Preview -->
                <div v-if="videoPreview" class="mt-4">
                  <div class="flex justify-between items-center mb-3">
                    <h3 class="font-medium text-gray-700">Video Preview</h3>
                    <Button
                      type="button"
                      @click="clearVideo"
                      icon="pi pi-trash"
                      class="p-button-sm p-button-danger p-button-outlined"
                      label="Clear"
                    />
                  </div>
                  <div class="bg-black rounded-lg overflow-hidden">
                    <video :src="videoPreview" controls class="w-full h-auto"></video>
                  </div>
                </div>
              </div>
            </template>
          </Card>
        </div>
        
        <!-- Navigation Buttons -->
        <div class="mt-8 flex justify-between">
          <Button
            v-if="currentStep > 1"
            @click="prevStep"
            label="Previous"
            icon="pi pi-arrow-left"
            class="p-button-secondary p-button-lg"
          />
          <div v-else class="invisible"></div>
          
          <div>
            <Button
              v-if="currentStep < totalSteps"
              @click="nextStep"
              label="Continue"
              icon="pi pi-arrow-right"
              iconPos="right"
              class="p-button-primary p-button-lg"
              :disabled="!currentStepValid"
            />
            <Button
              v-else
              @click="proceedToReview"
              label="Review Listing"
              icon="pi pi-check-circle"
              iconPos="right"
              class="p-button-success p-button-lg"
            />
          </div>
        </div>
      </div>
      
      <!-- Review Page -->
      <div v-else class="p-6 md:p-10">
        <div class="mb-8 flex items-center justify-between">
          <h2 class="text-3xl font-bold text-emerald-800">Review Your Listing</h2>
          <Button
            @click="editForm"
            icon="pi pi-pencil"
            label="Edit Listing"
            class="p-button-outlined p-button-secondary"
          />
        </div>
        
        <!-- Preview Cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <!-- Basic Information -->
          <Card class="shadow-sm">
            <template #header>
              <div class="bg-emerald-700 p-4 text-white">
                <h3 class="text-xl font-bold">Basic Information</h3>
              </div>
            </template>
            <template #content>
              <div class="space-y-4">
                <div>
                  <h4 class="text-sm text-gray-500 font-medium">Title</h4>
                  <p class="text-lg font-semibold">{{ title }}</p>
                </div>
                <div class="flex items-center gap-3">
                  <div>
                    <h4 class="text-sm text-gray-500 font-medium">Category</h4>
                    <div class="flex items-center">
                      <span class="text-xl mr-2">{{ getCategoryIcon }}</span>
                      <span>{{ categoryOptions.find(c => c.value === category)?.label }}</span>
                    </div>
                  </div>
                  <div>
                    <h4 class="text-sm text-gray-500 font-medium">Breed</h4>
                    <p>{{ availableBreeds.find(b => b.value === breed)?.label }}</p>
                  </div>
                </div>
              </div>
            </template>
          </Card>
          
          <!-- Pricing -->
          <Card class="shadow-sm">
            <template #header>
              <div class="bg-emerald-700 p-4 text-white">
                <h3 class="text-xl font-bold">Pricing & Quantity</h3>
              </div>
            </template>
            <template #content>
              <div class="space-y-4">
                <div class="flex items-end gap-6">
                  <div>
                    <h4 class="text-sm text-gray-500 font-medium">Price</h4>
                    <p class="text-2xl font-bold text-emerald-700">${{ price }}</p>
                    <p v-if="negotiable" class="text-xs text-gray-500">(Negotiable)</p>
                  </div>
                  <div>
                    <h4 class="text-sm text-gray-500 font-medium">Quantity</h4>
                    <p class="text-lg font-semibold">{{ quantity }}</p>
                  </div>
                </div>
                <div v-if="certified || auction || availableImmediate">
                  <h4 class="text-sm text-gray-500 font-medium">Additional</h4>
                  <div class="flex flex-wrap gap-2 mt-1">
                    <Chip v-if="certified" label="Certified" class="bg-blue-100 text-blue-700" />
                    <Chip v-if="auction" label="Auction" class="bg-amber-100 text-amber-700" />
                    <Chip v-if="availableImmediate" label="Available Immediately" class="bg-green-100 text-green-700" />
                  </div>
                </div>
              </div>
            </template>
          </Card>
          
          <!-- Physical Details -->
          <Card class="shadow-sm">
            <template #header>
              <div class="bg-emerald-700 p-4 text-white">
                <h3 class="text-xl font-bold">Physical Details</h3>
              </div>
            </template>
            <template #content>
              <div class="grid grid-cols-2 gap-4">
                <div v-if="age">
                  <h4 class="text-sm text-gray-500 font-medium">Age</h4>
                  <p>{{ age }} {{ ageUnit }}</p>
                </div>
                <div v-if="gender">
                  <h4 class="text-sm text-gray-500 font-medium">Gender</h4>
                  <p class="capitalize">{{ gender }}</p>
                </div>
                <div v-if="weight">
                  <h4 class="text-sm text-gray-500 font-medium">Weight</h4>
                  <p>{{ weight }} {{ weightUnit }}</p>
                </div>
                <div v-if="healthStatus">
                  <h4 class="text-sm text-gray-500 font-medium">Health</h4>
                  <p class="capitalize">{{ healthStatus }}</p>
                </div>
              </div>
              <div v-if="feedingType" class="mt-4">
                <h4 class="text-sm text-gray-500 font-medium">Feeding Type</h4>
                <p>{{ feedingType }}</p>
              </div>
            </template>
          </Card>
          
          <!-- Location -->
          <Card class="shadow-sm">
            <template #header>
              <div class="bg-emerald-700 p-4 text-white">
                <h3 class="text-xl font-bold">Location & Delivery</h3>
              </div>
            </template>
            <template #content>
              <div class="space-y-4">
                <div>
                  <h4 class="text-sm text-gray-500 font-medium">Location</h4>
                  <p>{{ detailedLocation }}</p>
                </div>
                <div v-if="maxDeliveryDistance">
                  <h4 class="text-sm text-gray-500 font-medium">Delivery Distance</h4>
                  <p>{{ maxDeliveryDistance }} {{ deliveryDistanceUnit }}</p>
                </div>
                <div v-if="deliveryOptions.length">
                  <h4 class="text-sm text-gray-500 font-medium">Delivery Options</h4>
                  <div class="flex flex-wrap gap-2 mt-1">
                    <Chip
                      v-for="option in deliveryOptions"
                      :key="option"
                      :label="deliveryOptionItems.find(i => i.value === option)?.label"
                      class="bg-emerald-100 text-emerald-700"
                    />
                  </div>
                </div>
                <div v-if="deliveryRestrictions">
                  <h4 class="text-sm text-gray-500 font-medium">Delivery Restrictions</h4>
                  <p>{{ deliveryRestrictions }}</p>
                </div>
              </div>
            </template>
          </Card>
          
          <!-- Description -->
          <Card class="shadow-sm col-span-1 md:col-span-2">
            <template #header>
              <div class="bg-emerald-700 p-4 text-white">
                <h3 class="text-xl font-bold">Detailed Description</h3>
              </div>
            </template>
            <template #content>
              <p class="whitespace-pre-line">{{ description }}</p>
            </template>
          </Card>
          
          <!-- Media Preview -->
          <Card v-if="imagePreviewUrls.length || videoPreview" class="shadow-sm col-span-1 md:col-span-2">
            <template #header>
              <div class="bg-emerald-700 p-4 text-white">
                <h3 class="text-xl font-bold">Media</h3>
              </div>
            </template>
            <template #content>
              <!-- Images Gallery -->
              <div v-if="imagePreviewUrls.length" class="mb-8">
                <h4 class="text-sm text-gray-500 font-medium mb-3">Photos ({{ imagePreviewUrls.length }})</h4>
                <Galleria
                  :value="imagePreviewUrls"
                  :responsiveOptions="[
                    {
                      breakpoint: '1024px',
                      numVisible: 5
                    },
                    {
                      breakpoint: '768px',
                      numVisible: 3
                    },
                    {
                      breakpoint: '560px',
                      numVisible: 1
                    }
                  ]"
                  :circular="true"
                  :showItemNavigators="true"
                  :showThumbnails="true"
                  :thumbnailsPosition="'bottom'"
                >
                  <template #item="slotProps">
                    <img :src="slotProps.item" style="width: 100%; max-height: 500px; object-fit: contain;" />
                  </template>
                  <template #thumbnail="slotProps">
                    <img :src="slotProps.item" style="width: 60px; height: 60px; object-fit: cover;" />
                  </template>
                </Galleria>
              </div>
              
              <!-- Video Preview -->
              <div v-if="videoPreview">
                <h4 class="text-sm text-gray-500 font-medium mb-3">Video</h4>
                <div class="bg-black rounded-lg overflow-hidden">
                  <video :src="videoPreview" controls class="w-full h-auto"></video>
                </div>
              </div>
            </template>
          </Card>
        </div>
        
        <!-- Submit Buttons -->
        <div class="mt-10 flex flex-col md:flex-row justify-center gap-4">
          <Button
            @click="submitForm"
            icon="pi pi-check"
            label="Submit Listing"
            class="p-button-success p-button-lg"
          />
          <Button
            @click="resetForm"
            icon="pi pi-refresh"
            label="Start Over"
            class="p-button-secondary p-button-lg"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.p-card .p-card-content {
  padding: 1.25rem;
}
.p-steps .p-steps-item.p-highlight .p-steps-number {
  background: rgb(16 185 129); /* emerald-600 */
}
</style>