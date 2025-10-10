
export type CommissionStatus = 'Oberta' | 'Finalitzada';
export type ReportStatus = 'Favorable' | 'Desfavorable' | 'Favorable condicionat (mixte)' | 'Posar en consideració' | 'Caducat/Arxivat' | 'Requeriment';
export type UserRole = 'admin' | 'editor' | 'viewer';
export type SortDirection = 'asc' | 'desc';

export interface CommissionSummary {
  numActa: number;
  numTemes: number;
  diaSetmana: string;
  dataComissio: string;
  avisEmail: boolean;
  dataEmail: string | null;
  estat: CommissionStatus;
}

export interface Expedient {
  id: string;
  peticionari: string;
  procediment: string;
  descripcio: string;
  indret: string;
  sentitInforme: ReportStatus | string;
  departament: string;
  tecnic: string;
  isNew?: boolean;
}

export interface CommissionDetail {
  numActa: number;
  sessio: string;
  dataActual: string;
  hora: string;
  estat: CommissionStatus | string;
  mitja: string;
  expedientsCount: number;
  expedients: Expedient[];
}

export interface AdminList {
    id: string;
    name: string;
    email?: string;
}

export interface User extends AdminList {
    password?: string;
    role: UserRole;
}

export interface AdminData {
  procediments: AdminList[];
  sentitInformes: AdminList[];
  tecnics: AdminList[];
  departaments: AdminList[];
  regidors: AdminList[];
  users: User[];
}

export interface ApplicationData {
  commissions: CommissionSummary[];
  commissionDetails: CommissionDetail[];
  adminData: AdminData;
}

export interface TechnicianStat {
    name: string;
    value: number;
    fill: string;
}

export interface WorkloadStat {
    date: string;
    'Càrrega': number;
}

export interface ReportStatusStat {
    name: string;
    value: number;
    fill: string;
}

export interface TechnicianWorkload {
    headers: { date: string, isFuture: boolean }[];
    technicians: string[];
    data: { [technician: string]: { [date: string]: number } };
    rowTotals: { [technician: string]: number };
    columnTotals: number[];
    grandTotal: number;
}

export interface StatisticsData {
    technicianDistribution: TechnicianStat[];
    workloadOverTime: WorkloadStat[];
    reportStatusDistribution: ReportStatusStat[];
    procedureTypeDistribution: any[];
    monthlyWorkload: any[];
    technicianWorkload: TechnicianWorkload;
}

export interface ToastMessage {
    id: number;
    message: string;
    type: 'success' | 'error';
    onUndo?: () => void;
}

export interface SortConfig {
    key: keyof Expedient;
    direction: SortDirection;
}

export interface DeletedCommissionPayload {
    summary: CommissionSummary;
    detail: CommissionDetail | null;
}

export interface ChatMessage {
    role: 'user' | 'model' | 'error';
    text: string;
}