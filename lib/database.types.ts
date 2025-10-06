export interface Database {
  public: {
    Tables: {
      procediments: {
        Row: {
          id: string;
          name: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          created_at?: string;
        };
      };
      sentit_informes: {
        Row: {
          id: string;
          name: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          created_at?: string;
        };
      };
      departaments: {
        Row: {
          id: string;
          name: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          created_at?: string;
        };
      };
      tecnics: {
        Row: {
          id: string;
          name: string;
          email: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          email?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          created_at?: string;
        };
      };
      regidors: {
        Row: {
          id: string;
          name: string;
          email: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          email?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          created_at?: string;
        };
      };
      commissions: {
        Row: {
          id: string;
          num_acta: number;
          num_temes: number;
          dia_setmana: string;
          data_comissio: string;
          avis_email: boolean;
          data_email: string | null;
          estat: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          num_acta: number;
          num_temes?: number;
          dia_setmana?: string;
          data_comissio: string;
          avis_email?: boolean;
          data_email?: string | null;
          estat?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          num_acta?: number;
          num_temes?: number;
          dia_setmana?: string;
          data_comissio?: string;
          avis_email?: boolean;
          data_email?: string | null;
          estat?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      commission_details: {
        Row: {
          id: string;
          num_acta: number;
          sessio: string;
          data_actual: string;
          hora: string;
          estat: string;
          mitja: string;
          expedients_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          num_acta: number;
          sessio: string;
          data_actual: string;
          hora?: string;
          estat?: string;
          mitja?: string;
          expedients_count?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          num_acta?: number;
          sessio?: string;
          data_actual?: string;
          hora?: string;
          estat?: string;
          mitja?: string;
          expedients_count?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      expedients: {
        Row: {
          id: string;
          num_acta: number;
          peticionari: string;
          procediment: string;
          descripcio: string;
          indret: string;
          sentit_informe: string;
          departament: string;
          tecnic: string;
          ordre: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          num_acta: number;
          peticionari: string;
          procediment: string;
          descripcio?: string;
          indret?: string;
          sentit_informe: string;
          departament: string;
          tecnic?: string;
          ordre?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          num_acta?: number;
          peticionari?: string;
          procediment?: string;
          descripcio?: string;
          indret?: string;
          sentit_informe?: string;
          departament?: string;
          tecnic?: string;
          ordre?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}
