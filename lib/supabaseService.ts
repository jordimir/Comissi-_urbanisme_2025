import { supabase } from './supabase';
import { CommissionSummary, CommissionDetail, Expedient, AdminData, AdminList, User } from '../types';

export const supabaseService = {
  async loadAllData(): Promise<{
    commissions: CommissionSummary[];
    commissionDetails: CommissionDetail[];
    adminData: AdminData;
  }> {
    const [commissionsRes, detailsRes, procedimentsRes, sentitRes, tecnicsRes, departamentsRes, regidorsRes] = await Promise.all([
      supabase.from('commissions').select('*').order('num_acta', { ascending: true }),
      supabase.from('commission_details').select('*, expedients(*)').order('num_acta', { ascending: true }),
      supabase.from('procediments').select('*'),
      supabase.from('sentit_informes').select('*'),
      supabase.from('tecnics').select('*'),
      supabase.from('departaments').select('*'),
      supabase.from('regidors').select('*'),
    ]);

    if (commissionsRes.error) throw commissionsRes.error;
    if (detailsRes.error) throw detailsRes.error;
    if (procedimentsRes.error) throw procedimentsRes.error;
    if (sentitRes.error) throw sentitRes.error;
    if (tecnicsRes.error) throw tecnicsRes.error;
    if (departamentsRes.error) throw departamentsRes.error;
    if (regidorsRes.error) throw regidorsRes.error;

    const commissions: CommissionSummary[] = commissionsRes.data.map((c: any) => ({
      numActa: c.num_acta,
      numTemes: c.num_temes,
      diaSetmana: c.dia_setmana,
      dataComissio: c.data_comissio,
      avisEmail: c.avis_email,
      dataEmail: c.data_email,
      estat: c.estat as 'Finalitzada' | 'Oberta',
    }));

    const commissionDetails: CommissionDetail[] = detailsRes.data.map((d: any) => {
      const expedients: Expedient[] = (d.expedients || [])
        .sort((a: any, b: any) => a.ordre - b.ordre)
        .map((e: any) => ({
          id: e.id,
          peticionari: e.peticionari,
          procediment: e.procediment,
          descripcio: e.descripcio,
          indret: e.indret,
          sentitInforme: e.sentit_informe,
          departament: e.departament,
          tecnic: e.tecnic,
        }));

      return {
        numActa: d.num_acta,
        sessio: d.sessio,
        dataActual: d.data_actual,
        hora: d.hora,
        estat: d.estat as 'Finalitzada' | 'Oberta',
        mitja: d.mitja,
        expedientsCount: expedients.length,
        expedients,
      };
    });

    const adminData: AdminData = {
      procediments: procedimentsRes.data.map((p: any) => ({ id: p.id, name: p.name })),
      sentitInformes: sentitRes.data.map((s: any) => ({ id: s.id, name: s.name })),
      tecnics: tecnicsRes.data.map((t: any) => ({ id: t.id, name: t.name, email: t.email })),
      departaments: departamentsRes.data.map((d: any) => ({ id: d.id, name: d.name })),
      regidors: regidorsRes.data.map((r: any) => ({ id: r.id, name: r.name, email: r.email })),
      users: [],
    };

    return { commissions, commissionDetails, adminData };
  },

  async upsertCommission(commission: CommissionSummary): Promise<void> {
    const { error } = await supabase.from('commissions').upsert({
      num_acta: commission.numActa,
      num_temes: commission.numTemes,
      dia_setmana: commission.diaSetmana,
      data_comissio: commission.dataComissio,
      avis_email: commission.avisEmail,
      data_email: commission.dataEmail,
      estat: commission.estat,
    }, {
      onConflict: 'num_acta,data_comissio',
    });

    if (error) throw error;
  },

  async updateCommission(numActa: number, dataComissio: string, updates: Partial<CommissionSummary>): Promise<void> {
    const dbUpdates: any = {};
    if (updates.numTemes !== undefined) dbUpdates.num_temes = updates.numTemes;
    if (updates.diaSetmana !== undefined) dbUpdates.dia_setmana = updates.diaSetmana;
    if (updates.dataComissio !== undefined) dbUpdates.data_comissio = updates.dataComissio;
    if (updates.avisEmail !== undefined) dbUpdates.avis_email = updates.avisEmail;
    if (updates.dataEmail !== undefined) dbUpdates.data_email = updates.dataEmail;
    if (updates.estat !== undefined) dbUpdates.estat = updates.estat;

    const { error } = await supabase
      .from('commissions')
      .update(dbUpdates)
      .eq('num_acta', numActa)
      .eq('data_comissio', dataComissio);

    if (error) throw error;
  },

  async saveCommissionDetail(detail: CommissionDetail): Promise<void> {
    const { error: detailError } = await supabase.from('commission_details').upsert({
      num_acta: detail.numActa,
      sessio: detail.sessio,
      data_actual: detail.dataActual,
      hora: detail.hora,
      estat: detail.estat,
      mitja: detail.mitja,
      expedients_count: detail.expedients.length,
    }, {
      onConflict: 'num_acta',
    });

    if (detailError) throw detailError;

    const { error: deleteError } = await supabase
      .from('expedients')
      .delete()
      .eq('num_acta', detail.numActa);

    if (deleteError) throw deleteError;

    if (detail.expedients.length > 0) {
      const expedients = detail.expedients.map((e, idx) => ({
        id: e.id,
        num_acta: detail.numActa,
        peticionari: e.peticionari,
        procediment: e.procediment,
        descripcio: e.descripcio,
        indret: e.indret,
        sentit_informe: e.sentitInforme,
        departament: e.departament,
        tecnic: e.tecnic,
        ordre: idx,
      }));

      const { error: insertError } = await supabase.from('expedients').insert(expedients);
      if (insertError) throw insertError;
    }
  },

  async updateAdminItem(table: string, id: string, name: string, email?: string): Promise<void> {
    const updates: any = { name };
    if (email !== undefined) updates.email = email;

    const { error } = await supabase.from(table).update(updates).eq('id', id);
    if (error) throw error;
  },

  async deleteAdminItem(table: string, id: string): Promise<void> {
    const { error } = await supabase.from(table).delete().eq('id', id);
    if (error) throw error;
  },

  async addAdminItem(table: string, name: string, email?: string): Promise<AdminList> {
    const insertData: any = { name };
    if (email !== undefined) insertData.email = email;

    const { data, error } = await supabase.from(table).insert(insertData).select().single();
    if (error) throw error;

    return { id: data.id, name: data.name, email: data.email || '' };
  },
};
