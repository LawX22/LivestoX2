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
import Carousel from '../../components/Landing/Carousel.vue';
import Steps from 'primevue/steps';
import InputMask from 'primevue/inputmask';
import Calendar from 'primevue/calendar';
import InputNumber from 'primevue/inputnumber';
import { checkEmailAvailable, checkUsernameAvailable, resendEmailOtp, signUpBuyer, verifyEmailOtp } from '../../lib/aut';
import imageUrl from '/src/assets/vue.svg';

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
        Carousel,
        Steps,
        Dropdown,
        InputMask,
        Calendar,
        InputNumber
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
        });

        // Form options
        const genderOptions = [
            { label: 'Male', value: 'male' },
            { label: 'Female', value: 'female' },
            { label: 'Non-binary', value: 'non-binary' },
            { label: 'Prefer not to say', value: 'not-specified' }
        ];

        // Carousel slides data
        const carouselSlides = [
            {
                image: "https://images.unsplash.com/photo-1500595046743-cd271d694d30",
                title: "Join LivestoX Today",
                subtitle: "Your trusted Livestock Online Marketplace",
                quote: "Starting my journey with LivestoX has been one of the best decisions for my farm.",
                author: "David Johnson",
                role: "Dairy Farmer"
            },
            {
                image: "https://images.unsplash.com/photo-1605152276897-4f618f831968",
                title: "Expand Your Network",
                subtitle: "Connect with verified farmers and buyers",
                quote: "LivestoX helped me find quality livestock suppliers that I now work with regularly.",
                author: "Michelle Parker",
                role: "Farm Consultant"
            },
            {
                image: "https://images.unsplash.com/photo-1516467508483-a7212febe31a",
                title: "Streamline Your Business",
                subtitle: "Manage listings, sales, and payments in one place",
                quote: "The platform has simplified how I manage my livestock business and increased my profits.",
                author: "Robert Anderson",
                role: "Livestock Breeder"
            },
            {
                image: "https://images.unsplash.com/photo-1558343434-a78f1bc6c604",
                title: "Trusted by Farmers",
                subtitle: "Join thousands of satisfied farmers",
                quote: "The verification process ensures I'm dealing with legitimate buyers and sellers.",
                author: "Jessica Martinez",
                role: "Small Farm Owner"
            }
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
            if(!validEmail) {
                toast.add({
                    severity: 'error',
                    summary: 'Invalid Email',
                    detail: 'Email already use',
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
            } catch(error) {
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

                // For demo purposes, let's pretend usernames ending with "taken" are already taken
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
                    gender: "test",
                });

                // Simulate API call to send verification code
                // await new Promise(resolve => setTimeout(resolve, 1500));

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
                
                // Simulate API call
                // await new Promise(resolve => setTimeout(resolve, 1000));

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
            // Functions
            nextStep,
            prevStep,
            handleSubmit,
            resendVerificationCode,
            checkUsernameAvailability,
            debouncedCheckUsernameAvailability,
            sendVerificationCode,
            // Other data
            carouselSlides,
            logoPath: imageUrl
        };
    }
});
</script>

<template>
    <div class="flex min-h-screen bg-gradient-to-b from-green-200 to-green-900">
        <Toast position="top-right" />
        <div class="flex flex-col md:flex-row bg-white rounded-3xl shadow-2xl m-auto w-full max-w-6xl overflow-hidden">
            <!-- Left side with form -->
            <div class="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center relative">
                <!-- Background pattern with animated subtle gradient -->
                <div class="absolute inset-0 z-0">
                    <div class="absolute inset-0 opacity-5 bg-gradient-to-tr from-green-300 to-blue-100 animate-gradient"
                        style="background-image: url('data:image/svg+xml,%3Csvg width=\'20\' height=\'20\' viewBox=\'0 0 20 20\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%239AE6B4\' fill-opacity=\'0.4\' fill-rule=\'evenodd\'%3E%3Ccircle cx=\'3\' cy=\'3\' r=\'3\'/%3E%3Ccircle cx=\'13\' cy=\'13\' r=\'3\'/%3E%3C/g%3E%3C/svg%3E');">
                    </div>
                </div>

                <!-- Content -->
                <div class="relative z-10">
                    <div class="mb-8 text-center">
                        <div class="flex justify-center items-center mb-6">
                            <div class="bg-gradient-to-br from-green-400 to-green-600 p-5 rounded-full shadow-lg transform hover:scale-105 transition-transform duration-300">
                                <img :src="logoPath" alt="Logo" class="w-16 h-16 object-contain drop-shadow-md">
                            </div>
                        </div>

                        <h1 class="text-3xl font-bold mb-3 text-green-700">Create an Account</h1>
                        <p class="text-gray-600">Join the LivestoX community and start your journey.</p>
                    </div>
                    
                    <!-- Steps indicator - Enhanced with animation -->
                    <div class="mb-8">
                        <div class="flex flex-col space-y-2">
                            <div class="flex justify-between">
                                <span class="text-sm font-medium text-green-700">Step {{ currentStep + 1 }} of 4</span>
                                <span class="text-sm font-medium text-green-700">{{ ['Personal', 'Security', 'Verify',
                                    'Agreement'][currentStep] }}</span>
                            </div>
                            <div class="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                                <div class="bg-gradient-to-r from-green-500 to-green-700 h-2.5 rounded-full transition-all duration-700 ease-in-out"
                                    :style="{ width: `${(currentStep + 1) * 25}%` }"></div>
                            </div>
                        </div>
                    </div>
                    
                    <form @submit.prevent="nextStep" class="w-full max-w-md mx-auto">
                        <!-- Step 1: Personal Information -->
                        <div v-if="currentStep === 0" class="animate-fadeIn">
                            <div class="flex gap-4 mb-6">
                                <div class="flex-1">
                                    <label for="firstName" class="block text-gray-700 font-medium mb-2">First Name
                                        <span class="text-green-600">*</span></label>
                                    <InputText id="firstName" v-model="firstName" placeholder="First name"
                                        class="w-full p-3 rounded-xl border-2 focus:border-green-500 focus:ring focus:ring-green-200 transition-all"
                                        :class="{ 'border-red-300 focus:border-red-500 focus:ring-red-200': submitted && !firstName }"
                                        aria-describedby="firstName-error" />
                                    <small id="firstName-error" v-if="submitted && !firstName"
                                        class="p-error block mt-1 text-sm">First name is required.</small>
                                </div>
                                <div class="flex-1">
                                    <label for="lastName" class="block text-gray-700 font-medium mb-2">Last Name
                                        <span class="text-green-600">*</span></label>
                                    <InputText id="lastName" v-model="lastName" placeholder="Last name"
                                        class="w-full p-3 rounded-xl border-2 focus:border-green-500 focus:ring focus:ring-green-200 transition-all"
                                        :class="{ 'border-red-300 focus:border-red-500 focus:ring-red-200': submitted && !lastName }"
                                        aria-describedby="lastName-error" />
                                    <small id="lastName-error" v-if="submitted && !lastName"
                                        class="p-error block mt-1 text-sm">Last name is required.</small>
                                </div>
                            </div>

                            <div class="mb-6">
                                <label for="username" class="block text-gray-700 font-medium mb-2">Username 
                                    <span class="text-green-600">*</span></label>
                                <div class="flex items-center">
                                    <div class="relative flex-grow">
                                        <InputText id="username" v-model="username" placeholder="Choose a username"
                                            class="w-full p-3 pl-10 rounded-xl border-2 focus:border-green-500 focus:ring focus:ring-green-200 transition-all"
                                            :class="{ 'border-red-300 focus:border-red-500 focus:ring-red-200': submitted && !username || usernameError,
                                                     'border-green-300 focus:border-green-500': usernameAvailable && !usernameError && username }"
                                            aria-describedby="username-error" @input="debouncedCheckUsernameAvailability" />
                                        <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                                            <i class="pi pi-user"></i>
                                        </span>
                                    </div>
                                    <span v-if="loading" class="ml-2 flex items-center text-blue-500">
                                        <i class="pi pi-spinner pi-spin"></i>
                                    </span>
                                    <span v-if="usernameAvailable && !usernameError && username"
                                        class="ml-2 flex items-center text-green-500">
                                        <i class="pi pi-check"></i>
                                    </span>
                                </div>
                                <small id="username-error" v-if="submitted && !username" class="p-error block mt-1 text-sm">
                                    Username is required.
                                </small>
                                <small v-if="usernameError" class="p-error block mt-1 text-sm">
                                    {{ usernameError }}
                                </small>
                                <small class="text-gray-500 block mt-1 text-sm">
                                    4-16 characters, letters, numbers, underscore and hyphen only
                                </small>
                            </div>

                            <div class="mb-6">
                                <label for="email" class="block text-gray-700 font-medium mb-2">Email 
                                    <span class="text-green-600">*</span></label>
                                <div class="relative">
                                    <InputText id="email" v-model="email" placeholder="Enter your email address"
                                        class="w-full p-3 pl-10 rounded-xl border-2 focus:border-green-500 focus:ring focus:ring-green-200 transition-all"
                                        :class="{ 'border-red-300 focus:border-red-500 focus:ring-red-200': submitted && !email }"
                                        aria-describedby="email-error" />
                                    <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                                        <i class="pi pi-envelope"></i>
                                    </span>
                                </div>
                                <small id="email-error" v-if="submitted && !email" class="p-error block mt-1 text-sm">
                                    Email is required.
                                </small>
                            </div>

                            <div class="flex gap-4 mb-6">
                                <div class="flex-1">
                                    <label for="phoneNumber" class="block text-gray-700 font-medium mb-2">Phone Number
                                        <span class="text-green-600">*</span></label>
                                    <div class="relative">
                                        <InputMask id="phoneNumber" v-model="phoneNumber" mask="+63 999-999-9999"
                                            placeholder="+63 917-123-4567" 
                                            class="w-full p-3 pl-10 rounded-xl border-2 focus:border-green-500 focus:ring focus:ring-green-200 transition-all"
                                            :class="{ 'border-red-300 focus:border-red-500 focus:ring-red-200': submitted && !phoneNumber }"
                                            aria-describedby="phone-error" />
                                        <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                                            <i class="pi pi-phone"></i>
                                        </span>
                                    </div>
                                    <small id="phone-error" v-if="submitted && !phoneNumber"
                                        class="p-error block mt-1 text-sm">Phone number is required.</small>
                                    <small class="text-gray-500 block mt-1 text-sm">
                                        Philippines format: +63 followed by 10 digits
                                    </small>
                                </div>

                                <div class="flex-1">
                                    <label for="gender" class="block text-gray-700 font-medium mb-2">Gender 
                                        <span class="text-green-600">*</span></label>
                                    <Dropdown id="gender" v-model="gender" :options="genderOptions" optionLabel="label"
                                        optionValue="value" placeholder="Select gender" 
                                        class="w-full rounded-xl border-2 focus:border-green-500 focus:ring focus:ring-green-200 transition-all"
                                        :class="{ 'border-red-300': submitted && !gender }" />
                                    <small id="gender-error" v-if="submitted && !gender"
                                        class="p-error block mt-1 text-sm">Gender is required.</small>
                                </div>
                            </div>
                        </div>

                        <!-- Step 2: Security Information -->
                        <div v-if="currentStep === 1" class="animate-fadeIn">
                            <div class="mb-6">
                                <label for="password" class="block text-gray-700 font-medium mb-2">Password 
                                    <span class="text-green-600">*</span></label>
                                <div class="relative">
                                    <Password id="password" v-model="password" placeholder="Create a strong password"
                                        class="w-full" :feedback="true" toggleMask
                                        :class="{ 'p-invalid': submitted && !password }" aria-describedby="password-error"
                                        inputClass="p-3 pl-10 rounded-xl border-2 focus:border-green-500 focus:ring focus:ring-green-200 w-full" />
                                    <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 z-10">
                                        <i class="pi pi-lock"></i>
                                    </span>
                                </div>
                                <small id="password-error" v-if="submitted && !password"
                                    class="p-error block mt-1 text-sm">Password is required.</small>
                                <small class="text-gray-500 block mt-1 text-sm">
                                    Password must be at least 8 characters and include uppercase, lowercase,
                                    number, and special character.
                                </small>
                            </div>

                            <div class="mb-6">
                                <label for="confirmPassword" class="block text-gray-700 font-medium mb-2">Confirm
                                    Password <span class="text-green-600">*</span></label>
                                <div class="relative">
                                    <Password id="confirmPassword" v-model="confirmPassword"
                                        placeholder="Confirm your password" class="w-full" toggleMask
                                        :class="{ 'p-invalid': submitted && !confirmPassword }"
                                        aria-describedby="confirmPassword-error" 
                                        inputClass="p-3 pl-10 rounded-xl border-2 focus:border-green-500 focus:ring focus:ring-green-200 w-full" />
                                    <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 z-10">
                                        <i class="pi pi-lock-open"></i>
                                    </span>
                                </div>
                                <small id="confirmPassword-error" v-if="submitted && !confirmPassword"
                                    class="p-error block mt-1 text-sm">
                                    Confirm password is required.
                                </small>
                                <small id="password-match-error"
                                    v-if="submitted && confirmPassword && confirmPassword !== password"
                                    class="p-error block mt-1 text-sm">
                                    Passwords do not match.
                                </small>
                            </div>

                            <div class="p-4 bg-blue-50 border border-blue-100 rounded-xl mb-6 shadow-sm transform hover:shadow transition-all">
                                <div class="flex items-center mb-2">
                                    <i class="pi pi-shield text-blue-700 mr-2"></i>
                                    <h3 class="text-blue-700 font-medium">Security Tips</h3>
                                </div>
                                <ul class="text-gray-600 text-sm space-y-1">
                                    <li class="flex items-center">
                                        <i class="pi pi-check-circle text-blue-500 mr-2"></i>
                                        Use a unique password you don't use elsewhere
                                    </li>
                                    <li class="flex items-center">
                                        <i class="pi pi-check-circle text-blue-500 mr-2"></i>
                                        Consider using a password manager
                                    </li>
                                    <li class="flex items-center">
                                        <i class="pi pi-check-circle text-blue-500 mr-2"></i>
                                        Enable two-factor authentication after signup for enhanced security
                                    </li>
                                </ul>
                            </div>

                            <div class="p-4 bg-yellow-50 border border-yellow-100 rounded-xl mb-6 shadow-sm transform hover:shadow transition-all">
                                <div class="flex items-center mb-2">
                                    <i class="pi pi-info-circle text-yellow-700 mr-2"></i>
                                    <h3 class="text-yellow-700 font-medium">Next Step: Verification</h3>
                                </div>
                                <p class="text-gray-600 text-sm">
                                    After proceeding, we'll send a verification code to your email to confirm
                                    your identity.
                                </p>
                            </div>
                        </div>

                        <!-- Step 3: Verification code (OTP) -->
                        <div v-if="currentStep === 2" class="animate-fadeIn">
                            <div class="p-4 bg-green-50 border border-green-100 rounded-xl mb-6 shadow-sm">
                                <div class="flex items-center mb-2">
                                    <i class="pi pi-envelope text-green-700 mr-2"></i>
                                    <h3 class="text-green-700 font-medium">Verification Required</h3>
                                </div>
                                <p class="text-gray-600 text-sm">
                                    We've sent a 6-digit verification code to your email 
                                    <strong class="text-green-700">{{ email }}</strong>
                                </p>
                            </div>

                            <div class="mb-6">
                                <label for="verificationCode" class="block text-gray-700 font-medium mb-2">
                                    Verification Code <span class="text-green-600">*</span>
                                </label>
                                <InputMask id="verificationCode" v-model="verificationCode" mask="999999"
                                    placeholder="Enter 6-digit code"
                                    class="w-full p-4 text-center text-2xl tracking-widest rounded-xl border-2 border-green-200 focus:border-green-500 focus:ring focus:ring-green-200 transition-all"
                                    :class="{ 'border-red-300 focus:border-red-500 focus:ring-red-200': submitted && !verificationCode }"
                                    aria-describedby="code-error" />
                                <small id="code-error" v-if="submitted && !verificationCode" class="p-error block mt-1 text-sm">
                                    Verification code is required.
                                </small>
                            </div>

                            <div class="flex justify-center mb-6">
                                <Button type="button" label="Resend Code" 
                                    class="p-button-text p-3 flex items-center text-green-600 hover:text-green-800 hover:bg-green-50 transition-colors rounded-xl"
                                    icon="pi pi-refresh" iconPos="left"
                                    @click="resendVerificationCode" :loading="loading" :disabled="loading" />
                            </div>

                            <div class="p-4 bg-blue-50 border border-blue-100 rounded-xl mb-6 shadow-sm transform hover:shadow transition-all">
                                <div class="flex items-center mb-2">
                                    <i class="pi pi-question-circle text-blue-700 mr-2"></i>
                                    <h3 class="text-blue-700 font-medium">Didn't receive the code?</h3>
                                </div>
                                <ul class="text-gray-600 text-sm space-y-1">
                                    <li class="flex items-center">
                                        <i class="pi pi-check-circle text-blue-500 mr-2"></i>
                                        Check your spam/junk folder
                                    </li>
                                    <li class="flex items-center">
                                        <i class="pi pi-check-circle text-blue-500 mr-2"></i>
                                        Verify that you entered the correct email
                                    </li>
                                    <li class="flex items-center">
                                        <i class="pi pi-check-circle text-blue-500 mr-2"></i>
                                        Wait a few minutes and try again
                                    </li>
                                    <li class="flex items-center">
                                        <i class="pi pi-check-circle text-blue-500 mr-2"></i>
                                        Contact support if you continue to have issues
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <!-- Step 4: Agreements -->
                        <div v-if="currentStep === 3" class="animate-fadeIn">
                            <div class="mb-6 p-4 bg-blue-50 border border-blue-100 rounded-xl shadow-sm">
                                <div class="flex items-center mb-2">
                                    <i class="pi pi-flag-fill text-blue-700 mr-2"></i>
                                    <h3 class="text-blue-700 font-medium">Almost Done!</h3>
                                </div>
                                <p class="text-gray-600 text-sm">
                                    Please review and accept our terms and conditions to complete your registration.
                                </p>
                            </div>

                            <div class="mb-6 p-4 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow transition-all">
                                <div class="flex items-start mb-3">
                                    <Checkbox v-model="agreeToTerms" inputId="agreeToTerms" binary
                                        class="mt-1 mr-3 border border-gray-400 rounded-md focus:border-green-500" />
                                    <label for="agreeToTerms" class="text-gray-700">
                                        I agree to the
                                        <a href="#" class="text-green-600 hover:text-green-800 font-medium underline decoration-dotted">
                                            Terms of Service
                                        </a>
                                        and
                                        <a href="#" class="text-green-600 hover:text-green-800 font-medium underline decoration-dotted">
                                            Privacy Policy
                                        </a>
                                    </label>
                                </div>
                                <small id="agree-error" v-if="submitted && !agreeToTerms" class="p-error block mt-1 text-sm">
                                    You must agree to the terms and conditions.
                                </small>
                            </div>

                            <div class="mb-6 p-4 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow transition-all">
                                <div class="flex items-start">
                                    <Checkbox v-model="receiveMarketingEmails" inputId="receiveMarketingEmails" binary
                                        class="mt-1 mr-3 border border-gray-400 rounded-md" />
                                    <label for="receiveMarketingEmails" class="text-gray-700">
                                        I would like to receive updates about products, services, and promotions from
                                        LivestoX.
                                    </label>
                                </div>
                            </div>

                            <div class="p-4 bg-yellow-50 border border-yellow-100 rounded-xl mb-6 shadow-sm transform hover:shadow transition-all">
                                <div class="flex items-center mb-2">
                                    <i class="pi pi-exclamation-circle text-yellow-700 mr-2"></i>
                                    <h3 class="text-yellow-700 font-medium">Important Information</h3>
                                </div>
                                <ul class="text-gray-600 text-sm space-y-1">
                                    <li class="flex items-center">
                                        <i class="pi pi-check-circle text-yellow-500 mr-2"></i>
                                        You can unsubscribe from marketing emails at any time
                                    </li>
                                    <li class="flex items-center">
                                        <i class="pi pi-check-circle text-yellow-500 mr-2"></i>
                                        We never share your personal information with third parties
                                    </li>
                                    <li class="flex items-center">
                                        <i class="pi pi-check-circle text-yellow-500 mr-2"></i>
                                        Your account will be verified before you can make transactions
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <!-- Navigation buttons -->
                        <div class="flex justify-between mt-8">
                            <Button v-if="currentStep > 0" type="button" 
                                class="p-button-outlined p-3 rounded-xl flex items-center border-2 border-green-500 text-green-600 hover:bg-green-50 transition-colors"
                                @click="prevStep" :disabled="loading">
                                <i class="pi pi-arrow-left mr-2"></i>
                                Back
                            </Button>
                            <div v-else class="invisible"></div>

                            <Button type="submit" 
                                class="p-button-success p-3 rounded-xl shadow-md hover:shadow-lg transition-all bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                                :loading="loading">
                                <span class="flex items-center">
                                    {{ currentStep === 3 ? 'Complete Sign Up' : 'Continue' }}
                                    <i class="pi pi-arrow-right ml-2"></i>
                                </span>
                            </Button>
                        </div>
                    </form>

                    <div class="mt-8 text-center">
                        <p class="text-gray-600">
                            Already have an account?
                            <router-link to="/signin" class="text-green-600 font-medium hover:text-green-800 underline decoration-dotted">
                                Sign In
                            </router-link>
                        </p>
                    </div>
                </div>
            </div>

            <!-- Right side with carousel -->
            <div class="hidden md:block w-1/2 bg-gradient-to-br from-green-600 to-green-800 relative overflow-hidden">
                <!-- Background patterns -->
                <div class="absolute inset-0 opacity-20">
                    <div class="absolute right-0 top-0 w-96 h-96 bg-white opacity-10 rounded-full -mr-24 -mt-24"></div>
                    <div class="absolute left-0 bottom-0 w-64 h-64 bg-white opacity-10 rounded-full -ml-12 -mb-12"></div>
                </div>
                
                <Carousel :slides="carouselSlides" class="z-10 relative" />
            </div>
        </div>
    </div>
</template>

<style scoped>
.p-password {
    width: 100%;
}

.p-password-input {
    width: 100%;
}

/* Custom animations */
@keyframes gradient {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
}

.animate-gradient {
    background-size: 200% 200%;
    animation: gradient 15s ease infinite;
}

@keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
}

.animate-fadeIn {
    animation: fadeIn 0.4s ease-out forwards;
}

/* Override PrimeVue styles */
:deep(.p-steps) {
    margin-bottom: 2rem;
}

:deep(.p-steps .p-steps-item) {
    flex: 1;
}

:deep(.p-steps .p-steps-item .p-menuitem-link) {
    background: transparent;
    transition: background-color 0.2s;
}

:deep(.p-steps .p-steps-item.p-highlight .p-steps-number) {
    background: #4CAF50;
}

:deep(.p-dropdown) {
    border-radius: 0.75rem;
}

:deep(.p-dropdown-panel .p-dropdown-items .p-dropdown-item.p-highlight) {
    background: rgba(76, 175, 80, 0.15);
    color: #4CAF50;
}

:deep(.p-checkbox:not(.p-checkbox-disabled).p-focus > .p-checkbox-box) {
    border-color: #4CAF50;
    box-shadow: 0 0 0 0.2rem rgba(76, 175, 80, 0.25);
}

:deep(.p-checkbox:not(.p-checkbox-disabled) .p-checkbox-box.p-highlight) {
    background: #4CAF50;
    border-color: #4CAF50;
}

:deep(.p-button.p-button-success),
:deep(.p-buttonset.p-button-success > .p-button),
:deep(.p-splitbutton.p-button-success > .p-button) {
    background: #4CAF50;
    border: 1px solid #4CAF50;
}

:deep(.p-button.p-button-success:enabled:hover),
:deep(.p-buttonset.p-button-success > .p-button:enabled:hover),
:deep(.p-splitbutton.p-button-success > .p-button:enabled:hover) {
    background: #43A047;
    border: 1px solid #43A047;
}

/* Improved focus styles for all inputs */
:deep(.p-inputtext:enabled:focus) {
    border-color: #4CAF50;
    box-shadow: 0 0 0 0.2rem rgba(76, 175, 80, 0.25);
}

/* Improved dropdown styling */
:deep(.p-dropdown:not(.p-disabled).p-focus) {
    border-color: #4CAF50;
    box-shadow: 0 0 0 0.2rem rgba(76, 175, 80, 0.25);
}

/* Override tooltip styles */
:deep(.p-tooltip .p-tooltip-text) {
    background: rgba(38, 38, 38, 0.9);
    border-radius: 0.5rem;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}
</style>