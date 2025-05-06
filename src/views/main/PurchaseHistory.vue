<template>
    <div class="container mx-auto px-4 py-8 max-w-6xl">
      <h1 class="text-3xl font-bold mb-6 text-gray-800">My Purchases</h1>
      
      <!-- Filters -->
      <div class="mb-6">
        <div class="bg-white rounded-lg shadow-md p-4">
          <div class="flex flex-col md:flex-row md:items-center gap-4">
            <div class="flex-1 relative">
              <input
                id="search"
                v-model="searchQuery"
                placeholder="Search by animal name or order ID"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              <span class="absolute right-3 top-2.5 text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </span>
            </div>
            <div class="w-full md:w-48">
              <select
                v-model="fulfilmentFilter"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none appearance-none bg-white"
              >
                <option v-for="option in fulfilmentOptions" :key="option.value" :value="option.value">
                  {{ option.label }}
                </option>
              </select>
            </div>
            <div class="w-full md:w-48">
              <select
                v-model="sortBy"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none appearance-none bg-white"
              >
                <option v-for="option in sortOptions" :key="option.value" :value="option.value">
                  {{ option.label }}
                </option>
              </select>
            </div>
            <div class="w-full md:w-auto">
              <button
                @click="clearFilters"
                :disabled="!hasActiveFilters"
                :class="[
                  'px-4 py-2 rounded-lg border border-gray-300 font-medium transition-colors',
                  hasActiveFilters ? 'hover:bg-gray-100 text-gray-800' : 'text-gray-400 cursor-not-allowed'
                ]"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Status Tabs -->
      <div class="mb-6">
        <div class="flex overflow-x-auto scrollbar-hide border-b border-gray-200">
          <button
            v-for="(tab, index) in statusTabs"
            :key="tab.value"
            @click="activeTabIndex = index"
            :class="[
              'px-4 py-2 font-medium whitespace-nowrap flex items-center',
              'transition-colors border-b-2 -mb-px',
              activeTabIndex === index ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'
            ]"
          >
            <span class="mr-2">
              <svg v-if="tab.value === 'all'" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <svg v-else-if="tab.value === 'processing'" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <svg v-else-if="tab.value === 'in-transit'" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
              </svg>
              <svg v-else-if="tab.value === 'delivered'" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <svg v-else-if="tab.value === 'canceled'" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </span>
            {{ tab.label }}
            <span v-if="getOrderCountByStatus(tab.value) > 0" class="ml-2 bg-gray-100 text-gray-700 text-xs px-2 py-0.5 rounded-full">
              {{ getOrderCountByStatus(tab.value) }}
            </span>
          </button>
        </div>
        
        <!-- Orders Section -->
        <div class="mt-6">
          <div v-if="getOrdersByStatus(getCurrentTabValue()).length > 0" class="space-y-6">
            <div v-for="purchase in getOrdersByStatus(getCurrentTabValue())" :key="purchase.id" class="mb-6">
              <div class="bg-white rounded-lg shadow-md overflow-hidden">
                <!-- Header Section -->
                <div class="flex flex-col md:flex-row justify-between p-4 border-b border-gray-100">
                  <div>
                    <span class="text-sm text-gray-500">Order ID: {{ purchase.orderId }}</span>
                    <h2 class="text-xl font-semibold mt-1">{{ purchase.animal.name }}</h2>
                    <p class="text-gray-700">{{ purchase.animal.species }} • {{ purchase.animal.breed }}</p>
                  </div>
                  <div class="mt-4 md:mt-0 text-right">
                    <span class="font-bold text-lg">${{ purchase.price.toFixed(2) }}</span>
                    <p class="text-gray-500 text-sm">Purchased on {{ formatDate(purchase.purchaseDate) }}</p>
                  </div>
                </div>
                
                <!-- Status and Fulfillment Section -->
                <div class="p-4 border-b border-gray-100">
                  <!-- Status Display -->
                  <div class="flex justify-between items-center mb-2">
                    <h3 class="font-medium">{{ getStatusLabel(purchase.status) }}</h3>
                    <span :class="[
                      'px-2 py-1 text-xs font-medium rounded-full',
                      purchase.status === 'processing' ? 'bg-yellow-100 text-yellow-800' : 
                      purchase.status === 'in-transit' ? 'bg-blue-100 text-blue-800' : 
                      purchase.status === 'delivered' ? 'bg-green-100 text-green-800' : 
                      'bg-red-100 text-red-800'
                    ]">
                      {{ getStatusLabel(purchase.status) }}
                    </span>
                  </div>
                  
                  <!-- Fulfillment Info -->
                  <div class="mt-2 p-3 bg-gray-50 rounded-lg">
                    <div class="flex items-center gap-2">
                      <svg v-if="purchase.fulfilmentType === 'delivery'" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                      </svg>
                      <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                      </svg>
                      <span class="font-medium">{{ purchase.fulfilmentType === 'delivery' ? 'Home Delivery' : 'Farm Pickup' }}</span>
                    </div>
                    <div class="ml-7 mt-1">
                      <div v-if="purchase.fulfilmentType === 'delivery'">
                        <div v-if="purchase.status === 'processing'" class="text-sm text-gray-600">
                          <div class="flex items-center gap-1">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>Estimated delivery: {{ purchase.estimatedDelivery ? formatDate(purchase.estimatedDelivery) : 'To be determined' }}</span>
                          </div>
                        </div>
                        <div v-else-if="purchase.status === 'in-transit'" class="text-sm text-gray-600">
                          <div class="flex items-center gap-1 mb-1">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>Estimated delivery: {{ purchase.estimatedDelivery ? formatDate(purchase.estimatedDelivery) : 'To be determined' }}</span>
                          </div>
                          <div class="flex items-center gap-1">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                            </svg>
                            <span>Tracking #: {{ purchase.trackingNumber || 'Not available' }}</span>
                          </div>
                        </div>
                        <div v-else-if="purchase.status === 'delivered'" class="text-sm text-gray-600">
                          <div class="flex items-center gap-1">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>Delivered on: {{ purchase.deliveredDate ? formatDate(purchase.deliveredDate) : 'Not available' }}</span>
                          </div>
                        </div>
                      </div>
                      <div v-else>
                        <div v-if="purchase.status === 'processing'" class="text-sm text-gray-600">
                          <div class="flex items-center gap-1">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>Ready for pickup: {{ purchase.estimatedPickupDate ? formatDate(purchase.estimatedPickupDate) : 'To be determined' }}</span>
                          </div>
                        </div>
                        <div v-else-if="purchase.status === 'in-transit'" class="text-sm text-gray-600">
                          <div class="flex items-center gap-1">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>Ready for pickup: {{ purchase.estimatedPickupDate ? formatDate(purchase.estimatedPickupDate) : 'To be determined' }}</span>
                          </div>
                        </div>
                        <div v-else-if="purchase.status === 'delivered'" class="text-sm text-gray-600">
                          <div class="flex items-center gap-1">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>Picked up on: {{ purchase.pickedUpDate ? formatDate(purchase.pickedUpDate) : 'Not available' }}</span>
                          </div>
                        </div>
                        <div v-if="purchase.pickupLocation" class="flex items-center gap-1 mt-1 text-sm text-gray-600">
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span>{{ purchase.pickupLocation }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <!-- Animal Details Section -->
                <div class="p-4 border-b border-gray-100">
                  <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div class="md:col-span-1">
                      <img 
                        :src="purchase.animal.image || 'https://via.placeholder.com/300x200'" 
                        :alt="purchase.animal.name"
                        class="w-full h-48 object-cover rounded-lg shadow" 
                      />
                    </div>
                    <div class="md:col-span-2">
                      <h3 class="font-semibold text-lg mb-2">Animal Details</h3>
                      <div class="grid grid-cols-2 gap-y-2 gap-x-4">
                        <div>
                          <span class="text-gray-500 text-sm">Age</span>
                          <p>{{ purchase.animal.age }}</p>
                        </div>
                        <div>
                          <span class="text-gray-500 text-sm">Gender</span>
                          <p>{{ purchase.animal.gender }}</p>
                        </div>
                        <div>
                          <span class="text-gray-500 text-sm">Weight</span>
                          <p>{{ purchase.animal.weight }}</p>
                        </div>
                        <div>
                          <span class="text-gray-500 text-sm">Health</span>
                          <p>{{ purchase.animal.health }}</p>
                        </div>
                      </div>
                      <div class="mt-4">
                        <span class="text-gray-500 text-sm">Description</span>
                        <p class="text-gray-700">{{ purchase.animal.description }}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <!-- Actions -->
                <div class="p-4 flex flex-wrap gap-2">
                  <button
                    v-if="purchase.status !== 'canceled'"
                    @click="viewDetails(purchase)"
                    class="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    View Details
                  </button>
                  <button
                    v-if="purchase.status === 'in-transit' && purchase.fulfilmentType === 'delivery'"
                    @click="trackShipment(purchase)"
                    class="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                    </svg>
                    Track Shipment
                  </button>
                  <button
                    v-if="purchase.status === 'in-transit' && purchase.fulfilmentType === 'pickup'"
                    @click="getDirections(purchase)"
                    class="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                    </svg>
                    Get Directions
                  </button>
                  <button
                    v-if="purchase.status === 'processing'"
                    @click="cancelOrder(purchase)"
                    class="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Cancel Order
                  </button>
                  <button
                    v-if="purchase.status === 'delivered'"
                    @click="leaveReview(purchase)"
                    class="px-4 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg font-medium transition-colors flex items-center gap-2"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                    Leave Review
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Empty State -->
          <div v-else class="text-center p-6">
            <div class="bg-white rounded-lg shadow-md p-8">
              <div class="flex flex-col items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                <h3 class="text-xl font-medium mb-2">No {{ getCurrentTabLabel() }} Found</h3>
                <p class="text-gray-500 mb-4">
                  <template v-if="hasActiveFilters">
                    No orders match your current filters.
                  </template>
                  <template v-else>
                    You don't have any {{ getCurrentTabLabel().toLowerCase() }} orders.
                  </template>
                </p>
                <div class="flex gap-2">
                  <button 
                    v-if="hasActiveFilters"
                    @click="clearFilters"
                    class="px-4 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg font-medium transition-colors"
                  >
                    Clear Filters
                  </button>
                  <button 
                    @click="goToMarketplace"
                    class="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    Browse Animals
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Pagination -->
      <div v-if="totalPages > 1" class="mt-6 flex justify-center">
        <div class="flex items-center gap-2">
          <button 
          @click="goToPreviousPage" 
          :disabled="currentPage === 1"
          :class="[
            'px-3 py-1 rounded-md border border-gray-300',
            currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'hover:bg-gray-100 text-gray-700'
          ]"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        <template v-for="page in displayedPages" :key="page">
          <button 
            v-if="page !== '...'"
            @click="goToPage(page)" 
            :class="[
              'px-3 py-1 rounded-md',
              currentPage === page 
                ? 'bg-blue-500 text-white' 
                : 'border border-gray-300 hover:bg-gray-100 text-gray-700'
            ]"
          >
            {{ page }}
          </button>
          <span 
            v-else
            class="px-3 py-1 text-gray-500"
          >
            ...
          </span>
        </template>
        
        <button 
          @click="goToNextPage" 
          :disabled="currentPage === totalPages"
          :class="[
            'px-3 py-1 rounded-md border border-gray-300',
            currentPage === totalPages ? 'text-gray-400 cursor-not-allowed' : 'hover:bg-gray-100 text-gray-700'
          ]"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      searchQuery: '',
      fulfilmentFilter: 'all',
      sortBy: 'newest',
      activeTabIndex: 0,
      currentPage: 1,
      itemsPerPage: 5,
      
      // Filter options
      fulfilmentOptions: [
        { value: 'all', label: 'All Fulfillment Types' },
        { value: 'delivery', label: 'Home Delivery' },
        { value: 'pickup', label: 'Farm Pickup' }
      ],
      sortOptions: [
        { value: 'newest', label: 'Newest First' },
        { value: 'oldest', label: 'Oldest First' },
        { value: 'price-high', label: 'Price: High to Low' },
        { value: 'price-low', label: 'Price: Low to High' }
      ],
      statusTabs: [
        { value: 'all', label: 'All Orders' },
        { value: 'processing', label: 'Processing' },
        { value: 'in-transit', label: 'In Transit' },
        { value: 'delivered', label: 'Delivered' },
        { value: 'canceled', label: 'Canceled' }
      ],
      
      // Sample data (would be fetched from API in real app)
      purchases: [
        {
          id: 1,
          orderId: 'ORD-2023-001',
          price: 1200.00,
          purchaseDate: '2023-05-10',
          status: 'delivered',
          fulfilmentType: 'delivery',
          estimatedDelivery: '2023-05-15',
          deliveredDate: '2023-05-14',
          trackingNumber: 'TRK12345678',
          animal: {
            name: 'Daisy',
            species: 'Cow',
            breed: 'Holstein',
            age: '3 years',
            gender: 'Female',
            weight: '650 kg',
            health: 'Excellent',
            description: 'Daisy is a healthy Holstein dairy cow with a great milk production record and calm temperament.',
            image: null
          }
        },
        {
          id: 2,
          orderId: 'ORD-2023-002',
          price: 350.00,
          purchaseDate: '2023-05-15',
          status: 'in-transit',
          fulfilmentType: 'delivery',
          estimatedDelivery: '2023-05-25',
          trackingNumber: 'TRK87654321',
          animal: {
            name: 'Max',
            species: 'Goat',
            breed: 'Nubian',
            age: '1.5 years',
            gender: 'Male',
            weight: '70 kg',
            health: 'Good',
            description: 'Max is a friendly Nubian goat that produces high-quality milk. He is well-behaved and easy to handle.',
            image: null
          }
        },
        {
          id: 3,
          orderId: 'ORD-2023-003',
          price: 800.00,
          purchaseDate: '2023-05-18',
          status: 'processing',
          fulfilmentType: 'pickup',
          estimatedPickupDate: '2023-05-28',
          pickupLocation: 'Green Valley Farm, 123 Rural Road',
          animal: {
            name: 'Bella',
            species: 'Pig',
            breed: 'Berkshire',
            age: '8 months',
            gender: 'Female',
            weight: '120 kg',
            health: 'Excellent',
            description: 'Bella is a purebred Berkshire pig with excellent genetics. She comes from a line of award-winning show pigs.',
            image: null
          }
        },
        {
          id: 4,
          orderId: 'ORD-2023-004',
          price: 250.00,
          purchaseDate: '2023-05-20',
          status: 'canceled',
          fulfilmentType: 'delivery',
          animal: {
            name: 'Charlie',
            species: 'Chicken',
            breed: 'Rhode Island Red',
            age: '10 months',
            gender: 'Male',
            weight: '3.5 kg',
            health: 'Good',
            description: 'Charlie is a robust rooster with vibrant plumage. He would make an excellent addition to any flock.',
            image: null
          }
        },
        {
          id: 5,
          orderId: 'ORD-2023-005',
          price: 1500.00,
          purchaseDate: '2023-05-22',
          status: 'processing',
          fulfilmentType: 'pickup',
          estimatedPickupDate: '2023-06-01',
          pickupLocation: 'Green Valley Farm, 123 Rural Road',
          animal: {
            name: 'Thunder',
            species: 'Horse',
            breed: 'Quarter Horse',
            age: '5 years',
            gender: 'Male',
            weight: '500 kg',
            health: 'Excellent',
            description: 'Thunder is a well-trained quarter horse with a gentle temperament. Perfect for trail riding or farm work.',
            image: null
          }
        }
      ]
    };
  },
  computed: {
    filteredPurchases() {
      let result = [...this.purchases];
      
      // Search filter
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase();
        result = result.filter(purchase => 
          purchase.animal.name.toLowerCase().includes(query) || 
          purchase.orderId.toLowerCase().includes(query)
        );
      }
      
      // Fulfillment filter
      if (this.fulfilmentFilter !== 'all') {
        result = result.filter(purchase => purchase.fulfilmentType === this.fulfilmentFilter);
      }
      
      // Sort
      result.sort((a, b) => {
        switch (this.sortBy) {
          case 'newest':
            return new Date(b.purchaseDate) - new Date(a.purchaseDate);
          case 'oldest':
            return new Date(a.purchaseDate) - new Date(b.purchaseDate);
          case 'price-high':
            return b.price - a.price;
          case 'price-low':
            return a.price - b.price;
          default:
            return 0;
        }
      });
      
      return result;
    },
    paginatedPurchases() {
      const startIndex = (this.currentPage - 1) * this.itemsPerPage;
      const endIndex = startIndex + this.itemsPerPage;
      return this.filteredPurchases.slice(startIndex, endIndex);
    },
    totalPages() {
      return Math.ceil(this.filteredPurchases.length / this.itemsPerPage);
    },
    displayedPages() {
      const totalPages = this.totalPages;
      const currentPage = this.currentPage;
      
      // If 7 or fewer pages, show all
      if (totalPages <= 7) {
        return Array.from({ length: totalPages }, (_, i) => i + 1);
      }
      
      // Always show first and last page
      const pages = [1];
      
      // For pages near the beginning
      if (currentPage <= 3) {
        pages.push(2, 3, 4, '...', totalPages);
      } 
      // For pages near the end
      else if (currentPage >= totalPages - 2) {
        pages.push('...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } 
      // For pages in the middle
      else {
        pages.push('...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
      
      return pages;
    },
    hasActiveFilters() {
      return this.searchQuery !== '' || this.fulfilmentFilter !== 'all';
    }
  },
  methods: {
    formatDate(dateString) {
      if (!dateString) return 'N/A';
      
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(dateString).toLocaleDateString('en-US', options);
    },
    getCurrentTabValue() {
      return this.statusTabs[this.activeTabIndex].value;
    },
    getCurrentTabLabel() {
      return this.statusTabs[this.activeTabIndex].label;
    },
    getOrdersByStatus(status) {
      if (status === 'all') {
        return this.paginatedPurchases;
      }
      return this.paginatedPurchases.filter(purchase => purchase.status === status);
    },
    getOrderCountByStatus(status) {
      if (status === 'all') {
        return this.filteredPurchases.length;
      }
      return this.filteredPurchases.filter(purchase => purchase.status === status).length;
    },
    getStatusLabel(status) {
      const statusMap = {
        'processing': 'Processing',
        'in-transit': 'In Transit',
        'delivered': 'Delivered',
        'canceled': 'Canceled'
      };
      return statusMap[status] || status;
    },
    clearFilters() {
      this.searchQuery = '';
      this.fulfilmentFilter = 'all';
      this.currentPage = 1; // Reset pagination
    },
    goToPage(page) {
      this.currentPage = page;
    },
    goToPreviousPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    },
    goToNextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
      }
    },
    viewDetails(purchase) {
      console.log('View details for:', purchase.orderId);
      // Navigate to purchase details page
    },
    trackShipment(purchase) {
      console.log('Track shipment:', purchase.trackingNumber);
      // Open shipping tracking in new window
    },
    getDirections(purchase) {
      console.log('Get directions to:', purchase.pickupLocation);
      // Open map directions
    },
    cancelOrder(purchase) {
      console.log('Cancel order:', purchase.orderId);
      // Implement cancel order logic
    },
    leaveReview(purchase) {
      console.log('Leave review for:', purchase.animal.name);
      // Navigate to review page
    },
    goToMarketplace() {
      console.log('Navigate to marketplace');
      // Navigate to marketplace page
    }
  }
};
</script>

<style>
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>