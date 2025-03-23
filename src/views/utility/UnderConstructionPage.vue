<template>
    <div class="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient">
      <!-- Animated Background Elements -->
      <div class="fixed inset-0 pointer-events-none overflow-hidden">
        <!-- Floating shapes -->
        <div v-for="(shape, index) in floatingShapes" :key="index"
             class="absolute rounded-full opacity-70"
             :style="shape.style">
        </div>
      </div>
      
      <!-- Main Card with Glass Effect -->
      <div class="w-full max-w-xl shadow-2xl rounded-xl overflow-hidden glass-card">
        <div class="header">
          <div class="relative h-64 bg-gradient-to-r from-primary-800 to-primary-600 flex items-center justify-center overflow-hidden">
            <!-- Construction animated scene -->
            <div class="construction-scene relative z-10">
              <!-- Building blocks animation -->
              <div v-for="(block, index) in buildingBlocks" :key="index"
                   class="building-block absolute rounded"
                   :class="block.class"
                   :style="block.style">
              </div>
              
              <!-- Animated character -->
              <div class="character">
                <div class="character-head bg-yellow-500 rounded-full flex items-center justify-center">
                  <div class="character-face flex flex-col items-center">
                    <div class="eyes flex">
                      <div class="eye"></div>
                      <div class="eye"></div>
                    </div>
                    <div class="mouth"></div>
                  </div>
                </div>
                <div class="character-body bg-blue-600"></div>
                <div class="character-arm-left"></div>
                <div class="character-arm-right"></div>
              </div>
              
              <!-- Tools with animations -->
              <div class="tools flex">
                <i class="pi pi-cog text-white text-6xl mr-4 animate-spin"></i>
                <i class="pi pi-wrench text-white text-6xl animate-float"></i>
              </div>
            </div>
          </div>
        </div>
        
        <div class="p-6 text-center">
          <h1 class="text-5xl font-bold bg-gradient-text mb-4">Under Construction</h1>
          <p class="text-xl text-gray-700 mb-6">
            We're crafting something <span class="text-primary font-bold">amazing</span> for you! 
            Our new site will be ready to launch soon.
          </p>
          
          <!-- Animated progress bar -->
          <div class="mb-6 relative">
            <div class="custom-progress" :style="{ width: `${progress}%` }"></div>
            <div class="progress-icons absolute">
              <i class="pi pi-truck progress-truck" :style="{ left: `${progress}%` }"></i>
            </div>
          </div>
          
          <!-- Countdown timer with extended time -->
          <div class="countdown-container flex justify-center gap-4 mb-6">
            <div v-for="(unit, key) in countdown" :key="key" class="countdown-unit">
              <div class="countdown-value">{{ unit.value }}</div>
              <div class="countdown-label">{{ unit.label }}</div>
            </div>
          </div>
          
          <div class="flex flex-col sm:flex-row justify-center gap-3 mb-4">
            <button 
              class="p-button-raised button-with-shadow px-4 py-2 bg-blue-500 text-white rounded-md flex items-center justify-center"
              @click="showNotifyDialog = true"
            >
              <i class="pi pi-bell mr-2"></i>
              Get Notified
            </button>
            <button 
              class="p-button-outlined button-outline-glow px-4 py-2 border border-blue-500 text-blue-500 rounded-md flex items-center justify-center"
              @click="showInfoDialog = true"
            >
              <i class="pi pi-info-circle mr-2"></i>
              Learn More
            </button>
          </div>
          
          <!-- Go Back Button -->
          <button 
            class="p-button-raised button-with-shadow px-4 py-2 bg-red-500 text-white rounded-md flex items-center justify-center mx-auto mt-4"
            @click="handleGoBack"
          >
            <i class="pi pi-arrow-left mr-2"></i>
            Go Back
          </button>
        </div>
        
        <div class="footer">
          <div class="text-center p-3 footer-gradient">
            <p class="text-white mb-2">Expected launch: {{ launchDate }}</p>
            <div class="social-icons flex justify-center gap-3 mt-3">
              <a href="#" class="social-icon" v-for="icon in ['facebook', 'twitter', 'instagram']" :key="icon">
                <i :class="`pi pi-${icon}`"></i>
              </a>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Notification Dialog -->
      <div v-if="showNotifyDialog" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg shadow-lg w-11/12 max-w-md fancy-dialog">
          <div class="bg-gradient-to-r from-blue-700 to-blue-500 text-white px-4 py-3 rounded-t-lg flex justify-between items-center">
            <h2 class="font-bold text-lg">Stay Updated</h2>
            <button @click="showNotifyDialog = false" class="text-white hover:text-gray-200">
              <i class="pi pi-times"></i>
            </button>
          </div>
          <div class="p-4">
            <div class="notification-icon text-center mb-4">
              <i class="pi pi-envelope text-5xl text-blue-500"></i>
            </div>
            <p class="mb-4 text-center">Be the first to know when we launch our new site!</p>
            <div class="field mb-4">
              <div class="relative">
                <input 
                  id="name" 
                  type="text" 
                  v-model="subscribeForm.name" 
                  class="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  placeholder=" "
                />
                <label 
                  for="name" 
                  class="absolute left-3 top-3 transition-all duration-200"
                  :class="{'text-xs -top-2 bg-white px-1': subscribeForm.name}"
                >
                  Your Name
                </label>
              </div>
            </div>
            <div class="field mb-4">
              <div class="relative">
                <input 
                  id="email" 
                  type="email" 
                  v-model="subscribeForm.email" 
                  class="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  :class="{'border-red-500': subscribeForm.emailError}"
                  placeholder=" "
                />
                <label 
                  for="email" 
                  class="absolute left-3 top-3 transition-all duration-200"
                  :class="{'text-xs -top-2 bg-white px-1': subscribeForm.email}"
                >
                  Your Email Address
                </label>
              </div>
              <small v-if="subscribeForm.emailError" class="text-red-500 block mt-2">
                Please enter a valid email address
              </small>
            </div>
            <div class="field-checkbox mb-4 flex items-center">
              <input 
                type="checkbox" 
                id="updates" 
                v-model="subscribeForm.updates" 
                class="mr-2"
              />
              <label for="updates" class="ml-2">I'd like to receive occasional updates</label>
            </div>
          </div>
          <div class="p-4 border-t flex flex-col gap-2">
            <button 
              class="button-with-shadow w-full py-2 bg-blue-500 text-white rounded-md flex items-center justify-center"
              @click="submitSubscription" 
              :disabled="submitting"
            >
              <i v-if="!submitting" class="pi pi-check mr-2"></i>
              <span v-if="submitting" class="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
              Subscribe
            </button>
            <button 
              class="w-full py-2 text-gray-700 hover:text-gray-900 rounded-md flex items-center justify-center"
              @click="showNotifyDialog = false" 
            >
              <i class="pi pi-times mr-2"></i>
              Maybe Later
            </button>
          </div>
        </div>
      </div>
      
      <!-- Info Dialog -->
      <div v-if="showInfoDialog" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg shadow-lg w-11/12 max-w-lg fancy-dialog">
          <div class="bg-gradient-to-r from-blue-700 to-blue-500 text-white px-4 py-3 rounded-t-lg flex justify-between items-center">
            <h2 class="font-bold text-lg">Coming Soon!</h2>
            <button @click="showInfoDialog = false" class="text-white hover:text-gray-200">
              <i class="pi pi-times"></i>
            </button>
          </div>
          <div class="p-4">
            <div class="text-center mb-4">
              <i class="pi pi-info-circle text-5xl text-blue-500"></i>
            </div>
            <p class="mb-4 text-center text-lg">
              We're building something special just for you!
            </p>
            <hr class="my-4" />
            <h3 class="text-xl font-bold mb-3">What to Expect:</h3>
            <div class="feature-list">
              <div v-for="(feature, index) in features" :key="index" class="feature-item">
                <i :class="`pi ${feature.icon} feature-icon`"></i>
                <div class="feature-content">
                  <h4 class="feature-title">{{ feature.title }}</h4>
                  <p class="feature-description">{{ feature.description }}</p>
                </div>
              </div>
            </div>
          </div>
          <div class="p-4 border-t">
            <button 
              class="button-with-shadow w-full py-2 bg-blue-500 text-white rounded-md flex items-center justify-center"
              @click="showInfoDialog = false" 
            >
              <i class="pi pi-heart mr-2"></i>
              Can't Wait!
            </button>
          </div>
        </div>
      </div>
      
      <!-- Rickroll Video Modal -->
      <div v-if="showRickroll" class="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center">
        <div class="video-container w-full max-w-2xl">
          <div class="relative pb-9/16 w-full h-0">
            <iframe
              ref="videoFrame"
              class="absolute top-0 left-0 w-full h-full"
              src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&controls=0&rel=0&showinfo=0"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            ></iframe>
          </div>
        </div>
        <div class="text-white mt-4">
          <p class="text-2xl font-bold">You've been rickrolled!</p>
          <p class="mt-2">Video will close automatically in {{ rickrollTimer }} seconds</p>
        </div>
      </div>
      
      <!-- Confetti animation when notifications submitted -->
      <div v-if="showConfetti" class="fixed inset-0 pointer-events-none z-50">
        <div v-for="i in 100" :key="i" 
             class="absolute animate-confetti"
             :style="getConfettiStyle(i)">
          <div class="confetti-particle" :style="{ backgroundColor: getRandomColor() }"></div>
        </div>
      </div>
      
      <!-- Toast for notifications -->
      <div 
        v-if="toastMessage" 
        class="fixed top-4 right-4 left-4 sm:left-auto bg-green-500 text-white p-4 rounded-lg shadow-lg flex items-center z-50 toast-animation"
      >
        <i class="pi pi-check-circle mr-2 text-xl"></i>
        <div>
          <div class="font-bold">{{ toastMessage.title }}</div>
          <div>{{ toastMessage.message }}</div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, onBeforeUnmount } from 'vue';
  
  // Toast message
  const toastMessage = ref(null);
  
  // Form state
  const subscribeForm = ref({
    name: '',
    email: '',
    emailError: false,
    updates: true
  });
  
  // UI states
  const showNotifyDialog = ref(false);
  const showInfoDialog = ref(false);
  const submitting = ref(false);
  const progress = ref(0);
  const showConfetti = ref(false);
  const launchDate = ref('December 2027'); // Extended launch date
  
  // Rickroll related
  const showRickroll = ref(false);
  const rickrollTimer = ref(30);
  const rickrollTimerInterval = ref(null);
  const backButtonClicked = ref(false);
  const videoFrame = ref(null);
  
  // Countdown timer with much longer time
  const countdown = ref({
    days: { value: 999, label: 'Days' },
    hours: { value: 23, label: 'Hours' },
    minutes: { value: 59, label: 'Minutes' },
    seconds: { value: 59, label: 'Seconds' }
  });
  
  // Handle go back button click
  const handleGoBack = () => {
    if (!backButtonClicked.value) {
      // First click - show rickroll
      backButtonClicked.value = true;
      showRickroll.value = true;
      
      // Start countdown timer
      rickrollTimerInterval.value = setInterval(() => {
        rickrollTimer.value--;
        
        if (rickrollTimer.value <= 0) {
          clearInterval(rickrollTimerInterval.value);
          showRickroll.value = false;
        }
      }, 1000);
    } else {
      // Second click - go to home page
      window.location.href = '/';
    }
  };
  
  // Features for info dialog
  const features = ref([
    { 
      icon: 'pi-desktop', 
      title: 'Sleek Design', 
      description: 'Modern, responsive interface optimized for all devices.' 
    },
    { 
      icon: 'pi-bolt', 
      title: 'Lightning Fast', 
      description: 'Optimized performance for ultra-quick loading times.' 
    },
    { 
      icon: 'pi-shield', 
      title: 'Secure Platform', 
      description: 'Best-in-class security measures to protect your data.' 
    },
    { 
      icon: 'pi-users', 
      title: 'Community Focus', 
      description: 'Built with our community\'s needs at the forefront.' 
    }
  ]);
  
  // Floating shapes for background animation
  const floatingShapes = ref([]);
  
  // Building blocks for construction animation
  const buildingBlocks = ref([]);
  
  // Generate animated elements
  onMounted(() => {
    // Create floating background shapes
    const colors = ['#4338ca20', '#0ea5e920', '#0d948820', '#7e2295c20'];
    for (let i = 0; i < 15; i++) {
      const size = 50 + Math.random() * 150;
      floatingShapes.value.push({
        style: {
          width: `${size}px`,
          height: `${size}px`,
          backgroundColor: colors[Math.floor(Math.random() * colors.length)],
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          animation: `float ${5 + Math.random() * 15}s ease-in-out infinite alternate`
        }
      });
    }
    
    // Create building blocks for animation
    const blockColors = ['#0ea5e9', '#6366f1', '#8b5cf6', '#ec4899', '#f97316'];
    for (let i = 0; i < 8; i++) {
      const size = 25 + Math.random() * 40;
      buildingBlocks.value.push({
        class: 'shadow-lg',
        style: {
          width: `${size}px`,
          height: `${size}px`,
          backgroundColor: blockColors[Math.floor(Math.random() * blockColors.length)],
          left: `${10 + Math.random() * 80}%`,
          top: `${40 + Math.random() * 40}%`,
          animation: `block-move ${3 + Math.random() * 4}s ease-in-out infinite alternate`,
          animationDelay: `${Math.random() * 2}s`
        }
      });
    }
    
    // Progress bar animation
    const interval = setInterval(() => {
      progress.value = (progress.value + 1) % 100;
    }, 150);
    
    // Countdown timer animation - slow it down to match the very long countdown
    const countdownInterval = setInterval(() => {
      countdown.value.seconds.value -= 1;
      if (countdown.value.seconds.value < 0) {
        countdown.value.seconds.value = 59;
        countdown.value.minutes.value -= 1;
        
        if (countdown.value.minutes.value < 0) {
          countdown.value.minutes.value = 59;
          countdown.value.hours.value -= 1;
          
          if (countdown.value.hours.value < 0) {
            countdown.value.hours.value = 23;
            countdown.value.days.value -= 1;
            
            if (countdown.value.days.value < 0) {
              countdown.value.days.value = 0;
              countdown.value.hours.value = 0;
              countdown.value.minutes.value = 0;
              countdown.value.seconds.value = 0;
              clearInterval(countdownInterval);
            }
          }
        }
      }
    }, 1000);
    
    // Clean up on unmount
    onBeforeUnmount(() => {
      clearInterval(interval);
      clearInterval(countdownInterval);
      if (rickrollTimerInterval.value) {
        clearInterval(rickrollTimerInterval.value);
      }
    });
  });
  
  // Form submission
  const submitSubscription = () => {
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(subscribeForm.value.email)) {
      subscribeForm.value.emailError = true;
      return;
    }
    
    subscribeForm.value.emailError = false;
    submitting.value = true;
    
    // Simulate API call
    setTimeout(() => {
      submitting.value = false;
      showNotifyDialog.value = false;
      
      // Show confetti animation
      showConfetti.value = true;
      setTimeout(() => {
        showConfetti.value = false;
      }, 4000);
      
      // Show success toast
      toastMessage.value = {
        title: "You're on the list!",
        message: "Thanks for subscribing. We'll notify you when we launch!"
      };
      
      setTimeout(() => {
        toastMessage.value = null;
      }, 5000);
      
      // Reset form
      subscribeForm.value = {
        name: '',
        email: '',
        emailError: false,
        updates: true
      };
    }, 1800);
  };
  
  // Helper functions for confetti
  const getRandomColor = () => {
    const colors = ['#FCA5A5', '#93C5FD', '#A5B4FC', '#C4B5FD', '#A7F3D0', '#FDE68A', '#FDBA74', '#C4B5FD'];
    return colors[Math.floor(Math.random() * colors.length)];
  };
  
  const getConfettiStyle = () => {
    const randomX = Math.random() * 100;
    const randomRotation = Math.random() * 360;
    const randomDelay = Math.random() * 1.5;
    const randomDuration = 2 + Math.random() * 3;
    const scale = 0.5 + Math.random() * 1;
    
    return {
      left: `${randomX}vw`,
      top: '-5vh',
      transform: `scale(${scale}) rotate(${randomRotation}deg)`,
      animationDelay: `${randomDelay}s`,
      animationDuration: `${randomDuration}s`
    };
  };
  </script>
  
  <style>
  /* Background Gradient */
  .bg-gradient {
    background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 50%, #bae6fd 100%);
  }
  
  /* Glass Card Effect */
  .glass-card {
    background: rgba(255, 255, 255, 0.7) !important;
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.3);
  }
  
  /* Text Gradient */
  .bg-gradient-text {
    background: linear-gradient(to right, #0284c7, #0ea5e9, #38bdf8);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
  }
  
  /* Footer Gradient */
  .footer-gradient {
    background: linear-gradient(to right, #0284c7, #0ea5e9);
  }
  
  /* Button Styles */
  .button-with-shadow {
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.1);
    transition: all 0.2s ease;
  }
  
  .button-with-shadow:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15), 0 2px 4px rgba(0, 0, 0, 0.12);
  }
  
  .button-outline-glow {
    border: 2px solid #0ea5e9;
    box-shadow: 0 0 8px rgba(14, 165, 233, 0.2);
    transition: all 0.2s ease;
  }
  
  .button-outline-glow:hover {
    box-shadow: 0 0 12px rgba(14, 165, 233, 0.4);
  }
  
  /* Progress Bar Customization */
  .custom-progress {
    height: 6px;
    background: linear-gradient(90deg, #0284c7, #0ea5e9, #38bdf8);
    background-size: 200% 100%;
    border-radius: 3px;
    animation: gradient-shift 2s ease infinite;
  }
  
  .progress-icons {
    top: -10px;
    width: 100%;
    height: 20px;
  }
  
  .progress-truck {
    position: absolute;
    font-size: 1.5rem;
    margin-left: -12px;
    color: #0ea5e9;
    transform: scaleX(-1);
    top: -5px;
  }
  
  /* Social Icons */
  .social-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background-color: rgba(255, 255, 255, 0.3);
    color: white;
    transition: all 0.2s ease;
  }
  
  .social-icon:hover {
    background-color: rgba(255, 255, 255, 0.5);
    transform: translateY(-2px);
  }
  
  /* Countdown Timer */
  .countdown-container {
    margin-bottom: 2rem;
  }
  
  .countdown-unit {
    display: flex;
    flex-direction: column;
    align-items: center;
    min-width: 60px;
  }
  
  .countdown-value {
    font-size: 2rem;
    font-weight: bold;
    color: #0284c7;
    background: rgba(255, 255, 255, 0.6);
    border-radius: 8px;
    padding: 0.5rem;
    width: 100%;
    text-align: center;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  }
  
  .countdown-label {
    font-size: 0.875rem;
    margin-top: 0.5rem;
    color: #64748b;
  }
  
  /* Video Container */
  .pb-9\/16 {
    padding-bottom: 56.25%;
  }
  
  /* Feature List */
  .feature-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  
  .feature-item {
    display: flex;
    align-items: flex-start;
    padding: 0.75rem;
    background-color: rgba(241, 245, 249, 0.7);
    border-radius: 8px;
    transition: all 0.2s ease;
  }
  
  .feature-item:hover {
    transform: translateX(4px);
    background-color: rgba(241, 245, 249, 1);
  }
  
  .feature-icon {
    font-size: 1.5rem;
    color: #0ea5e9;
    margin-right: 1rem;
  }
  
  .feature-title {
    font-weight: bold;
    margin-bottom: 0.25rem;
    color: #0f172a;
  }
  
  .feature-description {
    color: #64748b;
    font-size: 0.875rem;
  }
  
  /* Construction Scene Animation */
  .construction-scene {
    width: 100%;
    height: 100%;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .character {
    position: relative;
    z-index: 2;
    width: 60px;
    height: 100px;
  }
  
  .character-head {
    width: 40px;
    height: 40px;
    position: relative;
    animation: head-bob 2s ease-in-out infinite;
  }
  
  .character-face {
    transform: scale(0.7);
  }
  
  .eyes {
    display: flex;
    gap: 8px;
    margin-bottom: 4px;
  }
  
  .eye {
    width: 8px;
    height: 8px;
    background-color: #1e293b;
    border-radius: 50%;
    animation: blink 3s ease-in-out infinite;
  }
  
  .mouth {
    width: 12px;
    height: 5px;
    background-color: #1e293b;
    border-radius: 2px;
  }
  
  .character-body {
    width: 30px;
    height: 40px;
    position: absolute;
    top: 35px;
    left: 15px;
    border-radius: 6px;
  }
  
  .character-arm-left, .character-arm-right {
    width: 10px;
    height: 30px;
    background-color: #0ea5e9;
    position: absolute;
    border-radius: 4px;
  }
  
  .character-arm-left {
    top: 40px;
    left: 5px;
    transform: rotate(-15deg);
    transform-origin: top right;
    animation: arm-swing-left 2s ease-in-out infinite;
  }
  
  .character-arm-right {
    top: 40px;
    right: 5px;
    transform: rotate(15deg);
    transform-origin: top left;
    animation: arm-swing-right 2s ease-in-out infinite alternate;
  }
  
  .tools {
    position: absolute;
    top: 30%;
    right: 20%;
  }
  
  /* Toast Animation */
  .toast-animation {
    animation: slide-in 0.3s ease-out, fade-out 0.3s ease-in 4.7s forwards;
  }
  
  @keyframes slide-in {
    from {
      transform: translateY(-20px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
  
  @keyframes fade-out {
    from {
      opacity: 1;
    }
    to {
      opacity: 0;
    }
  }
  
  /* Building Blocks Animation */
  @keyframes block-move {
    0% {
      transform: translate(0, 0) rotate(0deg);
    }
    100% {
      transform: translate(10px, -20px) rotate(10deg);
    }
  }
  
  /* Animations */
  @keyframes float {
    0% {
      transform: translateY(0) rotate(0);
    }
    100% {
      transform: translateY(-15px) rotate(10deg);
    }
  }
  
  @keyframes gradient-shift {
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  }
  
  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
  
  .animate-spin {
    animation: spin 6s linear infinite;
  }
  
  .animate-float {
    animation: float 2s ease-in-out infinite alternate;
  }
  
  @keyframes confetti-fall {
    0% {
      transform: translateY(-10px) rotate(0deg);
      opacity: 1;
    }
    100% {
      transform: translateY(100vh) rotate(720deg);
      opacity: 0;
    }
  }
  
  .animate-confetti {
  position: absolute;
  animation: confetti-fall 4s cubic-bezier(0.25, 1, 0.5, 1) forwards;
}

.confetti-particle {
  width: 10px;
  height: 10px;
  border-radius: 2px;
}

@keyframes head-bob {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-5px);
  }
}

@keyframes blink {
  0%, 45%, 55%, 100% {
    transform: scaleY(1);
  }
  50% {
    transform: scaleY(0.1);
  }
}

@keyframes arm-swing-left {
  0%, 100% {
    transform: rotate(-15deg);
  }
  50% {
    transform: rotate(-30deg);
  }
}

@keyframes arm-swing-right {
  0%, 100% {
    transform: rotate(15deg);
  }
  50% {
    transform: rotate(45deg);
  }
}

/* Fancy Dialog */
.fancy-dialog {
  overflow: hidden;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  animation: dialog-pop 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

@keyframes dialog-pop {
  0% {
    transform: scale(0.9);
    opacity: 0;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

/* Primary color */
.text-primary {
  color: #0ea5e9;
}

/* Media queries for responsiveness */
@media (max-width: 640px) {
  .countdown-container {
    flex-wrap: wrap;
  }
  
  .countdown-unit {
    min-width: 70px;
    margin-bottom: 10px;
  }
  
  .character {
    transform: scale(0.8);
  }
}
</style>