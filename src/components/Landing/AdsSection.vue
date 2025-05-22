<template>
  <div class="train-container">
    <div class="train" :style="{ transform: `translateX(${trainPosition}px)` }">
      <!-- Engine -->
      <div class="train-car engine">
        <div class="engine-front"></div>
        <div class="engine-body">
          <div class="engine-window"></div>
          <div class="engine-details">
            <div class="engine-grill"></div>
            <div class="engine-light"></div>
          </div>
          <div class="smoke">💨</div>
        </div>
        <div class="wheel wheel-1">
          <div class="wheel-inner"></div>
        </div>
        <div class="wheel wheel-2">
          <div class="wheel-inner"></div>
        </div>
      </div>

      <!-- Livestock Cars -->
      <div 
        v-for="(car, index) in livestockCars" 
        :key="index"
        class="train-car livestock-car"
      >
        <div class="car-body">
          <div class="car-roof"></div>
          <div class="car-slats">
            <div class="slat" v-for="i in 6" :key="i"></div>
          </div>
          <div class="animals">
            <span 
              v-for="animal in car.animals" 
              :key="animal.id"
              class="animal"
              :style="{ 
                left: animal.x + '%', 
                top: animal.y + '%',
                animationDelay: animal.delay + 's'
              }"
            >
              {{ animal.emoji }}
            </span>
          </div>
        </div>
        <div class="wheel wheel-1">
          <div class="wheel-inner"></div>
        </div>
        <div class="wheel wheel-2">
          <div class="wheel-inner"></div>
        </div>
        <div class="coupling"></div>
      </div>
    </div>

    <!-- Railway tracks -->
    <div class="tracks">
      <div class="rail rail-top">
        <div class="rail-highlight"></div>
      </div>
      <div class="rail rail-bottom">
        <div class="rail-highlight"></div>
      </div>
      <div class="ties">
        <div v-for="i in 20" :key="i" class="tie">
          <div class="tie-highlight"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

interface Animal {
  id: number
  emoji: string
  x: number
  y: number
  delay: number
}

interface LivestockCar {
  id: number
  animals: Animal[]
}

const trainPosition = ref(window.innerWidth + 200)
let animationId: number

const animalEmojis = ['🐄', '🐷', '🐑', '🐐', '🐴', '🐔', '🦆']

// Generate random animals for each car
const generateAnimals = (carId: number): Animal[] => {
  const numAnimals = Math.floor(Math.random() * 4) + 2 // 2-5 animals per car
  const animals: Animal[] = []
  
  for (let i = 0; i < numAnimals; i++) {
    animals.push({
      id: carId * 10 + i,
      emoji: animalEmojis[Math.floor(Math.random() * animalEmojis.length)],
      x: Math.random() * 70 + 10, // 10-80% from left
      y: Math.random() * 40 + 30, // 30-70% from top
      delay: Math.random() * 2
    })
  }
  
  return animals
}

// Create 4 livestock cars
const livestockCars = ref<LivestockCar[]>([
  { id: 1, animals: generateAnimals(1) },
  { id: 2, animals: generateAnimals(2) },
  { id: 3, animals: generateAnimals(3) },
  { id: 4, animals: generateAnimals(4) }
])

const animateTrain = () => {
  trainPosition.value -= 2 // Speed of movement
  
  // Reset position when train goes off screen
  if (trainPosition.value < -800) {
    trainPosition.value = window.innerWidth + 200
    // Regenerate animals for variety
    livestockCars.value.forEach((car, index) => {
      car.animals = generateAnimals(index + 1)
    })
  }
  
  animationId = requestAnimationFrame(animateTrain)
}

onMounted(() => {
  animateTrain()
})

onUnmounted(() => {
  if (animationId) {
    cancelAnimationFrame(animationId)
  }
})
</script>

<style scoped>
.train-container {
  width: 100%;
  height: 200px;
  background: transparent;
  overflow: hidden;
  position: relative;
}

.train {
  position: absolute;
  bottom: 20px;
  display: flex;
  align-items: flex-end;
  transition: transform 0.016s linear;
}

.train-car {
  position: relative;
  margin-right: 5px;
}

/* Engine */
.engine {
  width: 120px;
  height: 80px;
}

.engine-front {
  position: absolute;
  left: 0;
  bottom: 20px;
  width: 30px;
  height: 40px;
  background: linear-gradient(45deg, #DC143C, #FF6B6B);
  border-radius: 15px 0 0 5px;
  box-shadow: inset 2px 2px 4px rgba(255,255,255,0.3), 2px 2px 8px rgba(0,0,0,0.3);
}

.engine-body {
  position: absolute;
  left: 25px;
  bottom: 20px;
  width: 70px;
  height: 60px;
  background: linear-gradient(135deg, #B22222, #8B0000);
  border-radius: 5px;
  box-shadow: inset 2px 2px 4px rgba(255,255,255,0.2), 2px 2px 8px rgba(0,0,0,0.3);
}

.engine-window {
  position: absolute;
  top: 10px;
  left: 10px;
  width: 50px;
  height: 20px;
  background: linear-gradient(135deg, #87CEEB, #4682B4);
  border-radius: 3px;
  border: 2px solid #000;
  box-shadow: inset 1px 1px 2px rgba(255,255,255,0.5);
}

.engine-details {
  position: absolute;
  bottom: 5px;
  left: 5px;
  width: 60px;
  height: 15px;
}

.engine-grill {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 40px;
  height: 8px;
  background: linear-gradient(90deg, #333 0%, #333 20%, transparent 20%, transparent 40%, #333 40%, #333 60%, transparent 60%, transparent 80%, #333 80%);
  border-radius: 2px;
}

.engine-light {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 8px;
  height: 8px;
  background: radial-gradient(circle, #FFFF00, #FFA500);
  border-radius: 50%;
  box-shadow: 0 0 4px #FFFF00;
}

.smoke {
  position: absolute;
  top: -30px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 20px;
  animation: float 2s ease-in-out infinite;
}

/* Livestock Cars */
.livestock-car {
  width: 100px;
  height: 70px;
}

.car-body {
  position: absolute;
  bottom: 20px;
  width: 100px;
  height: 50px;
  background: linear-gradient(135deg, #8B4513, #654321);
  border: 2px solid #654321;
  border-radius: 3px;
  overflow: hidden;
  box-shadow: inset 2px 2px 4px rgba(255,255,255,0.1), 2px 2px 6px rgba(0,0,0,0.3);
}

.car-roof {
  position: absolute;
  top: -8px;
  left: -2px;
  width: 104px;
  height: 12px;
  background: linear-gradient(135deg, #A0522D, #8B4513);
  border-radius: 6px 6px 0 0;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
}

.car-slats {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: stretch;
}

.slat {
  width: 3px;
  background: linear-gradient(180deg, #654321, #4A2C17);
  opacity: 0.8;
  box-shadow: 1px 0 2px rgba(0,0,0,0.3);
}

.animals {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.animal {
  position: absolute;
  font-size: 16px;
  animation: bounce 1.5s ease-in-out infinite;
  transform-origin: center bottom;
  filter: drop-shadow(1px 1px 2px rgba(0,0,0,0.3));
}

/* Wheels */
.wheel {
  position: absolute;
  bottom: 0;
  width: 20px;
  height: 20px;
  background: linear-gradient(135deg, #2F4F4F, #1C3333);
  border-radius: 50%;
  border: 2px solid #000;
  animation: rotate 0.5s linear infinite;
  box-shadow: inset 2px 2px 4px rgba(255,255,255,0.2), 2px 2px 6px rgba(0,0,0,0.4);
}

.wheel-inner {
  position: absolute;
  top: 4px;
  left: 4px;
  width: 8px;
  height: 8px;
  background: radial-gradient(circle, #708090, #2F4F4F);
  border-radius: 50%;
  border: 1px solid #000;
}

.wheel-1 {
  left: 15px;
}

.wheel-2 {
  right: 15px;
}

.engine .wheel-1 {
  left: 35px;
}

.engine .wheel-2 {
  right: 25px;
}

/* Coupling */
.coupling {
  position: absolute;
  right: -8px;
  bottom: 30px;
  width: 6px;
  height: 6px;
  background: radial-gradient(circle, #333, #000);
  border-radius: 50%;
  box-shadow: 1px 1px 3px rgba(0,0,0,0.5);
}

.tracks {
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 20px;
}

.ties {
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-around;
  align-items: center;
}

.tie {
  width: 60px;
  height: 8px;
  background: linear-gradient(135deg, #654321, #4A2C17);
  border-radius: 2px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.3);
  position: relative;
}

.tie-highlight {
  position: absolute;
  top: 1px;
  left: 5px;
  width: 50px;
  height: 2px;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
  border-radius: 1px;
}

.rail {
  position: absolute;
  width: 100%;
  height: 4px;
  background: linear-gradient(135deg, #C0C0C0, #A9A9A9);
  border-radius: 2px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.3);
  position: relative;
}

.rail-highlight {
  position: absolute;
  top: 1px;
  left: 0;
  width: 100%;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent);
  border-radius: 1px;
}

.rail-top {
  top: 2px;
}

.rail-bottom {
  bottom: 2px;
}

/* Animations */
@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-3px);
  }
}

@keyframes float {
  0%, 100% {
    transform: translateX(-50%) translateY(0px);
    opacity: 1;
  }
  50% {
    transform: translateX(-50%) translateY(-10px);
    opacity: 0.7;
  }
}
</style>