<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import Toast from 'primevue/toast';
import InputText from 'primevue/inputtext';
import Password from 'primevue/password';
import Button from 'primevue/button';
import Checkbox from 'primevue/checkbox';
import Divider from 'primevue/divider';
import ProgressSpinner from 'primevue/progressspinner';
import Dropdown from 'primevue/dropdown';
import InputMask from 'primevue/inputmask';
import Calendar from 'primevue/calendar';
import InputNumber from 'primevue/inputnumber';
import { checkEmailAvailable, checkUsernameAvailable, resendEmailOtp, signUpBuyer, verifyEmailOtp } from '../../lib/aut';
import imageUrl from '/src/assets/vue.svg';
import { useAuthStore } from '../../stores/authContext';
import LeftPanel from '../../components/Auth/LeftPanel.vue';

export default defineComponent({
    name: 'SignUpPage',
    components: {
        Toast,
        InputText,
        Password,
        Button,
        Checkbox,
        Divider,
        ProgressSpinner,
        Dropdown,
        InputMask,
        Calendar,
        InputNumber,
        LeftPanel
    },
    setup() {
        const router = useRouter();
        const toast = useToast();

        // Form fields
        const firstName = ref<string>('');
        const lastName = ref<string>('');
        const username = ref<string>('');
        const email = ref<string>('');
        const phoneNumber = ref<string>('');
        const gender = ref<string>('');
        const password = ref<string>('');
        const confirmPassword = ref<string>('');
        const verificationCode = ref<string>('');
        const agreeToTerms = ref<boolean>(false);
        const receiveMarketingEmails = ref<boolean>(false);

        // Form states
        const loading = ref<boolean>(false);
        const submitted = ref<boolean>(false);
        const currentStep = ref<number>(0);
        const verificationSent = ref<boolean>(false);
        const usernameAvailable = ref<boolean>(false);
        const usernameError = ref<string>('');
        const additionalInfo = ref({
            firstname: '',
            lastname: '',
            username: '',
            gender: '',
            phone: '',
            role: ''
        });

        // Form options
        const genderOptions = [
            { label: 'Male', value: 'male' },
            { label: 'Female', value: 'female' },
            { label: 'Non-binary', value: 'non-binary' },
            { label: 'Prefer not to say', value: 'not-specified' }
        ];

        const authStore = useAuthStore();

        // Step titles
        const stepTitles = [
            'Create Your Account',
            'Secure Your Account',
            'Verify Your Identity',
            'Complete Registration'
        ];

        // Debounce function implementation
        function debounce(fn: Function, delay: number) {
            let timeout: ReturnType<typeof setTimeout>;
            return function (...args: any[]) {
                clearTimeout(timeout);
                timeout = setTimeout(() => fn(...args), delay);
            };
        }

        // Debounced username check
        const debouncedCheckUsernameAvailability = debounce(() => {
            checkUsernameAvailability();
        }, 500);

        // Validation functions
        const validatePersonalInfo = async (): Promise<boolean> => {
            if (!firstName.value || !lastName.value || !username.value || !email.value || !phoneNumber.value || !gender.value) {
                toast.add({
                    severity: 'warn',
                    summary: 'Missing Information',
                    detail: 'Please fill in all required personal information fields',
                    life: 3000
                });
                return false;
            }

            // Username validation
            const usernameRegex = /^[a-zA-Z0-9_-]{4,16}$/;
            if (!usernameRegex.test(username.value)) {
                usernameError.value = 'Username must be 4-16 characters and can only contain letters, numbers, underscores and hyphens';
                toast.add({
                    severity: 'error',
                    summary: 'Invalid Username',
                    detail: usernameError.value,
                    life: 3000
                });
                return false;
            }

            if (!usernameAvailable.value) {
                toast.add({
                    severity: 'error',
                    summary: 'Username Not Available',
                    detail: 'Please choose a different username',
                    life: 3000
                });
                return false;
            }

            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email.value)) {
                toast.add({
                    severity: 'error',
                    summary: 'Invalid Email',
                    detail: 'Please enter a valid email address',
                    life: 3000
                });
                return false;
            }

            let validEmail = await checkEmailAvailable(email.value);
            if (!validEmail) {
                toast.add({
                    severity: 'error',
                    summary: 'Invalid Email',
                    detail: 'Email already in use',
                    life: 3000
                });
                return false;
            }

            // Phone number validation for Philippines (basic check)
            const phoneValue = phoneNumber.value.replace(/[^0-9]/g, '');
            if (phoneValue.length !== 12 || !phoneValue.startsWith('63')) {
                toast.add({
                    severity: 'error',
                    summary: 'Invalid Phone Number',
                    detail: 'Please enter a valid Philippines phone number starting with +63',
                    life: 3000
                });
                return false;
            }

            return true;
        };

        const validateSecurityInfo = (): boolean => {
            if (!password.value || !confirmPassword.value) {
                toast.add({
                    severity: 'warn',
                    summary: 'Missing Information',
                    detail: 'Please fill in all required security fields',
                    life: 3000
                });
                return false;
            }

            // Password validation - simplified
            if (password.value.length < 8) {
                toast.add({
                    severity: 'error',
                    summary: 'Weak Password',
                    detail: 'Password must be at least 8 characters long',
                    life: 3000
                });
                return false;
            }

            // Less strict password regex that still enforces security
            const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
            if (!passwordRegex.test(password.value)) {
                toast.add({
                    severity: 'error',
                    summary: 'Password Requirements',
                    detail: 'Password must include at least one uppercase letter, one lowercase letter, one number, and one special character',
                    life: 3000
                });
                return false;
            }

            if (password.value !== confirmPassword.value) {
                toast.add({
                    severity: 'error',
                    summary: 'Password Mismatch',
                    detail: 'Passwords do not match',
                    life: 3000
                });
                return false;
            }

            return true;
        };

        const validateVerificationCode = async (): Promise<boolean> => {
            try {
                await verifyEmailOtp(email.value, verificationCode.value);
            } catch (error) {
                const errorMessage = (error instanceof Error) ? error.message : 'Token has expired or is invalid.';
                toast.add({
                    severity: 'error',
                    summary: 'Invalid Verification Code',
                    detail: errorMessage,
                    life: 3000
                });
                return false;
            };

            if (!verificationCode.value || verificationCode.value.length !== 6) {
                toast.add({
                    severity: 'warn',
                    summary: 'Invalid Verification Code',
                    detail: 'Please enter the 6-digit verification code sent to your email and phone',
                    life: 3000
                });
                return false;
            }

            // Check if the code is numeric
            const codeRegex = /^\d{6}$/;
            if (!codeRegex.test(verificationCode.value)) {
                toast.add({
                    severity: 'error',
                    summary: 'Invalid Code Format',
                    detail: 'Verification code must be 6 digits',
                    life: 3000
                });
                return false;
            }

            return true;
        };

        const validateAgreements = (): boolean => {
            if (!agreeToTerms.value) {
                toast.add({
                    severity: 'warn',
                    summary: 'Terms Agreement Required',
                    detail: 'Please agree to the terms and conditions',
                    life: 3000
                });
                return false;
            }

            return true;
        };

        // Check username availability
        const checkUsernameAvailability = async () => {
            if (!username.value) {
                usernameAvailable.value = false;
                usernameError.value = '';
                return;
            }

            // Check username format first
            const usernameRegex = /^[a-zA-Z0-9_-]{4,16}$/;
            if (!usernameRegex.test(username.value)) {
                usernameError.value = 'Username must be 4-16 characters with only letters, numbers, underscore and hyphen';
                usernameAvailable.value = false;
                return;
            }

            try {
                loading.value = true;
                usernameError.value = '';

                // Simulate API call
                let validUsername = await checkUsernameAvailable(username.value);

                if (!validUsername) {
                    usernameError.value = 'This username is already taken';
                    usernameAvailable.value = false;

                    toast.add({
                        severity: 'warn',
                        summary: 'Username Not Available',
                        detail: 'This username is already taken, please try another',
                        life: 3000
                    });
                } else {
                    usernameAvailable.value = true;

                    toast.add({
                        severity: 'success',
                        summary: 'Username Available',
                        detail: 'This username is available',
                        life: 3000
                    });
                }
            } catch (error) {
                usernameError.value = 'Error checking username availability';
                usernameAvailable.value = false;
            } finally {
                loading.value = false;
            }
        };

        // Send verification code
        const sendVerificationCode = async () => {
            try {
                loading.value = true;

                await signUpBuyer(email.value, confirmPassword.value, additionalInfo.value = {
                    firstname: firstName.value,
                    lastname: lastName.value,
                    username: username.value,
                    gender: gender.value,
                    phone: phoneNumber.value,
                    role: "Buyer"
                });

                verificationSent.value = true;

                toast.add({
                    severity: 'success',
                    summary: 'Verification Code Sent',
                    detail: `A 6-digit verification code has been sent to ${email.value} and ${phoneNumber.value}`,
                    life: 4000
                });

                // Move to verification step
                currentStep.value = 2;
                submitted.value = false;

            } catch (error) {
                toast.add({
                    severity: 'error',
                    summary: 'Failed to Send Code',
                    detail: 'There was an error sending the verification code. Please try again.',
                    life: 3000
                });
            } finally {
                loading.value = false;
            }
        };

        // Navigation functions
        const nextStep = async () => {
            submitted.value = true;

            // Validate current step
            let isValid = false;

            switch (currentStep.value) {
                case 0:
                    isValid = await validatePersonalInfo();
                    break;
                case 1:
                    isValid = validateSecurityInfo();
                    if (isValid) {
                        // Send verification code when security info is validated
                        sendVerificationCode();
                        return; // Early return because sendVerificationCode handles the step change
                    }
                    break;
                case 2:
                    isValid = await validateVerificationCode();
                    break;
                case 3:
                    isValid = validateAgreements();
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

                // Replace with your actual registration logic
                await new Promise(resolve => setTimeout(resolve, 1000));

                // Mock successful registration
                toast.add({
                    severity: 'success',
                    summary: 'Registration Successful',
                    detail: `Welcome to LivestoX, ${firstName.value}! Your account has been created.`,
                    life: 3000
                });

                // Navigate to login page
                router.push('/signin');
            } catch (error) {
                toast.add({
                    severity: 'error',
                    summary: 'Registration Failed',
                    detail: 'There was an error creating your account',
                    life: 3000
                });
            } finally {
                loading.value = false;
            }
        };

        const resendVerificationCode = async () => {
            try {
                loading.value = true;

                await resendEmailOtp(email.value);

                toast.add({
                    severity: 'success',
                    summary: 'Code Resent',
                    detail: 'A new verification code has been sent to your email and phone',
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

        onMounted(() => {
            if (authStore.session) {
                router.push('/signin');
            };
            // Show a welcome toast when component mounts
            setTimeout(() => {
                toast.add({
                    severity: 'info',
                    summary: 'Welcome',
                    detail: 'Create your LivestoX account to start your journey',
                    life: 3000
                });
            }, 500);
        });

        return {
            // Form fields
            firstName,
            lastName,
            username,
            email,
            phoneNumber,
            gender,
            password,
            confirmPassword,
            verificationCode,
            agreeToTerms,
            receiveMarketingEmails,
            additionalInfo,
            // Form states
            loading,
            submitted,
            currentStep,
            verificationSent,
            usernameAvailable,
            usernameError,
            // Form options
            genderOptions,
            stepTitles,
            // Functions
            nextStep,
            prevStep,
            handleSubmit,
            resendVerificationCode,
            checkUsernameAvailability,
            debouncedCheckUsernameAvailability,
            sendVerificationCode,
            // Images
            logoPath: imageUrl
        };
    }
});
</script>

<template>
    <div class="flex min-h-screen bg-gradient-to-br from-blue-100 via-sky-100 to-blue-200">
        <Toast position="top-right" />

        <!-- Main container with modern effect -->
        <div class="w-full max-w-7xl mx-auto my-10 px-4 sm:px-6">

            <!-- Card with elegant shadow and layered effect -->
            <div class="relative bg-white rounded-3xl shadow-2xl overflow-hidden transition-all duration-500">

                <!-- Top accent bar with gradient -->
                <div class="h-2 bg-gradient-to-r from-blue-400 via-sky-500 to-blue-600"></div>

                <!-- Content container -->
                <div class="flex flex-col lg:flex-row">

                    <!-- Left side panel component -->
                    <LeftPanel :logoPath="logoPath" />

                    <!-- Right side - Form content -->
                    <div class="lg:w-7/12 p-6 lg:p-10">
                        <!-- Header with step title -->
                        <div class="text-center mb-8">
                            <h2
                                class="text-3xl font-bold text-gray-800 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-sky-600 mb-2">
                                {{ stepTitles[currentStep] }}</h2>
                            <p class="text-gray-500">Step {{ currentStep + 1 }} of 4</p>

                            <!-- Progress bar -->
                            <div class="mt-8">
                                <div class="w-full bg-gray-100 rounded-full h-2 mb-3">
                                    <div class="bg-gradient-to-r from-blue-400 via-sky-500 to-blue-600 h-2 rounded-full transition-all duration-500 ease-in-out"
                                        :style="{ width: `${(currentStep + 1) * 25}%` }"></div>
                                </div>
                                <!-- Step indicators -->
                                <div class="flex justify-between px-2">
                                    <div v-for="step in 4" :key="step" :class="`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium shadow-md transition-all duration-300 transform
                                            ${step - 1 < currentStep ? 'bg-gradient-to-br from-blue-500 to-sky-600 text-white' :
                                            step - 1 === currentStep ? 'bg-gradient-to-br from-blue-600 to-sky-700 text-white ring-4 ring-blue-100 scale-110' :
                                                'bg-gray-100 text-gray-600 border border-gray-200'}`">
                                        <span v-if="step - 1 < currentStep" class="pi pi-check text-xs"></span>
                                        <span v-else>{{ step }}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Form content -->
                        <form @submit.prevent="nextStep" class="max-w-xl mx-auto">
                            <!-- Step 1: Personal Information -->
                            <div v-if="currentStep === 0" class="space-y-6 animate-fadeSlideIn">
                                <!-- Introduction card -->
                                <div
                                    class="bg-gradient-to-r from-blue-50 to-sky-50 p-5 rounded-2xl border border-blue-100 mb-6 shadow-sm">
                                    <div class="flex items-start">
                                        <div
                                            class="flex-shrink-0 w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                                            <i class="pi pi-user-plus text-blue-600 text-lg"></i>
                                        </div>
                                        <div class="ml-4">
                                            <h3 class="font-semibold text-blue-800">Let's get to know you</h3>
                                            <p class="text-sm text-blue-700 mt-1">Fill in your personal details to
                                                create your LivestoX profile</p>
                                        </div>
                                    </div>
                                </div>

                                <!-- Name fields -->
                                <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    <div class="form-group">
                                        <label for="firstName" class="block text-sm font-medium text-gray-700 mb-1.5">
                                            First Name <span class="text-blue-500">*</span>
                                        </label>
                                        <div class="relative">
                                            <div
                                                class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <i class="pi pi-user text-blue-500 opacity-70"></i>
                                            </div>
                                            <InputText id="firstName" v-model="firstName" placeholder="Your first name"
                                                class="w-full pl-10 pr-3 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition-all"
                                                :class="{ 'border-red-300 focus:border-red-500 focus:ring-red-200': submitted && !firstName }" />
                                        </div>
                                        <small v-if="submitted && !firstName"
                                            class="text-red-500 text-xs mt-1 block">Required field</small>
                                    </div>

                                    <div class="form-group">
                                        <label for="lastName" class="block text-sm font-medium text-gray-700 mb-1.5">
                                            Last Name <span class="text-blue-500">*</span>
                                        </label>
                                        <div class="relative">
                                            <div
                                                class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <i class="pi pi-id-card text-blue-500 opacity-70"></i>
                                            </div>
                                            <InputText id="lastName" v-model="lastName" placeholder="Your last name"
                                                class="w-full pl-10 pr-3 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition-all"
                                                :class="{ 'border-red-300 focus:border-red-500 focus:ring-red-200': submitted && !lastName }" />
                                        </div>
                                        <small v-if="submitted && !lastName"
                                            class="text-red-500 text-xs mt-1 block">Required field</small>
                                    </div>
                                </div>

                                <!-- Username and email fields -->
                                <div class="form-group">
                                    <label for="username" class="block text-sm font-medium text-gray-700 mb-1.5">
                                        Username <span class="text-blue-500">*</span>
                                    </label>
                                    <div class="relative">
                                        <div
                                            class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <i class="pi pi-at text-blue-500 opacity-70"></i>
                                        </div>
                                        <InputText id="username" v-model="username"
                                            placeholder="Choose a unique username"
                                            class="w-full pl-10 pr-10 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition-all"
                                            :class="{
                                                'border-red-300 focus:border-red-500': usernameError || (submitted && !username),
                                                'border-blue-300 focus:border-blue-500': usernameAvailable && username
                                            }" @input="debouncedCheckUsernameAvailability" />

                                        <!-- Username status indicator -->
                                        <div v-if="loading && username"
                                            class="absolute inset-y-0 right-0 pr-3 flex items-center">
                                            <ProgressSpinner style="width:20px;height:20px" strokeWidth="4"
                                                class="text-blue-500" />
                                        </div>
                                        <div v-else-if="username && usernameAvailable"
                                            class="absolute inset-y-0 right-0 pr-3 flex items-center">
                                            <i class="pi pi-check-circle text-blue-500"></i>
                                        </div>
                                        <div v-else-if="username && usernameError"
                                            class="absolute inset-y-0 right-0 pr-3 flex items-center">
                                            <i class="pi pi-times-circle text-red-500"></i>
                                        </div>
                                    </div>
                                    <div class="mt-1">
                                        <small v-if="usernameError" class="text-red-500 text-xs block">{{ usernameError
                                        }}</small>
                                        <small v-else-if="username && usernameAvailable"
                                            class="text-blue-500 text-xs block">Username is available</small>
                                        <small v-else-if="submitted && !username"
                                            class="text-red-500 text-xs block">Required field</small>
                                        <small v-else class="text-gray-500 text-xs block">4-16 characters, letters,
                                            numbers,
                                            underscore, and hyphens only</small>
                                    </div>
                                </div>

                                <div class="form-group">
                                    <label for="email" class="block text-sm font-medium text-gray-700 mb-1.5">
                                        Email Address <span class="text-blue-500">*</span>
                                    </label>
                                    <div class="relative">
                                        <div
                                            class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <i class="pi pi-envelope text-blue-500 opacity-70"></i>
                                        </div>
                                        <InputText id="email" v-model="email" type="email"
                                            placeholder="Your email address"
                                            class="w-full pl-10 pr-3 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition-all"
                                            :class="{ 'border-red-300 focus:border-red-500 focus:ring-red-200': submitted && !email }" />
                                    </div>
                                    <div class="mt-1">
                                        <small v-if="submitted && !email" class="text-red-500 text-xs block">Required
                                            field</small>
                                        <small v-else class="text-gray-500 text-xs block">We'll send a verification code
                                            to this email</small>
                                    </div>
                                </div>

                                <!-- Contact and Gender fields in a row -->
                                <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    <div class="form-group">
                                        <label for="phone" class="block text-sm font-medium text-gray-700 mb-1.5">
                                            Phone Number <span class="text-blue-500">*</span>
                                        </label>
                                        <div class="relative">
                                            <div
                                                class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <i class="pi pi-phone text-blue-500 opacity-70"></i>
                                            </div>
                                            <InputMask id="phone" v-model="phoneNumber" mask="+63 999 999 9999"
                                                placeholder="+63 XXX XXX XXXX"
                                                class="w-full pl-10 pr-3 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition-all"
                                                :class="{ 'border-red-300 focus:border-red-500 focus:ring-red-200': submitted && !phoneNumber }" />
                                        </div>
                                        <small v-if="submitted && !phoneNumber"
                                            class="text-red-500 text-xs mt-1 block">Required field</small>
                                        <small v-else class="text-gray-500 text-xs mt-1 block">Philippines format
                                            (+63)</small>
                                    </div>

                                    <div class="form-group">
                                        <label for="gender" class="block text-sm font-medium text-gray-700 mb-1.5">
                                            Gender <span class="text-blue-500">*</span>
                                        </label>
                                        <div class="relative flex w-full">
                                            <div
                                                class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                                                <i class="pi pi-user text-blue-500 opacity-70"></i>
                                            </div>
                                            <Dropdown id="gender" v-model="gender" :options="genderOptions"
                                                optionLabel="label" optionValue="value" placeholder="Select your gender"
                                                class="w-full" :class="{ 'p-invalid': submitted && !gender }"
                                                :inputStyle="{
                                                    borderRadius: '0.75rem',
                                                    height: '3rem',
                                                    paddingLeft: '2.5rem',
                                                    borderColor: 'rgb(209, 213, 219)',
                                                    width: '100%'
                                                }"
                                                :inputClass="'border border-gray-300 focus:ring-2 focus:ring-blue-200 focus:border-blue-500 shadow-sm transition-all'" />
                                        </div>
                                        <small v-if="submitted && !gender"
                                            class="text-red-500 text-xs mt-1 block">Gender is required</small>
                                        <small v-if="submitted && !gender"
                                            class="text-red-500 text-xs mt-1 block">Required field</small>
                                    </div>
                                </div>
                            </div>

                            <!-- Step 2: Security Information -->
                            <div v-if="currentStep === 1" class="space-y-6 animate-fadeSlideIn">
                                <!-- Security introduction -->
                                <div
                                    class="bg-gradient-to-r from-blue-50 to-sky-50 p-5 rounded-2xl border border-blue-100 mb-6 shadow-sm">
                                    <div class="flex items-start">
                                        <div
                                            class="flex-shrink-0 w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                                            <i class="pi pi-shield text-blue-600 text-lg"></i>
                                        </div>
                                        <div class="ml-4">
                                            <h3 class="font-semibold text-blue-800">Secure your account</h3>
                                            <p class="text-sm text-blue-700 mt-1">Create a strong password to protect
                                                your LivestoX account</p>
                                        </div>
                                    </div>
                                </div>

                                <div class="form-group">
                                    <label for="password" class="block text-sm font-medium text-gray-700 mb-1.5">
                                        Password <span class="text-blue-500">*</span>
                                    </label>
                                    <div class="relative">
                                        <div
                                            class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                                            <i class="pi pi-lock text-blue-500 opacity-70"></i>
                                        </div>
                                        <Password id="password" v-model="password" toggleMask
                                            inputClass="w-full pl-10 pr-3 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition-all"
                                            :class="{ 'p-invalid': submitted && !password, 'w-full': true }"
                                            placeholder="Create a secure password" :feedback="true"
                                            :inputProps="{ style: { width: '100%' } }" />
                                    </div>
                                    <small v-if="submitted && !password"
                                        class="text-red-500 text-xs mt-1 block">Required field</small>
                                </div>

                                <div class="form-group">
                                    <label for="confirmPassword" class="block text-sm font-medium text-gray-700 mb-1.5">
                                        Confirm Password <span class="text-blue-500">*</span>
                                    </label>
                                    <div class="relative">
                                        <div
                                            class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                                            <i class="pi pi-lock text-blue-500 opacity-70"></i>
                                        </div>
                                        <Password id="confirmPassword" v-model="confirmPassword" toggleMask
                                            placeholder="Confirm your password"
                                            inputClass="w-full pl-10 pr-3 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition-all"
                                            :class="{ 'p-invalid': submitted && (!confirmPassword || confirmPassword !== password), 'w-full': true }"
                                            :feedback="true" :inputProps="{ style: { width: '100%' } }" />
                                    </div>
                                    <div class="mt-1">
                                        <small v-if="submitted && !confirmPassword"
                                            class="text-red-500 text-xs block">Required field</small>
                                        <small v-else-if="submitted && confirmPassword !== password"
                                            class="text-red-500 text-xs block">Passwords do not match</small>
                                    </div>
                                </div>

                                <!-- Password requirements callout -->
                                <div class="bg-blue-50 rounded-xl p-4 border border-blue-200">
                                    <h4 class="font-medium text-blue-700 mb-2 flex items-center">
                                        <i class="pi pi-info-circle mr-2 text-blue-500"></i>
                                        Password Requirements
                                    </h4>
                                    <ul class="text-xs text-blue-800 space-y-2">
                                        <li class="flex items-center">
                                            <i class="pi pi-check-circle mr-2 text-green-500"></i>
                                            At least 8 characters long
                                        </li>
                                        <li class="flex items-center">
                                            <i class="pi pi-check-circle mr-2 text-green-500"></i>
                                            Include at least one uppercase letter (A-Z)
                                        </li>
                                        <li class="flex items-center">
                                            <i class="pi pi-check-circle mr-2 text-green-500"></i>
                                            Include at least one lowercase letter (a-z)
                                        </li>
                                        <li class="flex items-center">
                                            <i class="pi pi-check-circle mr-2 text-green-500"></i>
                                            Include at least one number (0-9)
                                        </li>
                                        <li class="flex items-center">
                                            <i class="pi pi-check-circle mr-2 text-green-500"></i>
                                            Include at least one special character (@$!%*?&#)
                                        </li>
                                    </ul>
                                </div>
                            </div>

                            <!-- Step 3: Verification -->
                            <div v-if="currentStep === 2" class="space-y-6 animate-fadeSlideIn">
                                <!-- Verification introduction -->
                                <div
                                    class="bg-gradient-to-r from-sky-50 to-blue-50 p-5 rounded-2xl border border-sky-100 mb-6 shadow-sm">
                                    <div class="flex items-start">
                                        <div
                                            class="flex-shrink-0 w-10 h-10 rounded-xl bg-sky-100 flex items-center justify-center">
                                            <i class="pi pi-check-circle text-sky-600 text-lg"></i>
                                        </div>
                                        <div class="ml-4">
                                            <h3 class="font-semibold text-sky-800">Verify Your Identity</h3>
                                            <p class="text-sm text-sky-700 mt-1">Enter the 6-digit code we sent to your
                                                email</p>
                                        </div>
                                    </div>
                                </div>

                                <!-- Verification animation -->
                                <div class="flex justify-center mb-6">
                                    <div
                                        class="w-16 h-16 rounded-full bg-sky-100 flex items-center justify-center text-sky-500 animate-pulse">
                                        <i class="pi pi-envelope text-2xl"></i>
                                    </div>
                                </div>

                                <div class="text-center mb-6">
                                    <p class="text-gray-600">We've sent a verification code to:</p>
                                    <p class="font-medium text-sky-600">{{ email }}</p>
                                </div>

                                <!-- Verification code input -->
                                <div class="form-group">
                                    <label for="verificationCode"
                                        class="block text-sm font-medium text-gray-700 mb-1.5">
                                        Verification Code <span class="text-sky-500">*</span>
                                    </label>
                                    <div class="relative">
                                        <div
                                            class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <i class="pi pi-key text-sky-500 opacity-70"></i>
                                        </div>
                                        <InputText id="verificationCode" v-model="verificationCode"
                                            placeholder="Enter 6-digit code"
                                            class="w-full pl-10 pr-3 py-3 text-center tracking-widest text-lg font-medium rounded-xl border border-gray-300 focus:ring-2 focus:ring-sky-200 focus:border-sky-500 transition-all"
                                            :class="{ 'border-red-300 focus:border-red-500 focus:ring-red-200': submitted && !verificationCode }" />
                                    </div>
                                    <small v-if="submitted && !verificationCode"
                                        class="text-red-500 text-xs mt-1 block">Required field</small>
                                </div>

                                <!-- Resend code option -->
                                <div class="text-center mt-4">
                                    <p class="text-sm text-gray-600">
                                        Didn't receive the code?
                                        <button type="button" @click="resendVerificationCode"
                                            class="text-sky-600 hover:text-sky-800 font-medium focus:outline-none">
                                            Resend code
                                        </button>
                                    </p>
                                </div>
                            </div>

                            <!-- Step 4: Final Agreements -->
                            <div v-if="currentStep === 3" class="space-y-6 animate-fadeSlideIn">
                                <!-- Completion intro -->
                                <div
                                    class="bg-gradient-to-r from-blue-50 to-sky-50 p-5 rounded-2xl border border-blue-100 mb-6 shadow-sm">
                                    <div class="flex items-start">
                                        <div
                                            class="flex-shrink-0 w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                                            <i class="pi pi-check text-blue-600 text-lg"></i>
                                        </div>
                                        <div class="ml-4">
                                            <h3 class="font-semibold text-blue-800">Almost There!</h3>
                                            <p class="text-sm text-blue-700 mt-1">Review and accept our terms to
                                                complete your registration</p>
                                        </div>
                                    </div>
                                </div>

                                <!-- Success animation -->
                                <div class="flex justify-center mb-8">
                                    <div
                                        class="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center text-blue-500">
                                        <i class="pi pi-check-circle text-4xl"></i>
                                    </div>
                                </div>

                                <!-- Agreement checkboxes -->
                                <div class="space-y-4">
                                    <div class="flex items-start">
                                        <div class="flex-shrink-0 relative">
                                            <!-- Visible border container -->
                                            <div
                                                class="w-6 h-6 border-2 border-blue-400 rounded-md bg-white shadow-sm flex items-center justify-center">
                                                <!-- Actual checkbox positioned absolutely to fill the container -->
                                                <Checkbox id="terms" v-model="agreeToTerms" :binary="true"
                                                    class="absolute inset-0 w-full h-full opacity-0 z-10 cursor-pointer"
                                                    :class="{ 'p-invalid': submitted && !agreeToTerms }" />
                                                <!-- Custom visible checkbox indicator -->
                                                <div v-if="agreeToTerms"
                                                    class="w-4 h-4 bg-blue-500 rounded flex items-center justify-center">
                                                    <i class="pi pi-check text-white text-xs"></i>
                                                </div>
                                            </div>
                                        </div>
                                        <label for="terms" class="ml-3 text-sm text-gray-700 select-none">
                                            I agree to the <a href="#"
                                                class="text-blue-600 hover:text-blue-800 font-medium">Terms &
                                                Conditions</a>
                                            and <a href="#"
                                                class="text-blue-600 hover:text-blue-800 font-medium">Privacy Policy</a>
                                            <span class="text-red-500">*</span>
                                        </label>
                                    </div>
                                    <small v-if="submitted && !agreeToTerms" class="text-red-500 text-xs block">You must
                                        agree to the terms</small>

                                    <div class="flex items-start">
                                        <div class="flex-shrink-0 relative">
                                            <!-- Visible border container -->
                                            <div
                                                class="w-6 h-6 border-2 border-blue-400 rounded-md bg-white shadow-sm flex items-center justify-center">
                                                <!-- Actual checkbox positioned absolutely to fill the container -->
                                                <Checkbox id="marketing" v-model="receiveMarketingEmails" :binary="true"
                                                    class="absolute inset-0 w-full h-full opacity-0 z-10 cursor-pointer" />
                                                <!-- Custom visible checkbox indicator -->
                                                <div v-if="receiveMarketingEmails"
                                                    class="w-4 h-4 bg-blue-500 rounded flex items-center justify-center">
                                                    <i class="pi pi-check text-white text-xs"></i>
                                                </div>
                                            </div>
                                        </div>
                                        <label for="marketing" class="ml-3 text-sm text-gray-700 select-none">
                                            I agree to receive marketing emails and updates about LivestoX promotions
                                        </label>
                                    </div>
                                </div>

                                <!-- Final message -->
                                <div class="bg-blue-50 rounded-xl p-4 border border-blue-200 text-sm text-blue-800">
                                    <p>By clicking "Complete Registration", you're creating a LivestoX account and you
                                        agree to our Terms of Service and Privacy Policy.</p>
                                </div>
                            </div>

                            <!-- Navigation Buttons -->
                            <div class="mt-10 flex justify-between items-center">
                                <!-- Back button - hidden on first step -->
                                <Button type="button" v-if="currentStep > 0" @click="prevStep"
                                    class="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-sky-600 hover:from-blue-600 hover:to-sky-700 text-white shadow-md hover:shadow-lg transition-all"
                                    :disabled="loading">
                                    <i class="pi pi-arrow-left mr-1"></i>
                                    Back
                                </Button>


                                <!-- Next/Submit button -->
                                <Button type="submit" :loading="loading"
                                    :label="currentStep < 3 ? 'Continue' : 'Complete Registration'"
                                    class="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-sky-600 hover:from-blue-600 hover:to-sky-700 text-white shadow-md hover:shadow-lg transition-all"
                                    :icon="currentStep < 3 ? 'pi pi-arrow-right' : 'pi pi-check'" iconPos="right" />
                            </div>

                            <!-- Already have account link -->
                            <div class="mt-8 text-center">
                                <p class="text-sm text-gray-600">
                                    Already have an account?
                                    <router-link to="/signin" class="text-blue-600 hover:text-blue-800 font-medium">
                                        Sign in instead
                                    </router-link>
                                </p>
                            </div>
                        </form>
                    </div>
                </div>
                <!-- Bottom accent bar -->
                <div class="h-1 bg-gradient-to-r from-transparent via-blue-400 to-transparent"></div>
            </div>
        </div>
    </div>
</template>

<style>
.animate-fadeSlideIn {
    animation: fadeSlideIn 0.4s ease-in-out;
}

@keyframes fadeSlideIn {
    from {
        opacity: 0;
        transform: translateY(10px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>