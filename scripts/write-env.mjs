// Writes src/environments/env.generated.ts from process.env (and .env locally)
import { existsSync, writeFileSync } from 'node:fs';

if (existsSync('.env')) process.loadEnvFile('.env');

const env = {
  supabaseUrl: process.env.SUPABASE_URL ?? '',
  supabaseAnonKey: process.env.SUPABASE_ANON_KEY ?? '',
  siteUrl: process.env.SITE_URL ?? 'https://arge-fechingen.de',
};

if (!env.supabaseUrl || !env.supabaseAnonKey) {
  console.warn(
    '[write-env] SUPABASE_URL / SUPABASE_ANON_KEY fehlen – Daten aus Supabase werden nicht geladen.',
  );
}

writeFileSync(
  'src/environments/env.generated.ts',
  `// Automatisch erzeugt von scripts/write-env.mjs – nicht einchecken\nexport const generatedEnv = ${JSON.stringify(env, null, 2)} as const;\n`,
);
