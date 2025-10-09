import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';
import { adminData, commissions, commissionDetails } from '../data';

const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function seedDatabase() {
    console.log('Starting database seeding...');

    try {
        console.log('Seeding procediments...');
        const procedimentsData = adminData.procediments.map(p => ({ name: p.name }));
        const { error: procedimentsError } = await supabase
            .from('procediments')
            .upsert(procedimentsData, { onConflict: 'name' });
        if (procedimentsError) throw procedimentsError;

        console.log('Seeding sentit_informes...');
        const sentitInformesData = adminData.sentitInformes.map(s => ({ name: s.name }));
        const { error: sentitInformesError } = await supabase
            .from('sentit_informes')
            .upsert(sentitInformesData, { onConflict: 'name' });
        if (sentitInformesError) throw sentitInformesError;

        console.log('Seeding tecnics...');
        const { data: existingTecnics } = await supabase.from('tecnics').select('name');
        const existingTecnicsNames = new Set(existingTecnics?.map(t => t.name) || []);
        const newTecnics = adminData.tecnics
            .filter(t => !existingTecnicsNames.has(t.name))
            .map(t => ({ name: t.name, email: t.email || '' }));

        if (newTecnics.length > 0) {
            const { error: tecnicsError } = await supabase
                .from('tecnics')
                .insert(newTecnics);
            if (tecnicsError) throw tecnicsError;
        }

        console.log('Seeding departaments...');
        const departamentsData = adminData.departaments.map(d => ({ name: d.name }));
        const { error: departamentsError } = await supabase
            .from('departaments')
            .upsert(departamentsData, { onConflict: 'name' });
        if (departamentsError) throw departamentsError;

        console.log('Seeding regidors...');
        const { data: existingRegidors } = await supabase.from('regidors').select('name');
        const existingRegidorsNames = new Set(existingRegidors?.map(r => r.name) || []);
        const newRegidors = adminData.regidors
            .filter(r => !existingRegidorsNames.has(r.name))
            .map(r => ({ name: r.name, email: r.email || '' }));

        if (newRegidors.length > 0) {
            const { error: regidorsError } = await supabase
                .from('regidors')
                .insert(newRegidors);
            if (regidorsError) throw regidorsError;
        }

        console.log('Seeding users...');
        const { data: existingUsers } = await supabase.from('users').select('email');
        const existingUsersEmails = new Set(existingUsers?.map(u => u.email) || []);
        const newUsers = adminData.users
            .filter(u => !existingUsersEmails.has(u.email))
            .map(u => ({
                name: u.name,
                email: u.email,
                password: u.password || 'changeme123'
            }));

        if (newUsers.length > 0) {
            const { error: usersError } = await supabase
                .from('users')
                .insert(newUsers);
            if (usersError) throw usersError;
        }

        console.log('Seeding commissions...');
        const commissionsData = commissions.map(c => ({
            num_acta: c.numActa,
            data_comissio: c.dataComissio,
            dia_setmana: c.diaSetmana,
            num_temes: c.numTemes,
            estat: c.estat,
            avis_email: c.avisEmail,
            data_email: c.dataEmail
        }));
        const { error: commissionsError } = await supabase
            .from('commissions')
            .upsert(commissionsData, { onConflict: 'num_acta,data_comissio' });
        if (commissionsError) throw commissionsError;

        console.log('Seeding commission_details...');
        for (const detail of commissionDetails) {
            const detailPayload = {
                num_acta: detail.numActa,
                sessio: detail.sessio,
                data_actual: detail.dataActual,
                hora: detail.hora,
                estat: detail.estat,
                mitja: detail.mitja,
                expedients_count: detail.expedientsCount
            };

            const { error: detailError } = await supabase
                .from('commission_details')
                .upsert(detailPayload, { onConflict: 'num_acta' });

            if (detailError) throw detailError;

            if (detail.expedients && detail.expedients.length > 0) {
                const expedientsData = detail.expedients.map((exp, index) => ({
                    id: exp.id,
                    num_acta: detail.numActa,
                    peticionari: exp.peticionari,
                    procediment: exp.procediment,
                    descripcio: exp.descripcio,
                    indret: exp.indret,
                    sentit_informe: exp.sentitInforme,
                    departament: exp.departament,
                    tecnic: exp.tecnic,
                    ordre: index
                }));

                const { error: expedientsError } = await supabase
                    .from('expedients')
                    .upsert(expedientsData, { onConflict: 'id' });

                if (expedientsError) throw expedientsError;
            }
        }

        console.log('Database seeding completed successfully!');
    } catch (error) {
        console.error('Error seeding database:', error);
        throw error;
    }
}

seedDatabase();
