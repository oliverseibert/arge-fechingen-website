import { generatedEnv } from './env.generated';

export const environment = {
  supabaseUrl: generatedEnv.supabaseUrl as string,
  supabaseAnonKey: generatedEnv.supabaseAnonKey as string,
  siteUrl: generatedEnv.siteUrl as string,
  contactEmail: 'info@arge-fechingen.de',
};
