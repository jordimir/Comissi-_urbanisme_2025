import { CommissionSummary, CommissionDetail, AdminData, ApplicationData, User, AdminList, DeletedCommissionPayload } from './types';
import { logger } from './logger';

const API_BASE_URL = 'http://localhost:3001/api';
const SESSION_STORAGE_KEY = 'urbanisme_session_user';

const apiRequest = async (url: string, options: RequestInit = {}) => {
    try {
        const response = await fetch(url, options);
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `Error: ${response.status}`);
        }
        if (response.status === 204) {
            return;
        }
        return response.json();
    } catch (error) {
        logger.error(`API request failed: ${error.message}`, { url, options, error });
        throw error;
    }
};

// --- Auth Functions ---

export const login = async (email: string, password: string): Promise<User> => {
    const user = await apiRequest(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
    });
    sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(user));
    return user;
};

export const logout = async (): Promise<void> => {
    sessionStorage.removeItem(SESSION_STORAGE_KEY);
    return Promise.resolve();
};

export const getCurrentUser = async (): Promise<User | null> => {
    try {
        const serializedUser = sessionStorage.getItem(SESSION_STORAGE_KEY);
        return serializedUser ? JSON.parse(serializedUser) : null;
    } catch (error) {
        logger.error("Failed to load user from sessionStorage", { error });
        return null;
    }
};

// --- API Functions ---

export const getApplicationData = async (): Promise<ApplicationData> => {
    return apiRequest(`${API_BASE_URL}/application-data`);
};

export const getCommissionDetail = async (actaId: number, commissionDate: string): Promise<CommissionDetail | undefined> => {
    const formattedDate = commissionDate.replace(/\//g, '-');
    return apiRequest(`${API_BASE_URL}/commission-detail/${actaId}/${formattedDate}`);
};

export const saveCommissionDetails = async (updatedDetail: CommissionDetail): Promise<CommissionDetail> => {
    return apiRequest(`${API_BASE_URL}/commission-details`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedDetail),
    });
};

export const updateCommissionSummary = async (numActa: number, dataComissio: string, field: keyof CommissionSummary, value: any): Promise<CommissionSummary> => {
    const formattedDate = dataComissio.replace(/\//g, '-');
    return apiRequest(`${API_BASE_URL}/commissions/${numActa}/${formattedDate}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ field, value }),
    });
};

export const markCommissionAsSent = async (numActa: number, dataComissio: string): Promise<CommissionSummary> => {
    const formattedDate = dataComissio.replace(/\//g, '-');
    return apiRequest(`${API_BASE_URL}/commissions/${numActa}/${formattedDate}/mark-as-sent`, {
        method: 'PUT',
    });
};

export const generateNextYearCommissions = async (): Promise<CommissionSummary[]> => {
    return apiRequest(`${API_BASE_URL}/commissions/generate-next-year`, {
        method: 'POST',
    });
};

export const addCommission = async (commissionData: { dataComissio: string, numActa: number }): Promise<CommissionSummary> => {
    return apiRequest(`${API_BASE_URL}/commissions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(commissionData),
    });
};

export const updateCommission = async (originalNumActa: number, originalDataComissio: string, updatedData: { numActa: number, dataComissio: string }): Promise<CommissionSummary> => {
    const formattedDate = originalDataComissio.replace(/\//g, '-');
    return apiRequest(`${API_BASE_URL}/commissions/${originalNumActa}/${formattedDate}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData),
    });
};

export const deleteCommission = async (numActa: number, dataComissio: string): Promise<DeletedCommissionPayload> => {
    const formattedDate = dataComissio.replace(/\//g, '-');
    return apiRequest(`${API_BASE_URL}/commissions/${numActa}/${formattedDate}`, {
        method: 'DELETE',
    });
};

export const restoreCommission = async (payload: DeletedCommissionPayload): Promise<void> => {
    return apiRequest(`${API_BASE_URL}/commissions/restore`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    });
};

// Admin data functions
export const updateAdminItem = async (list: keyof Omit<AdminData, 'users'>, id: string, name: string, email?: string) => {
    return apiRequest(`${API_BASE_URL}/admin/${list}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email }),
    });
};

export const deleteAdminItem = async (list: keyof Omit<AdminData, 'users'>, id: string): Promise<AdminList> => {
    return apiRequest(`${API_BASE_URL}/admin/${list}/${id}`, {
        method: 'DELETE',
    });
};

export const restoreAdminItem = async (list: keyof Omit<AdminData, 'users'>, item: AdminList): Promise<void> => {
    return apiRequest(`${API_BASE_URL}/admin/${list}/restore`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item),
    });
};

export const addAdminItem = async (list: keyof Omit<AdminData, 'users'>, name: string, email?: string) => {
    return apiRequest(`${API_BASE_URL}/admin/${list}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email }),
    });
};

export const updateUser = async (id: string, name: string, email: string, role: User['role'], password?: string) => {
    return apiRequest(`${API_BASE_URL}/users/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, role, password }),
    });
};

export const deleteUser = async (id: string): Promise<User> => {
    return apiRequest(`${API_BASE_URL}/users/${id}`, {
        method: 'DELETE',
    });
};

export const restoreUser = async (user: User): Promise<void> => {
    return apiRequest(`${API_BASE_URL}/users/restore`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user),
    });
};

export const addUser = async (name: string, email: string, role: User['role'], password?: string) => {
    return apiRequest(`${API_BASE_URL}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, role, password }),
    });
};

export const importUsers = async (importedUsers: User[]): Promise<User[]> => {
    return apiRequest(`${API_BASE_URL}/users/import`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(importedUsers),
    });
};