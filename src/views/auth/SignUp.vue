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
import Carousel from '../../components/Landing/Carousel.vue';

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
        Carousel
    },
    setup() {
        const router = useRouter();
        const toast = useToast();

        const firstName = ref<string>('');
        const lastName = ref<string>('');
        const email = ref<string>('');
        const password = ref<string>('');
        const confirmPassword = ref<string>('');
        const loading = ref<boolean>(false);
        const submitted = ref<boolean>(false);
        const agreeToTerms = ref<boolean>(false);
        
        // Define carousel slides data
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

        const validateForm = (): boolean => {
            if (!firstName.value || !lastName.value || !email.value || !password.value || !confirmPassword.value) {
                toast.add({
                    severity: 'warn',
                    summary: 'Missing Information',
                    detail: 'Please fill in all required fields',
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

        const handleSubmit = async () => {
            submitted.value = true;

            if (!validateForm()) {
                return;
            }

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
            firstName,
            lastName,
            email,
            password,
            confirmPassword,
            loading,
            submitted,
            agreeToTerms,
            handleSubmit,
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

                    <form @submit.prevent="handleSubmit" class="w-full max-w-md mx-auto">
                        <div class="flex gap-4 mb-6">
                            <div class="flex-1">
                                <label for="firstName" class="block text-gray-700 font-medium mb-2">First Name</label>
                                <InputText id="firstName" v-model="firstName" placeholder="First name"
                                    class="w-full p-3" :class="{ 'p-invalid': submitted && !firstName }"
                                    aria-describedby="firstName-error" />
                                <small id="firstName-error" v-if="submitted && !firstName" class="p-error block mt-1">First name
                                    is required.</small>
                            </div>
                            <div class="flex-1">
                                <label for="lastName" class="block text-gray-700 font-medium mb-2">Last Name</label>
                                <InputText id="lastName" v-model="lastName" placeholder="Last name"
                                    class="w-full p-3" :class="{ 'p-invalid': submitted && !lastName }"
                                    aria-describedby="lastName-error" />
                                <small id="lastName-error" v-if="submitted && !lastName" class="p-error block mt-1">Last name
                                    is required.</small>
                            </div>
                        </div>

                        <div class="mb-6">
                            <label for="email" class="block text-gray-700 font-medium mb-2">Email</label>
                            <InputText id="email" v-model="email" placeholder="Enter your email address"
                                class="w-full p-3" :class="{ 'p-invalid': submitted && !email }"
                                aria-describedby="email-error" />
                            <small id="email-error" v-if="submitted && !email" class="p-error block mt-1">Email
                                is required.</small>
                        </div>

                        <!-- Modified section: Password and Confirm Password on same row -->
                        <div class="flex gap-4 mb-6">
                            <div class="flex-1">
                                <label for="password" class="block text-gray-700 font-medium mb-2">Password</label>
                                <Password id="password" v-model="password" placeholder="Create a strong password" class="w-full"
                                    :feedback="true" toggleMask :class="{ 'p-invalid': submitted && !password }"
                                    aria-describedby="password-error" inputClass="p-3" />
                                <small id="password-error" v-if="submitted && !password" class="p-error block mt-1">Password
                                    is required.</small>
                            </div>
                            <div class="flex-1">
                                <label for="confirmPassword" class="block text-gray-700 font-medium mb-2">Confirm Password</label>
                                <Password id="confirmPassword" v-model="confirmPassword" placeholder="Confirm your password" class="w-full"
                                    toggleMask :class="{ 'p-invalid': submitted && (!confirmPassword || confirmPassword !== password) }"
                                    aria-describedby="confirmPassword-error" inputClass="p-3" />
                                <small id="confirmPassword-error" v-if="submitted && !confirmPassword" class="p-error block mt-1">
                                    Confirm password is required.
                                </small>
                            </div>
                        </div>
                        <!-- Password match error below both fields -->
                        <div class="mb-6">
                            <small id="password-match-error" v-if="submitted && confirmPassword && confirmPassword !== password" class="p-error block">
                                Passwords do not match.
                            </small>
                        </div>

                        <div class="mb-6">
                            <div class="flex items-center">
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
                                    </a>
                                </label>
                            </div>
                            <small id="terms-error" v-if="submitted && !agreeToTerms" class="p-error block mt-1">
                                You must agree to the terms and conditions.
                            </small>
                        </div>

                        <Button type="submit" label="Create Account" class="w-full mb-6 p-3 shadow-lg" :loading="loading" />

                        <Divider align="center">
                            <span class="p-tag bg-white text-gray-500 border border-gray-200 px-3 py-1 rounded-full">Or
                                sign up with</span>
                        </Divider>

                        <div class="flex justify-center gap-4 my-8">
                            <Button type="button" icon="pi pi-google" class="p-button-outlined p-button-rounded p-3" />
                            <Button type="button" icon="pi pi-facebook"
                                class="p-button-outlined p-button-rounded p-3" />
                            <Button type="button" icon="pi pi-apple" class="p-button-outlined p-button-rounded p-3" />
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