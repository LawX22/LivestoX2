<script lang="ts">
import { defineComponent, ref, computed, onMounted } from 'vue';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import Avatar from 'primevue/avatar';
import Badge from 'primevue/badge';
import Textarea from 'primevue/textarea';
import Dropdown from 'primevue/dropdown';
import Divider from 'primevue/divider';
import Menu from 'primevue/menu';
import Tooltip from 'primevue/tooltip';

interface Message {
    id: number;
    senderId: number;
    receiverId: number;
    content: string;
    timestamp: Date;
    isRead: boolean;
    attachments?: string[];
}

interface Conversation {
    id: number;
    userId: number;
    userName: string;
    userAvatar: string;
    lastMessage: string;
    lastMessageTime: Date;
    unreadCount: number;
    isOnline: boolean;
    isTyping: boolean;
    messages: Message[];
    category?: string;
}

interface FilterOption {
    label: string;
    value: string;
    icon: string;
}

export default defineComponent({
    name: 'MessagesPage',
    components: {
        Button,
        InputText,
        Avatar,
        Badge,
        Textarea,
        Dropdown,
        Divider,
        Menu
    },
    directives: {
        tooltip: Tooltip
    },
    setup() {
        // Active user and conversation states
        const currentUserId = ref(1); // Current logged in user ID
        const selectedConversationId = ref<number | null>(null);
        const searchQuery = ref('');
        const newMessageText = ref('');
        const messageMenuRef = ref();
        const filterOption = ref({ label: 'All Messages', value: 'all', icon: 'pi pi-inbox' });
        const isSidebarCollapsed = ref(false);

        // Filter options with icons
        const filterOptions = ref<FilterOption[]>([
            { label: 'All Messages', value: 'all', icon: 'pi pi-inbox' },
            { label: 'Unread', value: 'unread', icon: 'pi pi-envelope' },
            { label: 'Livestock Inquiries', value: 'livestock', icon: 'pi pi-list' },
            { label: 'Payment Discussion', value: 'payment', icon: 'pi pi-wallet' },
            { label: 'Shipping & Delivery', value: 'shipping', icon: 'pi pi-truck' }
        ]);

        // Message menu options
        const messageMenuItems = ref([
            {
                label: 'Message Actions',
                items: [
                    { label: 'Reply', icon: 'pi pi-reply' },
                    { label: 'Forward', icon: 'pi pi-share-alt' },
                    { label: 'Copy', icon: 'pi pi-copy' },
                    {
                        label: 'Delete',
                        icon: 'pi pi-trash',
                        class: 'text-red-500'
                    }
                ]
            }
        ]);

        // Generate mock conversation data
        const conversations = ref<Conversation[]>([]);

        const generateMockConversations = () => {
            const userNames = ['Maria Santos', 'Juan Reyes', 'Carlos Mendoza', 'Sofia Garcia', 'Pedro Lim'];
            const categories = ['Livestock', 'Cattle', 'Goats', 'Pigs', 'Poultry'];
            const mockConversations: Conversation[] = [];

            for (let i = 0; i < 5; i++) {
                const userId = i + 2; // Starting from 2 since current user is 1
                const messageCount = Math.floor(Math.random() * 15) + 3;
                const messages: Message[] = [];

                // Generate messages for this conversation
                for (let j = 0; j < messageCount; j++) {
                    const isFromCurrentUser = Math.random() > 0.5;
                    const senderId = isFromCurrentUser ? currentUserId.value : userId;
                    const receiverId = isFromCurrentUser ? userId : currentUserId.value;

                    const hoursAgo = messageCount - j - 1;

                    messages.push({
                        id: j + 1,
                        senderId,
                        receiverId,
                        content: generateMessageContent(j),
                        timestamp: new Date(Date.now() - hoursAgo * 3600 * 1000),
                        isRead: hoursAgo > 2 || isFromCurrentUser,
                    });
                }

                const lastMsg = messages[messages.length - 1];
                const unreadCount = messages.filter(m => !m.isRead && m.senderId !== currentUserId.value).length;

                mockConversations.push({
                    id: i + 1,
                    userId,
                    userName: userNames[i],
                    userAvatar: `/api/placeholder/32/32?text=${userNames[i].charAt(0)}`,
                    lastMessage: lastMsg.content,
                    lastMessageTime: lastMsg.timestamp,
                    unreadCount,
                    isOnline: Math.random() > 0.6,
                    isTyping: i === 0, // First user is typing
                    messages,
                    category: categories[i]
                });
            }

            return mockConversations;
        };

        const generateMessageContent = (index: number): string => {
            const messageTemplates = [
                "Hi there! I'm interested in your Brahman Cattle listing. Is it still available?",
                "Yes, it's still available. When would you like to come see it?",
                "Great! I'm available this weekend. Do you have any more photos?",
                "I've sent you some additional photos. Let me know if you need more information.",
                "The cattle look healthy. What's your best price?",
                "For this breed and quality, I can offer a 5% discount if you purchase more than one.",
                "I'm looking for cattle that are already vaccinated. Have these received all their shots?",
                "Yes, they are fully vaccinated. I can provide the vaccination records when you visit.",
                "Perfect. I'll be coming from Mandaue City. Can you send me the exact location?",
                "I've sent you the location via private message. There's good road access to the farm.",
                "What's the feeding routine you've been using?",
                "They've been grass-fed with supplemental grain during the dry season.",
                "Do you offer delivery services to Toledo City?",
                "Yes, we can arrange delivery for an additional fee depending on the distance.",
                "Great! I'll confirm after I see them this weekend."
            ];

            return messageTemplates[index % messageTemplates.length];
        };

        // Filter conversations based on search and filter option
        const filteredConversations = computed(() => {
            let result = conversations.value;

            // Apply search filter
            if (searchQuery.value) {
                const query = searchQuery.value.toLowerCase();
                result = result.filter(conv =>
                    conv.userName.toLowerCase().includes(query) ||
                    conv.lastMessage.toLowerCase().includes(query)
                );
            }

            // Apply type filter
            if (filterOption.value.value === 'unread') {
                result = result.filter(conv => conv.unreadCount > 0);
            } else if (filterOption.value.value === 'livestock') {
                result = result.filter(conv => conv.category === 'Livestock');
            } else if (filterOption.value.value === 'payment') {
                result = result.filter(conv => conv.lastMessage.toLowerCase().includes('price') ||
                    conv.lastMessage.toLowerCase().includes('payment') ||
                    conv.lastMessage.toLowerCase().includes('discount'));
            } else if (filterOption.value.value === 'shipping') {
                result = result.filter(conv => conv.lastMessage.toLowerCase().includes('delivery') ||
                    conv.lastMessage.toLowerCase().includes('location'));
            }

            return result;
        });

        // Get selected conversation
        const selectedConversation = computed(() => {
            if (!selectedConversationId.value) return null;
            return conversations.value.find(c => c.id === selectedConversationId.value) || null;
        });

        // Format date for display
        const formatMessageTime = (date: Date): string => {
            const now = new Date();
            const diffMs = now.getTime() - date.getTime();
            const diffMins = Math.floor(diffMs / 60000);
            const diffHours = Math.floor(diffMs / 3600000);
            const diffDays = Math.floor(diffMs / 86400000);

            if (diffMins < 1) {
                return 'Just now';
            } else if (diffMins < 60) {
                return `${diffMins}m ago`;
            } else if (diffHours < 24) {
                return `${diffHours}h ago`;
            } else if (diffDays === 1) {
                return 'Yesterday';
            } else if (diffDays < 7) {
                return `${diffDays} days ago`;
            } else {
                return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            }
        };

        // Format time for message bubbles
        const formatBubbleTime = (date: Date): string => {
            return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        };

        // Send a new message
        const sendMessage = () => {
            if (!newMessageText.value.trim() || !selectedConversation.value) return;

            const conversation = conversations.value.find(c => c.id === selectedConversationId.value);
            if (!conversation) return;

            const newMessage: Message = {
                id: conversation.messages.length + 1,
                senderId: currentUserId.value,
                receiverId: conversation.userId,
                content: newMessageText.value,
                timestamp: new Date(),
                isRead: false
            };

            conversation.messages.push(newMessage);
            conversation.lastMessage = newMessage.content;
            conversation.lastMessageTime = newMessage.timestamp;

            newMessageText.value = '';

            // In a real app, you would send this to your API
            console.log('Message sent:', newMessage);

            // Auto-scroll to bottom of messages
            scrollToBottom();
        };

        // Scroll to bottom of messages
        const scrollToBottom = () => {
            setTimeout(() => {
                const chatContainer = document.querySelector('.message-list');
                if (chatContainer) {
                    chatContainer.scrollTop = chatContainer.scrollHeight;
                }
            }, 50);
        };

        // Select a conversation
        const selectConversation = (conversationId: number) => {
            selectedConversationId.value = conversationId;

            // Mark messages as read
            const conversation = conversations.value.find(c => c.id === conversationId);
            if (conversation) {
                conversation.messages.forEach(msg => {
                    if (msg.senderId !== currentUserId.value) {
                        msg.isRead = true;
                    }
                });
                conversation.unreadCount = 0;
            }

            // On mobile, collapse sidebar after selecting conversation
            if (window.innerWidth < 768) {
                isSidebarCollapsed.value = true;
            }

            // Auto-scroll to the bottom of messages
            scrollToBottom();
        };

        // Show message menu
        const showMessageMenu = (event: Event, message: Message) => {
            // Only show menu for sent messages (from current user)
            if (message.senderId === currentUserId.value && messageMenuRef.value) {
                messageMenuRef.value.toggle(event);
            }
        };

        // Navigate back to the Livestock Market - Fixed router reference
        const navigateToMarket = () => {
            // Using window.location since this.$router is not accessible in setup()
            window.location.href = '/main/LivestockMarket';
            // Alternatively, if you're using Vue Router with the Composition API:
            // import { useRouter } from 'vue-router';
            // const router = useRouter();
            // router.push('/main/LivestockMarket');
        };

        // Toggle sidebar on mobile
        const toggleSidebar = () => {
            isSidebarCollapsed.value = !isSidebarCollapsed.value;
        };

        onMounted(() => {
            // Load conversations (in a real app, this would be an API call)
            conversations.value = generateMockConversations();

            // Select first conversation by default
            if (conversations.value.length > 0) {
                selectConversation(conversations.value[0].id);
            }

            // Handle resize events to adjust mobile/desktop view
            window.addEventListener('resize', () => {
                if (window.innerWidth >= 768) {
                    isSidebarCollapsed.value = false;
                }
            });
        });

        return {
            searchQuery,
            filterOption,
            filterOptions,
            conversations,
            filteredConversations,
            selectedConversationId,
            selectedConversation,
            newMessageText,
            messageMenuRef,
            messageMenuItems,
            currentUserId,
            isSidebarCollapsed,

            selectConversation,
            formatMessageTime,
            formatBubbleTime,
            sendMessage,
            showMessageMenu,
            navigateToMarket,
            toggleSidebar
        };
    }
});
</script>

<template>
    <div class="messages-page bg-slate-100 h-screen w-screen flex flex-col overflow-hidden">
        <!-- Page Header -->
        <header
            class="bg-gradient-to-br from-green-400 to-green-700 text-white p-4 shadow-lg sticky top-0 z-10 overflow-hidden">
            <!-- Background Pattern -->
            <div class="absolute inset-0 opacity-10">
                <div class="absolute inset-0"
                    style="background-image: url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.4\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E');">
                </div>
            </div>

            <!-- Content -->
            <div class="flex items-center justify-between max-w-screen-2xl mx-auto relative z-10">
                <div class="flex items-center space-x-3">
                    <Button icon="pi pi-arrow-left" @click="navigateToMarket"
                        class="p-button-rounded p-button-text p-button-sm text-white bg-green-950/80 hover:bg-green-900 transition-colors shadow-sm"
                        v-tooltip.bottom-start="'Return to Livestock Market'" />
                    <div class="border-l border-green-600/50 pl-3">
                        <h1 class="text-xl font-bold flex items-center">
                            <i class="pi pi-comments mr-2 text-green-300"></i>
                            LivestoX Messenger
                        </h1>
                        <p class="text-green-200 text-sm">Connect with buyers and sellers</p>
                    </div>
                </div>
                <div class="flex items-center space-x-3">
                    <Button icon="pi pi-bell"
                        class="p-button-rounded p-button-text text-white bg-green-950/80 hover:bg-green-900 transition-colors shadow-sm"
                        v-tooltip.bottom="'Notifications'" />
                    <Button icon="pi pi-question-circle"
                        class="p-button-rounded p-button-text text-white bg-green-950/80 hover:bg-green-900 transition-colors shadow-sm"
                        v-tooltip.bottom-end="'Get Help'" />
                </div>
            </div>
        </header>

        <div class="flex-1 flex overflow-hidden">
            <!-- Left sidebar: Conversations list -->
            <div :class="[
                'border-r border-slate-200 flex flex-col bg-white transition-all duration-300 z-20 shadow-md',
                isSidebarCollapsed ? 'w-0 md:w-96 overflow-hidden' : 'w-full md:w-96'
            ]">
                <!-- Search and filter -->
                <div class="p-4 border-b border-slate-200 bg-white">
                    <div class="relative mb-4 max-w-md mx-auto">
                        <h2 class="text-lg font-medium text-slate-700 mb-2">Message Search</h2>
                        <div class="relative rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
                            <span class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <i class="pi pi-search text-slate-400"></i>
                            </span>
                            <InputText v-model="searchQuery" placeholder="Search messages..."
                                class="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all duration-200" />
                            <button v-if="searchQuery" @click="searchQuery = ''"
                                class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600">
                                <i class="pi pi-times text-sm"></i>
                            </button>
                        </div>
                    </div>

                    <!-- Icon filters -->
                    <div class="flex justify-between items-center bg-slate-50 rounded-lg p-1">
                        <button v-for="option in filterOptions" :key="option.value" @click="filterOption = option"
                            :class="[
                                'flex flex-1 items-center justify-center p-2 rounded-md transition-all',
                                filterOption.value === option.value
                                    ? 'bg-green-400 text-white shadow-md'
                                    : 'text-slate-600 hover:bg-slate-200'
                            ]" v-tooltip.top="option.label">
                            <i :class="[option.icon, 'text-lg']"></i>
                        </button>
                    </div>
                </div>

                <!-- Conversations list -->
                <div class="overflow-y-auto flex-1 divide-y divide-slate-100">
                    <div v-for="conversation in filteredConversations" :key="conversation.id"
                        @click="selectConversation(conversation.id)" :class="[
                            'p-4 cursor-pointer transition-colors flex items-start',
                            selectedConversationId === conversation.id
                                ? 'bg-green-50 border-l-4 border-green-600'
                                : 'hover:bg-slate-50 border-l-4 border-transparent'
                        ]">
                        <div class="relative">
                            <Avatar :image="conversation.userAvatar" :pt="{
                                root: { class: 'mr-3 bg-green-100 text-green-800' }
                            }">
                                {{ conversation.userName.charAt(0) }}
                            </Avatar>
                            <span v-if="conversation.isOnline"
                                class="absolute bottom-0 right-2 w-3 h-3 bg-green-500 border-2 border-white rounded-full">
                            </span>
                        </div>

                        <div class="flex-1 min-w-0">
                            <div class="flex justify-between items-start">
                                <h3 class="font-medium text-slate-900 truncate">
                                    {{ conversation.userName }}
                                </h3>
                                <span class="text-xs text-slate-500 whitespace-nowrap ml-2">
                                    {{ formatMessageTime(conversation.lastMessageTime) }}
                                </span>
                            </div>

                            <div v-if="conversation.isTyping" class="text-sm text-green-600 italic">
                                Typing...
                            </div>
                            <p v-else class="text-sm text-slate-600 truncate">
                                {{ conversation.lastMessage }}
                            </p>

                            <div class="flex justify-end items-center mt-2">
                                <Badge v-if="conversation.unreadCount > 0" :value="conversation.unreadCount"
                                    severity="success" />
                            </div>
                        </div>
                    </div>

                    <!-- Empty state when no conversations match filter -->
                    <div v-if="filteredConversations.length === 0" class="p-6 text-center">
                        <div class="bg-slate-100 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
                            <i class="pi pi-inbox text-slate-400 text-xl"></i>
                        </div>
                        <h3 class="text-slate-700 font-medium mb-2">No messages found</h3>
                        <p class="text-slate-500 text-sm mb-4">Try different search or filter options</p>
                        <Button label="Back to Market" icon="pi pi-arrow-left" @click="navigateToMarket"
                            class="p-button-outlined p-button-success" />
                    </div>
                </div>
            </div>

            <!-- Right side: Message content -->
            <div class="flex-1 flex flex-col bg-slate-50 relative">
                <!-- Mobile menu toggle -->
                <button v-if="selectedConversation" @click="toggleSidebar"
                    class="md:hidden fixed top-16 left-3 z-30 bg-green-700 text-white rounded-full w-10 h-10 flex items-center justify-center shadow-lg">
                    <i :class="['pi', isSidebarCollapsed ? 'pi-bars' : 'pi-times']"></i>
                </button>

                <!-- If no conversation is selected -->
                <div v-if="!selectedConversation"
                    class="flex-1 flex flex-col items-center justify-center p-6 text-center">
                    <div class="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-5 shadow-md">
                        <i class="pi pi-comments text-green-700 text-4xl"></i>
                    </div>
                    <h2 class="text-2xl font-medium text-slate-800 mb-3">Your Messages</h2>
                    <p class="text-slate-500 max-w-md mb-6">
                        Select a conversation to view messages or start a new conversation with a seller
                    </p>
                    <div class="space-x-3">
                        <Button label="Start New Conversation" icon="pi pi-plus"
                            class="p-button-rounded p-button-success shadow-md" />
                        <Button label="Return to Market" icon="pi pi-arrow-left" @click="navigateToMarket"
                            class="p-button-rounded p-button-outlined p-button-success shadow-sm" />
                    </div>
                </div>

                <!-- Conversation view -->
                <template v-else>
                    <!-- Conversation header -->
                    <div
                        class="px-4 py-3 border-b border-slate-200 flex items-center justify-between bg-white shadow-sm sticky top-0 z-10">
                        <div class="flex items-center">
                            <Avatar :image="selectedConversation.userAvatar" :pt="{
                                root: { class: 'mr-3 bg-green-100 text-green-800' }
                            }">
                                {{ selectedConversation.userName.charAt(0) }}
                            </Avatar>
                            <div>
                                <div class="flex items-center">
                                    <h3 class="font-medium text-slate-900">
                                        {{ selectedConversation.userName }}
                                    </h3>
                                    <span v-if="selectedConversation.isOnline"
                                        class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 ml-2">
                                        Online
                                    </span>
                                </div>
                                <div class="flex items-center text-xs text-slate-500">
                                    <span class="bg-green-100 text-green-800 px-2 py-0.5 rounded text-xs">
                                        {{ selectedConversation.category }} Seller
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div>
                            <Button icon="pi pi-ellipsis-v" class="p-button-rounded p-button-text p-button-sm"
                                v-tooltip.left="'More Options'" aria-label="More options" />
                        </div>
                    </div>

                    <!-- Message list -->
                    <div class="flex-1 overflow-y-auto p-4 message-list bg-slate-50">
                        <div v-for="(message, index) in selectedConversation.messages" :key="message.id" class="mb-4">
                            <!-- Date separator -->
                            <div v-if="index === 0 || index === 3" class="flex justify-center mb-4">
                                <div
                                    class="bg-green-100 text-green-800 rounded-full px-4 py-1 text-xs font-medium shadow-sm">
                                    {{ index === 0 ? 'Today' : 'Yesterday' }}
                                </div>
                            </div>

                            <!-- Message bubble -->
                            <div :class="[
                                'flex',
                                message.senderId === currentUserId ? 'justify-end' : 'justify-start'
                            ]">
                                <div :class="[
                                    'max-w-xs sm:max-w-sm md:max-w-md rounded-2xl p-3 relative shadow-sm break-words',
                                    message.senderId === currentUserId
                                        ? 'bg-green-600 text-white rounded-br-none'
                                        : 'bg-white text-slate-800 rounded-bl-none'
                                ]" @contextmenu.prevent="showMessageMenu($event, message)">
                                    <p class="whitespace-pre-line">{{ message.content }}</p>
                                    <div :class="[
                                        'text-xs mt-1 flex items-center',
                                        message.senderId === currentUserId
                                            ? 'text-green-100'
                                            : 'text-slate-500'
                                    ]">
                                        {{ formatBubbleTime(message.timestamp) }}
                                        <i v-if="message.senderId === currentUserId" :class="[
                                            'pi ml-1',
                                            message.isRead ? 'pi-check-circle' : 'pi-check'
                                        ]"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Send Message -->
                    <div class="p-4 border-t border-slate-200 bg-white shadow-md rounded-b-lg">
                        <div class="flex items-center gap-3">
                            <div class="flex items-center gap-4 ml-2">
                                <i class="pi pi-paperclip text-gray-600 hover:text-gray-800 cursor-pointer text-xl flex items-center justify-center"
                                    v-tooltip.top="'Attach File'" aria-label="Attach file"></i>
                                <i class="pi pi-image text-gray-600 hover:text-gray-800 cursor-pointer text-xl flex items-center justify-center"
                                    v-tooltip.top="'Send Image'" aria-label="Send image"></i>
                            </div>
                            <div class="relative flex-1">
                                <Textarea v-model="newMessageText" rows="1" autoResize placeholder="Type a message..."
                                    class="w-full rounded-md py-2 px-4 focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition-all"
                                    @keydown.enter.prevent="sendMessage" />
                            </div>
                            <div class="flex items-center justify-center w-10 h-10 mr-1">
                                <i class="pi pi-send text-green-600 hover:text-green-700 cursor-pointer text-xl"
                                    :class="{ 'text-gray-400 hover:text-gray-400 cursor-not-allowed': !newMessageText.trim() }"
                                    @click="newMessageText.trim() && sendMessage()"></i>
                            </div>
                        </div>
                    </div>
                </template>
            </div>
        </div>

        <!-- Message context menu -->
        <Menu ref="messageMenuRef" :model="messageMenuItems" :popup="true" />
    </div>
</template>

<style scoped>
/* Full screen styles */
:deep(body),
:deep(html) {
    margin: 0;
    padding: 0;
    overflow: hidden;
    height: 100%;
    width: 100%;
}

.message-list::-webkit-scrollbar {
    width: 6px;
}

.message-list::-webkit-scrollbar-track {
    background: #f1f5f9;
}

.message-list::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 3px;
}

.message-list::-webkit-scrollbar-thumb:hover {
    background: #94a3b8;
}

/* Make sure text areas don't become too big */
:deep(.p-inputtextarea) {
    max-height: 100px;
    resize: none;
    transition: all 0.2s ease;
    border-radius: 24px;
    padding: 12px 16px;
}

:deep(.p-inputtextarea:focus) {
    border-color: #16a34a;
    box-shadow: 0 0 0 2px rgba(22, 163, 74, 0.2);
}

/* Custom styling for badges */
:deep(.p-badge) {
    background-color: #16a34a;
    font-weight: 600;
}

/* Avatar styling */
:deep(.p-avatar) {
    width: 44px;
    height: 44px;
    border: 2px solid rgba(22, 163, 74, 0.2);
}

/* Prevent text overflow in message bubbles */
:deep(.message-bubble) {
    word-break: break-word;
    overflow-wrap: break-word;
}

/* Button styling enhancements */
:deep(.p-button) {
    transition: all 0.2s ease;
}

:deep(.p-button-success) {
    background-color: #16a34a;
    border-color: #16a34a;
}

:deep(.p-button-success:hover) {
    background-color: #15803d;
    border-color: #15803d;
}

/* Dropdown styling */
:deep(.p-dropdown) {
    border-radius: 8px;
}

:deep(.p-dropdown-panel) {
    border-radius: 8px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

/* Tooltip styling */
:deep(.p-tooltip .p-tooltip-text) {
    background-color: rgba(15, 23, 42, 0.9);
    border-radius: 6px;
    padding: 8px 12px;
    font-size: 0.75rem;
}

/* Animation for typing indicator */
@keyframes typing {
    0% {
        opacity: 0.5;
    }

    50% {
        opacity: 1;
    }

    100% {
        opacity: 0.5;
    }
}

.typing-indicator {
    animation: typing 1.5s infinite;
}

/* Responsive adjustments */
@media (max-width: 640px) {
    :deep(.p-inputtextarea) {
        padding: 10px 14px;
    }

    :deep(.message-list) {
        padding: 10px;
    }
}
</style>