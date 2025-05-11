<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../../stores/authContext';
import { upgradeUserAccount } from '../../lib/upgradeAccount';
import { upload } from '../../lib/storage/upload';
import LeftPanel from '../../components/Auth/LeftPanel.vue';

export default defineComponent({
    name: 'FarmSignupForm',
    components: {
        LeftPanel
    },
    setup() {
        const router = useRouter();
        const authStore = useAuthStore();

        // Toast notifications system
        const toasts = ref<{ severity: string; summary: string; detail: string; id: number }[]>([]);
        const toastId = ref(0);

        const addToast = (severity: string, summary: string, detail: string, life: number = 3000) => {
            const id = toastId.value++;
            toasts.value.push({ severity, summary, detail, id });
            setTimeout(() => {
                toasts.value = toasts.value.filter(t => t.id !== id);
            }, life);
        };

        // User Personal Information (pre-filled)
        const fullName = ref<string>(''); // This would typically come from user's existing account
        const email = ref<string>(''); // Pre-filled from existing account
        const phoneNumber = ref<string>(''); // Philippines phone number field

        onMounted(async () => {
            fullName.value = `${authStore?.user?.user_metadata.firstname ?? ''} ${authStore?.user?.user_metadata.firstname ?? ''}`.trim();
            email.value = authStore?.user?.user_metadata.email;
            phoneNumber.value = authStore?.user?.user_metadata.phone;

            // Show a welcome toast when component mounts
            setTimeout(() => {
                addToast('info', 'Upgrade Farm Account', 'Provide your farm details to enhance your LivestoX experience');
            }, 500);
        });

        // Farm-specific form fields
        const farmName = ref<string>('');
        const farmType = ref<string>('');
        const farmLocation = ref<string>('');
        const farmDescription = ref<string>('');
        const livestockTypes = ref<string[]>([]);
        const farmCertifications = ref<string[]>([]);
        const farmDocumentations = ref<string>('');

        // New document upload and terms fields
        const idDocuments = ref<File[]>([]);
        const termsAccepted = ref<boolean>(false);
        const uploadedImagePreview = ref<string | null>(null);

        // Step 4: Farm Visit Scheduling - Change to days of the week
        const visitDays = ref<string[]>([]);
        const visitTime = ref<string>('');
        const contactPreference = ref<string>('');
        const additionalNotes = ref<string>('');

        // Form states
        const loading = ref<boolean>(false);
        const submitted = ref<boolean>(false);
        const currentStep = ref<number>(0);
        const totalSteps = 4;

        // Calculate progress percentage
        const progressPercentage = () => {
            return ((currentStep.value + 1) / totalSteps) * 100;
        };

        // Form options
        const farmTypeOptions = [
            { label: 'Dairy', value: 'dairy' },
            { label: 'Beef', value: 'beef' },
            { label: 'Mixed Livestock', value: 'mixed' },
            { label: 'Poultry', value: 'poultry' },
            { label: 'Sheep/Goat', value: 'sheep-goat' },
            { label: 'Other', value: 'other' }
        ];

        const livestockTypeOptions = [
            { label: 'Cattle', value: 'cattle' },
            { label: 'Sheep', value: 'sheep' },
            { label: 'Goats', value: 'goats' },
            { label: 'Pigs', value: 'pigs' },
            { label: 'Chickens', value: 'chickens' },
            { label: 'Horses', value: 'horses' },
            { label: 'Other', value: 'other' }
        ];

        const farmCertificationOptions = [
            { label: 'Organic', value: 'organic' },
            { label: 'Grass-Fed', value: 'grass-fed' },
            { label: 'Animal Welfare Approved', value: 'awa' },
            { label: 'No Certifications', value: 'none' }
        ];

        const contactPreferenceOptions = [
            { label: 'Phone Call', value: 'phone' },
            { label: 'SMS', value: 'sms' },
            { label: 'Email', value: 'email' },
            { label: 'WhatsApp', value: 'whatsapp' }
        ];

        const timeSlotOptions = [
            { label: 'Morning (8:00 AM - 12:00 PM)', value: 'morning' },
            { label: 'Afternoon (1:00 PM - 5:00 PM)', value: 'afternoon' },
            { label: 'By Appointment Only', value: 'appointment' }
        ];

        // Days of the week options
        const daysOfWeekOptions = [
            { label: 'Monday', value: 'monday' },
            { label: 'Tuesday', value: 'tuesday' },
            { label: 'Wednesday', value: 'wednesday' },
            { label: 'Thursday', value: 'thursday' },
            { label: 'Friday', value: 'friday' },
            { label: 'Saturday', value: 'saturday' },
            { label: 'Sunday', value: 'sunday' }
        ];

        // Validation functions
        const validateUserInfo = (): boolean => {
            if (!phoneNumber.value) {
                addToast('warn', 'Missing Information', 'Please provide your phone number');
                return false;
            }

            // Validate phone number format (Philippines format)
            // Philippines mobile format: +63 9XX XXX XXXX or 09XX XXX XXXX
            const phoneRegex = /^\+63 9\d{2} \d{3} \d{4}$/;
            if (!phoneRegex.test(phoneNumber.value)) {
                addToast('error', 'Invalid Phone Number', 'Please enter a valid Philippines phone number');
                return false;
            }

            return true;
        };

        const validateFarmInfo = (): boolean => {
            if (!farmName.value || !farmType.value || !farmLocation.value) {
                addToast('warn', 'Missing Information', 'Please fill in all required farm information fields');
                return false;
            }

            return true;
        };

        // Modified validation for documents and terms
        const validateDocumentsAndTerms = (): boolean => {
            // Always allow proceeding to next step
            // Only check terms acceptance
            if (!termsAccepted.value) {
                addToast('warn', 'Terms and Conditions', 'Please accept the terms and conditions to proceed');
                return false;
            }

            return true;
        };

        const validateFarmVisit = (): boolean => {
            if (visitDays.value.length === 0) {
                addToast('warn', 'Missing Information', 'Please select at least one preferred visit day');
                return false;
            }

            if (!visitTime.value) {
                addToast('warn', 'Missing Information', 'Please select a preferred time slot');
                return false;
            }

            if (!contactPreference.value) {
                addToast('warn', 'Missing Information', 'Please select your preferred contact method');
                return false;
            }

            return true;
        };

        // File upload handler
        const onFileUpload = async (event: Event) => {
            const input = event.target as HTMLInputElement;
            const files = input.files;

            if (files && files.length > 0) {
                idDocuments.value = Array.from(files);

                // Create image preview
                const reader = new FileReader();
                reader.onload = (e: any) => {
                    uploadedImagePreview.value = e.target.result;
                };
                reader.readAsDataURL(files[0]);

                try {
                    const filePath = `documentation/${Date.now()}-${files[0].name}`;
                    const publicUrl = await upload(files[0], filePath);
                    farmDocumentations.value = publicUrl ?? '';

                    addToast('success', 'Documents Uploaded', `${files.length} document(s) uploaded successfully`);
                } catch (error) {
                    addToast('error', 'Documents not Uploaded', `${files.length} document(s) uploaded not successfully`);
                }
            }
        };

        // Remove uploaded image
        const removeUploadedImage = () => {
            uploadedImagePreview.value = null;
            idDocuments.value = [];
        };

        // Return to dashboard function
        const returnToPreviousPage = () => {
            router.back();
        };


        // Navigation functions
        const nextStep = () => {
            submitted.value = true;

            // Validate current step
            let isValid = false;

            switch (currentStep.value) {
                case 0:
                    isValid = validateUserInfo();
                    break;
                case 1:
                    isValid = validateFarmInfo();
                    break;
                case 2:
                    isValid = validateDocumentsAndTerms();
                    break;
                case 3:
                    isValid = validateFarmVisit();
                    break;
            }

            if (isValid) {
                if (currentStep.value < 3) {
                    currentStep.value++;
                    submitted.value = false;
                    // Scroll to top when changing steps
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                } else {
                    handleSubmit();
                }
            }
        };

        const prevStep = () => {
            if (currentStep.value > 0) {
                currentStep.value--;
                submitted.value = false;
                // Scroll to top when changing steps
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        };

        const goToStep = (step: number) => {
            if (step <= currentStep.value) {
                currentStep.value = step;
                submitted.value = false;
                // Scroll to top when changing steps
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        };

        const handleSubmit = async () => {
            try {
                loading.value = true;

                await upgradeUserAccount(
                    fullName.value,
                    email.value,
                    phoneNumber.value,
                    farmName.value,
                    farmType.value,
                    farmLocation.value,
                    farmDescription.value,
                    livestockTypes.value.join(','),
                    farmCertifications.value.join(','),
                    farmDocumentations.value,
                    `${visitDays.value.join(', ')} at ${visitTime.value}` // Adding visitScheduleStr
                );

                // Mock successful farm account upgrade
                addToast('success', 'Farm Account Upgraded', `Welcome to LivestoX Farm Network, ${farmName.value}!`);

                // Navigate to farm dashboard or profile
                router.push('/farmer/FarmerLivestockDashboard');
            } catch (error) {
                addToast('error', 'Upgrade Failed', 'There was an error upgrading your farm account');
            } finally {
                loading.value = false;
            }
        };

        // Handlers for farm type selection
        const handleFarmTypeChange = (event: Event) => {
            const select = event.target as HTMLSelectElement;
            farmType.value = select.value;
        };

        // Handler for checkbox selections
        const toggleLivestockType = (value: string) => {
            const index = livestockTypes.value.indexOf(value);
            if (index === -1) {
                livestockTypes.value.push(value);
            } else {
                livestockTypes.value.splice(index, 1);
            }
        };

        const toggleFarmCertification = (value: string) => {
            const index = farmCertifications.value.indexOf(value);
            if (index === -1) {
                farmCertifications.value.push(value);
            } else {
                farmCertifications.value.splice(index, 1);
            }
        };

        const toggleVisitDay = (value: string) => {
            const index = visitDays.value.indexOf(value);
            if (index === -1) {
                visitDays.value.push(value);
            } else {
                visitDays.value.splice(index, 1);
            }
        };

        // Handlers for dropdowns
        const handleVisitTimeChange = (event: Event) => {
            const select = event.target as HTMLSelectElement;
            visitTime.value = select.value;
        };

        const handleContactPreferenceChange = (event: Event) => {
            const select = event.target as HTMLSelectElement;
            contactPreference.value = select.value;
        };

        const fileInput = ref<HTMLInputElement | null>(null); // Ensure fileInput is correctly typed

        return {
            // User info fields
            fullName,
            email,
            phoneNumber,
            fileInput,

            // Farm form fields
            farmName,
            farmType,
            farmLocation,
            farmDescription,
            livestockTypes,
            farmCertifications,

            // Toast system
            toasts,
            addToast,

            // New document upload and terms fields
            idDocuments,
            termsAccepted,
            onFileUpload,
            uploadedImagePreview,
            removeUploadedImage,

            // Farm visit scheduling fields
            visitDays,
            visitTime,
            contactPreference,
            additionalNotes,

            // Form states
            loading,
            submitted,
            currentStep,
            totalSteps,
            progressPercentage,

            // Form options
            farmTypeOptions,
            livestockTypeOptions,
            farmCertificationOptions,
            contactPreferenceOptions,
            timeSlotOptions,
            daysOfWeekOptions,

            // Handlers for selections
            handleFarmTypeChange,
            toggleLivestockType,
            toggleFarmCertification,
            toggleVisitDay,
            handleVisitTimeChange,
            handleContactPreferenceChange,

            // Functions
            nextStep,
            prevStep,
            goToStep,
            handleSubmit,
            returnToPreviousPage
        };
    }
});
</script>

<template>
    <!-- Fixed top navigation bar WITHOUT progress bar -->
    <div class="fixed top-0 left-0 right-0 bg-white shadow-md z-50">
        <div class="max-w-6xl mx-auto px-4">
            <div class="flex items-center justify-between h-16">
                <!-- Logo and return button -->
                <div class="flex items-center space-x-4">
                    <button @click="returnToPreviousPage"
                        class="flex items-center space-x-2 text-emerald-700 hover:text-emerald-800 transition-colors duration-200">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd"
                                d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                                clip-rule="evenodd" />
                        </svg>
                        <span class="font-medium">Return to Dashboard</span>
                    </button>
                </div>
            </div>
        </div>
    </div>

    <!-- Main content with padding to account for fixed header -->
    <div class="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-green-100 pt-24 pb-12 px-4 relative">
        <!-- Enhanced background pattern overlay -->
        <div class="absolute inset-0 z-0 opacity-5 pointer-events-none bg-repeat"
            style="background-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDE4MCAxODAiPjxnIHRyYW5zZm9ybT0ic2NhbGUoMC44KSI+PHBhdGggZmlsbD0iIzA0NjMzNyIgZD0iTTgxIDgxaDQ0djQ0SDgxem0tNDQgMGg0NHY0NEgzN3oiLz48L2c+PC9zdmc+');">
        </div>

        <!-- Improved Toast notifications with animation -->
        <div class="fixed top-20 right-4 z-50 flex flex-col gap-3 max-w-md">
            <div v-for="toast in toasts" :key="toast.id"
                class="flex items-center gap-3 p-4 rounded-lg shadow-xl animate-slide-in-right transition-all duration-300"
                :class="{
                    'bg-red-50 text-red-700 border-l-4 border-red-500': toast.severity === 'error',
                    'bg-yellow-50 text-yellow-700 border-l-4 border-yellow-500': toast.severity === 'warn',
                    'bg-blue-50 text-blue-700 border-l-4 border-blue-500': toast.severity === 'info',
                    'bg-green-50 text-green-700 border-l-4 border-green-500': toast.severity === 'success'
                }">
                <div class="flex-shrink-0">
                    <svg v-if="toast.severity === 'error'" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5"
                        viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                            clip-rule="evenodd" />
                    </svg>
                    <svg v-else-if="toast.severity === 'warn'" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5"
                        viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd"
                            d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                            clip-rule="evenodd" />
                    </svg>
                    <svg v-else-if="toast.severity === 'info'" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5"
                        viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                            clip-rule="evenodd" />
                    </svg>
                    <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20"
                        fill="currentColor">
                        <path fill-rule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clip-rule="evenodd" />
                    </svg>
                </div>
                <div>
                    <h4 class="font-semibold">{{ toast.summary }}</h4>
                    <p class="text-sm">{{ toast.detail }}</p>
                </div>
            </div>
        </div>

        <!-- Main container with enhanced shadow and rounded corners -->
        <div
            class="max-w-6xl mx-auto flex flex-col lg:flex-row rounded-3xl overflow-hidden shadow-2xl bg-white relative z-10 border border-emerald-100">
            <!-- Left side panel component -->
            <LeftPanel :currentStep="currentStep" />

            <!-- Right side form panel with improved UI -->
            <div class="w-full lg:w-3/5 p-6 md:p-12">
                <!-- Progress bar now directly on the form -->
                <div class="mb-8">
                    <div class="flex justify-between items-center mb-2">
                        <span class="text-sm font-medium text-emerald-700">Step {{ currentStep + 1 }} of {{ totalSteps
                            }}</span>
                        <span class="text-sm font-medium bg-emerald-100 px-3 py-1 rounded-full text-emerald-700">
                            {{ ['Personal Info', 'Farm Details', 'Document Upload', 'Farm Visit'][currentStep] }}
                        </span>
                    </div>
                    <!-- Main progress bar - Now on the form -->
                    <div class="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                        <div class="h-full bg-emerald-500 transition-all duration-500 ease-out rounded-full"
                            :style="{ width: `${progressPercentage()}%` }"></div>
                    </div>
                </div>

                <!-- Mobile step navigation tabs -->
                <div class="lg:hidden flex overflow-x-auto pb-2 mb-6 -mx-6 px-6 space-x-2">
                    <button v-for="index in totalSteps" :key="index" @click="goToStep(index)"
                        class="flex-shrink-0 px-4 py-2 rounded-full text-sm transition-all duration-200" :class="[
                            index <= currentStep ? 'bg-emerald-100 text-emerald-700 font-medium' : 'bg-gray-100 text-gray-500'
                        ]">
                        {{ ['Personal Info', 'Farm Details', 'Documents', 'Farm Visit'][index] }}
                    </button>
                </div>

                <!-- Form Content - Conditionally show based on current step -->
                <div>
                    <!-- Step 1: User Personal Information -->
                    <div v-if="currentStep === 0" class="animate-fade-in">
                        <h2 class="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                            <span
                                class="bg-emerald-500 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm mr-3">1</span>
                            Personal Information
                        </h2>
                        <p class="text-gray-600 mb-8">Please verify your personal information below. This will be used
                            for your farm profile and communications.</p>

                        <div class="space-y-6">
                            <div class="form-group">
                                <label class="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                                <input type="text" v-model="fullName" disabled
                                    class="w-full px-4 py-3 rounded-lg border bg-gray-50 text-gray-600 focus:border-emerald-500 focus:ring focus:ring-emerald-200" />
                            </div>

                            <div class="form-group">
                                <label class="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                                <input type="email" v-model="email" disabled
                                    class="w-full px-4 py-3 rounded-lg border bg-gray-50 text-gray-600 focus:border-emerald-500 focus:ring focus:ring-emerald-200" />
                            </div>

                            <div class="form-group">
                                <label class="block text-sm font-medium text-gray-700 mb-2">Phone Number*</label>
                                <div class="relative">
                                    <span
                                        class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none"
                                            viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                        </svg>
                                    </span>
                                    <input type="tel" v-model="phoneNumber" placeholder="+63 9XX XXX XXXX"
                                        class="w-full pl-10 px-4 py-3 rounded-lg border focus:border-emerald-500 focus:ring focus:ring-emerald-200"
                                        :class="{ 'border-red-500 ring-1 ring-red-500': submitted && !phoneNumber }" />
                                </div>
                                <p class="text-xs text-gray-500 mt-1">
                                    Format: +63 9XX XXX XXXX (Philippines format)
                                </p>
                                <p v-if="submitted && !phoneNumber" class="text-red-500 text-sm mt-1">
                                    Phone number is required
                                </p>
                            </div>
                        </div>
                    </div>

                    <!-- Step 2: Farm Information -->
                    <div v-if="currentStep === 1" class="animate-fade-in">
                        <h2 class="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                            <span
                                class="bg-emerald-500 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm mr-3">2</span>
                            Farm Details
                        </h2>
                        <p class="text-gray-600 mb-8">Tell us about your farm to help buyers find and connect with you.
                        </p>

                        <div class="space-y-6">
                            <div class="form-group">
                                <label class="block text-sm font-medium text-gray-700 mb-2">Farm Name*</label>
                                <div class="relative">
                                    <span
                                        class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none"
                                            viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                        </svg>
                                    </span>
                                    <input type="text" v-model="farmName" placeholder="Enter farm name"
                                        class="w-full pl-10 px-4 py-3 rounded-lg border focus:border-emerald-500 focus:ring focus:ring-emerald-200"
                                        :class="{ 'border-red-500 ring-1 ring-red-500': submitted && !farmName }" />
                                </div>
                                <p v-if="submitted && !farmName" class="text-red-500 text-sm mt-1">
                                    Farm name is required
                                </p>
                            </div>

                            <div class="form-group">
                                <label class="block text-sm font-medium text-gray-700 mb-2">Farm Type*</label>
                                <div class="relative">
                                    <span
                                        class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none"
                                            viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                                        </svg>
                                    </span>
                                    <select v-model="farmType" @change="handleFarmTypeChange"
                                        class="w-full pl-10 px-4 py-3 rounded-lg border focus:border-emerald-500 focus:ring focus:ring-emerald-200 appearance-none"
                                        :class="{ 'border-red-500 ring-1 ring-red-500': submitted && !farmType }">
                                        <option value="">Select Farm Type</option>
                                        <option v-for="option in farmTypeOptions" :key="option.value"
                                            :value="option.value">
                                            {{ option.label }}
                                        </option>
                                    </select>
                                    <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400"
                                            viewBox="0 0 20 20" fill="currentColor">
                                            <path fill-rule="evenodd"
                                                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                clip-rule="evenodd" />
                                        </svg>
                                    </div>
                                </div>
                                <p v-if="submitted && !farmType" class="text-red-500 text-sm mt-1">
                                    Farm type is required
                                </p>
                            </div>

                            <div class="form-group">
                                <label class="block text-sm font-medium text-gray-700 mb-2">Farm Location*</label>
                                <div class="relative">
                                    <span
                                        class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none"
                                            viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                    </span>
                                    <input type="text" v-model="farmLocation" placeholder="Enter complete farm address"
                                        class="w-full pl-10 px-4 py-3 rounded-lg border focus:border-emerald-500 focus:ring focus:ring-emerald-200"
                                        :class="{ 'border-red-500 ring-1 ring-red-500': submitted && !farmLocation }" />
                                </div>
                                <p v-if="submitted && !farmLocation" class="text-red-500 text-sm mt-1">
                                    Farm location is required
                                </p>
                            </div>

                            <div class="form-group">
                                <label class="block text-sm font-medium text-gray-700 mb-2">Farm Description</label>
                                <textarea v-model="farmDescription"
                                    placeholder="Describe your farm, facilities, specialties, etc." rows="4"
                                    class="w-full px-4 py-3 rounded-lg border focus:border-emerald-500 focus:ring focus:ring-emerald-200"></textarea>
                            </div>

                            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div class="form-group">
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Livestock Types</label>
                                    <div class="space-y-2 mt-2">
                                        <div v-for="option in livestockTypeOptions" :key="option.value"
                                            class="flex items-center">
                                            <input type="checkbox" :id="'livestock-' + option.value"
                                                :checked="livestockTypes.includes(option.value)"
                                                @change="toggleLivestockType(option.value)"
                                                class="h-4 w-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500" />
                                            <label :for="'livestock-' + option.value" class="ml-2 text-sm text-gray-700">
                                                {{ option.label }}
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                <div class="form-group">
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Farm
                                        Certifications</label>
                                    <div class="space-y-2 mt-2">
                                        <div v-for="option in farmCertificationOptions" :key="option.value"
                                            class="flex items-center">
                                            <input type="checkbox" :id="'cert-' + option.value"
                                                :checked="farmCertifications.includes(option.value)"
                                                @change="toggleFarmCertification(option.value)"
                                                class="h-4 w-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500" />
                                            <label :for="'cert-' + option.value" class="ml-2 text-sm text-gray-700">
                                                {{ option.label }}
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Step 3: Document Upload & Terms -->
                    <div v-if="currentStep === 2" class="animate-fade-in">
                        <h2 class="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                            <span
                                class="bg-emerald-500 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm mr-3">3</span>
                            Documentation & Terms
                        </h2>
                        <p class="text-gray-600 mb-8">Upload supporting documentation for your farm and review our
                            terms.</p>

                        <div class="space-y-8">
                            <!-- Document Upload Section with Preview -->
                            <div class="form-group">
                                <label class="block text-sm font-medium text-gray-700 mb-2">Farm Documentation</label>
                                <p class="text-sm text-gray-500 mb-4">
                                    Upload any relevant farm documents, certifications, licenses, or photos.
                                </p>

                                <!-- File input with improved styling -->
                                <div class="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed border-gray-300 rounded-lg bg-white"
                                    :class="{ 'border-emerald-300 bg-emerald-50': uploadedImagePreview }">
                                    <div class="space-y-3 text-center" v-if="!uploadedImagePreview">
                                        <svg xmlns="http://www.w3.org/2000/svg" class="mx-auto h-12 w-12 text-gray-400"
                                            fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                        </svg>
                                        <div class="flex text-sm text-gray-600">
                                            <label for="file-upload"
                                                class="relative cursor-pointer bg-white rounded-md font-medium text-emerald-600 hover:text-emerald-500 focus-within:outline-none">
                                                <span>Upload a file</span>
                                                <input id="file-upload" ref="fileInput" name="file-upload" type="file"
                                                    class="sr-only" @change="onFileUpload" accept="image/*,.pdf">
                                            </label>
                                            <p class="pl-1">or drag and drop</p>
                                        </div>
                                        <p class="text-xs text-gray-500">PNG, JPG, PDF up to 10MB</p>
                                    </div>

                                    <!-- Image Preview Section -->
                                    <div v-else class="relative w-full">
                                        <img :src="uploadedImagePreview" alt="Document Preview"
                                            class="mx-auto h-48 object-cover rounded-lg shadow-md">
                                        <div class="mt-4 flex justify-center">
                                            <span class="text-sm text-emerald-600 font-medium">
                                                {{ idDocuments.length > 0 ? idDocuments[0].name : 'File uploaded' }}
                                            </span>
                                        </div>
                                        <button type="button" @click="removeUploadedImage"
                                            class="absolute top-0 right-0 -mt-2 -mr-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20"
                                                fill="currentColor">
                                                <path fill-rule="evenodd"
                                                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                                    clip-rule="evenodd" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <!-- Terms and Conditions Section -->
                            <div class="form-group">
                                <div class="rounded-lg border border-gray-200 p-4 bg-gray-50">
                                    <h3 class="font-medium text-gray-800 mb-3">Terms & Conditions</h3>
                                    <div
                                        class="text-sm text-gray-600 h-48 overflow-y-auto mb-4 bg-white p-3 rounded border">
                                        <p class="mb-3">By registering your farm on LivestoX, you agree to the following
                                            terms:</p>
                                        <ol class="list-decimal pl-5 space-y-2">
                                            <li>You confirm that all information provided is accurate and up-to-date.
                                            </li>
                                            <li>You agree to maintain your farm profile with current information.</li>
                                            <li>You understand that your farm information will be visible to potential
                                                buyers on the platform.</li>
                                            <li>You agree to comply with all applicable laws and regulations related to
                                                livestock farming in your region.</li>
                                            <li>You consent to receiving communications from LivestoX and potential
                                                buyers through the contact methods provided.</li>
                                            <li>LivestoX reserves the right to verify farm information and request
                                                additional documentation if necessary.</li>
                                            <li>LivestoX may remove farm listings that violate platform policies or
                                                receive consistent negative feedback.</li>
                                        </ol>
                                    </div>
                                    <div class="flex items-start">
                                        <div class="flex items-center h-5">
                                            <input id="terms" type="checkbox" v-model="termsAccepted"
                                                class="h-4 w-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                                                :class="{ 'border-red-500': submitted && !termsAccepted }">
                                        </div>
                                        <div class="ml-3 text-sm">
                                            <label for="terms" class="font-medium text-gray-700">I accept the terms and
                                                conditions*</label>
                                        </div>
                                    </div>
                                    <p v-if="submitted && !termsAccepted" class="text-red-500 text-sm mt-1">
                                        You must accept the terms to continue
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Step 4: Farm Visit Scheduling -->
                    <div v-if="currentStep === 3" class="animate-fade-in">
                        <h2 class="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                            <span
                                class="bg-emerald-500 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm mr-3">4</span>
                            Farm Visit Availability
                        </h2>
                        <p class="text-gray-600 mb-8">Set your availability for potential farm visits and preferred
                            contact method.</p>

                        <div class="space-y-6">
                            <!-- Days of week selection -->
                            <div class="form-group">
                                <label class="block text-sm font-medium text-gray-700 mb-3">Available Days for Farm
                                    Visits*</label>
                                <div class="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
                                    <div v-for="day in daysOfWeekOptions" :key="day.value"
                                        class="flex flex-col items-center">
                                        <button type="button" @click="toggleVisitDay(day.value)"
                                            class="p-3 rounded-lg w-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                                            :class="visitDays.includes(day.value) ?
                                                'bg-emerald-500 text-white' :
                                                'bg-gray-100 text-gray-700 hover:bg-gray-200'">
                                            {{ day.label.substring(0, 3) }}
                                        </button>
                                    </div>
                                </div>
                                <p v-if="submitted && visitDays.length === 0" class="text-red-500 text-sm mt-1">
                                    Please select at least one day
                                </p>
                            </div>

                            <!-- Time slot selection -->
                            <div class="form-group">
                                <label class="block text-sm font-medium text-gray-700 mb-2">Preferred Time Slot*</label>
                                <div class="relative">
                                    <span
                                        class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none"
                                            viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </span>
                                    <select v-model="visitTime" @change="handleVisitTimeChange"
                                        class="w-full pl-10 px-4 py-3 rounded-lg border focus:border-emerald-500 focus:ring focus:ring-emerald-200 appearance-none"
                                        :class="{ 'border-red-500 ring-1 ring-red-500': submitted && !visitTime }">
                                        <option value="">Select Time Slot</option>
                                        <option v-for="option in timeSlotOptions" :key="option.value"
                                            :value="option.value">
                                            {{ option.label }}
                                        </option>
                                    </select>
                                    <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400"
                                            viewBox="0 0 20 20" fill="currentColor">
                                            <path fill-rule="evenodd"
                                                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                clip-rule="evenodd" />
                                        </svg>
                                    </div>
                                </div>
                                <p v-if="submitted && !visitTime" class="text-red-500 text-sm mt-1">
                                    Please select a time slot
                                </p>
                            </div>

                            <!-- Contact preference -->
                            <div class="form-group">
                                <label class="block text-sm font-medium text-gray-700 mb-2">Preferred Contact
                                    Method*</label>
                                <div class="relative">
                                    <span
                                        class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none"
                                            viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                                        </svg>
                                    </span>
                                    <select v-model="contactPreference" @change="handleContactPreferenceChange"
                                        class="w-full pl-10 px-4 py-3 rounded-lg border focus:border-emerald-500 focus:ring focus:ring-emerald-200 appearance-none"
                                        :class="{ 'border-red-500 ring-1 ring-red-500': submitted && !contactPreference }">
                                        <option value="">Select Contact Method</option>
                                        <option v-for="option in contactPreferenceOptions" :key="option.value"
                                            :value="option.value">
                                            {{ option.label }}
                                        </option>
                                    </select>
                                    <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400"
                                            viewBox="0 0 20 20" fill="currentColor">
                                            <path fill-rule="evenodd"
                                                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                clip-rule="evenodd" />
                                        </svg>
                                    </div>
                                </div>
                                <p v-if="submitted && !contactPreference" class="text-red-500 text-sm mt-1">
                                    Please select a contact method
                                </p>
                            </div>

                            <!-- Additional Notes -->
                            <div class="form-group">
                                <label class="block text-sm font-medium text-gray-700 mb-2">Additional Notes for
                                    Visitors</label>
                                <textarea v-model="additionalNotes"
                                    placeholder="Special instructions, directions to the farm, etc." rows="3"
                                    class="w-full px-4 py-3 rounded-lg border focus:border-emerald-500 focus:ring focus:ring-emerald-200"></textarea>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Navigation buttons with enhanced styling -->
                <div class="flex flex-wrap justify-between mt-10 pt-6 border-t border-gray-200">
                    <button v-if="currentStep > 0" @click="prevStep" type="button"
                        class="px-5 py-3 rounded-lg font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors duration-200">
                        <div class="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" viewBox="0 0 20 20"
                                fill="currentColor">
                                <path fill-rule="evenodd"
                                    d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z"
                                    clip-rule="evenodd" />
                            </svg>
                            Previous
                        </div>
                    </button>
                    <div></div> <!-- Spacer for flex justify-between -->
                    <button @click="nextStep" type="button"
                        class="px-6 py-3 rounded-lg font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 shadow-lg shadow-emerald-500/20 transition-all duration-200"
                        :class="{ 'opacity-75 cursor-not-allowed': loading }" :disabled="loading">
                        <div class="flex items-center">
                            <span>{{ currentStep === 3 ? 'Submit Application' : 'Next' }}</span>
                            <svg v-if="!loading" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-2"
                                viewBox="0 0 20 20" fill="currentColor">
                                <path fill-rule="evenodd"
                                    d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                                    clip-rule="evenodd" />
                            </svg>
                            <svg v-else class="animate-spin h-4 w-4 ml-2" xmlns="http://www.w3.org/2000/svg" fill="none"
                                viewBox="0 0 24 24">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                    stroke-width="4"></circle>
                                <path class="opacity-75" fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                                </path>
                            </svg>
                        </div>
                    </button>
                </div>
            </div>
        </div>

        <!-- Optional disclaimer text at bottom of page -->
        <div class="max-w-6xl mx-auto mt-8 text-center">
            <p class="text-sm text-gray-500">
                LivestoX connects farmers and buyers to create sustainable livestock markets.
                <br class="hidden md:block" />
                Questions? Contact our support team at <a href="mailto:support@livestox.com"
                    class="text-emerald-600 hover:text-emerald-700">support@livestox.com</a>
            </p>
        </div>
    </div>
</template>

<style scoped>
/* Fade in animation for step transitions */
.animate-fade-in {
    animation: fadeIn 0.4s ease-in-out;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(10px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/* Slide in animation for toast notifications */
.animate-slide-in-right {
    animation: slideInRight 0.5s ease-out;
}

@keyframes slideInRight {
    from {
        opacity: 0;
        transform: translateX(30px);
    }

    to {
        opacity: 1;
        transform: translateX(0);
    }
}
</style>