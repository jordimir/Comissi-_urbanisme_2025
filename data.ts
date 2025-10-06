import { CommissionSummary, CommissionDetail, AdminData } from './types';

export const commissions: CommissionSummary[] = [
  { numActa: 1, numTemes: 7, diaSetmana: 'dijous', dataComissio: '2/1/2025', avisEmail: true, dataEmail: '14/01/2025', estat: 'Finalitzada' },
  { numActa: 2, numTemes: 6, diaSetmana: 'dimecres', dataComissio: '15/1/2025', avisEmail: true, dataEmail: '09/01/2025', estat: 'Finalitzada' },
  { numActa: 3, numTemes: 6, diaSetmana: 'dimecres', dataComissio: '29/01/2025', avisEmail: true, dataEmail: '27/01/2025', estat: 'Finalitzada' },
  { numActa: 4, numTemes: 10, diaSetmana: 'dimecres', dataComissio: '12/02/2025', avisEmail: true, dataEmail: '04/02/2025', estat: 'Finalitzada' },
  { numActa: 5, numTemes: 4, diaSetmana: 'dimecres', dataComissio: '26/02/2025', avisEmail: true, dataEmail: '20/02/2025', estat: 'Finalitzada' },
  { numActa: 6, numTemes: 3, diaSetmana: 'dimecres', dataComissio: '12/03/2025', avisEmail: true, dataEmail: '05/03/2025', estat: 'Finalitzada' },
  { numActa: 7, numTemes: 11, diaSetmana: 'dimecres', dataComissio: '26/03/2025', avisEmail: true, dataEmail: '19/03/2025', estat: 'Finalitzada' },
  { numActa: 8, numTemes: 5, diaSetmana: 'dimecres', dataComissio: '09/04/2025', avisEmail: true, dataEmail: '07/04/2025', estat: 'Finalitzada' },
  { numActa: 9, numTemes: 14, diaSetmana: 'dimecres', dataComissio: '30/04/2025', avisEmail: true, dataEmail: '24/04/2025', estat: 'Finalitzada' },
  { numActa: 10, numTemes: 13, diaSetmana: 'dimecres', dataComissio: '14/05/2025', avisEmail: true, dataEmail: '09/05/2025', estat: 'Finalitzada' },
  { numActa: 11, numTemes: 8, diaSetmana: 'dimecres', dataComissio: '28/05/2025', avisEmail: true, dataEmail: '19/05/2025', estat: 'Finalitzada' },
  { numActa: 12, numTemes: 13, diaSetmana: 'dimecres', dataComissio: '11/6/2025', avisEmail: true, dataEmail: '02/06/2025', estat: 'Finalitzada' },
  { numActa: 13, numTemes: 11, diaSetmana: 'dimecres', dataComissio: '25/6/2025', avisEmail: true, dataEmail: '18/06/2025', estat: 'Finalitzada' },
  { numActa: 14, numTemes: 19, diaSetmana: 'dimecres', dataComissio: '9/7/2025', avisEmail: true, dataEmail: '03/07/2025', estat: 'Finalitzada' },
  { numActa: 15, numTemes: 6, diaSetmana: 'dimecres', dataComissio: '23/7/2025', avisEmail: true, dataEmail: '16/07/2025', estat: 'Finalitzada' },
  { numActa: 16, numTemes: 13, diaSetmana: 'dimecres', dataComissio: '6/8/2025', avisEmail: true, dataEmail: '28/07/2025', estat: 'Finalitzada' },
  { numActa: 17, numTemes: 11, diaSetmana: 'dimecres', dataComissio: '27/8/2025', avisEmail: true, dataEmail: '21/08/2025', estat: 'Finalitzada' },
  { numActa: 18, numTemes: 9, diaSetmana: 'dimecres', dataComissio: '10/9/2025', avisEmail: true, dataEmail: '03/09/2025', estat: 'Finalitzada' },
  { numActa: 19, numTemes: 3, diaSetmana: 'dimecres', dataComissio: '24/9/2025', avisEmail: true, dataEmail: '17/09/2025', estat: 'Finalitzada' },
  { numActa: 20, numTemes: 1, diaSetmana: 'dimecres', dataComissio: '8/10/2025', avisEmail: false, dataEmail: null, estat: 'Oberta' },
  { numActa: 21, numTemes: 0, diaSetmana: 'dimecres', dataComissio: '22/10/2025', avisEmail: false, dataEmail: null, estat: 'Oberta' },
  { numActa: 22, numTemes: 0, diaSetmana: 'dimecres', dataComissio: '5/11/2025', avisEmail: false, dataEmail: null, estat: 'Oberta' },
  { numActa: 22, numTemes: 0, diaSetmana: 'dimecres', dataComissio: '19/11/2025', avisEmail: false, dataEmail: null, estat: 'Oberta' },
  { numActa: 23, numTemes: 0, diaSetmana: 'dimecres', dataComissio: '3/12/2025', avisEmail: false, dataEmail: null, estat: 'Oberta' },
  { numActa: 24, numTemes: 0, diaSetmana: 'dimecres', dataComissio: '17/12/2025', avisEmail: false, dataEmail: null, estat: 'Oberta' },
];

export const commissionDetails: CommissionDetail[] = [
    {
        sessio: '2/1/2025',
        dataActual: '03/10/2025',
        hora: '9:00:00',
        estat: 'Finalitzada',
        mitja: 'Via telemàtica',
        numActa: 1,
        expedientsCount: 7,
        expedients: [
            { id: '3175/2024', peticionari: 'Narcís March Vidal', procediment: "Llicència d'obres menors", descripcio: "Tall d'un pi.", indret: 'Can Vergonyós.', sentitInforme: 'Favorable', departament: 'Urbanisme', tecnic: 'Claudia Carvajal' },
            { id: '2561/2023', peticionari: 'Karine Mahe', procediment: "Primera Ocupació", descripcio: "Primera Ocupació i Fiança (habitatge unifamiliar aïllat amb piscina).", indret: 'CL ESCORPION 109 Suelo', sentitInforme: 'Favorable', departament: 'Urbanisme', tecnic: 'Cristina Atalaya' },
            { id: '2670/2024', peticionari: 'Jaume Fàbregas Casabó', procediment: "Primera Ocupació", descripcio: "Primera ocupació 8 habitatges i aparcaments.", indret: 'CL BERNATS 10', sentitInforme: 'Favorable', departament: 'Urbanisme', tecnic: 'Cristina Atalaya' },
            { id: '2752/2024', peticionari: 'Hotelera Española, SA', procediment: "Comunicació prèvia tipus 1 Obra Menor", descripcio: "Remodelació interior d'un Hotel. (Hotel Costa Brava).", indret: 'Avinguda Verge de Montserrat, s/n', sentitInforme: 'Desfavorable', departament: 'Urbanisme', tecnic: 'Cristina Atalaya' },
            { id: '3460/2024', peticionari: 'Germán Gracia García', procediment: "Comunicació prèvia tipus 1 Obra Menor", descripcio: "Construcció d'una tanca metàl·lica.", indret: 'C/ Aries, 154', sentitInforme: 'Desfavorable', departament: 'Urbanisme', tecnic: 'Cristina Atalaya' },
            { id: '3031/2024', peticionari: 'Victòria Fonseca Fidalgo', procediment: "Obres Majors", descripcio: "Llicència de Segregació.", indret: 'C/ Joan Llimona, núm. 5', sentitInforme: 'Favorable', departament: 'Urbanisme', tecnic: 'Gonzalo Alcaraz' },
            { id: '406/2020', peticionari: 'Turissa Habitatges, S.L.', procediment: "Llicència d'obres menors", descripcio: "Tala i substitució d'un lledoner a l'entorn de can Pericàs.", indret: 'Can Pericas', sentitInforme: 'Favorable', departament: 'Urbanisme', tecnic: 'Jordi Couso' },
        ]
    },
     {
        sessio: '15/1/2025',
        dataActual: '03/10/2025',
        hora: '9:00:00',
        estat: 'Finalitzada',
        mitja: 'Via telemàtica',
        numActa: 2,
        expedientsCount: 6,
        expedients: [
            { id: '3002/2024', peticionari: 'José Luís Rodríguez Estévez', procediment: "Comunicació prèvia tipus 1 Obra Menor", descripcio: "Reforma terra menjador i cuina.", indret: 'Av. Joan Maragal, núm. 15 1r', sentitInforme: 'Favorable', departament: 'Urbanisme', tecnic: 'Cristina Atalaya' },
            { id: '3017/2024', peticionari: 'Susan Cleall-Hill', procediment: "Comunicació prèvia tipus 1 Obra Menor", descripcio: "Reforma taulells cuina i bany.", indret: 'Av. Costa Brava, núm. 25, Esc. B, àtic 1a', sentitInforme: 'Favorable', departament: 'Urbanisme', tecnic: 'Cristina Atalaya' },
            { id: '3071/2024', peticionari: 'Annick Bouadou Konan', procediment: "Comunicació prèvia tipus 1 Obra Menor", descripcio: "Reparació zones exteriors jardí.", indret: 'C/ Júpiter, núm. 177', sentitInforme: 'Desfavorable', departament: 'Urbanisme', tecnic: 'Cristina Atalaya' },
            { id: '3139/2024', peticionari: 'Purificación Soler Martínez', procediment: "Comunicació prèvia tipus 1 Obra Menor", descripcio: "Substitució de paviments interiors.", indret: 'C/ Socors, núm. 13', sentitInforme: 'Desfavorable', departament: 'Urbanisme', tecnic: 'Cristina Atalaya' },
            { id: '3073/2024', peticionari: 'Delfí Hernández Recasens', procediment: "Comunicació prèvia tipus 1 Obra Menor", descripcio: "Substitució de finestres.", indret: 'C/ Pintor Pau Picasso, núm. 1, Esc. F, 3-4', sentitInforme: 'Favorable', departament: 'Urbanisme', tecnic: 'Cristina Atalaya' },
            { id: '3137/2024', peticionari: 'José María Berbel Baeza', procediment: "Comunicació prèvia tipus 1 Obra Menor", descripcio: "Reforma cuina i cambra higiènica.", indret: 'C/ Acuario, núm. B19', sentitInforme: 'Desfavorable', departament: 'Urbanisme', tecnic: 'Cristina Atalaya' },
        ]
    },
    {
        sessio: '29/1/2025', dataActual: '03/10/2025', hora: '9:00:00', estat: 'Finalitzada', mitja: 'Via telemàtica', numActa: 3, expedientsCount: 6,
        expedients: [
            { id: '171/2025', peticionari: 'Núria Casacuberta Arola', procediment: "Llicència d'obres menors", descripcio: "Tala d'un arbre.", indret: 'C/ Miramar, núm. 75', sentitInforme: 'Favorable', departament: 'Urbanisme', tecnic: 'Claudia Carvajal' },
            { id: '2493/2024', peticionari: 'Inybar, SL', procediment: "Comunicació prèvia tipus 1 Obra Menor", descripcio: "Arranjaments revestiments interiors i actuació en instal·lacions existents interiors.", indret: 'C/ Sant Pere, núm. 4', sentitInforme: 'Favorable condicionat (mixte)', departament: 'Urbanisme', tecnic: 'Cristina Atalaya' },
            { id: '3418/2024', peticionari: 'Inybar Sl', procediment: "Comunicació prèvia tipus 1 Obra Menor", descripcio: "Rehabilitació i pintat de façanes, mitgeres i patis a l'edifici.", indret: 'C/ Sant Pere, núm. 4', sentitInforme: 'Favorable condicionat (mixte)', departament: 'Urbanisme', tecnic: 'Cristina Atalaya' },
            { id: '114/2025', peticionari: 'Clave Denia, SA', procediment: "Comunicació prèvia tipus 1 Obra Menor", descripcio: "Canvi d'ús i Obres de reforma del local per la implantació d'ús comercial.", indret: 'C/ Barcelona, núm. 2 esc. 1 bx 10', sentitInforme: 'Desfavorable', departament: 'Urbanisme', tecnic: 'Cristina Atalaya' },
            { id: '148/2025', peticionari: 'Comunitat de Propietaris Bon Retir', procediment: "Obres Majors", descripcio: "Rehabilitació de façanes.", indret: 'Ctra. de Llagostera, núm. 20', sentitInforme: 'Favorable', departament: 'Urbanisme', tecnic: 'Gonzalo Alcaraz' },
            { id: '109/2025', peticionari: 'Comunitat De Propietaris Dr. Fleming 17', procediment: "Obres Majors", descripcio: "Reforç estructural i reforma de cobertes d'un edifici plurifamiliar.", indret: 'C/ Fleming, núm. 17', sentitInforme: 'Favorable', departament: 'Urbanisme', tecnic: 'Gonzalo Alcaraz' }
        ]
    },
    {
        sessio: '12/2/2025', dataActual: '03/10/2025', hora: '9:00:00', estat: 'Finalitzada', mitja: 'Via telemàtica', numActa: 4, expedientsCount: 10,
        expedients: [
            { id: '2124/2024', peticionari: 'Rehabilit 2016, SL', procediment: 'Ocupació via pública', descripcio: "Ocupació Via Pública per la reparació voladissos de la façana principal de l'edifici Mar Blava.", indret: 'Av. Costa Brava, núm. 19', sentitInforme: 'Desfavorable', departament: 'Urbanisme', tecnic: 'Cristina Atalaya' },
            { id: '580/2023', peticionari: 'Igor Romanov', procediment: 'Primera Ocupació', descripcio: "Primera Ocupació d'un habitatge unifamiliar aïllat amb piscina.", indret: 'C/ Leo, núm. 92', sentitInforme: 'Desfavorable', departament: 'Urbanisme', tecnic: 'Cristina Atalaya' },
            { id: '2440/2024', peticionari: 'Xavier Carnicé Teixidor', procediment: 'Agrupació/Segregació de parcel·les/solars', descripcio: 'Segregació de la finca.', indret: 'C/ Villa Romana, núm. 4', sentitInforme: 'Favorable', departament: 'Urbanisme', tecnic: 'Gonzalo Alcaraz' },
            { id: '426/2025', peticionari: 'Mikhail Batkov', procediment: "Llicència d'obres menors", descripcio: "Tala d'un arbre a l'entorn d'un habitatge.", indret: 'C/ Escorpió, núm. 14', sentitInforme: 'Favorable', departament: 'Medi Ambient', tecnic: 'Jordi Couso' },
            { id: '216/2025', peticionari: 'Xavier Nualart Lleonart', procediment: "Llicència d'obres menors", descripcio: "Tala de 3 pins a l'entorn d'un habitatge.", indret: 'C/Francesc Coll, núm. 12, a la finca los Madroños', sentitInforme: 'Favorable', departament: 'Medi Ambient', tecnic: 'Jordi Couso' },
            { id: '3230/2024', peticionari: 'Joan Guirado Cebrian', procediment: "Llicència d'obres menors", descripcio: "Tala de 3 arbres secs a l'entorn d'un habitatge.", indret: 'C/ Tauro parcel·la B15', sentitInforme: 'Favorable', departament: 'Medi Ambient', tecnic: 'Jordi Couso' },
            { id: '156/2025', peticionari: 'Construcció i Restauració Viñas, SL', procediment: "Llicència d'obres menors", descripcio: "Llicència per a la instal·lació d'una grua torre dins de la parcel·la.", indret: 'C/ Enric Claudi Girbal, núm. 6', sentitInforme: 'Favorable condicionat (mixte)', departament: 'Urbanisme', tecnic: 'Josep Almató' },
            { id: '273/2025', peticionari: 'Tossa Toro, SC', procediment: "Llicència d'obres menors", descripcio: "Instal·lació d'una grua-torre.", indret: 'Av. Puerto Rico, núm. 30', sentitInforme: 'Favorable condicionat (mixte)', departament: 'Urbanisme', tecnic: 'Josep Almató' },
            { id: '360/2025', peticionari: 'Guillaume Henri Angel Laporte', procediment: 'Comunicació prèvia tipus 2 Obra Menor', descripcio: "Instal·lació de plaques solars fotovoltaiques a la coberta de l'habitatge unifamiliar.", indret: 'C/ Leo, núm. 163', sentitInforme: 'Favorable condicionat (mixte)', departament: 'Urbanisme', tecnic: 'Josep Almató' },
            { id: '253/2025', peticionari: 'Sebastià Tort Pujals', procediment: 'Comunicació prèvia tipus 2 Obra Menor', descripcio: "Instal·lació de plaques solars fotovoltaiques a la coberta de l'habitatge unifamiliar.", indret: 'C/ Portal, núm. 23', sentitInforme: 'Favorable condicionat (mixte)', departament: 'Urbanisme', tecnic: 'Josep Almató' },
        ]
    },
    {
        sessio: '26/2/2025', dataActual: '03/10/2025', hora: '9:00:00', estat: 'Finalitzada', mitja: 'Via telemàtica', numActa: 5, expedientsCount: 4,
        expedients: [
            { id: '2227/2023', peticionari: 'Empretossa 2000, SL', procediment: 'Obres Majors', descripcio: "Construcció d'un edifici plurifamiliar de 9 habitatges.", indret: 'Av. Puerto Rico, núm. 30', sentitInforme: 'Favorable', departament: 'Urbanisme', tecnic: 'Gonzalo Alcaraz' },
            { id: '445/2025', peticionari: 'Bisbat de Girona', procediment: "Comunicació prèvia tipus 1 Obra Menor", descripcio: "Manteniment canal pluvial a l'edifici de la Rectoria.", indret: 'C/ Pou de la Vila, núm. 6', sentitInforme: 'Favorable', departament: 'Urbanisme', tecnic: 'Gonzalo Alcaraz' },
            { id: '109/2025', peticionari: 'Comunitat de Propietaris Edifici Dr. Fleming 17', procediment: 'Obres Majors', descripcio: "Reforç estructural i reforma de cobertes d'un edifici plurifamiliar.", indret: 'C/ Fleming, núm. 17', sentitInforme: 'Desfavorable', departament: 'Urbanisme', tecnic: 'Gonzalo Alcaraz' },
            { id: '223/2025', peticionari: 'Nedgia Catalunya, S.A.', procediment: "Llicència d'obres menors", descripcio: "Obertura de rasa per ampliació de la xarxa de gas canalitzat.", indret: 'Av. Sant Ramon de Penyafort, núm. 9', sentitInforme: 'Favorable condicionat (mixte)', departament: 'Urbanisme', tecnic: 'Josep Almató' },
        ]
    },
    {
        sessio: '12/3/2025', dataActual: '03/10/2025', hora: '9:00:00', estat: 'Finalitzada', mitja: 'Via telemàtica', numActa: 6, expedientsCount: 3,
        expedients: [
            { id: '685/2025', peticionari: 'E Distribución Redes Digitales, S.L.U.', procediment: "Llicència d'obres menors", descripcio: "Obertura de rasa estesa nova linia Baixa Tensió subterrània, nova CS+CGP+ centralització a instal·lar i realitzar 2 entroncaments.", indret: 'C/ Pintor Joan Serra, núm. 7', sentitInforme: 'Favorable condicionat (mixte)', departament: 'Urbanisme', tecnic: 'Josep Almató' },
            { id: '664/2025', peticionari: 'E Distribución Redes Digitales, S.L.U.', procediment: "Llicència d'obres menors", descripcio: "Obertura de rasa per nova línia Baixa Tensió subterrània.", indret: 'C/ Leo, núm. 93', sentitInforme: 'Favorable condicionat (mixte)', departament: 'Urbanisme', tecnic: 'Josep Almató' },
            { id: '3368/2024', peticionari: 'E Distribución Redes Digitales, S.L.U.', procediment: "Llicència d'obres menors", descripcio: "Realitzar 1 entroncament 240AI/150Al per donar continuitat a la línia i retirar caixa existent.", indret: 'C/ Pou de la Vila, núm. 22', sentitInforme: 'Favorable condicionat (mixte)', departament: 'Urbanisme', tecnic: 'Josep Almató' },
        ]
    },
    {
        sessio: '26/3/2025', dataActual: '03/10/2025', hora: '9:00:00', estat: 'Finalitzada', mitja: 'Via telemàtica', numActa: 7, expedientsCount: 11,
        expedients: [
            { id: '526/2025', peticionari: 'Filip Karel Rommens', procediment: "Comunicació prèvia tipus 1 Obra Menor", descripcio: "Reforma bany i cuina.", indret: 'Edifici Berganti 21(A) Es:4 Pl:02 Pt: 01 (Urb. Cala Salions)', sentitInforme: 'Desfavorable', departament: 'Urbanisme', tecnic: 'Cristina Atalaya' },
            { id: '530/2025', peticionari: 'Jordi Ruiz Ortega', procediment: "Comunicació prèvia tipus 1 Obra Menor", descripcio: "Substitució porta garatge.", indret: 'Edifici Goleta, núm. 129 A Esc. 1a bx 14 (Urb. Cala Salions)', sentitInforme: 'Desfavorable', departament: 'Urbanisme', tecnic: 'Cristina Atalaya' },
            { id: '529/2025', peticionari: 'Jorge Blas Boix Mondejar', procediment: "Comunicació prèvia tipus 1 Obra Menor", descripcio: "Canvi instal·lació elèrica menjador i porta principal.", indret: 'Edifici Corbeta, Apto B5 (Urb. Cala Salions)', sentitInforme: 'Desfavorable', departament: 'Urbanisme', tecnic: 'Cristina Atalaya' },
            { id: '545/2025', peticionari: 'Anna Maria Navalón Lafuente', procediment: "Comunicació prèvia tipus 1 Obra Menor", descripcio: "Canvi de paviments i fusteries metàl·liques.", indret: 'Av. Mar Menuda, núm. 17', sentitInforme: 'Favorable condicionat (mixte)', departament: 'Urbanisme', tecnic: 'Cristina Atalaya' },
            { id: '558/2025', peticionari: 'Josep Maria Berbel Baeza', procediment: "Llicència d'obres menors", descripcio: "Sol·licitud de llicència urbanística per l'execució d' obres de reparacions a la cuina, al bany i a les instal·lacions elèctriques privatives de l'immoble.", indret: 'C/ Acuario, núm. B19', sentitInforme: 'Favorable condicionat (mixte)', departament: 'Urbanisme', tecnic: 'Cristina Atalaya' },
            { id: '743/2025', peticionari: 'Sarfa, SL', procediment: "Llicència d'obres menors", descripcio: "Instal·lació de cablejat de telecomunicacions per la fibra òptica de la companyia Masmobil, pel pas d' instal·lació a l'interior de l'aparcament de l'edifici de l' ajuntament de Tossa de Mar.", indret: 'Av. del Pelegrí, múm. 25', sentitInforme: 'Favorable condicionat (mixte)', departament: 'Urbanisme', tecnic: 'Josep Almató' },
            { id: '403/2025', peticionari: 'Telefónica de España, S.A.U.', procediment: "Llicència d'obres menors", descripcio: "Substitució de 2 postes de fusta per 2 de formigó armat.", indret: 'C/ Lleó, núm. 60 i c/ Venus, núm. 72', sentitInforme: 'Desfavorable', departament: 'Urbanisme', tecnic: 'Josep Almató' },
            { id: '2930/2024', peticionari: 'Montserrat Blanco Cortes', procediment: 'Obres Majors', descripcio: "Ampliació consistent en edificació auxiliar destinada a garatge en habitatge existent.", indret: 'C/ Miramar, núm. 16', sentitInforme: 'Favorable', departament: 'Urbanisme', tecnic: 'Gonzalo Alcaraz' },
            { id: '631/2023', peticionari: 'Alexey Yaskov', procediment: 'Obres Majors', descripcio: "Adequació distribució interior en planta baixa i soterrani.", indret: 'C/ Venus, núm. 85 (D)', sentitInforme: 'Favorable', departament: 'Urbanisme', tecnic: 'Gonzalo Alcaraz' },
            { id: '670/2025', peticionari: 'Construcciones y Reformas Costa Brava, S.L.', procediment: "Llicència d'obres menors", descripcio: "Tala d'un pi.", indret: 'C/ Acuario, núm. 26 A', sentitInforme: 'Favorable', departament: 'Medi Ambient', tecnic: 'Claudia Carvajal' },
            { id: '690/2025', peticionari: 'Marie Paule Hollender', procediment: "Llicència d'obres menors", descripcio: "Tala d'un pi.", indret: 'C/ Mirador del Codolar, núm. 54', sentitInforme: 'Favorable', departament: 'Medi Ambient', tecnic: 'Claudia Carvajal' }
        ]
    },
    {
        sessio: '9/4/2025', dataActual: '03/10/2025', hora: '9:00:00', estat: 'Finalitzada', mitja: 'Via telemàtica', numActa: 8, expedientsCount: 5,
        expedients: [
            { id: '323/2025', peticionari: 'Clave Denia, S.A.', procediment: 'Obres Majors', descripcio: "Reforma d'un local comercial.", indret: 'Av. Sant Ramon de Penyafort, núm. 17 Locals 9-10', sentitInforme: 'Favorable', departament: 'Urbanisme', tecnic: 'Gonzalo Alcaraz' },
            { id: '1035/2025', peticionari: 'Associació de Veins Propietaris de Cala Salions', procediment: 'Obres Majors', descripcio: "Arranjament camí existent a Cala Salions.", indret: "part de camí existent entre el carrer de dalt del tennis i el carrer sense sortida del bloc Berganti 3", sentitInforme: 'Favorable', departament: 'Urbanisme', tecnic: 'Gonzalo Alcaraz' },
            { id: '900/2025', peticionari: 'E Distribución Redes Digitales, S.L.U.', procediment: "Llicència d'obres menors", descripcio: 'Obertura de rasa per la reforma de la línia de baixa tensió subterrània existent.', indret: 'C/ Giverola', sentitInforme: 'Favorable condicionat (mixte)', departament: 'Urbanisme', tecnic: 'Josep Almató' },
            { id: '853/2025', peticionari: 'Telefónica de España, S.A.U.', procediment: "Llicència d'obres menors", descripcio: "Desplaçament d'un pal de fusta de la xarxa de telefonia.", indret: 'Av. del Pelegrí (davant Hotel Don Juan)', sentitInforme: 'Favorable condicionat (mixte)', departament: 'Urbanisme', tecnic: 'Josep Almató' },
            { id: '956/2025', peticionari: 'Maria del Carme Pujol Sabater', procediment: "Llicència d'obres menors", descripcio: "Tala d'una alzina surera seca.", indret: 'C/ del Pi, núm. 2', sentitInforme: 'Favorable', departament: 'Medi Ambient', tecnic: 'Jordi Couso' }
        ]
    },
    {
        sessio: '30/04/2025', dataActual: '03/10/2025', hora: '9:00:00', estat: 'Finalitzada', mitja: 'Via telemàtica', numActa: 9, expedientsCount: 14,
        expedients: [
            { id: '1215/2025', peticionari: 'Joan Rigau i Sala', procediment: "Llicència d'obres menors", descripcio: "Reparació de coberta.", indret: 'C/ de la Vila, 9', sentitInforme: 'Favorable', departament: 'Urbanisme', tecnic: 'Cristina Atalaya' },
            { id: '1220/2025', peticionari: 'Maria Soler Gran', procediment: "Comunicació prèvia tipus 1 Obra Menor", descripcio: "Pintura de façana.", indret: 'Plaça de l\'Església, 5', sentitInforme: 'Favorable', departament: 'Urbanisme', tecnic: 'Cristina Atalaya' },
            { id: '987/2025', peticionari: 'Construccions Tossa SL', procediment: "Obres Majors", descripcio: "Construcció d'habitatge unifamiliar.", indret: 'C/ Lope Mateo, 25', sentitInforme: 'Favorable', departament: 'Urbanisme', tecnic: 'Gonzalo Alcaraz' },
            { id: '1245/2025', peticionari: 'Hotel Diana', procediment: "Ocupació via pública", descripcio: "Instal·lació de terrassa.", indret: 'Passeig Marítim, 12', sentitInforme: 'Favorable condicionat (mixte)', departament: 'Urbanisme', tecnic: 'Josep Almató' },
            { id: '1105/2025', peticionari: 'Carles Puig Camps', procediment: "Primera Ocupació", descripcio: "Primera ocupació d'habitatge reformat.", indret: 'C/ Giverola, 18', sentitInforme: 'Favorable', departament: 'Urbanisme', tecnic: 'Cristina Atalaya' },
            { id: '1301/2025', peticionari: 'Laura Vicens', procediment: "Llicència d'obres menors", descripcio: "Tala de dos pins per risc de caiguda.", indret: 'C/ Martossa, 33', sentitInforme: 'Favorable', departament: 'Medi Ambient', tecnic: 'Jordi Couso' },
            { id: '1302/2025', peticionari: 'Antoni Bruguera', procediment: "Comunicació prèvia tipus 2 Obra Menor", descripcio: "Instal·lació de plaques solars.", indret: 'C/ Pola, 2', sentitInforme: 'Favorable condicionat (mixte)', departament: 'Urbanisme', tecnic: 'Josep Almató' },
            { id: '1310/2025', peticionari: 'Supermercat Condis', procediment: "Comunicació prèvia tipus 1 Obra Menor", descripcio: "Reforma interior de local comercial.", indret: 'Av. Ferran Agulló, 7', sentitInforme: 'Favorable', departament: 'Urbanisme', tecnic: 'Cristina Atalaya' },
            { id: '1315/2025', peticionari: 'Jordi Esteva', procediment: "Llicència d'obres menors", descripcio: "Construcció de piscina.", indret: 'Urb. Santa Maria de Llorell, 45', sentitInforme: 'Requeriment', departament: 'Urbanisme', tecnic: 'Gonzalo Alcaraz' },
            { id: '1322/2025', peticionari: 'Marta Casals', procediment: "Agrupació/Segregació de parcel·les/solars", descripcio: "Segregació de finca rústica.", indret: 'Polígon 5, Parcel·la 112', sentitInforme: 'Desfavorable', departament: 'Urbanisme', tecnic: 'Gonzalo Alcaraz' },
            { id: '1330/2025', peticionari: 'Restaurant Can Pini', procediment: "Llicència d'obres menors", descripcio: "Instal·lació de tendal.", indret: 'C/ Portal, 10', sentitInforme: 'Favorable', departament: 'Urbanisme', tecnic: 'Cristina Atalaya' },
            { id: '1340/2025', peticionari: 'Albert Bosch', procediment: "Llicència d'obres menors", descripcio: "Substitució de tancaments exteriors.", indret: 'C/ Sant Telm, 3', sentitInforme: 'Favorable', departament: 'Urbanisme', tecnic: 'Cristina Atalaya' },
            { id: '1351/2025', peticionari: 'Comunitat Propietaris Mar Menuda', procediment: "Obres Majors", descripcio: "Rehabilitació de façana.", indret: 'Av. Mar Menuda, 21', sentitInforme: 'Favorable', departament: 'Urbanisme', tecnic: 'Gonzalo Alcaraz' },
            { id: '1355/2025', peticionari: 'Sònia Ferrer', procediment: "Llicència d'obres menors", descripcio: "Tala d'una alzina malalta.", indret: 'C/ Es Codolar, 14', sentitInforme: 'Favorable', departament: 'Medi Ambient', tecnic: 'Jordi Couso' }
        ]
    },
    {
        sessio: '14/05/2025', dataActual: '03/10/2025', hora: '9:00:00', estat: 'Finalitzada', mitja: 'Via telemàtica', numActa: 10, expedientsCount: 13,
        expedients: [
            { id: '1401/2025', peticionari: 'Camping Tossa', procediment: "Obres Majors", descripcio: "Ampliació de zona de serveis.", indret: 'Ctra. Llagostera km 10', sentitInforme: 'Favorable condicionat (mixte)', departament: 'Urbanisme', tecnic: 'Gonzalo Alcaraz' },
            { id: '1410/2025', peticionari: 'Pere Vila', procediment: "Llicència d'obres menors", descripcio: "Construcció de barbacoa d\'obra.", indret: 'C/ del Sol, 19', sentitInforme: 'Favorable', departament: 'Urbanisme', tecnic: 'Cristina Atalaya' },
            { id: '1412/2025', peticionari: 'Anna Grau', procediment: "Comunicació prèvia tipus 1 Obra Menor", descripcio: "Reforma de bany.", indret: 'Plaça d\'Espanya, 3', sentitInforme: 'Favorable', departament: 'Urbanisme', tecnic: 'Cristina Atalaya' },
            { id: '1420/2025', peticionari: 'Telefónica de España, S.A.U.', procediment: "Llicència d'obres menors", descripcio: "Estesa de fibra òptica.", indret: 'C/ la Guàrdia, 1-15', sentitInforme: 'Favorable condicionat (mixte)', departament: 'Urbanisme', tecnic: 'Josep Almató' },
            { id: '1425/2025', peticionari: 'Isabel Martí', procediment: "Llicència d'obres menors", descripcio: "Tala d'eucaliptus.", indret: 'C/ Salions, 58', sentitInforme: 'Favorable', departament: 'Medi Ambient', tecnic: 'Claudia Carvajal' },
            { id: '1433/2025', peticionari: 'Promocions Litorals SA', procediment: "Primera Ocupació", descripcio: "Primera ocupació de 4 apartaments.", indret: 'Av. Catalunya, 30', sentitInforme: 'Favorable', departament: 'Urbanisme', tecnic: 'Cristina Atalaya' },
            { id: '1440/2025', peticionari: 'Lluís Corominas', procediment: "Comunicació prèvia tipus 1 Obra Menor", descripcio: "Impermeabilització de terrat.", indret: 'C/ Nou, 22', sentitInforme: 'Favorable', departament: 'Urbanisme', tecnic: 'Cristina Atalaya' },
            { id: '1451/2025', peticionari: 'David Mas', procediment: "Comunicació prèvia tipus 2 Obra Menor", descripcio: "Instal·lació de pèrgola.", indret: 'C/ de la Pau, 8', sentitInforme: 'Desfavorable', departament: 'Urbanisme', tecnic: 'Cristina Atalaya' },
            { id: '1460/2025', peticionari: 'Robert Van der Meer', procediment: "Obres Majors", descripcio: "Rehabilitació integral d'habitatge.", indret: 'C/ Pescadors, 4', sentitInforme: 'Favorable', departament: 'Urbanisme', tecnic: 'Gonzalo Alcaraz' },
            { id: '1475/2025', peticionari: 'E Distribución Redes Digitales, S.L.U.', procediment: "Llicència d'obres menors", descripcio: "Soterrament de línia elèctrica.", indret: 'C/ del Carme', sentitInforme: 'Favorable condicionat (mixte)', departament: 'Urbanisme', tecnic: 'Josep Almató' },
            { id: '1480/2025', peticionari: 'Mireia Fuster', procediment: "Llicència d'obres menors", descripcio: "Tala de pi per afectació a tanca.", indret: 'C/ dels Pins, 11', sentitInforme: 'Favorable', departament: 'Medi Ambient', tecnic: 'Jordi Couso' },
            { id: '1488/2025', peticionari: 'Francesc Xavier Coll', procediment: "Comunicació prèvia tipus 1 Obra Menor", descripcio: "Substitució de paviment exterior.", indret: 'C/ Tarull, 15', sentitInforme: 'Favorable', departament: 'Urbanisme', tecnic: 'Cristina Atalaya' },
            { id: '1492/2025', peticionari: 'Helena Costa', procediment: "Primera Ocupació", descripcio: "Fi d'obra i primera ocupació.", indret: 'C/ Acuario, B-22', sentitInforme: 'Requeriment', departament: 'Urbanisme', tecnic: 'Cristina Atalaya' }
        ]
    },
    {
        sessio: '28/05/2025', dataActual: '03/10/2025', hora: '9:00:00', estat: 'Finalitzada', mitja: 'Via telemàtica', numActa: 11, expedientsCount: 8,
        expedients: [
            { id: '1503/2025', peticionari: 'Grup Inversor Tossa Mar', procediment: 'Obres Majors', descripcio: "Construcció d'edifici plurifamiliar de 6 habitatges.", indret: 'Av. Costa Brava, 45', sentitInforme: 'Favorable', departament: 'Urbanisme', tecnic: 'Gonzalo Alcaraz' },
            { id: '1512/2025', peticionari: 'Caterina Pons', procediment: "Comunicació prèvia tipus 1 Obra Menor", descripcio: "Reforma de cuina i bany.", indret: 'C/ Sant Antoni, 18', sentitInforme: 'Favorable', departament: 'Urbanisme', tecnic: 'Cristina Atalaya' },
            { id: '1520/2025', peticionari: 'Marc Batlle', procediment: "Llicència d'obres menors", descripcio: "Instal·lació d'aire condicionat amb unitat exterior.", indret: 'C/ Enric Granados, 1', sentitInforme: 'Desfavorable', departament: 'Urbanisme', tecnic: 'Cristina Atalaya' },
            { id: '1528/2025', peticionari: 'Bar El Pirata', procediment: "Ocupació via pública", descripcio: "Renovació llicència de terrassa.", indret: 'Carrer del Mar, 7', sentitInforme: 'Favorable', departament: 'Urbanisme', tecnic: 'Josep Almató' },
            { id: '1535/2025', peticionari: 'Pau Riera', procediment: "Llicència d'obres menors", descripcio: "Tala d'una palmera afectada per morrut roig.", indret: 'C/ dels Ametllers, 9', sentitInforme: 'Favorable', departament: 'Medi Ambient', tecnic: 'Jordi Couso' },
            { id: '1541/2025', peticionari: 'Aïda Jiménez', procediment: "Comunicació prèvia tipus 2 Obra Menor", descripcio: "Instal·lació de plaques solars.", indret: 'C/ Miramar, 88', sentitInforme: 'Favorable condicionat (mixte)', departament: 'Urbanisme', tecnic: 'Josep Almató' },
            { id: '1550/2025', peticionari: 'Jordi Pujolàs', procediment: "Llicència d'obres menors", descripcio: "Reparació de filtracions en garatge comunitari.", indret: 'C/ Victor Català, 4', sentitInforme: 'Favorable', departament: 'Urbanisme', tecnic: 'Cristina Atalaya' },
            { id: '1562/2025', peticionari: 'Immobiliària Tossenca', procediment: 'Agrupació/Segregació de parcel·les/solars', descripcio: 'Agrupació de dues parcel·les.', indret: 'C/ Aries 120-122', sentitInforme: 'Favorable', departament: 'Urbanisme', tecnic: 'Gonzalo Alcaraz' }
        ]
    },
    {
        sessio: '11/6/2025', dataActual: '03/10/2025', hora: '9:00:00', estat: 'Finalitzada', mitja: 'Via telemàtica', numActa: 12, expedientsCount: 13,
        expedients: [
            { id: '1601/2025', peticionari: 'Esteve Font', procediment: "Llicència d'obres menors", descripcio: "Construcció de mur de contenció.", indret: 'C/ Montclar, 14', sentitInforme: 'Requeriment', departament: 'Urbanisme', tecnic: 'Gonzalo Alcaraz' },
            { id: '1605/2025', peticionari: 'Clara Ponsatí', procediment: "Comunicació prèvia tipus 1 Obra Menor", descripcio: "Substitució de banyera per plat de dutxa.", indret: 'Av. Pelegrí, 50', sentitInforme: 'Favorable', departament: 'Urbanisme', tecnic: 'Cristina Atalaya' },
            { id: '1610/2025', peticionari: 'Martí Serra', procediment: "Obres Majors", descripcio: "Canvi de coberta i reforç estructural.", indret: 'C/ Sant Miquel, 8', sentitInforme: 'Favorable', departament: 'Urbanisme', tecnic: 'Gonzalo Alcaraz' },
            { id: '1618/2025', peticionari: 'Botiga de records La Muralla', procediment: "Llicència d'obres menors", descripcio: "Canvi de rètol exterior.", indret: 'Plaça de les Armes, 1', sentitInforme: 'Favorable condicionat (mixte)', departament: 'Urbanisme', tecnic: 'Cristina Atalaya' },
            { id: '1625/2025', peticionari: 'Josep Lluís Trapero', procediment: "Llicència d'obres menors", descripcio: "Tala de 3 pollancres.", indret: 'Riera de Tossa, s/n', sentitInforme: 'Favorable', departament: 'Medi Ambient', tecnic: 'Jordi Couso' },
            { id: '1630/2025', peticionari: 'Eulàlia Reguant', procediment: "Primera Ocupació", descripcio: "Primera ocupació habitatge unifamiliar.", indret: 'C/ Leo, 180', sentitInforme: 'Favorable', departament: 'Urbanisme', tecnic: 'Cristina Atalaya' },
            { id: '1633/2025', peticionari: 'Vodafone España, S.A.U.', procediment: "Llicència d'obres menors", descripcio: "Instal·lació antena de telefonia.", indret: 'Turó de Can Ganga', sentitInforme: 'Desfavorable', departament: 'Urbanisme', tecnic: 'Josep Almató' },
            { id: '1640/2025', peticionari: 'Dolors Sabater', procediment: "Comunicació prèvia tipus 1 Obra Menor", descripcio: "Pintura de façana interior.", indret: 'C/ Socors, 25', sentitInforme: 'Favorable', departament: 'Urbanisme', tecnic: 'Cristina Atalaya' },
            { id: '1645/2025', peticionari: 'Jaume Asens', procediment: "Comunicació prèvia tipus 2 Obra Menor", descripcio: "Instal·lació de pèrgola de fusta.", indret: 'C/ Càncer, 12', sentitInforme: 'Favorable', departament: 'Urbanisme', tecnic: 'Cristina Atalaya' },
            { id: '1651/2025', peticionari: 'Comunitat de Propietaris Ancora', procediment: "Obres Majors", descripcio: "Instal·lació d'ascensor.", indret: 'Av. Palma, 14', sentitInforme: 'Favorable', departament: 'Urbanisme', tecnic: 'Gonzalo Alcaraz' },
            { id: '1658/2025', peticionari: 'Quim Torra', procediment: "Llicència d'obres menors", descripcio: "Tancament de parcel·la.", indret: 'C/ de la Llum, 1', sentitInforme: 'Favorable', departament: 'Urbanisme', tecnic: 'Cristina Atalaya' },
            { id: '1662/2025', peticionari: 'Pere Aragonès', procediment: "Comunicació prèvia tipus 1 Obra Menor", descripcio: "Reparació de goteres.", indret: 'C/ Estolt, 9', sentitInforme: 'Favorable', departament: 'Urbanisme', tecnic: 'Cristina Atalaya' },
            { id: '1670/2025', peticionari: 'Carles Riera', procediment: "Llicència d'obres menors", descripcio: "Tala d'un cedre.", indret: 'C/ Tortuga, 2', sentitInforme: 'Favorable', departament: 'Medi Ambient', tecnic: 'Claudia Carvajal' }
        ]
    },
    {
        sessio: '25/6/2025', dataActual: '03/10/2025', hora: '9:00:00', estat: 'Finalitzada', mitja: 'Via telemàtica', numActa: 13, expedientsCount: 11,
        expedients: [
            { id: '1705/2025', peticionari: 'Laura Borràs', procediment: 'Obres Majors', descripcio: 'Reforma integral i ampliació d\'habitatge.', indret: 'C/ del Castell, 1', sentitInforme: 'Favorable', departament: 'Urbanisme', tecnic: 'Gonzalo Alcaraz' },
            { id: '1711/2025', peticionari: 'Jordi Turull', procediment: 'Comunicació prèvia tipus 1 Obra Menor', descripcio: 'Reparació de paviment de cuina.', indret: 'C/ del Pi, 5', sentitInforme: 'Favorable', departament: 'Urbanisme', tecnic: 'Cristina Atalaya' },
            { id: '1718/2025', peticionari: 'Josep Rull', procediment: 'Llicència d\'obres menors', descripcio: 'Construcció de pèrgola i barbacoa.', indret: 'Urb. Pola-Giverola, 115', sentitInforme: 'Requeriment', departament: 'Urbanisme', tecnic: 'Cristina Atalaya' },
            { id: '1725/2025', peticionari: 'Raül Romeva', procediment: 'Llicència d\'obres menors', descripcio: 'Tala de figuera.', indret: 'C/ de les Flors, 20', sentitInforme: 'Favorable', departament: 'Medi Ambient', tecnic: 'Jordi Couso' },
            { id: '1730/2025', peticionari: 'Joaquim Forn', procediment: 'Comunicació prèvia tipus 2 Obra Menor', descripcio: 'Instal·lació de plaques solars.', indret: 'C/ de la Font, 12', sentitInforme: 'Favorable condicionat (mixte)', departament: 'Urbanisme', tecnic: 'Josep Almató' },
            { id: '1736/2025', peticionari: 'Dolors Bassa', procediment: 'Primera Ocupació', descripcio: 'Primera ocupació de reforma i ampliació.', indret: 'C/ Bona Vista, 24', sentitInforme: 'Favorable', departament: 'Urbanisme', tecnic: 'Cristina Atalaya' },
            { id: '1742/2025', peticionari: 'Meritxell Serret', procediment: 'Llicència d\'obres menors', descripcio: 'Sondeig per a pou d\'aigua.', indret: 'Finca Can Truges', sentitInforme: 'Posar en consideració', departament: 'Medi Ambient', tecnic: 'Jordi Couso' },
            { id: '1750/2025', peticionari: 'Antoni Comín', procediment: 'Comunicació prèvia tipus 1 Obra Menor', descripcio: 'Substitució de finestres de fusta.', indret: 'C/ de la Roqueta, 3', sentitInforme: 'Favorable', departament: 'Urbanisme', tecnic: 'Cristina Atalaya' },
            { id: '1755/2025', peticionari: 'Lluís Puig', procediment: 'Agrupació/Segregació de parcel·les/solars', descripcio: 'Segregació de finca urbana.', indret: 'Av. de la Palma, 44', sentitInforme: 'Favorable', departament: 'Urbanisme', tecnic: 'Gonzalo Alcaraz' },
            { id: '1761/2025', peticionari: 'Clara Ponsatí', procediment: 'Ocupació via pública', descripcio: 'Instal·lació de bastida per obres.', indret: 'C/ del Mar, 19', sentitInforme: 'Favorable', departament: 'Urbanisme', tecnic: 'Josep Almató' },
            { id: '1770/2025', peticionari: 'Carles Puigdemont', procediment: 'Obres Majors', descripcio: 'Enderroc i nova construcció d\'habitatge.', indret: 'C/ de l\'Aigua, 1', sentitInforme: 'Desfavorable', departament: 'Urbanisme', tecnic: 'Gonzalo Alcaraz' }
        ]
    },
    {
        sessio: '9/7/2025', dataActual: '03/10/2025', hora: '9:00:00', estat: 'Finalitzada', mitja: 'Via telemàtica', numActa: 14, expedientsCount: 19,
        expedients: [
            { id: '1801/2025', peticionari: 'Empresa Aigua Tossa SL', procediment: "Llicència d'obres menors", descripcio: 'Renovació de la xarxa de subministrament.', indret: 'C/ Sant Pere', sentitInforme: 'Favorable condicionat (mixte)', departament: 'Urbanisme', tecnic: 'Josep Almató' },
            { id: '1805/2025', peticionari: 'Maria Garcia', procediment: "Comunicació prèvia tipus 1 Obra Menor", descripcio: 'Reforma de bany.', indret: 'C/ Major, 32', sentitInforme: 'Favorable', departament: 'Urbanisme', tecnic: 'Cristina Atalaya' },
            { id: '1810/2025', peticionari: 'Joan Ferrer', procediment: "Obres Majors", descripcio: "Construcció d'un garatge subterrani.", indret: 'C/ de la Platja, 5', sentitInforme: 'Favorable', departament: 'Urbanisme', tecnic: 'Gonzalo Alcaraz' },
            { id: '1815/2025', peticionari: 'Hotel Windsor', procediment: "Obres Majors", descripcio: "Reforma de la recepció i zones comunes.", indret: 'C/ de la Pau, 25', sentitInforme: 'Favorable', departament: 'Urbanisme', tecnic: 'Gonzalo Alcaraz' },
            { id: '1820/2025', peticionari: 'Antoni Ribas', procediment: "Llicència d'obres menors", descripcio: "Tala d'un pi sec.", indret: 'Urb. Cala Llevadó, 78', sentitInforme: 'Favorable', departament: 'Medi Ambient', tecnic: 'Claudia Carvajal' },
            { id: '1822/2025', peticionari: 'Eva Martorell', procediment: "Primera Ocupació", descripcio: "Primera ocupació de piscina.", indret: 'C/ Venus, 102', sentitInforme: 'Favorable', departament: 'Urbanisme', tecnic: 'Cristina Atalaya' },
            { id: '1828/2025', peticionari: 'Forn de Pa Can Comas', procediment: "Comunicació prèvia tipus 1 Obra Menor", descripcio: "Canvi del paviment del local.", indret: 'C/ del Pou, 4', sentitInforme: 'Favorable', departament: 'Urbanisme', tecnic: 'Cristina Atalaya' },
            { id: '1831/2025', peticionari: 'Xavier Bosch', procediment: "Comunicació prèvia tipus 2 Obra Menor", descripcio: "Instal·lació de tendal a la terrassa.", indret: 'Passeig del Mar, 30', sentitInforme: 'Favorable', departament: 'Urbanisme', tecnic: 'Cristina Atalaya' },
            { id: '1835/2025', peticionari: 'Albert Danés', procediment: "Llicència d'obres menors", descripcio: "Reparació de coberta.", indret: 'C/ Sant Raimon de Penyafort, 11', sentitInforme: 'Favorable', departament: 'Urbanisme', tecnic: 'Cristina Atalaya' },
            { id: '1840/2025', peticionari: 'Sílvia Roca', procediment: "Agrupació/Segregació de parcel·les/solars", descripcio: "Declaració d'obra nova i divisió horitzontal.", indret: 'C/ Giverola, 21', sentitInforme: 'Favorable', departament: 'Urbanisme', tecnic: 'Gonzalo Alcaraz' },
            { id: '1844/2025', peticionari: 'Jordi Armengol', procediment: "Ocupació via pública", descripcio: "Contenidor de runes.", indret: 'C/ Barcelona, 9', sentitInforme: 'Favorable', departament: 'Urbanisme', tecnic: 'Josep Almató' },
            { id: '1850/2025', peticionari: 'Miquel Sàmper', procediment: "Llicència d'obres menors", descripcio: "Tala de dos pollancres.", indret: 'Riera de Tossa, marge dret', sentitInforme: 'Favorable', departament: 'Medi Ambient', tecnic: 'Jordi Couso' },
            { id: '1855/2025', peticionari: 'Constructora del Mar SL', procediment: "Primera Ocupació", descripcio: "Primera Ocupació edifici de 12 habitatges.", indret: 'Av. Puerto Rico, 15', sentitInforme: 'Requeriment', departament: 'Urbanisme', tecnic: 'Cristina Atalaya' },
            { id: '1860/2025', peticionari: 'Núria de Gispert', procediment: "Comunicació prèvia tipus 1 Obra Menor", descripcio: "Canvi de cuina.", indret: 'C/ Codolar, 3', sentitInforme: 'Favorable', departament: 'Urbanisme', tecnic: 'Cristina Atalaya' },
            { id: '1863/2025', peticionari: 'Carme Forcadell', procediment: "Obres Majors", descripcio: "Rehabilitació de masia.", indret: 'Can Kars', sentitInforme: 'Favorable', departament: 'Urbanisme', tecnic: 'Gonzalo Alcaraz' },
            { id: '1869/2025', peticionari: 'Roger Torrent', procediment: "Comunicació prèvia tipus 2 Obra Menor", descripcio: "Instal·lació de plaques solars.", indret: 'C/ de la Mare de Déu dels Socors, 55', sentitInforme: 'Favorable condicionat (mixte)', departament: 'Urbanisme', tecnic: 'Josep Almató' },
            { id: '1875/2025', peticionari: 'Ernest Maragall', procediment: "Llicència d'obres menors", descripcio: "Construcció de piscina.", indret: 'C/ de l\'Olivera, 1', sentitInforme: 'Favorable', departament: 'Urbanisme', tecnic: 'Gonzalo Alcaraz' },
            { id: '1881/2025', peticionari: 'Jaume Collboni', procediment: "Llicència d'obres menors", descripcio: "Tala d'una alzina.", indret: 'Camí de Ronda, s/n', sentitInforme: 'Desfavorable', departament: 'Medi Ambient', tecnic: 'Jordi Couso' },
            { id: '1890/2025', peticionari: 'Ada Colau', procediment: "Ocupació via pública", descripcio: "Filmació d'un anunci.", indret: 'Platja Gran', sentitInforme: 'Favorable condicionat (mixte)', departament: 'Urbanisme', tecnic: 'Josep Almató' }
        ]
    },
    {
        sessio: '23/7/2025', dataActual: '03/10/2025', hora: '9:00:00', estat: 'Finalitzada', mitja: 'Via telemàtica', numActa: 15, expedientsCount: 6,
        expedients: [
            { id: '1902/2025', peticionari: 'Xavier Trias', procediment: "Comunicació prèvia tipus 1 Obra Menor", descripcio: "Reparació de teulada.", indret: 'C/ de l\'Església, 17', sentitInforme: 'Favorable', departament: 'Urbanisme', tecnic: 'Cristina Atalaya' },
            { id: '1910/2025', peticionari: 'Jordi Hereu', procediment: "Llicència d'obres menors", descripcio: "Tala de 2 pins.", indret: 'C/ del Vent, 8', sentitInforme: 'Favorable', departament: 'Medi Ambient', tecnic: 'Claudia Carvajal' },
            { id: '1915/2025', peticionari: 'Joan Clos', procediment: "Obres Majors", descripcio: "Reforç estructural d'edifici.", indret: 'C/ del Peix, 4', sentitInforme: 'Favorable', departament: 'Urbanisme', tecnic: 'Gonzalo Alcaraz' },
            { id: '1921/2025', peticionari: 'Pasqual Maragall', procediment: "Comunicació prèvia tipus 2 Obra Menor", descripcio: "Instal·lació de pèrgola al jardí.", indret: 'C/ de la Ginesta, 30', sentitInforme: 'Favorable', departament: 'Urbanisme', tecnic: 'Cristina Atalaya' },
            { id: '1930/2025', peticionari: 'Narcís Serra', procediment: "Primera Ocupació", descripcio: "Final d'obra d'habitatge unifamiliar.", indret: 'C/ Mart, 3', sentitInforme: 'Favorable', departament: 'Urbanisme', tecnic: 'Cristina Atalaya' },
            { id: '1938/2025', peticionari: 'Jordi Pujol', procediment: "Llicència d'obres menors", descripcio: "Instal·lació de tanca metàl·lica.", indret: 'C/ Júpiter, 200', sentitInforme: 'Desfavorable', departament: 'Urbanisme', tecnic: 'Cristina Atalaya' }
        ]
    },
    {
        sessio: '6/8/2025', dataActual: '03/10/2025', hora: '9:00:00', estat: 'Finalitzada', mitja: 'Via telemàtica', numActa: 16, expedientsCount: 13,
        expedients: [
            { id: '2001/2025', peticionari: 'Josep Tarradellas', procediment: "Obres Majors", descripcio: "Construcció d'aparthotel.", indret: 'Solar Av. Catalunya', sentitInforme: 'Favorable condicionat (mixte)', departament: 'Urbanisme', tecnic: 'Gonzalo Alcaraz' },
            { id: '2008/2025', peticionari: 'Francesc Macià', procediment: "Llicència d'obres menors", descripcio: "Tala de 5 pollancres.", indret: 'Riera de Tossa', sentitInforme: 'Favorable', departament: 'Medi Ambient', tecnic: 'Jordi Couso' },
            { id: '2015/2025', peticionari: 'Lluís Companys', procediment: "Comunicació prèvia tipus 1 Obra Menor", descripcio: "Reparació de façana.", indret: 'C/ de la Llibertat, 1', sentitInforme: 'Favorable', departament: 'Urbanisme', tecnic: 'Cristina Atalaya' },
            { id: '2020/2025', peticionari: 'Enric Prat de la Riba', procediment: "Llicència d'obres menors", descripcio: "Instal·lació de grua torre.", indret: 'C/ del Progrés, 10', sentitInforme: 'Favorable', departament: 'Urbanisme', tecnic: 'Josep Almató' },
            { id: '2025/2025', peticionari: 'Valentí Almirall', procediment: "Comunicació prèvia tipus 2 Obra Menor", descripcio: "Instal·lació de plaques solars.", indret: 'C/ de la Indústria, 22', sentitInforme: 'Favorable condicionat (mixte)', departament: 'Urbanisme', tecnic: 'Josep Almató' },
            { id: '2030/2025', peticionari: 'Joan Maragall', procediment: "Primera Ocupació", descripcio: "Final d'obra de rehabilitació.", indret: 'Passeig Poesia, 10', sentitInforme: 'Favorable', departament: 'Urbanisme', tecnic: 'Cristina Atalaya' },
            { id: '2033/2025', peticionari: 'Jacint Verdaguer', procediment: "Agrupació/Segregació de parcel·les/solars", descripcio: "Segregació de finca.", indret: 'Canigó, 2', sentitInforme: 'Favorable', departament: 'Urbanisme', tecnic: 'Gonzalo Alcaraz' },
            { id: '2040/2025', peticionari: 'Pompeu Fabra', procediment: "Comunicació prèvia tipus 1 Obra Menor", descripcio: "Unificació de dos locals comercials.", indret: 'C/ de la Gramàtica, 5', sentitInforme: 'Favorable', departament: 'Urbanisme', tecnic: 'Cristina Atalaya' },
            { id: '2045/2025', peticionari: 'Antoni Gaudí', procediment: "Obres Majors", descripcio: "Construcció d'habitatge unifamiliar singular.", indret: 'Turó del drac', sentitInforme: 'Favorable', departament: 'Urbanisme', tecnic: 'Gonzalo Alcaraz' },
            { id: '2051/2025', peticionari: 'Lluís Domènech i Montaner', procediment: "Llicència d'obres menors", descripcio: "Restauració de mosaics.", indret: 'Palau de la Música, s/n', sentitInforme: 'Favorable', departament: 'Urbanisme', tecnic: 'Cristina Atalaya' },
            { id: '2058/2025', peticionari: 'Josep Puig i Cadafalch', procediment: "Ocupació via pública", descripcio: "Instal·lació de bastida.", indret: 'Casa de les Punxes, s/n', sentitInforme: 'Favorable', departament: 'Urbanisme', tecnic: 'Josep Almató' },
            { id: '2062/2025', peticionari: 'Salvador Dalí', procediment: "Llicència d'obres menors", descripcio: "Instal·lació d'escultura a jardí.", indret: 'Teatre-Museu, Figueres', sentitInforme: 'Posar en consideració', departament: 'Urbanisme', tecnic: 'Gonzalo Alcaraz' },
            { id: '2070/2025', peticionari: 'Joan Miró', procediment: "Llicència d'obres menors", descripcio: "Tala d'un pi afectat per processionària.", indret: 'Fundació Miró, Montjuïc', sentitInforme: 'Favorable', departament: 'Medi Ambient', tecnic: 'Claudia Carvajal' }
        ]
    },
    {
        sessio: '27/8/2025', dataActual: '03/10/2025', hora: '9:00:00', estat: 'Finalitzada', mitja: 'Via telemàtica', numActa: 17, expedientsCount: 11,
        expedients: [
            { id: '2101/2025', peticionari: 'Antoni Tàpies', procediment: "Obres Majors", descripcio: "Reforma de fundació d'art.", indret: 'C/ Aragó, 255', sentitInforme: 'Favorable', departament: 'Urbanisme', tecnic: 'Gonzalo Alcaraz' },
            { id: '2109/2025', peticionari: 'Pau Casals', procediment: "Comunicació prèvia tipus 1 Obra Menor", descripcio: "Aïllament acústic d'estudi.", indret: 'Av. del Cant dels Ocells, 1', sentitInforme: 'Favorable', departament: 'Urbanisme', tecnic: 'Cristina Atalaya' },
            { id: '2115/2025', peticionari: 'Montserrat Caballé', procediment: "Llicència d'obres menors", descripcio: "Tala d'un llimoner.", indret: 'C/ de l\'Òpera, 10', sentitInforme: 'Favorable', departament: 'Medi Ambient', tecnic: 'Jordi Couso' },
            { id: '2120/2025', peticionari: 'Josep Carreras', procediment: "Comunicació prèvia tipus 2 Obra Menor", descripcio: "Instal·lació de pèrgola bioclimàtica.", indret: 'C/ del Tenor, 5', sentitInforme: 'Favorable', departament: 'Urbanisme', tecnic: 'Cristina Atalaya' },
            { id: '2126/2025', peticionari: 'Ferran Adrià', procediment: "Primera Ocupació", descripcio: "Final d'obra de laboratori gastronòmic.", indret: 'Cala Montjoi, s/n', sentitInforme: 'Favorable', departament: 'Urbanisme', tecnic: 'Cristina Atalaya' },
            { id: '2131/2025', peticionari: 'Joan Roca', procediment: "Llicència d'obres menors", descripcio: "Ampliació de cuina.", indret: 'Celler de Can Roca', sentitInforme: 'Favorable condicionat (mixte)', departament: 'Urbanisme', tecnic: 'Gonzalo Alcaraz' },
            { id: '2139/2025', peticionari: 'Carme Ruscalleda', procediment: "Comunicació prèvia tipus 1 Obra Menor", descripcio: "Reforma de menjador.", indret: 'Restaurant Sant Pau', sentitInforme: 'Favorable', departament: 'Urbanisme', tecnic: 'Cristina Atalaya' },
            { id: '2145/2025', peticionari: 'Kilian Jornet', procediment: "Agrupació/Segregació de parcel·les/solars", descripcio: "Agrupació de finques rústiques.", indret: 'Muntanyes de Prades', sentitInforme: 'Favorable', departament: 'Urbanisme', tecnic: 'Gonzalo Alcaraz' },
            { id: '2150/2025', peticionari: 'Laia Sanz', procediment: "Llicència d'obres menors", descripcio: "Construcció de garatge per a motos.", indret: 'Corbera de Llobregat', sentitInforme: 'Favorable', departament: 'Urbanisme', tecnic: 'Cristina Atalaya' },
            { id: '2158/2025', peticionari: 'Marc Márquez', procediment: "Ocupació via pública", descripcio: "Contenidor de runes.", indret: 'C/ del Gas, 93', sentitInforme: 'Favorable', departament: 'Urbanisme', tecnic: 'Josep Almató' },
            { id: '2166/2025', peticionari: 'Pau Gasol', procediment: "Obres Majors", descripcio: "Construcció de pista de bàsquet.", indret: 'Sant Boi de Llobregat', sentitInforme: 'Favorable', departament: 'Urbanisme', tecnic: 'Gonzalo Alcaraz' }
        ]
    },
    {
        sessio: '10/9/2025', dataActual: '03/10/2025', hora: '9:00:00', estat: 'Finalitzada', mitja: 'Via telemàtica', numActa: 18, expedientsCount: 9,
        expedients: [
            { id: '2201/2025', peticionari: 'Gerard Piqué', procediment: "Obres Majors", descripcio: "Reforma d'oficines per a empresa.", indret: 'C/ Business, 1', sentitInforme: 'Favorable', departament: 'Urbanisme', tecnic: 'Gonzalo Alcaraz' },
            { id: '2207/2025', peticionari: 'Alexia Putellas', procediment: "Llicència d'obres menors", descripcio: "Tala de dos pins.", indret: 'C/ de la Pilota, 11', sentitInforme: 'Favorable', departament: 'Medi Ambient', tecnic: 'Claudia Carvajal' },
            { id: '2212/2025', peticionari: 'Aitana Bonmatí', procediment: "Comunicació prèvia tipus 1 Obra Menor", descripcio: "Canvi de paviment de terrassa.", indret: 'C/ del Migcamp, 14', sentitInforme: 'Favorable', departament: 'Urbanisme', tecnic: 'Cristina Atalaya' },
            { id: '2219/2025', peticionari: 'Rosalía Vila', procediment: "Primera Ocupació", descripcio: "Final d'obra d'estudi de gravació.", indret: 'Polígon industrial El Malamente', sentitInforme: 'Favorable', departament: 'Urbanisme', tecnic: 'Cristina Atalaya' },
            { id: '2225/2025', peticionari: 'C. Tangana', procediment: "Llicència d'obres menors", descripcio: "Instal·lació de rètol lluminós.", indret: 'C/ del Madrileny, 5', sentitInforme: 'Desfavorable', departament: 'Urbanisme', tecnic: 'Cristina Atalaya' },
            { id: '2230/2025', peticionari: 'Bad Gyal', procediment: "Comunicació prèvia tipus 2 Obra Menor", descripcio: "Pintura de façana amb colors vius.", indret: 'C/ del Flow, 2000', sentitInforme: 'Requeriment', departament: 'Urbanisme', tecnic: 'Cristina Atalaya' },
            { id: '2238/2025', peticionari: 'Estopa', procediment: "Ocupació via pública", descripcio: "Reserva d'espai per a concert.", indret: 'Plaça de Cornellà', sentitInforme: 'Favorable', departament: 'Urbanisme', tecnic: 'Josep Almató' },
            { id: '2245/2025', peticionari: 'Sopa de Cabra', procediment: "Obres Majors", descripcio: "Enderroc d'edifici.", indret: 'C/ del Rock Català, 9', sentitInforme: 'Favorable', departament: 'Urbanisme', tecnic: 'Gonzalo Alcaraz' },
            { id: '2250/2025', peticionari: 'Txarango', procediment: "Llicència d'obres menors", descripcio: "Construcció d'escenari fix.", indret: 'Camp de futbol vell', sentitInforme: 'Posar en consideració', departament: 'Urbanisme', tecnic: 'Gonzalo Alcaraz' }
        ]
    },
    {
        sessio: '24/9/2025', dataActual: '03/10/2025', hora: '9:00:00', estat: 'Finalitzada', mitja: 'Via telemàtica', numActa: 19, expedientsCount: 3,
        expedients: [
            { id: '2301/2025', peticionari: 'Oques Grasses', procediment: "Llicència d'obres menors", descripcio: "Tala d'una oca.", indret: 'Estany de Banyoles', sentitInforme: 'Desfavorable', departament: 'Medi Ambient', tecnic: 'Jordi Couso' },
            { id: '2305/2025', peticionari: 'The Tyets', procediment: "Comunicació prèvia tipus 1 Obra Menor", descripcio: "Insonorització de local d'assaig.", indret: 'C/ Coti x Coti, 1', sentitInforme: 'Favorable', departament: 'Urbanisme', tecnic: 'Cristina Atalaya' },
            { id: '2310/2025', peticionari: 'Stay Homas', procediment: "Primera Ocupació", descripcio: "Legalització de terrat com a zona d'actuació.", indret: 'C/ del Confinament, 19', sentitInforme: 'Favorable', departament: 'Urbanisme', tecnic: 'Cristina Atalaya' }
        ]
    }
];

export const adminData: AdminData = {
  procediments: [
    { id: 'p1', name: "Llicència d'obres menors" },
    { id: 'p2', name: "Primera Ocupació" },
    { id: 'p3', name: "Comunicació prèvia tipus 1 Obra Menor" },
    { id: 'p4', name: "Obres Majors" },
    { id: 'p5', name: "Ocupació via pública" },
    { id: 'p6', name: "Agrupació/Segregació de parcel·les/solars" },
    { id: 'p7', name: "Comunicació prèvia tipus 2 Obra Menor" },
  ],
  sentitInformes: [
    { id: 's1', name: 'Favorable' },
    { id: 's2', name: 'Desfavorable' },
    { id: 's3', name: 'Favorable condicionat (mixte)' },
    { id: 's4', name: 'Posar en consideració' },
    { id: 's5', name: 'Caducat/Arxivat' },
    { id: 's6', name: 'Requeriment' },
  ],
  tecnics: [
    { id: 't1', name: 'Claudia Carvajal', email: 'ccarvajal@tossa.cat' },
    { id: 't2', name: 'Cristina Atalaya', email: 'catalaya@tossa.cat' },
    { id: 't3', name: 'Gonzalo Alcaraz', email: 'galcaraz@tossa.cat' },
    { id: 't4', name: 'Jordi Couso', email: 'jcouso@tossa.cat' },
    { id: 't5', name: 'Josep Almató', email: 'jalmato@tossa.cat' },
  ],
  departaments: [
    { id: 'd1', name: 'Urbanisme' },
    { id: 'd2', name: 'Medi Ambient' },
    { id: 'd3', name: 'Serveis Jurídics' },
  ],
  regidors: [
      { id: 'r1', name: 'Ramon Gascons', email: 'rgascons@tossa.cat'},
      { id: 'r2', name: 'Andrea Nadal', email: 'anadal@tossa.cat'},
      { id: 'r3', name: 'Eva Barnés', email: 'ebarnes@tossa.cat'},
  ],
  users: [
    { id: 'user-master', name: 'Admin Master', email: 'admin@tossa.cat', password: 'masterpassword' },
    { id: 'user-1', name: 'Josep Almató', email: 'jalmato@tossa.cat', password: 'password123' },
  ]
};