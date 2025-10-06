/*
  # Esquema Comissió Informativa d'Urbanisme
  
  ## Descripció
  Aquest migration crea l'estructura completa de base de dades per a l'aplicació de gestió
  de comissions informatives d'urbanisme de l'Ajuntament de Tossa de Mar.
  
  ## Taules Creades
  
  ### 1. Taules de Dades Mestres (Catàlegs)
  - `procediments` - Tipus de procediments urbanístics
  - `sentit_informes` - Possibles sentits dels informes
  - `departaments` - Departaments de l'ajuntament
  - `tecnics` - Tècnics responsables dels expedients
  - `regidors` - Regidors de l'ajuntament
  
  ### 2. Taules Principals
  - `commissions` - Resum de cada comissió (acta, data, estat)
  - `commission_details` - Detalls complets de cada comissió
  - `expedients` - Expedients tractats en cada comissió
  
  ### 3. Seguretat
  - Row Level Security (RLS) habilitat a totes les taules
  - Polítiques per a usuaris autenticats amb permisos de lectura i escriptura
  
  ## Notes Importants
  - Les dades mestres inclouen valors per defecte
  - Els timestamps utilitzen timestamptz per gestionar zones horàries
  - Tots els camps són NOT NULL llevat que específicament es requereixi null
*/

-- ============================================================================
-- 1. TAULES DE DADES MESTRES (CATÀLEGS)
-- ============================================================================

-- Procediments urbanístics
CREATE TABLE IF NOT EXISTS procediments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE procediments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuaris autenticats poden llegir procediments"
  ON procediments FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Usuaris autenticats poden inserir procediments"
  ON procediments FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Usuaris autenticats poden actualitzar procediments"
  ON procediments FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Usuaris autenticats poden eliminar procediments"
  ON procediments FOR DELETE
  TO authenticated
  USING (true);

-- Sentit dels informes
CREATE TABLE IF NOT EXISTS sentit_informes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE sentit_informes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuaris autenticats poden llegir sentit_informes"
  ON sentit_informes FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Usuaris autenticats poden inserir sentit_informes"
  ON sentit_informes FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Usuaris autenticats poden actualitzar sentit_informes"
  ON sentit_informes FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Usuaris autenticats poden eliminar sentit_informes"
  ON sentit_informes FOR DELETE
  TO authenticated
  USING (true);

-- Departaments
CREATE TABLE IF NOT EXISTS departaments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE departaments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuaris autenticats poden llegir departaments"
  ON departaments FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Usuaris autenticats poden inserir departaments"
  ON departaments FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Usuaris autenticats poden actualitzar departaments"
  ON departaments FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Usuaris autenticats poden eliminar departaments"
  ON departaments FOR DELETE
  TO authenticated
  USING (true);

-- Tècnics
CREATE TABLE IF NOT EXISTS tecnics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE tecnics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuaris autenticats poden llegir tecnics"
  ON tecnics FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Usuaris autenticats poden inserir tecnics"
  ON tecnics FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Usuaris autenticats poden actualitzar tecnics"
  ON tecnics FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Usuaris autenticats poden eliminar tecnics"
  ON tecnics FOR DELETE
  TO authenticated
  USING (true);

-- Regidors
CREATE TABLE IF NOT EXISTS regidors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE regidors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuaris autenticats poden llegir regidors"
  ON regidors FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Usuaris autenticats poden inserir regidors"
  ON regidors FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Usuaris autenticats poden actualitzar regidors"
  ON regidors FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Usuaris autenticats poden eliminar regidors"
  ON regidors FOR DELETE
  TO authenticated
  USING (true);

-- ============================================================================
-- 2. TAULES PRINCIPALS
-- ============================================================================

-- Comissions (resum)
CREATE TABLE IF NOT EXISTS commissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  num_acta integer NOT NULL,
  num_temes integer DEFAULT 0,
  dia_setmana text DEFAULT '',
  data_comissio text NOT NULL,
  avis_email boolean DEFAULT false,
  data_email text,
  estat text DEFAULT 'Oberta',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(num_acta, data_comissio)
);

ALTER TABLE commissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuaris autenticats poden llegir commissions"
  ON commissions FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Usuaris autenticats poden inserir commissions"
  ON commissions FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Usuaris autenticats poden actualitzar commissions"
  ON commissions FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Usuaris autenticats poden eliminar commissions"
  ON commissions FOR DELETE
  TO authenticated
  USING (true);

-- Commission details (detalls complets)
CREATE TABLE IF NOT EXISTS commission_details (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  num_acta integer NOT NULL UNIQUE,
  sessio text NOT NULL,
  data_actual text NOT NULL,
  hora text DEFAULT '9:00:00',
  estat text DEFAULT 'Oberta',
  mitja text DEFAULT 'Via telemàtica',
  expedients_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE commission_details ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuaris autenticats poden llegir commission_details"
  ON commission_details FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Usuaris autenticats poden inserir commission_details"
  ON commission_details FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Usuaris autenticats poden actualitzar commission_details"
  ON commission_details FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Usuaris autenticats poden eliminar commission_details"
  ON commission_details FOR DELETE
  TO authenticated
  USING (true);

-- Expedients
CREATE TABLE IF NOT EXISTS expedients (
  id text PRIMARY KEY,
  num_acta integer NOT NULL,
  peticionari text NOT NULL,
  procediment text NOT NULL,
  descripcio text DEFAULT '',
  indret text DEFAULT '',
  sentit_informe text NOT NULL,
  departament text NOT NULL,
  tecnic text DEFAULT '',
  ordre integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  FOREIGN KEY (num_acta) REFERENCES commission_details(num_acta) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_expedients_num_acta ON expedients(num_acta);
CREATE INDEX IF NOT EXISTS idx_expedients_ordre ON expedients(num_acta, ordre);

ALTER TABLE expedients ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuaris autenticats poden llegir expedients"
  ON expedients FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Usuaris autenticats poden inserir expedients"
  ON expedients FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Usuaris autenticats poden actualitzar expedients"
  ON expedients FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Usuaris autenticats poden eliminar expedients"
  ON expedients FOR DELETE
  TO authenticated
  USING (true);

-- ============================================================================
-- 3. TRIGGERS PER ACTUALITZAR TIMESTAMPS
-- ============================================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_commissions_updated_at') THEN
        CREATE TRIGGER update_commissions_updated_at 
        BEFORE UPDATE ON commissions 
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_commission_details_updated_at') THEN
        CREATE TRIGGER update_commission_details_updated_at 
        BEFORE UPDATE ON commission_details 
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_expedients_updated_at') THEN
        CREATE TRIGGER update_expedients_updated_at 
        BEFORE UPDATE ON expedients 
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
END $$;

-- ============================================================================
-- 4. DADES INICIALS (VALORS PER DEFECTE)
-- ============================================================================

-- Inserir procediments per defecte
INSERT INTO procediments (name) VALUES
  ('Llicència d''obres menors'),
  ('Primera Ocupació'),
  ('Comunicació prèvia tipus 1 Obra Menor'),
  ('Obres Majors'),
  ('Ocupació via pública'),
  ('Agrupació/Segregació de parcel·les/solars'),
  ('Comunicació prèvia tipus 2 Obra Menor')
ON CONFLICT (name) DO NOTHING;

-- Inserir sentits d'informe per defecte
INSERT INTO sentit_informes (name) VALUES
  ('Favorable'),
  ('Desfavorable'),
  ('Favorable condicionat (mixte)'),
  ('Posar en consideració'),
  ('Caducat/Arxivat'),
  ('Requeriment')
ON CONFLICT (name) DO NOTHING;

-- Inserir departaments per defecte
INSERT INTO departaments (name) VALUES
  ('Urbanisme'),
  ('Medi Ambient'),
  ('Serveis Jurídics')
ON CONFLICT (name) DO NOTHING;

-- Inserir tècnics per defecte
INSERT INTO tecnics (name, email) VALUES
  ('Claudia Carvajal', 'ccarvajal@tossa.cat'),
  ('Cristina Atalaya', 'catalaya@tossa.cat'),
  ('Gonzalo Alcaraz', 'galcaraz@tossa.cat'),
  ('Jordi Couso', 'jcouso@tossa.cat'),
  ('Josep Almató', 'jalmato@tossa.cat')
ON CONFLICT DO NOTHING;

-- Inserir regidors per defecte
INSERT INTO regidors (name, email) VALUES
  ('Ramon Gascons', 'rgascons@tossa.cat'),
  ('Andrea Nadal', 'anadal@tossa.cat'),
  ('Eva Barnés', 'ebarnes@tossa.cat')
ON CONFLICT DO NOTHING;