<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import Toast from 'primevue/toast';
import InputText from 'primevue/inputtext';
import InputMask from 'primevue/inputmask';
import Button from 'primevue/button';
import Dropdown from 'primevue/dropdown';
import Checkbox from 'primevue/checkbox';
import Textarea from 'primevue/textarea';
import FileUpload from 'primevue/fileupload';
import Calendar from 'primevue/calendar';
import { useAuthStore } from '../../stores/authContext';
import { upgradeUserAccount } from '../../lib/upgradeAccount';
import { upload } from '../../lib/storage/upload';

export default defineComponent({
    name: 'FarmSignupForm',
    components: {
        Toast,
        InputText,
        InputMask,
        Button,
        Dropdown,
        Checkbox,
        Textarea,
        FileUpload,
        Calendar
    },
    setup() {
        const router = useRouter();
        const toast = useToast();
        const authStore = useAuthStore();

        // User Personal Information (pre-filled)
        const fullName = ref<string>(''); // This would typically come from user's existing account
        const email = ref<string>(''); // Pre-filled from existing account
        const phoneNumber = ref<string>(''); // Philippines phone number field

        onMounted(async () => {
            fullName.value = `${authStore?.user?.user_metadata.firstname ?? ''} ${authStore?.user?.user_metadata.firstname ?? ''}`.trim();
            email.value = authStore?.user?.user_metadata.email;
            phoneNumber.value = authStore?.user?.user_metadata.phone;
        });

        // Farm-specific form fields
        const farmName = ref<string>('');
        const farmType = ref<string>('');
        const farmLocation = ref<string>('');
        const farmDescription = ref<string>('');
        const livestockTypes = ref<string>('');
        const farmCertifications = ref<string>('');
        const farmDocumentations = ref<string>('');

        // New document upload and terms fields
        const idDocuments = ref<File[]>([]);
        const termsAccepted = ref<boolean>(false);
        const uploadedImagePreview = ref<string | null>(null);

        // Step 4: Farm Visit Scheduling
        const visitDate = ref<Date | null>(null);
        const visitTime = ref<string>('');
        const contactPreference = ref<string>('');
        const additionalNotes = ref<string>('');

        // Form states
        const loading = ref<boolean>(false);
        const submitted = ref<boolean>(false);
        const currentStep = ref<number>(0);

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

        // Validation functions
        const validateUserInfo = (): boolean => {
            if (!phoneNumber.value) {
                toast.add({
                    severity: 'warn',
                    summary: 'Missing Information',
                    detail: 'Please provide your phone number',
                    life: 3000
                });
                return false;
            }

            // Validate phone number format (Philippines format)
            // Philippines mobile format: +63 9XX XXX XXXX or 09XX XXX XXXX
            const phoneRegex = /^\+63 9\d{2} \d{3} \d{4}$/;
            if (!phoneRegex.test(phoneNumber.value)) {
                toast.add({
                    severity: 'error',
                    summary: 'Invalid Phone Number',
                    detail: 'Please enter a valid Philippines phone number',
                    life: 3000
                });
                return false;
            }

            return true;
        };

        const validateFarmInfo = (): boolean => {
            if (!farmName.value || !farmType.value || !farmLocation.value) {
                toast.add({
                    severity: 'warn',
                    summary: 'Missing Information',
                    detail: 'Please fill in all required farm information fields',
                    life: 3000
                });
                return false;
            }

            return true;
        };

        // Modified validation for documents and terms
        const validateDocumentsAndTerms = (): boolean => {
            // Always allow proceeding to next step
            // Only check terms acceptance
            if (!termsAccepted.value) {
                toast.add({
                    severity: 'warn',
                    summary: 'Terms and Conditions',
                    detail: 'Please accept the terms and conditions to proceed',
                    life: 3000
                });
                return false;
            }

            return true;
        };

        const validateFarmVisit = (): boolean => {
            if (!visitDate.value) {
                toast.add({
                    severity: 'warn',
                    summary: 'Missing Information',
                    detail: 'Please select a preferred visit date',
                    life: 3000
                });
                return false;
            }

            if (!visitTime.value) {
                toast.add({
                    severity: 'warn',
                    summary: 'Missing Information',
                    detail: 'Please select a preferred time slot',
                    life: 3000
                });
                return false;
            }

            if (!contactPreference.value) {
                toast.add({
                    severity: 'warn',
                    summary: 'Missing Information',
                    detail: 'Please select your preferred contact method',
                    life: 3000
                });
                return false;
            }

            return true;
        };

        // File upload handler
        const onFileUpload = async (event: any) => {
            const files = event.files;
            idDocuments.value = files;

            // Create image preview
            if (files && files.length > 0) {
                const reader = new FileReader();
                reader.onload = (e: any) => {
                    uploadedImagePreview.value = e.target.result;
                };
                reader.readAsDataURL(files[0]);
            }

            try {
                const filePath = `documentation/${Date.now()}-${files[0].name}`;
                const publicUrl = await upload(files[0], filePath);
                farmDocumentations.value = publicUrl ?? '';
            } catch (error) {
                toast.add({
                    severity: 'error',
                    summary: 'Documents not Uploaded',
                    detail: `${files.length} document(s) uploaded not successfully`,
                    life: 3000
                });
            }

            toast.add({
                severity: 'success',
                summary: 'Documents Uploaded',
                detail: `${files.length} document(s) uploaded successfully`,
                life: 3000
            });
        };

        // Remove uploaded image
        const removeUploadedImage = () => {
            uploadedImagePreview.value = null;
            idDocuments.value = [];
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
                } else {
                    handleSubmit();
                }
            }
        };

        const prevStep = () => {
            if (currentStep.value > 0) {
                currentStep.value--;
                submitted.value = false;
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
                    livestockTypes.value,
                    farmCertifications.value,
                    farmDocumentations.value
                );

                // Mock successful farm account upgrade
                toast.add({
                    severity: 'success',
                    summary: 'Farm Account Upgraded',
                    detail: `Welcome to LivestoX Farm Network, ${farmName.value}!`,
                    life: 3000
                });

                // Navigate to farm dashboard or profile
                router.push('/farmer/FarmerLivestockDashboard');
            } catch (error) {
                toast.add({
                    severity: 'error',
                    summary: 'Upgrade Failed',
                    detail: 'There was an error upgrading your farm account',
                    life: 3000
                });
            } finally {
                loading.value = false;
            }
        };

        onMounted(() => {
            // Show a welcome toast when component mounts
            setTimeout(() => {
                toast.add({
                    severity: 'info',
                    summary: 'Upgrade Farm Account',
                    detail: 'Provide your farm details to enhance your LivestoX experience',
                    life: 3000
                });
            }, 500);
        });

        return {
            // User info fields
            fullName,
            email,
            phoneNumber,

            // Farm form fields
            farmName,
            farmType,
            farmLocation,
            farmDescription,
            livestockTypes,
            farmCertifications,

            // New document upload and terms fields
            idDocuments,
            termsAccepted,
            onFileUpload,
            uploadedImagePreview,
            removeUploadedImage,

            // Farm visit scheduling fields
            visitDate,
            visitTime,
            contactPreference,
            additionalNotes,

            // Form states
            loading,
            submitted,
            currentStep,

            // Form options
            farmTypeOptions,
            livestockTypeOptions,
            farmCertificationOptions,
            contactPreferenceOptions,
            timeSlotOptions,

            // Functions
            nextStep,
            prevStep,
            handleSubmit
        };
    }
});
</script>

<template>
    <!-- Nature-inspired background with subtle farm pattern and improved gradient -->
    <div class="min-h-screen bg-gradient-to-br from-green-50 via-teal-50 to-emerald-100 py-12 px-4 relative">
        <!-- Background pattern overlay -->
        <div class="absolute inset-0 z-0 opacity-5 pointer-events-none bg-repeat"
            style="background-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDE4MCAxODAiPjxnIHRyYW5zZm9ybT0ic2NhbGUoMC44KSI+PHBhdGggZmlsbD0iIzA0NjMzNyIgZD0iTTgxIDgxaDQ0djQ0SDgxem0tNDQgMGg0NHY0NEgzN3oiLz48L2c+PC9zdmc+');">
        </div>

        <Toast position="top-right" />

        <!-- Logo and branding at the top -->
        <div class="flex justify-center mb-8">
            <div class="flex items-center space-x-3 text-emerald-800">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-8 h-8">
                    <path
                        d="M19.006 3.705a.75.75 0 00-.512-1.41L6 6.838V3a.75.75 0 00-.75-.75h-1.5A.75.75 0 003 3v4.93l-1.006.365a.75.75 0 00.512 1.41l16.5-6z" />
                    <path fill-rule="evenodd"
                        d="M3.019 11.115L18 5.667V9.09l4.006 1.456a.75.75 0 11-.512 1.41l-.494-.18v8.475h.75a.75.75 0 010 1.5H2.25a.75.75 0 010-1.5H3v-9.129l.019-.006zM18 20.25v-9.565l1.5.545v9.02H18zm-9-6a.75.75 0 00-.75.75v4.5c0 .414.336.75.75.75h3a.75.75 0 00.75-.75V15a.75.75 0 00-.75-.75H9z"
                        clip-rule="evenodd" />
                </svg>
                <h1 class="text-2xl font-bold">LivestoX</h1>
            </div>
        </div>

        <!-- Main container with enhanced shadow and rounded corners -->
        <div
            class="max-w-6xl mx-auto flex flex-col lg:flex-row rounded-3xl overflow-hidden shadow-2xl bg-white relative z-10">

            <!-- Left side illustration panel - Hidden on mobile -->
            <div
                class="hidden lg:block lg:w-2/5 bg-gradient-to-br from-emerald-700 to-emerald-800 relative overflow-hidden">
                <!-- Background pattern for illustration panel -->
                <div
                    class="absolute inset-0 bg-[url('/api/placeholder/600/900')] opacity-20 bg-cover bg-center mix-blend-overlay">
                </div>

                <!-- Farm themed SVG decoration -->
                <div class="absolute bottom-0 left-0 right-0 h-32 opacity-20">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" fill="#ffffff">
                        <path fill-opacity="1"
                            d="M0,160L48,154.7C96,149,192,139,288,149.3C384,160,480,192,576,197.3C672,203,768,181,864,165.3C960,149,1056,139,1152,149.3C1248,160,1344,192,1392,208L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z">
                        </path>
                    </svg>
                </div>

                <div class="relative z-10 h-full flex flex-col justify-between p-12 text-white">
                    <div>
                        <!-- Logo container -->
                        <div class="flex items-center space-x-2 mb-8">
                            <div class="w-10 h-10 rounded-full bg-white flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#047857"
                                    class="w-6 h-6">
                                    <path
                                        d="M19.006 3.705a.75.75 0 00-.512-1.41L6 6.838V3a.75.75 0 00-.75-.75h-1.5A.75.75 0 003 3v4.93l-1.006.365a.75.75 0 00.512 1.41l16.5-6z" />
                                    <path fill-rule="evenodd"
                                        d="M3.019 11.115L18 5.667V9.09l4.006 1.456a.75.75 0 11-.512 1.41l-.494-.18v8.475h.75a.75.75 0 010 1.5H2.25a.75.75 0 010-1.5H3v-9.129l.019-.006zM18 20.25v-9.565l1.5.545v9.02H18zm-9-6a.75.75 0 00-.75.75v4.5c0 .414.336.75.75.75h3a.75.75 0 00.75-.75V15a.75.75 0 00-.75-.75H9z"
                                        clip-rule="evenodd" />
                                </svg>
                            </div>
                            <span class="text-xl font-bold">LivestoX</span>
                        </div>

                        <h2 class="text-3xl font-bold mb-6">Join our Farming Community</h2>
                        <p class="mb-8 text-emerald-100 leading-relaxed">Connect with other farmers, access premium
                            tools, and grow your
                            livestock business with our complete farm management solution.</p>

                        <!-- Benefits list with icons -->
                        <div class="space-y-4 mb-10">
                            <div class="flex items-center space-x-3">
                                <div class="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                        stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
                                        <path stroke-linecap="round" stroke-linejoin="round"
                                            d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <span class="text-sm">Access to premium livestock tools</span>
                            </div>
                            <div class="flex items-center space-x-3">
                                <div class="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                        stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
                                        <path stroke-linecap="round" stroke-linejoin="round"
                                            d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <span class="text-sm">Connect with other farmers</span>
                            </div>
                            <div class="flex items-center space-x-3">
                                <div class="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                        stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
                                        <path stroke-linecap="round" stroke-linejoin="round"
                                            d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <span class="text-sm">Get specialized farming insights</span>
                            </div>
                        </div>
                    </div>

                    <!-- Improved Steps sidebar with animated current step indicator -->
                    <div class="space-y-6">
                        <div v-for="(step, index) in ['Personal Info', 'Farm Details', 'Document Upload', 'Farm Visit']"
                            :key="index" class="flex items-center space-x-4 transition-all duration-300"
                            :class="{ 'opacity-100': currentStep >= index, 'opacity-60': currentStep < index }">
                            <div
                                :class="`w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold relative
                                ${currentStep >= index ? 'bg-white text-emerald-700' : 'bg-emerald-600 text-white border border-emerald-400'}`">
                                <!-- Animated pulse effect for current step -->
                                <div v-if="currentStep === index"
                                    class="absolute inset-0 rounded-full bg-white opacity-30 animate-ping"></div>
                                {{ index + 1 }}
                            </div>
                            <span :class="`text-lg ${currentStep >= index ? 'font-medium' : 'text-emerald-200'}`">{{
                                step }}</span>
                        </div>
                    </div>

                    <div class="text-sm text-emerald-200 flex items-center space-x-2">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                            stroke="currentColor" class="w-5 h-5">
                            <path stroke-linecap="round" stroke-linejoin="round"
                                d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
                        </svg>
                        <p>Need help? Contact us at support@livestox.com</p>
                    </div>
                </div>
            </div>

            <!-- Right side form panel with improved UI -->
            <div class="w-full lg:w-3/5 p-6 md:p-12">
                <!-- Mobile steps indicator with improved styling -->
                <div class="lg:hidden mb-8">
                    <div class="flex justify-between items-center mb-2">
                        <span class="text-sm font-medium text-emerald-700">Step {{ currentStep + 1 }} of 4</span>
                        <span class="text-sm font-medium text-emerald-700">
                            {{ ['Personal Info', 'Farm Details', 'Document Upload', 'Farm Visit'][currentStep] }}
                        </span>
                    </div>
                    <div class="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div class="h-full bg-emerald-500 rounded-full transition-all duration-500 shadow-sm"
                            :style="{ width: `${(currentStep + 1) * 25}%` }"></div>
                    </div>
                </div>

                <!-- Form header with improved typography -->
                <div class="mb-10">
                    <h1 class="text-3xl font-bold text-gray-800 mb-3">Upgrade to Farm Account</h1>
                    <p class="text-gray-600 leading-relaxed">Join the LivestoX network and connect with other farmers to
                        grow your agricultural business</p>
                </div>

                <!-- Form content with enhanced styling -->
                <form @submit.prevent="nextStep" class="space-y-6">
                    <!-- Step 1: User Personal Information -->
                    <div v-if="currentStep === 0" class="space-y-6 animate-fade-in">
                        <div class="bg-emerald-50 rounded-lg p-4 mb-6 border-l-4 border-emerald-500 shadow-sm">
                            <div class="flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                    stroke-width="1.5" stroke="currentColor" class="w-5 h-5 text-emerald-600 mr-2">
                                    <path stroke-linecap="round" stroke-linejoin="round"
                                        d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                                </svg>
                                <p class="text-emerald-700">We've pre-filled some information from your account. Please
                                    verify and complete any missing fields.</p>
                            </div>
                        </div>

                        <div class="space-y-5">
                            <div class="bg-gray-50 rounded-lg p-4">
                                <label class="block text-gray-700 text-sm font-medium mb-1">Full Name</label>
                                <div class="p-inputtext-wrapper w-full">
                                    <InputText v-model="fullName" class="w-full p-3 bg-gray-100 border-0" disabled />
                                </div>
                            </div>

                            <div class="bg-gray-50 rounded-lg p-4">
                                <label class="block text-gray-700 text-sm font-medium mb-1">Email</label>
                                <div class="p-inputtext-wrapper w-full">
                                    <InputText v-model="email" class="w-full p-3 bg-gray-100 border-0" disabled />
                                </div>
                            </div>

                            <div class="rounded-lg p-4 bg-white shadow-sm border border-gray-200">
                                <label for="phoneNumber" class="block text-gray-700 text-sm font-medium mb-1">
                                    Philippines Mobile Number <span class="text-red-500">*</span>
                                </label>
                                <div class="p-inputmask-wrapper w-full">
                                    <InputMask id="phoneNumber" v-model="phoneNumber" mask="+63 999 999 9999"
                                        placeholder="+63 9XX XXX XXXX" class="w-full p-3 border-2"
                                        :class="{ 'border-red-300 bg-red-50': submitted && !phoneNumber, 'border-gray-300': !(submitted && !phoneNumber) }" />
                                </div>
                                <div class="flex items-center mt-2 text-gray-500 text-xs">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                        stroke-width="1.5" stroke="currentColor" class="w-4 h-4 mr-1">
                                        <path stroke-linecap="round" stroke-linejoin="round"
                                            d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
                                    </svg>
                                    Format: +63 9XX XXX XXXX (Philippines mobile format)
                                </div>
                                <small v-if="submitted && !phoneNumber" class="text-red-500 block mt-1">
                                    Phone number is required
                                </small>
                            </div>
                        </div>
                    </div>

                    <!-- Step 2: Farm Information - Enhanced styling -->
                    <div v-if="currentStep === 1" class="space-y-6 animate-fade-in">
                        <div class="bg-emerald-50 rounded-lg p-4 mb-6 border-l-4 border-emerald-500 shadow-sm">
                            <div class="flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                    stroke-width="1.5" stroke="currentColor" class="w-5 h-5 text-emerald-600 mr-2">
                                    <path stroke-linecap="round" stroke-linejoin="round"
                                        d="M9 12.75l3 3m0 0l3-3m-3 3v-7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <p class="text-emerald-700">Tell us about your farm to customize your experience.</p>
                            </div>
                        </div>

                        <div class="rounded-lg p-4 bg-white shadow-sm border border-gray-200">
                            <label for="farmName" class="block text-gray-700 text-sm font-medium mb-1">
                                Farm Name <span class="text-red-500">*</span>
                            </label>
                            <div class="p-inputtext-wrapper w-full">
                                <InputText id="farmName" v-model="farmName" placeholder="Enter your farm name"
                                    class="w-full p-3 border-2"
                                    :class="{ 'border-red-300 bg-red-50': submitted && !farmName, 'border-gray-300': !(submitted && !farmName) }" />
                            </div>
                            <small v-if="submitted && !farmName" class="text-red-500 block mt-1">
                                Farm name is required
                            </small>
                        </div>

                        <div class="rounded-lg p-4 bg-white shadow-sm border border-gray-200">
                            <label for="farmType" class="block text-gray-700 text-sm font-medium mb-1">
    Farm Type <span class="text-red-500">*</span>
</label>
<div class="p-dropdown-wrapper w-full">
    <Dropdown id="farmType" v-model="farmType" :options="farmTypeOptions" optionLabel="label" optionValue="value"
        placeholder="Select farm type" class="w-full"
        :class="{ 'p-invalid': submitted && !farmType }" />
</div>
<small v-if="submitted && !farmType" class="text-red-500 block mt-1">
    Farm type is required
</small>
</div>

<div class="rounded-lg p-4 bg-white shadow-sm border border-gray-200">
<label for="farmLocation" class="block text-gray-700 text-sm font-medium mb-1">
    Farm Location <span class="text-red-500">*</span>
</label>
<div class="p-inputtext-wrapper w-full">
    <InputText id="farmLocation" v-model="farmLocation" placeholder="Enter your farm address"
        class="w-full p-3 border-2"
        :class="{ 'border-red-300 bg-red-50': submitted && !farmLocation, 'border-gray-300': !(submitted && !farmLocation) }" />
</div>
<small v-if="submitted && !farmLocation" class="text-red-500 block mt-1">
    Farm location is required
</small>
</div>

<div class="rounded-lg p-4 bg-white shadow-sm border border-gray-200">
<label for="livestockTypes" class="block text-gray-700 text-sm font-medium mb-1">
    Livestock Types
</label>
<div class="p-multiselect-wrapper w-full">
    <Dropdown id="livestockTypes" v-model="livestockTypes" :options="livestockTypeOptions" optionLabel="label"
        optionValue="value" placeholder="Select livestock types" class="w-full" multiple />
</div>
</div>

<div class="rounded-lg p-4 bg-white shadow-sm border border-gray-200">
<label for="farmDescription" class="block text-gray-700 text-sm font-medium mb-1">
    Farm Description
</label>
<div class="p-textarea-wrapper w-full">
    <Textarea id="farmDescription" v-model="farmDescription" rows="4" class="w-full p-3"
        placeholder="Brief description of your farm operations..." />
</div>
</div>

<div class="rounded-lg p-4 bg-white shadow-sm border border-gray-200">
<label for="farmCertifications" class="block text-gray-700 text-sm font-medium mb-1">
    Farm Certifications
</label>
<div class="p-multiselect-wrapper w-full">
    <Dropdown id="farmCertifications" v-model="farmCertifications" :options="farmCertificationOptions"
        optionLabel="label" optionValue="value" placeholder="Select certifications" class="w-full" multiple />
</div>
</div>
</div>

<!-- Step 3: Document Upload & Terms - Enhanced styling -->
<div v-if="currentStep === 2" class="space-y-6 animate-fade-in">
<div class="bg-emerald-50 rounded-lg p-4 mb-6 border-l-4 border-emerald-500 shadow-sm">
    <div class="flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
            stroke="currentColor" class="w-5 h-5 text-emerald-600 mr-2">
            <path stroke-linecap="round" stroke-linejoin="round"
                d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
        </svg>
        <p class="text-emerald-700">Please upload valid documentation to verify your farm.</p>
    </div>
</div>

<div class="rounded-lg p-4 bg-white shadow-sm border border-gray-200">
    <label class="block text-gray-700 text-sm font-medium mb-2">
        Upload Farm Documentation
    </label>
    <!-- Document upload with enhanced preview functionality -->
    <FileUpload mode="basic" name="farm_docs[]" :customUpload="true" @uploader="onFileUpload"
        accept="image/*,.pdf" :multiple="true" :auto="true" chooseLabel="Browse Files"
        class="w-full">
        <template #empty>
            <p class="text-gray-500 text-center p-6">
                Drag and drop files here or click to upload
            </p>
        </template>
    </FileUpload>

    <!-- Document preview area -->
    <div v-if="uploadedImagePreview" class="mt-4 relative">
        <div class="border rounded-lg p-2 relative">
            <div class="absolute top-2 right-2 z-10">
                <button type="button" @click="removeUploadedImage"
                    class="bg-red-500 hover:bg-red-600 text-white rounded-full p-1 shadow-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                        stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
            <img :src="uploadedImagePreview" alt="Document preview" class="max-h-40 mx-auto object-contain" />
        </div>
    </div>
    
    <div class="flex items-center mt-3 text-xs text-gray-500">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
            stroke="currentColor" class="w-4 h-4 mr-1">
            <path stroke-linecap="round" stroke-linejoin="round"
                d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
        </svg>
        Accepted formats: JPG, PNG, PDF (max 5MB each)
    </div>
</div>

<div class="rounded-lg p-4 bg-white shadow-sm border border-gray-200">
    <div class="flex items-start gap-3">
        <div class="pt-0.5">
            <Checkbox v-model="termsAccepted" :binary="true" inputId="terms"
                :class="{ 'p-invalid': submitted && !termsAccepted }" />
        </div>
        <label for="terms" class="text-gray-700 text-sm">
            I agree to the <a href="#" class="text-emerald-600 hover:underline">Terms and Conditions</a> and
            <a href="#" class="text-emerald-600 hover:underline">Privacy Policy</a>. I confirm that all
            information provided is accurate and complete.
            <span v-if="submitted && !termsAccepted" class="text-red-500 block mt-1">
                You must accept the terms to continue
            </span>
        </label>
    </div>
</div>
</div>

<!-- Step 4: Farm Visit Scheduling - Enhanced styling -->
<div v-if="currentStep === 3" class="space-y-6 animate-fade-in">
<div class="bg-emerald-50 rounded-lg p-4 mb-6 border-l-4 border-emerald-500 shadow-sm">
    <div class="flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
            stroke="currentColor" class="w-5 h-5 text-emerald-600 mr-2">
            <path stroke-linecap="round" stroke-linejoin="round"
                d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
        </svg>
        <p class="text-emerald-700">Schedule a farm visit from our agricultural advisor.</p>
    </div>
</div>

<div class="rounded-lg p-4 bg-white shadow-sm border border-gray-200">
    <label for="visitDate" class="block text-gray-700 text-sm font-medium mb-1">
        Preferred Visit Date <span class="text-red-500">*</span>
    </label>
    <div class="p-calendar-wrapper w-full">
        <Calendar id="visitDate" v-model="visitDate" :minDate="new Date()" class="w-full"
            :class="{ 'p-invalid': submitted && !visitDate }" placeholder="Select a date" />
    </div>
    <small v-if="submitted && !visitDate" class="text-red-500 block mt-1">
        Visit date is required
    </small>
</div>

<div class="rounded-lg p-4 bg-white shadow-sm border border-gray-200">
    <label for="visitTime" class="block text-gray-700 text-sm font-medium mb-1">
        Preferred Time Slot <span class="text-red-500">*</span>
    </label>
    <div class="p-dropdown-wrapper w-full">
        <Dropdown id="visitTime" v-model="visitTime" :options="timeSlotOptions" optionLabel="label"
            optionValue="value" placeholder="Select time slot" class="w-full"
            :class="{ 'p-invalid': submitted && !visitTime }" />
    </div>
    <small v-if="submitted && !visitTime" class="text-red-500 block mt-1">
        Time slot is required
    </small>
</div>

<div class="rounded-lg p-4 bg-white shadow-sm border border-gray-200">
    <label for="contactPreference" class="block text-gray-700 text-sm font-medium mb-1">
        Preferred Contact Method <span class="text-red-500">*</span>
    </label>
    <div class="p-dropdown-wrapper w-full">
        <Dropdown id="contactPreference" v-model="contactPreference" :options="contactPreferenceOptions"
            optionLabel="label" optionValue="value" placeholder="Select contact method" class="w-full"
            :class="{ 'p-invalid': submitted && !contactPreference }" />
    </div>
    <small v-if="submitted && !contactPreference" class="text-red-500 block mt-1">
        Contact method is required
    </small>
</div>

<div class="rounded-lg p-4 bg-white shadow-sm border border-gray-200">
    <label for="additionalNotes" class="block text-gray-700 text-sm font-medium mb-1">
        Additional Notes
    </label>
    <div class="p-textarea-wrapper w-full">
        <Textarea id="additionalNotes" v-model="additionalNotes" rows="3" class="w-full p-3"
            placeholder="Any specific requirements or instructions for the farm visit..." />
    </div>
</div>
</div>

<!-- Form navigation buttons with improved styling -->
<div class="flex justify-between pt-6 border-t border-gray-200 mt-8">
<Button type="button" @click="prevStep" v-if="currentStep > 0" class="px-6 py-2"
    :disabled="loading" outlined>
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
        stroke="currentColor" class="w-5 h-5 mr-1">
        <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
    </svg>
    Back
</Button>
<div v-else></div>

<Button type="submit" :loading="loading" class="px-6 py-2" severity="success">
    <span v-if="currentStep < 3">
        Continue
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
            stroke="currentColor" class="w-5 h-5 ml-1">
            <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
        </svg>
    </span>
    <span v-else>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
            stroke="currentColor" class="w-5 h-5 mr-1">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Complete Registration
    </span>
</Button>
</div>
</form>
</div>
</div>

<!-- Footer with brand info and additional links -->
<div class="max-w-6xl mx-auto mt-12 text-center text-gray-600 text-sm">
<p>© 2025 LivestoX Farm Management. All rights reserved.</p>
<div class="flex justify-center space-x-4 mt-3">
<a href="#" class="text-emerald-600 hover:text-emerald-700">About Us</a>
<a href="#" class="text-emerald-600 hover:text-emerald-700">Contact</a>
<a href="#" class="text-emerald-600 hover:text-emerald-700">Privacy Policy</a>
<a href="#" class="text-emerald-600 hover:text-emerald-700">Terms & Conditions</a>
</div>
</div>
</div>
</template>

<style scoped>
/* Fade in animation for step transitions */
.animate-fade-in {
animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
from {
    opacity: 0;
    transform: translateY(5px);
}
to {
    opacity: 1;
    transform: translateY(0);
}
}

/* Fix for PrimeVue components to match our styling */
:deep(.p-dropdown),
:deep(.p-calendar),
:deep(.p-multiselect) {
width: 100%;
}

:deep(.p-dropdown-label),
:deep(.p-calendar-input),
:deep(.p-multiselect-label) {
padding: 0.75rem 1rem;
}

:deep(.p-button) {
display: flex;
align-items: center;
}

:deep(.p-calendar-w-btn .p-datepicker-trigger) {
background-color: #10b981;
border-color: #10b981;
}

:deep(.p-calendar-w-btn .p-datepicker-trigger:hover) {
background-color: #059669;
border-color: #059669;
}

/* Improved styling for checkboxes */
:deep(.p-checkbox .p-checkbox-box.p-highlight) {
background-color: #10b981;
border-color: #10b981;
}

:deep(.p-checkbox:not(.p-checkbox-disabled) .p-checkbox-box.p-highlight:hover) {
background-color: #059669;
border-color: #059669;
}

/* File upload styling */
:deep(.p-fileupload-choose) {
background-color: #10b981;
border-color: #10b981;
}

:deep(.p-fileupload-choose:hover) {
background-color: #059669;
border-color: #059669;
}
</style>