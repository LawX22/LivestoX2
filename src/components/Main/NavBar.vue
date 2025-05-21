<script lang="ts">
import { defineComponent, ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import Menu from 'primevue/menu';
import Avatar from 'primevue/avatar';
import Button from 'primevue/button';
import Tooltip from 'primevue/tooltip';
import Badge from 'primevue/badge';
import { useAuthStore } from '../../stores/authContext';

interface User {
    id: string;
    name: string;
    email: string;
    avatarUrl?: string;
    role: string;
    lastActive: string;
}

interface ChatNotification {
    id: string;
    sender: string;
    senderAvatar?: string;
    message: string;
    time: string;
    read: boolean;
    online: boolean;
}

interface Notification {
    id: string;
    title: string;
    message: string;
    time: string;
    read: boolean;
    type: 'info' | 'success' | 'warning' | 'error';
    icon?: string;
}

export default defineComponent({
    name: 'NavBar',
    components: {
        Menu,
        Avatar,
        Button,
        Badge,
    },
    directives: {
        tooltip: Tooltip, // Register Tooltip directive
    },
    methods: {
        markAllChatsAsRead() {
            // Your logic to mark all chats as read
            console.log('All chats marked as read');
        },
    },
    setup() {
        const router = useRouter();
        const isUserMenuVisible = ref(false);
        const isChatMenuVisible = ref(false);
        const isNotificationMenuVisible = ref(false);

        // Enhanced user data
        const user = ref<User>({
            id: '1',
            name: 'John Doe',
            email: 'john@example.com',
            avatarUrl: '',
            role: 'Farmer',
            lastActive: '2 minutes ago'
        });

        const authStore = useAuthStore();

        // Enhanced chat notifications
        const chatNotifications = ref<ChatNotification[]>([
            {
                id: '1',
                sender: 'Jane Smith',
                senderAvatar: '',
                message: 'Hi there! Can we discuss the new livestock vaccination schedule? I have some questions about the timing.',
                time: '5m ago',
                read: false,
                online: true
            },
        ]);

        // Enhanced notifications with types
        const notifications = ref<Notification[]>([
            {
                id: '1',
                title: 'New Message',
                message: 'Seller John Doe replied to your inquiry about Black Angus Cattle.',
                time: '5m ago',
                read: false,
                type: 'info',
                icon: 'pi-comments'
            },
        ]);

        // Compute unread counts
        const unreadChatCount = computed(() => chatNotifications.value.filter(chat => !chat.read).length);
        const unreadNotificationCount = computed(() => notifications.value.filter(notif => !notif.read).length);

        // Helper functions for notification styling
        const getNotificationIconColor = (type: string) => {
            const iconColorMap: Record<string, string> = {
                info: 'text-blue-500',
                success: 'text-green-500',
                warning: 'text-yellow-500',
                error: 'text-red-500'
            };
            return iconColorMap[type] || 'text-gray-500';
        };

        const getNotificationBgColor = (type: string) => {
            const bgColorMap: Record<string, string> = {
                info: 'bg-blue-100',
                success: 'bg-green-100',
                warning: 'bg-yellow-100',
                error: 'bg-red-100'
            };
            return bgColorMap[type] || 'bg-gray-100';
        };

        // Close all menus
        const closeAllMenus = () => {
            isUserMenuVisible.value = false;
            isChatMenuVisible.value = false;
            isNotificationMenuVisible.value = false;
        };

        // Toggle menus
        const toggleChat = (event: Event) => {
            event.stopPropagation();
            isUserMenuVisible.value = false;
            isNotificationMenuVisible.value = false;
            isChatMenuVisible.value = !isChatMenuVisible.value;
        };

        const toggleNotifications = (event: Event) => {
            event.stopPropagation();
            isUserMenuVisible.value = false;
            isChatMenuVisible.value = false;
            isNotificationMenuVisible.value = !isNotificationMenuVisible.value;
        };

        const toggleUserMenu = (event: Event) => {
            event.stopPropagation();
            isChatMenuVisible.value = false;
            isNotificationMenuVisible.value = false;
            isUserMenuVisible.value = !isUserMenuVisible.value;
        };

        // Hide specific menus
        const hideUserMenu = () => {
            isUserMenuVisible.value = false;
        };

        const hideChatMenu = () => {
            isChatMenuVisible.value = false;
        };

        const hideNotificationMenu = () => {
            isNotificationMenuVisible.value = false;
        };

        // Handle clicks outside menus to close them
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as HTMLElement;
            if (!target.closest('.user-profile-toggle') &&
                !target.closest('.user-menu-animated')) {
                closeAllMenus();
            }
        };

        // Mark notification as read
        const markNotificationAsRead = (id: string) => {
            const notif = notifications.value.find(n => n.id === id);
            if (notif && !notif.read) {
                notif.read = true;
            }
        };

        // Mark chat as read
        const markChatAsRead = (id: string) => {
            const chat = chatNotifications.value.find(c => c.id === id);
            if (chat && !chat.read) {
                chat.read = true;
            }
        };

        // Open chat
        const openChat = (id: string) => {
            markChatAsRead(id);
            hideChatMenu();
            router.push('/main/Message');
        };

        // Mark all notifications as read
        const markAllNotificationsAsRead = () => {
            notifications.value.forEach(notif => {
                notif.read = true;
            });
        };

        // Mark all chats as read
        const markAllChatsAsRead = () => {
            chatNotifications.value.forEach(chat => {
                chat.read = true;
            });
        };

        // Handle notification click based on type
        const handleNotificationClick = (notif: Notification) => {
            markNotificationAsRead(notif.id);
            hideNotificationMenu();

            switch (notif.type) {
                case 'info':
                    if (notif.title.includes('Forum')) {
                        router.push('/forum');
                    } else {
                        router.push('/notifications');
                    }
                    break;
                case 'warning':
                    if (notif.title.includes('Livestock')) {
                        router.push('/livestocks');
                    } else {
                        router.push('/notifications');
                    }
                    break;
                case 'success':
                    router.push('/notifications');
                    break;
                case 'error':
                    router.push('/notifications');
                    break;
                default:
                    router.push('/notifications');
            }
        };

        // Logout function
        const logout = () => {
            // Close all menus before logout
            closeAllMenus();

            authStore.logout();

            // Implement logout functionality
            console.log('Logging out...');
            // In a real app, you would call your auth service here
            // Then redirect to login page
            setTimeout(() => {
                router.push('/');
            }, 500);
        };

        // Get user initials for avatar fallback
        const getUserInitials = () => {
            if (!user.value.name) return '';
            return user.value.name
                .split(' ')
                .map(part => part[0])
                .join('')
                .toUpperCase()
                .substring(0, 2);
        };

        const handleSignIn = () => {
            router.push('/signin');
        };

        const handleSignUp = () => {
            router.push('/signup');
        };

        onMounted(async () => {
            if (!authStore.session) {
                await authStore.getSession();
            }

            let ses = authStore?.user?.user_metadata;

            if (ses) {
                user.value.name = `${ses?.firstname} ${ses?.lastname}`;
                user.value.role = ses?.role;
                user.value.email = ses?.email;
            }

            console.log(ses);
        });

        // Close all menus when route changes
        onMounted(() => {
            router.afterEach(() => {
                // Close all menus when route changes
                closeAllMenus();
            });

            // Add click outside event listener
            document.addEventListener('click', handleClickOutside);
        });

        onUnmounted(() => {
            // Remove click outside event listener
            document.removeEventListener('click', handleClickOutside);
        });

        return {
            user,
            chatNotifications,
            notifications,
            unreadChatCount,
            unreadNotificationCount,
            isUserMenuVisible,
            isChatMenuVisible,
            isNotificationMenuVisible,
            toggleChat,
            toggleNotifications,
            toggleUserMenu,
            hideUserMenu,
            hideChatMenu,
            hideNotificationMenu,
            closeAllMenus,
            getUserInitials,
            getNotificationIconColor,
            getNotificationBgColor,
            markAllChatsAsRead,
            markAllNotificationsAsRead,
            handleNotificationClick,
            handleSignIn,
            handleSignUp,
            openChat,
            authStore,
            logout
        };
    }
});
</script>


<template>
    <div class="shadow-lg bg-white border-b border-gray-200">
        <div class="container mx-auto px-4">
            <div class="flex justify-between items-center h-16">
                <!-- Logo and Main Navigation -->
                <div class="flex items-center space-x-8">
                    <div class="flex items-center space-x-2">
                        <img src="/src/assets/vue.svg" alt="Logo" class="h-8 w-8" />
                        <div class="font-bold text-xl text-green-600">LivestoX</div>
                    </div>

                    <nav class="flex space-x-5">
                        <router-link to="/"
                            class="nav-link text-gray-700 hover:text-green-600 px-3 py-2 rounded-md transition-all duration-300 flex items-center relative">
                            <i class="pi pi-home mr-2"></i> Home
                            <span class="nav-indicator"></span>
                        </router-link>
                        <router-link to="/main/LivestockMarket"
                            class="nav-link text-gray-700 hover:text-green-600 px-3 py-2 rounded-md transition-all duration-300 flex items-center relative">
                            <i class="pi pi-shopping-cart mr-2"></i> Market
                            <span class="nav-indicator"></span>
                        </router-link>
                        <router-link to="/farmer/FarmerDashboard"
                            class="nav-link text-gray-700 hover:text-green-600 px-3 py-2 rounded-md transition-all duration-300 flex items-center relative"
                            v-if="authStore?.user?.user_metadata?.role === 'Farmer'">
                            <i class="pi pi-chart-bar mr-2"></i>Dashboard
                            <span class="nav-indicator"></span>
                        </router-link>
                        <router-link to="/main/LivestockDashboard"
                            class="nav-link text-gray-700 hover:text-green-600 px-3 py-2 rounded-md transition-all duration-300 flex items-center relative"
                            v-if="authStore?.user?.user_metadata?.role === 'Buyer'">
                            <i class="pi pi-chart-bar mr-2"></i>Dashboard
                            <span class="nav-indicator"></span>
                        </router-link>
                        <router-link to="/main/LivestockForum"
                            class="nav-link text-gray-700 hover:text-green-600 px-3 py-2 rounded-md transition-all duration-300 flex items-center relative">
                            <i class="pi pi-users mr-2"></i> Forum
                            <span class="nav-indicator"></span>
                        </router-link>
                        <router-link to="/main/AboutUs"
                            class="nav-link text-gray-700 hover:text-green-600 px-3 py-2 rounded-md transition-all duration-300 flex items-center relative">
                            <i class="pi pi-heart mr-2"></i>  About Us
                            <span class="nav-indicator"></span>
                        </router-link>
                    </nav>
                </div>

                <!-- Right Side - User Controls -->
                <div class="flex items-center space-x-3" v-if="authStore.session">
                    <!-- Search -->
                    <div class="flex relative">
                        <span class="absolute inset-y-0 left-0 flex items-center pl-3">
                            <i class="pi pi-search text-gray-400"></i>
                        </span>
                    </div>

                    <!-- Chat Notifications -->
                    <div class="relative">
                        <Button icon="pi pi-comments"
                            class="p-button-rounded p-button-text p-button-plain hover:scale-110 transition-transform duration-200"
                            @click="toggleChat" :class="{ 'p-button-outlined p-button-info': unreadChatCount > 0 }" />
                        <Badge v-if="unreadChatCount > 0" :value="unreadChatCount"
                            class="absolute -top-1 -right-1 pulse-animation" severity="danger" />

                        <!-- Custom Chat Menu -->
                        <div v-if="isChatMenuVisible"
                            class="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50 user-menu-animated">
                            <div class="py-2 px-3 border-b border-gray-100 flex justify-between items-center">
                                <div class="font-medium text-gray-800">Messages</div>
                                <div class="relative">
                                    <!-- Button with Tooltip -->
                                    <Button icon="pi pi-check"
                                        class="p-button-text p-button-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                                        @click="markAllChatsAsRead" v-tooltip.top="'Mark all messages as read'" />
                                </div>
                            </div>
                            <div class="max-h-96 overflow-y-auto">
                                <div v-for="chat in chatNotifications" :key="chat.id" @click="openChat(chat.id)"
                                    class="p-3 border-b border-gray-100 cursor-pointer hover:bg-blue-50 transition-colors duration-200"
                                    :class="{ 'bg-blue-50': !chat.read }">
                                    <div class="flex items-start">
                                        <div class="relative mr-3">
                                            <Avatar :image="chat.senderAvatar || undefined"
                                                :label="!chat.senderAvatar ? chat.sender.charAt(0).toUpperCase() : undefined"
                                                shape="circle"
                                                :style="!chat.senderAvatar ? 'background: linear-gradient(135deg, #4F46E5, #60a5fa); color: white;' : ''" />
                                            <span v-if="chat.online"
                                                class="absolute bottom-0 right-0 block h-2 w-2 rounded-full bg-green-400 ring-2 ring-white"></span>
                                        </div>
                                        <div class="flex-1 min-w-0">
                                            <div class="flex items-center justify-between">
                                                <p class="text-sm font-medium"
                                                    :class="!chat.read ? 'text-blue-600' : 'text-gray-900'">{{
                                                        chat.sender }}</p>
                                                <p class="text-xs text-gray-500">{{ chat.time }}</p>
                                            </div>
                                            <p class="text-sm text-gray-600 truncate"
                                                :class="{ 'font-medium': !chat.read }">{{ chat.message }}</p>
                                        </div>
                                    </div>
                                </div>
                                <div v-if="chatNotifications.length === 0" class="p-4 text-center text-gray-500">
                                    No messages
                                </div>
                            </div>
                            <div class="p-3 border-t border-gray-100 text-center">
                                <router-link to="/main/Message"
                                    class="text-blue-600 hover:text-blue-800 text-sm font-medium" @click="hideChatMenu">
                                    View All Messages
                                </router-link>
                            </div>
                        </div>
                    </div>

                    <!-- Notifications -->
                    <div class="relative">
                        <Button icon="pi pi-bell"
                            class="p-button-rounded p-button-text p-button-plain hover:scale-110 transition-transform duration-200"
                            @click="toggleNotifications"
                            :class="{ 'p-button-outlined p-button-info': unreadNotificationCount > 0 }" />
                        <Badge v-if="unreadNotificationCount > 0" :value="unreadNotificationCount"
                            class="absolute -top-1 -right-1 pulse-animation" severity="danger" />

                        <!-- Custom Notifications Menu -->
                        <div v-if="isNotificationMenuVisible"
                            class="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50 user-menu-animated">
                            <div class="py-2 px-3 border-b border-gray-100 flex justify-between items-center">
                                <div class="font-medium text-gray-800">Notifications</div>
                                <div class="relative">
                                    <!-- Icon-only button with Tooltip -->
                                    <Button icon="pi pi-check"
                                        class="p-button-text p-button-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                                        @click="markAllNotificationsAsRead"
                                        v-tooltip.top="'Mark all notifications as read'" />
                                </div>
                            </div>
                            <div class="max-h-96 overflow-y-auto">
                                <div v-for="notif in notifications" :key="notif.id"
                                    @click="handleNotificationClick(notif)"
                                    class="p-3 border-b border-gray-100 cursor-pointer hover:bg-blue-50 transition-colors duration-200"
                                    :class="{ 'bg-blue-50': !notif.read }">
                                    <div class="flex items-start">
                                        <div :class="`mr-3 p-2 rounded-full ${getNotificationBgColor(notif.type)}`">
                                            <i
                                                :class="`pi ${notif.icon || 'pi-bell'} ${getNotificationIconColor(notif.type)}`"></i>
                                        </div>
                                        <div class="flex-1 min-w-0">
                                            <div class="flex items-center justify-between">
                                                <p class="text-sm font-medium"
                                                    :class="!notif.read ? 'text-blue-600' : 'text-gray-900'">{{
                                                        notif.title }}</p>
                                                <p class="text-xs text-gray-500">{{ notif.time }}</p>
                                            </div>
                                            <p class="text-sm text-gray-600" :class="{ 'font-medium': !notif.read }">{{
                                                notif.message }}</p>
                                        </div>
                                    </div>
                                </div>
                                <div v-if="notifications.length === 0" class="p-4 text-center text-gray-500">
                                    No notifications
                                </div>
                            </div>
                            <div class="p-3 border-t border-gray-100 text-center">
                                <router-link to="/notifications"
                                    class="text-blue-600 hover:text-blue-800 text-sm font-medium"
                                    @click="hideNotificationMenu">
                                    View All Notifications
                                </router-link>
                            </div>
                        </div>
                    </div>

                    <!-- User Profile - Improved Design -->
                    <div class="relative">
                        <div @click="toggleUserMenu"
                            class="user-profile-toggle flex items-center cursor-pointer px-3 py-2 rounded-lg hover:bg-blue-50 transition-colors duration-200 border border-transparent hover:border-blue-100">
                            <Avatar :image="user.avatarUrl || undefined"
                                :label="!user.avatarUrl ? getUserInitials() : undefined" shape="circle" class="mr-2"
                                :style="!user.avatarUrl ? 'background: linear-gradient(135deg, #4F46E5, #60a5fa); color: white;' : ''" />
                            <div>
                                <div class="text-sm font-medium text-gray-800">{{ user.name }}</div>
                                <div class="text-xs text-gray-500">{{ user.role }}</div>
                            </div>
                            <i class="pi pi-chevron-down ml-2 text-gray-400 text-xs"></i>
                        </div>

                        <!-- Improved User Menu -->
                        <div v-if="isUserMenuVisible"
                            class="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-xl border border-gray-200 z-50 py-2 user-menu-animated">
                            <!-- User Profile Header -->
                            <div class="px-4 py-3 border-b border-gray-100">
                                <div class="flex items-center">
                                    <Avatar :image="user.avatarUrl || undefined"
                                        :label="!user.avatarUrl ? getUserInitials() : undefined" shape="circle"
                                        class="mr-3" size="large"
                                        :style="!user.avatarUrl ? 'background: linear-gradient(135deg, #4F46E5, #60a5fa); color: white;' : ''" />
                                    <div class="flex-1 min-w-0">
                                        <div class="font-medium text-gray-800 truncate">{{ user.name }}</div>
                                        <div class="text-sm text-gray-600 truncate">{{ user.email }}</div>
                                        <div class="text-xs text-gray-500 mt-1">
                                            <span class="inline-flex items-center">
                                                <span class="h-2 w-2 rounded-full bg-green-400 mr-1"></span>
                                                Active now
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Menu Items -->
                            <div class="py-1">
                                <router-link to="/main/UserProfile"
                                    class="flex items-center px-4 py-2 hover:bg-blue-50 text-gray-700 hover:text-blue-600 transition-colors duration-200"
                                    @click="hideUserMenu">
                                    <div class="w-8 h-8 flex items-center justify-center rounded-full bg-blue-100 mr-3">
                                        <i class="pi pi-user text-blue-600 text-sm"></i>
                                    </div>
                                    <span>Profile Management</span>
                                </router-link>

                                <router-link to="/farmer/FarmerTransaction"
                                    class="flex items-center px-4 py-2 hover:bg-blue-50 text-gray-700 hover:text-blue-600 transition-colors duration-200"
                                    @click="hideUserMenu">
                                    <div
                                        class="w-8 h-8 flex items-center justify-center rounded-full bg-green-100 mr-3">
                                        <i class="pi pi-shopping-cart text-green-600 text-sm"></i>
                                    </div>
                                    <span>Transaction</span>
                                </router-link>

                                <router-link to="/settings"
                                    class="flex items-center px-4 py-2 hover:bg-blue-50 text-gray-700 hover:text-blue-600 transition-colors duration-200"
                                    @click="hideUserMenu">
                                    <div
                                        class="w-8 h-8 flex items-center justify-center rounded-full bg-purple-100 mr-3">
                                        <i class="pi pi-cog text-purple-600 text-sm"></i>
                                    </div>
                                    <span>Settings</span>
                                </router-link>
                            </div>

                            <div class="border-t border-gray-100 my-1"></div>

                            <div class="py-1">
                                <router-link to="/help"
                                    class="flex items-center px-4 py-2 hover:bg-blue-50 text-gray-700 hover:text-blue-600 transition-colors duration-200"
                                    @click="hideUserMenu">
                                    <div
                                        class="w-8 h-8 flex items-center justify-center rounded-full bg-yellow-100 mr-3">
                                        <i class="pi pi-question-circle text-yellow-600 text-sm"></i>
                                    </div>
                                    <span>Help Center</span>
                                </router-link>

                                <button @click="logout"
                                    class="flex items-center px-4 py-2 hover:bg-red-50 text-gray-700 hover:text-red-600 transition-colors duration-200 w-full text-left">
                                    <div class="w-8 h-8 flex items-center justify-center rounded-full bg-red-100 mr-3">
                                        <i class="pi pi-sign-out text-red-600 text-sm"></i>
                                    </div>
                                    <span>Logout</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Auth Links -->
                <div class="flex items-center space-x-4" v-else>
                    <a @click="handleSignIn"
                        class="text-gray-700 hover:text-green-600 px-3 py-2 rounded-md transition-all duration-300 text-sm font-medium cursor-pointer">
                        Sign In
                    </a>
                    <a @click="handleSignUp"
                        class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium cursor-pointer transition-all duration-300">
                        Sign Up
                    </a>
                </div>
            </div>
        </div>
    </div>
</template>
