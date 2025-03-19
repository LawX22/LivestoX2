<script lang="ts">
import { defineComponent, ref, computed, PropType } from 'vue';
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
    emits: ['view-user', 'ban-user', 'edit-user', 'delete-user'],
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
                    },
                    {
                        label: 'Delete User',
                        icon: 'pi pi-trash',
                        command: () => deleteUser(selectedUser.value),
                        class: 'text-red-600'
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

        const editUser = (user: User | null) => {
            if (user) emit('edit-user', user);
        };

        const deleteUser = (user: User | null) => {
            if (user) emit('delete-user', user);
        };

        const toggleMenu = (event: Event, user: User) => {
            selectedUser.value = user;
            actionsMenu.value.toggle(event);
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
                'hover:bg-blue-50 transition-colors duration-150': true,
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
            editUser,
            deleteUser,
            toggleMenu,
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
            selectedUser
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
            <h2 class="text-2xl font-semibold text-gray-800">User Management</h2>
            <div class="flex gap-2">
                <Button icon="pi pi-download" label="Export CSV" class="p-button-outlined" @click="exportCSV" />
                <Button icon="pi pi-plus" label="Add User" class="p-button" />
            </div>
        </div>

        <!-- Search and Filter Controls -->
        <div class="p-4 bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
            <div class="grid grid-cols-1 md:grid-cols-12 gap-4">
                <div class="col-span-1 md:col-span-4">
                    <span class="p-input-icon-left w-full">
                        <i class="pi pi-search" />
                        <InputText v-model="searchQuery" placeholder="Search by name or email" class="w-full rounded-lg" />
                    </span>
                </div>
                <div class="col-span-1 md:col-span-8 flex flex-wrap gap-3">
                    <Dropdown v-model="statusFilter" :options="statusOptions" optionLabel="label"
                        class="w-full md:w-40 rounded-lg" placeholder="Status" />
                    <Dropdown v-model="typeFilter" :options="typeOptions" optionLabel="label"
                        class="w-full md:w-40 rounded-lg" placeholder="User Type" />
                    <Dropdown v-model="verificationFilter" :options="verificationOptions" optionLabel="label"
                        class="w-full md:w-40 rounded-lg" placeholder="Verification" />
                    <Button icon="pi pi-filter-slash" label="Clear" class="p-button-outlined" @click="clearFilters" />
                </div>
            </div>
        </div>

        <!-- Users DataTable -->
        <DataTable ref="dt" v-model:expandedRows="expandedRows" :value="filteredUsers" :paginator="true" :rows="10" 
            :rowsPerPageOptions="[5, 10, 20, 50]" filterDisplay="menu" :loading="loading" stripedRows 
            removableSort responsiveLayout="scroll" class="shadow rounded-lg overflow-hidden"
            :rowClass="rowClass" :rowHover="true" sortField="id" :sortOrder="1"
            dataKey="id" v-model:selection="selectedUser" selectionMode="single"
            showGridlines paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
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
                        <Button icon="pi pi-pencil" @click="editUser(slotProps.data)"
                            class="p-button-rounded p-button-text p-button-success" v-tooltip="'Edit User'" />
                        <Button icon="pi pi-ellipsis-v" @click="toggleMenu($event, slotProps.data)"
                            class="p-button-rounded p-button-text" v-tooltip="'More Actions'" />
                    </div>
                </template>
            </Column>

            <template #expansion="slotProps">
                <div class="p-4 bg-gray-50">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div class="bg-white p-4 rounded-lg shadow-sm">
                            <h3 class="text-lg font-medium mb-3">Contact Information</h3>
                            <div class="grid grid-cols-2 gap-3">
                                <div>
                                    <p class="text-sm text-gray-500">Phone:</p>
                                    <p class="text-gray-700">{{ slotProps.data.phone || 'Not provided' }}</p>
                                </div>
                                <div>
                                    <p class="text-sm text-gray-500">Email:</p>
                                    <p class="text-gray-700">{{ slotProps.data.email }}</p>
                                </div>
                                <div class="col-span-2">
                                    <p class="text-sm text-gray-500">Address:</p>
                                    <p class="text-gray-700">
                                        {{ slotProps.data.address || 'Not provided' }}
                                        {{ slotProps.data.city ? ', ' + slotProps.data.city : '' }}
                                        {{ slotProps.data.postalCode ? ', ' + slotProps.data.postalCode : '' }}
                                    </p>
                                </div>
                                <div>
                                    <p class="text-sm text-gray-500">Country:</p>
                                    <p class="text-gray-700">{{ slotProps.data.country || 'Not provided' }}</p>
                                </div>
                            </div>
                        </div>

                        <div class="bg-white p-4 rounded-lg shadow-sm">
                            <h3 class="text-lg font-medium mb-3">Activity Information</h3>
                            <div class="grid grid-cols-2 gap-3">
                                <div>
                                    <p class="text-sm text-gray-500">Registration Date:</p>
                                    <p class="text-gray-700">{{ new Date(slotProps.data.registrationDate).toLocaleDateString() }}</p>
                                </div>
                                <div>
                                    <p class="text-sm text-gray-500">Last Active:</p>
                                    <p class="text-gray-700">{{ new Date(slotProps.data.lastActive).toLocaleDateString() }}</p>
                                </div>
                                <div v-if="slotProps.data.type === 'buyer'">
                                    <p class="text-sm text-gray-500">Orders Placed:</p>
                                    <p class="text-gray-700">{{ slotProps.data.ordersPlaced || 0 }}</p>
                                </div>
                                <div v-if="slotProps.data.type === 'seller'">
                                    <p class="text-sm text-gray-500">Products Listed:</p>
                                    <p class="text-gray-700">{{ slotProps.data.productsListed || 0 }}</p>
                                </div>
                                <div v-if="slotProps.data.type === 'seller'">
                                    <p class="text-sm text-gray-500">Total Revenue:</p>
                                    <p class="text-gray-700">${{ slotProps.data.revenue?.toLocaleString() || '0' }}</p>
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

<style scoped>
.user-management {
    font-family: var(--font-family);
}

/* Add subtle hover effect to actions buttons */
.p-button-rounded:hover {
    background-color: rgba(0, 0, 0, 0.04);
    transform: translateY(-1px);
    transition: all 0.2s ease;
}

/* Custom styles for expanded row */
:deep(.p-datatable-tbody > tr.p-row-expanded) {
    background-color: #f8fafc;
}

/* Status tag enhancements */
:deep(.p-tag) {
    border-radius: 9999px;
    padding: 0.25rem 0.75rem;
}

/* Smooth transitions */
.p-datatable .p-datatable-tbody > tr {
    transition: background-color 0.2s, box-shadow 0.2s;
}

/* Enhanced hover effect */
.p-datatable .p-datatable-tbody > tr:hover {
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    z-index: 1;
    position: relative;
}

/* Custom scrollbar */
:deep(.p-datatable-wrapper) {
    scrollbar-width: thin;
    scrollbar-color: #cbd5e1 #f1f5f9;
}

:deep(.p-datatable-wrapper::-webkit-scrollbar) {
    width: 8px;
    height: 8px;
}

:deep(.p-datatable-wrapper::-webkit-scrollbar-track) {
    background: #f1f5f9;
    border-radius: 4px;
}

:deep(.p-datatable-wrapper::-webkit-scrollbar-thumb) {
    background-color: #cbd5e1;
    border-radius: 4px;
}
</style>