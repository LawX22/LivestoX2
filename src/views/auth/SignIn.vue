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
import { signIn } from '../../lib/aut';
import imageUrl from '/src/assets/vue.svg';
import { useAuthStore } from '../../stores/authContext';
import LeftPanel from '../../components/Auth/LeftPanel.vue';

export default defineComponent({
    name: 'SignInPage',
    components: {
        Toast,
        InputText,
        Password,
        Button,
        Checkbox,
        Divider,
        ProgressSpinner,
        LeftPanel
    },
    setup() {
        const router = useRouter();
        const toast = useToast();

        const email = ref<string>('');
        const password = ref<string>('');
        const loading = ref<boolean>(false);
        const submitted = ref<boolean>(false);
        const rememberMe = ref<boolean>(false);
        
        // Define carousel slides data
        const carouselSlides = [
            {
                image: "https://images.unsplash.com/photo-1516467508483-a7212febe31a",
                title: "Welcome Back to LivestoX",
                subtitle: "Your trusted Livestock Online Marketplace",
                quote: "Healthy livestock, thriving farms - our animals are the heart of our fields.",
                author: "John Farmer",
                role: "Livestock Specialist"
            },
            {
                image: "https://images.unsplash.com/photo-1558343434-a78f1bc6c604",
                title: "Quality Livestock",
                subtitle: "Connect with verified breeders",
                quote: "LivestoX has transformed how I source quality livestock for my farm.",
                author: "Sarah Williams",
                role: "Ranch Owner"
            },
            {
                image: "https://images.unsplash.com/photo-1500595046743-cd271d694d30",
                title: "Grow Your Business",
                subtitle: "Reach more buyers nationwide",
                quote: "Since joining LivestoX, my sales have increased by 40% in just six months.",
                author: "Michael Thompson",
                role: "Cattle Breeder"
            },
            {
                image: "https://images.unsplash.com/photo-1605152276897-4f618f831968",
                title: "Secure Transactions",
                subtitle: "Safe and verified marketplace",
                quote: "The secure payment system gives me peace of mind with every transaction.",
                author: "Emma Rodriguez",
                role: "Farm Manager"
            }
        ];

        const authStore = useAuthStore();

        const handleSubmit = async () => {
            submitted.value = true;

            if (!email.value || !password.value) {
                toast.add({
                    severity: 'warn',
                    summary: 'Missing Information',
                    detail: 'Please fill in all required fields',
                    life: 3000
                });
                return;
            }

            try {
                loading.value = true;

                // Replace with your actual authentication logic
                // await new Promise(resolve => setTimeout(resolve, 1000));
                await signIn(email.value, password.value);

                // Mock successful login
                toast.add({
                    severity: 'success',
                    summary: 'Welcome Back',
                    detail: `You have successfully signed in to LivestoX, ${email.value}!`,
                    life: 3000
                });

                // Navigate to dashboard or home page
                router.push('/main/LivestockMarket');
            } catch (error) {
                const errorMessage = (error instanceof Error) ? error.message : 'Authentication Failed. Please try again.';
                toast.add({
                    severity: 'error',
                    summary: 'Authentication Failed',
                    detail: errorMessage,
                    life: 3000
                });
            } finally {
                loading.value = false;
            }
        };

        onMounted(() => {
            if(authStore.session) {
                router.push('/main/LivestockMarket');
            };
            // Show a welcome toast when component mounts
            setTimeout(() => {
                toast.add({
                    severity: 'info',
                    summary: 'Welcome',
                    detail: 'Welcome to LivestoX, your livestock marketplace',
                    life: 3000
                });
            }, 500);
        });

        return {
            email,
            password,
            loading,
            submitted,
            rememberMe,
            handleSubmit,
            carouselSlides,
            logoPath: imageUrl
        };
    }
});
</script>

<template>
    <div class="flex min-h-screen bg-gradient-to-br from-blue-100 via-sky-100 to-blue-200">
        <Toast position="top-right" />

        <!-- Main container with enhanced modern effect -->
        <div class="w-full max-w-7xl mx-auto my-10 px-4 sm:px-6">

            <!-- Card with elegant shadow and layered effect -->
            <div class="relative bg-white rounded-3xl shadow-2xl overflow-hidden transition-all duration-500 hover:shadow-blue-100">

                <!-- Top accent bar with enhanced gradient -->
                <div class="h-3 bg-gradient-to-r from-blue-500 via-sky-500 to-blue-600"></div>

                <!-- Content container -->
                <div class="flex flex-col lg:flex-row">

                    <!-- Left side panel component -->
                    <LeftPanel :logoPath="logoPath" />

                    <!-- Right side - Form content -->
                    <div class="lg:w-7/12 p-6 lg:p-10">
                        <!-- Form content -->
                        <form @submit.prevent="handleSubmit" class="max-w-xl mx-auto">
                            <!-- Header -->
                            <div class="text-center mb-8">
                                <!-- Visible on mobile only -->
                                <div class="flex justify-center items-center mb-6 lg:hidden">
                                    <div class="bg-blue-100 p-4 rounded-full shadow-md">
                                        <img :src="logoPath" alt="Logo" class="w-16 h-16 object-contain">
                                    </div>
                                </div>

                                <h2 class="text-3xl font-bold mb-2 relative inline-block mt-20">
                                    <span class="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-sky-500">Welcome Back</span>
                                    <div class="absolute -bottom-1 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-transparent rounded-full opacity-50"></div>
                                </h2>
                                <p class="text-gray-500">Please enter your login credentials to continue</p>
                            </div>

                            <!-- Introduction card with enhanced design -->
                            <div class="bg-gradient-to-r from-blue-50 to-sky-50 p-5 rounded-2xl border border-blue-100 mb-8 shadow-sm hover:shadow-md transition-all duration-300">
                                <div class="flex items-start">
                                    <div class="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-sm">
                                        <i class="pi pi-lock-open text-white text-lg"></i>
                                    </div>
                                    <div class="ml-4">
                                        <h3 class="font-semibold text-blue-800">Secure Login</h3>
                                        <p class="text-sm text-blue-700 mt-1">Access your LivestoX account securely</p>
                                    </div>
                                </div>
                            </div>

                            <!-- Email field with enhanced design -->
                            <div class="form-group mb-6">
                                <label for="email" class="block text-sm font-medium text-gray-700 mb-1.5 items-center">
                                    <i class="pi pi-info-circle text-blue-500 mr-1 text-xs"></i>
                                    Email Address <span class="text-blue-500 ml-1">*</span>
                                </label>
                                <div class="relative group">
                                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <i class="pi pi-envelope text-blue-500 opacity-70 group-hover:opacity-100 transition-opacity"></i>
                                    </div>
                                    <InputText id="email" v-model="email" type="email" placeholder="Your email address"
                                        class="w-full pl-10 pr-3 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition-all group-hover:border-blue-300"
                                        :class="{ 'border-red-300 focus:border-red-500 focus:ring-red-200': submitted && !email }" />
                                </div>
                                <small v-if="submitted && !email" class="text-red-500 text-xs mt-1 block">Email is required</small>
                            </div>

                            <!-- Password field with enhanced design -->
                            <div class="form-group mb-6">
                                <label for="password" class="block text-sm font-medium text-gray-700 mb-1.5  items-center">
                                    <i class="pi pi-info-circle text-blue-500 mr-1 text-xs"></i>
                                    Password <span class="text-blue-500 ml-1">*</span>
                                </label>
                                <div class="relative group">
                                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                                        <i class="pi pi-lock text-blue-500 opacity-70 group-hover:opacity-100 transition-opacity"></i>
                                    </div>
                                    <Password id="password" v-model="password" toggleMask
                                        inputClass="w-full pl-10 pr-3 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition-all group-hover:border-blue-300"
                                        :class="{ 'p-invalid': submitted && !password, 'w-full': true }"
                                        placeholder="Enter your password" :feedback="false"
                                        :inputProps="{ style: { width: '100%' } }" />
                                </div>
                                <small v-if="submitted && !password" class="text-red-500 text-xs mt-1 block">Password is required</small>
                            </div>

                            <!-- Remember me and forgot password with enhanced design -->
                            <div class="flex justify-between items-center mb-8">
                                <div class="flex items-start">
                                    <div class="flex-shrink-0 relative">
                                        <!-- Visible border container with better hover effect -->
                                        <div class="w-6 h-6 border-2 border-blue-400 rounded-md bg-white shadow-sm flex items-center justify-center hover:border-blue-500 transition-colors">
                                            <!-- Actual checkbox positioned absolutely -->
                                            <Checkbox id="rememberMe" v-model="rememberMe" :binary="true"
                                                class="absolute inset-0 w-full h-full opacity-0 z-10 cursor-pointer" />
                                            <!-- Custom visible checkbox indicator -->
                                            <div v-if="rememberMe" class="w-4 h-4 bg-blue-500 rounded flex items-center justify-center">
                                                <i class="pi pi-check text-white text-xs"></i>
                                            </div>
                                        </div>
                                    </div>
                                    <label for="rememberMe" class="ml-3 text-sm text-gray-700 select-none hover:text-blue-600 cursor-pointer transition-colors">
                                        Remember me
                                    </label>
                                </div>

                                <router-link to="/forgotpassword" class="text-blue-600 hover:text-blue-800 font-medium text-sm hover:underline transition-all">
                                    Forgot password?
                                </router-link>
                            </div>

                            <!-- Login Button with centered text and enhanced design -->
                            <Button type="submit" :loading="loading"
                                class="w-full px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-sky-600 hover:from-blue-600 hover:to-sky-700 text-white shadow-md hover:shadow-lg transition-all mb-8 flex items-center justify-center">
                                <span class="flex items-center justify-center w-full">
                                    <i class="pi pi-sign-in mr-2"></i>
                                    <span>Sign In</span>
                                </span>
                            </Button>

                            <!-- Divider with enhanced design -->
                            <div class="relative flex items-center justify-center my-8">
                                <div class="absolute w-full border-t border-gray-300"></div>
                                <div class="relative bg-white px-4 text-sm text-gray-500 font-medium">Or continue with</div>
                            </div>

                            <!-- Social login options with enhanced design -->
                            <div class="flex justify-center gap-4 mb-8">
                                <Button type="button" class="p-button-outlined p-button-rounded w-12 h-12 flex items-center justify-center bg-white border-2 border-gray-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300 transition-all">
                                    <i class="pi pi-google"></i>
                                </Button>
                                <Button type="button" class="p-button-outlined p-button-rounded w-12 h-12 flex items-center justify-center bg-white border-2 border-gray-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300 transition-all">
                                    <i class="pi pi-facebook"></i>
                                </Button>
                                <Button type="button" class="p-button-outlined p-button-rounded w-12 h-12 flex items-center justify-center bg-white border-2 border-gray-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300 transition-all">
                                    <i class="pi pi-apple"></i>
                                </Button>
                            </div>

                            <!-- Sign up link with enhanced design -->
                            <div class="text-center">
                                <p class="text-sm text-gray-600">
                                    Don't have an account?
                                    <router-link to="/signup" class="text-blue-600 hover:text-blue-800 font-medium hover:underline transition-all ml-1">
                                        Create Account
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
.p-inputtext:focus {
    box-shadow: none !important;
    border-color: #3b82f6 !important;
}

.p-password-panel {
    border-radius: 0.75rem !important;
}

/* Add smooth transitions */
.p-inputtext, .p-button {
    transition: all 0.3s ease;
}

/* Enhance input fields on hover */
.p-inputtext:hover:not(:focus) {
    border-color: #93c5fd !important;
}

/* Add loading spinner style */
.p-button-loading-icon {
    margin-right: 0.5rem;
}
</style>