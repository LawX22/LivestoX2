<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import Toast from 'primevue/toast';
import InputText from 'primevue/inputtext';
import Password from 'primevue/password';
import Button from 'primevue/button';
import ProgressSpinner from 'primevue/progressspinner';
import Steps from 'primevue/steps';
import Card from 'primevue/card';
import imageUrl from '/src/assets/vue.svg';

export default defineComponent({
  name: 'ForgotPassword',
  components: {
    Toast,
    InputText,
    Password,
    Button,
    ProgressSpinner,
    Steps,
    Card
  },
  setup() {
    const router = useRouter();
    const toast = useToast();

    // Form data
    const email = ref<string>('');
    const otp = ref<string>('');
    const newPassword = ref<string>('');
    const confirmPassword = ref<string>('');
    
    // Form states
    const loading = ref<boolean>(false);
    const submitted = ref<boolean>(false);
    
    // Step management
    const activeStep = ref<number>(0);
    const steps = ref([
      { label: 'Email' },
      { label: 'Verification' },
      { label: 'New Password' }
    ]);

    // Timer for OTP expiration
    const otpTimer = ref<number>(120); // 2 minutes in seconds
    const timerInterval = ref<number | null>(null);
    
    // Methods for each step
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
        activeStep.value = 1;
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
        activeStep.value = 2;
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
    
    const resetUserPassword = async () => {
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
        await new Promise(resolve => setTimeout(resolve, 1000));
        
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
    
    const formatTime = (seconds: number): string => {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };
    
    // Navigation
    const goBack = () => {
      if (activeStep.value > 0) {
        activeStep.value--;
        submitted.value = false;
      } else {
        router.push('/signin');
      }
    };
    
    return {
      email,
      otp,
      newPassword,
      confirmPassword,
      loading,
      submitted,
      activeStep,
      steps,
      otpTimer,
      submitEmail,
      verifyCode,
      resetUserPassword,
      resendOtp,
      formatTime,
      goBack,
      logoPath: imageUrl
    };
  }
});
</script>

<template>
  <div class="flex min-h-screen bg-gradient-to-b from-green-200 to-green-900">
    <Toast position="top-right" />
    <div class="flex flex-col bg-white rounded-3xl shadow-2xl m-auto w-full max-w-lg overflow-hidden">
      <!-- Header with logo -->
      <div class="text-center pt-8 pb-4">
        <div class="flex justify-center items-center mb-4">
          <div class="bg-green-500 bg-opacity-20 p-3 rounded-full shadow-md">
            <img :src="logoPath" alt="Logo" class="w-12 h-12 object-contain">
          </div>
        </div>
        <h1 class="text-2xl font-bold text-green-700">Reset Your Password</h1>
        <p class="text-gray-600 mt-2 px-6">Follow the steps below to reset your password</p>
      </div>
      
      <!-- Steps indicator -->
      <div class="px-6 py-4">
        <Steps :model="steps" :activeIndex="activeStep" class="forgot-password-steps" />
      </div>
      
      <!-- Step content -->
      <div class="p-6 pt-2">
        <!-- Email Step -->
        <div v-if="activeStep === 0" class="step-content">
          <p class="text-gray-700 mb-6">Enter your email address and we'll send you a verification code.</p>
          
          <form @submit.prevent="submitEmail" class="w-full">
            <div class="mb-6">
              <label for="email" class="block text-gray-700 font-medium mb-2">Email Address</label>
              <InputText id="email" v-model="email" placeholder="Enter your email" class="w-full p-3"
                :class="{ 'p-invalid': submitted && !email }" aria-describedby="email-error" />
              <small id="email-error" v-if="submitted && !email" class="p-error block mt-1">Email is required.</small>
            </div>
            
            <div class="flex gap-4 mt-8">
              <Button type="button" label="Back to Login" class="flex-1 p-3" severity="secondary" @click="goBack" />
              <Button type="submit" label="Send Code" class="flex-1 p-3 shadow-lg" :loading="loading" />
            </div>
          </form>
        </div>
        
        <!-- OTP Verification Step -->
        <div v-if="activeStep === 1" class="step-content">
          <p class="text-gray-700 mb-4">A verification code has been sent to <strong>{{ email }}</strong>.</p>
          <p class="text-gray-700 mb-6">Please enter the 6-digit code below.</p>
          
          <form @submit.prevent="verifyCode" class="w-full">
            <div class="mb-6">
              <label for="otp" class="block text-gray-700 font-medium mb-2">Verification Code</label>
              <InputText id="otp" v-model="otp" placeholder="Enter 6-digit code" class="w-full p-3 text-center tracking-widest" maxlength="6"
                :class="{ 'p-invalid': submitted && (!otp || otp.length < 6) }" aria-describedby="otp-error" />
              <small id="otp-error" v-if="submitted && (!otp || otp.length < 6)" class="p-error block mt-1">
                Please enter the 6-digit verification code.
              </small>
              
              <div class="flex justify-between items-center mt-4">
                <span class="text-sm text-gray-600" v-if="otpTimer > 0">
                  Code expires in: {{ formatTime(otpTimer) }}
                </span>
                <Button type="button" link @click="resendOtp" :disabled="otpTimer > 0 || loading" class="text-sm p-0">
                  {{ otpTimer > 0 ? 'Resend code in ' + formatTime(otpTimer) : 'Resend code' }}
                </Button>
              </div>
            </div>
            
            <div class="flex gap-4 mt-8">
              <Button type="button" label="Back" class="flex-1 p-3" severity="secondary" @click="goBack" />
              <Button type="submit" label="Verify Code" class="flex-1 p-3 shadow-lg" :loading="loading" />
            </div>
          </form>
        </div>
        
        <!-- New Password Step -->
        <div v-if="activeStep === 2" class="step-content">
          <p class="text-gray-700 mb-6">Create a new password for your account.</p>
          
          <form @submit.prevent="resetUserPassword" class="w-full">
            <div class="mb-4">
              <label for="newPassword" class="block text-gray-700 font-medium mb-2">New Password</label>
              <Password id="newPassword" v-model="newPassword" placeholder="Enter new password" class="w-full"
                :feedback="true" toggleMask :class="{ 'p-invalid': submitted && !newPassword }"
                aria-describedby="newPassword-error" inputClass="p-3" />
              <small id="newPassword-error" v-if="submitted && !newPassword" class="p-error block mt-1">
                New password is required.
              </small>
            </div>
            
            <div class="mb-6">
              <label for="confirmPassword" class="block text-gray-700 font-medium mb-2">Confirm Password</label>
              <Password id="confirmPassword" v-model="confirmPassword" placeholder="Confirm new password" class="w-full"
                toggleMask :class="{ 'p-invalid': submitted && (!confirmPassword || confirmPassword !== newPassword) }"
                aria-describedby="confirmPassword-error" inputClass="p-3" :feedback="false" />
              <small id="confirmPassword-error" v-if="submitted && !confirmPassword" class="p-error block mt-1">
                Please confirm your password.
              </small>
              <small id="password-mismatch" v-if="submitted && confirmPassword && confirmPassword !== newPassword" 
                class="p-error block mt-1">
                Passwords do not match.
              </small>
            </div>
            
            <div class="flex gap-4 mt-8">
              <Button type="button" label="Back" class="flex-1 p-3" severity="secondary" @click="goBack" />
              <Button type="submit" label="Reset Password" class="flex-1 p-3 shadow-lg" :loading="loading" />
            </div>
          </form>
        </div>
      </div>
      
      <!-- Footer -->
      <div class="px-6 pb-8 pt-2 text-center">
        <p class="text-gray-600 text-sm">
          Need help? <a href="#" class="text-green-600 hover:text-green-800">Contact Support</a>
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Custom styling for PrimeVue Steps component */
:deep(.forgot-password-steps) {
  .p-steps-item {
    flex: 1;
  }
  
  .p-steps-number {
    background-color: #f3f4f6;
    color: #374151;
    border-color: #d1d5db;
  }
  
  .p-steps-title {
    color: #4b5563;
    font-size: 0.875rem;
  }
  
  .p-steps-item.p-highlight .p-steps-number {
    background-color: #10b981;
    color: #ffffff;
  }
  
  .p-steps-item.p-highlight .p-steps-title {
    color: #059669;
    font-weight: 600;
  }
}

/* Improve OTP input styling */
input#otp {
  letter-spacing: 0.5em;
  font-weight: bold;
}
</style>