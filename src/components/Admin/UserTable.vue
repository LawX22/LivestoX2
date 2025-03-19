<script lang="ts">
import { defineComponent, ref, computed, PropType, onMounted, nextTick } from 'vue';
import InputText from 'primevue/inputtext';
import Dropdown from 'primevue/dropdown';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import Avatar from 'primevue/avatar';
import Tag from 'primevue/tag';
import Calendar from 'primevue/calendar';
import Tooltip from 'primevue/tooltip';
import ConfirmDialog from 'primevue/confirmdialog';
import OverlayPanel from 'primevue/overlaypanel';
import Menu from 'primevue/menu';

interface User {
    id: number;
    name: string;
    email: string;
    status: 'active' | 'inactive' | 'pending' | 'banned';
    type: 'buyer' | 'seller';
    registrationDate: string;
    lastActive: string;
    phone: string;
    address: string;
    city: string;
    country: string;
    postalCode: string;
    ordersPlaced?: number;
    productsListed?: number;
    revenue?: number;
    avatarUrl: string;
    verificationStatus: 'verified' | 'unverified' | 'pending';
}

export default defineComponent({
    name: 'UserTable',
    components: {
        InputText,
        Dropdown,
        DataTable,
        Column,
        Button,
        Avatar,
        Tag,
        Calendar,
        ConfirmDialog,
        OverlayPanel,
        Menu
    },
    directives: {
        tooltip: Tooltip
    },
    props: {
        users: {
            type: Array as PropType<User[]>,
            required: true
        },
        loading: {
            type: Boolean,
            default: false
        }
    },
    emits: ['view-user', 'ban-user', 'unban-user', 'edit-user'],
    setup(props, { emit }) {
        const searchQuery = ref('');
        const statusFilter = ref(null);
        const typeFilter = ref(null);
        const dateFilter = ref(null);
        const verificationFilter = ref(null);
        const actionsMenu = ref();
        const op = ref();
        const selectedUser = ref<User | null>(null);
        const currentSort = ref({ field: 'id', order: 1 });
        const expandedRows = ref({});
        const dt = ref();
        const tableRef = ref<HTMLElement | null>(null);
        
        // Table element ID for directly focusing
        const TABLE_ELEMENT_ID = 'user-management-table';

        // Status options for dropdown filter
        const statusOptions = [
            { label: 'All Statuses', value: null },
            { label: 'Active', value: 'active' },
            { label: 'Inactive', value: 'inactive' },
            { label: 'Pending', value: 'pending' },
            { label: 'Banned', value: 'banned' }
        ];

        // Type options for dropdown filter
        const typeOptions = [
            { label: 'All Types', value: null },
            { label: 'Buyers', value: 'buyer' },
            { label: 'Sellers', value: 'seller' }
        ];

        // Verification options
        const verificationOptions = [
            { label: 'All Verification', value: null },
            { label: 'Verified', value: 'verified' },
            { label: 'Unverified', value: 'unverified' },
            { label: 'Pending', value: 'pending' }
        ];

        const menuItems = [
            {
                label: 'Actions',
                items: [
                    {
                        label: 'View Profile',
                        icon: 'pi pi-user',
                        command: () => viewUser(selectedUser.value)
                    },
                    {
                        label: 'Edit User',
                        icon: 'pi pi-pencil',
                        command: () => editUser(selectedUser.value)
                    },
                    {
                        label: 'Ban User',
                        icon: 'pi pi-ban',
                        command: () => banUser(selectedUser.value),
                        disabled: selectedUser.value?.status === 'banned'
                    }
                ]
            }
        ];

        const filteredUsers = computed(() => {
            return props.users.filter(user => {
                // Search by name or email
                const matchesSearch =
                    !searchQuery.value ||
                    user.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                    user.email.toLowerCase().includes(searchQuery.value.toLowerCase());

                // Filter by status
                const matchesStatus = !statusFilter.value || user.status === statusFilter.value;

                // Filter by type (buyer/seller)
                const matchesType = !typeFilter.value || user.type === typeFilter.value;

                // Filter by verification status
                const matchesVerification = !verificationFilter.value || user.verificationStatus === verificationFilter.value;

                return matchesSearch && matchesStatus && matchesType && matchesVerification;
            });
        });

        // Go to the table element to see the loading animation
        const focusTableElement = () => {
            // First try getting by ID
            const tableElement = document.getElementById(TABLE_ELEMENT_ID);
            
            if (tableElement) {
                // Use scrollIntoView with specific options to keep the table in view
                // but not necessarily at the very top
                tableElement.scrollIntoView({
                    behavior: 'auto',
                    block: 'center'  // Position in the middle of viewport to see loading animation
                });
                return true;
            }
            
            // Fallback to finding the DataTable component
            if (dt.value?.$el) {
                dt.value.$el.scrollIntoView({
                    behavior: 'auto',
                    block: 'center'
                });
                return true;
            }
            
            return false;
        };

        // For hash-based focus preservation
        const setTableFocusHash = () => {
            // Only change hash if not already set
            if (!window.location.hash || window.location.hash !== `#${TABLE_ELEMENT_ID}`) {
                // Use history.replaceState to avoid adding to browser history
                history.replaceState(null, '', `#${TABLE_ELEMENT_ID}`);
            }
        };

        onMounted(() => {
            tableRef.value = document.querySelector('.user-management');
            
            // Add ID to the table for direct targeting
            if (tableRef.value) {
                tableRef.value.id = TABLE_ELEMENT_ID;
            }
            
            // First load - handle hash navigation or set it
            if (window.location.hash === `#${TABLE_ELEMENT_ID}`) {
                // If we're already targeting the table, focus it
                nextTick(() => {
                    // Small delay to ensure DOM is ready
                    setTimeout(() => {
                        focusTableElement();
                    }, 50);
                });
            } else {
                // Set the hash for future reloads
                setTableFocusHash();
            }
        });

        const clearFilters = () => {
            searchQuery.value = '';
            statusFilter.value = null;
            typeFilter.value = null;
            dateFilter.value = null;
            verificationFilter.value = null;

            // Reset sorting
            if (dt.value) {
                dt.value.sortField = 'id';
                dt.value.sortOrder = 1;
            }
        };

        const getStatusSeverity = (status: string) => {
            switch (status) {
                case 'active': return 'success';
                case 'inactive': return 'warning';
                case 'pending': return 'info';
                case 'banned': return 'danger';
                default: return 'info';
            }
        };

        const getStatusIcon = (status: string) => {
            switch (status) {
                case 'active': return 'pi pi-check-circle';
                case 'inactive': return 'pi pi-clock';
                case 'pending': return 'pi pi-hourglass';
                case 'banned': return 'pi pi-ban';
                default: return 'pi pi-info-circle';
            }
        };

        const getTypeColor = (type: string) => {
            return type === 'buyer' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800';
        };

        const getTypeIcon = (type: string) => {
            return type === 'buyer' ? 'pi pi-shopping-cart' : 'pi pi-tag';
        };

        const getVerificationColor = (status: string) => {
            switch (status) {
                case 'verified': return 'bg-green-100 text-green-800';
                case 'unverified': return 'bg-red-100 text-red-800';
                case 'pending': return 'bg-yellow-100 text-yellow-800';
                default: return 'bg-gray-100 text-gray-800';
            }
        };

        const getVerificationIcon = (status: string) => {
            switch (status) {
                case 'verified': return 'pi pi-check-circle';
                case 'unverified': return 'pi pi-times-circle';
                case 'pending': return 'pi pi-exclamation-circle';
                default: return 'pi pi-question-circle';
            }
        };

        const viewUser = (user: User | null) => {
            if (user) emit('view-user', user);
        };

        const banUser = (user: User | null) => {
            if (user) emit('ban-user', user);
        };

        const unbanUser = (user: User | null) => {
            if (user) emit('unban-user', user);
        };

        const editUser = (user: User | null) => {
            if (user) emit('edit-user', user);
        };

        const formatDate = (dateString: string) => {
            const date = new Date(dateString);
            const now = new Date();
            const diffTime = Math.abs(now.getTime() - date.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            if (diffDays <= 1) {
                return 'Today';
            } else if (diffDays <= 2) {
                return 'Yesterday';
            } else if (diffDays <= 7) {
                return `${diffDays} days ago`;
            } else {
                return date.toLocaleDateString();
            }
        };

        const getLastActiveClass = (dateString: string) => {
            const date = new Date(dateString);
            const now = new Date();
            const diffTime = Math.abs(now.getTime() - date.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            if (diffDays <= 1) {
                return 'text-green-600';
            } else if (diffDays <= 7) {
                return 'text-blue-600';
            } else if (diffDays <= 30) {
                return 'text-orange-500';
            } else {
                return 'text-red-500';
            }
        };

        const exportCSV = () => {
            dt.value.exportCSV();
        };

        const rowClass = (data: User) => {
            return {
                'hover:bg-blue-50 transition-colors duration-200': true,
                'bg-red-50': data.status === 'banned'
            };
        };

        return {
            searchQuery,
            statusFilter,
            statusOptions,
            typeFilter,
            typeOptions,
            dateFilter,
            verificationFilter,
            verificationOptions,
            filteredUsers,
            clearFilters,
            getStatusSeverity,
            getStatusIcon,
            getTypeColor,
            getTypeIcon,
            getVerificationColor,
            getVerificationIcon,
            viewUser,
            banUser,
            unbanUser,
            editUser,
            actionsMenu,
            menuItems,
            expandedRows,
            formatDate,
            getLastActiveClass,
            exportCSV,
            dt,
            op,
            currentSort,
            rowClass,
            selectedUser,
            tableRef,
            TABLE_ELEMENT_ID
        };
    }
});
</script>

<template>
    <div class="user-management">
        <ConfirmDialog />
        <Menu ref="actionsMenu" :model="menuItems" :popup="true" />

        <!-- Header with title and export -->
        <div class="flex justify-between items-center mb-6">
            <h2 class="text-2xl font-bold text-gray-800">User Accounts</h2>
            <div class="flex gap-2">
                <Button icon="pi pi-download" label="Export CSV" class="p-button-outlined" @click="exportCSV" />
                <Button icon="pi pi-plus" label="Add User" class="p-button" />
            </div>
        </div>

        <!-- Search and Filter Controls -->
        <div class="p-6 bg-gradient-to-r from-gray-50 to-white rounded-xl shadow-lg border border-gray-100 mb-8">
            <div class="flex flex-col md:flex-row gap-5 items-start md:items-center">
                <!-- Enhanced Search Bar -->
                <div class="w-full md:w-1/3">
                    <div class="relative group">
                        <span
                            class="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-400 group-hover:text-blue-600 transition-colors">
                            <i class="pi pi-search"></i>
                        </span>
                        <InputText v-model="searchQuery" placeholder="Search by name or email"
                            class="w-full pl-10 pr-4 py-3 rounded-lg bg-white border-0 shadow-sm focus:outline-none transition-all" />
                    </div>
                </div>

                <!-- Completely Redesigned Filter Controls -->
                <div class="w-full md:flex-1 flex flex-wrap gap-4 items-center">
                    <!-- Status Dropdown with custom styling -->
                    <div class="relative w-full sm:w-auto min-w-[160px]">
                        <Dropdown v-model="statusFilter" :options="statusOptions" optionLabel="label"
                            class="w-full custom-dropdown" placeholder="Status"
                            :class="{ 'active-filter': statusFilter }">
                            <template #value="slotProps">
                                <div class="flex items-center gap-2">
                                    <span class="w-3 h-3 rounded-full" :class="{
                                        'bg-green-500': slotProps.value && slotProps.value.value === 'active',
                                        'bg-red-500': slotProps.value && slotProps.value.value === 'inactive',
                                        'bg-yellow-500': slotProps.value && slotProps.value.value === 'pending',
                                        'bg-gray-400': !slotProps.value
                                    }"></span>
                                    <span>{{ slotProps.value ? slotProps.value.label : 'Status' }}</span>
                                </div>
                            </template>
                            <template #option="slotProps">
                                <div class="flex items-center gap-2 p-1">
                                    <span class="w-3 h-3 rounded-full" :class="{
                                        'bg-green-500': slotProps.option.value === 'active',
                                        'bg-red-500': slotProps.option.value === 'inactive',
                                        'bg-yellow-500': slotProps.option.value === 'pending'
                                    }"></span>
                                    <span>{{ slotProps.option.label }}</span>
                                </div>
                            </template>
                        </Dropdown>
                    </div>

                    <!-- User Type Dropdown with custom styling -->
                    <div class="relative w-full sm:w-auto min-w-[160px]">
                        <Dropdown v-model="typeFilter" :options="typeOptions" optionLabel="label"
                            class="w-full custom-dropdown" placeholder="User Type"
                            :class="{ 'active-filter': typeFilter }">
                            <template #value="slotProps">
                                <div class="flex items-center gap-2">
                                    <i v-if="slotProps.value" class="pi" :class="{
                                        'pi-user': slotProps.value.value === 'standard',
                                        'pi-star': slotProps.value.value === 'premium',
                                        'pi-shield': slotProps.value.value === 'admin'
                                    }"></i>
                                    <span>{{ slotProps.value ? slotProps.value.label : 'User Type' }}</span>
                                </div>
                            </template>
                            <template #option="slotProps">
                                <div class="flex items-center gap-2 p-1">
                                    <i class="pi" :class="{
                                        'pi-user': slotProps.option.value === 'standard',
                                        'pi-star': slotProps.option.value === 'premium',
                                        'pi-shield': slotProps.option.value === 'admin'
                                    }"></i>
                                    <span>{{ slotProps.option.label }}</span>
                                </div>
                            </template>
                        </Dropdown>
                    </div>

                    <!-- Verification Dropdown with custom styling -->
                    <div class="relative w-full sm:w-auto min-w-[160px]">
                        <Dropdown v-model="verificationFilter" :options="verificationOptions" optionLabel="label"
                            class="w-full custom-dropdown" placeholder="Verification"
                            :class="{ 'active-filter': verificationFilter }">
                            <template #value="slotProps">
                                <div class="flex items-center gap-2">
                                    <i v-if="slotProps.value" class="pi" :class="{
                                        'pi-check-circle text-green-500': slotProps.value.value === 'verified',
                                        'pi-times-circle text-red-500': slotProps.value.value === 'unverified',
                                        'pi-clock text-yellow-500': slotProps.value.value === 'pending'
                                    }"></i>
                                    <span>{{ slotProps.value ? slotProps.value.label : 'Verification' }}</span>
                                </div>
                            </template>
                            <template #option="slotProps">
                                <div class="flex items-center gap-2 p-1">
                                    <i class="pi" :class="{
                                        'pi-check-circle text-green-500': slotProps.option.value === 'verified',
                                        'pi-times-circle text-red-500': slotProps.option.value === 'unverified',
                                        'pi-clock text-yellow-500': slotProps.option.value === 'pending'
                                    }"></i>
                                    <span>{{ slotProps.option.label }}</span>
                                </div>
                            </template>
                        </Dropdown>
                    </div>

                    <!-- Enhanced Clear Button -->
                    <Button icon="pi pi-filter-slash" label="Clear Filters"
                        class="p-button-rounded p-button-outlined transition-all duration-300 ease-in-out bg-gradient-to-r from-blue-500 to-blue-600 border-0 hover:from-blue-600 hover:to-blue-700 hover:shadow-lg focus:outline-none "
                        @click="clearFilters" />
                </div>
            </div>
        </div>

        <!-- Users DataTable -->
        <DataTable ref="dt" v-model:expandedRows="expandedRows" :value="filteredUsers" :paginator="true" :rows="10"
            :rowsPerPageOptions="[5, 10, 20, 50]" filterDisplay="menu" :loading="loading" stripedRows
            responsiveLayout="scroll" class="shadow-md rounded-lg overflow-hidden" :rowClass="rowClass" :rowHover="true"
            sortField="id" :sortOrder="1" dataKey="id" v-model:selection="selectedUser" selectionMode="single"
            showGridlines
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            currentPageReportTemplate="{first} to {last} of {totalRecords} users">
            <template #empty>
                <div class="text-center py-12">
                    <div class="text-gray-400 mb-4">
                        <i class="pi pi-search text-5xl"></i>
                    </div>
                    <p class="text-xl text-gray-500 font-light">No users found matching your criteria</p>
                    <Button label="Clear Filters" icon="pi pi-filter-slash" class="p-button-text mt-3"
                        @click="clearFilters" />
                </div>
            </template>
            <template #loading>
                <div class="text-center py-12">
                    <div class="text-gray-400 mb-4">
                        <i class="pi pi-spin pi-spinner text-5xl"></i>
                    </div>
                    <p class="text-xl text-gray-500 font-light">Loading user data...</p>
                </div>
            </template>

            <template #header>
                <div class="flex justify-between items-center">
                    <div class="text-sm text-gray-500">{{ filteredUsers.length }} users found</div>
                    <div class="flex gap-2">
                        <Button icon="pi pi-refresh" class="p-button-text p-button-rounded" v-tooltip="'Refresh'" />
                        <Button icon="pi pi-cog" class="p-button-text p-button-rounded" v-tooltip="'Table Settings'" />
                    </div>
                </div>
            </template>

            <Column expander style="width: 3rem" />

            <Column field="id" header="ID" sortable style="width: 5rem">
                <template #body="slotProps">
                    <span class="text-sm font-medium text-gray-600">#{{ slotProps.data.id }}</span>
                </template>
            </Column>

            <Column header="User" style="min-width: 14rem">
                <template #body="slotProps">
                    <div class="flex items-center gap-3">
                        <Avatar :image="slotProps.data.avatarUrl" shape="circle" size="large"
                            class="shadow-sm border border-gray-200" />
                        <div>
                            <div class="font-medium text-gray-800">{{ slotProps.data.name }}</div>
                            <div class="text-sm text-gray-500">{{ slotProps.data.email }}</div>
                            <div v-if="slotProps.data.type === 'seller'"
                                class="text-xs text-green-600 flex items-center gap-1 mt-1">
                                <i class="pi pi-dollar"></i>
                                <span>Revenue: ${{ slotProps.data.revenue?.toLocaleString() }}</span>
                            </div>
                            <div v-else class="text-xs text-blue-600 flex items-center gap-1 mt-1">
                                <i class="pi pi-shopping-cart"></i>
                                <span>Orders: {{ slotProps.data.ordersPlaced || 0 }}</span>
                            </div>
                        </div>
                    </div>
                </template>
            </Column>

            <Column field="type" header="Type" sortable style="min-width: 8rem">
                <template #body="slotProps">
                    <div class="flex items-center gap-2">
                        <i :class="getTypeIcon(slotProps.data.type) + ' text-gray-600'"></i>
                        <span class="px-2 py-1 rounded-full text-xs font-medium"
                            :class="getTypeColor(slotProps.data.type)">
                            {{ slotProps.data.type === 'buyer' ? 'Buyer' : 'Seller' }}
                        </span>
                    </div>
                </template>
            </Column>

            <Column field="status" header="Status" sortable style="min-width: 8rem">
                <template #body="slotProps">
                    <div class="flex items-center gap-2">
                        <i :class="getStatusIcon(slotProps.data.status)"
                            :style="{ color: slotProps.data.status === 'active' ? '#10B981' : slotProps.data.status === 'inactive' ? '#F59E0B' : slotProps.data.status === 'banned' ? '#EF4444' : '#60A5FA' }"></i>
                        <Tag :value="slotProps.data.status" :severity="getStatusSeverity(slotProps.data.status)"
                            class="capitalize" />
                    </div>
                </template>
                <template #filter="{ filterModel, filterCallback }">
                    <Dropdown v-model="filterModel.value" :options="statusOptions" optionLabel="label"
                        @change="filterCallback()" class="p-column-filter" placeholder="Select Status" />
                </template>
            </Column>

            <Column field="verificationStatus" header="Verification" sortable style="min-width: 8rem">
                <template #body="slotProps">
                    <span class="px-2 py-1 rounded-full text-xs font-medium inline-flex items-center gap-1"
                        :class="getVerificationColor(slotProps.data.verificationStatus)">
                        <i :class="getVerificationIcon(slotProps.data.verificationStatus)"></i>
                        {{ slotProps.data.verificationStatus }}
                    </span>
                </template>
            </Column>

            <Column field="registrationDate" header="Registered" sortable style="min-width: 8rem">
                <template #body="slotProps">
                    <div class="flex items-center text-sm text-gray-600">
                        <i class="pi pi-calendar mr-2"></i>
                        {{ new Date(slotProps.data.registrationDate).toLocaleDateString() }}
                    </div>
                </template>
            </Column>

            <Column field="lastActive" header="Last Active" sortable style="min-width: 8rem">
                <template #body="slotProps">
                    <div class="flex items-center text-sm" :class="getLastActiveClass(slotProps.data.lastActive)">
                        <i class="pi pi-clock mr-2"></i>
                        {{ formatDate(slotProps.data.lastActive) }}
                    </div>
                </template>
            </Column>

            <Column header="Actions" style="min-width: 10rem">
                <template #body="slotProps">
                    <div class="flex gap-2">
                        <Button icon="pi pi-eye" @click="viewUser(slotProps.data)"
                            class="p-button-rounded p-button-text p-button-info" v-tooltip="'View Details'" />

                        <!-- Show edit button only if user is not banned -->
                        <Button v-if="slotProps.data.status !== 'banned'" icon="pi pi-pencil"
                            @click="editUser(slotProps.data)" class="p-button-rounded p-button-text p-button-success"
                            v-tooltip="'Edit User'" />

                        <!-- Show ban button only if user is not banned -->
                        <Button v-if="slotProps.data.status !== 'banned'" icon="pi pi-ban"
                            @click="banUser(slotProps.data)" class="p-button-rounded p-button-text p-button-danger"
                            v-tooltip="'Ban User'" />

                        <!-- Show unban button only if user is banned -->
                        <Button v-if="slotProps.data.status === 'banned'" icon="pi pi-undo"
                            @click="unbanUser(slotProps.data)" class="p-button-rounded p-button-text p-button-warning"
                            v-tooltip="'Unban User'" />
                    </div>
                </template>
            </Column>

            <template #expansion="slotProps">
                <div class="p-4 bg-gray-50">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div class="bg-white p-4 rounded-lg shadow-sm">
                            <h3 class="text-lg font-medium mb-3 flex items-center">
                                <i class="pi pi-id-card mr-2 text-blue-500"></i>
                                Contact Information
                            </h3>
                            <div class="grid grid-cols-2 gap-3">
                                <div>
                                    <p class="text-sm text-gray-500">Phone:</p>
                                    <p class="text-gray-700 flex items-center">
                                        <i class="pi pi-phone mr-2 text-gray-400"></i>
                                        {{ slotProps.data.phone || 'Not provided' }}
                                    </p>
                                </div>
                                <div>
                                    <p class="text-sm text-gray-500">Email:</p>
                                    <p class="text-gray-700 flex items-center">
                                        <i class="pi pi-envelope mr-2 text-gray-400"></i>
                                        {{ slotProps.data.email }}
                                    </p>
                                </div>
                                <div class="col-span-2">
                                    <p class="text-sm text-gray-500">Address:</p>
                                    <p class="text-gray-700 flex items-center">
                                        <i class="pi pi-map-marker mr-2 text-gray-400"></i>
                                        {{ slotProps.data.address || 'Not provided' }}
                                        {{ slotProps.data.city ? ', ' + slotProps.data.city : '' }}
                                        {{ slotProps.data.postalCode ? ', ' + slotProps.data.postalCode : '' }}
                                    </p>
                                </div>
                                <div>
                                    <p class="text-sm text-gray-500">Country:</p>
                                    <p class="text-gray-700 flex items-center">
                                        <i class="pi pi-globe mr-2 text-gray-400"></i>
                                        {{ slotProps.data.country || 'Not provided' }}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div class="bg-white p-4 rounded-lg shadow-sm">
                            <h3 class="text-lg font-medium mb-3 flex items-center">
                                <i class="pi pi-chart-bar mr-2 text-green-500"></i>
                                Activity Information
                            </h3>
                            <div class="grid grid-cols-2 gap-3">
                                <div>
                                    <p class="text-sm text-gray-500">Registration Date:</p>
                                    <p class="text-gray-700 flex items-center">
                                        <i class="pi pi-calendar mr-2 text-gray-400"></i>
                                        {{ new Date(slotProps.data.registrationDate).toLocaleDateString() }}
                                    </p>
                                </div>
                                <div>
                                    <p class="text-sm text-gray-500">Last Active:</p>
                                    <p class="text-gray-700 flex items-center">
                                        <i class="pi pi-clock mr-2 text-gray-400"></i>
                                        {{ new Date(slotProps.data.lastActive).toLocaleDateString() }}
                                    </p>
                                </div>
                                <div v-if="slotProps.data.type === 'buyer'">
                                    <p class="text-sm text-gray-500">Orders Placed:</p>
                                    <p class="text-gray-700 flex items-center">
                                        <i class="pi pi-shopping-cart mr-2 text-gray-400"></i>
                                        {{ slotProps.data.ordersPlaced || 0 }}
                                    </p>
                                </div>
                                <div v-if="slotProps.data.type === 'seller'">
                                    <p class="text-sm text-gray-500">Products Listed:</p>
                                    <p class="text-gray-700 flex items-center">
                                        <i class="pi pi-tag mr-2 text-gray-400"></i>
                                        {{ slotProps.data.productsListed || 0 }}
                                    </p>
                                </div>
                                <div v-if="slotProps.data.type === 'seller'">
                                    <p class="text-sm text-gray-500">Total Revenue:</p>
                                    <p class="text-gray-700 flex items-center">
                                        <i class="pi pi-dollar mr-2 text-gray-400"></i>
                                        ${{ slotProps.data.revenue?.toLocaleString() || '0' }}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </template>

            <template #footer>
                <div class="flex justify-between text-sm text-gray-500">
                    <div>Last updated: {{ new Date().toLocaleString() }}</div>
                    <div>* Click the row expansion icon for more details</div>
                </div>
            </template>
        </DataTable>
    </div>
</template>

