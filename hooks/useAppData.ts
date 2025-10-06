import { useState, useEffect, useCallback } from 'react';
import { supabaseService } from '../lib/supabaseService';
import { CommissionSummary, CommissionDetail, AdminData, Expedient } from '../types';
import { commissions as initialCommissions, commissionDetails as initialCommissionDetails, adminData as initialAdminData } from '../data';

export const useAppData = () => {
  const [commissions, setCommissions] = useState<CommissionSummary[]>([]);
  const [commissionDetails, setCommissionDetails] = useState<CommissionDetail[]>([]);
  const [adminData, setAdminData] = useState<AdminData>(initialAdminData);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await supabaseService.loadAllData();

      if (data.commissions.length === 0) {
        setCommissions(initialCommissions);
        setCommissionDetails(initialCommissionDetails);
        setAdminData({ ...data.adminData, users: initialAdminData.users });

        for (const commission of initialCommissions) {
          await supabaseService.upsertCommission(commission);
        }
        for (const detail of initialCommissionDetails) {
          await supabaseService.saveCommissionDetail(detail);
        }
      } else {
        setCommissions(data.commissions);
        setCommissionDetails(data.commissionDetails);
        setAdminData({ ...data.adminData, users: initialAdminData.users });
      }
    } catch (err) {
      console.error('Error loading data:', err);
      setError('Error carregant les dades');
      setCommissions(initialCommissions);
      setCommissionDetails(initialCommissionDetails);
      setAdminData(initialAdminData);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const updateCommissionInState = useCallback((numActa: number, dataComissio: string, field: keyof CommissionSummary, value: any) => {
    setCommissions(prev =>
      prev.map(c => {
        if (c.numActa === numActa && c.dataComissio === dataComissio) {
          const updated = { ...c, [field]: value };
          if (field === 'avisEmail' && !value) {
            updated.dataEmail = null;
          }
          return updated;
        }
        return c;
      })
    );
  }, []);

  const updateCommission = useCallback(async (numActa: number, dataComissio: string, field: keyof CommissionSummary, value: any) => {
    updateCommissionInState(numActa, dataComissio, field, value);

    try {
      const updates: Partial<CommissionSummary> = { [field]: value };
      if (field === 'avisEmail' && !value) {
        updates.dataEmail = null;
      }
      await supabaseService.updateCommission(numActa, dataComissio, updates);
    } catch (err) {
      console.error('Error updating commission:', err);
      setError('Error actualitzant la comissió');
    }
  }, [updateCommissionInState]);

  const saveCommissionDetail = useCallback(async (detail: CommissionDetail) => {
    setCommissionDetails(prev => {
      const exists = prev.some(d => d.numActa === detail.numActa);
      if (exists) {
        return prev.map(d => d.numActa === detail.numActa ? detail : d);
      }
      return [...prev, detail];
    });

    setCommissions(prev => prev.map(c =>
      c.numActa === detail.numActa ? {
        ...c,
        numTemes: detail.expedients.length,
        dataComissio: detail.sessio,
        estat: detail.estat,
      } : c
    ));

    try {
      await supabaseService.saveCommissionDetail(detail);

      await supabaseService.updateCommission(detail.numActa, detail.sessio, {
        numTemes: detail.expedients.length,
        estat: detail.estat,
      });
    } catch (err) {
      console.error('Error saving commission detail:', err);
      setError('Error desant els detalls');
    }
  }, []);

  const addCommissions = useCallback(async (newCommissions: CommissionSummary[]) => {
    setCommissions(prev => [...prev, ...newCommissions]);

    try {
      for (const commission of newCommissions) {
        await supabaseService.upsertCommission(commission);
      }
    } catch (err) {
      console.error('Error adding commissions:', err);
      setError('Error afegint comissions');
    }
  }, []);

  const updateAdminItem = useCallback(async (list: keyof AdminData, id: string, name: string, email?: string) => {
    if (list === 'users') return;

    setAdminData(prev => ({
      ...prev,
      [list]: prev[list].map(item =>
        item.id === id ? { ...item, name, email } : item
      ),
    }));

    try {
      const tableMap: Record<string, string> = {
        procediments: 'procediments',
        sentitInformes: 'sentit_informes',
        tecnics: 'tecnics',
        departaments: 'departaments',
        regidors: 'regidors',
      };
      await supabaseService.updateAdminItem(tableMap[list], id, name, email);
    } catch (err) {
      console.error('Error updating admin item:', err);
      setError('Error actualitzant element');
    }
  }, []);

  const deleteAdminItem = useCallback(async (list: keyof AdminData, id: string) => {
    if (list === 'users') return;

    setAdminData(prev => ({
      ...prev,
      [list]: prev[list].filter(item => item.id !== id),
    }));

    try {
      const tableMap: Record<string, string> = {
        procediments: 'procediments',
        sentitInformes: 'sentit_informes',
        tecnics: 'tecnics',
        departaments: 'departaments',
        regidors: 'regidors',
      };
      await supabaseService.deleteAdminItem(tableMap[list], id);
    } catch (err) {
      console.error('Error deleting admin item:', err);
      setError('Error eliminant element');
    }
  }, []);

  const addAdminItem = useCallback(async (list: keyof AdminData, name: string, email?: string) => {
    if (list === 'users') return;

    try {
      const tableMap: Record<string, string> = {
        procediments: 'procediments',
        sentitInformes: 'sentit_informes',
        tecnics: 'tecnics',
        departaments: 'departaments',
        regidors: 'regidors',
      };
      const newItem = await supabaseService.addAdminItem(tableMap[list], name, email);

      setAdminData(prev => ({
        ...prev,
        [list]: [...prev[list], newItem],
      }));
    } catch (err) {
      console.error('Error adding admin item:', err);
      setError('Error afegint element');
    }
  }, []);

  return {
    commissions,
    commissionDetails,
    adminData,
    isLoading,
    error,
    updateCommission,
    saveCommissionDetail,
    addCommissions,
    updateAdminItem,
    deleteAdminItem,
    addAdminItem,
    setCommissions,
    setCommissionDetails,
    setAdminData,
  };
};
