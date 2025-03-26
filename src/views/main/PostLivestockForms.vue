<script>
export default {
  data() {
    return {
      // Listing Details
      title: '',
      description: '',
      category: '',
      breed: '',

      // Pricing
      price: null,
      negotiable: false,
      quantity: 1,

      // Physical Characteristics
      age: null,
      ageUnit: 'months',
      gender: '',
      weight: null,
      weightUnit: 'lbs',

      // Health Information
      healthStatus: '',
      feedingType: '',

      // Location & Delivery
      detailedLocation: '',
      deliveryOptions: [],
      deliveryRestrictions: '',
      maxDeliveryDistance: null,
      deliveryDistanceUnit: 'miles',

      // Additional Flags
      certified: false,
      auction: false,
      availableImmediate: false,

      // Media Upload
      imagePreviewUrls: [],
      videoPreview: null,
      maxImageUploadCount: 5,

      // Form State
      formReviewed: false,

      // Options for Dropdowns
      categoryOptions: [
        { label: 'Cattle', value: 'cattle' },
        { label: 'Sheep', value: 'sheep' },
        { label: 'Goats', value: 'goats' },
        { label: 'Pigs', value: 'pigs' },
        { label: 'Horses', value: 'horses' }
      ],
      availableBreeds: []
    }
  },

  watch: {
    category(newCategory) {
      // Dynamically update breeds based on selected category
      const breedMap = {
        cattle: [
          { label: 'Angus', value: 'angus' },
          { label: 'Hereford', value: 'hereford' },
          { label: 'Holstein', value: 'holstein' }
        ],
        sheep: [
          { label: 'Merino', value: 'merino' },
          { label: 'Suffolk', value: 'suffolk' }
        ],
        goats: [
          { label: 'Boer', value: 'boer' },
          { label: 'Alpine', value: 'alpine' }
        ],
        pigs: [
          { label: 'Berkshire', value: 'berkshire' },
          { label: 'Yorkshire', value: 'yorkshire' }
        ],
        horses: [
          { label: 'Quarter Horse', value: 'quarter-horse' },
          { label: 'Arabian', value: 'arabian' },
          { label: 'Thoroughbred', value: 'thoroughbred' }
        ]
      };

      // Reset breed when category changes
      this.breed = '';

      // Set available breeds for the selected category
      this.availableBreeds = breedMap[newCategory] || [];
    }
  },

  methods: {
    // Image Upload Handling
    handleMultiImageUpload(event) {
      const files = event.target.files;

      // Reset previous preview URLs
      this.imagePreviewUrls = [];

      // Limit to maximum upload count
      const filesToProcess = Array.from(files).slice(0, this.maxImageUploadCount);

      filesToProcess.forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.imagePreviewUrls.push(e.target.result);
        };
        reader.readAsDataURL(file);
      });
    },

    // Clear Images
    clearImages() {
      this.imagePreviewUrls = [];
      // Reset file input
      if (this.$refs.multiImageUpload) {
        this.$refs.multiImageUpload.value = '';
      }
    },

    // Video Upload Handling
    handleVideoUpload(event) {
      const file = event.target.files[0];

      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.videoPreview = e.target.result;
        };
        reader.readAsDataURL(file);
      }
    },

    // Clear Video
    clearVideo() {
      this.videoPreview = null;
      // Reset file input
      if (this.$refs.videoUpload) {
        this.$refs.videoUpload.value = '';
      }
    },

    // Proceed to Review Page
    proceedToReview() {
      // Validate form before proceeding
      if (this.validateForm()) {
        this.formReviewed = true;
      }
    },

    // Form Validation
    validateForm() {
      // Add custom validation logic here
      // You can check required fields, formats, etc.

      // Example basic validation
      const requiredFields = [
        'title', 'category', 'breed', 'price',
        'quantity', 'detailedLocation', 'description'
      ];

      for (let field of requiredFields) {
        if (!this[field]) {
          alert(`Please fill out the ${field.replace(/([A-Z])/g, ' $1').toLowerCase()} field.`);
          return false;
        }
      }

      return true;
    },

    // Submit Form
    submitForm() {
      // Validate form again before submission
      if (this.validateForm()) {
        // Collect all form data
        const formData = {
          title: this.title,
          category: this.category,
          breed: this.breed,
          price: this.price,
          negotiable: this.negotiable,
          quantity: this.quantity,
          age: this.age,
          ageUnit: this.ageUnit,
          gender: this.gender,
          weight: this.weight,
          weightUnit: this.weightUnit,
          healthStatus: this.healthStatus,
          feedingType: this.feedingType,
          detailedLocation: this.detailedLocation,
          deliveryOptions: this.deliveryOptions,
          deliveryRestrictions: this.deliveryRestrictions,
          maxDeliveryDistance: this.maxDeliveryDistance,
          deliveryDistanceUnit: this.deliveryDistanceUnit,
          certified: this.certified,
          auction: this.auction,
          availableImmediate: this.availableImmediate,
          description: this.description,
          images: this.imagePreviewUrls,
          video: this.videoPreview
        };

        // TODO: Replace with actual API call to submit listing
        console.log('Submitting Listing:', formData);
        alert('Listing submitted successfully!');

        // Optional: Reset form or redirect
        this.resetForm();
      }
    },

    // Reset Form
    resetForm() {
      // Reset all data properties to their initial state
      Object.keys(this.$data).forEach(key => {
        this.$data[key] = this.$options.data.call(this)[key];
      });
    }
  }
}
</script>

<template>
  <div
    class="min-h-screen bg-gradient-to-br from-emerald-100 to-emerald-900 flex items-center justify-center p-4 font-sans">
    <div
      class="w-full m-20 bg-white rounded-3xl shadow-2xl overflow-hidden">
      <!-- Form Container -->
      <div v-if="!formReviewed" class="p-10 lg:p-16">
        <div class="text-center mb-10">
          <h1 class="text-5xl font-extrabold text-emerald-700 mb-4 tracking-tight drop-shadow-md">
            Livestock Marketplace
          </h1>
          <p class="text-xl text-gray-600 max-w-3xl mx-auto">
            Create a comprehensive and compelling listing to showcase your premium livestock to discerning buyers.
            Provide detailed information to attract serious investors and farmers.
          </p>
        </div>

        <form @submit.prevent="proceedToReview" class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <!-- Listing Title Section -->
          <div class="md:col-span-2 bg-emerald-50 p-6 rounded-xl shadow-inner">
            <h2 class="text-2xl font-bold text-emerald-700 mb-4 border-b-2 border-emerald-200 pb-2 flex items-center">
              <span class="mr-3">🏷️</span> Listing Title
              <span class="ml-2 text-sm text-gray-500">(Make it descriptive and attention-grabbing)</span>
            </h2>
            <input v-model="title" placeholder="Premium Angus Cattle - High-Quality Breeding Stock"
              class="w-full border-2 border-emerald-200 rounded-lg px-4 py-3 text-lg focus:ring-2 focus:ring-emerald-400 transition"
              required maxlength="120" />
            <p class="text-sm text-gray-500 mt-2">{{ title.length }}/120 characters</p>
          </div>

          <!-- Livestock Details Section -->
          <div class="bg-emerald-50 p-6 rounded-xl shadow-inner">
            <h2 class="text-2xl font-bold text-emerald-700 mb-4 border-b-2 border-emerald-200 pb-2">
              🐄 Livestock Details
            </h2>
            <div class="space-y-4">
              <!-- Category Selection -->
              <div>
                <label class="block text-gray-700 font-semibold mb-2">
                  Livestock Category
                  <span class="text-red-500">*</span>
                </label>
                <div class="grid grid-cols-3 gap-2">
                  <button v-for="cat in categoryOptions" :key="cat.value" type="button" @click="category = cat.value"
                    :class="{
                      'bg-emerald-600 text-white': category === cat.value,
                      'bg-gray-200 text-gray-700 hover:bg-emerald-100': category !== cat.value
                    }"
                    class="px-3 py-2 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2">
                    <span>{{ cat.label }}</span>
                  </button>
                </div>
              </div>

              <!-- Breed Selection -->
              <div v-if="category">
                <label class="block text-gray-700 font-semibold mb-2">
                  Breed
                  <span class="text-red-500">*</span>
                </label>
                <div class="grid grid-cols-3 gap-2">
                  <button v-for="b in availableBreeds" :key="b.value" type="button" @click="breed = b.value" :class="{
                    'bg-emerald-600 text-white': breed === b.value,
                    'bg-gray-200 text-gray-700 hover:bg-emerald-100': breed !== b.value
                  }" class="px-3 py-2 rounded-lg transition-all duration-200">
                    {{ b.label }}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Pricing & Availability Section -->
          <div class="bg-emerald-50 p-6 rounded-xl shadow-inner">
            <h2 class="text-2xl font-bold text-emerald-700 mb-4 border-b-2 border-emerald-200 pb-2">
              💰 Pricing & Availability
            </h2>
            <div class="space-y-4">
              <!-- Price -->
              <div>
                <label class="block text-gray-700 font-semibold mb-2">
                  Price
                  <span class="text-red-500">*</span>
                </label>
                <div class="flex items-center space-x-3">
                  <div class="relative flex-grow">
                    <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">$</span>
                    <input v-model.number="price" type="number" placeholder="Enter price"
                      class="w-full border-2 border-emerald-200 rounded-lg px-4 py-3 pl-7 focus:ring-2 focus:ring-emerald-400 transition"
                      min="0" required />
                  </div>
                  <label class="flex items-center space-x-2">
                    <input v-model="negotiable" type="checkbox"
                      class="h-5 w-5 text-emerald-600 rounded focus:ring-emerald-500" />
                    <span>Negotiable</span>
                  </label>
                </div>
              </div>

              <!-- Quantity -->
              <div>
                <label class="block text-gray-700 font-semibold mb-2">
                  Quantity
                  <span class="text-red-500">*</span>
                </label>
                <input v-model.number="quantity" type="number" placeholder="Number of animals"
                  class="w-full border-2 border-emerald-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-emerald-400 transition"
                  min="1" required />
              </div>
            </div>
          </div>

          <!-- Physical Characteristics Section -->
          <div class="bg-emerald-50 p-6 rounded-xl shadow-inner">
            <h2 class="text-2xl font-bold text-emerald-700 mb-4 border-b-2 border-emerald-200 pb-2">
              📏 Physical Characteristics
            </h2>
            <div class="space-y-4">
              <!-- Age -->
              <div>
                <label class="block text-gray-700 font-semibold mb-2">
                  Age
                </label>
                <div class="flex space-x-2">
                  <input v-model.number="age" type="number" placeholder="Enter age"
                    class="w-full border-2 border-emerald-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-emerald-400 transition"
                    min="0" />
                  <select v-model="ageUnit"
                    class="w-1/3 border-2 border-emerald-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-emerald-400 transition">
                    <option value="months">Months</option>
                    <option value="years">Years</option>
                  </select>
                </div>
              </div>

              <!-- Gender & Weight -->
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-gray-700 font-semibold mb-2">
                    Gender
                  </label>
                  <select v-model="gender"
                    class="w-full border-2 border-emerald-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-emerald-400 transition">
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>
                <div>
                  <label class="block text-gray-700 font-semibold mb-2">
                    Weight
                  </label>
                  <div class="flex space-x-2">
                    <input v-model.number="weight" type="number" placeholder="Enter weight"
                      class="w-full border-2 border-emerald-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-emerald-400 transition"
                      min="0" />
                    <select v-model="weightUnit"
                      class="w-1/3 border-2 border-emerald-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-emerald-400 transition">
                      <option value="lbs">lbs</option>
                      <option value="kg">kg</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Health & Additional Information Section -->
          <div class="bg-emerald-50 p-6 rounded-xl shadow-inner">
            <h2 class="text-2xl font-bold text-emerald-700 mb-4 border-b-2 border-emerald-200 pb-2">
              🩺 Health & Additional Information
            </h2>
            <div class="space-y-4">
              <!-- Health Status -->
              <div>
                <label class="block text-gray-700 font-semibold mb-2">
                  Health Status
                </label>
                <select v-model="healthStatus"
                  class="w-full border-2 border-emerald-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-emerald-400 transition">
                  <option value="">Select Health Status</option>
                  <option value="excellent">Excellent</option>
                  <option value="good">Good</option>
                  <option value="fair">Fair</option>
                </select>
              </div>

              <!-- Feeding Type -->
              <div>
                <label class="block text-gray-700 font-semibold mb-2">
                  Feeding Type
                </label>
                <input v-model="feedingType" placeholder="E.g., Grass-fed, Grain-fed"
                  class="w-full border-2 border-emerald-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-emerald-400 transition" />
              </div>
            </div>
          </div>

          <!-- Location & Delivery Section -->
          <div class="md:col-span-2 bg-emerald-50 p-6 rounded-xl shadow-inner mt-8">
            <h2 class="text-2xl font-bold text-emerald-700 mb-4 border-b-2 border-emerald-200 pb-2">
              🚚 Location & Delivery
            </h2>
            <div class="grid md:grid-cols-2 gap-6">
              <!-- Detailed Location -->
              <div>
                <label class="block text-gray-700 font-semibold mb-2">
                  Detailed Location
                  <span class="text-red-500">*</span>
                </label>
                <input v-model="detailedLocation" placeholder="Farm/Ranch Address"
                  class="w-full border-2 border-emerald-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-emerald-400 transition"
                  required />
              </div>

              <!-- Delivery Options -->
              <div>
                <label class="block text-gray-700 font-semibold mb-2">
                  Delivery Options
                </label>
                <div class="space-y-2">
                  <label class="flex items-center space-x-2">
                    <input v-model="deliveryOptions" type="checkbox" value="on-site-pickup"
                      class="h-4 w-4 text-emerald-600 rounded focus:ring-emerald-500" />
                    <span>On-site Pickup</span>
                  </label>
                  <label class="flex items-center space-x-2">
                    <input v-model="deliveryOptions" type="checkbox" value="local-delivery"
                      class="h-4 w-4 text-emerald-600 rounded focus:ring-emerald-500" />
                    <span>Local Delivery</span>
                  </label>
                  <label class="flex items-center space-x-2">
                    <input v-model="deliveryOptions" type="checkbox" value="transportation-services"
                      class="h-4 w-4 text-emerald-600 rounded focus:ring-emerald-500" />
                    <span>Transportation Services</span>
                  </label>
                </div>
              </div>

              <!-- Delivery Restrictions -->
              <div>
                <label class="block text-gray-700 font-semibold mb-2">
                  Delivery Restrictions
                </label>
                <textarea v-model="deliveryRestrictions"
                  placeholder="Describe any specific delivery limitations, conditions, or requirements"
                  class="w-full border-2 border-emerald-200 rounded-lg px-4 py-3 h-24 focus:ring-2 focus:ring-emerald-400 transition"></textarea>
              </div>

              <!-- Delivery Range -->
              <div>
                <label class="block text-gray-700 font-semibold mb-2">
                  Maximum Delivery Distance
                </label>
                <div class="flex space-x-2">
                  <input v-model.number="maxDeliveryDistance" type="number" placeholder="Distance"
                    class="w-full border-2 border-emerald-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-emerald-400 transition"
                    min="0" />
                  <select v-model="deliveryDistanceUnit"
                    class="w-1/3 border-2 border-emerald-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-emerald-400 transition">
                    <option value="miles">Miles</option>
                    <option value="kilometers">Kilometers</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <!-- Detailed Description -->
          <div class="md:col-span-2 bg-emerald-50 p-6 rounded-xl shadow-inner">
            <h2 class="text-2xl font-bold text-emerald-700 mb-4 border-b-2 border-emerald-200 pb-2">
              📝 Detailed Description
            </h2>
            <textarea v-model="description"
              placeholder="Provide comprehensive details about your livestock. Include age, health, special characteristics, and any unique selling points."
              class="w-full border-2 border-emerald-200 rounded-lg px-4 py-3 h-40 focus:ring-2 focus:ring-emerald-400 transition"
              required></textarea>
          </div>

          <!-- Media Upload Section -->
          <div class="md:col-span-2 bg-emerald-50 p-6 rounded-xl shadow-inner">
            <h2 class="text-2xl font-bold text-emerald-700 mb-4 border-b-2 border-emerald-200 pb-2">
              📸 Media Upload
            </h2>
            <div class="grid md:grid-cols-2 gap-6">
              <!-- Multiple Image Upload -->
              <div>
                <label class="block text-gray-700 font-semibold mb-2">
                  Upload Images (Up to 5)
                </label>
                <div @click="$refs.multiImageUpload.click()"
                  class="w-full h-64 border-2 border-dashed border-emerald-300 flex items-center justify-center cursor-pointer hover:bg-emerald-50 transition">
                  <input type="file" ref="multiImageUpload" @change="handleMultiImageUpload" accept="image/*" multiple
                    class="hidden" />
                  <div v-if="imagePreviewUrls.length === 0" class="text-center text-gray-500">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto mb-2" fill="none"
                      viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Click to Upload Multiple Images
                  </div>
                  <div v-else class="grid grid-cols-3 gap-2 p-2">
                    <img v-for="(url, index) in imagePreviewUrls" :key="index" :src="url"
                      class="w-full h-20 object-cover rounded" />
                  </div>
                </div>
                <button v-if="imagePreviewUrls.length > 0" type="button" @click="clearImages"
                  class="mt-2 text-red-500 hover:text-red-700">
                  Clear All Images
                </button>
              </div>

              <!-- Video Upload -->
              <div>
                <label class="block text-gray-700 font-semibold mb-2">
                  Upload Video
                </label>
                <div class="flex items-center space-x-4">
                  <input type="file" ref="videoUpload" @change="handleVideoUpload" accept="video/*" class="hidden" />
                  <div @click="$refs.videoUpload.click()"
                    class="w-full h-48 border-2 border-dashed border-emerald-300 flex items-center justify-center cursor-pointer hover:bg-emerald-50 transition">
                    <video v-if="videoPreview" :src="videoPreview" class="w-full h-full object-cover" controls></video>
                    <div v-else class="text-center text-gray-500">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto mb-2" fill="none"
                        viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      Click to Upload Video
                    </div>
                  </div>
                  <button type="button" @click="clearVideo" v-if="videoPreview" class="text-red-500 hover:text-red-700">
                    Clear
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Additional Flags Section -->
          <div class="md:col-span-2 bg-emerald-50 p-6 rounded-xl shadow-inner">
            <h2 class="text-2xl font-bold text-emerald-700 mb-4 border-b-2 border-emerald-200 pb-2">
              🚩 Additional Flags
            </h2>
            <div class="flex space-x-6">
              <label class="flex items-center space-x-2">
                <input v-model="certified" type="checkbox"
                  class="h-5 w-5 text-emerald-600 rounded focus:ring-emerald-500" />
                <span>Certified</span>
              </label>
              <label class="flex items-center space-x-2">
                <input v-model="auction" type="checkbox"
                  class="h-5 w-5 text-emerald-600 rounded focus:ring-emerald-500" />
                <span>Auction</span>
              </label>
              <label class="flex items-center space-x-2">
                <input v-model="availableImmediate" type="checkbox"
                  class="h-5 w-5 text-emerald-600 rounded focus:ring-emerald-500" />
                <span>Available Immediately</span>
              </label>
            </div>
          </div>

          <!-- Submit Button -->
          <div class="md:col-span-2 flex justify-end mt-6">
            <button type="submit"
              class="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2">
              Review Listing
            </button>
          </div>
        </form>
      </div>

      <!-- Review Page -->
      <div v-else class="p-8 lg:p-12">
        <div class="text-center mb-8">
          <h2 class="text-3xl font-bold text-emerald-700 mb-3">
            Review Your Listing
          </h2>
          <p class="text-gray-600">
            Please review the details of your livestock listing
          </p>
        </div>

        <div class="bg-gray-50 p-6 rounded-lg space-y-6">
          <div class="grid md:grid-cols-2 gap-6">
            <div>
              <h3 class="text-xl font-semibold text-emerald-700 mb-3">Listing Details</h3>
              <p><strong>Title:</strong> {{ title }}</p>
              <p><strong>Category:</strong> {{ category }}</p>
              <p><strong>Breed:</strong> {{ breed }}</p>
            </div>
            <div>
              <h3 class="text-xl font-semibold text-emerald-700 mb-3">Pricing</h3>
              <p><strong>Price:</strong> ${{ price }} {{ negotiable ? '(Negotiable)' : '' }}</p>
              <p><strong>Quantity:</strong> {{ quantity }}</p>
              <p><strong>Location:</strong> {{ detailedLocation }}</p>
            </div>
          </div>

          <div class="grid md:grid-cols-2 gap-6">
            <div>
              <h3 class="text-xl font-semibold text-emerald-700 mb-3">Physical Characteristics</h3>
              <p><strong>Age:</strong> {{ age }} {{ ageUnit }}</p>
              <p><strong>Gender:</strong> {{ gender }}</p>
              <p><strong>Weight:</strong> {{ weight }} {{ weightUnit }}</p>
            </div>
            <div>
              <h3 class="text-xl font-semibold text-emerald-700 mb-3">Health Information</h3>
              <p><strong>Health Status:</strong> {{ healthStatus }}</p>
              <p><strong>Feeding Type:</strong> {{ feedingType }}</p>
            </div>
          </div>

          <div class="grid md:grid-cols-2 gap-6">
            <div>
              <h3 class="text-xl font-semibold text-emerald-700 mb-3">Location & Delivery</h3>
              <p><strong>Detailed Location:</strong> {{ detailedLocation }}</p>
              <p><strong>Delivery Options:</strong> {{ deliveryOptions.join(', ') }}</p>
              <p><strong>Max Delivery Distance:</strong> {{ maxDeliveryDistance }} {{ deliveryDistanceUnit }}</p>
            </div>
            <div>
              <h3 class="text-xl font-semibold text-emerald-700 mb-3">Additional Details</h3>
              <p><strong>Certified:</strong> {{ certified ? 'Yes' : 'No' }}</p>
              <p><strong>Auction:</strong> {{ auction ? 'Yes' : 'No' }}</p>
              <p><strong>Available Immediately:</strong> {{ availableImmediate ? 'Yes' : 'No' }}</p>
            </div>
          </div>

          <div>
            <h3 class="text-xl font-semibold text-emerald-700 mb-3">Detailed Description</h3>
            <p>{{ description }}</p>
          </div>

          <div class="grid md:grid-cols-2 gap-6">
            <div>
              <h3 class="text-xl font-semibold text-emerald-700 mb-3">Image Preview</h3>
              <div v-if="imagePreviewUrls.length" class="grid grid-cols-3 gap-2">
                <img v-for="(url, index) in imagePreviewUrls" :key="index" :src="url"
                  class="w-full h-20 object-cover rounded" />
              </div>
              <p v-else>No images uploaded</p>
            </div>
            <div>
              <h3 class="text-xl font-semibold text-emerald-700 mb-3">Video Preview</h3>
              <video v-if="videoPreview" :src="videoPreview" class="w-full h-64 object-cover rounded-lg"
                controls></video>
              <p v-else>No video uploaded</p>
            </div>
          </div>

          <div class="flex justify-between mt-8">
            <button @click="formReviewed = false"
              class="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-3 rounded-lg transition">
              Edit Listing
            </button>
            <button @click="submitForm"
              class="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-lg transition">
              Confirm and Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
