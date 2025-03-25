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
import InputNumber from 'primevue/inputnumber';
import FileUpload from 'primevue/fileupload';

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
        InputNumber,
        FileUpload
    },
    setup() {
        const router = useRouter();
        const toast = useToast();

        // User Personal Information (pre-filled)
        const fullName = ref<string>('John Doe'); // This would typically come from user's existing account
        const email = ref<string>('john.doe@example.com'); // Pre-filled from existing account
        const phoneNumber = ref<string>(''); // Optional phone number field

        // Farm-specific form fields
        const farmName = ref<string>('');
        const farmType = ref<string>('');
        const farmSize = ref<number | null>(null);
        const farmLocation = ref<string>('');
        const farmDescription = ref<string>('');
        const livestockTypes = ref<string[]>([]);
        const farmCertifications = ref<string[]>([]);

        // New document upload and terms fields
        const idDocuments = ref<File[]>([]);
        const termsAccepted = ref<boolean>(false);

        // Verification fields
        const verificationCode = ref<string>('');
        const verificationSent = ref<boolean>(false);

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

            // Validate phone number format (basic check)
            const phoneRegex = /^\(\d{3}\) \d{3}-\d{4}$/;
            if (!phoneRegex.test(phoneNumber.value)) {
                toast.add({
                    severity: 'error',
                    summary: 'Invalid Phone Number',
                    detail: 'Please enter a valid phone number',
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

            if (!farmSize.value || farmSize.value <= 0) {
                toast.add({
                    severity: 'warn',
                    summary: 'Invalid Farm Size',
                    detail: 'Please enter a valid farm size',
                    life: 3000
                });
                return false;
            }

            return true;
        };

        // New validation for document upload and terms
        const validateDocumentsAndTerms = (): boolean => {
            if (idDocuments.value.length === 0) {
                toast.add({
                    severity: 'warn',
                    summary: 'Missing Documents',
                    detail: 'Please upload at least one valid identification document',
                    life: 3000
                });
                return false;
            }

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

        const validateVerification = (): boolean => {
            if (!verificationCode.value) {
                toast.add({
                    severity: 'warn',
                    summary: 'Missing Information',
                    detail: 'Please enter the verification code',
                    life: 3000
                });
                return false;
            }

            // Verification code validation (6 digits)
            if (verificationCode.value.length !== 6) {
                toast.add({
                    severity: 'error',
                    summary: 'Invalid Code',
                    detail: 'Verification code must be 6 digits',
                    life: 3000
                });
                return false;
            }

            return true;
        };

        // File upload handler
        const onFileUpload = (event: any) => {
            const files = event.files;
            idDocuments.value = files;

            toast.add({
                severity: 'success',
                summary: 'Documents Uploaded',
                detail: `${files.length} document(s) uploaded successfully`,
                life: 3000
            });
        };

        // Send verification code
        const sendVerificationCode = async () => {
            try {
                loading.value = true;

                // Simulate API call
                await new Promise(resolve => setTimeout(resolve, 1000));

                verificationSent.value = true;

                toast.add({
                    severity: 'success',
                    summary: 'Verification Code Sent',
                    detail: 'A verification code has been sent to your registered email',
                    life: 3000
                });
            } catch (error) {
                toast.add({
                    severity: 'error',
                    summary: 'Failed to Send Code',
                    detail: 'There was an error sending the verification code',
                    life: 3000
                });
            } finally {
                loading.value = false;
            }
        };

        // Resend verification code
        const resendVerificationCode = async () => {
            try {
                loading.value = true;

                // Simulate API call
                await new Promise(resolve => setTimeout(resolve, 1000));

                toast.add({
                    severity: 'success',
                    summary: 'Code Resent',
                    detail: 'A new verification code has been sent to your email',
                    life: 3000
                });
            } catch (error) {
                toast.add({
                    severity: 'error',
                    summary: 'Failed to Resend',
                    detail: 'There was an error sending the verification code',
                    life: 3000
                });
            } finally {
                loading.value = false;
            }
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
                    isValid = validateVerification();
                    break;
            }

            if (isValid) {
                if (currentStep.value < 3) {
                    currentStep.value++;
                    submitted.value = false;

                    // If moving to verification step, automatically send code
                    if (currentStep.value === 3 && !verificationSent.value) {
                        sendVerificationCode();
                    }
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

                // Replace with your actual farm account upgrade logic
                await new Promise(resolve => setTimeout(resolve, 1000));

                // Mock successful farm account upgrade
                toast.add({
                    severity: 'success',
                    summary: 'Farm Account Upgraded',
                    detail: `Welcome to LivestoX Farm Network, ${farmName.value}!`,
                    life: 3000
                });

                // Navigate to farm dashboard or profile
                router.push('/farm-dashboard');
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
            farmSize,
            farmLocation,
            farmDescription,
            livestockTypes,
            farmCertifications,

            // New document upload and terms fields
            idDocuments,
            termsAccepted,
            onFileUpload,

            // Verification fields
            verificationCode,
            verificationSent,

            // Form states
            loading,
            submitted,
            currentStep,

            // Form options
            farmTypeOptions,
            livestockTypeOptions,
            farmCertificationOptions,

            // Functions
            nextStep,
            prevStep,
            handleSubmit,
            sendVerificationCode,
            resendVerificationCode
        };
    }
});
</script>

<template>
    <div class="flex min-h-screen bg-gradient-to-b from-green-200 to-green-900">
        <Toast position="top-right" />
        <div class="flex flex-col md:flex-row bg-white rounded-3xl shadow-2xl m-auto w-full max-w-6xl overflow-hidden">
            <div class="w-full p-8 md:p-12 flex flex-col justify-center relative">
                <div class="mb-8 text-center">
                    <h1 class="text-3xl font-bold mb-3 text-green-700">Upgrade to Farm Account</h1>
                    <p class="text-gray-600">Complete your farm profile</p>
                </div>

                <!-- Steps indicator -->
                <div class="mb-8">
                    <div class="flex flex-col space-y-2">
                        <div class="flex justify-between">
                            <span class="text-sm text-gray-600">Step {{ currentStep + 1 }} of 4</span>
                            <span class="text-sm text-gray-600">
                                {{ ['Personal Info', 'Farm Details', 'Document Upload', 'Verification'][currentStep] }}
                            </span>
                        </div>
                        <div class="w-full bg-gray-200 rounded-full h-2.5">
                            <div class="bg-green-600 h-2.5 rounded-full transition-all duration-300 ease-in-out"
                                :style="{ width: `${(currentStep + 1) * 25}%` }"></div>
                        </div>
                    </div>
                </div>

                <form @submit.prevent="nextStep" class="w-full max-w-md mx-auto">
                    <!-- Step 1: User Personal Information -->
                    <div v-if="currentStep === 0">
                        <div class="mb-6">
                            <label class="block text-gray-700 font-medium mb-2">Full Name</label>
                            <InputText 
                                v-model="fullName" 
                                class="w-full p-3" 
                                disabled 
                            />
                        </div>

                        <div class="mb-6">
                            <label class="block text-gray-700 font-medium mb-2">Email</label>
                            <InputText 
                                v-model="email" 
                                class="w-full p-3" 
                                disabled 
                            />
                        </div>

                        <div class="mb-6">
                            <label for="phoneNumber" class="block text-gray-700 font-medium mb-2">Phone Number *</label>
                            <InputMask 
                                id="phoneNumber"
                                v-model="phoneNumber" 
                                mask="(999) 999-9999" 
                                placeholder="(___) ___-____" 
                                class="w-full p-3"
                                :class="{ 'p-invalid': submitted && !phoneNumber }"
                            />
                            <small v-if="submitted && !phoneNumber" class="p-error block mt-1">
                                Phone number is required.
                            </small>
                        </div>
                    </div>

                    <!-- Step 2: Farm Information -->
                    <div v-if="currentStep === 1">
                        <div class="mb-6">
                            <label for="farmName" class="block text-gray-700 font-medium mb-2">Farm Name *</label>
                            <InputText 
                                id="farmName" 
                                v-model="farmName" 
                                placeholder="Enter your farm name" 
                                class="w-full p-3" 
                                :class="{ 'p-invalid': submitted && !farmName }"
                            />
                            <small v-if="submitted && !farmName" class="p-error block mt-1">
                                Farm name is required.
                            </small>
                        </div>

                        <div class="flex gap-4 mb-6">
                            <div class="flex-1">
                                <label for="farmType" class="block text-gray-700 font-medium mb-2">Farm Type *</label>
                                <Dropdown 
                                    id="farmType" 
                                    v-model="farmType" 
                                    :options="farmTypeOptions" 
                                    optionLabel="label" 
                                    optionValue="value" 
                                    placeholder="Select farm type" 
                                    class="w-full"
                                    :class="{ 'p-invalid': submitted && !farmType }"
                                />
                                <small v-if="submitted && !farmType" class="p-error block mt-1">
                                    Farm type is required.
                                </small>
                            </div>

                            <div class="flex-1">
                                <label for="farmSize" class="block text-gray-700 font-medium mb-2">Farm Size (acres) *</label>
                                <InputNumber 
                                    id="farmSize" 
                                    v-model="farmSize" 
                                    placeholder="Enter farm size" 
                                    class="w-full" 
                                    :min="0"
                                    :class="{ 'p-invalid': submitted && (!farmSize || farmSize <= 0) }"
                                />
                                <small v-if="submitted && (!farmSize || farmSize <= 0)" class="p-error block mt-1">
                                    Valid farm size is required.
                                </small>
                            </div>
                        </div>

                        <div class="mb-6">
                            <label for="farmLocation" class="block text-gray-700 font-medium mb-2">Farm Location *</label>
                            <InputText 
                                id="farmLocation" 
                                v-model="farmLocation" 
                                placeholder="City, State/Province, Country" 
                                class="w-full p-3" 
                                :class="{ 'p-invalid': submitted && !farmLocation }"
                            />
                            <small v-if="submitted && !farmLocation" class="p-error block mt-1">
                                Farm location is required.
                            </small>
                        </div>

                        <div class="mb-6">
                            <label for="farmDescription" class="block text-gray-700 font-medium mb-2">Farm Description</label>
                            <Textarea 
                                id="farmDescription" 
                                v-model="farmDescription" 
                                placeholder="Tell us about your farm" 
                                class="w-full" 
                                rows="3"
                            />
                        </div>

                        <div class="flex gap-4 mb-6">
                            <div class="flex-1">
                                <label class="block text-gray-700 font-medium mb-2">Livestock Types</label>
                                <div class="flex flex-wrap gap-3">
                                    <div v-for="option in livestockTypeOptions" :key="option.value" class="flex items-center">
                                        <Checkbox 
                                            :id="option.value" 
                                            :value="option.value" 
                                            v-model="livestockTypes" 
                                            binary 
                                            class="mr-2"
                                        />
                                        <label :for="option.value">{{ option.label }}</label>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="mb-6">
                            <label class="block text-gray-700 font-medium mb-2">Farm Certifications</label>
                            <div class="flex flex-wrap gap-3">
                                <div v-for="option in farmCertificationOptions" :key="option.value" class="flex items-center">
                                    <Checkbox 
                                        :id="option.value" 
                                        :value="option.value" 
                                        v-model="farmCertifications" 
                                        binary 
                                        class="mr-2"
                                    />
                                    <label :for="option.value">{{ option.label }}</label>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Step 3: Document Upload -->
                    <div v-if="currentStep === 2">
                        <div class="mb-6 text-center">
                            <div class="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-left">
                                <h3 class="text-green-700 font-medium mb-2">Document Verification</h3>
                                <p class="text-gray-600 text-sm">
                                    Please upload a valid government-issued ID or farm registration document 
                                    to verify your farm account.
                                </p>
                            </div>

                            <div class="mb-6">
                                <label class="block text-gray-700 font-medium mb-2 text-left">
                                    Upload Documents *
                                </label>
                                <FileUpload 
                                    mode="basic" 
                                    name="idDocuments" 
                                    url="/upload" 
                                    accept=".pdf,.jpg,.jpeg,.png" 
                                    :maxFileSize="5000000"
                                    @upload="onFileUpload"
                                    chooseLabel="Select Files"
                                    multiple
                                />
                                <small class="text-gray-500 block mt-2">
                                    Accepted formats: PDF, JPG, PNG (max 5MB per file)
                                </small>
                            </div>

                            <div class="mb-6">
                                <div class="flex items-center">
                                    <Checkbox 
                                        id="termsAndConditions" 
                                        v-model="termsAccepted" 
                                        :binary="true" 
                                        class="mr-2"
                                    />
                                    <label for="termsAndConditions" class="text-sm">
                                        I accept the 
                                        <a href="#" class="text-green-600 underline">
                                            Terms and Conditions
                                        </a>
                                    </label>
                                </div>
                                <small 
                                    v-if="submitted && !termsAccepted" 
                                    class="p-error block mt-1"
                                >
                                    You must accept the terms and conditions.
                                </small>
                            </div>
                        </div>
                    </div>

                    <!-- Step 4: Verification -->
                    <div v-if="currentStep === 3">
                        <div class="mb-6 text-center">
                            <div class="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-left">
                                <h3 class="text-green-700 font-medium mb-2">Verification Required</h3>
                                <p class="text-gray-600 text-sm">
                                    We've sent a 6-digit verification code to your registered email. 
                                    Please enter the code below to verify your farm account upgrade.
                                </p>
                            </div>

                            <div class="mb-6">
                                <label for="verificationCode" class="block text-gray-700 font-medium mb-2 text-left">
                                    Verification Code *
                                </label>
                                <InputMask 
                                    id="verificationCode" 
                                    v-model="verificationCode" 
                                    mask="999999" 
                                    placeholder="Enter 6-digit code" 
                                    class="w-full p-3 text-center tracking-widest text-lg"
                                    :class="{ 'p-invalid': submitted && !verificationCode }" 
                                />
                                <small v-if="submitted && !verificationCode" class="p-error block mt-1 text-left">
                                    Verification code is required.
                                </small>
                            </div>

                            <Button 
                                type="button" 
                                label="Resend Code" 
                                class="p-button-text p-3" 
                                @click="resendVerificationCode" 
                                :loading="loading" 
                            />

                            <p class="text-sm text-gray-500 mt-4">
                                Didn't receive the code? Check your spam folder or try resending after 60 seconds.
                            </p>
                        </div>
                    </div>

                    <!-- Navigation buttons -->
                    <div class="flex justify-between mt-8">
                        <Button 
                            v-if="currentStep > 0" 
                            type="button" 
                            label="Previous" 
                            class="p-button-outlined p-3" 
                            @click="prevStep" 
                        />
                        <div v-else class="flex-1"></div>

                        <Button 
                            type="submit" 
                            :label="currentStep < 3 ? 'Next' : 'Upgrade Account'" 
                            class="p-3 shadow-lg" 
                            :loading="loading" 
                        />
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>