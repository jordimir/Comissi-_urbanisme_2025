
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

export const getCommissionDetail = async (actaId: number, commissionDate: string): Promise<CommissionDetail | undefined> => {
    await delay();
    const year = commissionDate.split('/')[2];
    let detail = db.commissionDetails.find(d => d.numActa === actaId && d.sessio.endsWith(`/${year}`));

    if (detail) {
        return JSON.parse(JSON.stringify(detail));
    }

    const commissionSummary = db.commissions.find(c => c.numActa === actaId && c.dataComissio === commissionDate);
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
    const updatedYear = updatedDetail.sessio.split('/')[2];
    db.commissionDetails = db.commissionDetails.map(detail => {
        if (detail.numActa === updatedDetail.numActa && detail.sessio.endsWith(`/${updatedYear}`)) {
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
        (summary.numActa === updatedDetail.numActa && summary.dataComissio.endsWith(`/${updatedYear}`)) ? { 
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
    const commissionYears = db.commissions.map(c => parseInt(c.dataComissio.split('/')[2], 10));
    const lastYear = commissionYears.length > 0 ? Math.max(...commissionYears) : new Date().getFullYear();
    const nextYear = lastYear + 1;

    if (db.commissions.some(c => c.dataComissio.endsWith(`/${nextYear}`))) {
        throw new Error(`Les comissions per a l'any ${nextYear} ja existeixen.`);
    }
    
    const newCommissions: CommissionSummary[] = [];
    let actaCounter = 1; // Start numbering at 1 for the new year.
    
    const date = new Date(nextYear, 0, 1);
    // Find the first Wednesday of the year
    while (date.getDay() !== 3) { 
      date.setDate(date.getDate() + 1);
    }
    
    // Generate commissions every two weeks (on Wednesdays)
    while (date.getFullYear() === nextYear) {
      const newCommission: CommissionSummary = {
        numActa: actaCounter,
        numTemes: 0,
        diaSetmana: 'dimecres',
        dataComissio: date.toLocaleDateString('ca-ES', { day: 'numeric', month: 'numeric', year: 'numeric'}),
        avisEmail: false,
        dataEmail: null,
        estat: 'Oberta'
      };
      newCommissions.push(newCommission);
      actaCounter++;
      date.setDate(date.getDate() + 14);
    }
    
    db.commissions = [...db.commissions, ...newCommissions].sort((a,b) => {
        const [dayA, monthA, yearA] = a.dataComissio.split('/').map(Number);
        const [dayB, monthB, yearB] = b.dataComissio.split('/').map(Number);
        const dateA = new Date(yearA, monthA - 1, dayA);
        const dateB = new Date(yearB, monthB - 1, dayB);
        if(dateA.getTime() === dateB.getTime()) return a.numActa - b.numActa;
        return dateA.getTime() - dateB.getTime();
    });
    
    return JSON.parse(JSON.stringify(newCommissions));
};

export const addCommission = async (commissionData: { dataComissio: string, numActa: number }): Promise<CommissionSummary> => {
    await delay();
    const year = commissionData.dataComissio.split('/')[2];
    const commissionsInYear = db.commissions.filter(c => c.dataComissio.endsWith(`/${year}`));

    if (commissionsInYear.some(c => c.numActa === commissionData.numActa)) {
        throw new Error(`El número d'acta ${commissionData.numActa} ja existeix per a l'any ${year}.`);
    }

    const newCommission: CommissionSummary = {
        numActa: commissionData.numActa,
        dataComissio: commissionData.dataComissio,
        diaSetmana: getDayOfWeekCatalan(commissionData.dataComissio),
        numTemes: 0,
        estat: 'Oberta',
        avisEmail: false,
        dataEmail: null
    };

    db.commissions.push(newCommission);
    // Keep it sorted
    db.commissions.sort((a,b) => {
        const [dayA, monthA, yearA] = a.dataComissio.split('/').map(Number);
        const [dayB, monthB, yearB] = b.dataComissio.split('/').map(Number);
        const dateA = new Date(yearA, monthA - 1, dayA);
        const dateB = new Date(yearB, monthB - 1, dayB);
        if(dateA.getTime() === dateB.getTime()) return a.numActa - b.numActa;
        return dateA.getTime() - dateB.getTime();
    });

    return JSON.parse(JSON.stringify(newCommission));
};

export const updateCommission = async (originalNumActa: number, originalDataComissio: string, updatedData: { numActa: number, dataComissio: string }): Promise<CommissionSummary> => {
    await delay();

    const originalYear = originalDataComissio.split('/')[2];
    const updatedYear = updatedData.dataComissio.split('/')[2];
    
    const isChangingKey = originalNumActa !== updatedData.numActa || originalDataComissio !== updatedData.dataComissio;

    if (isChangingKey) {
        const conflict = db.commissions.find(c => c.numActa === updatedData.numActa && c.dataComissio.endsWith(`/${updatedYear}`));
        if (conflict) {
            throw new Error(`Ja existeix una comissió amb el número d'acta ${updatedData.numActa} per a l'any ${updatedYear}.`);
        }
    }

    let commissionToUpdate: CommissionSummary | undefined;
    db.commissions = db.commissions.map(c => {
        if(c.numActa === originalNumActa && c.dataComissio === originalDataComissio) {
            commissionToUpdate = {
                ...c,
                numActa: updatedData.numActa,
                dataComissio: updatedData.dataComissio,
                diaSetmana: getDayOfWeekCatalan(updatedData.dataComissio),
            };
            return commissionToUpdate;
        }
        return c;
    });
    
    if (!commissionToUpdate) {
        throw new Error("No s'ha trobat la comissió per actualitzar.");
    }
    
    let detailToUpdate = db.commissionDetails.find(d => d.numActa === originalNumActa && d.sessio.endsWith(`/${originalYear}`));
    if (detailToUpdate) {
        detailToUpdate.numActa = updatedData.numActa;
        detailToUpdate.sessio = updatedData.dataComissio;
    }

    return JSON.parse(JSON.stringify(commissionToUpdate));
};

export const deleteCommission = async (numActa: number, dataComissio: string): Promise<void> => {
    await delay();
    const year = dataComissio.split('/')[2];
    
    db.commissions = db.commissions.filter(c => !(c.numActa === numActa && c.dataComissio === dataComissio));
    db.commissionDetails = db.commissionDetails.filter(d => !(d.numActa === numActa && d.sessio.endsWith(`/${year}`)));
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
