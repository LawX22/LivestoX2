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
import { signUpConfirm } from '../../lib/aut';

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
        const validatePersonalInfo = (): boolean => {
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

            return true;
        };

        // Replace the validateSecurityInfo function with this updated version:
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

        const validateVerification = (): boolean => {
            if (!verificationCode.value) {
                toast.add({
                    severity: 'warn',
                    summary: 'Missing Information',
                    detail: 'Please enter the verification code sent to your email/phone',
                    life: 3000
                });
                return false;
            }

            // In a real application, you would validate the code against a server
            // This is just a mock validation
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
                    detail: 'A verification code has been sent to your email and phone',
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
                await new Promise(resolve => setTimeout(resolve, 800));

                // For demo purposes, let's pretend usernames ending with "taken" are already taken
                if (username.value.endsWith('taken')) {
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

        // Navigation functions
        const nextStep = () => {
            submitted.value = true;

            // Validate current step
            let isValid = false;

            switch (currentStep.value) {
                case 0:
                    isValid = validatePersonalInfo();
                    break;
                case 1:
                    isValid = validateSecurityInfo();
                    break;
                case 2:
                    isValid = validateVerification();
                    break;
                case 3:
                    isValid = validateAgreements();
                    break;
            }

            if (isValid) {
                if (currentStep.value < 3) {
                    currentStep.value++;
                    submitted.value = false;

                    // If moving to verification step, automatically send code
                    if (currentStep.value === 2 && !verificationSent.value) {
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

                await signUpConfirm(email.value, confirmPassword.value);

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

                // Simulate API call
                await new Promise(resolve => setTimeout(resolve, 1000));

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
            // Other data
            carouselSlides,
            logoPath: "/src/assets/vue.svg"
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
                <!-- Background pattern -->
                <div class="absolute inset-0 opacity-5 z-0">
                    <div class="absolute inset-0"
                        style="background-image: url('data:image/svg+xml,%3Csvg width=\'20\' height=\'20\' viewBox=\'0 0 20 20\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%239AE6B4\' fill-opacity=\'0.4\' fill-rule=\'evenodd\'%3E%3Ccircle cx=\'3\' cy=\'3\' r=\'3\'/%3E%3Ccircle cx=\'13\' cy=\'13\' r=\'3\'/%3E%3C/g%3E%3C/svg%3E');">
                    </div>
                </div>

                <!-- Content -->
                <div class="relative z-10">
                    <div class="mb-8 text-center">
                        <div class="flex justify-center items-center mb-6">
                            <div class="bg-green-500 bg-opacity-20 p-4 rounded-full shadow-md">
                                <img :src="logoPath" alt="Logo" class="w-16 h-16 object-contain">
                            </div>
                        </div>

                        <h1 class="text-3xl font-bold mb-3 text-green-700">Create an Account</h1>
                        <p class="text-gray-600">Join the LivestoX community and start your journey.</p>
                    </div>
                    <!-- Steps indicator -->
                    <div class="mb-8">
                        <div class="flex flex-col space-y-2">
                            <div class="flex justify-between">
                                <span class="text-sm text-gray-600">Step {{ currentStep + 1 }} of 4</span>
                                <span class="text-sm text-gray-600">{{ ['Personal', 'Security', 'Verification',
                                    'Agreement'][currentStep] }}</span>
                            </div>
                            <div class="w-full bg-gray-200 rounded-full h-2.5">
                                <div class="bg-green-600 h-2.5 rounded-full transition-all duration-300 ease-in-out"
                                    :style="{ width: `${(currentStep + 1) * 25}%` }"></div>
                            </div>
                        </div>
                    </div>
                    <form @submit.prevent="nextStep" class="w-full max-w-md mx-auto">
                        <!-- Step 1: Personal Information -->
                        <div v-if="currentStep === 0">
                            <div class="flex gap-4 mb-6">
                                <div class="flex-1">
                                    <label for="firstName" class="block text-gray-700 font-medium mb-2">First Name
                                        *</label>
                                    <InputText id="firstName" v-model="firstName" placeholder="First name"
                                        class="w-full p-3" :class="{ 'p-invalid': submitted && !firstName }"
                                        aria-describedby="firstName-error" />
                                    <small id="firstName-error" v-if="submitted && !firstName"
                                        class="p-error block mt-1">First name
                                        is required.</small>
                                </div>
                                <div class="flex-1">
                                    <label for="lastName" class="block text-gray-700 font-medium mb-2">Last Name
                                        *</label>
                                    <InputText id="lastName" v-model="lastName" placeholder="Last name"
                                        class="w-full p-3" :class="{ 'p-invalid': submitted && !lastName }"
                                        aria-describedby="lastName-error" />
                                    <small id="lastName-error" v-if="submitted && !lastName"
                                        class="p-error block mt-1">Last name
                                        is required.</small>
                                </div>
                            </div>

                            <div class="mb-6">
                                <label for="username" class="block text-gray-700 font-medium mb-2">Username *</label>
                                <div class="flex">
                                    <InputText id="username" v-model="username" placeholder="Choose a username"
                                        class="w-full p-3"
                                        :class="{ 'p-invalid': submitted && !username || usernameError }"
                                        aria-describedby="username-error" @input="debouncedCheckUsernameAvailability" />
                                    <span v-if="loading" class="ml-2 flex items-center">
                                        <i class="pi pi-spinner pi-spin"></i>
                                    </span>
                                    <span v-if="usernameAvailable && !usernameError"
                                        class="ml-2 flex items-center text-green-500">
                                        <i class="pi pi-check"></i>
                                    </span>
                                </div>
                                <small id="username-error" v-if="submitted && !username" class="p-error block mt-1">
                                    Username is required.
                                </small>
                                <small v-if="usernameError" class="p-error block mt-1">
                                    {{ usernameError }}
                                </small>
                                <small class="text-gray-500 block mt-1">
                                    4-16 characters, letters, numbers, underscore and hyphen only
                                </small>
                            </div>

                            <div class="flex gap-4 mb-6">
                                <div class="flex-1">
                                    <label for="email" class="block text-gray-700 font-medium mb-2">Email *</label>
                                    <InputText id="email" v-model="email" placeholder="Enter your email address"
                                        class="w-full p-3" :class="{ 'p-invalid': submitted && !email }"
                                        aria-describedby="email-error" />
                                    <small id="email-error" v-if="submitted && !email" class="p-error block mt-1">Email
                                        is required.</small>
                                </div>
                            </div>

                            <div class="flex gap-4 mb-6">
                                <div class="flex-1">
                                    <label for="phoneNumber" class="block text-gray-700 font-medium mb-2">Phone Number
                                        *</label>
                                    <InputMask id="phoneNumber" v-model="phoneNumber" mask="+99 (999) 999-9999"
                                        placeholder="+1 (234) 567-8901" class="w-full p-3"
                                        :class="{ 'p-invalid': submitted && !phoneNumber }"
                                        aria-describedby="phone-error" />
                                    <small id="phone-error" v-if="submitted && !phoneNumber"
                                        class="p-error block mt-1">Phone number is required.</small>
                                </div>

                                <div class="flex-1">
                                    <label for="gender" class="block text-gray-700 font-medium mb-2">Gender *</label>
                                    <Dropdown id="gender" v-model="gender" :options="genderOptions" optionLabel="label"
                                        optionValue="value" placeholder="Select gender" class="w-full "
                                        :class="{ 'p-invalid': submitted && !gender }" />
                                    <small id="gender-error" v-if="submitted && !gender"
                                        class="p-error block mt-1">Gender is required.</small>
                                </div>
                            </div>
                        </div>

                        <!-- Step 2: Security Information -->
                        <div v-if="currentStep === 1">
                            <!-- Replace the password and confirm password fields in your template with these: -->
                            <div class="mb-6">
                                <label for="password" class="block text-gray-700 font-medium mb-2">Password *</label>
                                <Password id="password" v-model="password" placeholder="Create a strong password"
                                    class="w-full" :feedback="true" toggleMask
                                    :class="{ 'p-invalid': submitted && !password }" aria-describedby="password-error"
                                    inputClass="p-3" />
                                <small id="password-error" v-if="submitted && !password"
                                    class="p-error block mt-1">Password is required.</small>
                                <small class="text-gray-500 block mt-1">
                                    Password must be at least 8 characters and include uppercase, lowercase,
                                    number, and special character.
                                </small>
                            </div>

                            <div class="mb-6">
                                <label for="confirmPassword" class="block text-gray-700 font-medium mb-2">Confirm
                                    Password *</label>
                                <Password id="confirmPassword" v-model="confirmPassword"
                                    placeholder="Confirm your password" class="w-full" toggleMask
                                    :class="{ 'p-invalid': submitted && !confirmPassword }"
                                    aria-describedby="confirmPassword-error" inputClass="p-3" />
                                <small id="confirmPassword-error" v-if="submitted && !confirmPassword"
                                    class="p-error block mt-1">
                                    Confirm password is required.
                                </small>
                                <small id="password-match-error"
                                    v-if="submitted && confirmPassword && confirmPassword !== password"
                                    class="p-error block mt-1">
                                    Passwords do not match.
                                </small>
                            </div>

                            <div class="p-4 bg-blue-50 border border-blue-100 rounded-lg mb-6">
                                <h3 class="text-blue-700 font-medium mb-2">Security Tips</h3>
                                <ul class="text-gray-600 text-sm space-y-1">
                                    <li>• Use a unique password you don't use elsewhere</li>
                                    <li>• Consider using a password manager</li>
                                    <li>• Enable two-factor authentication after signup for enhanced security</li>
                                </ul>
                            </div>
                        </div>

                        <!-- Step 3: Verification -->
                        <div v-if="currentStep === 2">
                            <div class="mb-6 text-center">
                                <div class="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-left">
                                    <h3 class="text-green-700 font-medium mb-2">Verification Required</h3>
                                    <p class="text-gray-600 text-sm">
                                        We've sent a 6-digit verification code to your email {{ email }} and phone {{
                                            phoneNumber }}.
                                        Please enter the code below to verify your identity.
                                    </p>
                                </div>

                                <div class="mb-6">
                                    <label for="verificationCode"
                                        class="block text-gray-700 font-medium mb-2 text-left">Verification Code
                                        *</label>
                                    <InputMask id="verificationCode" v-model="verificationCode" mask="999999"
                                        placeholder="Enter 6-digit code"
                                        class="w-full p-3 text-center tracking-widest text-lg"
                                        :class="{ 'p-invalid': submitted && !verificationCode }" />
                                    <small id="verificationCode-error" v-if="submitted && !verificationCode"
                                        class="p-error block mt-1 text-left">
                                        Verification code is required.
                                    </small>
                                </div>

                                <Button type="button" label="Resend Code" class="p-button-text p-3"
                                    @click="resendVerificationCode" :loading="loading" />

                                <p class="text-sm text-gray-500 mt-4">
                                    Didn't receive the code? Check your spam folder or try resending after 60 seconds.
                                </p>
                            </div>
                        </div>

                        <!-- Step 4: Agreements -->
                        <div v-if="currentStep === 3">
                            <div class="mb-6 p-4 bg-blue-50 border border-blue-100 rounded-lg">
                                <h3 class="text-blue-700 font-medium mb-2">Almost Done!</h3>
                                <p class="text-gray-600 text-sm">
                                    Please review and accept our terms and conditions to complete your registration.
                                </p>
                            </div>

                            <div class="mb-6">
                                <div class="flex items-center mb-3">
                                    <Checkbox v-model="agreeToTerms" inputId="agreeToTerms" binary
                                        class="mr-2 border border-gray-500 rounded-md" />
                                    <label for="agreeToTerms" class="text-gray-700">
                                        I agree to the
                                        <a href="#" class="text-green-600 hover:text-green-800 font-medium">
                                            Terms of Service
                                        </a>
                                        and
                                        <a href="#" class="text-green-600 hover:text-green-800 font-medium">
                                            Privacy Policy
                                        </a> *
                                    </label>
                                </div>
                                <small id="terms-error" v-if="submitted && !agreeToTerms" class="p-error block mt-1">
                                    You must agree to the terms and conditions.
                                </small>

                                <div class="flex items-center">
                                    <Checkbox v-model="receiveMarketingEmails" inputId="receiveMarketingEmails" binary
                                        class="mr-2 border border-gray-500 rounded-md" />
                                    <label for="receiveMarketingEmails" class="text-gray-700">
                                        I would like to receive marketing emails about special offers and updates
                                    </label>
                                </div>
                            </div>

                            <!-- Social login options -->
                            <Divider align="center">
                                <span
                                    class="p-tag bg-white text-gray-500 border border-gray-200 px-3 py-1 rounded-full">Or
                                    sign up with</span>
                            </Divider>

                            <div class="flex justify-center gap-4 my-6">
                                <Button type="button" icon="pi pi-google"
                                    class="p-button-outlined p-button-rounded p-3" />
                                <Button type="button" icon="pi pi-facebook"
                                    class="p-button-outlined p-button-rounded p-3" />
                                <Button type="button" icon="pi pi-apple"
                                    class="p-button-outlined p-button-rounded p-3" />
                            </div>
                        </div>

                        <!-- Navigation buttons -->
                        <div class="flex justify-between mt-8">
                            <Button v-if="currentStep > 0" type="button" label="Previous" class="p-button-outlined p-3"
                                @click="prevStep" />
                            <div v-else class="flex-1"></div>

                            <Button type="submit" :label="currentStep < 3 ? 'Next' : 'Create Account'"
                                class="p-3 shadow-lg" :loading="loading" />
                        </div>

                        <div class="text-center mt-6">
                            <p class="text-gray-700">
                                Already have an account?
                                <router-link to="/signin"
                                    class="text-green-600 hover:text-green-800 font-medium ml-1 transition-colors">
                                    Sign In
                                </router-link>
                            </p>
                        </div>
                    </form>
                </div>
            </div>

            <!-- Right side with carousel component -->
            <div class="w-full md:w-1/2">
                <Carousel :slides="carouselSlides" :logo-path="logoPath" />
            </div>
        </div>
    </div>
</template>
