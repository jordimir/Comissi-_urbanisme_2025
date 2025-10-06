import { CommissionSummary, CommissionDetail, AdminData, ApplicationData, User, AdminList } from './types';
import { 
    commissions as initialCommissions, 
    commissionDetails as initialCommissionDetails, 
    adminData as initialAdminData 
} from './data';

// Simulate a database in memory
let db: ApplicationData = {
    commissions: JSON.parse(JSON.stringify(initialCommissions)),
    commissionDetails: JSON.parse(JSON.stringify(initialCommissionDetails)),
    adminData: JSON.parse(JSON.stringify(initialAdminData)),
};

const SIMULATED_DELAY = 200; // ms

// Helper to simulate network delay
const delay = () => new Promise(resolve => setTimeout(resolve, SIMULATED_DELAY));

export const getDayOfWeekCatalan = (dateString: string): string => {
    const parts = dateString.split('/');
    if (parts.length !== 3) return '';
    
    const [day, month, year] = parts.map(Number);
    if (isNaN(day) || isNaN(month) || isNaN(year)) {
        return ''; 
    }
    const date = new Date(year, month - 1, day);
    const days = ['diumenge', 'dilluns', 'dimarts', 'dimecres', 'dijous', 'divendres', 'dissabte'];
    return days[date.getDay()];
};

// --- API Functions ---

export const getApplicationData = async (): Promise<ApplicationData> => {
    await delay();
    // Return deep copies to prevent direct state mutation
    return JSON.parse(JSON.stringify(db));
};

export const getCommissionDetail = async (actaId: number): Promise<CommissionDetail | undefined> => {
    await delay();
    let detail = db.commissionDetails.find(d => d.numActa === actaId);
    if (detail) {
        return JSON.parse(JSON.stringify(detail));
    }

    const commissionSummary = db.commissions.find(c => c.numActa === actaId);
    if (commissionSummary && commissionSummary.estat === 'Oberta') {
        const newDetail: CommissionDetail = {
            numActa: actaId,
            sessio: commissionSummary.dataComissio,
            dataActual: new Date().toLocaleDateString('ca-ES'),
            hora: '9:00:00',
            estat: 'Oberta',
            mitja: 'Via telemàtica',
            expedientsCount: 0,
            expedients: [],
        };
        // Don't save it to the DB yet, just return it for viewing. The save happens on user action.
        return newDetail;
    }

    return undefined;
};


export const saveCommissionDetails = async (updatedDetail: CommissionDetail): Promise<CommissionDetail> => {
    await delay();
    let found = false;
    db.commissionDetails = db.commissionDetails.map(detail => {
        if (detail.numActa === updatedDetail.numActa) {
            found = true;
            return updatedDetail;
        }
        return detail;
    });
    if (!found) {
        db.commissionDetails.push(updatedDetail);
    }

    // Also update the summary
    db.commissions = db.commissions.map(summary => 
        summary.numActa === updatedDetail.numActa ? { 
            ...summary, 
            numTemes: updatedDetail.expedients.length,
            dataComissio: updatedDetail.sessio,
            estat: updatedDetail.estat,
            diaSetmana: getDayOfWeekCatalan(updatedDetail.sessio),
        } : summary
    );
    
    return JSON.parse(JSON.stringify(updatedDetail));
};

export const updateCommissionSummary = async (numActa: number, dataComissio: string, field: keyof CommissionSummary, value: any): Promise<CommissionSummary> => {
    await delay();
    let updatedCommission: CommissionSummary | undefined;
    db.commissions = db.commissions.map(c => {
        if (c.numActa === numActa && c.dataComissio === dataComissio) {
          updatedCommission = { ...c, [field]: value };
          if (field === 'avisEmail' && !value) {
            updatedCommission.dataEmail = null;
          }
          return updatedCommission;
        }
        return c;
    });
    if (!updatedCommission) throw new Error("Commission not found");
    return JSON.parse(JSON.stringify(updatedCommission));
};

export const markCommissionAsSent = async (numActa: number, dataComissio: string): Promise<CommissionSummary> => {
    await delay();
    const today = new Date();
    const formattedDate = today.toLocaleDateString('ca-ES', { day: 'numeric', month: 'numeric', year: 'numeric' });

    let updatedCommission: CommissionSummary | undefined;
    db.commissions = db.commissions.map(c => {
        if (c.numActa === numActa && c.dataComissio === dataComissio) {
            updatedCommission = { ...c, avisEmail: true, dataEmail: formattedDate };
            return updatedCommission;
        }
        return c;
    });
    if (!updatedCommission) throw new Error("Commission not found");
    return JSON.parse(JSON.stringify(updatedCommission));
};

export const generateNextYearCommissions = async (): Promise<CommissionSummary[]> => {
    await delay();
    const lastYear = Math.max(...db.commissions.map(c => parseInt(c.dataComissio.split('/')[2], 10)));
    const nextYear = lastYear + 1;
    
    const newCommissions: CommissionSummary[] = [];
    let lastActaNum = Math.max(...db.commissions.map(c => c.numActa));
    
    const date = new Date(nextYear, 0, 1);
    while (date.getDay() !== 3) { // Find the first Wednesday
      date.setDate(date.getDate() + 1);
    }
    
    while (date.getFullYear() === nextYear) {
      lastActaNum++;
      const newCommission: CommissionSummary = {
        numActa: lastActaNum,
        numTemes: 0,
        diaSetmana: 'dimecres',
        dataComissio: date.toLocaleDateString('ca-ES', { day: 'numeric', month: 'numeric', year: 'numeric'}),
        avisEmail: false,
        dataEmail: null,
        estat: 'Oberta'
      };
      newCommissions.push(newCommission);
      date.setDate(date.getDate() + 14);
    }
    
    db.commissions = [...db.commissions, ...newCommissions];
    return JSON.parse(JSON.stringify(newCommissions));
};


// Admin data functions
export const updateAdminItem = async (list: keyof Omit<AdminData, 'users'>, id: string, name: string, email?: string) => {
    await delay();
    const adminList = db.adminData[list] as AdminList[];
    db.adminData[list] = adminList.map(item =>
        item.id === id ? { ...item, name, email } : item
    ) as any;
    return { id, name, email };
};

export const deleteAdminItem = async (list: keyof Omit<AdminData, 'users'>, id: string) => {
    await delay();
    const adminList = db.adminData[list] as AdminList[];
    db.adminData[list] = adminList.filter(item => item.id !== id) as any;
    return { success: true };
};

export const addAdminItem = async (list: keyof Omit<AdminData, 'users'>, name: string, email?: string) => {
    await delay();
    const newItem: AdminList = {
        id: `new-${Date.now()}`,
        name,
        email,
    };
    (db.adminData[list] as AdminList[]).push(newItem);
    return JSON.parse(JSON.stringify(newItem));
};

export const updateUser = async (id: string, name: string, email: string, password?: string) => {
    await delay();
    db.adminData.users = db.adminData.users.map(user => {
        if (user.id === id) {
            const updatedUser: User = { ...user, name, email };
            if (password) {
                updatedUser.password = password;
            }
            return updatedUser;
        }
        return user;
    });
    return { id, name, email };
};

export const deleteUser = async (id: string) => {
    await delay();
    db.adminData.users = db.adminData.users.filter(user => user.id !== id);
    return { success: true };
};

export const addUser = async (name: string, email: string, password?: string) => {
    await delay();
    const newUser: User = {
        id: `user-${Date.now()}`,
        name,
        email,
        password,
    };
    db.adminData.users.push(newUser);
    return JSON.parse(JSON.stringify(newUser));
};

export const importUsers = async (importedUsers: User[]): Promise<User[]> => {
    await delay();
    const usersMap = new Map(db.adminData.users.map(u => [u.id, u]));
    
    importedUsers.forEach((importedUser: User) => {
        if (importedUser.id === 'user-master') return;

        const existingUser = usersMap.get(importedUser.id);
        if (existingUser) {
            usersMap.set(importedUser.id, { ...existingUser, name: importedUser.name, email: importedUser.email });
        } else {
            usersMap.set(importedUser.id, {
                ...importedUser,
                password: 'changeme123'
            });
        }
    });

    db.adminData.users = Array.from(usersMap.values());
    return JSON.parse(JSON.stringify(db.adminData.users));
};

export const importData = async (data: ApplicationData): Promise<ApplicationData> => {
    await delay();
    db = JSON.parse(JSON.stringify(data));
    return db;
};
