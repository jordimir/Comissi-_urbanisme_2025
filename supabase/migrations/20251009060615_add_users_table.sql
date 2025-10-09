/*
  # Afegir taula d'usuaris

  1. Nova Taula
    - `users` - Usuaris del sistema
      - `id` (uuid, clau primària)
      - `name` (text) - Nom de l'usuari
      - `email` (text, únic) - Email de l'usuari
      - `password` (text) - Contrasenya (hash)
      - `created_at` (timestamptz) - Data de creació
      - `updated_at` (timestamptz) - Data d'actualització

  2. Seguretat
    - Activar RLS
    - Polítiques per a usuaris autenticats
*/

CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL UNIQUE,
  password text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all users"
  ON users FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert users"
  ON users FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update users"
  ON users FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Users can delete users"
  ON users FOR DELETE
  TO authenticated
  USING (true);