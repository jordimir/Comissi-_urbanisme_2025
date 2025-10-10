

export type CommissionStatus = 'Finalitzada' | 'Oberta';
export type ReportStatus = 'Favorable' | 'Desfavorable' | 'Favorable condicionat (mixte)' | 'Caducat/Arxivat' | 'Requeriment' | 'Posar en consideració';
export type SortDirection = 'asc' | 'desc';

export interface SortConfig {
  key: keyof Expedient;
  direction: SortDirection;
}

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
  sessio: string;
  dataActual: string;
  hora: string;
  estat: CommissionStatus;
  mitja: string;
  numActa: number;
  expedientsCount: number;
  expedients: Expedient[];
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

export interface ProcedureTypeStat {
    name: string;
    'Tipus': number;
}

export interface MonthlyWorkloadStat {
    month: string;
    'Expedients': number;
}

export interface TechnicianWorkload {
    headers: { date: string; isFuture: boolean }[];
    technicians: string[];
    data: Record<string, Record<string, number>>;
    rowTotals: Record<string, number>;
    columnTotals: number[];
    grandTotal: number;
}

export interface StatisticsData {
    technicianDistribution: TechnicianStat[];
    workloadOverTime: WorkloadStat[];
    reportStatusDistribution: ReportStatusStat[];
    procedureTypeDistribution: ProcedureTypeStat[];
    monthlyWorkload: MonthlyWorkloadStat[];
    technicianWorkload: TechnicianWorkload;
}

export interface AdminList {
  id: string;
  name: string;
  email?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
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

export interface ToastMessage {
  id: number;
  message: string;
  type: 'success' | 'error';
  onUndo?: () => void;
}
