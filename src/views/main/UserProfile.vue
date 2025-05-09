<script setup lang="ts">
  import { ref, computed, onMounted } from 'vue';
  import { useRouter } from 'vue-router';

  interface User {
    id: string;
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    phoneNumber: string;
    gender: 'male' | 'female' | 'other' | '';
    farmName?: string;
    farmSize?: number;
    farmLocation?: string;
    livestockCount?: number;
    livestockTypes?: string[];
    accountType: 'buyer' | 'farmer';
    profilePicture?: string;
    bannerImage?: string;
    joinDate: Date;
    lastLogin: Date;
  }

  const router = useRouter();
  const currentUser = ref<User>({
    id: '1',
    firstName: 'John',
    lastName: 'Doe',
    username: 'johndoe23',
    email: 'johndoe@example.com',
    phoneNumber: '555-123-4567',
    gender: 'male',
    accountType: 'buyer',
    joinDate: new Date('2024-01-01'),
    lastLogin: new Date(),
  });

  const isEditing = ref(false);
  const editableUser = ref<User>({ ...currentUser.value });
  const activeTab = ref('personal');

  // Sample livestock types for selection
  const availableLivestockTypes = ref([
    'Cattle', 'Sheep', 'Goats', 'Pigs', 'Chickens', 'Horses', 'Ducks', 'Rabbits'
  ]);

  const selectedLivestockType = ref('');

  const isFarmerAccount = computed(() => {
    return currentUser.value.accountType === 'farmer';
  });

  const fullName = computed(() => {
    return `${currentUser.value.firstName} ${currentUser.value.lastName}`;
  });

  const formattedJoinDate = computed(() => {
    return new Date(currentUser.value.joinDate).toLocaleDateString();
  });

  const formattedLastLogin = computed(() => {
    const date = new Date(currentUser.value.lastLogin);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  });

  const startEditing = () => {
    editableUser.value = JSON.parse(JSON.stringify(currentUser.value));
    isEditing.value = true;
  };

  const cancelEditing = () => {
    isEditing.value = false;
  };

  const saveProfile = () => {
    currentUser.value = { ...editableUser.value };
    isEditing.value = false;
    // Here you would typically make an API call to update the user profile
    showNotification('Profile updated successfully!');
  };

  const upgradeToFarmer = () => {
    // Redirect to the farmer upgrade page
    router.push('/FarmerUpgradeAccount');
  };
  
  const navigateBack = () => {
    router.back();
  };

  const addLivestockType = () => {
    if (selectedLivestockType.value && !editableUser.value.livestockTypes?.includes(selectedLivestockType.value)) {
      if (!editableUser.value.livestockTypes) {
        editableUser.value.livestockTypes = [];
      }
      editableUser.value.livestockTypes.push(selectedLivestockType.value);
      selectedLivestockType.value = '';
    }
  };

  const removeLivestockType = (type: string) => {
    if (editableUser.value.livestockTypes) {
      editableUser.value.livestockTypes = editableUser.value.livestockTypes.filter(t => t !== type);
    }
  };

  // Notification handling
  const notification = ref({ show: false, message: '' });

  const showNotification = (message: string) => {
    notification.value = { show: true, message };
    setTimeout(() => {
      notification.value.show = false;
    }, 3000);
  };

  // Mock function for profile picture upload
  const uploadProfilePicture = (event: Event) => {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target && typeof e.target.result === 'string') {
          editableUser.value.profilePicture = e.target.result;
        }
      };
      reader.readAsDataURL(input.files[0]);
    }
  };
  
  // Mock function for banner image upload
  const uploadBannerImage = (event: Event) => {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target && typeof e.target.result === 'string') {
          editableUser.value.bannerImage = e.target.result;
        }
      };
      reader.readAsDataURL(input.files[0]);
    }
  };

  onMounted(() => {
    // Here you would typically fetch the user data from an API
    console.log('Component mounted, user data would be fetched here');
  });
  </script>

  <template>
    <div class="min-h-screen bg-gradient-to-b from-green-50 to-white py-8">
      <!-- Notification -->
      <div 
        v-if="notification.show" 
        class="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transition-all duration-300 ease-in-out transform translate-y-0 opacity-100"
      >
        <div class="flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 0116 0zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
          </svg>
          {{ notification.message }}
        </div>
      </div>

      <div class="max-w-6xl mx-auto px-4">
        <div class="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          <!-- Back button -->
          <div class="absolute top-4 left-4 z-10">
            <button 
              @click="navigateBack" 
              class="bg-white/80 hover:bg-white text-gray-700 p-2 rounded-lg shadow-md transition duration-200 flex items-center gap-1"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clip-rule="evenodd" />
              </svg>
              <span>Back</span>
            </button>
          </div>
          
          <!-- Header with background image -->
          <div class="relative bg-gradient-to-r from-green-700 to-emerald-600 h-48">
            <!-- Farm theme background pattern or uploaded banner image -->
            <div 
              class="absolute inset-0 bg-cover bg-center" 
              :style="editableUser.bannerImage ? `background-image: url('${editableUser.bannerImage}')` : 'background-image: url(\'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMTAiIGN5PSIxMCIgcj0iMiIgZmlsbD0id2hpdGUiLz48L3N2Zz4=\'); background-repeat: repeat; opacity: 0.2;'"
            ></div>
            
            <!-- Banner upload button -->
            <label v-if="isEditing" for="bannerImageInput" class="absolute top-4 right-4 bg-white/80 text-green-700 p-2 rounded-full cursor-pointer shadow-md hover:bg-white transition duration-200">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <input 
                id="bannerImageInput" 
                type="file" 
                accept="image/*" 
                class="hidden" 
                @change="uploadBannerImage"
              />
            </label>
            
            <div class="absolute bottom-0 left-0 w-full p-6 flex justify-end items-end">
              <div>
                <span v-if="isFarmerAccount" class="bg-yellow-400 text-gray-800 px-4 py-1 rounded-full font-semibold flex items-center shadow-md">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zm7-10a1 1 0 01.707.293l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 8l-3.293-3.293A1 1 0 0112 2z" clip-rule="evenodd" />
                  </svg>
                  Farmer Account
                </span>
                <span v-else class="bg-blue-100 text-blue-700 px-4 py-1 rounded-full font-medium flex items-center shadow">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z" clip-rule="evenodd" />
                  </svg>
                  Buyer Account
                </span>
              </div>
            </div>
          </div>
          
          <div class="p-6">
            <div class="flex flex-col md:flex-row gap-8">
              
              <!-- Profile Picture and Basic Info -->
              <div class="w-full md:w-1/3">
                <div class="flex flex-col items-center relative -mt-20">
                  <div class="relative mb-4">
                    <div class="w-36 h-36 rounded-full bg-white shadow-lg p-1">
                      <img 
                        :src="editableUser.profilePicture || 'https://via.placeholder.com/150'" 
                        alt="Profile Picture"
                        class="w-full h-full rounded-full object-cover border-4 border-white"
                      />
                    </div>
                    <label v-if="isEditing" for="profilePictureInput" class="absolute bottom-0 right-0 bg-green-500 text-white p-2 rounded-full cursor-pointer shadow-md hover:bg-green-600 transition duration-200">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <input 
                        id="profilePictureInput" 
                        type="file" 
                        accept="image/*" 
                        class="hidden" 
                        @change="uploadProfilePicture"
                      />
                    </label>
                  </div>
                  
                  <h2 class="text-2xl font-semibold mb-1">{{ fullName }}</h2>
                  <p class="text-gray-600 mb-1">@{{ currentUser.username }}</p>
                  <div class="flex items-center text-gray-600 mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                    <span>{{ currentUser.email }}</span>
                  </div>
                  
                  <div class="w-full bg-gray-50 rounded-xl p-4 mb-6 border border-gray-100 shadow-sm">
                    <div class="flex items-center justify-between mb-3">
                      <span class="text-gray-600 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                          <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd" />
                        </svg>
                        Join Date:
                      </span>
                      <span class="font-medium">{{ formattedJoinDate }}</span>
                    </div>
                    <div class="flex items-center justify-between">
                      <span class="text-gray-600 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd" />
                        </svg>
                        Last Login:
                      </span>
                      <span class="font-medium">{{ formattedLastLogin }}</span>
                    </div>
                  </div>
                  
                  <div v-if="!isFarmerAccount && !isEditing" class="w-full">
                    <button 
                      @click="upgradeToFarmer" 
                      class="w-full bg-gradient-to-r from-amber-400 to-amber-600 text-white py-3 px-6 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zm7-10a1 1 0 01.707.293l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 8l-3.293-3.293A1 1 0 0112 2z" clip-rule="evenodd" />
                      </svg>
                      Upgrade to Farmer
                    </button>
                    <div class="mt-3 text-sm text-gray-600 text-center bg-yellow-50 p-3 rounded-lg border border-yellow-100">
                      <div class="flex items-center justify-center mb-1">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-yellow-500 mr-1" viewBox="0 0 20 20" fill="currentColor">
                          <path fill-rule="evenodd" d="M5 2a2 2 0 012-2h6a2 2 0 012 2v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V5a2 2 0 012-2h2V2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H7V1zm1 5a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1zm0 2a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" clip-rule="evenodd" />
                          <path d="M4.214 9.658c.068-.456.154-.909.261-1.355A21.124 21.124 0 0110 10c2.168 0 4.238-.325 6.107-.916.397.389.722.85.95 1.359A22.908 22.908 0 0110 12a22.908 22.908 0 01-7.022-1.095c.24-.542.557-1.003.95-1.355.173.1.35.195.533.286z" />
                        </svg>
                        <span class="font-medium text-gray-700">Farmer Benefits:</span>
                      </div>
                      <ul class="text-left pl-5 list-disc text-gray-600">
                        <li>Farm profile management</li>
                        <li>Livestock tracking tools</li>
                        <li>Market analytics</li>
                        <li>Community support</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- Profile Details -->
              <div class="w-full md:w-2/3">
                <div class="bg-white rounded-lg">
                  <div class="flex justify-between mb-6">
                    <h3 class="text-xl font-semibold flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
                      </svg>
                      Profile Information
                    </h3>
                    <div>
                      <button 
                        v-if="!isEditing" 
                        @click="startEditing" 
                        class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition duration-200 shadow-sm"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Edit Profile
                      </button>
                      <div v-else class="flex gap-2">
                        <button 
                          @click="saveProfile" 
                          class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition duration-200 shadow-sm"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                          </svg>
                          Save
                        </button>
                        <button 
                          @click="cancelEditing" 
                          class="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg flex items-center gap-2 transition duration-200"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <!-- Tab Navigation -->
                  <div class="border-b border-gray-200 mb-6">
                    <nav class="flex space-x-4">
                      <button
                        @click="activeTab = 'personal'"
                        :class="[
                          'px-3 py-2 font-medium text-sm rounded-t-lg',
                          activeTab === 'personal' 
                            ? 'bg-white text-green-700 border-b-2 border-green-600' 
                            : 'text-gray-500 hover:text-gray-700'
                        ]"
                        class="flex items-center"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                          <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
                        </svg>
                        Personal Information
                      </button>
                      <button
                        @click="activeTab = 'farm'"
                        :class="[
                          'px-3 py-2 font-medium text-sm rounded-t-lg',
                          activeTab === 'farm' 
                            ? 'bg-white text-green-700 border-b-2 border-green-600' 
                            : 'text-gray-500 hover:text-gray-700'
                        ]"
                        class="flex items-center"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                        </svg>
                        Farm Information
                      </button>
                      <button
                        @click="activeTab = 'security'"
                        :class="[
                          'px-3 py-2 font-medium text-sm rounded-t-lg',
                          activeTab === 'security' 
                            ? 'bg-white text-green-700 border-b-2 border-green-600' 
                            : 'text-gray-500 hover:text-gray-700'
                        ]"
                        class="flex items-center"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                          <path fill-rule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clip-rule="evenodd" />
                        </svg>
                        Security
                      </button>
                    </nav>
                  </div>
                  
                  <!-- Personal Information Tab -->
                  <div v-if="activeTab === 'personal'" class="space-y-6">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                        <input 
                          v-if="isEditing" 
                          v-model="editableUser.firstName" 
                          type="text" 
                          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500" 
                        />
                        <p v-else class="text-gray-800 bg-gray-50 px-4 py-2 rounded-lg border border-gray-100">{{ currentUser.firstName }}</p>
                      </div>
                      
                      <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                        <input 
                          v-if="isEditing" 
                          v-model="editableUser.lastName" 
                          type="text" 
                          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500" 
                        />
                        <p v-else class="text-gray-800 bg-gray-50 px-4 py-2 rounded-lg border border-gray-100">{{ currentUser.lastName }}</p>
                      </div>
                      
                      <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Username</label>
                        <input 
                          v-if="isEditing" 
                          v-model="editableUser.username" 
                          type="text" 
                          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500" 
                        />
                        <p v-else class="text-gray-800 bg-gray-50 px-4 py-2 rounded-lg border border-gray-100">{{ currentUser.username }}</p>
                      </div>
                      
                      <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input 
                          v-if="isEditing" 
                          v-model="editableUser.email" 
                          type="email" 
                          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500" 
                        />
                        <p v-else class="text-gray-800 bg-gray-50 px-4 py-2 rounded-lg border border-gray-100">{{ currentUser.email }}</p>
                      </div>
                      
                      <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                        <input 
                          v-if="isEditing" 
                          v-model="editableUser.phoneNumber" 
                          type="tel" 
                          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500" 
                        />
                        <p v-else class="text-gray-800 bg-gray-50 px-4 py-2 rounded-lg border border-gray-100">{{ currentUser.phoneNumber }}</p>
                      </div>
                      
                      <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                        <select 
                          v-if="isEditing" 
                          v-model="editableUser.gender" 
                          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        >
                          <option value="">Select Gender</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Other</option>
                        </select>
                        <p v-else class="text-gray-800 bg-gray-50 px-4 py-2 rounded-lg border border-gray-100">
                          {{ currentUser.gender ? currentUser.gender.charAt(0).toUpperCase() + currentUser.gender.slice(1) : 'Not specified' }}
                        </p>
                      </div>
                    </div>
                    
                    <div v-if="isEditing" class="bg-gray-50 p-4 rounded-lg border border-gray-200 mt-6">
                      <h4 class="text-sm font-medium text-gray-700 mb-2 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                          <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
                        </svg>
                        We Value Your Privacy
                      </h4>
                      <p class="text-sm text-gray-600">
                        Your personal information is protected and will only be used to provide you with a better experience on our platform. We never share your details with third parties without your consent.
                      </p>
                    </div>
                  </div>
                  
                  <!-- Farm Information Tab -->
                  <div v-if="activeTab === 'farm'" class="space-y-6">
                    <div v-if="!isFarmerAccount && !isEditing" class="bg-gray-50 p-6 rounded-lg border border-gray-200 text-center">
                      <div class="flex justify-center mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                      </div>
                      <h3 class="text-lg font-medium text-gray-900 mb-2">Farm Information Not Available</h3>
                      <p class="text-gray-600 mb-4">
                        You currently have a buyer account. To access farm management features, please upgrade to a farmer account.
                      </p>
                      <button 
                        @click="upgradeToFarmer" 
                        class="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition duration-200 inline-flex items-center"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clip-rule="evenodd" />
                        </svg>
                        Upgrade to Farmer
                      </button>
                    </div>
                    
                    <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Farm Name</label>
                        <input 
                          v-if="isEditing" 
                          v-model="editableUser.farmName" 
                          type="text" 
                          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500" 
                          placeholder="Enter your farm name"
                        />
                        <p v-else class="text-gray-800 bg-gray-50 px-4 py-2 rounded-lg border border-gray-100">
                          {{ currentUser.farmName || 'Not specified' }}
                        </p>
                      </div>
                      
                      <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Farm Location</label>
                        <input 
                          v-if="isEditing" 
                          v-model="editableUser.farmLocation" 
                          type="text" 
                          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500" 
                          placeholder="Enter your farm location"
                        />
                        <p v-else class="text-gray-800 bg-gray-50 px-4 py-2 rounded-lg border border-gray-100">
                          {{ currentUser.farmLocation || 'Not specified' }}
                        </p>
                      </div>
                      
                      <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Farm Size (acres)</label>
                        <input 
                          v-if="isEditing" 
                          v-model="editableUser.farmSize" 
                          type="number" 
                          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500" 
                          placeholder="Enter farm size in acres"
                          min="0"
                        />
                        <p v-else class="text-gray-800 bg-gray-50 px-4 py-2 rounded-lg border border-gray-100">
                          {{ currentUser.farmSize ? `${currentUser.farmSize} acres` : 'Not specified' }}
                        </p>
                      </div>
                      
                      <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Livestock Count</label>
                        <input 
                          v-if="isEditing" 
                          v-model="editableUser.livestockCount" 
                          type="number" 
                          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500" 
                          placeholder="Enter total livestock count"
                          min="0"
                        />
                        <p v-else class="text-gray-800 bg-gray-50 px-4 py-2 rounded-lg border border-gray-100">
                          {{ currentUser.livestockCount !== undefined ? currentUser.livestockCount : 'Not specified' }}
                        </p>
                      </div>
                      
                      <div class="md:col-span-2">
                        <label class="block text-sm font-medium text-gray-700 mb-1">Livestock Types</label>
                        <div v-if="isEditing" class="space-y-3">
                          <div class="flex gap-2">
                            <select 
                              v-model="selectedLivestockType" 
                              class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                            >
                              <option value="">Select livestock type</option>
                              <option v-for="type in availableLivestockTypes" :key="type" :value="type">{{ type }}</option>
                            </select>
                            <button 
                              @click="addLivestockType" 
                              class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
                              :disabled="!selectedLivestockType"
                            >
                              Add
                            </button>
                          </div>
                          <div v-if="editableUser.livestockTypes && editableUser.livestockTypes.length > 0" class="flex flex-wrap gap-2">
                            <div 
                              v-for="type in editableUser.livestockTypes" 
                              :key="type" 
                              class="bg-green-100 text-green-800 px-3 py-1 rounded-full flex items-center gap-1"
                            >
                              {{ type }}
                              <button 
                                @click="removeLivestockType(type)" 
                                class="text-green-600 hover:text-green-800"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </button>
                            </div>
                          </div>
                          <p v-else class="text-gray-500 italic">No livestock types added yet</p>
                        </div>
                        
                        <div v-else>
                          <div v-if="currentUser.livestockTypes && currentUser.livestockTypes.length > 0" class="flex flex-wrap gap-2">
                            <span 
                              v-for="type in currentUser.livestockTypes" 
                              :key="type" 
                              class="bg-green-100 text-green-800 px-3 py-1 rounded-full"
                            >
                              {{ type }}
                            </span>
                          </div>
                          <p v-else class="text-gray-800 bg-gray-50 px-4 py-2 rounded-lg border border-gray-100">
                            Not specified
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div v-if="isFarmerAccount && !isEditing" class="bg-green-50 p-4 rounded-lg border border-green-100 mt-6">
                      <h4 class="text-sm font-medium text-gray-700 mb-2 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                          <path fill-rule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                        </svg>
                        Farm Management Tools
                      </h4>
                      <p class="text-sm text-gray-600">
                        Access additional farm management tools, analytics, and resources in the Farm Management Dashboard. Track your livestock, monitor market trends, and connect with other farmers in the community.
                      </p>
                      <button class="mt-2 bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded-lg text-sm font-medium transition duration-200 inline-flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                        </svg>
                        Farm Dashboard
                      </button>
                    </div>
                  </div>
                  
                  <!-- Security Tab -->
                  <div v-if="activeTab === 'security'" class="space-y-6">
                    <div class="bg-gray-50 p-6 rounded-lg border border-gray-200">
                      <h3 class="text-lg font-medium text-gray-900 mb-4 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                          <path fill-rule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                        </svg>
                        Password & Security
                      </h3>
                      
                      <div class="space-y-4">
                        <div class="flex items-center justify-between pb-4 border-b border-gray-200">
                          <div>
                            <h4 class="font-medium text-gray-900">Password</h4>
                            <p class="text-sm text-gray-600">Last changed: 2 months ago</p>
                          </div>
                          <button class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition duration-200">
                            Change Password
                          </button>
                        </div>
                        
                        <div class="flex items-center justify-between pb-4 border-b border-gray-200">
                          <div>
                            <h4 class="font-medium text-gray-900">Two-Factor Authentication</h4>
                            <p class="text-sm text-gray-600">Add an extra layer of security to your account</p>
                          </div>
                          <button class="bg-green-100 text-green-800 hover:bg-green-200 px-4 py-2 rounded-lg text-sm font-medium transition duration-200">
                            Enable 2FA
                          </button>
                        </div>
                        
                        <div class="flex items-center justify-between">
                          <div>
                            <h4 class="font-medium text-gray-900">Login History</h4>
                            <p class="text-sm text-gray-600">View your recent login activity</p>
                          </div>
                          <button class="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg text-sm font-medium transition duration-200">
                            View History
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    <div class="bg-gray-50 p-6 rounded-lg border border-gray-200">
                      <h3 class="text-lg font-medium text-gray-900 mb-4 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                          <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
                        </svg>
                        Privacy Settings
                      </h3>
                      
                      <div class="space-y-4">
                        <div class="flex items-center justify-between pb-4 border-b border-gray-200">
                          <div>
                            <h4 class="font-medium text-gray-900">Profile Visibility</h4>
                            <p class="text-sm text-gray-600">Control who can see your profile information</p>
                          </div>
                          <select class="bg-white border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500">
                            <option>Public</option>
                            <option>Private</option>
                            <option>Only Connections</option>
                          </select>
                        </div>
                        
                        <div class="flex items-center justify-between pb-4 border-b border-gray-200">
                          <div>
                            <h4 class="font-medium text-gray-900">Email Notifications</h4>
                            <p class="text-sm text-gray-600">Manage your email notification preferences</p>
                          </div>
                          <button class="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg text-sm font-medium transition duration-200">
                            Configure
                          </button>
                        </div>
                        
                        <div class="flex items-center justify-between">
                          <div>
                            <h4 class="font-medium text-gray-900">Data Sharing</h4>
                            <p class="text-sm text-gray-600">Control how your data is used and shared</p>
                          </div>
                          <button class="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg text-sm font-medium transition duration-200">
                            Review Settings
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    <div class="bg-red-50 p-6 rounded-lg border border-red-100">
                      <h3 class="text-lg font-medium text-gray-900 mb-4 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2 text-red-600" viewBox="0 0 20 20" fill="currentColor">
                          <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                        </svg>
                        Account Actions
                      </h3>
                      
                      <div class="space-y-4">
                        <div class="flex items-center justify-between pb-4 border-b border-red-200">
                          <div>
                            <h4 class="font-medium text-gray-900">Deactivate Account</h4>
                            <p class="text-sm text-gray-600">Temporarily disable your account</p>
                          </div>
                          <button class="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg text-sm font-medium transition duration-200">
                            Deactivate
                          </button>
                        </div>
                        
                        <div class="flex items-center justify-between">
                          <div>
                            <h4 class="font-medium text-gray-900">Delete Account</h4>
                            <p class="text-sm text-gray-600">Permanently delete your account and all data</p>
                          </div>
                          <button class="bg-red-100 text-red-700 hover:bg-red-200 px-4 py-2 rounded-lg text-sm font-medium transition duration-200">
                            Delete Account
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>