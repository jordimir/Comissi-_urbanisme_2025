# Configuració d'Autenticació

Per utilitzar l'aplicació, necessites crear usuaris a Supabase Auth.

## Opcions de configuració

### Opció 1: Crear usuaris manualment al Dashboard de Supabase

1. Ves al teu projecte de Supabase: https://jfetbzjrlpcbgmbjlhkg.supabase.co
2. Navega a **Authentication** > **Users**
3. Fes clic a **Add user** > **Create new user**
4. Crea aquests usuaris:
   - **Admin Master**
     - Email: `admin@tossa.cat`
     - Password: `masterpassword`
   - **Josep Almató**
     - Email: `jalmato@tossa.cat`
     - Password: `password123`

### Opció 2: Habilitar el registre públic (opcional)

Si vols permetre que els usuaris es registrin per ells mateixos:

1. Ves al Dashboard de Supabase
2. Navega a **Authentication** > **Providers**
3. Troba **Email** i assegura't que estigui habilitat
4. Desactiva "Confirm email" si vols que els usuaris puguin iniciar sessió immediatament

### Opció 3: Usar la consola SQL

Pots executar aquest SQL al teu projecte de Supabase per crear usuaris programàticament:

```sql
-- Nota: Supabase Auth requereix crear usuaris amb la seva API o Dashboard
-- Aquest és només un exemple de referència
```

## Credencials per defecte

Un cop configurats els usuaris, pots iniciar sessió amb:

- **Email:** admin@tossa.cat
  **Password:** masterpassword

- **Email:** jalmato@tossa.cat
  **Password:** password123

## Notes importants

- L'autenticació està completament integrada amb Supabase Auth
- Les dades dels usuaris (noms, emails) es mantenen localment a l'aplicació
- La base de dades Supabase conté totes les comissions, expedients i dades administratives
- Les dades es sincronitzen automàticament en temps real
