<script>
import { defineComponent } from 'vue';
import { useRouter } from 'vue-router'; // Import useRouter from vue-router
import Button from 'primevue/button';
import Toolbar from 'primevue/toolbar';

export default defineComponent({
  name: 'NavBar',
  components: {
    Button,
    Toolbar
  },
  setup() {
    const router = useRouter(); // Initialize the router

    const handleSignIn = () => {
      // Redirect to the sign-in page
      router.push('/signin'); // Replace '/signin' with your actual sign-in route
    };

    const handleSignUp = () => {
      // Redirect to the sign-up page
      router.push('/signup'); // Replace '/signup' with your actual sign-up route
    };

    return {
      handleSignIn,
      handleSignUp
    };
  }
});
</script>

<template>
  <Toolbar class="mb-4 p-3">
    <template #start>
      <div class="flex align-items-center">
        <div class="w-2rem h-2rem bg-primary border-circle flex align-items-center justify-content-center mr-2">
          <span class="text-white font-bold">L</span>
        </div>
        <span class="text-xl font-medium">LivestoX</span>
      </div>
    </template>
    
    <template #end>
      <div class="flex gap-2">
        <Button 
          label="Sign In" 
          class="p-button-text" 
          @click="handleSignIn"
        />
        <Button 
          label="Sign Up" 
          class="p-button-primary" 
          @click="handleSignUp"
        />
      </div>
    </template>
  </Toolbar>
</template>