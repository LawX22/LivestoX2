<template>
    <div class="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
      <Card class="w-full max-w-5xl shadow-2xl rounded-2xl overflow-hidden">
        <!-- Progress Tracker -->
        <template #header>
          <div class="bg-white p-6 pb-0 border-b border-gray-200">
            <div class="flex flex-col space-y-4">
              <div class="flex justify-between items-center">
                <div class="flex items-center space-x-3">
                  <Badge 
                    :value="`Step ${currentStep + 1} of ${stepLabels.length}`" 
                    severity="info" 
                    class="p-mr-2"
                  />
                  <span class="text-sm font-medium text-gray-600">
                    {{ stepLabels[currentStep] }}
                  </span>
                </div>
              </div>
              
              <div class="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                <div 
                  class="bg-gradient-to-r from-blue-500 to-blue-700 h-2.5 rounded-full transition-all duration-500 ease-in-out" 
                  :style="{ width: `${(currentStep + 1) * (100 / stepLabels.length)}%` }"
                ></div>
              </div>
              
              <div class="flex justify-between -mt-1">
                <div 
                  v-for="(label, index) in stepLabels" 
                  :key="index" 
                  class="text-xs font-medium"
                  :class="{
                    'text-blue-600 font-bold': index <= currentStep,
                    'text-gray-400': index > currentStep
                  }"
                >
                  {{ label }}
                </div>
              </div>
            </div>
          </div>
        </template>
  
        <template #content>
          <!-- Livestock Details Step -->
          <div v-if="currentStep === 0" class="p-6 space-y-6">
            <h2 class="text-2xl font-bold text-gray-800 mb-4">Livestock Details</h2>
            
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div class="flex flex-col">
                <label class="mb-2 font-medium text-gray-700">Livestock Type *</label>
                <Dropdown 
                  v-model="livestockForm.category" 
                  :options="livestockTypes" 
                  optionLabel="name" 
                  optionValue="value"
                  placeholder="Select Type" 
                  class="w-full"
                />
              </div>
  
              <div class="flex flex-col">
                <label class="mb-2 font-medium text-gray-700">Breed *</label>
                <InputText 
                  v-model="livestockForm.breed" 
                  placeholder="Enter Breed" 
                  class="w-full"
                />
              </div>
  
              <div class="flex flex-col">
                <label class="mb-2 font-medium text-gray-700">Title *</label>
                <InputText 
                  v-model="livestockForm.title" 
                  placeholder="Descriptive Title" 
                  class="w-full"
                />
              </div>
  
              <div class="flex flex-col">
                <label class="mb-2 font-medium text-gray-700">Age *</label>
                <InputNumber 
                  v-model="livestockForm.age" 
                  :min="0" 
                  placeholder="Age in months" 
                  class="w-full"
                />
              </div>
  
              <div class="flex flex-col">
                <label class="mb-2 font-medium text-gray-700">Gender *</label>
                <Dropdown 
                  v-model="livestockForm.gender" 
                  :options="genderOptions" 
                  optionLabel="name" 
                  optionValue="value"
                  placeholder="Select Gender" 
                  class="w-full"
                />
              </div>
  
              <div class="flex flex-col">
                <label class="mb-2 font-medium text-gray-700">Weight (kg) *</label>
                <InputNumber 
                  v-model="livestockForm.weight" 
                  :min="0" 
                  placeholder="Enter Weight" 
                  class="w-full"
                />
              </div>
            </div>
          </div>
  
          <!-- Pricing and Availability Step -->
          <div v-if="currentStep === 1" class="p-6 space-y-6">
            <h2 class="text-2xl font-bold text-gray-800 mb-4">Pricing & Availability</h2>
            
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div class="flex flex-col">
                <label class="mb-2 font-medium text-gray-700">Price *</label>
                <InputNumber 
                  v-model="livestockForm.price" 
                  mode="currency" 
                  currency="USD" 
                  placeholder="Enter Price"
                  class="w-full"
                />
              </div>
  
              <div class="flex flex-col">
                <label class="mb-2 font-medium text-gray-700">Negotiable?</label>
                <div class="flex items-center space-x-4">
                  <RadioButton 
                    v-model="livestockForm.negotiable" 
                    :value="true" 
                    inputId="negotiable-yes"
                  />
                  <label for="negotiable-yes" class="mr-4">Yes</label>
                  
                  <RadioButton 
                    v-model="livestockForm.negotiable" 
                    :value="false" 
                    inputId="negotiable-no"
                  />
                  <label for="negotiable-no">No</label>
                </div>
              </div>
  
              <div class="flex flex-col">
                <label class="mb-2 font-medium text-gray-700">Quantity *</label>
                <InputNumber 
                  v-model="livestockForm.quantity" 
                  :min="1"
                  class="w-full"
                />
              </div>
            </div>
  
            <div class="mt-4">
              <label class="mb-2 font-medium block text-gray-700">Description *</label>
              <Textarea 
                v-model="livestockForm.description" 
                :rows="4" 
                class="w-full"
                placeholder="Provide comprehensive details about the livestock..."
              />
            </div>
          </div>
  
          <!-- Location & Delivery Step -->
          <div v-if="currentStep === 2" class="p-6 space-y-6">
            <h2 class="text-2xl font-bold text-gray-800 mb-4">Location & Delivery</h2>
            
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div class="flex flex-col">
                <label class="mb-2 font-medium text-gray-700">Farm/Ranch Location *</label>
                <InputText 
                  v-model="livestockForm.location" 
                  placeholder="City, State" 
                  class="w-full"
                />
              </div>
  
              <div class="flex flex-col">
                <label class="mb-2 font-medium text-gray-700">Delivery Options</label>
                <MultiSelect 
                  v-model="livestockForm.deliveryOptions" 
                  :options="deliveryOptionsList" 
                  optionLabel="name" 
                  optionValue="value"
                  placeholder="Select Delivery Options" 
                  class="w-full"
                />
              </div>
  
              <div class="flex flex-col">
                <label class="mb-2 font-medium text-gray-700">Shipping Distance *</label>
                <InputNumber 
                  v-model="livestockForm.shippingDistance" 
                  :min="0" 
                  placeholder="Max km" 
                  class="w-full"
                />
              </div>
            </div>
          </div>
  
          <!-- Health & Certification Step -->
          <div v-if="currentStep === 3" class="p-6 space-y-6">
            <h2 class="text-2xl font-bold text-gray-800 mb-4">Health & Certification</h2>
            
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div class="flex flex-col">
                <label class="mb-2 font-medium text-gray-700">Health Certificates</label>
                <MultiSelect 
                  v-model="livestockForm.healthCertificates" 
                  :options="healthCertificatesList" 
                  optionLabel="name" 
                  optionValue="value"
                  placeholder="Select Certificates" 
                  class="w-full"
                />
              </div>
  
              <div class="flex flex-col">
                <label class="mb-2 font-medium text-gray-700">Vaccination Status</label>
                <Dropdown 
                  v-model="livestockForm.vaccinationStatus" 
                  :options="vaccinationStatusOptions" 
                  optionLabel="name" 
                  optionValue="value"
                  placeholder="Select Status" 
                  class="w-full"
                />
              </div>
  
              <div class="flex flex-col">
                <label class="mb-2 font-medium text-gray-700">Additional Health Notes</label>
                <Textarea 
                  v-model="livestockForm.healthNotes" 
                  :rows="3" 
                  class="w-full"
                  placeholder="Any additional health information..."
                />
              </div>
            </div>
          </div>
  
          <!-- Media Showcase Step -->
          <div v-if="currentStep === 4" class="p-6 space-y-6">
            <h2 class="text-2xl font-bold text-gray-800 mb-4">Media Showcase</h2>
            
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div class="flex flex-col">
                <label class="mb-2 font-medium text-gray-700">Main Image *</label>
                <FileUpload 
                  mode="basic" 
                  name="mainImage" 
                  url="/upload" 
                  accept="image/*" 
                  :maxFileSize="1000000"
                  @upload="onUpload" 
                  class="w-full"
                />
              </div>
  
              <div class="flex flex-col">
                <label class="mb-2 font-medium text-gray-700">Additional Images</label>
                <FileUpload 
                  mode="multiple" 
                  name="additionalImages" 
                  url="/upload" 
                  accept="image/*" 
                  :maxFileSize="1000000"
                  @upload="onUpload" 
                  class="w-full"
                />
              </div>
  
              <div class="flex flex-col">
                <label class="mb-2 font-medium text-gray-700">Video Showcase</label>
                <FileUpload 
                  mode="basic" 
                  name="videoShowcase" 
                  url="/upload" 
                  accept="video/*" 
                  :maxFileSize="10000000"
                  @upload="onUpload" 
                  class="w-full"
                />
              </div>
            </div>
          </div>
  
          <!-- Final Review Step -->
          <div v-if="currentStep === 5" class="p-6 space-y-6">
            <h2 class="text-2xl font-bold text-gray-800 mb-4">Final Review</h2>
            
            <Panel header="Livestock Details" class="mb-4">
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <p><strong>Type:</strong> {{ livestockForm.category }}</p>
                  <p><strong>Breed:</strong> {{ livestockForm.breed }}</p>
                  <p><strong>Title:</strong> {{ livestockForm.title }}</p>
                  <p><strong>Age:</strong> {{ livestockForm.age }} months</p>
                  <p><strong>Gender:</strong> {{ livestockForm.gender }}</p>
                  <p><strong>Weight:</strong> {{ livestockForm.weight }} kg</p>
                </div>
                <div>
                  <h3 class="text-lg font-semibold mb-2">Pricing & Availability</h3>
                  <p><strong>Price:</strong> ${{ livestockForm.price }}</p>
                  <p><strong>Negotiable:</strong> {{ livestockForm.negotiable ? 'Yes' : 'No' }}</p>
                  <p><strong>Quantity:</strong> {{ livestockForm.quantity }}</p>
                  <p><strong>Description:</strong> {{ livestockForm.description }}</p>
                </div>
              </div>
            </Panel>
  
            <Panel header="Location & Delivery" class="mb-4">
              <p><strong>Location:</strong> {{ livestockForm.location }}</p>
              <p><strong>Delivery Options:</strong> {{ livestockForm.deliveryOptions.join(', ') }}</p>
              <p><strong>Shipping Distance:</strong> {{ livestockForm.shippingDistance }} km</p>
            </Panel>
  
            <Panel header="Health & Certification">
              <p><strong>Health Certificates:</strong> {{ livestockForm.healthCertificates.join(', ') || 'None' }}</p>
              <p><strong>Vaccination Status:</strong> {{ livestockForm.vaccinationStatus }}</p>
              <p><strong>Health Notes:</strong> {{ livestockForm.healthNotes || 'No additional notes' }}</p>
            </Panel>
          </div>
        </template>
  
        <!-- Navigation Buttons -->
        <template #footer>
          <div class="flex justify-between p-4 bg-gray-100">
            <Button 
              v-if="currentStep > 0" 
              label="Previous" 
              icon="pi pi-arrow-left" 
              class="p-button-secondary" 
              @click="previousStep"
            />
            
            <Button 
              v-if="currentStep < 5" 
              label="Next" 
              icon-pos="right" 
              icon="pi pi-arrow-right" 
              class="p-button-primary ml-auto" 
              @click="nextStep"
            />
            
            <Button 
              v-if="currentStep === 5" 
              label="Publish Listing" 
              icon="pi pi-check" 
              class="p-button-success ml-auto" 
              @click="submitListing"
            />
          </div>
        </template>
      </Card>
  
      <Toast position="top-right" />
    </div>
  </template>
  
  <script>
  import Card from 'primevue/card';
  import Button from 'primevue/button';
  import Dropdown from 'primevue/dropdown';
  import InputText from 'primevue/inputtext';
  import InputNumber from 'primevue/inputnumber';
  import RadioButton from 'primevue/radiobutton';
  import Textarea from 'primevue/textarea';
  import MultiSelect from 'primevue/multiselect';
  import FileUpload from 'primevue/fileupload';
  import Panel from 'primevue/panel';
  import Badge from 'primevue/badge';
  import Toast from 'primevue/toast';
  
  export default {
    components: {
      Card,
      Button,
      Dropdown,
      InputText,
      InputNumber,
      RadioButton,
      Textarea,
      MultiSelect,
      FileUpload,
      Panel,
      Badge,
      Toast
    },
    data() {
      return {
        currentStep: 0,
        stepLabels: [
          'Livestock Details', 
          'Pricing & Availability', 
          'Location & Delivery', 
          'Health & Certification', 
          'Media Showcase', 
          'Final Review'
        ],
        livestockTypes: [
          { name: 'Beef Cattle', value: 'Beef Cattle' },
          { name: 'Dairy Cattle', value: 'Dairy Cattle' },
          { name: 'Sheep', value: 'Sheep' },
          { name: 'Goats', value: 'Goats' },
          { name: 'Pigs', value: 'Pigs' },
          { name: 'Horses', value: 'Horses' }
        ],
        genderOptions: [
          { name: 'Male', value: 'male' },
          { name: 'Female', value: 'female' },
          { name: 'Other', value: 'other' }
        ],
        deliveryOptionsList: [
          { name: 'Local Pickup', value: 'local_pickup' },
          { name: 'Truck Transport', value: 'truck_transport' },
          { name: 'Specialized Livestock Trailer', value: 'livestock_trailer' }
        ],
        healthCertificatesList: [
          { name: 'Health Certificate', value: 'health_cert' },
          { name: 'Veterinary Inspection', value: 'vet_inspection' },
          { name: 'Genetic Testing', value: 'genetic_testing' }
        ],
        vaccinationStatusOptions: [
          { name: 'Fully Vaccinated', value: 'fully_vaccinated' },
          { name: 'Partially Vaccinated', value: 'partially_vaccinated' },
          { name: 'Not Vaccinated', value: 'not_vaccinated' }
        ],
        livestockForm: {
          category: '',
          breed: '',
          title: '',
          age: null,
          gender: '',
          weight: null,
          price: null,
          negotiable: false,
          quantity: 1,
          description: '',
          location: '',
          deliveryOptions: [],
          shippingDistance: null,
          healthCertificates: [],
          vaccinationStatus: '',
          healthNotes: '',
          mainImage: null,
          additionalImages: [],
          videoShowcase: null
        }
      }
    },
    methods: {
      nextStep() {
        if (this.validateCurrentStep()) {
          if (this.currentStep < 5) {
            this.currentStep++;
          }
        }
      },
      previousStep() {
        if (this.currentStep > 0) {
          this.currentStep--;
        }
      },
      validateCurrentStep() {
        switch(this.currentStep) {
          case 0:
            return this.validateLivestockDetails();
          case 1:
            return this.validatePricingAvailability();
          case 2:
            return this.validateLocationDelivery();
          case 3:
            return this.validateHealthCertification();
          case 4:
            return this.validateMediaShowcase();
          default:
            return true;
        }
      },
      validateLivestockDetails() {
        const { category, breed, title, age, gender, weight } = this.livestockForm;
        if (!category || !breed || !title || !age || !gender || !weight) {
          this.$toast.add({
            severity: 'error', 
            summary: 'Validation Error', 
            detail: 'Please fill in all required livestock details.', 
            life: 3000
          });
          return false;
        }
        return true;
      },
      validatePricingAvailability() {
        const { price, quantity, description } = this.livestockForm;
        if (!price || !quantity || !description) {
          this.$toast.add({
            severity: 'error', 
            summary: 'Validation Error', 
            detail: 'Please complete pricing and description fields.', 
            life: 3000
          });
          return false;
        }
        return true;
      },
      validateLocationDelivery() {
        const { location, shippingDistance } = this.livestockForm;
        if (!location || !shippingDistance) {
          this.$toast.add({
            severity: 'error', 
            summary: 'Validation Error', 
            detail: 'Please provide location and shipping distance.', 
            life: 3000
          });
          return false;
        }
        return true;
      },
      validateHealthCertification() {
        // Add validation if needed
        return true;
      },
      validateMediaShowcase() {
        // Optionally validate media uploads
        return true;
      },
      onUpload(event) {
        // Handle file uploads
        this.$toast.add({
          severity: 'success', 
          summary: 'Upload Successful', 
          detail: 'File uploaded successfully.', 
          life: 3000
        });
      },
      submitListing() {
        const formData = new FormData();
        
        // Append form fields
        Object.keys(this.livestockForm).forEach(key => {
          formData.append(key, this.livestockForm[key]);
        });
  
        // TODO: Replace with actual API endpoint
        fetch('/api/livestock/listings', {
          method: 'POST',
          body: formData
        })
        .then(response => response.json())
        .then(data => {
          this.$toast.add({
            severity: 'success', 
            summary: 'Listing Published', 
            detail: 'Your livestock listing has been successfully published.', 
            life: 3000
          });
        })
        .catch(error => {
          this.$toast.add({
            severity: 'error', 
            summary: 'Submission Error', 
            detail: 'There was an error submitting your listing.', 
            life: 3000
          });
          console.error('Error submitting listing:', error);
        });
      }
    }
  }
  </script>
  
  <style scoped>
  .p-card {
    width: 100%;
    max-width: 64rem;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  }
  
  .p-card-content {
    padding: 0;
  }
  
  /* Additional styling for form elements */
  .p-dropdown, 
  .p-inputtext, 
  .p-inputnumber,
  .p-multiselect,
  .p-textarea {
    width: 100%;
  }
  
  /* Responsive adjustments */
  @media (max-width: 768px) {
    .grid-cols-3 {
      grid-template-columns: repeat(1, minmax(0, 1fr));
    }
  }
  </style>