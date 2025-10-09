/*
  # Actualitzar polítiques RLS per accés públic

  1. Canvis
    - Eliminar polítiques anteriors restrictives per a usuaris autenticats
    - Afegir polítiques per permetre accés públic (anon)
    - Això permet que l'aplicació funcioni sense autenticació
  
  2. Notes
    - Aquest és un canvi temporal per facilitar el desplegament inicial
    - En un entorn de producció, es recomanaria implementar autenticació adequada
*/

-- Eliminar polítiques antigues i crear noves per a commissions
DROP POLICY IF EXISTS "Users can view commissions" ON commissions;
DROP POLICY IF EXISTS "Users can insert commissions" ON commissions;
DROP POLICY IF EXISTS "Users can update commissions" ON commissions;
DROP POLICY IF EXISTS "Users can delete commissions" ON commissions;

CREATE POLICY "Public can view commissions"
  ON commissions FOR SELECT
  USING (true);

CREATE POLICY "Public can insert commissions"
  ON commissions FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Public can update commissions"
  ON commissions FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Public can delete commissions"
  ON commissions FOR DELETE
  USING (true);

-- Actualitzar polítiques per a commission_details
DROP POLICY IF EXISTS "Users can view commission_details" ON commission_details;
DROP POLICY IF EXISTS "Users can insert commission_details" ON commission_details;
DROP POLICY IF EXISTS "Users can update commission_details" ON commission_details;
DROP POLICY IF EXISTS "Users can delete commission_details" ON commission_details;

CREATE POLICY "Public can view commission_details"
  ON commission_details FOR SELECT
  USING (true);

CREATE POLICY "Public can insert commission_details"
  ON commission_details FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Public can update commission_details"
  ON commission_details FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Public can delete commission_details"
  ON commission_details FOR DELETE
  USING (true);

-- Actualitzar polítiques per a expedients
DROP POLICY IF EXISTS "Users can view expedients" ON expedients;
DROP POLICY IF EXISTS "Users can insert expedients" ON expedients;
DROP POLICY IF EXISTS "Users can update expedients" ON expedients;
DROP POLICY IF EXISTS "Users can delete expedients" ON expedients;

CREATE POLICY "Public can view expedients"
  ON expedients FOR SELECT
  USING (true);

CREATE POLICY "Public can insert expedients"
  ON expedients FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Public can update expedients"
  ON expedients FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Public can delete expedients"
  ON expedients FOR DELETE
  USING (true);

-- Actualitzar polítiques per a procediments
DROP POLICY IF EXISTS "Users can view procediments" ON procediments;
DROP POLICY IF EXISTS "Users can manage procediments" ON procediments;

CREATE POLICY "Public can view procediments"
  ON procediments FOR SELECT
  USING (true);

CREATE POLICY "Public can manage procediments"
  ON procediments FOR ALL
  USING (true)
  WITH CHECK (true);

-- Actualitzar polítiques per a sentit_informes
DROP POLICY IF EXISTS "Users can view sentit_informes" ON sentit_informes;
DROP POLICY IF EXISTS "Users can manage sentit_informes" ON sentit_informes;

CREATE POLICY "Public can view sentit_informes"
  ON sentit_informes FOR SELECT
  USING (true);

CREATE POLICY "Public can manage sentit_informes"
  ON sentit_informes FOR ALL
  USING (true)
  WITH CHECK (true);

-- Actualitzar polítiques per a tecnics
DROP POLICY IF EXISTS "Users can view tecnics" ON tecnics;
DROP POLICY IF EXISTS "Users can manage tecnics" ON tecnics;

CREATE POLICY "Public can view tecnics"
  ON tecnics FOR SELECT
  USING (true);

CREATE POLICY "Public can manage tecnics"
  ON tecnics FOR ALL
  USING (true)
  WITH CHECK (true);

-- Actualitzar polítiques per a departaments
DROP POLICY IF EXISTS "Users can view departaments" ON departaments;
DROP POLICY IF EXISTS "Users can manage departaments" ON departaments;

CREATE POLICY "Public can view departaments"
  ON departaments FOR SELECT
  USING (true);

CREATE POLICY "Public can manage departaments"
  ON departaments FOR ALL
  USING (true)
  WITH CHECK (true);

-- Actualitzar polítiques per a regidors
DROP POLICY IF EXISTS "Users can view regidors" ON regidors;
DROP POLICY IF EXISTS "Users can manage regidors" ON regidors;

CREATE POLICY "Public can view regidors"
  ON regidors FOR SELECT
  USING (true);

CREATE POLICY "Public can manage regidors"
  ON regidors FOR ALL
  USING (true)
  WITH CHECK (true);

-- Actualitzar polítiques per a users
DROP POLICY IF EXISTS "Users can view all users" ON users;
DROP POLICY IF EXISTS "Users can manage users" ON users;
DROP POLICY IF EXISTS "Users can insert users" ON users;
DROP POLICY IF EXISTS "Users can update users" ON users;
DROP POLICY IF EXISTS "Users can delete users" ON users;

CREATE POLICY "Public can view users"
  ON users FOR SELECT
  USING (true);

CREATE POLICY "Public can manage users"
  ON users FOR ALL
  USING (true)
  WITH CHECK (true);