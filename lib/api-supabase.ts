import { supabase } from './supabase';
import { CommissionSummary, CommissionDetail, AdminData, ApplicationData, User, AdminList, Expedient } from '../types';

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

export const getApplicationData = async (): Promise<ApplicationData> => {
    const [commissionsRes, procedimentsRes, sentitInformesRes, tecnicsRes, departamentsRes, regidorsRes, usersRes] = await Promise.all([
        supabase.from('commissions').select('*').order('data_comissio', { ascending: true }),
        supabase.from('procediments').select('*'),
        supabase.from('sentit_informes').select('*'),
        supabase.from('tecnics').select('*'),
        supabase.from('departaments').select('*'),
        supabase.from('regidors').select('*'),
        supabase.from('users').select('id, name, email')
    ]);

    if (commissionsRes.error) throw commissionsRes.error;
    if (procedimentsRes.error) throw procedimentsRes.error;
    if (sentitInformesRes.error) throw sentitInformesRes.error;
    if (tecnicsRes.error) throw tecnicsRes.error;
    if (departamentsRes.error) throw departamentsRes.error;
    if (regidorsRes.error) throw regidorsRes.error;
    if (usersRes.error) throw usersRes.error;

    const commissions: CommissionSummary[] = commissionsRes.data.map((c: any) => ({
        numActa: c.num_acta,
        numTemes: c.num_temes,
        diaSetmana: c.dia_setmana,
        dataComissio: c.data_comissio,
        avisEmail: c.avis_email,
        dataEmail: c.data_email,
        estat: c.estat
    }));

    const adminData: AdminData = {
        procediments: procedimentsRes.data,
        sentitInformes: sentitInformesRes.data,
        tecnics: tecnicsRes.data,
        departaments: departamentsRes.data,
        regidors: regidorsRes.data,
        users: usersRes.data
    };

    return {
        commissions,
        commissionDetails: [],
        adminData
    };
};

export const getCommissionDetail = async (actaId: number, commissionDate: string): Promise<CommissionDetail | undefined> => {
    const { data: detailData, error: detailError } = await supabase
        .from('commission_details')
        .select('*')
        .eq('num_acta', actaId)
        .maybeSingle();

    if (detailError && detailError.code !== 'PGRST116') {
        throw detailError;
    }

    if (detailData) {
        const { data: expedientsData, error: expedientsError } = await supabase
            .from('expedients')
            .select('*')
            .eq('num_acta', actaId)
            .order('ordre', { ascending: true });

        if (expedientsError) throw expedientsError;

        const expedients: Expedient[] = expedientsData.map((e: any) => ({
            id: e.id,
            peticionari: e.peticionari,
            procediment: e.procediment,
            descripcio: e.descripcio,
            indret: e.indret,
            sentitInforme: e.sentit_informe,
            departament: e.departament,
            tecnic: e.tecnic,
            isNew: false
        }));

        return {
            numActa: detailData.num_acta,
            sessio: detailData.sessio,
            dataActual: detailData.data_actual,
            hora: detailData.hora,
            estat: detailData.estat,
            mitja: detailData.mitja,
            expedientsCount: detailData.expedients_count,
            expedients
        };
    }

    const { data: commissionData, error: commissionError } = await supabase
        .from('commissions')
        .select('*')
        .eq('num_acta', actaId)
        .eq('data_comissio', commissionDate)
        .maybeSingle();

    if (commissionError) throw commissionError;

    if (commissionData && commissionData.estat === 'Oberta') {
        return {
            numActa: actaId,
            sessio: commissionData.data_comissio,
            dataActual: new Date().toLocaleDateString('ca-ES'),
            hora: '9:00:00',
            estat: 'Oberta',
            mitja: 'Via telemàtica',
            expedientsCount: 0,
            expedients: []
        };
    }

    return undefined;
};

export const saveCommissionDetails = async (updatedDetail: CommissionDetail): Promise<CommissionDetail> => {
    const { data: existingDetail, error: checkError } = await supabase
        .from('commission_details')
        .select('id')
        .eq('num_acta', updatedDetail.numActa)
        .maybeSingle();

    if (checkError && checkError.code !== 'PGRST116') {
        throw checkError;
    }

    const detailPayload = {
        num_acta: updatedDetail.numActa,
        sessio: updatedDetail.sessio,
        data_actual: updatedDetail.dataActual,
        hora: updatedDetail.hora,
        estat: updatedDetail.estat,
        mitja: updatedDetail.mitja,
        expedients_count: updatedDetail.expedients.length,
        updated_at: new Date().toISOString()
    };

    if (existingDetail) {
        const { error: updateError } = await supabase
            .from('commission_details')
            .update(detailPayload)
            .eq('num_acta', updatedDetail.numActa);

        if (updateError) throw updateError;
    } else {
        const { error: insertError } = await supabase
            .from('commission_details')
            .insert(detailPayload);

        if (insertError) throw insertError;
    }

    const { error: deleteExpedientsError } = await supabase
        .from('expedients')
        .delete()
        .eq('num_acta', updatedDetail.numActa);

    if (deleteExpedientsError) throw deleteExpedientsError;

    if (updatedDetail.expedients.length > 0) {
        const expedientsPayload = updatedDetail.expedients.map((exp, index) => ({
            id: exp.id,
            num_acta: updatedDetail.numActa,
            peticionari: exp.peticionari,
            procediment: exp.procediment,
            descripcio: exp.descripcio,
            indret: exp.indret,
            sentit_informe: exp.sentitInforme,
            departament: exp.departament,
            tecnic: exp.tecnic,
            ordre: index,
            updated_at: new Date().toISOString()
        }));

        const { error: insertExpedientsError } = await supabase
            .from('expedients')
            .insert(expedientsPayload);

        if (insertExpedientsError) throw insertExpedientsError;
    }

    const { error: updateCommissionError } = await supabase
        .from('commissions')
        .update({
            num_temes: updatedDetail.expedients.length,
            data_comissio: updatedDetail.sessio,
            estat: updatedDetail.estat,
            dia_setmana: getDayOfWeekCatalan(updatedDetail.sessio),
            updated_at: new Date().toISOString()
        })
        .eq('num_acta', updatedDetail.numActa);

    if (updateCommissionError) throw updateCommissionError;

    return updatedDetail;
};

export const updateCommissionSummary = async (numActa: number, dataComissio: string, field: keyof CommissionSummary, value: any): Promise<CommissionSummary> => {
    const updatePayload: any = { updated_at: new Date().toISOString() };

    const fieldMap: Record<string, string> = {
        numActa: 'num_acta',
        numTemes: 'num_temes',
        diaSetmana: 'dia_setmana',
        dataComissio: 'data_comissio',
        avisEmail: 'avis_email',
        dataEmail: 'data_email',
        estat: 'estat'
    };

    updatePayload[fieldMap[field]] = value;

    if (field === 'avisEmail' && !value) {
        updatePayload.data_email = null;
    }

    const { data, error } = await supabase
        .from('commissions')
        .update(updatePayload)
        .eq('num_acta', numActa)
        .eq('data_comissio', dataComissio)
        .select()
        .single();

    if (error) throw error;

    return {
        numActa: data.num_acta,
        numTemes: data.num_temes,
        diaSetmana: data.dia_setmana,
        dataComissio: data.data_comissio,
        avisEmail: data.avis_email,
        dataEmail: data.data_email,
        estat: data.estat
    };
};

export const markCommissionAsSent = async (numActa: number, dataComissio: string): Promise<CommissionSummary> => {
    const today = new Date();
    const formattedDate = today.toLocaleDateString('ca-ES', { day: 'numeric', month: 'numeric', year: 'numeric' });

    const { data, error } = await supabase
        .from('commissions')
        .update({
            avis_email: true,
            data_email: formattedDate,
            updated_at: new Date().toISOString()
        })
        .eq('num_acta', numActa)
        .eq('data_comissio', dataComissio)
        .select()
        .single();

    if (error) throw error;

    return {
        numActa: data.num_acta,
        numTemes: data.num_temes,
        diaSetmana: data.dia_setmana,
        dataComissio: data.data_comissio,
        avisEmail: data.avis_email,
        dataEmail: data.data_email,
        estat: data.estat
    };
};

export const generateNextYearCommissions = async (): Promise<CommissionSummary[]> => {
    const { data: allCommissions, error: fetchError } = await supabase
        .from('commissions')
        .select('data_comissio');

    if (fetchError) throw fetchError;

    const commissionYears = allCommissions.map(c => parseInt(c.data_comissio.split('/')[2], 10));
    const lastYear = commissionYears.length > 0 ? Math.max(...commissionYears) : new Date().getFullYear();
    const nextYear = lastYear + 1;

    const existingNextYear = allCommissions.some(c => c.data_comissio.endsWith(`/${nextYear}`));
    if (existingNextYear) {
        throw new Error(`Les comissions per a l'any ${nextYear} ja existeixen.`);
    }

    const newCommissions: any[] = [];
    let actaCounter = 1;

    const date = new Date(nextYear, 0, 1);
    while (date.getDay() !== 3) {
        date.setDate(date.getDate() + 1);
    }

    while (date.getFullYear() === nextYear) {
        newCommissions.push({
            num_acta: actaCounter,
            num_temes: 0,
            dia_setmana: 'dimecres',
            data_comissio: date.toLocaleDateString('ca-ES', { day: 'numeric', month: 'numeric', year: 'numeric'}),
            avis_email: false,
            data_email: null,
            estat: 'Oberta',
            created_at: new Date().toISOString()
        });
        actaCounter++;
        date.setDate(date.getDate() + 14);
    }

    const { error: insertError } = await supabase
        .from('commissions')
        .insert(newCommissions);

    if (insertError) throw insertError;

    return newCommissions.map(c => ({
        numActa: c.num_acta,
        numTemes: c.num_temes,
        diaSetmana: c.dia_setmana,
        dataComissio: c.data_comissio,
        avisEmail: c.avis_email,
        dataEmail: c.data_email,
        estat: c.estat
    }));
};

export const addCommission = async (commissionData: { dataComissio: string, numActa: number }): Promise<CommissionSummary> => {
    const year = commissionData.dataComissio.split('/')[2];

    const { data: existing, error: checkError } = await supabase
        .from('commissions')
        .select('num_acta')
        .eq('num_acta', commissionData.numActa)
        .like('data_comissio', `%/${year}`)
        .maybeSingle();

    if (checkError && checkError.code !== 'PGRST116') {
        throw checkError;
    }

    if (existing) {
        throw new Error(`El número d'acta ${commissionData.numActa} ja existeix per a l'any ${year}.`);
    }

    const newCommissionPayload = {
        num_acta: commissionData.numActa,
        data_comissio: commissionData.dataComissio,
        dia_setmana: getDayOfWeekCatalan(commissionData.dataComissio),
        num_temes: 0,
        estat: 'Oberta',
        avis_email: false,
        data_email: null,
        created_at: new Date().toISOString()
    };

    const { data, error: insertError } = await supabase
        .from('commissions')
        .insert(newCommissionPayload)
        .select()
        .single();

    if (insertError) throw insertError;

    return {
        numActa: data.num_acta,
        numTemes: data.num_temes,
        diaSetmana: data.dia_setmana,
        dataComissio: data.data_comissio,
        avisEmail: data.avis_email,
        dataEmail: data.data_email,
        estat: data.estat
    };
};

export const updateCommission = async (originalNumActa: number, originalDataComissio: string, updatedData: { numActa: number, dataComissio: string }): Promise<CommissionSummary> => {
    const updatedYear = updatedData.dataComissio.split('/')[2];
    const isChangingKey = originalNumActa !== updatedData.numActa || originalDataComissio !== updatedData.dataComissio;

    if (isChangingKey) {
        const { data: conflict, error: checkError } = await supabase
            .from('commissions')
            .select('num_acta')
            .eq('num_acta', updatedData.numActa)
            .like('data_comissio', `%/${updatedYear}`)
            .maybeSingle();

        if (checkError && checkError.code !== 'PGRST116') {
            throw checkError;
        }

        if (conflict) {
            throw new Error(`Ja existeix una comissió amb el número d'acta ${updatedData.numActa} per a l'any ${updatedYear}.`);
        }
    }

    const { data, error: updateError } = await supabase
        .from('commissions')
        .update({
            num_acta: updatedData.numActa,
            data_comissio: updatedData.dataComissio,
            dia_setmana: getDayOfWeekCatalan(updatedData.dataComissio),
            updated_at: new Date().toISOString()
        })
        .eq('num_acta', originalNumActa)
        .eq('data_comissio', originalDataComissio)
        .select()
        .single();

    if (updateError) throw updateError;

    const { error: updateDetailError } = await supabase
        .from('commission_details')
        .update({
            num_acta: updatedData.numActa,
            sessio: updatedData.dataComissio,
            updated_at: new Date().toISOString()
        })
        .eq('num_acta', originalNumActa);

    if (updateDetailError && updateDetailError.code !== 'PGRST116') {
        throw updateDetailError;
    }

    const { error: updateExpedientsError } = await supabase
        .from('expedients')
        .update({
            num_acta: updatedData.numActa,
            updated_at: new Date().toISOString()
        })
        .eq('num_acta', originalNumActa);

    if (updateExpedientsError && updateExpedientsError.code !== 'PGRST116') {
        throw updateExpedientsError;
    }

    return {
        numActa: data.num_acta,
        numTemes: data.num_temes,
        diaSetmana: data.dia_setmana,
        dataComissio: data.data_comissio,
        avisEmail: data.avis_email,
        dataEmail: data.data_email,
        estat: data.estat
    };
};

export const deleteCommission = async (numActa: number, dataComissio: string): Promise<void> => {
    const { error: deleteExpedientsError } = await supabase
        .from('expedients')
        .delete()
        .eq('num_acta', numActa);

    if (deleteExpedientsError) throw deleteExpedientsError;

    const { error: deleteDetailError } = await supabase
        .from('commission_details')
        .delete()
        .eq('num_acta', numActa);

    if (deleteDetailError) throw deleteDetailError;

    const { error: deleteCommissionError } = await supabase
        .from('commissions')
        .delete()
        .eq('num_acta', numActa)
        .eq('data_comissio', dataComissio);

    if (deleteCommissionError) throw deleteCommissionError;
};

export const updateAdminItem = async (list: keyof Omit<AdminData, 'users'>, id: string, name: string, email?: string) => {
    const tableNames: Record<string, string> = {
        procediments: 'procediments',
        sentitInformes: 'sentit_informes',
        tecnics: 'tecnics',
        departaments: 'departaments',
        regidors: 'regidors'
    };

    const tableName = tableNames[list];
    const updatePayload: any = { name };
    if (email !== undefined) {
        updatePayload.email = email;
    }

    const { error } = await supabase
        .from(tableName)
        .update(updatePayload)
        .eq('id', id);

    if (error) throw error;

    return { id, name, email };
};

export const deleteAdminItem = async (list: keyof Omit<AdminData, 'users'>, id: string) => {
    const tableNames: Record<string, string> = {
        procediments: 'procediments',
        sentitInformes: 'sentit_informes',
        tecnics: 'tecnics',
        departaments: 'departaments',
        regidors: 'regidors'
    };

    const tableName = tableNames[list];

    const { error } = await supabase
        .from(tableName)
        .delete()
        .eq('id', id);

    if (error) throw error;

    return { success: true };
};

export const addAdminItem = async (list: keyof Omit<AdminData, 'users'>, name: string, email?: string) => {
    const tableNames: Record<string, string> = {
        procediments: 'procediments',
        sentitInformes: 'sentit_informes',
        tecnics: 'tecnics',
        departaments: 'departaments',
        regidors: 'regidors'
    };

    const tableName = tableNames[list];
    const insertPayload: any = { name };
    if (email !== undefined) {
        insertPayload.email = email;
    }

    const { data, error } = await supabase
        .from(tableName)
        .insert(insertPayload)
        .select()
        .single();

    if (error) throw error;

    return data;
};

export const updateUser = async (id: string, name: string, email: string, password?: string) => {
    const updatePayload: any = { name, email, updated_at: new Date().toISOString() };
    if (password) {
        updatePayload.password = password;
    }

    const { error } = await supabase
        .from('users')
        .update(updatePayload)
        .eq('id', id);

    if (error) throw error;

    return { id, name, email };
};

export const deleteUser = async (id: string) => {
    const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', id);

    if (error) throw error;

    return { success: true };
};

export const addUser = async (name: string, email: string, password?: string) => {
    const insertPayload = {
        name,
        email,
        password: password || 'changeme123',
        created_at: new Date().toISOString()
    };

    const { data, error } = await supabase
        .from('users')
        .insert(insertPayload)
        .select('id, name, email')
        .single();

    if (error) throw error;

    return data;
};

export const importUsers = async (importedUsers: User[]): Promise<User[]> => {
    const { data: existingUsers, error: fetchError } = await supabase
        .from('users')
        .select('*');

    if (fetchError) throw fetchError;

    const usersMap = new Map(existingUsers.map(u => [u.id, u]));

    const toUpdate: any[] = [];
    const toInsert: any[] = [];

    importedUsers.forEach((importedUser: User) => {
        if (importedUser.id === 'user-master') return;

        const existingUser = usersMap.get(importedUser.id);
        if (existingUser) {
            toUpdate.push({
                id: importedUser.id,
                name: importedUser.name,
                email: importedUser.email,
                updated_at: new Date().toISOString()
            });
        } else {
            toInsert.push({
                id: importedUser.id,
                name: importedUser.name,
                email: importedUser.email,
                password: 'changeme123',
                created_at: new Date().toISOString()
            });
        }
    });

    if (toUpdate.length > 0) {
        for (const user of toUpdate) {
            const { error } = await supabase
                .from('users')
                .update(user)
                .eq('id', user.id);

            if (error) throw error;
        }
    }

    if (toInsert.length > 0) {
        const { error: insertError } = await supabase
            .from('users')
            .insert(toInsert);

        if (insertError) throw insertError;
    }

    const { data: allUsers, error: finalFetchError } = await supabase
        .from('users')
        .select('id, name, email');

    if (finalFetchError) throw finalFetchError;

    return allUsers;
};
