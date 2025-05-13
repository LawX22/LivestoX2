<script>
import { defineComponent, ref, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import Toast from 'primevue/toast';
import InputText from 'primevue/inputtext';
import Password from 'primevue/password';
import Button from 'primevue/button';
import ProgressSpinner from 'primevue/progressspinner';

export default defineComponent({
  name: 'ForgotPassword',
  components: {
    Toast,
    InputText,
    Password,
    Button,
    ProgressSpinner
  },
  setup() {
    const router = useRouter();
    const toast = useToast();

    // Form data
    const email = ref('');
    const otp = ref('');
    const newPassword = ref('');
    const confirmPassword = ref('');

    // Form states
    const loading = ref(false);
    const submitted = ref(false);
    const currentStep = ref(0);

    // Step titles
    const stepTitles = ref([
      'Forgot Password',
      'Verify Your Identity',
      'Create New Password'
    ]);

    // Timer for OTP expiration
    const otpTimer = ref(120); // 2 minutes in seconds
    const timerInterval = ref(null);

    // Methods for handling form submissions
    const submitEmail = async () => {
      submitted.value = true;

      if (!email.value) {
        toast.add({
          severity: 'warn',
          summary: 'Email Required',
          detail: 'Please enter your email address',
          life: 3000
        });
        return;
      }

      try {
        loading.value = true;

        // Replace with actual API call
        // await requestPasswordReset(email.value);
        await new Promise(resolve => setTimeout(resolve, 1000));

        toast.add({
          severity: 'success',
          summary: 'OTP Sent',
          detail: 'A verification code has been sent to your email',
          life: 3000
        });

        // Start OTP timer
        startOtpTimer();

        // Move to OTP verification step
        currentStep.value = 1;
        submitted.value = false;
      } catch (error) {
        const errorMessage = (error instanceof Error) ? error.message : 'Failed to send verification code. Please try again.';
        toast.add({
          severity: 'error',
          summary: 'Request Failed',
          detail: errorMessage,
          life: 3000
        });
      } finally {
        loading.value = false;
      }
    };

    const verifyCode = async () => {
      submitted.value = true;

      if (!otp.value || otp.value.length < 6) {
        toast.add({
          severity: 'warn',
          summary: 'Invalid Code',
          detail: 'Please enter the 6-digit verification code',
          life: 3000
        });
        return;
      }

      try {
        loading.value = true;

        // Replace with actual API call
        // await verifyOTP(email.value, otp.value);
        await new Promise(resolve => setTimeout(resolve, 1000));

        toast.add({
          severity: 'success',
          summary: 'Verification Successful',
          detail: 'Your code has been verified',
          life: 3000
        });

        // Stop OTP timer
        stopOtpTimer();

        // Move to password reset step
        currentStep.value = 2;
        submitted.value = false;
      } catch (error) {
        const errorMessage = (error instanceof Error) ? error.message : 'Invalid verification code. Please try again.';
        toast.add({
          severity: 'error',
          summary: 'Verification Failed',
          detail: errorMessage,
          life: 3000
        });
      } finally {
        loading.value = false;
      }
    };

    const resetPassword = async () => {
      submitted.value = true;

      if (!newPassword.value || !confirmPassword.value) {
        toast.add({
          severity: 'warn',
          summary: 'Missing Information',
          detail: 'Please fill in all required fields',
          life: 3000
        });
        return;
      }

      if (newPassword.value !== confirmPassword.value) {
        toast.add({
          severity: 'error',
          summary: 'Password Mismatch',
          detail: 'Passwords do not match',
          life: 3000
        });
        return;
      }

      try {
        loading.value = true;

        // Replace with actual API call
        // await resetPassword(email.value, otp.value, newPassword.value);
        await new Promise(resolve => setTimeout(resolve, 1500));

        toast.add({
          severity: 'success',
          summary: 'Password Reset',
          detail: 'Your password has been successfully reset',
          life: 5000
        });

        // Redirect to login page after a short delay
        setTimeout(() => {
          router.push('/signin');
        }, 2000);
      } catch (error) {
        const errorMessage = (error instanceof Error) ? error.message : 'Failed to reset password. Please try again.';
        toast.add({
          severity: 'error',
          summary: 'Reset Failed',
          detail: errorMessage,
          life: 3000
        });
      } finally {
        loading.value = false;
      }
    };

    // Determine which method to call based on current step
    const handleSubmit = () => {
      if (currentStep.value === 0) {
        submitEmail();
      } else if (currentStep.value === 1) {
        verifyCode();
      } else if (currentStep.value === 2) {
        resetPassword();
      }
    };

    // Navigation
    const prevStep = () => {
      if (currentStep.value > 0) {
        currentStep.value--;
        submitted.value = false;
      }
    };

    // OTP timer functions
    const startOtpTimer = () => {
      otpTimer.value = 120; // Reset to 2 minutes

      if (timerInterval.value) {
        clearInterval(timerInterval.value);
      }

      timerInterval.value = window.setInterval(() => {
        if (otpTimer.value > 0) {
          otpTimer.value--;
        } else {
          stopOtpTimer();
          toast.add({
            severity: 'warn',
            summary: 'OTP Expired',
            detail: 'Your verification code has expired. Please request a new one.',
            life: 5000
          });
        }
      }, 1000);
    };

    const stopOtpTimer = () => {
      if (timerInterval.value) {
        clearInterval(timerInterval.value);
        timerInterval.value = null;
      }
    };

    const resendOtp = async () => {
      if (loading.value) return;

      try {
        loading.value = true;

        // Replace with actual API call
        // await requestPasswordReset(email.value);
        await new Promise(resolve => setTimeout(resolve, 1000));

        toast.add({
          severity: 'success',
          summary: 'OTP Resent',
          detail: 'A new verification code has been sent to your email',
          life: 3000
        });

        // Restart OTP timer
        startOtpTimer();
      } catch (error) {
        const errorMessage = (error instanceof Error) ? error.message : 'Failed to resend verification code. Please try again.';
        toast.add({
          severity: 'error',
          summary: 'Request Failed',
          detail: errorMessage,
          life: 3000
        });
      } finally {
        loading.value = false;
      }
    };

    const formatTime = (seconds) => {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    // Cleanup timer on component unmount
    onBeforeUnmount(() => {
      stopOtpTimer();
    });

    return {
      email,
      otp,
      newPassword,
      confirmPassword,
      loading,
      submitted,
      currentStep,
      stepTitles,
      otpTimer,
      handleSubmit,
      prevStep,
      resendOtp,
      formatTime,
      router
    };
  }
});
</script>

<template>
  <div class="flex min-h-screen bg-gradient-to-br from-blue-100 via-sky-100 to-blue-200">
    <Toast position="top-right" />

    <!-- Main container -->
    <div class="w-full max-w-xl mx-auto my-20 px-4 sm:px-6">
      <!-- Card with elegant shadow -->
      <div class="relative bg-white rounded-3xl shadow-2xl overflow-hidden transition-all duration-500">

        <!-- Top accent bar with gradient -->
        <div class="h-2 bg-gradient-to-r from-blue-400 via-sky-500 to-blue-600"></div>

        <!-- Form content -->
        <div class="p-6 lg:p-10">
          <!-- Header with step title -->
          <div class="text-center mb-8">
            <h2 class="text-3xl font-bold text-gray-800 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-sky-600 mb-2">
              {{ stepTitles[currentStep] }}
            </h2>
            <p class="text-gray-500">Step {{ currentStep + 1 }} of 3</p>

            <!-- Progress bar -->
            <div class="mt-8">
              <div class="w-full bg-gray-100 rounded-full h-2 mb-3">
                <div
                  class="bg-gradient-to-r from-blue-400 via-sky-500 to-blue-600 h-2 rounded-full transition-all duration-500 ease-in-out"
                  :style="{ width: `${(currentStep + 1) * 33.33}%` }"></div>
              </div>
              <!-- Step indicators -->
              <div class="flex justify-between px-2">
                <div v-for="step in 3" :key="step" :class="`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium shadow-md transition-all duration-300 transform
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
          <form @submit.prevent="handleSubmit" class="mx-auto">
            <!-- Step 1: Email -->
            <div v-if="currentStep === 0" class="space-y-6 animate-fadeSlideIn">
              <!-- Introduction card -->
              <div class="bg-gradient-to-r from-blue-50 to-sky-50 p-5 rounded-2xl border border-blue-100 mb-6 shadow-sm">
                <div class="flex items-start">
                  <div class="flex-shrink-0 w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                    <i class="pi pi-envelope text-blue-600 text-lg"></i>
                  </div>
                  <div class="ml-4">
                    <h3 class="font-semibold text-blue-800">Enter your email</h3>
                    <p class="text-sm text-blue-700 mt-1">We'll send you a verification code to reset your password</p>
                  </div>
                </div>
              </div>

              <div class="form-group">
                <label for="email" class="block text-sm font-medium text-gray-700 mb-1.5">
                  Email Address <span class="text-blue-500">*</span>
                </label>
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <i class="pi pi-envelope text-blue-500 opacity-70"></i>
                  </div>
                  <InputText id="email" v-model="email" type="email" placeholder="Enter your registered email"
                    class="w-full pl-10 pr-3 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition-all"
                    :class="{ 'border-red-300 focus:border-red-500 focus:ring-red-200': submitted && !email }" />
                </div>
                <div class="mt-1">
                  <small v-if="submitted && !email" class="text-red-500 text-xs block">Required field</small>
                  <small v-else class="text-gray-500 text-xs block">We'll send a verification code to this email</small>
                </div>
              </div>
            </div>

            <!-- Step 2: Verification Code -->
            <div v-if="currentStep === 1" class="space-y-6 animate-fadeSlideIn">
              <!-- Verification introduction -->
              <div class="bg-gradient-to-r from-sky-50 to-blue-50 p-5 rounded-2xl border border-sky-100 mb-6 shadow-sm">
                <div class="flex items-start">
                  <div class="flex-shrink-0 w-10 h-10 rounded-xl bg-sky-100 flex items-center justify-center">
                    <i class="pi pi-check-circle text-sky-600 text-lg"></i>
                  </div>
                  <div class="ml-4">
                    <h3 class="font-semibold text-sky-800">Verify Your Identity</h3>
                    <p class="text-sm text-sky-700 mt-1">Enter the 6-digit code we sent to your email</p>
                  </div>
                </div>
              </div>

              <!-- Verification animation -->
              <div class="flex justify-center mb-6">
                <div class="w-16 h-16 rounded-full bg-sky-100 flex items-center justify-center text-sky-500 animate-pulse">
                  <i class="pi pi-envelope text-2xl"></i>
                </div>
              </div>

              <div class="text-center mb-6">
                <p class="text-gray-600">We've sent a verification code to:</p>
                <p class="font-medium text-sky-600">{{ email }}</p>
              </div>

              <!-- Verification code input -->
              <div class="form-group">
                <label for="otp" class="block text-sm font-medium text-gray-700 mb-1.5">
                  Verification Code <span class="text-sky-500">*</span>
                </label>
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <i class="pi pi-key text-sky-500 opacity-70"></i>
                  </div>
                  <InputText id="otp" v-model="otp" placeholder="Enter 6-digit code" maxlength="6"
                    class="w-full pl-10 pr-3 py-3 text-center tracking-widest text-lg font-medium rounded-xl border border-gray-300 focus:ring-2 focus:ring-sky-200 focus:border-sky-500 transition-all"
                    :class="{ 'border-red-300 focus:border-red-500 focus:ring-red-200': submitted && (!otp || otp.length < 6) }" />
                </div>
                <small v-if="submitted && (!otp || otp.length < 6)" class="text-red-500 text-xs mt-1 block">
                  Please enter the 6-digit verification code
                </small>
              </div>

              <!-- Timer and resend code option -->
              <div class="flex justify-between items-center mt-4">
                <span class="text-sm text-gray-600" v-if="otpTimer > 0">
                  Code expires in: {{ formatTime(otpTimer) }}
                </span>
                <button type="button" @click="resendOtp" :disabled="otpTimer > 0 || loading"
                  class="text-sky-600 hover:text-sky-800 text-sm font-medium focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed">
                  {{ otpTimer > 0 ? 'Resend code in ' + formatTime(otpTimer) : 'Resend code' }}
                </button>
              </div>
            </div>

            <!-- Step 3: New Password -->
            <div v-if="currentStep === 2" class="space-y-6 animate-fadeSlideIn">
              <!-- Reset introduction -->
              <div class="bg-gradient-to-r from-blue-50 to-sky-50 p-5 rounded-2xl border border-blue-100 mb-6 shadow-sm">
                <div class="flex items-start">
                  <div class="flex-shrink-0 w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                    <i class="pi pi-lock text-blue-600 text-lg"></i>
                  </div>
                  <div class="ml-4">
                    <h3 class="font-semibold text-blue-800">Create New Password</h3>
                    <p class="text-sm text-blue-700 mt-1">Choose a strong password for your account</p>
                  </div>
                </div>
              </div>

              <div class="form-group">
                <label for="newPassword" class="block text-sm font-medium text-gray-700 mb-1.5">
                  New Password <span class="text-blue-500">*</span>
                </label>
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                    <i class="pi pi-lock text-blue-500 opacity-70"></i>
                  </div>
                  <Password id="newPassword" v-model="newPassword" toggleMask
                    inputClass="w-full pl-10 pr-3 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition-all"
                    :class="{ 'p-invalid': submitted && !newPassword, 'w-full': true }"
                    placeholder="Create a secure password" :feedback="true"
                    :inputProps="{ style: { width: '100%' } }" />
                </div>
                <small v-if="submitted && !newPassword" class="text-red-500 text-xs mt-1 block">Required field</small>
              </div>

              <div class="form-group">
                <label for="confirmPassword" class="block text-sm font-medium text-gray-700 mb-1.5">
                  Confirm Password <span class="text-blue-500">*</span>
                </label>
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                    <i class="pi pi-lock text-blue-500 opacity-70"></i>
                  </div>
                  <Password id="confirmPassword" v-model="confirmPassword" toggleMask
                    placeholder="Confirm your password"
                    inputClass="w-full pl-10 pr-3 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition-all"
                    :class="{ 'p-invalid': submitted && (!confirmPassword || confirmPassword !== newPassword), 'w-full': true }"
                    :feedback="false" :inputProps="{ style: { width: '100%' } }" />
                </div>
                <div class="mt-1">
                  <small v-if="submitted && !confirmPassword" class="text-red-500 text-xs block">Required field</small>
                  <small v-else-if="submitted && confirmPassword !== newPassword" class="text-red-500 text-xs block">Passwords do not match</small>
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

            <!-- Navigation Buttons -->
            <div class="mt-10 flex justify-between items-center">
              <!-- Back button - hidden on first step -->
              <Button type="button" v-if="currentStep > 0" @click="prevStep"
                class="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-sky-600 hover:from-blue-600 hover:to-sky-700 text-white shadow-md hover:shadow-lg transition-all"
                :disabled="loading">
                <i class="pi pi-arrow-left mr-1"></i>
                Back
              </Button>
              <div v-else></div>

              <!-- Next/Submit button -->
              <Button type="submit" :loading="loading" :label="currentStep < 2 ? 'Continue' : 'Reset Password'"
                class="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-sky-600 hover:from-blue-600 hover:to-sky-700 text-white shadow-md hover:shadow-lg transition-all"
                :icon="currentStep < 2 ? 'pi pi-arrow-right' : 'pi pi-check'" iconPos="right" />
            </div>

            <!-- Sign in link -->
            <div class="mt-8 text-center">
              <p class="text-sm text-gray-600">
                Remember your password?
                <router-link to="/signin" class="text-blue-600 hover:text-blue-800 font-medium">
                  Sign in
                </router-link>
              </p>
            </div>
          </form>
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

/* OTP input styling */
input#otp {
  letter-spacing: 0.5em;
  font-weight: bold;
}
</style>